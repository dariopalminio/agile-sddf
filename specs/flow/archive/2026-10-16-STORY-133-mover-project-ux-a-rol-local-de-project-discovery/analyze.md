---
type: analyze
id: STORY-133
slug: STORY-133-analyze-report
title: "Analyze: Mover project-ux a rol local de project-discovery"
story: STORY-133
design: STORY-133
tasks: STORY-133
veredict: APPROVED
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-133-mover-project-ux-a-rol-local-de-project-discovery
---

<!-- Referencias -->
[[STORY-133-mover-project-ux-a-rol-local-de-project-discovery]] · [[STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design]] · [[STORY-133-mover-project-ux-a-rol-local-de-project-discovery-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Mover project-ux a rol local de project-discovery

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 18/18 tareas con diseño (T008 contradice D-7 en una frase: INC-002) |
| Cobertura diseño → tareas | ⚠️ | 8/8 componentes e interfaces con tarea; el contrato 4 no tiene una tarea que garantice su cumplimiento (INC-003) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ⚠️ | Alineada; la descripción de la historia en epic.md parte de una premisa que la historia desmiente (INC-004) |
| Cumplimiento DoD — Fase PLAN | ✓ | 6/6 criterios aplicables ✓ (1 N/A: testcases.md ausente) |

**Estado general:** ⚠️ Advertencias. Hay 0 ERRORES y 4 WARNINGS.

> **Prioridad:** INC-001 detiene la implementación en T001 aunque el skill lo clasifique como WARNING. La precondición P-3 espera 29 líneas y el archivo real tiene 28. Corrígelo antes de ejecutar `/story-implement-tasks`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | La sesión del skill lee `discovery-ux.md`, refina perfiles, journeys y navegación, escribe `.tmp/project-discovery/ux-findings.md` y pasa esa ruta como `$UX_FINDINGS_PATH` | ✓ | Goals (l.50-52); D-1 (`git mv`), D-2 (formato), D-3 (cuerpo), D-4 (Paso 5 en línea, `$OUTPUT_PATH = $UX_FINDINGS_PATH`); I-1, I-2, I-4; F-1; contratos 1, 2, 5, 6, 7, 8 |
| AC-2 | Ninguna invocación de `project-ux` en `skills/`, `agents/`, `config/` ni `test/`, y el Paso 5 sigue produciendo `ux-findings.md` en la misma sesión | ✓ | Goals (l.53); D-1, D-6 (textos finales de Dependencias, Restricciones y Paso 6), D-7 (regla de escape `project-ux` en los evals); contratos 3, 4, 9 |
| AC-3 | Si falta `discovery-ux.md`, se informa que falta el rol y el skill termina sin escribir en `$SPECS_BASE` | ✓ | D-5 (comprobación en el Paso 0, sin fallback); I-3; F-2; TC-012 (D-7). La lectura de «cuando el flujo llega al refinamiento UX» está justificada en D-5 y en Risks (l.258) |
| CNF-1 | Un solo nivel de delegación (ADR-0002) | ✓ | D-3, D-4 («no lances un subagente para este paso»), D-6 («ninguno … lanza subagentes»); contrato 4 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondiciones P-1…P-7 | D-8, contrato 0 | ✓ (P-3 tiene un dato incorrecto: INC-001) |
| T002 | `git mv` del agente al rol | D-1 | ✓ |
| T003 | Frontmatter y tres frases del cuerpo del rol | D-2, D-3, I-1, I-2, I-4 | ✓ |
| T004 | Dependencias y Restricciones de `SKILL.md` | D-6 | ✓ |
| T005 | Añadir `discovery-ux.md` a la lista de roles del Paso 0 y error I-3 | D-5, I-3, F-2 | ✓ |
| T006 | Reescribir el Paso 5 | D-4, I-2, I-4, F-1, F-3 | ✓ |
| T007 | Cláusula de fallo del Paso 6 y frase del Paso 4 | D-6, F-4 | ✓ (cobertura parcial de contrato 4: INC-003) |
| T008 | Evals TC-007 y TC-009 (contexto), y TC-011 y TC-012 (nuevos) | D-7 | ✓ (contradice la regla de escape en una frase: INC-002) |
| T009 | Contratos 1 y 2 | Contratos de verificación | ✓ |
| T010 | Contrato 3 | Contratos de verificación | ✓ |
| T011 | Contrato 4 | Contratos de verificación | ✓ |
| T012 | Contrato 5 y estructura de AC-3 | Contratos de verificación, D-5 | ✓ |
| T013 | Contratos 6 y 7 | Contratos de verificación, D-2, D-3 | ✓ |
| T014 | Contrato 8 (UTF-8 sin BOM) | Contratos de verificación | ✓ |
| T015 | Contrato 9 (JSON y aserción) | Contratos de verificación, D-7 | ✓ |
| T016 | `npm run verify:repository` | Contrato 11 | ✓ |
| T017 | Contrato 10 a ejecución manual, registrado en `implement-report.md` | Contrato 10, Risks «Evals existentes» | ✓ |
| T018 | Reinstalar y limpiar `.claude/agents/project-ux.agent.md` | Risks «Entorno local» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Rol `discovery-ux` | Componentes afectados, D-1…D-3 | T002, T003 | ✓ |
| Agente global `project-ux` (eliminar) | Componentes afectados, D-1 | T002 | ✓ |
| Orquestador `project-discovery` | Componentes afectados, D-4…D-6 | T004, T005, T006, T007 | ✓ |
| Evals de `project-discovery` | Componentes afectados, D-7 | T008 | ✓ |
| I-1 — Archivo de rol | Interfaces | T003 | ✓ |
| I-2 — Variables del rol | Interfaces | T003, T006 | ✓ |
| I-3 — Error de rol ausente | Interfaces | T005 | ✓ |
| I-4 — Salida del rol | Interfaces | T003, T006 | ✓ |
| D-8 — Precondiciones | Decisions | T001 | ✓ |
| Contrato 4 — `SKILL.md` sin «agente(s)» | Contratos de verificación (l.244) | T011 lo verifica; ninguna tarea reescribe «El agente escribe…» (Paso 4) ni «El agente deja `manifest.md`…» (Paso 6) | ⚠️ (INC-003) |

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.27: «STORY-133 — Mover project-ux a rol local de project-discovery» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (obtener hallazgos UX en un runtime sin subagentes) corresponde al criterio de salida «Los skills migrados funcionan en el runtime `codex`» (l.41) y a SMOKE-1 (l.45-54), que nombra `discovery-ux.md` |
| Restricciones de la épica respetadas | ✓ | Entrevistador como archivo de rol (l.36), sin delegación anidada (l.38) y roles en `skills/project-discovery/assets/agents/` (l.35). El diseño comprueba que ninguna guía ni template nombra `project-ux`, así que la excepción de la épica (l.63) no obliga a editar documentos |
| Premisa de la épica sobre la historia | ⚠️ | `epic.md` l.27 dice «Así deja de haber delegación de subagente a subagente», pero story.md l.69 comprobó que hoy no hay delegación anidada sobre `project-ux` (INC-004) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING] — P-3 espera 29 líneas y el archivo real tiene 28

- **Tipo:** C (dato de diseño incorrecto; bloquea T001 en implementación)
- **Descripción:** `wc -l agents/project-ux.agent.md` devuelve **28**: el archivo termina en `s.\n` y no tiene una línea vacía final. El diseño espera 29 en la tabla «Estado medido» (l.36: «29 líneas») y en la precondición P-3 (l.159: «lista el archivo; 29 líneas»). La tarea T001 copia ese valor (tasks.md l.31: «`wc -l` da 29») y ordena detener la historia sin editar nada si una precondición falla. Con el archivo actual, que aún no se tocó, la implementación se detendría en T001. El tamaño previsto de D-3 (l.92: «29 − 6 + 1 ≈ 24») también parte de ese dato.
- **Archivo afectado:** design.md, sección «Context» (l.36) y «D-8» (l.159); tasks.md, sección «1. Línea base» (T001, l.31); design.md, «D-3» (l.92)
- **Acción requerida:** cambiar 29 por 28 en los tres sitios y recalcular el tamaño previsto. Con 28 líneas, retirar `tools`/`model` (6 líneas) y añadir `role` (1 línea) da unas 23. Si `description` pasa de bloque plegado a una línea, quedan unas 21.

### INC-002 [WARNING] — T008 indica escribir `project-ux` literal en los evals

- **Tipo:** B (frase de la tarea contraria a D-7)
- **Descripción:** T008 (tasks.md l.47) dice «escribir `project-ux` literal en el archivo (regla de escape de D-7) y confirmar que `git grep -n "project-ux" -- skills/project-discovery/evals` no devuelve nada». Eso contradice D-7 (design.md l.140-143), que exige `project-ux`, y también la verificación final de la propia tarea. Además, los valores `not_contains` de TC-011 y TC-012 aparecen en T008 sin escape (`agents/project-ux`, `project-ux.agent.md`), mientras que la tabla de D-7 los muestra escapados. Si se sigue T008 al pie de la letra, fallan los contratos 3 (T010) y 9 (T015).
- **Archivo afectado:** tasks.md, sección «4. Evals» (T008, l.47)
- **Acción requerida:** cambiar la frase por «escribir `project-ux` (nunca `project-ux` literal) en `input.context`, `contains` y `not_contains`, según la regla de escape de D-7». Mostrar también los `not_contains` de TC-011 y TC-012 con el escape, como en la tabla de D-7.

### INC-003 [WARNING] — Contrato 4 sin tarea que reescriba las frases «El agente …» que queden

- **Tipo:** C (contrato de diseño sin tarea que asegure su cumplimiento)
- **Descripción:** el contrato 4 (design.md l.244; T011) exige que `grep -niE "(^|[^b])agentes?\b"` no devuelva nada en `skills/project-discovery/SKILL.md`. Hoy el archivo contiene «El agente escribe solo el resumen…» (Paso 4, l.71) y «El agente deja `manifest.md` y los archivos propuestos en staging» (Paso 6, l.81). Los diseños de STORY-131 (l.110) y STORY-132 (l.109) reescriben esos pasos, pero no fijan qué pasa con esas dos frases. La tabla D-6 de esta historia solo cubre «… no invoca otros agentes.» y la cláusula de fallo del Paso 6. Si alguna de las dos frases sobrevive a STORY-131 o STORY-132, T011 falla y ninguna tarea dice cómo corregirlo.
- **Archivo afectado:** design.md, sección «D-6» (tabla, l.120-125); tasks.md, T007 (l.43)
- **Acción requerida:** añadir a D-6 una fila de barrido que reemplace cualquier frase residual «El agente …» de los pasos 4 y 6 por «El rol …» (por ejemplo, «El rol `discovery-architect` deja `manifest.md`…»), y extender T007 con ese reemplazo.

### INC-004 [WARNING] — La épica atribuye a la historia una corrección de delegación anidada que no existe

- **Tipo:** D (desalineación con la épica)
- **Descripción:** `epic.md` l.27 dice que, con STORY-133, «deja de haber delegación de subagente a subagente». Según story.md l.69 (verificado el 2026-10-14) y design.md l.37, `project-ux` lo invoca directamente la sesión de `project-discovery` (un solo nivel) y ningún agente lo invoca. La historia lo explica, pero el índice de la épica conserva una premisa falsa (regla de veracidad de `AGENTS.md`).
- **Archivo afectado:** docs/specs/epics/EPIC-24-agentes-locales-por-skill/epic.md, sección «Historias» (l.27)
- **Acción requerida:** reformular la línea de la épica, por ejemplo: «… que lee la sesión de `project-discovery`, para que el rol UX funcione en runtimes sin subagentes». Puede hacerse en el chore de cierre de EPIC-24. No bloquea la implementación.

---

## Observaciones (sin hallazgo)

- **Lectura de AC-3 (D-5):** la comprobación del rol ocurre al final del Paso 0, no al llegar al Paso 5. El diseño lo justifica en D-5 (l.111-113) y en Risks (l.258), y TC-012 mide el resultado observable. La decisión es explícita y el resultado es más estricto que lo que pide el AC, así que no se registra como inconsistencia.
- **Estado de partida de story.md:** el frontmatter tenía `SPECIFY/DONE`, no `PLANNING/IN-PROGRESS` como dejaría `story-plan`. Los artefactos de planning (design.md y tasks.md en `PLAN/IN-PROGRESS`) están completos, así que la transición a `READY-FOR-IMPLEMENT/DONE` procede.
- **Dependencia de orden:** STORY-131 y STORY-132 siguen sin implementar (`agents/project-pm.agent.md` y `agents/project-architect.agent.md` siguen versionados; `skills/project-discovery/assets/` solo contiene los dos templates; `evals.json` tiene TC-001…TC-006). D-8 bloquea la implementación de esta historia hasta que se integren. Es un comportamiento esperado, no una inconsistencia.
- **Hechos verificados en el filesystem:** `skills/project-discovery/SKILL.md` nombra `project-ux` solo en l.27 y l.75. Fuera del propio `agents/project-ux.agent.md`, ningún archivo de `agents/`, `config/`, `test/` ni `scripts/` lo nombra. La l.28 del agente contiene «instrucciones para otros agentes» (D-3.3), como dice el diseño.

---

## Recomendaciones

1. **(INC-001, antes de implementar)** En design.md l.36 y l.159, y en tasks.md T001 (l.31), cambiar «29» por «28». En design.md l.92, recalcular el tamaño previsto del rol (unas 23 líneas, o unas 21 si `description` queda en una línea).
2. **(INC-002, antes de implementar)** En tasks.md T008 (l.47), cambiar «escribir `project-ux` literal en el archivo» por «escribir `project-ux` (nunca `project-ux` literal)», y escribir los valores `not_contains` de TC-011 y TC-012 con el escape, como en la tabla de D-7.
3. **(INC-003)** En design.md D-6, añadir la fila «Pasos 4 y 6, frase residual "El agente …" → "El rol …"». En tasks.md T007, añadir ese reemplazo para que T011 (contrato 4) no dependa de la redacción de STORY-131 y STORY-132.
4. **(INC-004)** En epic.md l.27, reformular la descripción de STORY-133 para que no hable de una delegación anidada que no existe (chore de cierre de EPIC-24 o próxima edición de la épica).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no está presente, así que no se evaluó la cobertura de pruebas. Los casos que verifican los ACs están en el diseño: TC-011 y TC-012 en D-7, y los contratos 0-11.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-133` no está disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-133` está disponible |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto con `sddf.config.yaml › guardrails.dod.story.plan = dod-story-plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo) y AC-3 (error), en bloques `gherkin` (story.md l.26-50) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4; AC-2: D-6, D-7; AC-3: D-5, I-3 (ver tabla de cobertura) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals l.50-54 y D-1…D-8 llevan `// satisface: AC-N`; las tablas de Componentes, Interfaces y Contratos tienen una columna de AC |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna» (l.265); la ambigüedad de AC-3 se resuelve en D-5 y la de AC-2 en D-7; la dependencia con STORY-131 y STORY-132 está acotada por D-8 y CR-001 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001-T018) |
| Si tasks.md existe, DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T002, T003, T006, T009, T012, T013; AC-2: T004, T007, T008, T010, T011, T015; AC-3: T005, T008, T012. Cada tarea toca un solo archivo o un solo contrato |
| Si testcases.md existe, DEBE contener pruebas definidas para todos los escenarios principales de story.md | — N/A | — | testcases.md no existe; el criterio es condicional |
