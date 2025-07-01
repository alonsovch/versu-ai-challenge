import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        
        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 