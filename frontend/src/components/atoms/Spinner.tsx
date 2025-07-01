import React from 'react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={clsx('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size], className)}>
    </div>
  );
};

export default Spinner; 