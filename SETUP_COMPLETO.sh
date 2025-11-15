#!/bin/bash

# ========================================
# VITRINE PRO - SETUP COMPLETO
# ========================================

echo "🚀 Iniciando setup do Vitrine Pro..."

# 1. Criar novo projeto
echo "📦 Criando projeto..."
npm create vite@latest vitrine-pro -- --template react-ts
cd vitrine-pro

# 2. Instalar dependências
echo "📚 Instalando dependências..."
npm install @supabase/supabase-js lucide-react
npm install -D tailwindcss postcss autoprefixer
npm install -D terser

# 3. Configurar Tailwind
echo "🎨 Configurando Tailwind..."
npx tailwindcss init -p

# 4. Criar arquivo .env
echo "🔐 Criando .env..."
cat > .env << 'ENVFILE'
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHFzeWxyeGV2aHhjdW1wZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjA0MzYsImV4cCI6MjA3NjYzNjQzNn0.PjbhUvWfDraChx6MGsTd6vSci2Qo2C5bSdGM26AtO7s
VITE_SUPABASE_URL=https://melqsylrxevhxcumpfut.supabase.co
ENVFILE

echo "✅ Setup básico concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. cd vitrine-pro"
echo "2. Copie os arquivos do projeto original"
echo "3. npm install"
echo "4. npm run dev"
