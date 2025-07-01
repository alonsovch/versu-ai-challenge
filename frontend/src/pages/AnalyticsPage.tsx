import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChartCard } from '../components/molecules/ChartCard';
import { DateRangePicker, DateRange } from '../components/molecules/DateRangePicker';
import { StatsTable, StatsTableColumn } from '../components/molecules/StatsTable';
import MetricCard from '../components/molecules/MetricCard';
import Button from '../components/atoms/Button';
import { subDays } from 'date-fns';
import { 
  ChartBarIcon,
  StarIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

// Datos de demostración para gráficos
const generateRatingDistribution = () => ({
  labels: ['⭐ 1', '⭐⭐ 2', '⭐⭐⭐ 3', '⭐⭐⭐⭐ 4', '⭐⭐⭐⭐⭐ 5'],
  datasets: [{
    label: 'Conversaciones',
    data: [5, 12, 45, 78, 124],
    backgroundColor: [
      'rgba(239, 68, 68, 0.8)',   // red-500
      'rgba(245, 101, 101, 0.8)', // red-400
      'rgba(251, 191, 36, 0.8)',  // amber-400
      'rgba(34, 197, 94, 0.8)',   // green-500
      'rgba(22, 163, 74, 0.8)',   // green-600
    ],
    borderColor: [
      'rgba(239, 68, 68, 1)',
      'rgba(245, 101, 101, 1)',
      'rgba(251, 191, 36, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(22, 163, 74, 1)',
    ],
    borderWidth: 1
  }]
});

const generateChannelDistribution = () => ({
  labels: ['Web', 'WhatsApp', 'Instagram'],
  datasets: [{
    label: 'Conversaciones por Canal',
    data: [156, 89, 67],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)', // blue-500
      'rgba(34, 197, 94, 0.8)',  // green-500
      'rgba(168, 85, 247, 0.8)', // purple-500
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(168, 85, 247, 1)',
    ],
    borderWidth: 2
  }]
});

const generateTrendData = () => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  });

  return {
    labels: last30Days,
    datasets: [
      {
        label: 'Conversaciones',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 5),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Satisfacción Promedio',
        data: Array.from({ length: 30 }, () => (Math.random() * 1.5 + 3.5).toFixed(1)),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
};

// Datos para la tabla de prompts
const generatePromptStats = () => [
  {
    id: 1,
    name: 'Saludo inicial amigable',
    usageCount: 245,
    averageRating: 4.7,
    responseTime: 850,
    category: 'Saludos'
  },
  {
    id: 2,
    name: 'Resolución de dudas técnicas',
    usageCount: 189,
    averageRating: 4.5,
    responseTime: 1200,
    category: 'Soporte'
  },
  {
    id: 3,
    name: 'Información de productos',
    usageCount: 167,
    averageRating: 4.3,
    responseTime: 950,
    category: 'Ventas'
  },
  {
    id: 4,
    name: 'Despedida profesional',
    usageCount: 156,
    averageRating: 4.6,
    responseTime: 680,
    category: 'Despedidas'
  },
  {
    id: 5,
    name: 'Manejo de quejas',
    usageCount: 89,
    averageRating: 3.8,
    responseTime: 1450,
    category: 'Soporte'
  },
  {
    id: 6,
    name: 'Información general',
    usageCount: 78,
    averageRating: 4.1,
    responseTime: 1100,
    category: 'Información'
  }
];

const AnalyticsPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Estado para filtros de fecha
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Últimos 30 días'
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Datos procesados según el rango de fecha
  const analyticsData = useMemo(() => {
    // En una implementación real, estos datos se obtendrían del backend
    // filtrados por el rango de fechas
    return {
      ratingDistribution: generateRatingDistribution(),
      channelDistribution: generateChannelDistribution(),
      trendData: generateTrendData(),
      promptStats: generatePromptStats()
    };
  }, [dateRange]);

  // Configuración de columnas para la tabla de prompts
  const promptColumns: StatsTableColumn[] = [
    {
      key: 'name',
      title: 'Prompt',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.category}</div>
        </div>
      )
    },
    {
      key: 'usageCount',
      title: 'Usos',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'averageRating',
      title: 'Rating Promedio',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="flex items-center justify-center space-x-1">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'responseTime',
      title: 'Tiempo Resp.',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className={`font-medium ${value > 1000 ? 'text-red-600' : value > 800 ? 'text-yellow-600' : 'text-green-600'}`}>
          {value}ms
        </span>
      )
    }
  ];

  // Opciones para gráfico de tendencias
  const trendOptions = {
    responsive: true,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Conversaciones'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Rating Promedio'
        },
        min: 0,
        max: 5,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
                ← Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
              
              <span className="text-sm text-gray-600">
                {user?.name}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Métricas resumidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Conversaciones"
              value="312"
              icon="💬"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Satisfacción Promedio"
              value="4.2"
              icon="⭐"
              trend={{ value: 0.3, isPositive: true }}
            />
            <MetricCard
              title="Tiempo Respuesta"
              value="950ms"
              icon="⚡"
              trend={{ value: 5.2, isPositive: false }}
            />
            <MetricCard
              title="Prompts Activos"
              value="28"
              icon="🤖"
            />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard
              title="Distribución de Ratings"
              subtitle="Calificaciones de conversaciones en el período seleccionado"
              type="bar"
              data={analyticsData.ratingDistribution}
              height={300}
            />

            <ChartCard
              title="Conversaciones por Canal"
              subtitle="Distribución de conversaciones por canal de comunicación"
              type="doughnut"
              data={analyticsData.channelDistribution}
              height={300}
            />
          </div>

          {/* Gráfico de tendencias */}
          <div className="mb-8">
            <ChartCard
              title="Tendencias Temporales"
              subtitle="Evolución de conversaciones y satisfacción en el tiempo"
              type="line"
              data={analyticsData.trendData}
              options={trendOptions}
              height={400}
            />
          </div>

          {/* Tabla de rendimiento de prompts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StatsTable
                title="Rendimiento de Prompts"
                subtitle="Análisis detallado del rendimiento de cada prompt"
                columns={promptColumns}
                data={analyticsData.promptStats}
                maxHeight={500}
              />
            </div>

            {/* Panel de insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Insights Clave
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-800">
                        Excelente satisfacción
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      El 77% de las conversaciones tienen rating 4-5 estrellas
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-blue-800">
                        Canal preferido
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Web es el canal más utilizado (50% del tráfico)
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-yellow-800">
                        Oportunidad de mejora
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Los prompts de quejas necesitan optimización
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Recomendaciones
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <ChartBarIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Optimizar tiempos
                      </p>
                      <p className="text-xs text-gray-600">
                        Reducir tiempo de respuesta en prompts de soporte
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <StarIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Mejorar prompts
                      </p>
                      <p className="text-xs text-gray-600">
                        Revisar prompts con rating inferior a 4.0
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Expandir WhatsApp
                      </p>
                      <p className="text-xs text-gray-600">
                        Potencial crecimiento en canal WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage; 