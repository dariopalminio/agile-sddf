---
alwaysApply: false
type: story
id: STORY-199
kind: feat
slug: STORY-199-sddf-init-y-preflight-adr-0023
title: "sddf-init y skill-preflight con el layout de ADR-0023"
status: COMPLETED
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-22
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: sddf-init y skill-preflight con el layout de ADR-0023

**Como** Solo Builder que inicializa o diagnostica un proyecto SDDF  
**Quiero** que `/sddf-init` cree `changes/`, `changes/archive/`, `specs/` y `workflow/`, que avise y no escriba ante `specs/flow/` o `specs/living/`, y que `/skill-preflight` informe esas rutas con las señales L4 y L5  
**Para** migrar un proyecto de 5.x sin crear dos ubicaciones para los mismos work items

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – inicialización limpia
```gherkin
Dado un repositorio sin estructura SDDF
Cuando el usuario ejecuta /sddf-init
Entonces existen "changes/", "changes/archive/", "specs/" y "workflow/" con su ".gitkeep"
```

### AC-2 — Escenario alternativo – layout de 5.x
```gherkin
Dado un repositorio con "specs/flow/" y "specs/living/" y sin "changes/"
Cuando el usuario ejecuta /sddf-init y luego /skill-preflight
Entonces sddf-init emite "Layout legado detectado" y no escribe nada
  Y skill-preflight emite las señales L4 y L5 como [WARNING] y remite a la guía de migración
```

## 📎 Notas / contexto adicional

- Cubre **CS-6** de EPIC-030.
- Evals nuevos: `sddf-init` TC-011 y `skill-preflight` TC-013.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
