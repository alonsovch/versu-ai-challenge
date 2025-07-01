import React, { useState } from 'react';
import clsx from 'clsx';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Spinner from '../atoms/Spinner';

export interface StatsTableColumn {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface StatsTableRow {
  id: string | number;
  [key: string]: any;
}

interface StatsTableProps {
  title: string;
  subtitle?: string;
  columns: StatsTableColumn[];
  data: StatsTableRow[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
  maxHeight?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export const StatsTable: React.FC<StatsTableProps> = ({
  title,
  subtitle,
  columns,
  data,
  isLoading = false,
  error = null,
  emptyMessage = 'No hay datos disponibles',
  className,
  maxHeight = 400
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Función para ordenar datos
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      // Ciclar entre: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return null;

    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  const renderCellContent = (column: StatsTableColumn, row: StatsTableRow) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    return value;
  };

  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-sm border border-gray-200',
      className
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ maxHeight: `${maxHeight}px` }} className="overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-gray-500">
                Cargando datos...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-sm text-red-600 font-medium">
                Error al cargar datos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {error}
              </p>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                {emptyMessage}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={clsx(
                      'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          {renderSortIcon(column.key)}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={clsx(
                    'hover:bg-gray-50 transition-colors',
                    index < 3 && 'bg-yellow-50' // Destacar top 3
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={clsx(
                        'px-6 py-4 whitespace-nowrap text-sm',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        !column.align && 'text-left'
                      )}
                    >
                      {/* Agregar badge para top 3 */}
                      {index < 3 && column.key === columns[0].key && (
                        <div className="flex items-center space-x-2">
                          <span className={clsx(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            index === 0 && 'bg-yellow-100 text-yellow-800',
                            index === 1 && 'bg-gray-100 text-gray-800',
                            index === 2 && 'bg-orange-100 text-orange-800'
                          )}>
                            #{index + 1}
                          </span>
                          <span>{renderCellContent(column, row)}</span>
                        </div>
                      )}
                      {(index >= 3 || column.key !== columns[0].key) && (
                        renderCellContent(column, row)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer con información */}
      {!isLoading && !error && sortedData.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Mostrando {sortedData.length} resultado{sortedData.length !== 1 ? 's' : ''}
            {sortColumn && (
              <span className="ml-2">
                • Ordenado por {columns.find(col => col.key === sortColumn)?.title} 
                ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}; 