import { Router } from 'express';
import { ConversationController } from '../controllers/conversationController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { validationSchemas } from '../middleware/validation';

const router = Router();
const conversationController = new ConversationController();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas especiales (deben ir antes de las rutas con parámetros)
router.get('/metrics', conversationController.getMetrics);
router.get('/metrics/global', conversationController.getGlobalMetrics);

// Rutas principales
router.post(
  '/',
  validateBody(validationSchemas.createConversation),
  conversationController.createConversation
);

router.get(
  '/',
  validateQuery(validationSchemas.conversationFilters),
  conversationController.getConversations
);

// Rutas con parámetros
router.get(
  '/:id',
  validateParams(validationSchemas.mongoId),
  conversationController.getConversation
);

router.post(
  '/:id/messages',
  validateParams(validationSchemas.mongoId),
  validateBody(validationSchemas.sendMessage),
  conversationController.sendMessage
);

router.post(
  '/:id/rate',
  validateParams(validationSchemas.mongoId),
  validateBody(validationSchemas.rateConversation),
  conversationController.rateConversation
);

router.post(
  '/:id/close',
  validateParams(validationSchemas.mongoId),
  conversationController.closeConversation
);

export default router; 