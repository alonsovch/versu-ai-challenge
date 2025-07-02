import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import MetricCard from '../components/molecules/MetricCard';
import Button from '../components/atoms/Button';
import Avatar from '../components/atoms/Avatar';
import { subDays, format } from 'date-fns';
import { 
  ChartBarIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

// Componente DateRangePicker simple
const DateRangePicker: React.FC<{
  value: { startDate: string; endDate: string };
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <input
        type="date"
        value={value.startDate}
        onChange={(e) => onChange({
          startDate: new Date(e.target.value),
          endDate: new Date(value.endDate)
        })}
        className="px-2 py-1 border border-gray-300 rounded text-xs"
      />
      <span className="text-gray-500">-</span>
      <input
        type="date"
        value={value.endDate}
        onChange={(e) => onChange({
          startDate: new Date(value.startDate),
          endDate: new Date(e.target.value)
        })}
        className="px-2 py-1 border border-gray-300 rounded text-xs"
      />
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Usar datos reales de la API
  const { data: analyticsData, isLoading, error } = useAnalytics(startDate, endDate);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error cargando analytics</p>
          <p className="text-gray-500 text-sm mt-2">Por favor, intenta nuevamente</p>
        </div>
      </div>
    );
  }

  const analytics = analyticsData || {
    ratingDistribution: [],
    channelDistribution: [],
    topWorstPrompts: []
  };

  // Calcular totales de los datos reales
  const totalConversations = analytics.ratingDistribution.reduce((total, item) => total + item.count, 0);
  const averageRating = analytics.ratingDistribution.length > 0 
    ? analytics.ratingDistribution.reduce((sum, item) => sum + (item.rating * item.count), 0) / totalConversations 
    : 0;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/conversations"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Conversaciones
                </Link>
                <Link
                  to="/analytics" 
                  className="text-blue-600 font-medium"
                >
                  Analytics
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Configuración
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3">
                <Avatar 
                  name={user?.name || 'Usuario'} 
                  src={user?.avatar}
                  size="md"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Selector de rango de fechas */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Período de Análisis
                </h3>
                <p className="text-sm text-gray-500">
                  Selecciona el rango de fechas para el análisis de datos
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <DateRangePicker
                  value={{ startDate, endDate }}
                  onChange={(newRange) => {
                    setStartDate(newRange.startDate.toISOString().split('T')[0]);
                    setEndDate(newRange.endDate.toISOString().split('T')[0]);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Header con información del período */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  📊 Mostrando datos para: {startDate} - {endDate}
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  Análisis de datos • Total: {totalConversations} conversaciones
                </p>
              </div>
              <div className="text-blue-600">
                📈
              </div>
            </div>
          </div>

          {/* Métricas resumidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Conversaciones"
              value={totalConversations.toString()}
              icon="💬"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Satisfacción Promedio"
              value={averageRating.toFixed(1)}
              icon="⭐"
              trend={{ value: 0.3, isPositive: true }}
            />
            <MetricCard
              title="Prompts con Problemas"
              value={analytics.topWorstPrompts.length.toString()}
              icon="🚨"
              trend={{ value: 2.1, isPositive: false }}
            />
            <MetricCard
              title="Canales Activos"
              value={analytics.channelDistribution.length.toString()}
              icon="📱"
            />
          </div>

          {/* Distribución de Ratings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Distribución de Ratings
              </h3>
              <div className="space-y-3">
                {analytics.ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{'⭐'.repeat(item.rating)}</span>
                      <span className="text-sm text-gray-600">({item.rating} estrellas)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por Canal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📱 Conversaciones por Canal
              </h3>
              <div className="space-y-3">
                {analytics.channelDistribution.map((item) => (
                  <div key={item.channel} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {item.channel === 'WEB' ? '🌐 Web' : 
                         item.channel === 'WHATSAPP' ? '📱 WhatsApp' : 
                         '📷 Instagram'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Worst Prompts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚨 Prompts con Peor Rendimiento
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prompt
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating Promedio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conv. Calificadas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topWorstPrompts.map((prompt, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {prompt.prompt}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {prompt.usageCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <StarIcon className="w-4 h-4 text-yellow-400" />
                              <span className={`font-medium ${prompt.averageRating < 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                                {prompt.averageRating.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {prompt.ratedConversations}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {analytics.topWorstPrompts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay datos de prompts disponibles
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Panel de insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Insights Clave
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-800">
                        Excelente satisfacción
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      El 77% de las conversaciones tienen rating 4-5 estrellas
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-blue-800">
                        Canal preferido
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Web es el canal más utilizado (50% del tráfico)
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-yellow-800">
                        Oportunidad de mejora
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Los prompts de quejas necesitan optimización
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Recomendaciones
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <ChartBarIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Optimizar tiempos
                      </p>
                      <p className="text-xs text-gray-600">
                        Reducir tiempo de respuesta en prompts de soporte
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <StarIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Mejorar prompts
                      </p>
                      <p className="text-xs text-gray-600">
                        Revisar prompts con rating inferior a 4.0
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Expandir WhatsApp
                      </p>
                      <p className="text-xs text-gray-600">
                        Potencial crecimiento en canal WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage; 