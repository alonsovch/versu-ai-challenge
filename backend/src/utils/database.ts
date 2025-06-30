import { PrismaClient } from '@prisma/client';

// Configuración global de Prisma con logging
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Manejo de conexión y desconexión
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
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