import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivePrompts } from '../hooks/usePrompts';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Avatar from '../components/atoms/Avatar';
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  CogIcon,
  PaintBrushIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'profile',
    title: 'Perfil de Usuario',
    icon: UserIcon,
    description: 'Gestiona tu información personal y avatar'
  },
  {
    id: 'account',
    title: 'Configuración de Cuenta',
    icon: KeyIcon,
    description: 'Seguridad, contraseñas y autenticación'
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: BellIcon,
    description: 'Personaliza tus preferencias de notificaciones'
  },
  {
    id: 'ai',
    title: 'Configuración de IA',
    icon: CogIcon,
    description: 'Ajusta el comportamiento de la inteligencia artificial'
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    icon: PaintBrushIcon,
    description: 'Tema, idioma y personalización de la interfaz'
  },
  {
    id: 'data',
    title: 'Gestión de Datos',
    icon: TrashIcon,
    description: 'Exportar, importar y eliminar datos'
  }
];

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    theme: 'light',
    language: 'es',
    emailNotifications: true,
    pushNotifications: true,
    aiResponseSpeed: 'balanced',
    aiPersonality: 'professional',
    autoSave: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // TODO: Implementar actualización de perfil
    console.log('Saving profile:', { name: formData.name, email: formData.email });
  };

  const handleChangePassword = () => {
    // TODO: Implementar cambio de contraseña
    console.log('Changing password');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // TODO: Implementar eliminación de cuenta
      console.log('Deleting account');
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar 
          src={user?.avatar} 
          name={user?.name || 'Usuario'} 
          size="xl"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Foto de Perfil</h3>
          <p className="text-sm text-gray-500">Actualiza tu avatar para personalizar tu experiencia</p>
          <div className="mt-2 space-x-3">
            <Button variant="secondary" size="sm">Cambiar Foto</Button>
            <Button variant="secondary" size="sm">Eliminar</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre Completo"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ingresa tu nombre completo"
        />
        <Input
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile}>
          <CheckIcon className="h-4 w-4 mr-2" />
          Guardar Perfil
        </Button>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Contraseña Actual"
              type={showPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nueva Contraseña"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Nueva contraseña"
            />
            <Input
              label="Confirmar Contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirma la nueva contraseña"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button onClick={handleChangePassword} variant="secondary">
            <KeyIcon className="h-4 w-4 mr-2" />
            Actualizar Contraseña
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Peligro</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <TrashIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">Eliminar Cuenta</h4>
              <p className="text-sm text-red-600 mt-1">
                Una vez eliminada, esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
              </p>
              <Button 
                variant="danger" 
                size="sm" 
                className="mt-3"
                onClick={handleDeleteAccount}
              >
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
            <p className="text-sm text-gray-500">Recibe actualizaciones por correo electrónico</p>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onClick={() => handleInputChange('emailNotifications', !formData.emailNotifications)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notificaciones Push</h4>
            <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real</p>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onClick={() => handleInputChange('pushNotifications', !formData.pushNotifications)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAISection = () => {
    const { data: promptsData, isLoading: promptsLoading } = useActivePrompts();
    const prompts = promptsData || [];

    return (
      <div className="space-y-6">
        {/* Configuración de prompts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Prompts Disponibles
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona qué prompt debe usar la IA para responder. Cada prompt tiene una personalidad diferente.
          </p>
          
          {promptsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Cargando prompts...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    prompt.isActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    // TODO: Implementar cambio de prompt activo
                    console.log('Seleccionando prompt:', prompt.id);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          prompt.isActive ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <h4 className="font-medium text-gray-900">
                          {prompt.name}
                        </h4>
                        {prompt.isActive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Activo
                          </span>
                        )}
                      </div>
                      
                      {prompt.description && (
                        <p className="text-sm text-gray-600 mt-1 ml-6">
                          {prompt.description}
                        </p>
                      )}
                      
                      <div className="mt-2 ml-6">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-500">
                            Ver contenido del prompt
                          </summary>
                          <div className="mt-2 p-3 bg-gray-50 rounded border text-gray-700 font-mono text-xs">
                            {prompt.content}
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Velocidad de Respuesta de IA
          </label>
          <select
            value={formData.aiResponseSpeed}
            onChange={(e) => handleInputChange('aiResponseSpeed', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fast">Rápida (respuestas más directas)</option>
            <option value="balanced">Balanceada (recomendado)</option>
            <option value="detailed">Detallada (respuestas más elaboradas)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Auto-guardar Conversaciones</h4>
            <p className="text-sm text-gray-500">Guarda automáticamente el progreso de las conversaciones</p>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.autoSave ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            onClick={() => handleInputChange('autoSave', !formData.autoSave)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    );
  };

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => handleInputChange('theme', theme)}
              className={`p-3 border-2 rounded-lg text-center capitalize transition-colors ${
                formData.theme === theme
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {theme === 'light' && '☀️ Claro'}
              {theme === 'dark' && '🌙 Oscuro'}
              {theme === 'auto' && '🔄 Automático'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Idioma
        </label>
        <select
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="pt">Português</option>
        </select>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Exportar Datos</h4>
          <p className="text-sm text-gray-500 mb-3">
            Descarga una copia de todos tus datos en formato JSON
          </p>
          <Button variant="secondary" size="sm">
            Exportar Datos
          </Button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Importar Configuración</h4>
          <p className="text-sm text-gray-500 mb-3">
            Importa configuraciones desde un archivo de respaldo
          </p>
          <Button variant="secondary" size="sm">
            Importar Config
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800">Limpiar Datos de Caché</h4>
            <p className="text-sm text-yellow-600 mt-1">
              Elimina datos temporales y caché para mejorar el rendimiento
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              Limpiar Caché
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'account':
        return renderAccountSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'ai':
        return renderAISection();
      case 'appearance':
        return renderAppearanceSection();
      case 'data':
        return renderDataSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">
            Personaliza tu experiencia en Versu AI Dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {settingsSections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {settingsSections.find(s => s.id === activeSection)?.description}
                </p>
              </div>

              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 