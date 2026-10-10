---
type: requirement
kind: non-functional
id: NFR-024
slug: NFR-024-entorno-de-desarrollo-reproducible-con-docker
title: "Entorno de desarrollo reproducible con Docker"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-024 — Entorno de desarrollo reproducible con Docker

## Descripción

El sistema SHALL proveer un entorno reproducible mediante `Dockerfile.dev` y
`docker-compose.dev.yml` sobre imagen base `debian:bookworm-slim`, y configuración de VS Code
Dev Container con las extensiones de trabajo del framework.

## Criterios de verificación

`docker compose -f docker-compose.dev.yml up` levanta el entorno sin
errores; `.devcontainer/devcontainer.json` declara las extensiones requeridas.

## Atributos

- **Prioridad**: Media
- **Categoría de origen**: 2.2.10 Entorno de desarrollo
