import React from 'react';
import clsx from 'clsx';
import Avatar from '../atoms/Avatar';

interface TypingIndicatorProps {
  users?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  isAI?: boolean;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users = [],
  isAI = false,
  className
}) => {
  if (!isAI && users.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (isAI) {
      return 'El asistente IA está escribiendo...';
    }

    if (users.length === 1) {
      return `${users[0].name} está escribiendo...`;
    }

    if (users.length === 2) {
      return `${users[0].name} y ${users[1].name} están escribiendo...`;
    }

    if (users.length > 2) {
      return `${users[0].name} y ${users.length - 1} más están escribiendo...`;
    }

    return '';
  };

  return (
    <div className={clsx(
      'flex items-center space-x-3 px-4 py-2',
      className
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
        ) : users.length === 1 ? (
          <Avatar 
            name={users[0].name} 
            size="sm"
            src={users[0].avatar}
          />
        ) : (
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user, index) => (
              <Avatar 
                key={user.id}
                name={user.name} 
                size="sm"
                src={user.avatar}
                className={clsx(
                  'border-2 border-white',
                  index > 0 && 'ml-0'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Typing Content */}
      <div className="flex items-center space-x-2">
        {/* Typing Text */}
        <span className="text-sm text-gray-500 italic">
          {getTypingText()}
        </span>

        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div 
            className={clsx(
              'w-2 h-2 rounded-full bg-gray-400 animate-pulse',
              'animation-delay-0'
            )}
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className={clsx(
              'w-2 h-2 rounded-full bg-gray-400 animate-pulse',
              'animation-delay-150'
            )}
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className={clsx(
              'w-2 h-2 rounded-full bg-gray-400 animate-pulse',
              'animation-delay-300'
            )}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}; 