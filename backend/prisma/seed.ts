import { PrismaClient, ConversationChannel, ConversationStatus, MessageRole} from '@prisma/client';

const prisma = new PrismaClient();

// Función simple para hashear password (solo para demo)
function simpleHash(password: string): string {
  // En un entorno real, usaríamos bcrypt
  return `hashed_${password}`;
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios de ejemplo (sin eliminar existentes para no romper demos)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@versu.ai' },
    update: {},
    create: {
      email: 'demo@versu.ai',
      name: 'Usuario Demo',
      password: simpleHash('demo123'),
    }
  });

  const users = [
    demoUser,
    await prisma.user.upsert({
      where: { email: 'maria@empresa.com' },
      update: {},
      create: {
        email: 'maria@empresa.com',
        name: 'María González',
        password: simpleHash('password123'),
      }
    }),
    await prisma.user.upsert({
      where: { email: 'carlos@startup.com' },
      update: {},
      create: {
        email: 'carlos@startup.com', 
        name: 'Carlos Ramírez',
        password: simpleHash('password123'),
      }
    })
  ];

  console.log('✅ Usuarios creados/actualizados');

  // Crear prompts de ejemplo
  const promptsData = [
    {
      name: 'Asistente Amigable',
      description: 'Un asistente joven y simpático que ayuda con cualquier consulta',
      content: 'Eres un asistente virtual joven, simpático y muy útil. Responde de manera amigable y conversacional, usando emojis ocasionalmente. Siempre trata de ser útil y positivo.',
      isActive: true
    },
    {
      name: 'Experto Tradicional',
      description: 'Un asistente formal y profesional con mucha experiencia',
      content: 'Eres un asistente virtual con muchos años de experiencia. Respondes de manera formal, profesional y detallada. Usas un lenguaje técnico cuando es apropiado.',
      isActive: false
    },
    {
      name: 'Gringo Principiante',
      description: 'Un asistente que habla español pero como si fuera extranjero',
      content: 'Eres un asistente que habla español pero no es tu idioma nativo. A veces cometes pequeños errores gramaticales o usas expresiones en inglés. Eres muy entusiasta.',
      isActive: false
    },
    {
      name: 'Consultor de Negocios',
      description: 'Un asistente especializado en temas empresariales y estrategia',
      content: 'Eres un consultor de negocios experimentado. Te especializas en estrategia empresarial, análisis de mercado y optimización de procesos. Respondes con insights profundos.',
      isActive: false
    }
  ];

  const prompts: any[] = [];
  for (const promptData of promptsData) {
    const prompt = await prisma.prompt.upsert({
      where: { name: promptData.name },
      update: promptData,
      create: promptData
    });
    prompts.push(prompt);
  }

  console.log('✅ Prompts creados/actualizados');

  // Crear conversaciones de ejemplo si no existen muchas
  const existingConversations = await prisma.conversation.count();
  
  if (existingConversations < 20) {
    console.log('📝 Creando conversaciones de ejemplo...');

    const currentDate = new Date();

    // Generar 30 conversaciones de los últimos 30 días
    for (let i = 0; i < 30; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const conversationDate = new Date(currentDate);
      conversationDate.setDate(conversationDate.getDate() - daysAgo);

      const user = users[Math.floor(Math.random() * users.length)];
      const channels = [ConversationChannel.WEB, ConversationChannel.WHATSAPP, ConversationChannel.INSTAGRAM];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      
      // 70% de conversaciones cerradas, 30% abiertas
      const status = Math.random() < 0.7 ? ConversationStatus.CLOSED : ConversationStatus.OPEN;
      
      // Solo conversaciones cerradas tienen rating
      const rating = status === ConversationStatus.CLOSED ? 
        (Math.random() < 0.8 ? // 80% tiene rating
          Math.floor(Math.random() * 3) + 3 : // Rating entre 3-5 (mayormente positivo)
          Math.floor(Math.random() * 2) + 1   // Rating 1-2 (ocasionalmente negativo)
        ) : null;

      const conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          channel,
          status,
          rating,
          createdAt: conversationDate,
          updatedAt: new Date(conversationDate.getTime() + Math.random() * 3600000) // 1 hora después máximo
        }
      });

      // Crear mensajes para esta conversación
      const messageCount = Math.floor(Math.random() * 6) + 2; // 2-7 mensajes
      
      const userMessages = [
        'Hola, necesito ayuda con mi cuenta',
        '¿Puedes ayudarme con mi pedido #12345?',
        'Tengo una pregunta sobre el producto que compré',
        'No encuentro mi factura del mes pasado',
        '¿Cómo puedo cambiar mi contraseña?',
        'Quiero cancelar mi suscripción premium',
        'El producto no funciona como esperaba',
        '¿Cuáles son los horarios de atención al cliente?',
        'Necesito soporte técnico urgente',
        'Muchas gracias por toda la ayuda'
      ];

      const aiMessages = [
        '¡Hola! Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy? 😊',
        'Por supuesto, estaré encantado de ayudarte con esa solicitud.',
        'Entiendo tu consulta. Permíteme verificar esa información en nuestro sistema.',
        'He encontrado la información que necesitas. Aquí tienes todos los detalles:',
        'Para ayudarte de la mejor manera, ¿podrías proporcionarme algunos detalles adicionales?',
        'Perfecto, he procesado tu solicitud. Todo está listo y actualizado.',
        'Excelente, he actualizado tu información en el sistema correctamente.',
        '¿Hay algo más en lo que pueda ayudarte el día de hoy?',
        'Espero haber resuelto completamente tu consulta. ¡Que tengas un excelente día! 🌟',
        'Si necesitas más ayuda en el futuro, no dudes en contactarnos nuevamente.'
      ];
      
      for (let j = 0; j < messageCount; j++) {
        // Alternar entre USER y AI, empezando por USER
        const role = j % 2 === 0 ? MessageRole.USER : MessageRole.AI;
        const messages = role === MessageRole.USER ? userMessages : aiMessages;
        const content = messages[Math.floor(Math.random() * messages.length)];
        
        const messageDate = new Date(conversationDate);
        messageDate.setMinutes(messageDate.getMinutes() + (j * 2)); // 2 minutos entre mensajes

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            content,
            role,
            promptUsed: role === MessageRole.AI ? prompts[0].name : null,
            responseTime: role === MessageRole.AI ? Math.floor(Math.random() * 3000) + 500 : null, // 500-3500ms
            createdAt: messageDate
          }
        });
      }
    }

    console.log('✅ Conversaciones y mensajes creados');
  } else {
    console.log('ℹ️  Ya existen suficientes conversaciones, saltando creación');
  }

  // Estadísticas finales
  const stats = {
    users: await prisma.user.count(),
    conversations: await prisma.conversation.count(),
    messages: await prisma.message.count(),
    prompts: await prisma.prompt.count()
  };

  console.log('\n📊 Estadísticas de la base de datos:');
  console.log(`👥 Usuarios: ${stats.users}`);
  console.log(`💬 Conversaciones: ${stats.conversations}`);
  console.log(`📝 Mensajes: ${stats.messages}`);
  console.log(`🤖 Prompts: ${stats.prompts}`);
  console.log('\n🎉 ¡Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 