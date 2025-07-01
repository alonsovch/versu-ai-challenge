import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConversations, useCreateConversation } from '../hooks/useConversations';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import ConversationCard from '../components/molecules/ConversationCard';
import EmptyState from '../components/molecules/EmptyState';
import Spinner from '../components/atoms/Spinner';
import { ConversationChannel, ConversationStatus } from '../types';

const ConversationsPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    channel: '' as ConversationChannel | '',
    status: '' as ConversationStatus | '',
    minRating: '',
    page: 1,
    limit: 10
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Preparar filtros para la API (convertir strings vacíos a undefined)
  const apiFilters = {
    ...filters,
    channel: filters.channel || undefined,
    status: filters.status || undefined,
    minRating: filters.minRating ? parseInt(filters.minRating) : undefined
  };

  // Hooks
  const { data: conversationsData, isLoading, error, refetch } = useConversations(apiFilters);
  const createConversationMutation = useCreateConversation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when changing filters
    }));
  };

  const handleCreateConversation = async () => {
    try {
      await createConversationMutation.mutateAsync({
        channel: ConversationChannel.WEB // Default to WEB channel
      });
      refetch();
    } catch (error) {
      console.error('Error creando conversación:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error en logout:', error);
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
                Conversaciones
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name}
              </span>
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
          
          {/* Controles superiores */}
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4 lg:mb-0">
                Gestionar Conversaciones
              </h2>
              
              <Button
                variant="primary"
                onClick={handleCreateConversation}
                loading={createConversationMutation.isPending}
              >
                + Nueva Conversación
              </Button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canal
                </label>
                <select
                  value={filters.channel}
                  onChange={(e) => handleFilterChange('channel', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los canales</option>
                  <option value="WEB">Web</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="INSTAGRAM">Instagram</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="OPEN">Abierta</option>
                  <option value="CLOSED">Cerrada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating mínimo
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Cualquier rating</option>
                  <option value="1">⭐ 1+</option>
                  <option value="2">⭐ 2+</option>
                  <option value="3">⭐ 3+</option>
                  <option value="4">⭐ 4+</option>
                  <option value="5">⭐ 5</option>
                </select>
              </div>

              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                label="Búsqueda"
              />
            </div>
          </div>

          {/* Lista de conversaciones */}
          <div>
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">
                  Error cargando conversaciones. Por favor, inténtalo de nuevo.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : conversationsData?.data && conversationsData.data.length > 0 ? (
              <>
                {/* Información de resultados */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {conversationsData.data.length} de {conversationsData.pagination.total} conversaciones
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Página:</span>
                    <span className="text-sm font-medium">
                      {conversationsData.pagination.page} de {conversationsData.pagination.totalPages}
                    </span>
                  </div>
                </div>

                {/* Grid de conversaciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {conversationsData.data.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                    />
                  ))}
                </div>

                {/* Paginación */}
                {conversationsData.pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={conversationsData.pagination.page === 1}
                      onClick={() => handleFilterChange('page', String(filters.page - 1))}
                    >
                      Anterior
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={conversationsData.pagination.page === conversationsData.pagination.totalPages}
                      onClick={() => handleFilterChange('page', String(filters.page + 1))}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon="💬"
                title="No hay conversaciones"
                description="No se encontraron conversaciones con los filtros seleccionados. Intenta ajustar los filtros o crea una nueva conversación."
                actionLabel="Nueva Conversación"
                onAction={handleCreateConversation}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConversationsPage; 