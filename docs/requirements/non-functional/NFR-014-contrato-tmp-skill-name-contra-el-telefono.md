---
type: requirement
kind: non-functional
id: NFR-014
slug: NFR-014-contrato-tmp-skill-name-contra-el-telefono
title: "Contrato `.tmp/<skill-name>/` contra el «teléfono descompuesto»"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-014 — Contrato `.tmp/<skill-name>/` contra el «teléfono descompuesto»

## Descripción

El agente orquestador NO SHALL pasar a sus subagentes todo su contexto
heredado. Cada subagente SHALL escribir su resultado en `.tmp/<skill-name>/` y devolver el
control; el orquestador SHALL leer únicamente esos archivos para consolidar. El directorio
`.tmp/` NO SHALL versionarse.

## Criterios de verificación

`.tmp` está en `.gitignore`; los skills multiagente
(`reverse-engineering`, `story-code-review`, `security-audit`, `story-verify`) escriben y leen
por ese canal.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.6 Arquitectura de agentes y gestión de contexto
