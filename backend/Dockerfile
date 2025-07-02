FROM node:18

WORKDIR /app

# Actualizar paquetes del sistema e instalar dependencias necesarias
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Instalar dependencias globales necesarias
RUN npm install -g prisma

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Crear script de inicialización
RUN echo '#!/bin/bash\nset -e\n\necho "🔧 Ejecutando migraciones de Prisma..."\nnpx prisma db push --force-reset\n\necho "🌱 Ejecutando seed de la base de datos..."\nnpm run seed\n\necho "🚀 Iniciando aplicación..."\nexec "$@"' > /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Exponer puerto
EXPOSE 3001

# Usar el script de inicialización como entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Comando por defecto (se sobreescribe en docker-compose)
CMD ["npm", "run", "dev"] 