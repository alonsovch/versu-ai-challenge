import prisma from '../utils/database';
import { PromptDto, PromptConfig, PaginatedResponse } from '../types';

export class PromptService {

  /**
   * Obtener todos los prompts activos
   */
  async getActivePrompts(): Promise<PromptDto[]> {
    const prompts = await prisma.prompt.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return prompts.map(this.toPromptDto);
  }

  /**
   * Obtener todos los prompts con paginación
   */
  async getAllPrompts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<PromptDto>> {
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.prompt.count()
    ]);

    return {
      data: prompts.map(this.toPromptDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Obtener prompt por ID
   */
  async getPromptById(id: string): Promise<PromptDto | null> {
    const prompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!prompt) return null;

    return this.toPromptDto(prompt);
  }

  /**
   * Obtener prompt por nombre
   */
  async getPromptByName(name: string): Promise<PromptDto | null> {
    const prompt = await prisma.prompt.findUnique({
      where: { name }
    });

    if (!prompt) return null;

    return this.toPromptDto(prompt);
  }

  /**
   * Crear nuevo prompt
   */
  async createPrompt(data: PromptConfig): Promise<PromptDto> {
    // Verificar que el nombre sea único
    const existingPrompt = await prisma.prompt.findUnique({
      where: { name: data.name }
    });

    if (existingPrompt) {
      throw new Error('Ya existe un prompt con ese nombre');
    }

    const prompt = await prisma.prompt.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        isActive: data.isActive || false,
      }
    });

    return this.toPromptDto(prompt);
  }

  /**
   * Actualizar prompt existente
   */
  async updatePrompt(id: string, data: Partial<PromptConfig>): Promise<PromptDto> {
    // Verificar que el prompt existe
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!existingPrompt) {
      throw new Error('Prompt no encontrado');
    }

    // Si se está cambiando el nombre, verificar que sea único
    if (data.name && data.name !== existingPrompt.name) {
      const nameExists = await prisma.prompt.findUnique({
        where: { name: data.name }
      });

      if (nameExists) {
        throw new Error('Ya existe un prompt con ese nombre');
      }
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.content && { content: data.content }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedAt: new Date(),
      }
    });

    return this.toPromptDto(updatedPrompt);
  }

  /**
   * Eliminar prompt
   */
  async deletePrompt(id: string): Promise<boolean> {
    try {
      await prisma.prompt.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Activar/desactivar prompt
   */
  async togglePromptStatus(id: string, isActive: boolean): Promise<PromptDto> {
    const prompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!prompt) {
      throw new Error('Prompt no encontrado');
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: { 
        isActive,
        updatedAt: new Date()
      }
    });

    return this.toPromptDto(updatedPrompt);
  }

  /**
   * Obtener prompt por defecto (sistema)
   */
  async getDefaultPrompt(): Promise<PromptDto | null> {
    const defaultPrompt = await prisma.prompt.findFirst({
      where: { 
        name: 'default-assistant',
        isActive: true 
      }
    });

    if (!defaultPrompt) return null;

    return this.toPromptDto(defaultPrompt);
  }

  /**
   * Obtener estadísticas de uso de prompts
   */
  async getPromptUsageStats(): Promise<{ promptName: string; usageCount: number }[]> {
    // En una implementación real, tendríamos una tabla de usage_logs
    // Por ahora, simulamos con datos de los mensajes
    const usageStats = await prisma.message.groupBy({
      by: ['promptUsed'],
      where: {
        promptUsed: { not: null },
        role: 'AI'
      },
      _count: {
        promptUsed: true
      },
      orderBy: {
        _count: {
          promptUsed: 'desc'
        }
      },
      take: 10
    });

    return usageStats.map(stat => ({
      promptName: stat.promptUsed || 'unknown',
      usageCount: stat._count.promptUsed
    }));
  }

  /**
   * Convertir entity a DTO
   */
  private toPromptDto(prompt: any): PromptDto {
    return {
      id: prompt.id,
      name: prompt.name,
      description: prompt.description,
      content: prompt.content,
      isActive: prompt.isActive,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString(),
    };
  }
} 