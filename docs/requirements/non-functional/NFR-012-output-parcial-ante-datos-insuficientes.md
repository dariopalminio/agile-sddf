---
type: requirement
kind: non-functional
id: NFR-012
slug: NFR-012-output-parcial-ante-datos-insuficientes
title: "Output parcial ante datos insuficientes"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-012 — Output parcial ante datos insuficientes

## Descripción

El sistema SHALL producir el documento de salida aunque algunas secciones no
puedan completarse, marcándolas `<!-- PENDING MANUAL REVIEW -->`. Output parcial es preferible
a ningún output.

## Criterios de verificación

`reverse-engineering` genera `project.md` aun si falta alguno de los
archivos intermedios de los agentes.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.5 Trazabilidad y auditoría
