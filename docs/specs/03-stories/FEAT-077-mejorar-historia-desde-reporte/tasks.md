---
alwaysApply: false
type: tasks
id: FEAT-077
slug: FEAT-077-mejorar-historia-desde-reporte
title: "Tasks: story-improve — Mejora automática de historia desde reporte FINVEST"
story: FEAT-077
design: FEAT-077
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-077-mejorar-historia-desde-reporte
---

<!-- Referencias -->
[[FEAT-077-mejorar-historia-desde-reporte]]

## 1. Setup — Estructura del skill

- [ ] T001 Crear el directorio `.claude/skills/story-improve/` con subdirectorios `assets/`, `examples/`, `agents/` y `evals/`
- [ ] T002 Revisar `.claude/skills/skill-master/assets/skill-template.md` y `docs/knowledge/guides/skill-structural-pattern.md` para confirmar el frontmatter y la estructura SKILL.md requeridos antes de escribir código

## 2. Componente principal — SKILL.md

- [ ] T003 Escribir el frontmatter YAML de `SKILL.md` con campos `name`, `description`, `triggers`, `inputs`, `outputs`, `flags` y referencia a `skill-preflight` como Paso 0 (// satisface: AC-1, AC-2)
- [ ] T004 Documentar en `SKILL.md` el Paso 0 (skill-preflight): verificación de SDDF_ROOT y SPECS_BASE antes de ejecutar cualquier lógica (// satisface: AC-1, AC-2)
- [ ] T005 Documentar en `SKILL.md` el Paso 1: resolución de la ruta del directorio de la historia mediante Glob `$SPECS_BASE/specs/stories/<FEAT-NNN>-*/` (// satisface: AC-1, AC-2)
- [ ] T006 Documentar en `SKILL.md` el Paso 2: lectura de `finvest-evaluation-report.md` — extracción de `decision:` desde frontmatter, tabla de scores `{ dimensión → score }` y sección "Comentarios y Recomendaciones" `{ dimensión → texto }` (// satisface: AC-1, AC-2)
- [ ] T007 Documentar en `SKILL.md` el gate de decisión: si `decision: APROBADA` imprimir `"<FEAT-NNN> ya tiene decisión APROBADA — no se realizan cambios"` y terminar sin escribir ningún archivo (// satisface: AC-2)
- [ ] T008 Documentar en `SKILL.md` el Paso 3: lectura completa de `story.md` — frontmatter, sección Como/Quiero/Para y criterios Gherkin (// satisface: AC-1)
- [ ] T009 Documentar en `SKILL.md` el Paso 4 (condicional): carga de historias hermanas con el mismo `parent:` o `related:` compartido solo cuando la dimensión I tiene score ≤ 3, para contextualizar independencia sin modificar las hermanas (// satisface: AC-1)
- [ ] T010 Documentar en `SKILL.md` el Paso 5: creación de `story.md.bak` — copiar el contenido actual de `story.md`; si `story.md.bak` ya existe, sobreescribirlo (idempotencia) (// satisface: AC-1)
- [ ] T011 Documentar en `SKILL.md` el Paso 6: aplicación de mejoras por dimensión con score ≤ 3 — mínimo 1 mejora concreta por dimensión usando la recomendación del reporte como guía semántica; revisar todas las dimensiones en un único ciclo antes de escribir (// satisface: AC-1)
- [ ] T012 Documentar en `SKILL.md` el Paso 7: escritura de `story.md` mejorado — reemplazar contenido completo actualizando únicamente el campo `updated:` del frontmatter (// satisface: AC-1)
- [ ] T013 Documentar en `SKILL.md` el Paso 8: generación de `story-improvement-log.md` usando `assets/improvement-log-template.md` como fuente de verdad dinámica (// satisface: AC-1)
- [ ] T014 Documentar en `SKILL.md` el Paso 9: mostrar resumen en consola con dimensiones mejoradas y archivos generados (// satisface: AC-1)
- [ ] T015 Agregar sección "Non-Goals" en `SKILL.md`: no modificar `finvest-evaluation-report.md`, no modificar historias hermanas, no ejecutar `story-evaluation` automáticamente (// satisface: AC-1, AC-2)
- [ ] T016 Verificar seguir lineamientos de `skill-master`.md y se sigue la estructura canónica de skills \skill-master\assets\skill-template.md

## 3. Assets — Template del log de mejoras

- [ ] T017 Crear `assets/improvement-log-template.md` con frontmatter YAML (`type: improvement-log`, `story-id:`, `improved:`, `dimensions-improved:`, `previous-score:`) y secciones: Resumen, Cambios por dimensión (una subsección por dimensión con "Recomendación aplicada" y "Cambio realizado") (// satisface: AC-1)

## 4. Ejemplos — Casos de prueba

- [ ] T018 [P] Crear directorio `examples/example-refinar-input/` con `story.md` de ejemplo con historia en estado REFINAR y `finvest-evaluation-report.md` de ejemplo con `decision: REFINAR`, scores I=2 y E=3, y sección "Comentarios y Recomendaciones" con texto concreto por dimensión (// satisface: AC-1)
- [ ] T019 [P] Crear directorio `examples/example-aprobada-input/` con `story.md` de ejemplo con historia válida y `finvest-evaluation-report.md` de ejemplo con `decision: APROBADA` y score global ≥ 4.0 (// satisface: AC-2)

## 5. Verificación — Contratos de calidad

- [ ] T020 Verificar contrato 1: ejecutar mentalmente el flujo sobre `examples/example-refinar-input/` y confirmar que `story.md.bak` se generaría con el texto original de `story.md` (// satisface: AC-1)
- [ ] T021 Verificar contrato 2: confirmar que las instrucciones del Paso 6 en `SKILL.md` garantizan al menos 1 mejora por dimensión con score ≤ 3 del ejemplo REFINAR (// satisface: AC-1)
- [ ] T022 Verificar contrato 3: confirmar que las instrucciones del Paso 8 producirían un `story-improvement-log.md` con sección por cada dimensión mejorada, recomendación y cambio realizado (// satisface: AC-1)
- [ ] T023 Verificar contrato 4: confirmar que el gate del Paso 2 detiene la ejecución sin escribir archivos cuando `decision: APROBADA` usando el ejemplo `examples/example-aprobada-input/` (// satisface: AC-2)
- [ ] T024 Verificar contrato 5: confirmar que la frase exacta `"ya tiene decisión APROBADA — no se realizan cambios"` aparece en las instrucciones de output de consola del SKILL.md (// satisface: AC-2)
- [ ] T025 Verificar contrato 6: confirmar que la instrucción de idempotencia en el Paso 5 garantiza que una doble ejecución produce el mismo `story.md` y `story.md.bak` con el contenido de la primera ejecución (// satisface: AC-1)
- [ ] T026 Verificar contrato 7: confirmar que `finvest-evaluation-report.md` no aparece en ninguna instrucción de escritura del SKILL.md — solo en instrucciones de lectura (// satisface: AC-1, AC-2)
