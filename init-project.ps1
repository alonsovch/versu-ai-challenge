#!/usr/bin/env pwsh

Write-Host "🚀 Iniciando configuración del proyecto Versu AI Dashboard..." -ForegroundColor Green

# Verificar que Docker esté corriendo
try {
    docker info | Out-Null
}
catch {
    Write-Host "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar que exista el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Por favor copia .env.example a .env y configura las variables." -ForegroundColor Yellow
    Write-Host "Puedes usar: Copy-Item .env.example .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Construyendo imágenes Docker..." -ForegroundColor Blue
docker-compose build

Write-Host "🗄️ Iniciando base de datos..." -ForegroundColor Blue
docker-compose up -d db

Write-Host "⏳ Esperando que la base de datos esté lista..." -ForegroundColor Blue
Start-Sleep -Seconds 10

Write-Host "🔄 Ejecutando migraciones de Prisma..." -ForegroundColor Blue
docker-compose run --rm backend npm run db:migrate

Write-Host "🌱 Ejecutando seed de datos iniciales..." -ForegroundColor Blue
docker-compose run --rm backend npm run db:seed

Write-Host "🚀 Iniciando todos los servicios..." -ForegroundColor Blue
docker-compose up -d

Write-Host ""
Write-Host "✅ ¡Proyecto inicializado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000"
Write-Host "   - Backend API: http://localhost:3001/api"
Write-Host "   - Base de datos: localhost:5432"
Write-Host ""
Write-Host "📝 Para ver los logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f"
Write-Host ""
Write-Host "🛑 Para detener el proyecto:" -ForegroundColor Yellow
Write-Host "   docker-compose down" 