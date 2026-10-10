---
type: requirement
kind: non-functional
id: NFR-004
slug: NFR-004-superficie-ejecutable-minima-en-node-js
title: "Superficie ejecutable mínima en Node.js"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-004 — Superficie ejecutable mínima en Node.js

## Descripción

La única parte ejecutable SHALL ser Node.js ≥ 18 para instalación,
empaquetado y mantenimiento (`scripts/`), con `fs-extra` como única dependencia de runtime. El
repositorio NO SHALL declarar pipeline propio de build, test o lint (`package.json` solo
declara `postinstall`).

## Criterios de verificación

`package.json` declara `engines.node >= 18` y una sola dependencia.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.2 Formato declarativo y superficie ejecutable
