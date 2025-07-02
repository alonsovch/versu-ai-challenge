import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  data: (startDate?: string, endDate?: string) => [...analyticsKeys.all, 'data', startDate, endDate] as const,
};

// Hook para obtener analytics
export function useAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.data(startDate, endDate),
    queryFn: () => analyticsService.getAnalytics(startDate, endDate),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
} 