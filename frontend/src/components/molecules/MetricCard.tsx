import React from 'react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  loading,
  className
}) => {
  if (loading) {
    return (
      <div className={clsx(
        'bg-white overflow-hidden shadow rounded-lg',
        className
      )}>
        <div className="p-5">
          <div className="animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow',
      className
    )}>
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0">
              <div className="text-2xl">{icon}</div>
            </div>
          )}
          
          <div className={clsx('w-0 flex-1', icon ? 'ml-5' : '')}>
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                
                {trend && (
                  <div className={clsx(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}>
                    <span className="sr-only">
                      {trend.isPositive ? 'Increased' : 'Decreased'} by
                    </span>
                    {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 