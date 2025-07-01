import { Router } from 'express';
import authRoutes from './authRoutes';
import conversationRoutes from './conversationRoutes';
import promptRoutes from './promptRoutes';

const router = Router();

// Rutas del API v1
router.use('/auth', authRoutes);
router.use('/conversations', conversationRoutes);
router.use('/prompts', promptRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de información del API
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Versu AI Dashboard API',
      version: '1.0.0',
      description: 'API para dashboard de conversaciones de IA',
      endpoints: {
        auth: '/api/auth',
        conversations: '/api/conversations',
        prompts: '/api/prompts',
        health: '/api/health',
        info: '/api/info'
      }
    }
  });
});

export default router; 