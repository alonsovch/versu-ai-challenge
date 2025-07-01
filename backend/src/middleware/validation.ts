import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../types';

/**
 * Middleware genérico de validación usando Joi
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        message: error.details[0].message
      } as ApiResponse);
      return;
    }
    
    // Reemplazar body con el valor validado y limpio
    req.body = value;
    next();
  };
};

/**
 * Middleware de validación para query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Parámetros de consulta inválidos',
        message: error.details[0].message
      } as ApiResponse);
      return;
    }
    
    req.query = value;
    next();
  };
};

/**
 * Middleware de validación para parámetros de ruta
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Parámetros de ruta inválidos',
        message: error.details[0].message
      } as ApiResponse);
      return;
    }
    
    req.params = value;
    next();
  };
};

// Esquemas de validación comunes
export const validationSchemas = {
  // Autenticación
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  }),

  register: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'string.max': 'La contraseña no puede exceder 100 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  }),

  // Conversaciones
  createConversation: Joi.object({
    channel: Joi.string().valid('WEB', 'WHATSAPP', 'INSTAGRAM').default('WEB')
  }),

  sendMessage: Joi.object({
    content: Joi.string().min(1).max(2000).required().messages({
      'string.min': 'El mensaje no puede estar vacío',
      'string.max': 'El mensaje no puede exceder 2000 caracteres',
      'any.required': 'El contenido del mensaje es requerido'
    }),
    conversationId: Joi.string().required().messages({
      'any.required': 'El ID de conversación es requerido'
    })
  }),

  rateConversation: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'La calificación debe ser entre 1 y 5',
      'number.max': 'La calificación debe ser entre 1 y 5',
      'any.required': 'La calificación es requerida'
    })
  }),

  // Parámetros comunes
  mongoId: Joi.object({
    id: Joi.string().required().messages({
      'any.required': 'El ID es requerido'
    })
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'rating').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  conversationFilters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    channel: Joi.string().valid('WEB', 'WHATSAPP', 'INSTAGRAM').optional(),
    status: Joi.string().valid('OPEN', 'CLOSED').optional(),
    minRating: Joi.number().integer().min(1).max(5).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
  }),

  // Prompts
  createPrompt: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional().allow(null),
    content: Joi.string().min(10).max(4000).required(),
    isActive: Joi.boolean().default(false)
  }),

  updatePrompt: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional().allow(null),
    content: Joi.string().min(10).max(4000).optional(),
    isActive: Joi.boolean().optional()
  })
}; 