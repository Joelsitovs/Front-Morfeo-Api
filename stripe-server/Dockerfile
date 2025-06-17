# Usa imagen oficial Node.js
FROM node:18-slim

# Directorio de trabajo
WORKDIR /app

# Copia archivos
COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto que usará Cloud Run
EXPOSE 4242

# Comando para iniciar el servidor
CMD ["npm", "start"]
