import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { InputProps } from '../../types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  name,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  label,
  className,
  onChange,
  ...props
}, ref) => {
  // Clases base del input
  const baseClasses = [
    'block',
    'w-full',
    'px-3',
    'py-2',
    'border',
    'rounded-md',
    'shadow-sm',
    'placeholder-gray-400',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'transition-colors',
    'duration-200',
    'disabled:bg-gray-50',
    'disabled:cursor-not-allowed',
  ];

  // Clases condicionales basadas en el estado
  const conditionalClasses = clsx({
    // Estado normal
    'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !error,
    // Estado de error
    'border-red-300 focus:border-red-500 focus:ring-red-500': error,
    // Estado disabled
    'bg-gray-50 text-gray-500': disabled,
  });

  // Combinar todas las clases
  const inputClasses = clsx(baseClasses, conditionalClasses, className);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onChange={onChange}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 