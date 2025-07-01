import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptService } from '../services/promptService';
import type { 
  CreatePromptRequest, 
  UpdatePromptRequest,
  PaginationParams 
} from '../types';

// Query keys
export const promptKeys = {
  all: ['prompts'] as const,
  lists: () => [...promptKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...promptKeys.lists(), params] as const,
  active: () => [...promptKeys.all, 'active'] as const,
  details: () => [...promptKeys.all, 'detail'] as const,
  detail: (id: string) => [...promptKeys.details(), id] as const,
  stats: () => [...promptKeys.all, 'stats'] as const,
};

// Hook para obtener prompts activos
export function useActivePrompts() {
  return useQuery({
    queryKey: promptKeys.active(),
    queryFn: () => promptService.getActivePrompts(),
    staleTime: 1000 * 60 * 10, // 10 minutos (los prompts cambian poco)
  });
}

// Hook para obtener todos los prompts
export function usePrompts(params?: PaginationParams) {
  return useQuery({
    queryKey: promptKeys.list(params),
    queryFn: () => promptService.getAllPrompts(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para obtener un prompt específico
export function usePrompt(id: string) {
  return useQuery({
    queryKey: promptKeys.detail(id),
    queryFn: () => promptService.getPrompt(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para obtener estadísticas de prompts
export function usePromptStats() {
  return useQuery({
    queryKey: promptKeys.stats(),
    queryFn: () => promptService.getPromptStats(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// Hook para crear prompt
export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromptRequest) => promptService.createPrompt(data),
    onSuccess: () => {
      // Invalidar todas las listas de prompts
      queryClient.invalidateQueries({ queryKey: promptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: promptKeys.active() });
    },
  });
}

// Hook para actualizar prompt
export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromptRequest }) => 
      promptService.updatePrompt(id, data),
    onSuccess: (_, variables) => {
      // Invalidar prompt específico y listas
      queryClient.invalidateQueries({ 
        queryKey: promptKeys.detail(variables.id) 
      });
      queryClient.invalidateQueries({ queryKey: promptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: promptKeys.active() });
    },
  });
}

// Hook para eliminar prompt
export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promptService.deletePrompt(id),
    onSuccess: () => {
      // Invalidar todas las listas
      queryClient.invalidateQueries({ queryKey: promptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: promptKeys.active() });
    },
  });
}

// Hook para activar/desactivar prompt
export function useTogglePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      promptService.togglePrompt(id, isActive),
    onSuccess: (_, variables) => {
      // Invalidar prompt específico y listas
      queryClient.invalidateQueries({ 
        queryKey: promptKeys.detail(variables.id) 
      });
      queryClient.invalidateQueries({ queryKey: promptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: promptKeys.active() });
    },
  });
} 