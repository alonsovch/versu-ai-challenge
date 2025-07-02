import { Request } from 'express';

// Tipos para autenticación
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Tipos para conversaciones
export enum ConversationChannel {
  WEB = 'WEB',
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM'
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export enum MessageRole {
  USER = 'USER',
  AI = 'AI'
}

// DTOs para requests
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateConversationDto {
  channel?: ConversationChannel;
}

export interface SendMessageDto {
  content: string;
  conversationId: string;
}

export interface RateConversationDto {
  conversationId: string;
  rating: number; // 1-5
}

// DTOs para responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ConversationDto {
  id: string;
  userId: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  duration?: number; // Duración en segundos
  messageCount?: number;
  lastMessage?: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  promptUsed?: string;
  responseTime?: number;
  createdAt: string;
}

export interface DashboardMetrics {
  totalConversations: {
    today: number;
    week: number;
    month: number;
  };
  satisfactionRate: number; // Porcentaje de conversaciones con rating >= 4
  averageResponseTime: number; // En milisegundos
  conversationTrend: Array<{
    date: string;
    count: number;
  }>;
}

export interface AnalyticsData {
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  channelDistribution: Array<{
    channel: ConversationChannel;
    count: number;
    percentage: number;
  }>;
  topWorstPrompts: Array<{
    prompt: string;
    averageRating: number;
    usageCount: number;
    ratedConversations: number;
  }>;
}

// Configuración de AI
export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface PromptDto {
  id: string;
  name: string;
  description: string | null;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptConfig {
  name: string;
  description?: string | null;
  content: string;
  isActive?: boolean;
}

// WebSocket events
export interface SocketEvents {
  // Client to server
  'join_conversation': { conversationId: string };
  'leave_conversation': { conversationId: string };
  'send_message': { conversationId: string; content: string };
  'typing_start': { conversationId: string };
  'typing_stop': { conversationId: string };

  // Server to client
  'new_message': MessageDto;
  'typing_indicator': { conversationId: string; isTyping: boolean };
  'conversation_updated': ConversationDto;
  'error': { message: string };
} 