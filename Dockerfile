# STAGE 1: Prepare & Build
FROM node:18-alpine as builder

# Establece directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN npm run build

# STAGE 2: Production
FROM node:18-alpine

# Establece directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios desde la imagen de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["node", "dist/main"]

# STAGE 3: Test
FROM node:18-alpine as test

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos de configuración y el código fuente
COPY package*.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY .env ./
COPY src ./src

# Instala dependencias, incluyendo las de desarrollo
RUN npm install

# Corre los tests
RUN npm run test
