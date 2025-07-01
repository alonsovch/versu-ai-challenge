import { Response } from 'express';
import { ConversationService } from '../services/conversationService';
import { AuthRequest, ApiResponse, CreateConversationDto } from '../types';

export class ConversationController {
  private conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  /**
   * Crear nueva conversación
   * POST /api/conversations
   */
  createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: CreateConversationDto = req.body;

      const conversation = await this.conversationService.createConversation(userId, data);

      res.status(201).json({
        success: true,
        data: { conversation },
        message: 'Conversación creada exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error creando conversación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener conversaciones del usuario
   * GET /api/conversations
   */
  getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const filters = req.query;

      const result = await this.conversationService.getUserConversations(userId, filters);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Conversaciones obtenidas exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener conversación específica por ID
   * GET /api/conversations/:id
   */
  getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const conversation = await this.conversationService.getConversationById(id, userId);

      if (!conversation) {
        res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: { conversation },
        message: 'Conversación obtenida exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Enviar mensaje en una conversación
   * POST /api/conversations/:id/messages
   */
  sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id: conversationId } = req.params;
      const { content, promptId } = req.body;
      const userId = req.user!.id;

      const result = await this.conversationService.sendMessage(
        conversationId,
        content,
        userId,
        promptId
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'Mensaje enviado exitosamente'
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error enviando mensaje:', error);

      if (error.message === 'Conversación no encontrada') {
        res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Calificar conversación
   * POST /api/conversations/:id/rate
   */
  rateConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id: conversationId } = req.params;
      const { rating } = req.body;
      const userId = req.user!.id;

      const conversation = await this.conversationService.rateConversation(
        conversationId,
        rating,
        userId
      );

      res.status(200).json({
        success: true,
        data: { conversation },
        message: 'Conversación calificada exitosamente'
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error calificando conversación:', error);

      if (error.message === 'Conversación no encontrada') {
        res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Cerrar conversación
   * POST /api/conversations/:id/close
   */
  closeConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id: conversationId } = req.params;
      const userId = req.user!.id;

      const conversation = await this.conversationService.closeConversation(
        conversationId,
        userId
      );

      res.status(200).json({
        success: true,
        data: { conversation },
        message: 'Conversación cerrada exitosamente'
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error cerrando conversación:', error);

      if (error.message === 'Conversación no encontrada') {
        res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener métricas del dashboard
   * GET /api/conversations/metrics
   */
  getMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;

      const metrics = await this.conversationService.getDashboardMetrics(userId);

      res.status(200).json({
        success: true,
        data: { metrics },
        message: 'Métricas obtenidas exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener métricas globales (solo para administradores)
   * GET /api/conversations/metrics/global
   */
  getGlobalMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // En una implementación real, verificaríamos permisos de admin aquí
      const metrics = await this.conversationService.getDashboardMetrics();

      res.status(200).json({
        success: true,
        data: { metrics },
        message: 'Métricas globales obtenidas exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo métricas globales:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };
} 