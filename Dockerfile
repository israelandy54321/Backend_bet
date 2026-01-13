# Uso una imagen base de Node.js versión 18
FROM node:18

# Defino el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copio solo el package.json al contenedor
# Esto permite aprovechar la cache de Docker
COPY package.json .

# Instalo las dependencias del proyecto (express, cors, pg, etc.)
RUN npm install

# Copio todo el resto del proyecto al contenedor
COPY . .

# Expongo el puerto 3001 para que el contenedor pueda recibir peticiones
EXPOSE 3001

# Comando que se ejecuta cuando el contenedor arranca
# Inicia el servidor Node.js
CMD ["node", "index.js"]
