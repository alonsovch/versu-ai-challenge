import { apiClient, extractData } from './api';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from '../types';

export class AuthService {
  
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const authData = extractData<AuthResponse>(response);
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    const authData = extractData<AuthResponse>(response);
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return extractData<{ user: User }>(response).user;
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put('/auth/profile', updates);
    const userData = extractData<{ user: User }>(response).user;
    
    // Actualizar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  async me(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return extractData<{ user: User }>(response).user;
  }

  /**
   * Crear usuario demo (solo para desarrollo)
   */
  async createDemoUser(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/demo');
      const authData = extractData<AuthResponse>(response);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      // Si falla, crear datos demo locales (fallback)
      const demoAuthData: AuthResponse = {
        user: {
          id: 'demo-user-local',
          name: 'Usuario Demo Local',
          email: 'demo@versu.ai',
          avatar: undefined
        },
        token: 'demo-token-local-' + Date.now()
      };
      
      localStorage.setItem('authToken', demoAuthData.token);
      localStorage.setItem('user', JSON.stringify(demoAuthData.user));
      
      return demoAuthData;
    }
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtener usuario del localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar si hay token válido
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Verificar que el token tenga el formato correcto (Bearer JWT)
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Verificar si el token no ha expirado
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      
      // Agregar un buffer de 60 segundos para evitar problemas de sincronización
      return payload.exp && (payload.exp - 60) > now;
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

// Exportar instancia singleton
export const authService = new AuthService(); 