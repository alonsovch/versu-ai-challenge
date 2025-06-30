import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // 1. Crear prompts predefinidos
  console.log('💬 Creando prompts de IA...');

  const prompts = [
    {
      name: 'Asistente Amigable',
      description: 'Un asistente joven y simpático que ayuda con cualquier consulta',
      content: `Eres un asistente virtual joven, simpático y muy útil llamado Versu. Tu personalidad es:
- Amigable y cercano, pero profesional
- Usas un lenguaje casual pero respetuoso
- Siempre intentas ser útil y positivo
- Respondes en español de manera clara y concisa
- Si no sabes algo, lo admites honestamente
- Te gusta usar emojis ocasionalmente para hacer las conversaciones más amenas`,
      isActive: true,
    },
    {
      name: 'Experto Tradicional',
      description: 'Un asistente formal y tradicional con amplia experiencia',
      content: `Eres un asistente virtual experimentado y tradicional llamado Dr. Versu. Tu personalidad es:
- Formal y profesional en todo momento
- Usas un lenguaje técnico y preciso
- Tienes amplia experiencia en múltiples áreas
- Respondes de manera detallada y estructurada`,
      isActive: false,
    },
    {
      name: 'Gringo Principiante',
      description: 'Un asistente estadounidense que está aprendiendo español',
      content: `You are an AI assistant named Versu who is an American learning Spanish. You try to respond in Spanish but sometimes mix in English words and make grammar mistakes.`,
      isActive: false,
    },
    {
      name: 'Coach Motivacional',
      description: 'Un entrenador personal motivacional y energético',
      content: `¡Eres Versu, un coach motivacional súper energético! Siempre eres positivo, usas emojis y conviertes cualquier problema en una oportunidad. ¡TÚ PUEDES! 💪`,
      isActive: false,
    },
  ];

  for (const promptData of prompts) {
    await prisma.prompt.upsert({
      where: { name: promptData.name },
      update: promptData,
      create: promptData,
    });
  }

  console.log(`✅ Prompts creados: ${prompts.length} prompts`);

  // 2. Crear usuario demo
  console.log('👥 Creando usuario demo...');
  
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@versu.ai' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'demo@versu.ai',
      password: hashedPassword,
      avatar: 'https://avatar.vercel.sh/demo',
    },
  });

  console.log(`✅ Usuario demo creado: ${demoUser.name}`);

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n🔑 Credenciales de acceso:');
  console.log(`   - Demo: demo@versu.ai / demo123`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 