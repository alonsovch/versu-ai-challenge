FROM node:18-alpine

WORKDIR /app

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

# Exponer puerto
EXPOSE 3001

# Comando por defecto (se sobreescribe en docker-compose)
CMD ["npm", "run", "dev"] 