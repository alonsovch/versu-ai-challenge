import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { validationSchemas } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post(
  '/register',
  validateBody(validationSchemas.register),
  authController.register
);

router.post(
  '/login',
  validateBody(validationSchemas.login),
  authController.login
);

// Ruta para crear usuario demo (solo en desarrollo)
router.post('/demo', authController.createDemoUser);

// Rutas protegidas
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

export default router; 