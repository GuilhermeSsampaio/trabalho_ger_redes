FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
# se houver package-lock.json prefira: RUN npm ci
RUN npm install --include=dev
COPY . .

# Ajuste a porta conforme package.json (Vite = 5173 por padrão)
EXPOSE 5173
CMD ["npm", "start"]