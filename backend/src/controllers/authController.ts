import { Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest, ApiResponse, LoginRequestDto, RegisterRequestDto } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Registrar nuevo usuario
   * POST /api/auth/register
   */
  register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userData: RegisterRequestDto = req.body;
      
      const result = await this.authService.register(userData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Usuario registrado exitosamente'
      } as ApiResponse);
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejar errores específicos
      if (error.message === 'El email ya está registrado') {
        res.status(409).json({
          success: false,
          error: 'Conflicto',
          message: error.message
        } as ApiResponse);
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo registrar el usuario'
      } as ApiResponse);
    }
  };

  /**
   * Iniciar sesión
   * POST /api/auth/login
   */
  login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const credentials: LoginRequestDto = req.body;
      
      const result = await this.authService.login(credentials);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Inicio de sesión exitoso'
      } as ApiResponse);
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos
      if (error.message === 'Credenciales inválidas') {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        } as ApiResponse);
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo iniciar sesión'
      } as ApiResponse);
    }
  };

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/auth/profile
   */
  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      
      const user = await this.authService.getProfile(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        } as ApiResponse);
        return;
      }
      
      res.status(200).json({
        success: true,
        data: { user },
        message: 'Perfil obtenido exitosamente'
      } as ApiResponse);
      
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Actualizar perfil del usuario
   * PUT /api/auth/profile
   */
  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const updateData = req.body;
      
      const user = await this.authService.updateProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        data: { user },
        message: 'Perfil actualizado exitosamente'
      } as ApiResponse);
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Crear usuario demo para desarrollo
   * POST /api/auth/demo
   */
  createDemoUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Solo permitir en desarrollo
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          error: 'Funcionalidad no disponible en producción'
        } as ApiResponse);
        return;
      }
      
      const result = await this.authService.createDemoUser();
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Usuario demo creado/obtenido exitosamente'
      } as ApiResponse);
      
    } catch (error) {
      console.error('Error creando usuario demo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Verificar estado de autenticación
   * GET /api/auth/me
   */
  me = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // El middleware ya validó el token, solo devolvemos el usuario
      res.status(200).json({
        success: true,
        data: { user: req.user },
        message: 'Usuario autenticado'
      } as ApiResponse);
      
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  /**
   * Cerrar sesión (invalidar token del lado del cliente)
   * POST /api/auth/logout
   */
  logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // En JWT stateless no mantenemos tokens en servidor
      // El frontend debe eliminar el token del localStorage/sessionStorage
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      } as ApiResponse);
      
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      } as ApiResponse);
    }
  };
} 