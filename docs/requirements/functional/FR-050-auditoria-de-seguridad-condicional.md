---
type: requirement
kind: functional
id: FR-050
slug: FR-050-auditoria-de-seguridad-condicional
title: "Auditoría de seguridad condicional"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-050 — Auditoría de seguridad condicional

## Descripción

El sistema SHALL analizar el código fuente contra un checklist de seguridad
condicional (OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs), detectando primero el
contexto tecnológico para aplicar solo los controles pertinentes, y produciendo
`audit-report.md`. SHALL ser invocable de forma autónoma o como parte de la revisión de código.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-005
- **Fuente**: `security-audit` → 3 agentes locales · STORY-073 · EPIC-13, EPIC-16
- **Categoría de origen**: 2.1.8 Documentación, metadatos y seguridad
