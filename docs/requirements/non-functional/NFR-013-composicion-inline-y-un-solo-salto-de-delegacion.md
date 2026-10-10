---
type: requirement
kind: non-functional
id: NFR-013
slug: NFR-013-composicion-inline-y-un-solo-salto-de-delegacion
title: "Composición inline y un solo salto de delegación"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-013 — Composición inline y un solo salto de delegación

## Descripción

El sistema SHALL admitir dos mecanismos de invocación: **composición inline**
(skill → skill, misma sesión, cadenas cortas porque el contexto se acumula) y **delegación**
(skill → subagente, contexto nuevo y aislado). Solo la sesión que ejecuta skills SHALL delegar
en subagentes; **un subagente NUNCA SHALL delegar en otro subagente**. Los subagentes no
invocan skills orquestadores; si necesitan su lógica, el orquestador se la pasa en el prompt o
referencia el archivo para que lo lean.

## Criterios de verificación

Ningún `*.agent.md` ni agente local invoca la herramienta de
delegación. Ver `[[best-practices-for-skills]]` y ADR-0002.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.6 Arquitectura de agentes y gestión de contexto
