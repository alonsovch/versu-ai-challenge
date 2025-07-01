import React from 'react';
import Button from '../atoms/Button';

interface EmptyStateProps {
  icon?: string | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <div className="text-6xl mb-4">{icon}</div>;
    }
    
    const IconComponent = icon;
    return (
      <div className="text-gray-400 mb-4">
        <IconComponent className="w-16 h-16 mx-auto" />
      </div>
    );
  };

  return (
    <div className={`text-center py-12 ${className || ''}`}>
      {renderIcon()}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState; 