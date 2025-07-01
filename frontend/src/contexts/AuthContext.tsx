import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';
import type { 
  User, 
  AuthState, 
  LoginRequest, 
  RegisterRequest,
  AuthResponse 
} from '../types';

// Tipos para acciones del reducer
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Empezamos cargando para verificar token existente
  error: null,
};

// Reducer para manejar el estado de autenticación
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  createDemoUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token existente al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser && authService.hasValidToken()) {
          // Verificar token con el servidor
          const user = await authService.me();
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token }
          });

          // Conectar Socket.IO
          socketService.connect(token);
        } else {
          // Limpiar datos inválidos
          authService.clearAuth();
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        authService.clearAuth();
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // Función para login
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const authData: AuthResponse = await authService.login(credentials);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authData.user,
          token: authData.token
        }
      });

      // Conectar Socket.IO
      socketService.connect(authData.token);

    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al iniciar sesión'
      });
      throw error;
    }
  };

  // Función para registro
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const authData: AuthResponse = await authService.register(userData);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authData.user,
          token: authData.token
        }
      });

      // Conectar Socket.IO
      socketService.connect(authData.token);

    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al registrarse'
      });
      throw error;
    }
  };

  // Función para logout
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      socketService.disconnect();
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser
      });

    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al actualizar perfil'
      });
      throw error;
    }
  };

  // Función para crear usuario demo
  const createDemoUser = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const authData: AuthResponse = await authService.createDemoUser();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authData.user,
          token: authData.token
        }
      });

      // Conectar Socket.IO
      socketService.connect(authData.token);

    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Error al crear usuario demo'
      });
      throw error;
    }
  };

  // Función para limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    createDemoUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
} 