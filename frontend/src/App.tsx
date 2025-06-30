
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Versu AI Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Sistema de monitorización de conversaciones de IA
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Inicializando aplicación...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              El backend se está configurando
            </p>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>🚀 Fase 1 completada: Setup y Arquitectura</p>
            <p>📦 Próximo: Backend Core y APIs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 