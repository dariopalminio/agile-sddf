---
type: requirement
kind: non-functional
id: NFR-023
slug: NFR-023-idempotencia-declarada-de-los-skills-de
title: "Idempotencia declarada de los skills de inicialización"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-023 — Idempotencia declarada de los skills de inicialización

## Descripción

Los skills de inicialización SHALL declarar explícitamente que no sobrescriben
archivos existentes, y SHALL poder ejecutarse repetidamente sin efectos destructivos.

## Criterios de verificación

Ejecutar `sddf-init` dos veces seguidas no altera ningún archivo
creado en la primera ejecución.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.9 Usabilidad y experiencia del desarrollador
