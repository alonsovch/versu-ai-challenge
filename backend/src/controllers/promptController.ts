import { Response } from 'express';
import { PromptService } from '../services/promptService';
import { AuthRequest, ApiResponse, PromptConfig } from '../types';

export class PromptController {
  private promptService: PromptService;

  constructor() {
    this.promptService = new PromptService();
  }

  /**
   * Obtener todos los prompts activos
   * GET /api/prompts/active
   */
  getActivePrompts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const prompts = await this.promptService.getActivePrompts();

      res.status(200).json({
        success: true,
        data: { prompts },
        message: 'Prompts activos obtenidos exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo prompts activos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener todos los prompts con paginación
   * GET /api/prompts
   */
  getAllPrompts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.promptService.getAllPrompts(
        Number(page), 
        Number(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
        message: 'Prompts obtenidos exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo prompts:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Obtener prompt por ID
   * GET /api/prompts/:id
   */
  getPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const prompt = await this.promptService.getPromptById(id);

      if (!prompt) {
        res.status(404).json({
          success: false,
          error: 'Prompt no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: { prompt },
        message: 'Prompt obtenido exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo prompt:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Crear nuevo prompt
   * POST /api/prompts
   */
  createPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const promptData: PromptConfig = req.body;

      const prompt = await this.promptService.createPrompt(promptData);

      res.status(201).json({
        success: true,
        data: { prompt },
        message: 'Prompt creado exitosamente'
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error creando prompt:', error);

      if (error.message === 'Ya existe un prompt con ese nombre') {
        res.status(409).json({
          success: false,
          error: 'Conflicto',
          message: error.message
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
   * Actualizar prompt existente
   * PUT /api/prompts/:id
   */
  updatePrompt = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: Partial<PromptConfig> = req.body;

      const prompt = await this.promptService.updatePrompt(id, updateData);

      res.status(200).json({
        success: true,
        data: { prompt },
        message: 'Prompt actualizado exitosamente'
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error actualizando prompt:', error);

      if (error.message === 'Prompt no encontrado') {
        res.status(404).json({
          success: false,
          error: 'Prompt no encontrado'
        } as ApiResponse);
        return;
      }

      if (error.message === 'Ya existe un prompt con ese nombre') {
        res.status(409).json({
          success: false,
          error: 'Conflicto',
          message: error.message
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
   * Eliminar prompt
   * DELETE /api/prompts/:id
   */
  deletePrompt = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const deleted = await this.promptService.deletePrompt(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Prompt no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Prompt eliminado exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error eliminando prompt:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Activar/desactivar prompt
   * PATCH /api/prompts/:id/toggle
   */
  togglePrompt = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const prompt = await this.promptService.togglePromptStatus(id, isActive);

      res.status(200).json({
        success: true,
        data: { prompt },
        message: `Prompt ${isActive ? 'activado' : 'desactivado'} exitosamente`
      } as ApiResponse);

    } catch (error: any) {
      console.error('Error cambiando estado del prompt:', error);

      if (error.message === 'Prompt no encontrado') {
        res.status(404).json({
          success: false,
          error: 'Prompt no encontrado'
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
   * Obtener estadísticas de uso de prompts
   * GET /api/prompts/stats
   */
  getPromptStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.promptService.getPromptUsageStats();

      res.status(200).json({
        success: true,
        data: { stats },
        message: 'Estadísticas obtenidas exitosamente'
      } as ApiResponse);

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };
} 