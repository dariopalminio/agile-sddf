---
type: analyze
id: STORY-090
slug: STORY-090-analyze-report
title: "Analyze: Todo campo declarado en un template nombra a su escritor"
story: STORY-090
design: STORY-090
testcases: STORY-090
tasks: STORY-090
created: 2026-09-10
updated: 2026-09-10
related:
  - STORY-090-campos-declarados-nombran-su-escritor
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

# Reporte de Coherencia: Todo campo declarado en un template nombra a su escritor

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 5/5 criterios cubiertos (+ 3/3 NFR) |
| Cobertura de ACs en testcases.md | ✓ | 5/5 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 38/38 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 componentes y 4/4 interfaces con tarea |
| Alineación con la épica EPIC-17-remediating-and-improvement | ⚠️ | Objetivo alineado; la historia no está listada en `## Historias` de la épica |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (1 WARNING, 0 ERROR)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Escenario principal — el campo sin lectores desaparece; `story-improve`/`story-split` siguen leyendo el reporte; ningún escritor vuelve a escribirlo; equivalencia `SPECIFY/DONE ⇔ APROBADA` documentada | ✓ | D2 (retiro del bloque), D3 (script), D5 (equivalencia), D7 (escritores verificados); componentes *Template canónico de historia*, *Copia seed*, *Historias existentes*, *Skill story-evaluation*, *Escritores* y *Lectores*; V-2, V-4, V-5, V-9, V-11 |
| AC-2 | Escenario alternativo — historia con dato real sin reporte detiene la migración sobre ella, se reporta, no borra la línea, el resto sigue | ✓ | D3 (regla `REQUIERE DECISIÓN`, exit code sin abortar), D4 (resolución humana por historia); componente *Migración del campo FINVEST* y *Reporte reconstruido o nota de aceptación*; V-6 |
| AC-3 | Escenario de error — todo campo declarado en los cinco templates queda retirado o anotado; los campos con escritor se conservan | ✓ | D1 (gramática `escritor:`, regla 2 de qué es un campo, regla 5 para huérfanos); componentes *Templates de épica/project-intent/project/project-plan* y *Template canónico de historia*; V-1 |
| AC-4 | Requerimiento — principio numerado en `docs/policies/constitution.md` | ✓ | D6 (principio 13, enunciado y ubicación); componente *Constitución*; V-10 |
| AC-5 | Requerimiento — cinco templates anotados; anotación legible sin ejecutar y junto al campo | ✓ | D1; componentes *Templates canónicos* y *Seeds*; interfaz *Gramática de anotación*; V-1, V-3 |
| NFR-1 | Sin pérdida de datos | ✓ | D3 (dato real sin reporte → no se modifica), D4 (reconstruir / aceptar con registro); V-6 |
| NFR-2 | Idempotencia | ✓ | D3 (segunda ejecución → 0 `MIGRADA`); V-7 |
| NFR-3 | Reversibilidad | ✓ | D8 (tres commits; commit 2 solo `docs/specs/03-stories/**`); V-8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| 1.1 | Inventario base (conteos, grafías, reportes) | design.md › Context "Estado actual medido" | ✓ |
| 1.2 | Resolver OQ-1, OQ-2 y confirmar CR-001 con el usuario | D4; Open Questions; CR-001 | ✓ |
| 1.3 | Inventario de campos por template con escritor asignado | D1 regla 2; tabla "Los cinco templates y su skill dueño" | ✓ |
| 2.1 | Crear `scripts/migrate-finvest-field.js` con `--dry-run` / `--stories-dir` | D3; componente *Migración del campo FINVEST* | ✓ |
| 2.2 | Detección del bloque de tres líneas / `FORMA INESPERADA` | D2, D3 | ✓ |
| 2.3 | Clasificación vacío / dato real | D3, CR-001 | ✓ |
| 2.4 | Regla de decisión por historia y `ERROR LECTURA` | D3 (P7) | ✓ |
| 2.5 | Preservar encoding y finales de línea; dry-run sin escritura | D3 | ✓ |
| 2.6 | Salida tabular, resumen y exit code | D3 | ✓ |
| 2.7 | Prueba dry-run sobre el árbol real | V-6; D3 | ✓ |
| 3.1 | Retirar bloque FINVEST del template canónico | D2; componente *Template canónico de historia* | ✓ |
| 3.2 | Anotar frontmatter de `story-template.md` | D1; componente *Template canónico de historia* | ✓ |
| 3.3 | Equivalencia `SPECIFY/DONE ⇔ APROBADA` en la anotación de `status` | D5 | ✓ |
| 3.4 | Escritor por defecto del cuerpo + anotaciones locales | D1 | ✓ |
| 3.5 | Copiar al seed y `diff` vacío | componente *Copia seed*; V-3 | ✓ |
| 3.6 | Frase en `story-evaluation` Paso 7 | D5; componente *Skill story-evaluation* | ✓ |
| 4.1 | Anotar `epic-template.md` + seed | D1; componentes *Templates de épica…* y *Seeds* | ✓ |
| 4.2 | Anotar `project-intent-template.md` + seed | D1; ídem | ✓ |
| 4.3 | Anotar `project-template.md` + seed | D1; ídem | ✓ |
| 4.4 | Anotar `project-plan-template.md` + seed | D1; ídem | ✓ |
| 4.5 | Resolver campos huérfanos detectados en 1.3 | D1 regla 5 | ✓ |
| 4.6 | Verificar V-1, V-2, V-3 | Contratos de verificación | ✓ |
| 4.7 | Commit 1 + refrescar `.claude/skills` | D8 | ✓ |
| 5.1 | STORY-067: reconstruir reporte o nota de aceptación | D4; componente *Reporte reconstruido o nota de aceptación* | ✓ |
| 5.2 | STORY-078: opción elegida | D4; CR-001 | ✓ |
| 6.1 | Dry-run tras resolver casos | D3 | ✓ |
| 6.2 | Migración real; `git status` acotado | componente *Historias existentes*; NFR-3 | ✓ |
| 6.3 | Verificar V-5 y forma resultante | D2; V-5 | ✓ |
| 6.4 | Verificar idempotencia V-7 | D3; V-7 | ✓ |
| 6.5 | Commit 2 aislado; V-8 | D8; V-8 | ✓ |
| 7.1 | Principio 13 en la constitución + `updated` | D6; componente *Constitución* | ✓ |
| 7.2 | Commit 3 | D8 | ✓ |
| 8.1 | Verificar V-4 (escritores + instanciación de prueba) | D7; V-4 | ✓ |
| 8.2 | Verificar V-11 (lectores intactos) | componente *Lectores*; V-11 | ✓ |
| 8.3 | Verificar V-9 y V-10 | D5, D6 | ✓ |
| 8.4 | DoD e `implement-report.md` con evidencias | Goals; Risks (fixtures intactos) | ✓ |
| 8.5 | Actualizar nota de `story.md` con cifras reales; cerrar tareas | CR-001 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Template canónico de historia | Componentes afectados | 3.1, 3.2, 3.3, 3.4 | ✓ |
| Copia seed del template de historia | Componentes afectados | 3.5 | ✓ |
| Templates epic / project-intent / project / project-plan (canónicos) | Componentes afectados | 4.1–4.4 | ✓ |
| Seeds de esos cuatro templates | Componentes afectados | 4.1–4.4, 4.6 | ✓ |
| Migración del campo FINVEST (`scripts/migrate-finvest-field.js`) | Componentes afectados; D3 | 2.1–2.7 | ✓ |
| Historias existentes con el campo (38 `story.md`) | Componentes afectados | 6.1–6.5 | ✓ |
| Reporte reconstruido o nota de aceptación | Componentes afectados; D4 | 5.1, 5.2 | ✓ |
| Constitución (principio 13) | Componentes afectados; D6 | 7.1, 7.2 | ✓ |
| Skill `story-evaluation` (Paso 7) | Componentes afectados; D5 | 3.6 | ✓ |
| Escritores del template de historia (verificar) | Componentes afectados; D7 | 8.1 | ✓ |
| Lectores del registro canónico (verificar) | Componentes afectados | 8.2 | ✓ |
| Interfaz: Gramática de anotación `escritor:` | Interfaces / contratos; D1 | 1.3, 3.2, 3.4, 4.1–4.5 | ✓ |
| Interfaz: CLI de migración | Interfaces / contratos; D3 | 2.1, 2.6 | ✓ |
| Interfaz: Registro canónico del score | Interfaces / contratos | 5.1, 8.2 (sin cambios, verificación) | ✓ |
| Interfaz: Señal de aprobación en `story.md` | Interfaces / contratos; D5 | 3.3, 3.6, 8.3 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-17-remediating-and-improvement (`status: DEVELOP / DONE`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `epic.md` › `## Historias` enumera plan-01…plan-17, todos `[x]`; no existe entrada para STORY-090 (ni para STORY-089, su origen). La épica figura con `substatus: DONE`. |
| Objetivo de la historia alineado con la épica | ✓ | El `Para` de la historia (detectar campos huérfanos leyendo el template en vez de auditando 78 historias) encaja con el objetivo de la épica: reducir deuda técnica y alinear el framework con su constitución (§3 "obligar a demostrar, no declarar"; patrón §5 template como fuente de verdad). |
| Restricciones de la épica respetadas | ✓ | Sin restricciones explícitas aplicables; los riesgos de la épica (descriptions, evals, CLAUDE.md) no se ven afectados. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** STORY-090 declara `parent: EPIC-17-remediating-and-improvement`, pero `docs/specs/02-epics/EPIC-17-remediating-and-improvement/epic.md` no la lista en `## Historias` y la épica está en `DEVELOP/DONE`. La constitución ("epic.md debe mantenerse actualizado… incluyendo sus historias asociadas. Una vez completada se freeza") deja ambiguo si una épica DONE puede recibir una historia nueva.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-17-remediating-and-improvement/epic.md` — sección "## Historias"
- **Acción requerida:** decidir entre (a) añadir `plan-18 — STORY-090` (y `STORY-089`) a `## Historias` y reabrir la épica a `DEVELOP/IN-PROGRESS`, o (b) reasignar `parent` de la historia a la épica activa que corresponda. No bloquea la implementación.

---

## Recomendaciones

1. **INC-001:** al iniciar la implementación, añadir en `epic.md` de EPIC-17 la línea `- [ ] plan-18 — **Fix - Todo campo declarado nombra a su escritor (STORY-090):** …` (y la de STORY-089 si tampoco está) y ajustar `substatus` de la épica, o bien cambiar `parent:` en `story.md`. Registrar la elección en el `implement-report.md`.
2. **Antes de la tarea 2.x:** resolver OQ-1 y OQ-2 (tarea 1.2) — son decisiones de dueño del dato, no de diseño; el diseño recomienda *reconstruir* para STORY-067 y *aceptar con nota* para STORY-078. Sin ellas la migración se detiene legítimamente en esas dos historias (AC-2) pero no puede cerrar el commit 2.
3. **Observación no bloqueante:** `design.md` y `tasks.md` referencian conteos medidos hoy (82/38/2). Si se crean historias nuevas antes de implementar, la tarea 1.1 recalcula el inventario; los contratos de verificación no dependen de los números absolutos.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Campo sin lectores desaparece; consumidores intactos; escritores no lo reescriben; equivalencia documentada | ✓ | E2E-001; IT-001, IT-003, IT-004, IT-005, IT-007, IT-010; EV-001–EV-004 |
| AC-2 | Historia con dato real sin reporte detiene la migración sobre ella y reporta | ✓ | E2E-002; UT-007, UT-008, UT-010, UT-011 |
| AC-3 | Campo sin escritor retirado o anotado; ningún template sin anotación | ✓ | E2E-003; IT-006 |
| AC-4 | Principio 13 en la constitución | ✓ | IT-008 (y `Entonces` de E2E-003) |
| AC-5 | Cinco templates anotados junto al campo | ✓ | E2E-003; IT-002, IT-006 |
| NFR-1 | Sin pérdida de datos | ✓ | UT-010, UT-011, E2E-002 |
| NFR-2 | Idempotencia | ✓ | UT-016 |
| NFR-3 | Reversibilidad | ✓ | IT-009 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-090` |
| tasks.md | ✓ | `/story-implement-tasks STORY-090` |

Ambas vías disponibles. Dado que el "código" de esta historia es un script Node más ediciones de Markdown con plan de tres commits, `/story-implement-tasks` es la vía natural (sigue el orden 1→8 de `tasks.md`); los casos UT del script se ejecutan como CLI con fixtures en `.tmp/story-090/` (ver Notas de cobertura de `testcases.md`).

---

## Cumplimiento DoD — Fase PLAN

`✓ DoD PLAN cargado: 5 criterios encontrados` (sección "Definition of Done para el estado PLAN" de `docs/policies/dod-story.md`)

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | Tres escenarios Gherkin (principal, alternativo, error) + dos requerimientos + criterios no funcionales |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 5/5 ACs y 3/3 NFR con decisiones, componentes y contratos V-n |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 8 grupos: 1 Setup → 2 Script → 3–4 Templates → 5–6 Migración → 7 Constitución → 8 Verificación; 38 tareas, 9 `[P]`, cada una con refs AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Cada decisión D1–D8 y cada goal lleva `// satisface: AC-n`; las tablas de componentes, interfaces y contratos tienen columna AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | Todas las decisiones técnicas están tomadas (forma de anotación, mecanismo, commits). OQ-1/OQ-2 son decisiones del dueño del dato (no de arquitectura) con recomendación explícita; la ambigüedad sobre STORY-078 está registrada como CR-001 |

**Resultado:** 5/5 criterios ✓ — 0 ERROR (TIPO E).
