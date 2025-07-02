# 🤖 Versu AI Dashboard

Un dashboard avanzado para monitorizar y analizar conversaciones con agentes de IA en tiempo real. Permite gestionar chats, analizar métricas de satisfacción y optimizar prompts de IA.

![Dashboard Preview](https://img.shields.io/badge/React-18.x-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📋 Pre-requisitos](#-pre-requisitos)
- [⚡ Instalación Rápida](#-instalación-rápida)
- [🔧 Configuración Detallada](#-configuración-detallada)
- [🐳 Usando Docker](#-usando-docker)
- [💻 Desarrollo Local](#-desarrollo-local)
- [🎯 Uso del Dashboard](#-uso-del-dashboard)
- [📊 Funcionalidades](#-funcionalidades)
- [🔑 API Keys y Configuración](#-api-keys-y-configuración)
- [🐛 Solución de Problemas](#-solución-de-problemas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🚀 Características Principales

- ✅ **Conversaciones en Tiempo Real** - Chat con IA usando WebSocket
- ✅ **Analytics Avanzado** - Métricas de satisfacción, tiempos de respuesta y canales
- ✅ **Gestión de Prompts** - 4 personalidades de IA diferentes
- ✅ **Dashboard Interactivo** - Visualización de datos con gráficos dinámicos
- ✅ **Autenticación JWT** - Sistema seguro de usuarios
- ✅ **Multiplataforma** - Soporte para Web, WhatsApp, Instagram
- ✅ **Base de Datos Poblada** - 49 conversaciones de ejemplo con 178 mensajes
- ✅ **Responsive Design** - Optimizado para mobile y desktop

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** para estilos
- **React Query** para manejo de estado y caché
- **React Router** para navegación
- **Socket.IO Client** para tiempo real

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** con **PostgreSQL**
- **Socket.IO** para WebSocket
- **JWT** para autenticación
- **Groq API** para IA (configurable)

### DevOps
- **Docker** + **Docker Compose**
- **Prisma Migrations**
- **Seed data** automático

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** (recomendado) - [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **Git** - [Descargar aquí](https://git-scm.com/)

**O para desarrollo local:**
- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **PostgreSQL 14+** - [Descargar aquí](https://www.postgresql.org/)

---

## ⚡ Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/versu-ai-challenge.git
cd versu-ai-challenge
```

### 2. Configurar Variables de Entorno
```bash
# Crear archivo .env desde el ejemplo
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Editar el archivo .env con tu editor favorito
notepad .env             # Windows
nano .env               # Linux
code .env               # VS Code
```

### 3. Configurar API Key (Opcional)
En el archivo `.env`, configura tu API key de Groq:
```env
GROQ_API_KEY=gsk_tu_api_key_aqui
```
> 💡 **Nota:** El proyecto funciona perfectamente sin API key usando respuestas simuladas

### 4. Iniciar con Docker
```bash
# Windows (PowerShell)
.\init-project.ps1

# Linux/Mac
chmod +x init-project.sh
./init-project.sh
```

### 5. Acceder al Dashboard
Una vez que todos los servicios estén ejecutándose:

- **🌐 Frontend:** http://localhost:3000
- **🔌 Backend API:** http://localhost:3001/api
- **🗄️ Base de datos:** localhost:5432

---

## 🔧 Configuración Detallada

### Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
# ===================================
# BASE DE DATOS
# ===================================
DATABASE_URL="postgresql://postgres:password@db:5432/versu_ai_db"

# ===================================
# AUTENTICACIÓN
# ===================================
JWT_SECRET="versu_ai_jwt_secret_super_seguro_cambiar_en_produccion_2024"

# ===================================
# API DE INTELIGENCIA ARTIFICIAL
# ===================================
# Obtén tu API key gratis en: https://console.groq.com/
GROQ_API_KEY="gsk_tu_api_key_de_groq_aqui_opcional"
GROQ_API_URL="https://api.groq.com/openai/v1/chat/completions"

# ===================================
# CONFIGURACIÓN DEL BACKEND
# ===================================
BACKEND_PORT=3001
NODE_ENV=development

# ===================================
# CONFIGURACIÓN DEL FRONTEND
# ===================================
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### Obtener API Key de Groq (Gratis) 🆓

1. Ve a [Groq Console](https://console.groq.com/)
2. Regístrate gratis con tu email
3. Ve a la sección "API Keys" 
4. Crea una nueva API key
5. Cópiala y pégala en tu archivo `.env`

**Modelos disponibles en Groq (gratis):**
- `llama3-8b-8192` (recomendado)
- `llama3-70b-8192`
- `mixtral-8x7b-32768`

---

## 🐳 Usando Docker

### Comandos Principales

```bash
# 🚀 Iniciar todo el proyecto
docker-compose up -d

# 📄 Ver logs en tiempo real
docker-compose logs -f

# 🔄 Reiniciar un servicio específico
docker-compose restart frontend
docker-compose restart backend

# 🗄️ Ejecutar migraciones de base de datos
docker-compose exec backend npm run prisma:migrate

# 🌱 Poblar base de datos con datos de ejemplo
docker-compose exec backend npm run seed

# ⏹️ Detener todo
docker-compose down

# 🧹 Limpiar y reiniciar (elimina volúmenes)
docker-compose down -v
docker-compose up --build -d
```

### Servicios Incluidos

- **frontend** - React app (Puerto 3000)
- **backend** - Node.js API (Puerto 3001)  
- **db** - PostgreSQL (Puerto 5432)

---

## 💻 Desarrollo Local

Si prefieres ejecutar sin Docker:

### Configurar Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```

### Configurar Base de Datos
```bash
# Instalar PostgreSQL y crear base de datos
createdb versu_ai_db

# O usar Docker solo para la BD
docker run --name versu-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
```

---

## 🎯 Uso del Dashboard

### 1. 🔐 Registro/Login

**Opción A: Usuario Demo (Recomendado)**
- Clic en **"Probar Demo"** en la página de login
- Acceso inmediato sin registro
- Datos pre-poblados incluidos

**Opción B: Nuevo Usuario**
- Registrarse con email y password
- Confirmar cuenta y hacer login
- Empezar con datos en blanco

### 2. 🧭 Navegación Principal

- **📊 Dashboard** - Resumen general y métricas principales
- **💬 Conversaciones** - Lista paginada de todos los chats
- **📈 Analytics** - Gráficos detallados y distribuciones
- **⚙️ Configuración** - Gestión de prompts y perfil de usuario

### 3. 💬 Crear Nueva Conversación

1. Ve a la sección **"Conversaciones"**
2. Clic en **"Nueva Conversación"**
3. Se abre automáticamente el chat en tiempo real
4. Escribe mensajes y recibe respuestas de IA instantáneas
5. Los mensajes se guardan automáticamente

### 4. 📊 Analizar Datos

- **⭐ Ratings:** Distribución de calificaciones 1-5 estrellas
- **📱 Canales:** Distribución entre Web, WhatsApp, Instagram
- **🤖 Prompts:** Top 5 prompts con peor performance
- **⚡ Métricas:** Satisfacción promedio y tiempos de respuesta

---

## 📊 Funcionalidades

### 📈 Dashboard Principal
- **KPIs en tiempo real:** conversaciones hoy/semana/mes
- **Tasa de satisfacción:** porcentaje promedio
- **Tiempo de respuesta:** promedio de IA en milisegundos
- **Conversaciones recientes:** últimos chats con preview

### 💼 Gestión de Conversaciones
- **Lista paginada** con filtros avanzados por:
  - Estado: Abierta/Cerrada
  - Canal: Web/WhatsApp/Instagram
  - Rating mínimo: 1-5 estrellas
  - Rango de fechas
- **Acciones disponibles:**
  - Ver historial completo
  - Continuar conversación
  - Calificar conversación cerrada

### 🚀 Chat en Tiempo Real
- **WebSocket** para mensajes instantáneos
- **Indicador de escritura** cuando la IA está respondiendo
- **Respuestas automáticas** con diferentes personalidades
- **Historial persistente** que se mantiene entre sesiones

### 📊 Analytics Avanzado
- **Distribución de ratings** con porcentajes visuales
- **Gráfico de canales** (Web/WhatsApp/Instagram)
- **Top prompts problemáticos** ordenados por rating
- **Filtros por rango de fechas** personalizables
- **Insights automáticos** y recomendaciones

### 🤖 Sistema de Prompts

**4 personalidades de IA incluidas:**

1. **🙂 Asistente Amigable** (Activo por defecto)
   - Joven, simpático y conversacional
   - Usa emojis ocasionalmente
   - Respuestas útiles y positivas

2. **🎩 Experto Tradicional**
   - Formal y profesional
   - Lenguaje técnico apropiado
   - Respuestas detalladas y estructuradas

3. **🌎 Gringo Principiante**
   - Español como segundo idioma
   - Pequeños errores gramaticales ocasionales
   - Expresiones en inglés mezcladas

4. **💼 Consultor de Negocios**
   - Especialista en estrategia empresarial
   - Análisis de mercado y procesos
   - Insights profundos de negocio

---

## 🔑 API Keys y Configuración

### 🟢 Groq API (Recomendado - Gratis)

```env
GROQ_API_KEY=gsk_tu_key_aqui
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

**Ventajas de Groq:**
- ✅ Completamente gratis
- ✅ Muy rápido (baja latencia)
- ✅ Sin límites estrictos
- ✅ Modelos Llama 3 de alta calidad

### 🟡 OpenAI API (Alternativa de pago)

```env
GROQ_API_KEY=sk-tu_openai_key_aqui
GROQ_API_URL=https://api.openai.com/v1/chat/completions
```

### 🔵 Sin API Key (Modo Demo)

El proyecto funciona **completamente sin configurar API key:**
- ✅ Usa respuestas simuladas inteligentes
- ✅ Ideal para testing y demostración
- ✅ Todas las funcionalidades disponibles
- ✅ Diferentes tipos de respuesta según el prompt

---

## 🐛 Solución de Problemas

### 🔴 Puerto ya en uso

```bash
# Verificar qué proceso está usando el puerto
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/Mac

# Cambiar puertos en docker-compose.yml si es necesario
# O terminar el proceso que está usando el puerto
```

### 🔴 Base de datos no conecta

```bash
# Reiniciar contenedor de base de datos
docker-compose restart db

# Verificar logs de la base de datos
docker-compose logs db

# Recrear volúmenes si hay corrupción
docker-compose down -v
docker-compose up -d
```

### 🔴 Frontend no carga

```bash
# Limpiar caché de Node.js
docker-compose exec frontend rm -rf node_modules package-lock.json
docker-compose restart frontend

# Verificar logs del frontend
docker-compose logs frontend
```

### 🔴 Error de permisos (Linux/Mac)

```bash
# Dar permisos de ejecución al script
chmod +x init-project.sh

# Ejecutar con sudo si es necesario
sudo docker-compose up -d

# Cambiar propiedad de archivos
sudo chown -R $USER:$USER .
```

### 🔴 API de IA no responde

1. **Verificar API key** en archivo `.env`
2. **Comprobar balance** en Groq Console
3. **Verificar conectividad** a internet
4. **Modo fallback:** El sistema funciona sin API key

### 🔴 Error "Cannot find module"

```bash
# Reinstalar dependencias en contenedores
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📁 Estructura del Proyecto

```
versu-ai-challenge/
├── 📁 backend/                 # 🔙 API Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # 🎮 Controladores de rutas
│   │   ├── 📁 services/        # 🔧 Lógica de negocio
│   │   ├── 📁 middleware/      # 🛡️ Auth, validación, CORS
│   │   ├── 📁 routes/          # 🛣️ Definición de endpoints
│   │   ├── 📁 types/           # 📝 Tipos TypeScript
│   │   └── index.ts            # 🚀 Punto de entrada
│   ├── 📁 prisma/              # 🗄️ ORM y base de datos
│   │   ├── schema.prisma       # 📊 Modelo de datos
│   │   └── seed.ts             # 🌱 Datos de ejemplo
│   ├── Dockerfile              # 🐳 Contenedor backend
│   ├── package.json            # 📦 Dependencias Node.js
│   └── tsconfig.json           # ⚙️ Configuración TypeScript
│
├── 📁 frontend/                # 🎨 React + TypeScript
│   ├── 📁 src/
│   │   ├── 📁 components/      # 🧩 Componentes reutilizables
│   │   │   ├── 📁 atoms/       # ⚛️ Botones, inputs básicos
│   │   │   └── 📁 molecules/   # 🧬 Cards, formularios complejos
│   │   ├── 📁 pages/           # 📄 Páginas principales
│   │   ├── 📁 hooks/           # 🎣 React Query hooks
│   │   ├── 📁 services/        # 🌐 Clientes API
│   │   ├── 📁 contexts/        # 🔄 Estado global (Auth)
│   │   ├── 📁 types/           # 📝 Tipos compartidos
│   │   └── main.tsx            # 🚀 Punto de entrada React
│   ├── Dockerfile              # 🐳 Contenedor frontend
│   ├── package.json            # 📦 Dependencias React
│   ├── vite.config.ts          # ⚡ Configuración Vite
│   └── tailwind.config.js      # 🎨 Configuración Tailwind
│
├── 📄 docker-compose.yml       # 🐳 Orquestación de servicios
├── 📄 .env.example            # 📝 Variables de entorno ejemplo
├── 📄 init-project.sh         # 🚀 Script inicialización Linux/Mac
├── 📄 init-project.ps1        # 🚀 Script inicialización Windows
└── 📄 README.md               # 📖 Este archivo
```

---

## 🚀 Scripts Útiles

### Backend Scripts

```bash
# Ejecutar dentro del contenedor backend
docker-compose exec backend npm run [comando]

# Comandos disponibles:
npm run dev          # 🔄 Desarrollo con nodemon
npm run build        # 🔨 Compilar TypeScript
npm run start        # 🚀 Modo producción
npm run seed         # 🌱 Poblar BD con datos ejemplo
npm run prisma:studio # 🖥️ GUI para base de datos
npm run prisma:migrate # 🔄 Ejecutar migraciones
```

### Frontend Scripts

```bash
# Ejecutar dentro del contenedor frontend
docker-compose exec frontend npm run [comando]

# Comandos disponibles:
npm run dev          # 🔄 Servidor de desarrollo
npm run build        # 🔨 Build para producción  
npm run preview      # 👀 Preview del build
npm run lint         # 🔍 Verificar código
```

---

## 📊 Datos de Prueba Incluidos

El proyecto viene con **datos realistas pre-poblados:**

### 👥 Usuarios (4 total)
- **demo@versu.ai** - Usuario demo principal
- **maria@empresa.com** - María González  
- **carlos@startup.com** - Carlos Ramírez
- **admin@versu.ai** - Usuario administrador

### 💬 Conversaciones (49 total)
- **Distribuidas en 30 días** pasados
- **Múltiples canales:** Web (50%), WhatsApp (30%), Instagram (20%)
- **Estados variados:** 70% cerradas, 30% abiertas
- **Ratings diversos:** Distribución realista 1-5 estrellas

### 📝 Mensajes (178 total)  
- **Contenido realista** de soporte al cliente
- **Alternancia USER/AI** natural
- **Timestamps apropiados** (2 min entre mensajes)
- **Respuestas contextuales** según el prompt usado

### 🤖 Prompts (7 total)
- **4 personalidades principales** activas
- **Diferentes estilos** de comunicación
- **Casos de uso variados** (soporte, ventas, técnico)

### Usuario Demo Rápido 🚀
- **Email:** demo@versu.ai  
- **Password:** No requerida
- **Acceso:** Botón "Probar Demo" en login
- **Datos:** Incluye todas las conversaciones de ejemplo

---

## 🔄 Mantenimiento y Actualizaciones

### Actualizar Dependencias

```bash
# Backend - dentro del contenedor
docker-compose exec backend npm update

# Frontend - dentro del contenedor  
docker-compose exec frontend npm update

# Reconstruir con nuevas dependencias
docker-compose build --no-cache
```

### Backup de Base de Datos

```bash
# Crear backup
docker-compose exec db pg_dump -U postgres versu_ai_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose exec -T db psql -U postgres versu_ai_db < backup_20241201.sql
```

### Logs y Debugging

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Ver logs con timestamps
docker-compose logs -f -t backend
```

### Limpieza y Reset Completo

```bash
# Detener y eliminar todo (incluye volúmenes)
docker-compose down -v

# Eliminar imágenes del proyecto
docker rmi versu-ai-challenge_frontend versu-ai-challenge_backend

# Limpiar cache de Docker
docker system prune -f

# Reiniciar desde cero
docker-compose up --build -d
```

---

## 🎯 Próximas Mejoras Planificadas

### 🔮 Roadmap Futuro

- **🔔 Notificaciones Push** - Alertas en tiempo real
- **📱 App Móvil** - React Native companion
- **🌍 Internacionalización** - Soporte multi-idioma
- **📈 Analytics Avanzado** - Machine Learning insights
- **🔗 Integraciones** - Slack, Teams, Discord
- **🎨 Temas Personalizables** - Dark mode, branded themes
- **📊 Reportes PDF** - Exportación de analytics
- **🤖 Más Proveedores IA** - Claude, Gemini, etc.

### 🔧 Mejoras Técnicas

- **⚡ Performance** - Optimización de queries
- **🔒 Seguridad** - Rate limiting, encriptación
- **📦 Microservicios** - Arquitectura escalable
- **☁️ Cloud Deploy** - AWS, GCP, Azure ready
- **🧪 Testing** - Unit, integration, e2e tests
- **📝 Documentación API** - Swagger/OpenAPI

---

## 📞 Soporte y Contacto

### 🆘 Si necesitas ayuda:

1. **📖 Revisa primero:** [🐛 Solución de Problemas](#-solución-de-problemas)
2. **🔍 Verifica logs:** `docker-compose logs -f`
3. **🔄 Reinicia servicios:** `docker-compose restart`
4. **🧹 Reset completo:** `docker-compose down -v && docker-compose up -d`

### 📧 Contacto

- **GitHub Issues:** Para reportar bugs o solicitar features
- **Email:** Para consultas técnicas específicas
- **Documentación:** Este README cubre la mayoría de casos

---

## 🏆 Reconocimientos

### 🛠️ Herramientas de IA Utilizadas

Durante el desarrollo de este proyecto se utilizaron las siguientes herramientas:
- **Claude 3.5 Sonnet** - Asistencia en arquitectura y debugging
- **Cursor AI** - Autocompletado de código y refactoring
- **ChatGPT** - Documentación y solución de problemas específicos

### 📚 Inspiración y Referencias

- **Design System:** Material Design y Tailwind UI
- **Architecture:** Clean Architecture y Atomic Design
- **Best Practices:** React Query patterns y TypeScript strict mode

---

## ⭐ ¡Gracias por Explorar Versu AI Dashboard!

Este proyecto demuestra una implementación completa y profesional de un dashboard de conversaciones de IA con:

- ✅ **Arquitectura moderna y escalable**
- ✅ **Código limpio y bien documentado**  
- ✅ **Experiencia de usuario optimizada**
- ✅ **Análisis de datos en tiempo real**
- ✅ **Setup fácil y despliegue rápido**
- ✅ **Documentación exhaustiva**

### 🌟 ¿Te gustó el proyecto?

- **⭐ Dale una estrella** en GitHub si te pareció útil
- **🔄 Fork el repo** para crear tu propia versión
- **📝 Reporta issues** para ayudar a mejorarlo
- **💡 Sugiere features** para futuras versiones

### 🚀 ¿Quieres contribuir?

1. Fork del repositorio
2. Crea una branch para tu feature
3. Commit tus cambios
4. Push a la branch
5. Abre un Pull Request

---

**¡Disfruta explorando el mundo de los dashboards de IA! 🤖✨** 