# ==============================================================================
# Multi-stage Dockerfile para la Aplicación Web Customers (React + Vite + Nginx)
# ==============================================================================

# Etapa 1: Compilación y ejecución de pruebas de la SPA con Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar manifiesto de dependencias y aprovechar cache
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Ejecutar suite de pruebas unitarias obligatorias antes de compilar
RUN npm run test

# Compilar bundle estático optimizado para producción
RUN npm run build

# Etapa 2: Servidor Web ultraligero Nginx Alpine
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copiar bundle compilado
COPY --from=builder /app/dist .

# Copiar configuración personalizada de Nginx para SPA y reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
