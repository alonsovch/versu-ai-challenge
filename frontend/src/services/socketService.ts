import { io, Socket } from 'socket.io-client';
import type { Message, TypingIndicator, Conversation } from '../types';

// URL del servidor Socket.IO
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  /**
   * Conectar al servidor Socket.IO
   */
  connect(token?: string): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado a Socket.IO');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.IO');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
      this.isConnected = false;
    });
  }

  /**
   * Desconectar del servidor
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Verificar si está conectado
   */
  connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // --- Eventos de Conversaciones ---

  /**
   * Unirse a una conversación específica
   */
  joinConversation(conversationId: string): void {
    if (this.socket && this.connected()) {
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  /**
   * Salir de una conversación
   */
  leaveConversation(conversationId: string): void {
    if (this.socket && this.connected()) {
      this.socket.emit('leave_conversation', { conversationId });
    }
  }

  /**
   * Escuchar nuevos mensajes
   */
  onNewMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  /**
   * Dejar de escuchar nuevos mensajes
   */
  offNewMessage(): void {
    if (this.socket) {
      this.socket.off('new_message');
    }
  }

  // --- Eventos de Typing Indicators ---

  /**
   * Indicar que el usuario está escribiendo
   */
  startTyping(conversationId: string): void {
    if (this.socket && this.connected()) {
      this.socket.emit('typing_start', { conversationId });
    }
  }

  /**
   * Indicar que el usuario dejó de escribir
   */
  stopTyping(conversationId: string): void {
    if (this.socket && this.connected()) {
      this.socket.emit('typing_stop', { conversationId });
    }
  }

  /**
   * Escuchar indicadores de escritura
   */
  onTypingIndicator(callback: (data: TypingIndicator) => void): void {
    if (this.socket) {
      this.socket.on('typing_indicator', callback);
    }
  }

  /**
   * Dejar de escuchar indicadores de escritura
   */
  offTypingIndicator(): void {
    if (this.socket) {
      this.socket.off('typing_indicator');
    }
  }

  // --- Eventos de Conversaciones ---

  /**
   * Escuchar actualizaciones de conversaciones
   */
  onConversationUpdated(callback: (conversation: Conversation) => void): void {
    if (this.socket) {
      this.socket.on('conversation_updated', callback);
    }
  }

  /**
   * Dejar de escuchar actualizaciones de conversaciones
   */
  offConversationUpdated(): void {
    if (this.socket) {
      this.socket.off('conversation_updated');
    }
  }

  // --- Eventos de Error ---

  /**
   * Escuchar errores del servidor
   */
  onError(callback: (error: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  /**
   * Dejar de escuchar errores
   */
  offError(): void {
    if (this.socket) {
      this.socket.off('error');
    }
  }

  // --- Métodos de utilidad ---

  /**
   * Limpiar todos los listeners
   */
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Obtener ID del socket actual
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Enviar ping al servidor para verificar conectividad
   */
  ping(callback?: (latency: number) => void): void {
    if (this.socket && this.connected()) {
      const start = Date.now();
      this.socket.emit('ping', () => {
        const latency = Date.now() - start;
        callback?.(latency);
      });
    }
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();

// Auto-conectar si hay token en localStorage
const token = localStorage.getItem('authToken');
if (token) {
  socketService.connect(token);
} 