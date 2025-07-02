import { PrismaClient } from '@prisma/client';

// Configuración global de Prisma con logging
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Función de espera
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Manejo de conexión con reintentos
export const connectDatabase = async (maxRetries: number = 10, delay: number = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Base de datos conectada correctamente');
      return;
    } catch (error) {
      console.log(`⏳ Intento ${attempt}/${maxRetries} - Esperando que la base de datos esté lista...`);
      
      if (attempt === maxRetries) {
        console.error('❌ No se pudo conectar a la base de datos después de todos los intentos:', error);
        process.exit(1);
      }
      
      console.log(`🔄 Reintentando en ${delay/1000} segundos...`);
      await sleep(delay);
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Base de datos desconectada');
  } catch (error) {
    console.error('❌ Error al desconectar la base de datos:', error);
  }
};

// Manejo de shutdown graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Señal SIGINT recibida, cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Señal SIGTERM recibida, cerrando servidor...');
  await disconnectDatabase();
  process.exit(0);
});

export default prisma; 