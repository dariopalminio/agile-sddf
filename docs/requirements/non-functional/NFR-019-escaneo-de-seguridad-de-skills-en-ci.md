---
type: requirement
kind: non-functional
id: NFR-019
slug: NFR-019-escaneo-de-seguridad-de-skills-en-ci
title: "Escaneo de seguridad de skills en CI"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-019 — Escaneo de seguridad de skills en CI

## Descripción

El repositorio SHALL ejecutar en integración continua un escaneo de seguridad
sobre los skills publicados (Skill Shielder) y sobre la imagen de desarrollo, de modo que
ningún skill con veredicto adverso llegue al paquete distribuido.

## Criterios de verificación

`.github/workflows/` contiene `skill-security-audit.yml` y
`docker-security.yml`, ambos en verde en la rama principal.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.8 Seguridad
