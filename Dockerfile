# Etapa 1: Construcción de la aplicación con Nuxt
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias y construir el proyecto
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Genera los archivos estáticos de la aplicación
RUN npm run generate

# Etapa 2: Configurar el servidor con Express para servir los archivos estáticos
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solamente los archivos necesarios para ejecutar el servidor
COPY package*.json ./
RUN npm install 

# Copia los archivos generados y el servidor Express desde la etapa de construcción
COPY --from=build /app/.output/public /app/public
COPY server.js /app/server.js

# Exponer el puerto en el que el servidor estará escuchando
EXPOSE 3000

# Iniciar el servidor
CMD ["node", "server.js"]
