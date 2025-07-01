import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConversationMetrics, useConversations } from '../hooks/useConversations';
import { useActivePrompts } from '../hooks/usePrompts';
import Button from '../components/atoms/Button';
import Avatar from '../components/atoms/Avatar';
import MetricCard from '../components/molecules/MetricCard';
import ConversationCard from '../components/molecules/ConversationCard';
import EmptyState from '../components/molecules/EmptyState';
import Spinner from '../components/atoms/Spinner';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Hooks para obtener datos
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useConversationMetrics();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations({ 
    page: 1, 
    limit: 5,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  const { data: activePrompts, isLoading: promptsLoading } = useActivePrompts();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Formatear tiempo de respuesta
  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Mostrar error si hay problemas cargando métricas
  if (metricsError) {
    console.error('Error cargando métricas:', metricsError);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Versu AI Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
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

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Bienvenida */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, {user?.name}!
            </h2>
            <p className="text-gray-600">
              Aquí tienes un resumen de la actividad de tu dashboard.
            </p>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Conversaciones"
              value={metrics ? formatNumber(
                metrics.totalConversations.today + 
                metrics.totalConversations.week + 
                metrics.totalConversations.month
              ) : 0}
              icon="💬"
              loading={metricsLoading}
            />

            <MetricCard
              title="Satisfacción"
              value={metrics ? `${(metrics.satisfactionRate * 100).toFixed(1)}%` : '0%'}
              icon="⭐"
              loading={metricsLoading}
            />

            <MetricCard
              title="Tiempo Respuesta"
              value={metrics ? formatResponseTime(metrics.averageResponseTime) : '0ms'}
              icon="⚡"
              loading={metricsLoading}
            />

            <MetricCard
              title="Prompts Activos"
              value={activePrompts ? activePrompts.length : 0}
              icon="🤖"
              loading={promptsLoading}
            />
          </div>

          {/* Grid de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Conversaciones recientes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Conversaciones Recientes
                </h3>
                <Link 
                  to="/conversations"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Ver todas →
                </Link>
              </div>

              <div className="space-y-4">
                {conversationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : conversationsData?.data && conversationsData.data.length > 0 ? (
                  conversationsData.data.map((conversation) => (
                    <ConversationCard 
                      key={conversation.id} 
                      conversation={conversation}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon="💬"
                    title="No hay conversaciones"
                    description="Aún no tienes conversaciones. Crea tu primera conversación para comenzar."
                    action={{
                      label: "Nueva Conversación",
                      onClick: () => {
                        // TODO: Implementar creación de conversación
                        console.log('Crear nueva conversación');
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Métricas adicionales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Resumen Semanal
              </h3>

              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversaciones hoy</span>
                  <span className="text-sm font-medium">
                    {metrics?.totalConversations.today || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Esta semana</span>
                  <span className="text-sm font-medium">
                    {metrics?.totalConversations.week || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Este mes</span>
                  <span className="text-sm font-medium">
                    {metrics?.totalConversations.month || 0}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prompts disponibles</span>
                    <span className="text-sm font-medium">
                      {activePrompts?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estado del progreso */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  🚀 Estado del Proyecto
                </h4>
                <p className="text-sm text-blue-700">
                  <strong>Fase 4 en progreso:</strong> Dashboard funcional completándose...
                </p>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">75% completado</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 