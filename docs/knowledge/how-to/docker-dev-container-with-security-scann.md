# Integrar Skill Shielder en Dockerfile.dev

## Context

El contenedor de desarrollo (Dockerfile.dev) se usa con VSCode Dev Containers. 
El proyecto de trabajo tiene skills que se necesitan auditar su seguridad con Skill Security Scanner de Skill Shielder. Skill Shielder se enfoca en auditoría de confianza de skills de terceros y busca inyección de prompts y comandos peligrosos.

https://github.com/p3nchan/skill-shielder

Se puede ejecutar Skill Shielder para auditar seguridad de skills bajo demanda desde dentro del contenedor, sin depender de la instalación del host.

La solución es clonar skill-shielder durante el build de la imagen y exponer el comando shield en el PATH del sistema.

## Cambio a realizar

Archivo: Dockerfile.dev

Agregar un bloque RUN (como root, antes del USER appuser) que:

Clona el repo en /opt/skill-shielder
Hace ejecutables todos los .sh
Crea un symlink /usr/local/bin/shield → /opt/skill-shielder/shield.sh
FROM debian:bookworm-slim@sha256:0104b334637a5f19aa9c983a91b54c89887c0984081f2068983107a6f6c21eeb

RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && apt-get install -y --no-install-recommends \
    git \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Skill Shielder for on-demand skill auditing

RUN git clone https://github.com/p3nchan/skill-shielder.git /opt/skill-shielder \
    && chmod +x /opt/skill-shielder/shield.sh /opt/skill-shielder/scanners/*.sh \
    && ln -s /opt/skill-shielder/shield.sh /usr/local/bin/shield

ARG USER_UID=1001
ARG USER_GID=1001
RUN groupadd -g ${USER_GID} appuser \
    && useradd -u ${USER_UID} -g appuser -m appuser

WORKDIR /app

COPY . .

USER appuser
CMD ["bash"]
Uso desde el contenedor

# Auditar todos los skills del proyecto

shield .claude/skills

# Auditar un skill concreto

shield .claude/skills/story-creation
Exit codes: 0 = limpio, 1 = warnings, 2 = problemas críticos.

## Verification

docker build -f Dockerfile.dev -t agile-sddf-dev:local .
docker run --rm agile-sddf-dev:local shield --version
docker run --rm -v $(pwd):/app agile-sddf-dev:local shield /app/.claude/skills

