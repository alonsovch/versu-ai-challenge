import axios from 'axios';
import prisma from '../utils/database';
import { PromptConfig, MessageRole } from '../types';

export class AIService {
  private readonly openaiApiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo'; // Usando el modelo gratuito/más barato
  }

  /**
   * Generar respuesta de IA
   */
  async generateResponse(
    userMessage: string, 
    conversationId: string,
    promptId?: string
  ): Promise<{ content: string; promptUsed: string; responseTime: number }> {
    const startTime = Date.now();

    try {
      // Obtener prompt activo o usar el específico
      let prompt: PromptConfig | null = null;
      
      if (promptId) {
        prompt = await prisma.prompt.findUnique({
          where: { id: promptId }
        });
      } else {
        prompt = await prisma.prompt.findFirst({
          where: { isActive: true }
        });
      }

      if (!prompt) {
        throw new Error('No hay prompts configurados');
      }

      // Obtener historial de conversación para contexto
      const recentMessages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: 10, // Últimos 10 mensajes para contexto
      });

      // Construir mensajes para OpenAI
      const messages = [
        {
          role: 'system',
          content: prompt.content
        },
        // Agregar mensajes recientes en orden cronológico
        ...recentMessages.reverse().map(msg => ({
          role: msg.role === MessageRole.USER ? 'user' : 'assistant',
          content: msg.content
        })),
        // Agregar el mensaje actual del usuario
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Llamar a OpenAI API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          frequency_penalty: 0.5,
          presence_penalty: 0.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 segundos timeout
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
      const responseTime = Date.now() - startTime;

      return {
        content: aiResponse.trim(),
        promptUsed: prompt.name,
        responseTime
      };

    } catch (error) {
      console.error('Error generando respuesta de IA:', error);
      
      const responseTime = Date.now() - startTime;
      
      // Respuesta de fallback
      return {
        content: 'Lo siento, estoy experimentando dificultades técnicas. Por favor intenta de nuevo más tarde.',
        promptUsed: 'fallback',
        responseTime
      };
    }
  }

  /**
   * Obtener configuración actual de prompts
   */
  async getPrompts(): Promise<PromptConfig[]> {
    return await prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Obtener prompt activo
   */
  async getActivePrompt(): Promise<PromptConfig | null> {
    return await prisma.prompt.findFirst({
      where: { isActive: true }
    });
  }

  /**
   * Activar un prompt específico
   */
  async activatePrompt(promptId: string): Promise<PromptConfig> {
    // Desactivar todos los prompts
    await prisma.prompt.updateMany({
      data: { isActive: false }
    });

    // Activar el prompt específico
    const prompt = await prisma.prompt.update({
      where: { id: promptId },
      data: { isActive: true }
    });

    return prompt;
  }

  /**
   * Crear nuevo prompt
   */
  async createPrompt(promptData: Omit<PromptConfig, 'id'>): Promise<PromptConfig> {
    // Si es el primer prompt o se marca como activo, desactivar otros
    if (promptData.isActive) {
      await prisma.prompt.updateMany({
        data: { isActive: false }
      });
    }

    const prompt = await prisma.prompt.create({
      data: promptData
    });

    return prompt;
  }

  /**
   * Actualizar prompt existente
   */
  async updatePrompt(promptId: string, updateData: Partial<Omit<PromptConfig, 'id'>>): Promise<PromptConfig> {
    // Si se está activando este prompt, desactivar otros
    if (updateData.isActive) {
      await prisma.prompt.updateMany({
        where: { id: { not: promptId } },
        data: { isActive: false }
      });
    }

    const prompt = await prisma.prompt.update({
      where: { id: promptId },
      data: updateData
    });

    return prompt;
  }

  /**
   * Eliminar prompt
   */
  async deletePrompt(promptId: string): Promise<void> {
    await prisma.prompt.delete({
      where: { id: promptId }
    });
  }

  /**
   * Verificar configuración de API
   */
  async validateConfiguration(): Promise<{ isValid: boolean; message: string }> {
    if (!this.openaiApiKey) {
      return {
        isValid: false,
        message: 'API Key de OpenAI no configurada'
      };
    }

    try {
      // Test básico de la API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {
        isValid: true,
        message: 'Configuración válida'
      };
    } catch (error: any) {
      return {
        isValid: false,
        message: `Error de configuración: ${error.response?.data?.error?.message || error.message}`
      };
    }
  }
} 