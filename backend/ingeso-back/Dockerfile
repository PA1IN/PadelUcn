FROM node:18-alpine

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias incluyendo las de desarrollo (necesarias para compilar)
RUN npm install
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

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]