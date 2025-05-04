FROM node:18-alpine

# No need for native dependencies with bcryptjs (pure JS implementation)
# RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
# Install bcryptjs explicitly
RUN npm install bcryptjs
# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copiar el resto de archivos del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build

# Exponer el puerto que usa la aplicación
EXPOSE 8080

# Usar variables de entorno para la base de datos
ENV NODE_ENV=development
ENV DB_HOST=padelucn-db
ENV DB_PORT=5432
ENV DB_USER=ingeso
ENV DB_PASSWORD=12342
ENV DB_NAME=padelucn
ENV PORT=8080
# Habilitar crypto globalmente
ENV NODE_OPTIONS=--experimental-global-webcrypto

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]