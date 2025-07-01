import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Message } from '../../types';
import { MessageRole } from '../../types';
import Avatar from '../atoms/Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage?: boolean;
  showAvatar?: boolean;
  userName?: string;
  userAvatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage = false,
  showAvatar = true,
  userName = 'Usuario',
  userAvatar
}) => {
  const isAI = message.role === MessageRole.AI;

  return (
    <div className={clsx(
      'flex w-full',
      isOwnMessage ? 'justify-end' : 'justify-start'
    )}>
      <div className={clsx(
        'flex max-w-[70%] space-x-3',
        isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      )}>
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            {isAI ? (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
            ) : (
              <Avatar 
                name={userName} 
                size="sm"
                src={userAvatar}
              />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={clsx(
          'flex flex-col space-y-1',
          isOwnMessage ? 'items-end' : 'items-start'
        )}>
          {/* Author Name */}
          {!isOwnMessage && showAvatar && (
            <span className="text-xs text-gray-500 px-1">
              {isAI ? 'Asistente IA' : userName}
            </span>
          )}

          {/* Message Bubble */}
          <div className={clsx(
            'relative px-4 py-2 rounded-2xl max-w-full',
            // Colors
            isOwnMessage 
              ? 'bg-blue-600 text-white' 
              : isAI 
                ? 'bg-gray-100 text-gray-900 border border-gray-200'
                : 'bg-white text-gray-900 border border-gray-200',
            // Shadows
            'shadow-sm'
          )}>
            {/* Message Text */}
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </div>

            {/* Timestamp and Response Time */}
            <div className="flex items-center justify-between mt-1">
              <div className={clsx(
                'text-xs opacity-70',
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              )}>
                {format(new Date(message.createdAt), 'HH:mm', { locale: es })}
              </div>
              
              {/* Response Time for AI messages */}
              {isAI && message.responseTime && (
                <div className="text-xs text-gray-400 ml-2">
                  {message.responseTime}ms
                </div>
              )}
            </div>

            {/* Prompt Used */}
            {message.promptUsed && (
              <div className="text-xs text-gray-400 mt-1 italic">
                Prompt: {message.promptUsed}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 