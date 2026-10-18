---
type: analyze
id: STORY-135
slug: STORY-135-analyze-report
title: "Analyze: Migrar story-product-owner a rol local"
story: STORY-135
design: STORY-135
tasks: STORY-135
veredict: APPROVED
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-135-migrar-story-product-owner-a-rol-local
---

<!-- Referencias -->
[[STORY-135-migrar-story-product-owner-a-rol-local]] · [[STORY-135-migrar-story-product-owner-a-rol-local-design]] · [[STORY-135-migrar-story-product-owner-a-rol-local-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Migrar story-product-owner a rol local

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (+ CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 34/34 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 16/16 elementos con tarea (10 componentes, 5 interfaces, contratos 1-14) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ⚠️ | Historia listada y objetivo alineado; las Notas de la épica (l.61) aún describen el retiro de `agents/` como chore sin historia, y AC-3 lo incluye |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR, 4 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Con el rol local presente, la sesión de `/story-specify` lo lee, pregunta por usuario, necesidad, valor, contexto y restricciones, y sigue el ciclo creation → evaluation → split → improve | ✓ | D-1, D-2, D-3, D-4, D-6, D-7; rol `product-owner`, orquestador `story-specify`, ficha, evals; I-1, I-2, I-4; F-1, F-4; contratos 1-7, 9, 10 |
| AC-2 | Si falta el rol, el skill se detiene, informa la ruta y no modifica el `story.md` en curso | ✓ | D-5 (comprobación al final del Paso 0, sin fallback), D-7 (TC-008); I-3; F-2; contratos 5, 9, 10 |
| AC-3 | Retiro de `agents/`: la carpeta no existe, no figura en `package.json` → `files`, la instalación termina con 0 por runtime y `verify:repository` pasa | ✓ | D-8 (G-1), D-9 (pruebas del instalador y del smoke), D-10 (documentación), D-11 (seguridad sin cambios); I-5; F-3; contratos 11-14 |
| CNF-1 | El rol se ejecuta en la sesión del skill, que puede preguntar al usuario | ✓ | D-2, D-3.1, D-4 («No lances un subagente»); contratos 4, 5, 7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Confirmar el «Estado medido» sobre la rama actual | Context (Estado medido) | ✓ (ver INC-002) |
| T002 | Comprobar G-1 y registrarlo | D-8, F-3 | ✓ |
| T003 | `git mv` del agente a `assets/agents/product-owner.md` | D-1 | ✓ |
| T004 | Frontmatter del rol | D-2, I-1, Esquema de datos | ✓ |
| T005 | Tres ajustes del cuerpo del rol | D-3, I-1, I-2, I-4 | ✓ |
| T006 | Comprobación en el Paso 0 y fila de Manejo de errores | D-5, D-6, I-3, F-2 | ✓ |
| T007 | Paso 1, Caso A, ítem 1 | D-4, I-2, I-4, F-1, F-4 | ✓ |
| T008 | Paso 5B: título e ítems 1-3 | D-4, I-2, I-4 | ✓ |
| T009 | Objetivo, Dependencias y Restricciones de `SKILL.md` | D-6 | ✓ |
| T010 | `README.md` l.15, l.54, l.67 | D-6 | ✓ |
| T011 | Corregir TC-005 | D-7 | ✓ |
| T012 | Añadir TC-007 y TC-008 con la regla de escape | D-7 | ✓ |
| T013 | Eliminar `agents/` vacío | D-8, F-3 | ✓ |
| T014 | Quitar `"agents/"` de `package.json` → `files` | D-8, Esquema de datos | ✓ |
| T015 | Ramas condicionadas en `test/install.test.js` | D-9, I-5, CR-001 | ✓ |
| T016 | Rama condicionada en `scripts/smoke-package-install.js` | D-9, D-11, I-5 | ✓ |
| T017 | `AGENTS.md:8` | D-10, CR-002 | ✓ |
| T018 | `README.md` l.77, l.312, l.315 | D-10, CR-002 | ✓ |
| T019 | `SECURITY.md:6` | D-10, CR-002 | ✓ |
| T020 | `sddf-architecture.md:141` y `tech-stack.md:138` | D-10, CR-002 | ✓ |
| T021 | `docs/constitution.md:259` | D-10, CR-002 | ✓ |
| T022 | Verificar contrato 1 | Contratos de verificación #1 | ✓ |
| T023 | Verificar contratos 2 y 7 | Contratos #2, #7; D-2, D-3 | ✓ |
| T024 | Verificar contrato 3 | Contrato #3 | ✓ |
| T025 | Verificar contrato 4 | Contrato #4 | ✓ |
| T026 | Verificar contratos 5 y 6 | Contratos #5, #6 | ✓ |
| T027 | Verificar contrato 8 (UTF-8 sin BOM) | Contrato #8 | ✓ |
| T028 | Verificar contrato 9 (JSON de evals) | Contrato #9; D-7 | ✓ |
| T029 | Verificar contrato 11 | Contrato #11; D-8 | ✓ |
| T030 | Verificar contrato 13 | Contrato #13; D-10 | ✓ |
| T031 | Verificar I-5 y contrato 12 | Contrato #12; D-9, I-5, F-3 | ✓ |
| T032 | `npm run verify:repository` | Contrato #14; D-11 | ✓ |
| T033 | Registrar el contrato 10 como ejecución manual | Contrato #10; D-8; Risks «Evals existentes» | ✓ |
| T034 | Limpiar copias instaladas y reinstalar | Risks «Entorno local» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Rol `product-owner` | Componentes afectados; D-1…D-3 | T003, T004, T005 | ✓ |
| Agente global `story-product-owner` (eliminar) | Componentes afectados; D-1 | T003 | ✓ |
| Orquestador `story-specify` | Componentes afectados; D-4, D-5, D-6 | T006, T007, T008, T009 | ✓ |
| Ficha del skill (`README.md`) | Componentes afectados; D-6 | T010 | ✓ |
| Evals | Componentes afectados; D-7 | T011, T012 | ✓ |
| Carpeta global `agents/` | Componentes afectados; D-8 | T013 | ✓ |
| Manifiesto `package.json` | Componentes afectados; D-8 | T014 | ✓ |
| Pruebas del instalador | Componentes afectados; D-9 | T015 | ✓ |
| Smoke del tarball | Componentes afectados; D-9 | T016 | ✓ |
| Documentos de estado actual | Componentes afectados; D-10 | T017…T021 | ✓ |
| Sin cambio: runtimes, instalador, CLI, seguridad | Componentes afectados; D-8, D-11 | T014, T016 (restricción «no tocar»), T032 | ✓ |
| I-1 — Archivo de rol | Interfaces | T004, T005 | ✓ |
| I-2 — Contexto del rol | Interfaces | T005, T007, T008 | ✓ |
| I-3 — Error de rol ausente | Interfaces | T006 | ✓ |
| I-4 — Salida del rol | Interfaces | T005, T007, T008 | ✓ |
| I-5 — Contrato de instalación de agentes | Interfaces | T015, T016, T031 | ✓ |

Los catorce contratos de verificación tienen tarea: #1 T022, #2 y #7 T023, #3 T024, #4 T025, #5 y #6 T026, #8 T027, #9 T028, #10 T033 (manual), #11 T029, #12 T031, #13 T030, #14 T032.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Los escenarios de AC-1 y AC-2 están previstos como evals TC-007 y TC-008 (D-7, T012), y AC-3 queda cubierto por los contratos deterministas 11-14 (T029-T032). No sustituyen a `testcases.md`, pero la vía `/story-implement-tasks` no lo necesita.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-135` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-135` disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.29: «STORY-135 — Migrar story-product-owner a rol local» |
| Objetivo de la historia alineado con la épica | ✓ | El `Para` («en cualquier runtime, sin la carpeta global `agents/`») implementa el Alcance (l.18-20) y los criterios de salida l.33-36 y l.39-41. La historia asume además el criterio l.34 (retiro de `agents/`) |
| Restricciones de la épica respetadas | ⚠️ | ADR-0014 (rol leído por la sesión) y ADR-0002 se respetan; `agentsDirectory: "agents"` se conserva (D-8), como fija l.61. Pero l.61 dice que el retiro «tampoco tiene historia propia: es un chore de cierre… después de STORY-129 y STORY-131 a STORY-135», y AC-3 lo absorbe dentro de STORY-135 (INC-001). Las correcciones de D-10 entran por la excepción de veracidad de l.63 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** `epic.md` l.61 sigue describiendo el retiro de `agents/` como un chore de cierre sin historia propia, posterior a STORY-135. `story.md` AC-3 (l.43-51) y su nota de cierre (l.63) incluyen ese retiro en STORY-135. La entrada de la historia en la épica (l.29) tampoco lo menciona. Quien lea la épica esperará un chore que ya no existirá.
- **Archivo afectado:** `docs/specs/epics/EPIC-24-agentes-locales-por-skill/epic.md`, sección «Notas» (l.61) y sección «Historias» (l.29)
- **Acción requerida:** alinear la épica con la historia, o retirar AC-3 de la historia

### INC-002 [WARNING]

- **Tipo:** veracidad de la línea base (fuera de A-F). Un valor de `tasks.md` detendría la implementación.
- **Descripción:** T001 exige «`agents/story-product-owner.agent.md` … `wc -l` da 91» y «`skills/story-specify/SKILL.md` tiene 315 líneas», y manda detener la historia si algo no coincide. En la rama actual, `wc -l` da **90** para el agente (91 líneas reales: el archivo no termina en salto de línea) y **314** para `SKILL.md` (termina en salto de línea, así que son 314 líneas reales). Las líneas citadas (l.25, l.29, l.71, l.107, l.129, l.138, l.240, l.241, l.246) sí coinciden. Como está redactado, T001 detendría la implementación aunque la línea base sea correcta. D-3 también estima el tamaño final del rol (unas 84 líneas) a partir de 91.
- **Archivo afectado:** `tasks.md`, T001 (l.29); `design.md`, «Estado medido» (l.39-40)
- **Acción requerida:** corregir los conteos o el método de medición

### INC-003 [WARNING]

- **Tipo:** precondición de AC-3 no cumplida hoy (dependencia)
- **Descripción:** `git ls-files "agents/*.agent.md"` lista hoy 10 agentes: los cinco `reverse-engineer-*`, `project-architect`, `project-pm`, `project-story-mapper`, `project-ux` y `story-product-owner`. G-1 (D-8, T002) falla hasta que STORY-129 y STORY-131…134 estén implementadas. El diseño lo gestiona: implementa AC-1 y AC-2 y deja AC-3 pendiente. Aun así, la historia no puede llegar a DONE hasta entonces.
- **Archivo afectado:** `design.md`, D-8 y Risks «[Orden]»; `tasks.md`, T002
- **Acción requerida:** ninguna sobre los artefactos; implementar STORY-135 después de las otras cinco, o aceptar un cierre parcial

### INC-004 [WARNING]

- **Tipo:** CR abiertos (decisión de alcance pendiente de confirmación)
- **Descripción:** CR-002 pide «Confirmar con el PO que la corrección de `AGENTS.md` y `docs/constitution.md` entra en esta historia». T017-T021 ya la dan por aceptada. CR-001 propone, como opcional, añadir `test/install.test.js:153` a la nota de cierre de `story.md` (l.63), que hoy cita solo l.126 y el smoke. Los dos están registrados como CR, así que no son decisiones aplazadas para el DoD, pero siguen sin resolverse.
- **Archivo afectado:** `design.md`, «Registro de Cambios (CR)» CR-001 y CR-002; `story.md`, Notas (l.63)
- **Acción requerida:** cerrar ambos CR antes de ejecutar T017-T021

---

## Recomendaciones

1. **INC-001:** en `epic.md` l.61, sustituir «El retiro de `agents/` tampoco tiene historia propia: es un chore de cierre…» por una frase que lo asigne al AC-3 de STORY-135 (conservando la condición `git ls-files "agents/*.agent.md"` y la conservación de `agentsDirectory`). En l.29, añadir «y retirar `agents/` como cierre de la épica».
2. **INC-002:** en `tasks.md` T001, cambiar «`wc -l` da 91» por «tiene 91 líneas (`wc -l` da 90: sin salto final)» y «`SKILL.md` tiene 315 líneas» por «tiene 314 líneas». Otra opción es medir con un método que no dependa del salto final, como `awk 'END{print NR}'`. Corregir lo mismo en `design.md` «Estado medido» l.39-40 y revisar la estimación de D-3.
3. **INC-003:** mantener el orden de implementación de la épica. Si se implementa antes, registrar en `implement-report.md` (T002/T033) que AC-3 queda pendiente y no pasar la historia a DONE hasta cumplir los contratos 11-14.
4. **INC-004:** resolver CR-002 con el PO y anotar la decisión en `design.md` (si se rechaza, mover D-10 y T017-T021 al chore de documentación). Para CR-001, añadir `test/install.test.js:153` a la nota de `story.md` l.63, o marcar el CR como descartado.
5. **Opcional:** ejecutar `/story-testcases STORY-135` si se quiere habilitar también `/story-implement`.

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (error) y AC-3 (cierre) en bloques `gherkin` con Dado/Cuando/Entonces (`story.md` l.26-51) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4, D-6, D-7; AC-2: D-5, D-7, I-3; AC-3: D-8…D-11, I-5 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-11 llevan `// satisface: AC-N`; Componentes, Interfaces y Contratos tienen la columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; las dudas de alcance están registradas como CR-001 y CR-002 (ver INC-004) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001-T034) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo o un contrato y cita sus AC; AC-1, AC-2 y AC-3 tienen tareas de implementación y de verificación |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (criterio condicional) |
