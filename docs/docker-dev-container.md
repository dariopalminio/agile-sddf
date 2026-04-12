# 🐳 Guía Completa: Entorno de Desarrollo React con Docker + VSCode Dev Containers

## 🎯 Objetivo
Tener un entorno de desarrollo completamente aislado usando Docker, donde:
El proyecto React corre dentro de un contenedor
VSCode se conecta directamente al contenedor
Hot reload funciona correctamente
No se ensucia el sistema host (Windows 11)

## 🧠 Conceptos Clave
Dockerfile de producción ≠ Dockerfile de desarrollo
El contenedor de desarrollo debe ejecutar npm run dev
Se usa docker-compose para montar volúmenes y facilitar desarrollo
VSCode se conecta al contenedor usando Dev Containers

## 📁 Estructura del Proyecto
kanban-flight-sim/
│
├── Dockerfile.dev
├── docker-compose.dev.yml
├── package.json
├── package-lock.json
│
└── .devcontainer/
    └── devcontainer.json


## 🧱 Paso 1: Dockerfile de Desarrollo
Crear archivo Dockerfile.dev:
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

⚠️ Nota Importante
❌ NO usar:
RUN npm install -g npm@latest

Esto rompe dependencias internas en Alpine.

## 🧱 Paso 2: docker-compose para Desarrollo
Crear archivo docker-compose.dev.yml:
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: react-dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    stdin_open: true
    tty: true

⚠️ Nota
Eliminar la propiedad version, ya que es obsoleta en Docker Compose v2.

## 🧱 Paso 3: Levantar el Contenedor
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up

Luego abrir en navegador:
http://localhost:5173


## 🧱 Paso 4: Configurar VSCode Dev Containers
Crear carpeta:
.devcontainer/

Crear archivo .devcontainer/devcontainer.json:
{
  "name": "React Dev Container",
  "dockerComposeFile": "../docker-compose.dev.yml",
  "service": "app",
  "workspaceFolder": "/app",
  "forwardPorts": [5173],
  "customizations": {
    "vscode": {
      "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint"
      ]
    }
  }
}

⚠️ Problema Común Solucionado
Error:
The system cannot find the file specified

✔ Solución:
Usar ruta relativa correcta:
"dockerComposeFile": "../docker-compose.dev.yml"


## 🧱 Paso 5: Abrir Proyecto en Contenedor
En VSCode:
Ctrl + Shift + P
→ Dev Containers: Rebuild and Reopen in Container


## 🔥 Estado Final Esperado
Contenedor corriendo
Aplicación disponible en http://localhost:5173
VSCode conectado al contenedor
Hot reload funcionando
Ejemplo de log esperado:
VITE ready in XXX ms
Local: http://localhost:5173/


## ⚠️ Problemas Comunes y Soluciones

❌ Error npm (MODULE_NOT_FOUND)
Causa: actualizar npm dentro del contenedor
✔ Solución: eliminar
RUN npm install -g npm@latest


❌ Hot reload no funciona
✔ Solución:
environment:
  - CHOKIDAR_USEPOLLING=true


❌ Problemas con node_modules
✔ Solución:
volumes:
  - /app/node_modules


❌ Warning docker-compose version obsoleta
✔ Solución:
Eliminar:
version: "3.9"


## 🚀 Resultado
Ahora tienes:
Entorno de desarrollo aislado
Configuración reproducible
Integración con VSCode
Base lista para escalar (CI/CD, testing, etc.)

## 🔜 Próximos Pasos (Opcional)
Integrar herramientas de IA (Claude, Copilot)
Optimizar performance en WSL2
Agregar debugging dentro del contenedor
Configurar entorno multi-servicio (backend + frontend)

🏁 Conclusión
Se ha logrado un entorno de desarrollo profesional tipo "Codespaces local", completamente aislado y reproducible usando Docker y VSCode.

## 🧭 Salir de VSCode del contenedor
Cuando estás dentro del contenedor, VSCode realmente está “conectado remotamente”. Para salir:

✅ Opción 1 (la más rápida)
Ctrl + Shift + P
→ Dev Containers: Reopen Folder Locally
👉 Esto:
Cierra la conexión al contenedor
Vuelve a tu VSCode normal (Windows)

✅ Opción 2 (manual)
Simplemente:
Cierra la ventana de VSCode
Vuelve a abrir el proyecto normalmente

🛑 Apagar el contenedor
Tienes varias formas según qué tan limpio quieres hacerlo:

🔹 Opción A: Desde terminal (recomendado)
En una terminal (fuera o dentro de VSCode):
docker compose -f docker-compose.dev.yml down
👉 Esto:
Detiene el contenedor
Elimina la red
Mantiene la imagen (rápido para volver a levantar)

🔹 Opción B: Solo detener (sin eliminar)
docker compose -f docker-compose.dev.yml stop
👉 Esto:
Solo lo pausa
Más rápido para reanudar con start

🔹 Opción C: Desde Docker Desktop (UI)
Si usas Docker Desktop:
Ve a Containers
Busca react-dev
Click en Stop

## 🔥 Flujo recomendado (pro)

👉 Para desarrollo diario:
Trabajas en container
Sales con:

 Reopen Folder Locally


Paras todo:

 docker compose down



## ⚠️ Detalle importante
Si no haces down, el contenedor queda corriendo en background 👀
Puedes verificar:
docker ps

## 🧼 Limpieza (nivel pro)
Si quieres dejar todo limpio:
docker compose -f docker-compose.dev.yml down --volumes --remove-orphans

## 🧠 Tip experto
Si trabajas mucho con esto, puedes crear alias:
alias dcup="docker compose -f docker-compose.dev.yml up"
alias dcdown="docker compose -f docker-compose.dev.yml down"

## 🚀 Resumen rápido
Salir de VSCode → Reopen Folder Locally
Apagar container → docker compose down
