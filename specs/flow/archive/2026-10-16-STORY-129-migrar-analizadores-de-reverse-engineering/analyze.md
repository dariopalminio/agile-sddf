---
type: analyze
id: STORY-129
slug: STORY-129-analyze-report
title: "Analyze: Migrar analizadores de reverse-engineering"
story: STORY-129
design: STORY-129
tasks: STORY-129
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-129-migrar-analizadores-de-reverse-engineering
---

<!-- Referencias -->
[[STORY-129-migrar-analizadores-de-reverse-engineering]] · [[STORY-129-migrar-analizadores-de-reverse-engineering-design]] · [[STORY-129-migrar-analizadores-de-reverse-engineering-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Migrar analizadores de reverse-engineering

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no existe |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (2 filas «sin cambio» no requieren tarea) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ✓ | Historia listada, objetivo alineado; las notas de story.md citan CS-1, CS-3, CS-5, CS-7, CS-8 y CS-9 |
| Cumplimiento DoD — Fase PLAN | ✓ | 6/6 criterios aplicables ✓ (1 no aplica: testcases.md ausente) |

**Estado general:** ✓ Coherente (0 ERROR, 0 WARNING). Los 4 WARNING del primer análisis se corrigieron el 2026-10-15 y CR-002 quedó resuelto (ver «Inconsistencias Detectadas»).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El skill invoca los cuatro analizadores locales en paralelo y luego el synthesizer local; cada analizador escribe en `.tmp/reverse-engineering/` con el mismo nombre de archivo | ✓ | Goals (l.51-55), D-1, D-2, D-3, D-4, D-6, D-7 (TC-006), componentes de los 5 subagentes y el orquestador, I-1, I-2, I-3, I-5, I-6, F-1, F-3, F-4, D-8 (guía), contratos 1-5, 7, 8 y 9 |
| AC-2 | Si falta un subagente local, el skill se detiene antes de lanzar analizadores, informa cuál falta y no busca en `agents/` | ✓ | D-5, D-7 (TC-005), componente Orquestador (Fase 0), I-4, F-2, contrato 3 y 7 |

Los criterios no funcionales también tienen cobertura: CNF-1 → D-3, D-4, D-8, I-3, I-5, contratos 4, 5 y 9. CNF-2 → D-2, D-4 (`## Restricciones de ejecución`), D-6, contrato 6.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar la línea base (`git ls-files`) | Context (tabla «Estado medido»), D-1 | ✓ |
| T002 | Hacer los cinco `git mv` sin editar | D-1; componente «Agentes globales — eliminar» | ✓ |
| T003 | Adaptar `architect.md` | D-2, D-3, D-4, I-1, I-5 | ✓ |
| T004 | Adaptar `product-discovery.md` | D-2, D-3, D-4, I-1, I-5 | ✓ |
| T005 | Adaptar `business-analyst.md` | D-2, D-3, D-4, I-1, I-5 | ✓ |
| T006 | Adaptar `ux-flow-mapper.md` (incluida la mención del árbol ASCII) | D-2, D-3, D-4, I-1, I-5 | ✓ |
| T007 | Adaptar `synthesizer.md` | D-2, D-4, I-1, I-5 | ✓ |
| T008 | Fase 0: comprobar presencia y fail-fast | D-5, I-4, F-2 | ✓ |
| T009 | Fase 1: limpiar `rfc-*.md`, lanzar en paralelo, verificar salidas, degradar a secuencial | D-6, I-2, I-5, I-6, F-1, F-3, F-4, «Decisiones de complejidad justificada» | ✓ |
| T010 | Fase 2: lanzar el synthesizer local; Fase 3 repite I-6 | D-6, I-3, I-6, F-1, F-4 | ✓ |
| T011 | Añadir TC-005 y TC-006 a `evals.json` | D-7; componente «Evals del skill» | ✓ |
| T012 | Corregir el ejemplo `reverse-engineering` de la guía de buenas prácticas | D-8, CR-002, contrato #9; componente «Guía de buenas prácticas» | ✓ |
| T013 | Verificar contratos 1 y 2 | Contratos de verificación #1, #2 | ✓ |
| T014 | Verificar contrato 3 | Contrato #3 | ✓ |
| T015 | Verificar contrato 4 | Contrato #4 (la tarea precisa que el synthesizer también aparece, ver OBS-1) | ✓ |
| T016 | Verificar contrato 5 | Contrato #5 (la tarea corrige la pathspec, ver OBS-2) | ✓ |
| T017 | Verificar contrato 6 | Contrato #6, D-2 | ✓ |
| T018 | Verificar codificación UTF-8 sin BOM (incluye la guía) | Regla transversal de codificación (encabezado de tasks.md, AGENTS.md), sin elemento de diseño propio | ✓ |
| T019 | `npm run verify:repository` | Contrato #8 | ✓ |
| T020 | Dejar el contrato 7 a ejecución manual y recordar la aserción de TC-006 | Contrato #7, D-7 | ✓ |
| T021 | Reinstalar y borrar copias locales residuales | Risks «[Entorno local]» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Subagente local architect | Componentes afectados | T002, T003 | ✓ |
| Subagente local product-discovery | Componentes afectados | T002, T004 | ✓ |
| Subagente local business-analyst | Componentes afectados | T002, T005 | ✓ |
| Subagente local ux-flow-mapper | Componentes afectados | T002, T006 | ✓ |
| Subagente local synthesizer | Componentes afectados | T002, T007 | ✓ |
| Agentes globales `reverse-engineer-*` (eliminar) | Componentes afectados | T002, T013 | ✓ |
| Orquestador `SKILL.md` | Componentes afectados | T008, T009, T010 | ✓ |
| Evals del skill | Componentes afectados | T011 | ✓ |
| Guía de buenas prácticas (ejemplo `reverse-engineering`) | Componentes afectados, D-8 | T012, T018 | ✓ |
| I-1 — Archivo de subagente local | Interfaces | T003-T007, T017 | ✓ |
| I-2 — Bloque de contexto de un analizador | Interfaces | T009 | ✓ |
| I-3 — Bloque de contexto del synthesizer | Interfaces | T010 | ✓ |
| I-4 — Error de subagente ausente | Interfaces | T008 | ✓ |
| I-5 — Intermedios | Interfaces | T003-T007, T015 | ✓ |
| I-6 — Aviso de intermedio ausente | Interfaces | T009, T010 | ✓ |
| `package.json`, `config/runtimes.json`, `test/install.test.js`, `scripts/smoke-package-install.js` | Componentes afectados (sin cambio) | No requiere tarea (lo valida T019) | — |
| `skills/reverse-engineering/README.md` | Componentes afectados (sin cambio) | No requiere tarea | — |

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.24, «STORY-129 — Migrar analizadores de reverse-engineering» |
| Objetivo de la historia alineado con la épica | ✓ | «Para que el skill funcione de forma autocontenida, sin depender de la carpeta global `agents/`» coincide con el Alcance (`epic.md` l.18: los analizadores pasan a ser subagentes locales) |
| Restricciones de la épica respetadas | ✓ | El diseño respeta las exclusiones: no retira `agents/` ni toca `package.json`, no crea `verify-skill-independence.js` y deja fuera de alcance la documentación salvo el ejemplo de la guía, cuya excepción justifica D-8 por la regla de veracidad de `AGENTS.md` (CR-002). D-6/F-3 cubre CS-9 (codex). El contrato de `.tmp/` que la épica pide conservar queda fijado en `.tmp/reverse-engineering/` con los mismos nombres de archivo (AC-1, CNF-1, D-3) |

---

## Inconsistencias Detectadas

Sin inconsistencias pendientes. El primer análisis del 2026-10-15 detectó 4 WARNING y 2 observaciones menores, corregidos ese mismo día. CR-002 también quedó resuelto:

| ID | Tipo | Hallazgo | Corrección aplicada |
|---|---|---|---|
| INC-001 | D | AC-1 («misma ruta temporal que antes») y CNF-1 (`.tmp/rfc-*.md`) contradecían D-3 | `story.md`: AC-1 dice ahora «escribe su resultado en .tmp/reverse-engineering/ con el mismo nombre de archivo que antes de la migración»; CNF-1 fija el directorio temporal del skill en `.tmp/reverse-engineering/` y el patrón `.tmp/reverse-engineering/rfc-*.md`. `design.md` → CR-001 marcado como aplicado |
| INC-002 | — (veracidad) | La fila «Cuerpo de los 4 analizadores» de «Context» decía que ya escribían en `.tmp/reverse-engineering/` | `design.md` l.37: «Escriben en `.tmp/rfc-*.md`, en la raíz de `.tmp/`»; l.28 aclara que el destino pasa a `.tmp/reverse-engineering/` tras la historia |
| INC-003 | — (riesgo) | TC-006 prohibía `reverse-engineer-architect`, que D-4 conserva en `**Generado por**` | `design.md` D-7: TC-006 prohíbe la ruta `agents/reverse-engineer-architect`, con la justificación; riesgo nuevo en «Risks / Trade-offs». `tasks.md` T011 y T020 actualizados |
| INC-004 | D | Las notas de `story.md` no citaban CS-5 ni CS-9 | `story.md` → «Notas / contexto adicional» cita CS-5 y CS-9 |
| OBS-1 | — | El contrato 4 omitía que el synthesizer también aparece en el `grep` | `design.md` contrato 4 alineado con T015 |
| OBS-2 | — | La pathspec del contrato 5 impedía que git emparejara los renombrados | `design.md` contrato 5 usa `-- agents skills/reverse-engineering/assets/agents`, igual que T016 |
| CR-002 | — (decisión pendiente) | El ejemplo `reverse-engineering` de `docs/guides/best-practices-for-skills.md` quedaría con nombres de agentes inexistentes | `design.md`: decisión D-8 (corregir en esta historia, durante la implementación), componente «Guía de buenas prácticas», contrato 9, CR-002 marcado como resuelto y Non-Goals/Risks ajustados. `tasks.md`: nueva T012 (las siguientes se renumeran a T013-T021); T018 y T019 la incluyen |

---

## Recomendaciones

1. No editar la guía antes de T012: hasta el `git mv` (T002) describiría subagentes que no existen. El cambio parcial que ya existe en el árbol de trabajo (`.tmp/reverse-engineering/` en el árbol ASCII) se conserva y se completa en T012.
2. Antes de cerrar la historia, ejecutar a mano `npm run test:eval -- reverse-engineering` (contrato 7, T020).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada. Los evals TC-005 (AC-2) y TC-006 (AC-1) de D-7 cubren el comportamiento de los dos ACs a nivel de skill.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-129` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-129` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (escenario principal) y AC-2 (error) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-1…D-4, D-6, I-1…I-3, I-5; AC-2 → D-5, I-4, F-2 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-7 llevan `// satisface:`; las tablas de componentes, interfaces y contratos tienen columna de AC. Solo las filas «sin cambio» usan `—` |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; la ruta de `.tmp/` se resolvió en D-3 (CR-001) y el alcance de la documentación está registrado en CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001-T021) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1 → T002-T007, T009-T013, T015; AC-2 → T008, T011, T014. Cada tarea toca un archivo o hace una verificación. T009 es la más densa, pero edita una sola sección |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | — | — | No aplica: testcases.md no existe |
