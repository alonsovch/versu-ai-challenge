import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { getChannelLabel, getStatusLabel, formatDuration } from '../../utils';
import type { Conversation } from '../../types';
import { useState } from 'react';

interface ConversationCardProps {
  conversation: Conversation;
  className?: string;
  onRatingChange?: (conversationId: string, rating: number) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  className,
  onRatingChange
}) => {
  const [localRating, setLocalRating] = useState(conversation.rating || 0);

  // Formatear fecha de manera simple
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      });
    }
  };

  // Obtener clase CSS para el canal
  const getChannelClass = (channel: string) => {
    const classes: Record<string, string> = {
      'WEB': 'bg-blue-100 text-blue-800',
      'WHATSAPP': 'bg-green-100 text-green-800',
      'INSTAGRAM': 'bg-purple-100 text-purple-800'
    };
    return classes[channel] || 'bg-gray-100 text-gray-800';
  };

  // Obtener clase CSS para el estado
  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      'OPEN': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  // Manejar click en rating
  const handleRatingClick = (rating: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (conversation.status === 'CLOSED' && onRatingChange) {
      setLocalRating(rating);
      onRatingChange(conversation.id, rating);
    }
  };

  // Renderizar estrellas de rating
  const renderRating = (rating?: number) => {
    const canRate = conversation.status === 'CLOSED';
    const displayRating = localRating || rating || 0;
    
    return (
      <div className="flex items-center">
        <div className={clsx('flex', canRate && 'cursor-pointer')}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={clsx(
                'text-sm transition-colors',
                star <= displayRating ? 'text-yellow-400' : 'text-gray-300',
                canRate && 'hover:text-yellow-400'
              )}
              onClick={(e) => handleRatingClick(star, e)}
            >
              ★
            </span>
          ))}
        </div>
        {displayRating > 0 && (
          <span className="ml-1 text-sm text-gray-600">({displayRating})</span>
        )}
        {canRate && !displayRating && (
          <span className="ml-1 text-xs text-gray-500">Calificar</span>
        )}
      </div>
    );
  };

  return (
    <Link 
      to={`/chat/${conversation.id}`}
      className={clsx(
        'block hover:bg-gray-50 transition-colors h-full',
        className
      )}
    >
      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500 h-full min-h-[200px] flex flex-col">
        {/* Header con canal y estado */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getChannelClass(conversation.channel)
            )}>
              {getChannelLabel(conversation.channel)}
            </span>
            
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusClass(conversation.status)
            )}>
              {getStatusLabel(conversation.status)}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            {formatDate(conversation.updatedAt)}
          </div>
        </div>

        {/* Contenido principal - flexible */}
        <div className="flex-1 space-y-2">
          {/* Último mensaje */}
          {conversation.lastMessage ? (
            <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed">
              {conversation.lastMessage}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Sin mensajes aún
            </p>
          )}
          
          {/* Métricas de la conversación */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>
                💬 {conversation.messageCount || 0} mensajes
              </span>
              {conversation.duration !== undefined && (
                <span>
                  ⏱️ {formatDuration(conversation.duration * 1000)}
                </span>
              )}
            </div>
            
            {/* Rating - siempre mostrar, solo editable para cerradas */}
            {renderRating(conversation.rating)}
          </div>
        </div>

        {/* Footer con ID de conversación - siempre al final */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">
              ID: {conversation.id.substring(0, 8)}...
            </span>
            
            <span className="text-xs text-blue-600 font-medium">
              Ver conversación →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ConversationCard; 