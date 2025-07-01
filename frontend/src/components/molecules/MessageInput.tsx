import React, { useState, useRef, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Button from '../atoms/Button';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  onTyping?: (isTyping: boolean) => void;
  allowAttachments?: boolean;
  onAttachment?: (file: File) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Escribe un mensaje...",
  disabled = false,
  isLoading = false,
  maxLength = 1000,
  onTyping,
  allowAttachments = false,
  onAttachment
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Límite de caracteres
    if (value.length <= maxLength) {
      setMessage(value);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }

    // Typing indicator
    if (onTyping && !disabled) {
      if (!isTyping) {
        setIsTyping(true);
        onTyping(true);
      }

      // Reset typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false);
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Stop typing indicator
      if (onTyping && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttachment) {
      onAttachment(file);
    }
    // Reset input
    e.target.value = '';
  };

  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        {allowAttachments && (
          <div className="flex-shrink-0">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleAttachment}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                disabled={disabled}
              />
              <div className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                disabled 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}>
                <PaperClipIcon className="w-5 h-5" />
              </div>
            </label>
          </div>
        )}

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={clsx(
              'w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none',
              'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'placeholder-gray-500 text-gray-900',
              'transition-all duration-200',
              disabled && 'bg-gray-50 cursor-not-allowed'
            )}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character Counter */}
          {maxLength && message.length > maxLength * 0.8 && (
            <div className={clsx(
              'absolute bottom-2 right-2 text-xs',
              message.length >= maxLength ? 'text-red-500' : 'text-gray-400'
            )}>
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleSendMessage}
            disabled={!canSend}
            loading={isLoading}
            size="sm"
            className={clsx(
              'w-10 h-10 rounded-full p-0 flex items-center justify-center',
              canSend 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Typing Indicator Helper Text */}
      {!disabled && (
        <div className="mt-2 text-xs text-gray-500">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </div>
      )}
    </div>
  );
}; 