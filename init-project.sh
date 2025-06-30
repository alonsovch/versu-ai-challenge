#!/bin/bash

echo "🚀 Iniciando configuración del proyecto Versu AI Dashboard..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Verificar que exista el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Por favor copia .env.example a .env y configura las variables."
    echo "Puedes usar: cp .env.example .env"
    exit 1
fi

echo "📦 Construyendo imágenes Docker..."
docker-compose build

echo "🗄️ Iniciando base de datos..."
docker-compose up -d db

echo "⏳ Esperando que la base de datos esté lista..."
sleep 10

echo "🔄 Ejecutando migraciones de Prisma..."
docker-compose run --rm backend npm run db:migrate

echo "🌱 Ejecutando seed de datos iniciales..."
docker-compose run --rm backend npm run db:seed

echo "🚀 Iniciando todos los servicios..."
docker-compose up -d

echo ""
echo "✅ ¡Proyecto inicializado correctamente!"
echo ""
echo "📍 URLs disponibles:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001/api"
echo "   - Base de datos: localhost:5432"
echo ""
echo "📝 Para ver los logs en tiempo real:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener el proyecto:"
echo "   docker-compose down" 