import { apiClient, extractData } from './api';
import type { AnalyticsData } from '../types';

export class AnalyticsService {
  /**
   * Obtener datos de analytics completos
   */
  async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/conversations/analytics?${params}`);
    return extractData<{ analytics: AnalyticsData }>(response).analytics;
  }
}

export const analyticsService = new AnalyticsService(); 