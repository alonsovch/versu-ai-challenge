import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from '../components/molecules/ChatHeader';
import { MessageBubble } from '../components/molecules/MessageBubble';
import { MessageInput } from '../components/molecules/MessageInput';
import { TypingIndicator } from '../components/molecules/TypingIndicator';
import EmptyState from '../components/molecules/EmptyState';
import Spinner from '../components/atoms/Spinner';
import { 
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

export const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Verificar que tenemos conversationId
  if (!conversationId) {
    navigate('/conversations');
    return null;
  }

  const {
    conversation,
    messages,
    isLoading,
    isConnected,
    isTyping,
    error,
    sendMessage,
    handleTyping,
    messagesEndRef,
    isSending
  } = useChat({
    conversationId,
    userId: user?.id,
    autoConnect: true
  });

  // Redirigir si no hay conversación después de cargar
  useEffect(() => {
    if (!isLoading && !conversation) {
      navigate('/conversations');
    }
  }, [conversation, isLoading, navigate]);

  const handleBack = () => {
    navigate('/conversations');
  };

  const handleCloseConversation = () => {
    // TODO: Implementar cerrar conversación
    navigate('/conversations');
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  // Estados de carga y error
  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EmptyState
          icon={ExclamationTriangleIcon}
          title="Error al cargar conversación"
          description={error}
          actionLabel="Volver a conversaciones"
          onAction={handleBack}
        />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EmptyState
          icon={ChatBubbleBottomCenterTextIcon}
          title="Conversación no encontrada"
          description="La conversación que buscas no existe o no tienes acceso a ella."
          actionLabel="Volver a conversaciones"
          onAction={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <ChatHeader
        conversation={conversation}
        onBack={handleBack}
        onClose={handleCloseConversation}
        isConnected={isConnected}
        className="flex-shrink-0"
      />

      {/* Connection Status Bar */}
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <WifiIcon className="w-4 h-4" />
            <span className="text-sm">
              Conexión perdida. Reconectando...
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={ChatBubbleBottomCenterTextIcon}
                title="Inicia la conversación"
                description="Envía tu primer mensaje para comenzar a chatear con el asistente IA."
              />
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwnMessage = message.role === 'USER';
                const showAvatar = index === 0 || 
                  messages[index - 1]?.role !== message.role;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                    showAvatar={showAvatar}
                    userName={user?.name || 'Usuario'}
                    userAvatar={user?.avatar}
                  />
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <TypingIndicator
                  isAI={true}
                  className="animate-fade-in"
                />
              )}

              {/* Loading Indicator for Sending */}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-2xl">
                    <Spinner size="sm" />
                    <span className="text-sm text-gray-600">
                      Enviando mensaje...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected}
        isLoading={isSending}
        placeholder={
          !isConnected 
            ? "Conectando..." 
            : "Escribe tu mensaje..."
        }
      />
    </div>
  );
};

export default ChatPage; 