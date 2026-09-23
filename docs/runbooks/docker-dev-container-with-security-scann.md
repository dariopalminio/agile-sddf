---
type: runbook
slug: docker-dev-container-with-security-scann
title: Integrar Skill Shielder en Dockerfile.dev
---

# Integrar Skill Shielder en Dockerfile.dev

> **Nota histórica actualizada:** este documento conserva el contexto de la integración. La fuente operativa es [`Dockerfile.dev`](../../Dockerfile.dev), que fija Skill Shielder a `b204cecb2d26fccaca0e4121eae94e352e210126` y comprueba que `HEAD` coincide antes de exponer `shield`.

## Context

El contenedor de desarrollo (Dockerfile.dev) se usa con VSCode Dev Containers. 
El proyecto de trabajo tiene skills que se necesitan auditar su seguridad con Skill Security Scanner de Skill Shielder. Skill Shielder se enfoca en auditoría de confianza de skills de terceros y busca inyección de prompts y comandos peligrosos.

https://github.com/p3nchan/skill-shielder

Se puede ejecutar Skill Shielder para auditar seguridad de skills bajo demanda desde dentro del contenedor, sin depender de la instalación del host.

La solución es clonar una revisión inmutable de Skill Shielder durante el build, verificar `HEAD` y exponer el comando `shield` en el PATH del sistema.

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

ARG SKILL_SHIELDER_REVISION=b204cecb2d26fccaca0e4121eae94e352e210126

RUN git clone --no-checkout https://github.com/p3nchan/skill-shielder.git /opt/skill-shielder \
    && git -C /opt/skill-shielder checkout --detach "$SKILL_SHIELDER_REVISION" \
    && test "$(git -C /opt/skill-shielder rev-parse HEAD)" = "$SKILL_SHIELDER_REVISION" \
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

# Auditar todos los skills del proyecto, uno por uno

audit_exit=0
for skill in /app/skills/*; do
  [ -f "$skill/SKILL.md" ] || continue
  shield "$skill"
  skill_exit=$?
  case "$skill_exit" in
    0|1) ;;
    2) audit_exit=2 ;;
    *) audit_exit=3 ;;
  esac
done
exit "$audit_exit"

# Auditar un skill concreto

shield /app/skills/story-creation
Exit codes de Skill Shielder: 0 = limpio, 1 = warnings, 2 = problemas críticos;
3 u otro valor = error operativo. La CI conserva warnings en el artefacto para
triage, pero solo bloquea ante un crítico o un error operativo. Nunca usar
`shield /app/skills`: ese target mezcla evidencia de skills independientes y
puede producir un `EXFIL_RISK` falso.

## Verification

docker build -f Dockerfile.dev -t agile-sddf-dev:local .
docker run --rm agile-sddf-dev:local shield --version
docker run --rm -v $(pwd):/app agile-sddf-dev:local shield /app/skills/story-creation

