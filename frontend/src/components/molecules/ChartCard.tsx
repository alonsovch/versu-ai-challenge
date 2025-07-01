import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import clsx from 'clsx';
import Spinner from '../atoms/Spinner';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'line' | 'doughnut';
  data: ChartData<any>;
  options?: ChartOptions<any>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  type,
  data,
  options,
  isLoading = false,
  error = null,
  className,
  height = 300
}) => {
  // Opciones por defecto
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, // Usamos el título del componente
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    } : undefined,
  };

  // Combinar opciones
  const finalOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={finalOptions} />;
      case 'line':
        return <Line data={data} options={finalOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={finalOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
      className
    )}>
      {/* Header */}
      <div className="mb-4">
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
      <div style={{ height: `${height}px` }} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-gray-500">
                Cargando gráfico...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 text-4xl mb-2">📊</div>
              <p className="text-sm text-red-600 font-medium">
                Error al cargar datos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {error}
              </p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
}; 