---
type: requirement
kind: non-functional
id: NFR-018
slug: NFR-018-verificacion-demostrada-no-declarada
title: "Verificación demostrada, no declarada"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-018 — Verificación demostrada, no declarada

## Descripción

El sistema SHALL exigir evidencia de funcionamiento (ejecución de pruebas,
reportes de revisión) en lugar de aceptar la afirmación del agente de que terminó. Todo gate
SHALL producir un artefacto de reporte auditable.

## Criterios de verificación

Cada fase con gate deja su reporte en el directorio de la historia
(`analyze.md`, `implement-report.md`, `code-review-report.md`, `verify-report.md`,
`acceptance-report.md`).

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.7 Calidad y verificación
