---
type: requirement
kind: non-functional
id: NFR-020
slug: NFR-020-ausencia-de-secretos-en-el-paquete-distribuido
title: "Ausencia de secretos en el paquete distribuido"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-020 — Ausencia de secretos en el paquete distribuido

## Descripción

El paquete publicado NO SHALL incluir secretos, credenciales ni archivos de
desarrollo. El array `files` de `package.json` SHALL delimitar explícitamente lo publicable.

## Criterios de verificación

`npm pack --dry-run` no incluye archivos inesperados; `.env` y
variantes están en `.gitignore`.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.8 Seguridad
