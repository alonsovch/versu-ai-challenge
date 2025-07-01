// Tipos para autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
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

export interface Conversation {
  id: string;
  userId: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastMessage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  promptUsed?: string;
  responseTime?: number;
  createdAt: string;
}

export interface CreateConversationRequest {
  channel?: ConversationChannel;
}

export interface SendMessageRequest {
  content: string;
  promptId?: string;
}

export interface RateConversationRequest {
  rating: number;
}

// Tipos para prompts
export interface Prompt {
  id: string;
  name: string;
  description?: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  name: string;
  description?: string;
  content: string;
  isActive?: boolean;
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  content?: string;
  isActive?: boolean;
}

// Tipos para métricas y analytics
export interface DashboardMetrics {
  totalConversations: {
    today: number;
    week: number;
    month: number;
  };
  satisfactionRate: number;
  averageResponseTime: number;
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
  }>;
}

// Tipos para respuestas de API
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

// Tipos para filtros y consultas
export interface ConversationFilters {
  page?: number;
  limit?: number;
  channel?: ConversationChannel;
  status?: ConversationStatus;
  minRating?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipos para estado de aplicación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface PromptState {
  prompts: Prompt[];
  activePrompts: Prompt[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends ComponentProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Tipos para WebSocket
export interface SocketMessage {
  conversationId: string;
  message: Message;
}

export interface TypingIndicator {
  conversationId: string;
  isTyping: boolean;
}

// Tipos para navegación
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  requiresAuth?: boolean;
  exact?: boolean;
}

// Tipos de utilidad
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingAction {
  type: LoadingState;
  payload?: any;
  error?: string;
} 