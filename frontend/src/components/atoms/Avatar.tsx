import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Función helper para obtener iniciales
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Función helper para generar color basado en string
function getColorFromString(str: string): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className
}) => {
  // Tamaños del avatar
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  // Clases base
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-medium',
    'text-white',
    'overflow-hidden',
    'flex-shrink-0',
  ];

  const avatarClasses = clsx(
    baseClasses,
    sizeClasses[size],
    className
  );

  // Si hay imagen, mostrar imagen
  if (src) {
    return (
      <div className={avatarClasses}>
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Si la imagen falla al cargar, ocultar el elemento img
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Si no hay imagen, mostrar iniciales con color generado
  const initials = getInitials(name);
  const bgColor = getColorFromString(name);

  return (
    <div className={clsx(avatarClasses, bgColor)}>
      <span>{initials}</span>
    </div>
  );
};

export default Avatar; 