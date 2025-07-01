import React from 'react';
import clsx from 'clsx';
import { 
  ArrowLeftIcon, 
  EllipsisVerticalIcon,
  SignalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Conversation } from '../../types';
import { ConversationStatus, ConversationChannel } from '../../types';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onClose?: () => void;
  onSettings?: () => void;
  isConnected?: boolean;
  participantCount?: number;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  onClose,
  onSettings,
  isConnected = true,
  participantCount = 1,
  className
}) => {
  const getStatusColor = () => {
    switch (conversation.status) {
      case ConversationStatus.OPEN:
        return 'bg-green-500';
      case ConversationStatus.CLOSED:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (conversation.status) {
      case ConversationStatus.OPEN:
        return 'Abierta';
      case ConversationStatus.CLOSED:
        return 'Cerrada';
      default:
        return conversation.status;
    }
  };

  const getChannelDisplayName = () => {
    switch (conversation.channel) {
      case ConversationChannel.WEB:
        return 'Web';
      case ConversationChannel.WHATSAPP:
        return 'WhatsApp';
      case ConversationChannel.INSTAGRAM:
        return 'Instagram';
      default:
        return conversation.channel;
    }
  };

  return (
    <div className={clsx(
      'flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200',
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        {/* Conversation Info */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <Avatar 
              name={conversation.userId || 'Usuario'} 
              size="md"
            />
            {/* Connection Status */}
            <div className={clsx(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            )} />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversación #{conversation.id.slice(-6)}
              </h2>
              <div className={clsx(
                'px-2 py-0.5 rounded-full text-xs font-medium text-white',
                getStatusColor()
              )}>
                {getStatusText()}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>Canal: {getChannelDisplayName()}</span>
              
              {participantCount > 1 && (
                <>
                  <span>•</span>
                  <span>{participantCount} participantes</span>
                </>
              )}
              
              {conversation.updatedAt && (
                <>
                  <span>•</span>
                  <span>
                    Última actividad: {new Date(conversation.updatedAt).toLocaleString('es-ES')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Connection Indicator */}
        <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100">
          <SignalIcon className={clsx(
            'w-4 h-4',
            isConnected ? 'text-green-500' : 'text-gray-400'
          )} />
          <span className="text-xs text-gray-600">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {/* Settings Menu */}
        {onSettings && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSettings}
            className="p-2"
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </Button>
        )}

        {/* Close Button */}
        {onClose && (
          <Button
            variant="danger"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}; 