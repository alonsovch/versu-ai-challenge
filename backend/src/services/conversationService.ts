import prisma from '../utils/database';
import { AIService } from './aiService';
import { 
  ConversationDto, 
  MessageDto, 
  ConversationChannel, 
  ConversationStatus, 
  MessageRole, 
  CreateConversationDto,
  PaginatedResponse,
  DashboardMetrics,
  AnalyticsData
} from '../types';

export class ConversationService {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Crear nueva conversación
   */
  async createConversation(userId: string, data: CreateConversationDto = {}): Promise<ConversationDto> {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        channel: data.channel || ConversationChannel.WEB,
        status: ConversationStatus.OPEN,
      },
      include: {
        messages: true,
      }
    });

    return this.toConversationDto(conversation);
  }

  /**
   * Obtener conversaciones del usuario con paginación y filtros
   */
  async getUserConversations(
    userId: string,
    filters: {
      page?: number;
      limit?: number;
      channel?: ConversationChannel;
      status?: ConversationStatus;
      minRating?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<PaginatedResponse<ConversationDto>> {
    const {
      page = 1,
      limit = 10,
      channel,
      status,
      minRating,
      startDate,
      endDate
    } = filters;

    const skip = (page - 1) * limit;

    // Construir filtros dinámicos
    const where: any = { userId };

    if (channel) where.channel = channel;
    if (status) where.status = status;
    if (minRating) where.rating = { gte: minRating };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Obtener total para paginación
    const total = await prisma.conversation.count({ where });

    // Obtener conversaciones
    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }, // Ordenar para calcular duración
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    });

    const data = conversations.map(conv => ({
      ...this.toConversationDto(conv),
      messageCount: conv._count.messages,
      lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1]?.content : undefined,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Obtener conversación por ID
   */
  async getConversationById(conversationId: string, userId?: string): Promise<ConversationDto | null> {
    const where: any = { id: conversationId };
    if (userId) where.userId = userId;

    const conversation = await prisma.conversation.findFirst({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    if (!conversation) return null;

    return this.toConversationDto(conversation);
  }

  /**
   * Enviar mensaje y generar respuesta de IA
   */
  async sendMessage(
    conversationId: string,
    content: string,
    userId: string,
    promptId?: string
  ): Promise<{ userMessage: MessageDto; aiMessage: MessageDto }> {
    // Verificar que la conversación pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    // Crear mensaje del usuario
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        role: MessageRole.USER,
      }
    });

    try {
      // Generar respuesta de IA
      const aiResponse = await this.aiService.generateResponse(
        content,
        conversationId,
        promptId
      );

      // Crear mensaje de IA
      const aiMessage = await prisma.message.create({
        data: {
          conversationId,
          content: aiResponse.content,
          role: MessageRole.AI,
          promptUsed: aiResponse.promptUsed,
          responseTime: aiResponse.responseTime,
        }
      });

      // Actualizar timestamp de la conversación
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      return {
        userMessage: this.toMessageDto(userMessage),
        aiMessage: this.toMessageDto(aiMessage),
      };

    } catch (error) {
      console.error('Error generando respuesta de IA:', error);
      
      // Crear mensaje de error de IA
      const aiMessage = await prisma.message.create({
        data: {
          conversationId,
          content: 'Lo siento, estoy experimentando dificultades técnicas. Por favor intenta de nuevo más tarde.',
          role: MessageRole.AI,
          promptUsed: 'error-fallback',
          responseTime: 0,
        }
      });

      return {
        userMessage: this.toMessageDto(userMessage),
        aiMessage: this.toMessageDto(aiMessage),
      };
    }
  }

  /**
   * Calificar conversación
   */
  async rateConversation(conversationId: string, rating: number, userId: string): Promise<ConversationDto> {
    // Verificar que la conversación pertenece al usuario
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        rating,
        status: ConversationStatus.CLOSED // Auto-cerrar al calificar
      },
      include: {
        messages: true
      }
    });

    return this.toConversationDto(updatedConversation);
  }

  /**
   * Cerrar conversación
   */
  async closeConversation(conversationId: string, userId: string): Promise<ConversationDto> {
    const conversation = await this.getConversationById(conversationId, userId);
    
    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        status: ConversationStatus.CLOSED,
        updatedAt: new Date()
      }
    });

    return this.toConversationDto(updatedConversation);
  }

  /**
   * Obtener métricas del dashboard
   */
  async getDashboardMetrics(userId?: string): Promise<DashboardMetrics> {
    const where = userId ? { userId } : {};
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total de conversaciones
    const [totalToday, totalWeek, totalMonth] = await Promise.all([
      prisma.conversation.count({
        where: { ...where, createdAt: { gte: todayStart } }
      }),
      prisma.conversation.count({
        where: { ...where, createdAt: { gte: weekStart } }
      }),
      prisma.conversation.count({
        where: { ...where, createdAt: { gte: monthStart } }
      }),
    ]);

    // Conversaciones satisfactorias (rating >= 4)
    const satisfactoryConversations = await prisma.conversation.count({
      where: { ...where, rating: { gte: 4 } }
    });

    const totalRatedConversations = await prisma.conversation.count({
      where: { ...where, rating: { not: null } }
    });

    const satisfactionRate = totalRatedConversations > 0 
      ? (satisfactoryConversations / totalRatedConversations) * 100 
      : 0;

    // Tiempo promedio de respuesta
    const avgResponseTime = await prisma.message.aggregate({
      where: {
        role: MessageRole.AI,
        responseTime: { not: null },
        conversation: where
      },
      _avg: { responseTime: true }
    });

    // Tendencia de conversaciones (últimos 7 días)
    const conversationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

      const count = await prisma.conversation.count({
        where: {
          ...where,
          createdAt: { gte: dateStart, lt: dateEnd }
        }
      });

      conversationTrend.push({
        date: dateStart.toISOString().split('T')[0],
        count
      });
    }

    return {
      totalConversations: {
        today: totalToday,
        week: totalWeek,
        month: totalMonth,
      },
      satisfactionRate: Math.round(satisfactionRate * 100) / 100,
      averageResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      conversationTrend,
    };
  }

  /**
   * Obtener datos de analytics completos
   */
  async getAnalyticsData(userId?: string, startDate?: Date, endDate?: Date): Promise<AnalyticsData> {
    const where: any = userId ? { userId } : {};
    
    // Agregar filtros de fecha si se proporcionan
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Distribución de ratings
    const ratingStats = await prisma.conversation.groupBy({
      by: ['rating'],
      where: { ...where, rating: { not: null } },
      _count: { rating: true }
    });

    const totalRated = ratingStats.reduce((sum, stat) => sum + stat._count.rating, 0);
    const ratingDistribution = ratingStats.map(stat => ({
      rating: stat.rating!,
      count: stat._count.rating,
      percentage: totalRated > 0 ? (stat._count.rating / totalRated) * 100 : 0
    }));

    // Distribución por canal
    const channelStats = await prisma.conversation.groupBy({
      by: ['channel'],
      where,
      _count: { channel: true }
    });

    const totalConversations = channelStats.reduce((sum, stat) => sum + stat._count.channel, 0);
    const channelDistribution = channelStats.map(stat => ({
      channel: stat.channel as ConversationChannel,
      count: stat._count.channel,
      percentage: totalConversations > 0 ? (stat._count.channel / totalConversations) * 100 : 0
    }));

    // Top 5 prompts con PEOR rating (como pide el README)
    const promptStats = await prisma.message.groupBy({
      by: ['promptUsed'],
      where: {
        role: MessageRole.AI,
        promptUsed: { not: null },
        conversation: where
      },
      _count: { promptUsed: true }
    });

    // Obtener ratings promedio por prompt
    const promptRatings = await Promise.all(
      promptStats.map(async (stat) => {
        const conversationsWithPrompt = await prisma.conversation.aggregate({
          where: {
            ...where,
            rating: { not: null },
            messages: {
              some: {
                promptUsed: stat.promptUsed,
                role: MessageRole.AI
              }
            }
          },
          _avg: { rating: true },
          _count: { rating: true }
        });

        return {
          prompt: stat.promptUsed!,
          averageRating: conversationsWithPrompt._avg.rating || 0,
          usageCount: stat._count.promptUsed,
          ratedConversations: conversationsWithPrompt._count.rating
        };
      })
    );

    // Filtrar solo prompts con conversaciones calificadas y ordenar por PEOR rating
    const topWorstPrompts = promptRatings
      .filter(p => p.ratedConversations > 0)
      .sort((a, b) => a.averageRating - b.averageRating) // Ascendente = peor primero
      .slice(0, 5)
      .map(p => ({
        prompt: p.prompt,
        averageRating: p.averageRating,
        usageCount: p.usageCount,
        ratedConversations: p.ratedConversations
      }));

    return {
      ratingDistribution,
      channelDistribution,
      topWorstPrompts
    };
  }

  /**
   * Obtener mensajes de una conversación específica
   */
  async getConversationMessages(conversationId: string, userId: string): Promise<MessageDto[]> {
    // Verificar que el usuario tenga acceso a la conversación
    const conversation = await this.getConversationById(conversationId, userId);
    
    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    return messages.map(message => ({
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      role: message.role as MessageRole, // Cast explícito para evitar conflictos de tipos
      promptUsed: message.promptUsed || undefined,
      responseTime: message.responseTime || undefined,
      createdAt: message.createdAt.toISOString()
    }));
  }

  /**
   * Convertir entity de Prisma a DTO
   */
  private toConversationDto(conversation: any): ConversationDto {
    // Calcular duración de la conversación
    let duration: number | undefined;
    
    if (conversation.messages && conversation.messages.length > 0) {
      // Si hay mensajes, duración = tiempo entre primer y último mensaje
      const firstMessage = conversation.messages[0];
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      
      const startTime = new Date(firstMessage.createdAt).getTime();
      const endTime = new Date(lastMessage.createdAt).getTime();
      duration = Math.floor((endTime - startTime) / 1000); // En segundos
    } else {
      // Si no hay mensajes, duración = tiempo desde creación hasta ahora (si está abierta) o última actualización
      const startTime = new Date(conversation.createdAt).getTime();
      const endTime = conversation.status === 'CLOSED' 
        ? new Date(conversation.updatedAt).getTime()
        : Date.now();
      duration = Math.floor((endTime - startTime) / 1000); // En segundos
    }

    return {
      id: conversation.id,
      userId: conversation.userId,
      channel: conversation.channel,
      status: conversation.status,
      rating: conversation.rating,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      duration: Math.max(duration, 0), // Asegurar que no sea negativo
    };
  }

  /**
   * Convertir message entity a DTO
   */
  private toMessageDto(message: any): MessageDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      role: message.role,
      promptUsed: message.promptUsed,
      responseTime: message.responseTime,
      createdAt: message.createdAt.toISOString(),
    };
  }
} 