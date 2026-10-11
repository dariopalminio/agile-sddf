---
type: analyze
id: STORY-115
slug: STORY-115-analyze-report
title: "Analyze: Actualizar scaffolding de memory-system a specs/ de dos niveles"
story: STORY-115
design: STORY-115
tasks: STORY-115
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---

<!-- Referencias -->
[[STORY-115-scaffold-dos-niveles-y-capas-destino]]

# Reporte de Coherencia: Actualizar scaffolding de memory-system a specs/ de dos niveles

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y los 4 CNF también) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no existe |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 20/20 elementos con tarea (13 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Historia listada y objetivo alineado con SMOKE-1; el criterio de salida L49 de la épica no admite la excepción que el diseño necesita para detectar la estructura vieja (INC-001) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, ninguno ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR · 2 WARNING). Nada bloquea el paso a `READY-FOR-IMPLEMENT`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Proyecto vacío: `scaffold` crea `specs/epics/`, `specs/stories/`, `product/{vision,stakeholders,objectives,roadmap}.md` y `requirements/{functional,non-functional}/`; no crea `01-projects/`, `02-epics/` ni `03-stories/` (story.md L32-40) | ✓ | Goals L58-59; D-1 (árbol semilla: quitar `01-projects/.gitkeep`, crear los `.gitkeep` de `requirements/`); D-2 (semilla `roadmap.md`); D-3 (`product/README.md`); D-4 (textos de dos niveles); "Esquema de datos" L300-308; F-1; contrato #1 |
| AC-2 | Estructura antigua: nada bajo `01-projects/`, `02-epics/` ni `03-stories/` cambia; aviso `[WARNING]` hacia `migrate --from=specs-3-levels`; mismo exit code (story.md L42-49) | ✓ | Goals L60-61; D-5 (`detectLegacyLevels`, `warnings[0]`, exit 0, `--dry-run`, harness sin `specs`); D-7 (SKILL.md y `memory-rules.md`); Interfaces "Línea de aviso" y "Exit code de `scaffold`"; F-2; contrato #2 |
| AC-3 | Idempotencia: la segunda ejecución termina con `creados: 0 · sobrescritos: 0` y conserva un `roadmap.md` editado (story.md L51-58) | ✓ | Goals L62; D-2 viñeta "Idempotencia (AC-3)" (copia-si-falta marca `[PRESERVADO]`); Interfaz "Resumen" (última línea); F-3; contrato #3 |

Los criterios no funcionales también tienen cobertura: CNF-1 → D-1, D-3, D-4, D-7, contrato #4; CNF-2 → D-2, contrato #5; CNF-3 → D-5, D-6, contrato #6; CNF-4 → D-1 ("Encoding"), contrato #7.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. La matriz de pruebas de D-8 (`S096-UT-001`, `S096-UT-001b`, `S096-UT-001c`, `S115-UT-001…007`, TC-007 y el eval nuevo) cubre los tres AC y los cuatro CNF, y las tareas T012–T017 la recogen.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base: `npm test`, verificadores, presencia de STORY-108/111/114, último `TC-NNN`, grep de `specs-projects`/`01-projects` | Context (dependencia de STORY-108), reglas condicionales de D-2, D-5 y D-8, contratos #6 y #9 | ✓ |
| T002 | `git rm` de `assets/scaffold/specs/01-projects/.gitkeep` | D-1; componente "Semilla `01-projects`" | ✓ |
| T003 | Crear `requirements/functional/.gitkeep` y `requirements/non-functional/.gitkeep` vacíos | D-1; componente "Semillas de requisitos" | ✓ |
| T004 | Crear la semilla `product/roadmap.md` | D-2; componente "Semilla roadmap" | ✓ |
| T005 | `product/README.md` con cuatro documentos fijos | D-3; componente "README de producto" | ✓ |
| T006 | `specs/README.md` (semilla) de dos niveles | D-4; componente "README de specs y constitución" | ✓ |
| T007 | `constitution.md` (semilla), "Jerarquía de desarrollo" | D-4; componente "README de specs y constitución" | ✓ |
| T008 | `detectLegacyLevels` en `specs-3-levels.js` (ampliar o crear mínimo) | D-5; componente "Módulo de niveles heredados"; interfaces `detectLegacyLevels` y `LEGACY_LEVELS`; F-4 | ✓ |
| T009 | `SPECS_LAYERS` sin `'01-projects'` | D-6; componente "Motor"; interfaz `SPECS_LAYERS` / `KNOWN_LAYERS` | ✓ |
| T010 | Aviso en `scaffold()` como `warnings[0]`, también con `--dry-run`, exit 0 | D-5; componente "Motor"; interfaces `scaffold(options)`, "Línea de aviso", "Resumen" y "Exit code"; F-2 | ✓ |
| T011 | Quitar `### L3 — Proyecto` y `{layer:specs-projects}` de `index-template.md` | D-6; componente "Template del índice" | ✓ |
| T012 | Actualizar `S096-UT-001` (árbol creado sobre proyecto vacío) | D-8 fila `S096-UT-001`; contrato #1 | ✓ |
| T013 | Árbol semilla exacto y aserción negativa en `S096-UT-001b` | D-8 filas "Árbol semilla exacto" y `S096-UT-001b`; contratos #1 y #4 | ✓ |
| T014 | `S115-UT-001…003` (aviso completo, parcial y `--dry-run`, harness) | D-8; contrato #2 | ✓ |
| T015 | `S115-UT-004` (idempotencia) y `S115-UT-005` (roadmap = template) | D-8; contratos #3 y #5 | ✓ |
| T016 | `S115-UT-006` (encoding) y `S115-UT-007` (capa retirada) | D-8; contratos #6 y #7 | ✓ |
| T017 | Evals: TC-007 y el caso nuevo; fixture `examples/specs-3-levels` mínima si falta | D-8 ("evals.json"); componentes "Evals" y "Fixture de tres niveles"; contrato #8 | ✓ |
| T018 | `SKILL.md`: "Qué hace", contrato de salida, regla nueva, scaffold inline y `## Salida` | D-7; componente "Skill"; CR-004 | ✓ |
| T019 | `memory-rules.md` §2, §3 y §5 | D-6 y D-7; componente "Reglas" | ✓ |
| T020 | Entrada en `CHANGELOG.md` › `[Unreleased]` › `Changed` | Tarea transversal de release. No figura en "Componentes afectados", pero resume el resultado de D-1…D-7 (convención del repo, igual que STORY-114 T030) | ✓ |
| T021 | `npm test` exit 0 contra la línea base | Contratos #1–#7 | ✓ |
| T022 | Validar `evals.json`, inventario de evals y `test:eval --dry-run` | Contrato #8 | ✓ |
| T023 | Greps de cierre de CNF-1 y CNF-3 | Contratos #4 y #6 | ✓ |
| T024 | `audit-root-resolution`, `verify:links`, `verify:syntax` y BOM | Contrato #7; D-1 ("Encoding") | ✓ |
| T025 | Regenerar `docs/index.md` solo si `docs/specs/01-projects/` ya no existe | D-6; componente "Índice de este repo"; contrato #9; riesgo "`docs/specs/01-projects/` de este repo aún existe" | ✓ |
| T026 | Validación manual de AC-1, AC-2 y AC-3 | F-1, F-2 y F-3 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Semilla `01-projects` (eliminar) | Componentes afectados; D-1 | T002 | ✓ |
| Semilla roadmap | Componentes afectados; D-2 | T004 (T015 la prueba) | ✓ |
| Semillas de requisitos | Componentes afectados; D-1 | T003 | ✓ |
| README de producto | Componentes afectados; D-3 | T005 | ✓ |
| README de specs y constitución (semillas) | Componentes afectados; D-4 | T006, T007 | ✓ |
| Motor `memory-system.js` | Componentes afectados; D-5, D-6 | T009, T010 | ✓ |
| Módulo de niveles heredados `specs-3-levels.js` | Componentes afectados; D-5 | T008 | ✓ |
| Template del índice | Componentes afectados; D-6 | T011 | ✓ |
| Reglas `memory-rules.md` | Componentes afectados; D-6, D-7 | T019 | ✓ |
| Skill `SKILL.md` | Componentes afectados; D-7 | T018 | ✓ |
| Evals | Componentes afectados; D-8 | T017 | ✓ |
| Fixture de tres niveles | Componentes afectados; D-8 | T017 (crear mínima si falta) | ✓ |
| Pruebas `test/memory-system.test.js` | Componentes afectados; D-8 | T012–T016 | ✓ |
| Índice de este repo | Componentes afectados; contrato #9 | T025 | ✓ |
| `detectLegacyLevels(specsBase)` | Interfaces | T008 | ✓ |
| `LEGACY_LEVELS` | Interfaces | T008 (la consumen T012 y T014) | ✓ |
| `scaffold(options)` (`warnings[0]`) | Interfaces | T010 | ✓ |
| Línea de aviso | Interfaces | T010 (T014 la verifica literalmente) | ✓ |
| Resumen (última línea) | Interfaces | T010 (sin cambios), T014, T015 | ✓ |
| `SPECS_LAYERS` / `KNOWN_LAYERS` | Interfaces | T009 (T013 la verifica) | ✓ |
| Exit code de `scaffold` | Interfaces | T010 (T014 lo verifica) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | epic.md › "Historias", línea de STORY-115 (L38), y fila 8 de la tabla de dependencias ("Actualizar scaffolding de `memory-system`", depende de 5 = renombrado). design.md › Context L47-48 asume STORY-108 integrada, y T001 detiene la implementación si no lo está |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (empezar con la estructura de ADR-0013, sin `01-projects/` vacía) corresponde al alcance "actualizar […] scaffolding de `memory-system`" (L23) y a SMOKE-1 (L59-65): `specs/{epics,stories}/`, sin los tres niveles viejos, `product/{vision,stakeholders,roadmap}.md` y `requirements/{functional,non-functional}/`. AC-1 cubre todo SMOKE-1 y añade `objectives.md` |
| Restricciones de la épica respetadas | ⚠️ | Se respeta el orden "primero skills y scaffolding, luego migración" sin depender de STORY-114, porque D-5 y D-8 tienen reglas para crear el módulo o reutilizarlo. Queda un punto por precisar: el criterio de salida L49 ("Ningún skill ni agente referencia `specs/01-projects/` …") sigue sin la excepción que el diseño necesita (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D. Desalineación con la épica
- **Descripción:** el criterio de salida de EPIC-21 "Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`" (epic.md L49) no tiene excepción. El contrato #6 del diseño (design.md L358) y T023 aceptan `01-projects` en `scripts/specs-3-levels.js`, en la fixture `examples/specs-3-levels/`, en las evals del aviso y en las notas de §2/§5 de `memory-rules.md` y del `SKILL.md` (D-6 L202-203, D-7 L218 y L223). La entrada de STORY-113 (epic.md L36) sí dice que "01-projects" solo queda en la lógica de migración de `memory-system`. Este diseño amplía esa excepción a la detección de AC-2, como permite CNF-3 de story.md (L64). El CR-005 de STORY-114, que pide añadir la excepción a L49, sigue sin aplicarse en epic.md.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sección "Criterios de salida" (L49). En design.md, la sección "Contratos de verificación", fila #6.
- **Acción requerida:** aplicar CR-005 de STORY-114 en epic.md con el texto "salvo la lógica de migración y de detección de la estructura antigua de `memory-system`". Si no se aplica, el grep de cierre de la épica fallará por diseño.

### INC-002 [WARNING]

- **Tipo:** E. Criterio DoD PLAN con evidencia insuficiente (⚠️, no ❌)
- **Descripción:** el criterio "tasks.md DEBE contener únicamente tareas atómicas" se cumple casi siempre, pero algunas tareas agrupan varias piezas:
  - T001 junta cuatro verificadores y siete comprobaciones de línea base.
  - T014 agrupa tres pruebas (`S115-UT-001…003`).
  - T018 reúne cinco cambios en `SKILL.md`.
  - T019 toca tres secciones de `memory-rules.md`.

  Cada una tiene un único entregable verificable (un archivo o un bloque de pruebas), así que no se marca ❌ (regla de duda). La cobertura de escenarios es completa: AC-1 → T002–T007, T012, T013, T026; AC-2 → T008, T010, T014, T017, T018, T026; AC-3 → T004, T015, T026.
- **Archivo afectado:** `tasks.md`, grupos "1. Preparación" (T001), "5. Pruebas" (T014) y "6. Evals, skill y reglas" (T018, T019).
- **Acción requerida:** opcional. Dividir T014 por prueba y T018 por sección de `SKILL.md` si se quiere seguir el avance tarea por tarea con `/story-implement-tasks`.

---

## Recomendaciones

1. **INC-001:** en `epic.md` › "Criterios de salida" L49, añadir la excepción "salvo la lógica de migración y de detección de la estructura antigua de `memory-system` (`scripts/specs-3-levels.js`, su fixture, sus evals y las notas de `memory-rules.md`/`SKILL.md`)". Así quedan alineados el CR-005 de STORY-114, la entrada de STORY-113 y el contrato #6 de esta historia.
2. **INC-002:** opcional. Dividir T014 en `S115-UT-001`, `S115-UT-002` y `S115-UT-003`, y T018 en "contrato de salida + regla" y "scaffold inline + `## Salida`". No bloquea.
3. **Observación (no tipificada), CR-003 sin aplicar:** `story.md` sigue enlazando `[[ADR-0013-eliminar-specs-01-projects]]` en "Referencias" (L22) y en `related` (L15), pero el slug del ADR es `eliminar-specs-01-projects`. `memory-system check` lo informará como `broken-wikilink`. Corregirlo en `story.md` antes de implementar, o en la fase de implementación.
4. **Observación (no tipificada), CR-004:** aceptar en `story.md` › CNF-1 (L62) la interpretación de "la descripción del `SKILL.md`" como "las secciones del `SKILL.md` que describen el scaffold", que es lo que aplica T018.
5. **Observación (no tipificada), referencia de prueba:** design.md D-8 (L236) y T013 llaman a la prueba del árbol semilla "Árbol semilla exacto (l. 550-575)". En `test/memory-system.test.js` su ID es `S096-UT-001c` (l. 546). Conviene citar el ID en T013 para no depender del número de línea.
6. **Dependencias abiertas registradas como CR:** CR-001 (STORY-111 debe rellenar `## Épicas` cuando contiene el marcador de la semilla) y CR-002 (corregir F-3 de STORY-108 sobre el exit 2 de `index`) afectan a otros diseños. No bloquean esta historia, pero conviene aplicarlos antes de implementar STORY-111 y STORY-108.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-115` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-115` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (resuelto por `sddf.config.yaml › guardrails.dod.story.plan = dod-story-plan`, `enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 y AC-3 (alternativos) en bloques `gherkin` con Dado/Cuando/Entonces (story.md L32-58) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-1…D-4; AC-2 → D-5, D-7; AC-3 → D-2, F-3 (ver "Cobertura de Criterios de Aceptación") |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals (L58-66) y D-1…D-8 llevan `// satisface: …`. "Componentes afectados" e "Interfaces" tienen la columna "AC que satisface" completa en todas las filas, y "Contratos de verificación" tiene "AC origen" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna" (L376-378). El orden no fijado con STORY-111/114 se resuelve con reglas condicionales explícitas (D-2, D-5, D-8; "Decisiones de complejidad justificada"). Las ambigüedades restantes están en CR-001…CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (26 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | Los tres escenarios tienen tareas (INC-002). T001, T014, T018 y T019 agrupan varias piezas con un único entregable cada una |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (la condición no se activa) |
