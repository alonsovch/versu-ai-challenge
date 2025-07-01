import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';

/**
 * Combinar clases CSS condicionalmente
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatear fecha en formato legible
 */
export function formatDate(date: string | Date, formatString: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
}

/**
 * Formatear fecha relativa (hace 2 horas, etc.)
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: es 
  });
}

/**
 * Formatear tiempo en formato HH:mm
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm', { locale: es });
}

/**
 * Truncar texto con elipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Capitalizar primera letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatear rating como estrellas
 */
export function formatRating(rating: number): string {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  return `${stars} (${rating}/5)`;
}

/**
 * Formatear duración en milisegundos a texto legible
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Formatear número con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Formatear porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Generar color basado en string (para avatars)
 */
export function getColorFromString(str: string): string {
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

/**
 * Obtener iniciales del nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar contraseña (mínimo 6 caracteres)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Generar ID único simple
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copiar texto al clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error copiando al clipboard:', err);
    return false;
  }
}

/**
 * Descargar texto como archivo
 */
export function downloadAsFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Obtener canal de conversación en formato legible
 */
export function getChannelLabel(channel: string): string {
  const labels: Record<string, string> = {
    'WEB': 'Web',
    'WHATSAPP': 'WhatsApp',
    'INSTAGRAM': 'Instagram'
  };
  
  return labels[channel] || channel;
}

/**
 * Obtener estado de conversación en formato legible
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'OPEN': 'Abierta',
    'CLOSED': 'Cerrada'
  };
  
  return labels[status] || status;
}

/**
 * Obtener clase CSS para el estado
 */
export function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'OPEN': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  };
  
  return classes[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Obtener clase CSS para el canal
 */
export function getChannelClass(channel: string): string {
  const classes: Record<string, string> = {
    'WEB': 'bg-blue-100 text-blue-800',
    'WHATSAPP': 'bg-green-100 text-green-800',
    'INSTAGRAM': 'bg-purple-100 text-purple-800'
  };
  
  return classes[channel] || 'bg-gray-100 text-gray-800';
} 