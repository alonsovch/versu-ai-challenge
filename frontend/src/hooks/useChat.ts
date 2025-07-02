import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversationService';
import { socketService } from '../services/socketService';
import type { Message, SendMessageRequest } from '../types';
import { MessageRole } from '../types';

interface UseChatOptions {
  conversationId: string;
  userId?: string;
  autoConnect?: boolean;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
  isTyping: boolean;
  typingUsers: string[];
  error: string | null;
}

export const useChat = (options: UseChatOptions) => {
  const { conversationId, userId, autoConnect = true } = options;
  const queryClient = useQueryClient();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isConnected: false,
    isTyping: false,
    typingUsers: [],
    error: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para scroll automático (definir antes de usar)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  // Query para obtener conversación existente
  const { data: conversation, isLoading: conversationLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationService.getConversation(conversationId),
    enabled: !!conversationId
  });

  // Query para obtener mensajes existentes
  const { data: existingMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 1, // 1 minuto
  });

  // Cargar mensajes existentes cuando se obtienen
  useEffect(() => {
    if (existingMessages && existingMessages.length > 0) {
      setChatState(prev => ({
        ...prev,
        messages: existingMessages
      }));
      scrollToBottom();
    }
  }, [existingMessages, scrollToBottom]);

  // Mutación para enviar mensajes
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: SendMessageRequest) => 
      conversationService.sendMessage(conversationId, messageData),
    onMutate: async (messageData) => {
      // Optimistic update - agregar mensaje inmediatamente
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        content: messageData.content,
        role: MessageRole.USER,
        createdAt: new Date().toISOString()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage],
        isLoading: true
      }));

      // Scroll to bottom
      scrollToBottom();

      return { tempMessage };
    },
    onSuccess: (response, _variables, context) => {
      // Reemplazar mensaje temporal y agregar respuesta de IA
      setChatState(prev => ({
        ...prev,
        messages: [
          ...prev.messages.filter(msg => msg.id !== context?.tempMessage.id),
          response.userMessage,
          response.aiMessage
        ],
        isLoading: false,
        error: null
      }));

      // Scroll to bottom
      scrollToBottom();

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
    onError: (error, _variables, context) => {
      // Remover mensaje temporal en caso de error
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== context?.tempMessage.id),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al enviar mensaje'
      }));
    }
  });

  // Enviar mensaje
  const sendMessage = useCallback((content: string, promptId?: string) => {
    if (!content.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({ 
      content: content.trim(), 
      promptId 
    });
  }, [sendMessageMutation]);

  // Manejar typing indicator
  const handleTyping = useCallback((isTyping: boolean) => {
    if (socketService.connected() && userId) {
      if (isTyping) {
        socketService.startTyping(conversationId);
      } else {
        socketService.stopTyping(conversationId);
      }
    }
  }, [conversationId, userId]);

  // Conectar/desconectar WebSocket
  const connect = useCallback(() => {
    if (!socketService.connected()) {
      socketService.connect();
    }
    socketService.joinConversation(conversationId);
    
    setChatState(prev => ({ ...prev, isConnected: true }));
  }, [conversationId]);

  const disconnect = useCallback(() => {
    if (socketService.connected()) {
      socketService.leaveConversation(conversationId);
    }
    setChatState(prev => ({ 
      ...prev, 
      isConnected: false,
      typingUsers: []
    }));
  }, [conversationId]);

  // Listeners de WebSocket
  useEffect(() => {
    if (!autoConnect) return;

    // Conectar automáticamente
    connect();

    // Listener para nuevos mensajes
    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, message]
        }));
        scrollToBottom();
      }
    };

    // Listener para typing indicators
    const handleTypingIndicator = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) {
        setChatState(prev => ({
          ...prev,
          isTyping: data.isTyping
        }));
      }
    };

    // Registrar listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onTypingIndicator(handleTypingIndicator);

    // Cleanup
    return () => {
      disconnect();
      socketService.offNewMessage();
      socketService.offTypingIndicator();
    };
  }, [conversationId, userId, autoConnect, connect, disconnect, scrollToBottom]);

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, scrollToBottom]);

  return {
    // Estado
    conversation,
    messages: chatState.messages,
    isLoading: conversationLoading || messagesLoading || chatState.isLoading,
    isConnected: chatState.isConnected,
    isTyping: chatState.isTyping,
    error: chatState.error,
    
    // Acciones
    sendMessage,
    handleTyping,
    connect,
    disconnect,
    
    // Refs
    messagesEndRef,
    
    // Estados de mutación
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error
  };
}; 