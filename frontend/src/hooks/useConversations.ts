import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversationService';
import type { 
  ConversationFilters, 
  CreateConversationRequest,
  SendMessageRequest 
} from '../types';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters?: ConversationFilters) => [...conversationKeys.lists(), filters] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  metrics: () => [...conversationKeys.all, 'metrics'] as const,
};

// Hook para obtener conversaciones
export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: conversationKeys.list(filters),
    queryFn: () => conversationService.getConversations(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

// Hook para obtener una conversación específica
export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });
}

// Hook para obtener métricas
export function useConversationMetrics() {
  return useQuery({
    queryKey: conversationKeys.metrics(),
    queryFn: () => conversationService.getMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para crear conversación
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateConversationRequest) => 
      conversationService.createConversation(data),
    onSuccess: () => {
      // Invalidar lista de conversaciones
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.metrics() });
    },
  });
}

// Hook para enviar mensaje
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => 
      conversationService.sendMessage(conversationId, data),
    onSuccess: () => {
      // Invalidar conversación específica y métricas
      queryClient.invalidateQueries({ 
        queryKey: conversationKeys.detail(conversationId) 
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.metrics() });
    },
  });
}

// Hook para calificar conversación
export function useRateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, rating }: { conversationId: string; rating: number }) => 
      conversationService.rateConversation(conversationId, rating),
    onSuccess: (_, variables) => {
      // Invalidar conversación específica y métricas
      queryClient.invalidateQueries({ 
        queryKey: conversationKeys.detail(variables.conversationId) 
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.metrics() });
    },
  });
}

// Hook para cerrar conversación
export function useCloseConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => 
      conversationService.closeConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Invalidar conversación específica y listas
      queryClient.invalidateQueries({ 
        queryKey: conversationKeys.detail(conversationId) 
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.metrics() });
    },
  });
} 