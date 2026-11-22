---
type: analyze
id: STORY-134
slug: STORY-134-analyze-report
title: "Analyze: Migrar project-story-mapper a rol local"
story: STORY-134
design: STORY-134
tasks: STORY-134
veredict: APPROVED
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-134-migrar-project-story-mapper-a-rol-local
---

<!-- Referencias -->
[[STORY-134-migrar-project-story-mapper-a-rol-local]] · [[STORY-134-migrar-project-story-mapper-a-rol-local-design]] · [[STORY-134-migrar-project-story-mapper-a-rol-local-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Migrar project-story-mapper a rol local

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no existe |
| Alineación tareas → diseño | ✓ | 20/20 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 elementos con tarea (5 componentes + 4 interfaces) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ⚠️ | Alineada; el criterio de salida de `codex` que cita la historia no tiene verificación propia (INC-002) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓, 1 ⚠️ (INC-001) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 2 WARNING)

**Verificación del «Estado medido» (design.md, Context):** comprobado sobre la rama `epic/EPIC-24-agentes-locales-por-skill` el 2026-10-15. `agents/project-story-mapper.agent.md` tiene 97 líneas y ocho encabezados `## Paso 0…7`. `skills/project-story-mapping/SKILL.md` tiene 130 líneas, con los textos de D-6 en l.21, 35, 39, 43, 73, 90 y 92-94. `assets/` no existe y `evals.json` (clave `cases`) contiene TC-001…TC-006. Fuera del propio agente y de `SKILL.md`, `git grep "project-story-mapper" -- skills agents config test scripts package.json` no devuelve nada, y `docs/guides/` y `docs/architecture/` tampoco lo nombran. Los textos que esperan TC-007 y TC-008 existen en `SKILL.md`: `📋 Inventario de requisitos` (l.84) y `✅ Story map escrito` (l.126).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Sesión de story mapping con rol local: el rol está en `assets/agents/`, el agente global no existe, la sesión lee el rol, entrevista y escribe staging → `product/story-map.md` | ✓ | Goals 1-4; D-1 (`git mv` a `story-mapper.md`), D-2, D-3, D-4 (lectura en línea en el Paso 3), D-6, D-7 (TC-007); I-1, I-2, I-4; F-1; contratos 1-11 |
| AC-2 | Rol local ausente: el skill se detiene, informa la ruta y no escribe `product/story-map.md` | ✓ | Goal 5; D-5 (comprobación al final del Paso 0, sin fallback); I-3 (mensaje con la ruta); F-2; D-7 (TC-008, que prohíbe `Inventario de requisitos` para medir que no hubo efectos previos) |
| CNF-1 | Interacción garantizada: el rol se ejecuta en la sesión del skill | ✓ | D-2 (retira `tools:`/`model:`), D-4 («No lances un subagente para este paso»), D-6 (regla de Restricciones); contratos 4, 5 y 7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Confirmar la línea base del «Estado medido» | Context (Estado medido) | ✓ |
| T002 | `git mv` del agente a `assets/agents/story-mapper.md`, sin editar | D-1; componentes «Rol `story-mapper`» y «Agente global» | ✓ |
| T003 | Frontmatter nuevo, sin `tools:`/`model:` | D-2, I-1, Esquema de datos | ✓ |
| T004 | Cuatro ajustes del cuerpo (intro ×2, Paso→Fase, Fase 7) | D-3, I-1, I-2, I-4 | ✓ |
| T005 | Comprobación de presencia del rol al final del Paso 0 | D-5, I-3, F-2 | ✓ |
| T006 | Paso 3 «Sesión de mapeo con el rol `story-mapper`» | D-4, I-2, I-4, F-1, F-3 | ✓ |
| T007 | Textos de D-6 fuera del Paso 3 | D-6, F-4 | ✓ |
| T008 | `README.md:9` | D-6 (fila README); componente «Ficha del skill» | ✓ |
| T009 | Contexto de TC-001, TC-002, TC-003 y TC-006 | D-7 | ✓ |
| T010 | Añadir TC-007 y TC-008 con escape Unicode | D-7 | ✓ (ver INC-001) |
| T011 | Verificar contrato 1 | Contrato 1 | ✓ |
| T012 | Verificar contratos 2 y 7 | Contratos 2 y 7; D-2, D-3 | ✓ |
| T013 | Verificar contrato 3 | Contrato 3 | ✓ |
| T014 | Verificar contrato 4 | Contrato 4 | ✓ |
| T015 | Verificar contratos 5 y 6 | Contratos 5 y 6 | ✓ |
| T016 | Verificar contrato 8 (UTF-8 sin BOM) | Contrato 8 | ✓ |
| T017 | Verificar contrato 9 (JSON parsea; aserción conservada) | Contrato 9; D-7 | ✓ |
| T018 | `npm run verify:repository` | Contrato 11 | ✓ |
| T019 | Dejar el contrato 10 (evals) a ejecución manual en `implement-report.md` | Contrato 10; Risks «Evals existentes» | ✓ |
| T020 | Reinstalar y limpiar la copia de dogfooding | Risks «Entorno local» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Rol `story-mapper` | Componentes afectados; D-1…D-3 | T002, T003, T004 | ✓ |
| Agente global `project-story-mapper` (eliminar) | Componentes afectados; D-1 | T002 (verificado en T011) | ✓ |
| Orquestador `project-story-mapping` (`SKILL.md`) | Componentes afectados; D-4, D-5, D-6 | T005, T006, T007 | ✓ |
| Ficha del skill (`README.md`) | Componentes afectados; D-6 | T008 | ✓ |
| Evals (`evals.json`) | Componentes afectados; D-7 | T009, T010 | ✓ |
| I-1 — Archivo de rol | Interfaces | T003, T004 | ✓ |
| I-2 — Variables del rol | Interfaces | T006 (y T004 las conserva en `## Variables inyectadas`) | ✓ |
| I-3 — Error de rol ausente | Interfaces | T005 | ✓ |
| I-4 — Salida del rol | Interfaces | T004 (sin cambios en la plantilla de la Fase 7), T006 | ✓ |

La fila «`package.json`, `config/runtimes.json`, `scripts/install.js`, tests de instalación, guías — sin cambio» no se cuenta como elemento a implementar; T018 cubre su no-regresión.

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.28: «**STORY-134** — Migrar project-story-mapper a rol local…» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (entrevista en cualquier runtime, sin `agents/`) coincide con el Alcance (l.18: «los entrevistadores pasan a ser archivos de rol que lee la sesión del skill») y con la Nota l.60 |
| Restricciones de la épica respetadas | ⚠️ | Se respetan las de l.33, l.35 y l.36 (D-4, D-6, contrato 4), la de l.39 (contrato 10, manual) y la de l.40 (contrato 11). La historia (Notas, l.59) declara cubrir también l.41 («Los skills migrados funcionan en el runtime `codex`»), pero ni design.md ni tasks.md tienen un contrato o tarea que lo compruebe (INC-002). No toca `package.json` → `files` ni retira `agents/` (chore de cierre, l.61), y no edita archivos de STORY-131…133 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E (criterio DoD PLAN evaluado ⚠️ por la regla de duda)
- **Descripción:** se perdió la forma escapada que la regla de escape de D-7 manda escribir. design.md l.140 dice que la tabla de TC-007/TC-008 muestra los valores «con los escapes incluidos», pero l.144-145 muestran `agents/project-story-mapper` y `project-story-mapper.agent.md` en texto literal. l.147 dice «(`r` = `r`)», cuando debería decir algo como `r` = `r`. T010 repite el defecto: «con la regla de escape de D-7 (`project-story-mapper`)». En cambio, STORY-131 (design.md l.157, `agents/project-pm`) sí lo conserva. Quien implemente sabe que debe escapar «una letra r», pero no qué cadena exacta escribir. Si la escribe literal, falla el contrato 3. T010 y T013 lo detectarían, así que el riesgo queda contenido.
- **Archivo afectado:** `design.md` — sección «D-7 — Evals», l.140-147; `tasks.md` — sección «4. Ficha del skill y evals», T010 (l.47)
- **Acción requerida:** escribir la forma exacta, por ejemplo `agents/project-story-mapper` y `project-story-mapper.agent.md`, en la tabla de D-7, en la regla de l.147 (`r` = `r`) y en T010.

### INC-002 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** la historia (story.md, Notas l.59) declara cubrir el criterio de salida de la épica «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null`)». design.md solo lo menciona como conducta esperada (F-1 paso 3: «Pregunta al usuario… inline (en Codex)»; D-4, rechazo del subagente). Ningún contrato de verificación (1-11) ni tarea (T001-T020) lo comprueba, y el contrato 10 ejecuta los evals con el runner por defecto.
- **Archivo afectado:** `design.md` — sección «Contratos de verificación»; `tasks.md` — T019 (l.59)
- **Acción requerida:** añadir un contrato manual con `npm run test:eval -- project-story-mapping --eval-runner codex` y mencionarlo en T019. Otra opción: dejar explícito en story.md (Notas) que la verificación en `codex` se delega al SMOKE-1 o al chore de cierre de la épica.

---

## Recomendaciones

1. **INC-001:** en `design.md` § D-7, sustituir l.147 «(`r` = `r`)» por «(`r` = `r`)». En la tabla de l.144-145, escribir en `not_contains` las formas escapadas exactas (`agents/project-story-mapper`, `project-story-mapper.agent.md`). En `tasks.md` T010, sustituir «(`project-story-mapper`)» por la misma forma escapada. Así T010 queda autocontenida y alineada con STORY-131 y STORY-133.
2. **INC-002:** en `design.md` § «Contratos de verificación», añadir el contrato 12 «Comportamiento en runtime `codex`: `npm run test:eval -- project-story-mapping --eval-runner codex` (manual): TC-001…TC-008 en verde — AC-1, AC-2, CNF-1». En `tasks.md` T019, añadir la ejecución manual de ese contrato. Si se prefiere no ampliar el alcance, corregir story.md (Notas l.59) para decir que la verificación en `codex` queda para el SMOKE-1 de la épica.
3. **Opcional:** al implementar, aplicar la mitigación de Risks «Uniformidad». Antes de T005, comparar con `grep "Rol local no encontrado"` el texto de I-3 con el que STORY-131 haya implementado, si ya existe en `skills/project-begin/` o `skills/project-discovery/`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Los escenarios de prueba de AC-1 y AC-2 sí están especificados en design.md § D-7 (TC-007 `happy-path`, TC-008 `fail-fast`) y se implementan en T010.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-134` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-134` — disponible |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (resuelto por `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal) y AC-2 (error) en bloques `gherkin` con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4, D-6, D-7, I-1, I-2, I-4, F-1. AC-2: D-5, I-3, F-2, TC-008 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-7 llevan `// satisface: AC-N`; las tablas de Componentes, Interfaces y Contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ⚠️ | WARNING | Open Questions: «Ninguna». Todas las decisiones están tomadas, pero el valor literal del escape de D-7 se perdió (INC-001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` existe (T001-T020) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T002-T004, T006-T011, T020. AC-2: T005, T010, T015. Cada tarea toca un archivo y una decisión. T004 y T007 agrupan varias ediciones del mismo archivo, pero todas pertenecen a una sola decisión (D-3 y D-6) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
