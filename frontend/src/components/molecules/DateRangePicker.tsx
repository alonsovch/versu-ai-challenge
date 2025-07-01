import React, { useState } from 'react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';
import { CalendarIcon } from '@heroicons/react/24/outline';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

// Rangos predefinidos
const PRESET_RANGES: DateRange[] = [
  {
    startDate: new Date(),
    endDate: new Date(),
    label: 'Hoy'
  },
  {
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    label: 'Últimos 7 días'
  },
  {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Últimos 30 días'
  },
  {
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: new Date(),
    label: 'Esta semana'
  },
  {
    startDate: startOfMonth(new Date()),
    endDate: new Date(),
    label: 'Este mes'
  },
  {
    startDate: startOfYear(new Date()),
    endDate: new Date(),
    label: 'Este año'
  }
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const formatDateRange = (range: DateRange) => {
    if (range.label !== 'Personalizado') {
      return range.label;
    }
    
    const start = format(range.startDate, 'dd/MM/yyyy', { locale: es });
    const end = format(range.endDate, 'dd/MM/yyyy', { locale: es });
    return `${start} - ${end}`;
  };

  const handlePresetSelect = (preset: DateRange) => {
    onChange(preset);
    setIsOpen(false);
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      
      if (startDate <= endDate) {
        onChange({
          startDate,
          endDate,
          label: 'Personalizado'
        });
        setIsOpen(false);
      }
    }
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm',
          'bg-white text-sm font-medium text-gray-700',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'transition-colors duration-200'
        )}
      >
        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
        {formatDateRange(value)}
        <svg 
          className="ml-2 -mr-1 w-4 h-4" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-4">
            {/* Rangos Predefinidos */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Rangos rápidos
              </h4>
              <div className="space-y-1">
                {PRESET_RANGES.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className={clsx(
                      'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                      'hover:bg-gray-100',
                      value.label === preset.label
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Rango Personalizado */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Rango personalizado
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomDateChange}
                  disabled={!customStartDate || !customEndDate}
                  className={clsx(
                    'w-full mt-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    customStartDate && customEndDate
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Aplicar rango personalizado
                </button>
              </div>
            </div>

            {/* Cerrar */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 