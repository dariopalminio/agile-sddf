---
alwaysApply: false
type: story
id: STORY-117
kind: chore
slug: STORY-117-verificar-cierre-epic-21
title: "Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-09
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-113-project-flow-sin-01-projects
  - STORY-114-migrate-specs-3-levels
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Verificar `sddf.config.yaml` y los modos SDD sobre la estructura de dos niveles

**Como** mantenedor de SDDF que va a cerrar EPIC-21 y publicar la versión major  
**Quiero** comprobar con evidencia ejecutada que se cumplen los criterios de salida y los smoke tests de la épica, y que los flujos Spec-First y Spec-Anchored funcionan de punta a punta sobre la nueva estructura  
**Para** publicar el breaking change sabiendo que ningún flujo del framework sigue dependiendo de `specs/01-projects/` ni de las rutas numeradas, en lugar de descubrirlo por reportes de usuarios

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Criterios de salida verificados en este repositorio
```gherkin
Dado que STORY-104 a STORY-116 están en DONE
Cuando el mantenedor verifica en este repositorio cada criterio de salida de EPIC-21
Entonces "verify-report.md" de esta historia registra cada criterio de salida con resultado "PASS", el comando ejecutado y su salida
  Y ningún "sddf.config.yaml" versionado contiene "01-projects", "02-epics" ni "03-stories"
```

### AC-2 — Escenario principal – Smoke tests y flujos de modo sobre repositorios de prueba
```gherkin
Escenario: verificación ejecutada sobre repositorios temporales
  Dado un repositorio de prueba en el estado "<estado inicial>"
  Cuando el mantenedor ejecuta "<verificación>"
  Entonces se cumple "<resultado esperado>"
    Y "verify-report.md" registra la verificación como "PASS" con su evidencia
Ejemplos:
  | estado inicial                  | verificación                                                              | resultado esperado                                                                              |
  | sin "docs/"                     | SMOKE-1 de EPIC-21 ("/memory-system scaffold")                            | solo "specs/epics/" y "specs/stories/" en "specs/", con "product/" y "requirements/" sembrados   |
  | "specs/" de tres niveles        | SMOKE-2 de EPIC-21 ("/memory-system migrate --from=specs-3-levels")       | colapso sin archivos perdidos ni wikilinks rotos                                                 |
  | "specs/" de tres niveles        | SMOKE-3 de EPIC-21 (migración completa e "index")                         | todos los "[[EPIC-*]]" y "[[STORY-*]]" resuelven y "index.md" se regenera                        |
  | inicializado con "/sddf-init"   | Spec-First: "/project-flow" → "/epic-from-project-plan" → "/story-specify" | artefactos en "product/", "requirements/", "specs/epics/" y "specs/stories/"; nada en "01-projects/" |
  | con una historia implementada   | Spec-Anchored: "/memory-system check" y "index" tras "story-implement"    | "story.md" sigue en "specs/stories/", indexado, y "check" devuelve exit code 0                   |
```

### AC-3 — Escenario de error – Un criterio no se cumple
```gherkin
Dado que al menos una verificación de AC-1 o AC-2 no obtiene el resultado esperado
Cuando el mantenedor completa la verificación
Entonces "verify-report.md" la registra como "FAIL" con la evidencia y la historia de EPIC-21 responsable de corregirla
  Y esta historia no pasa a ACCEPTANCE
  Pero las verificaciones que sí pasaron no se repiten tras corregir, salvo que la corrección toque su área
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Reproducibilidad:** cada verificación de AC-2 se ejecuta sobre un directorio temporal creado desde cero, sin depender del estado de este repositorio, y su comando queda registrado para poder repetirla.
- **CNF-2 — Evidencia en el artefacto estándar:** la evidencia vive en `verify-report.md` de la historia (fase VERIFY), no en un artefacto nuevo.

## Fuera de alcance (Non-Goals)

- **Cambiar `sddf.config.yaml`:** el 2026-10-05 ningún `sddf.config.yaml` versionado tiene rutas de `specs/` (su única ruta es `root: docs`). AC-1 lo verifica en lugar de modificarlo.
- **Spec-as-Source:** el framework no ofrece un flujo que edite solo la especificación y regenere el código. No hay comportamiento que ejecutar; la compatibilidad estructural ya está analizada en el insight de la épica y no se verifica aquí.
- **Corregir lo que falle:** esta historia solo detecta y atribuye (AC-3). Las correcciones van en la historia responsable o en una nueva.
- **Publicar la versión 4.0.0.**

## 📎 Notas / contexto adicional

- **Origen:** criterios de salida y smoke tests 1–3 de [[EPIC-21-colapsar-specs-dos-niveles]], incluido "Los tres modos SDD funcionan con la nueva estructura", y [[ADR-0013-eliminar-specs-01-projects]] (rationale 6, compatibilidad con los modos SDD).
- **Criterios de salida que se entregan entre varias historias:** AC-1 los verifica completos en este repositorio, porque ninguna historia de la épica los entrega por sí sola:
  - `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`) (lo entregan STORY-108 y STORY-123).
  - `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md` (lo entregan STORY-104 a STORY-107).
  - Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/` (lo entregan STORY-108 y STORY-113).
  - Los modos SDD Spec-First y Spec-Anchored funcionan con la nueva estructura (AC-2, filas Spec-First y Spec-Anchored).
- **Reformulación:** la línea original de la épica pedía "actualizar `sddf.config.yaml` y verificar los tres modos SDD". Como la config no tiene rutas que cambiar y los modos no son configuraciones ejecutables sino niveles de madurez (`docs/guides/sdd.md`, `docs/constitution.md`), esta historia pasa a ser la verificación de cierre de la épica.
- **Terminología:** la épica y ADR-0013 dicen "Intent-First"; `docs/guides/sdd.md` y `docs/constitution.md` llaman a ese nivel **Spec-First** ("intent-first" es el enfoque general). Esta historia usa Spec-First. Conviene alinear el término en la épica y en el ADR (lo puede recoger STORY-116).
- **Infraestructura existente:** `npm run test:e2e:smoke` y los fixtures de `skills/memory-system/examples/` pueden servir de base para automatizar AC-2; si se automatiza, se decide en diseño.
- **Dependencia:** es la última historia de la épica y depende de STORY-104 a STORY-116 por definición.
