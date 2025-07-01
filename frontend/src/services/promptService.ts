import { apiClient, extractData } from './api';
import type { 
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PaginatedResponse,
  PaginationParams
} from '../types';

export class PromptService {

  /**
   * Obtener prompts activos
   */
  async getActivePrompts(): Promise<Prompt[]> {
    const response = await apiClient.get('/prompts/active');
    return extractData<{ prompts: Prompt[] }>(response).prompts;
  }

  /**
   * Obtener todos los prompts con paginación
   */
  async getAllPrompts(params?: PaginationParams): Promise<PaginatedResponse<Prompt>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/prompts?${searchParams.toString()}`);
    return extractData<PaginatedResponse<Prompt>>(response);
  }

  /**
   * Obtener prompt por ID
   */
  async getPrompt(id: string): Promise<Prompt> {
    const response = await apiClient.get(`/prompts/${id}`);
    return extractData<{ prompt: Prompt }>(response).prompt;
  }

  /**
   * Crear nuevo prompt
   */
  async createPrompt(data: CreatePromptRequest): Promise<Prompt> {
    const response = await apiClient.post('/prompts', data);
    return extractData<{ prompt: Prompt }>(response).prompt;
  }

  /**
   * Actualizar prompt existente
   */
  async updatePrompt(id: string, data: UpdatePromptRequest): Promise<Prompt> {
    const response = await apiClient.put(`/prompts/${id}`, data);
    return extractData<{ prompt: Prompt }>(response).prompt;
  }

  /**
   * Eliminar prompt
   */
  async deletePrompt(id: string): Promise<void> {
    await apiClient.delete(`/prompts/${id}`);
  }

  /**
   * Activar/desactivar prompt
   */
  async togglePrompt(id: string, isActive: boolean): Promise<Prompt> {
    const response = await apiClient.patch(`/prompts/${id}/toggle`, { isActive });
    return extractData<{ prompt: Prompt }>(response).prompt;
  }

  /**
   * Obtener estadísticas de uso de prompts
   */
  async getPromptStats(): Promise<Array<{ promptName: string; usageCount: number }>> {
    const response = await apiClient.get('/prompts/stats');
    return extractData<{ stats: Array<{ promptName: string; usageCount: number }> }>(response).stats;
  }

  /**
   * Duplicar prompt (helper)
   */
  async duplicatePrompt(id: string, newName: string): Promise<Prompt> {
    const originalPrompt = await this.getPrompt(id);
    
    const duplicatedData: CreatePromptRequest = {
      name: newName,
      description: originalPrompt.description ? `${originalPrompt.description} (Copia)` : undefined,
      content: originalPrompt.content,
      isActive: false // Los duplicados empiezan inactivos
    };
    
    return this.createPrompt(duplicatedData);
  }

  /**
   * Buscar prompts por nombre o contenido
   */
  async searchPrompts(query: string, params?: PaginationParams): Promise<PaginatedResponse<Prompt>> {
    const searchParams = new URLSearchParams({ search: query });
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/prompts/search?${searchParams.toString()}`);
    return extractData<PaginatedResponse<Prompt>>(response);
  }
}

// Exportar instancia singleton
export const promptService = new PromptService(); 