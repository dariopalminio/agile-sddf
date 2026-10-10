---
type: requirement
kind: non-functional
id: NFR-002
slug: NFR-002-independencia-del-cliente-de-ia-en-el-texto-de-los
title: "Independencia del cliente de IA en el texto de los skills"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-002 — Independencia del cliente de IA en el texto de los skills

## Descripción

Los `SKILL.md` NO SHALL contener referencias codificadas a un cliente concreto
(por ejemplo rutas `.claude/`). Las rutas de artefactos SHALL expresarse relativas a
`$SPECS_BASE`, y las de skills y agentes relativas a la raíz de instalación.

## Criterios de verificación

`grep -rl "\.claude/" skills/` no devuelve rutas operativas en la
lógica de ningún skill.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.1 Plataforma y compatibilidad de runtimes
