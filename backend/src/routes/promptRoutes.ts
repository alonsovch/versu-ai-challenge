import { Router } from 'express';
import { PromptController } from '../controllers/promptController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { validationSchemas } from '../middleware/validation';

const router = Router();
const promptController = new PromptController();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas especiales (deben ir antes de las rutas con parámetros)
router.get('/active', promptController.getActivePrompts);
router.get('/stats', promptController.getPromptStats);

// Rutas principales
router.get(
  '/',
  validateQuery(validationSchemas.pagination),
  promptController.getAllPrompts
);

router.post(
  '/',
  validateBody(validationSchemas.createPrompt),
  promptController.createPrompt
);

// Rutas con parámetros
router.get(
  '/:id',
  validateParams(validationSchemas.mongoId),
  promptController.getPrompt
);

router.put(
  '/:id',
  validateParams(validationSchemas.mongoId),
  validateBody(validationSchemas.updatePrompt),
  promptController.updatePrompt
);

router.delete(
  '/:id',
  validateParams(validationSchemas.mongoId),
  promptController.deletePrompt
);

router.patch(
  '/:id/toggle',
  validateParams(validationSchemas.mongoId),
  promptController.togglePrompt
);

export default router; 