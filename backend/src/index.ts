import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { connectDatabase } from './utils/database';

// Configurar variables de entorno
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Versu AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', apiRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Eventos de conversaciones
  socket.on('join_conversation', (data) => {
    socket.join(`conversation_${data.conversationId}`);
    console.log(`Cliente ${socket.id} se unió a conversación ${data.conversationId}`);
  });

  socket.on('leave_conversation', (data) => {
    socket.leave(`conversation_${data.conversationId}`);
    console.log(`Cliente ${socket.id} dejó conversación ${data.conversationId}`);
  });

  socket.on('typing_start', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('typing_indicator', {
      conversationId: data.conversationId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('typing_indicator', {
      conversationId: data.conversationId,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const startServer = async () => {
  try {
    // Conectar a la base de datos con reintentos
    await connectDatabase();
    
    // Iniciar servidor HTTP
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base: http://localhost:${PORT}/api`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();

export { io }; 