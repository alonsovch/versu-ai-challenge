import { apiClient, extractData } from './api';
import type { 
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  RateConversationRequest,
  ConversationFilters,
  PaginatedResponse,
  DashboardMetrics
} from '../types';

export class ConversationService {

  /**
   * Crear nueva conversación
   */
  async createConversation(data?: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post('/conversations', data || {});
    return extractData<{ conversation: Conversation }>(response).conversation;
  }

  /**
   * Obtener conversaciones del usuario con filtros
   */
  async getConversations(filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/conversations?${params.toString()}`);
    return extractData<PaginatedResponse<Conversation>>(response);
  }

  /**
   * Obtener conversación específica por ID
   */
  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get(`/conversations/${id}`);
    return extractData<{ conversation: Conversation }>(response).conversation;
  }

  /**
   * Enviar mensaje en una conversación
   */
  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<{
    userMessage: Message;
    aiMessage: Message;
  }> {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, data);
    return extractData<{ userMessage: Message; aiMessage: Message }>(response);
  }

  /**
   * Calificar conversación
   */
  async rateConversation(conversationId: string, rating: number): Promise<Conversation> {
    const data: RateConversationRequest = { rating };
    const response = await apiClient.post(`/conversations/${conversationId}/rate`, data);
    return extractData<{ conversation: Conversation }>(response).conversation;
  }

  /**
   * Cerrar conversación
   */
  async closeConversation(conversationId: string): Promise<Conversation> {
    const response = await apiClient.post(`/conversations/${conversationId}/close`);
    return extractData<{ conversation: Conversation }>(response).conversation;
  }

  /**
   * Obtener métricas del dashboard del usuario
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/conversations/metrics');
    return extractData<{ metrics: DashboardMetrics }>(response).metrics;
  }

  /**
   * Obtener métricas globales (solo para administradores)
   */
  async getGlobalMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/conversations/metrics/global');
    return extractData<{ metrics: DashboardMetrics }>(response).metrics;
  }

  /**
   * Obtener conversaciones recientes (helper)
   */
  async getRecentConversations(limit: number = 5): Promise<Conversation[]> {
    const result = await this.getConversations({ 
      page: 1, 
      limit,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    });
    return result.data;
  }

  /**
   * Buscar conversaciones por texto (si se implementa en el futuro)
   */
  async searchConversations(query: string, filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> {
    const params = new URLSearchParams({ search: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/conversations/search?${params.toString()}`);
    return extractData<PaginatedResponse<Conversation>>(response);
  }
}

// Exportar instancia singleton
export const conversationService = new ConversationService(); 