FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto (se sobreescribe en docker-compose)
CMD ["npm", "run", "dev"] 