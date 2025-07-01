import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest, ApiResponse } from '../types';

const authService = new AuthService();

/**
 * Middleware de autenticación JWT
 * Valida el token y agrega el usuario autenticado al request
 */
export const authenticate = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'Token de autorización requerido'
      } as ApiResponse);
      return;
    }

    // Extraer token del header "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Formato de token inválido'
      } as ApiResponse);
      return;
    }

    // Verificar token
    const user = await authService.verifyToken(token);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Token inválido o expirado'
      } as ApiResponse);
      return;
    }

    // Agregar usuario al request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse);
  }
};

/**
 * Middleware opcional de autenticación
 * Si hay token lo valida, si no hay continúa sin usuario
 */
export const optionalAuth = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const user = await authService.verifyToken(token);
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación opcional:', error);
    // En caso de error, continúa sin usuario
    next();
  }
}; 