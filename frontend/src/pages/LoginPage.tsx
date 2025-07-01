import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, createDemoUser, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      // El error se maneja en el context
      console.error('Error en login:', error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await createDemoUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando usuario demo:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Versu AI Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              error={errors.email}
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              error={errors.password}
            />
          </div>

          {authError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {authError}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleDemoLogin}
              loading={isLoading}
              className="w-full"
            >
              Probar con Usuario Demo
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate aquí
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 