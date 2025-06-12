FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g @nestjs/cli
COPY . .
RUN npm run build
EXPOSE 8081
ENV NODE_ENV=development
ENV DB_HOST=padelucn-db
ENV DB_PORT=5432
ENV DB_USER=ingeso
ENV DB_PASSWORD=12342
ENV DB_NAME=padelucn
ENV PORT=8081
ENV NODE_OPTIONS=--experimental-global-webcrypto
CMD ["npm", "run", "start:prod"]