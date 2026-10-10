---
type: requirement
kind: functional
id: FR-008
slug: FR-008-captura-de-intencion-inicial-del-proyecto
title: "Captura de intención inicial del proyecto"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-008 — Captura de intención inicial del proyecto

## Descripción

El sistema SHALL conducir una entrevista interactiva guiada para capturar
nombre, problema, visión, beneficios clave, criterios de éxito, restricciones y non-goals,
escribiendo el resultado en `$SPECS_BASE/specs/01-projects/<PROJ-NN-slug>/project-intent.md`
con `substatus: IN-PROGRESS`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: `project-begin` → agente `project-pm` · STORY-001 · EPIC-02
- **Categoría de origen**: 2.1.2 Pipeline de especificación de proyecto (nivel L3)
