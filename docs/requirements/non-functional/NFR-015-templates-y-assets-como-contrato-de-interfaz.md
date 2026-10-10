---
type: requirement
kind: non-functional
id: NFR-015
slug: NFR-015-templates-y-assets-como-contrato-de-interfaz
title: "Templates y assets como contrato de interfaz"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-015 — Templates y assets como contrato de interfaz

## Descripción

Los archivos en `*/assets/*.md` y en `$SPECS_BASE/specs/templates/` SHALL ser
el contrato entre skills y agentes. Un cambio en un template SHALL alterar automáticamente el
comportamiento de todos los agentes que lo leen en runtime, sin requerir cambios en el código
del agente.

## Criterios de verificación

Al añadir una sección a `project-template.md`, los agentes
`project-pm` y `project-architect` generan preguntas para ella sin editar su definición.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.6 Arquitectura de agentes y gestión de contexto
