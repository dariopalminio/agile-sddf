---
type: testcases
id: STORY-089
slug: STORY-089-rechazo-nombra-ejecutor-correcciones-testcases
title: "Test Cases: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md"
story: STORY-089
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-089-rechazo-nombra-ejecutor-correcciones
---

<!-- Referencias -->
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]

# Casos de Prueba: Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 10 |
| API  | 0 |
| E2E  | 4 |
| EV   | 15 |

> Sujeto bajo prueba: (a) los skills `story-code-review` y `story-implement-tasks` como sujetos de validación (EV, ejecutables con `/skill-test-evals` sobre `evals/evals.json`; el "código de producción" de este repo son los `SKILL.md` — no hay funciones ni componentes UI, por eso UT/CT/API = 0); (b) la coherencia entre template, ejemplos, skills, dominios, épica, ADR y guías (IT, verificables por lectura/`grep`/`diff` sin ejecutar nada); (c) los escenarios Gherkin de `story.md` y el ciclo completo de la épica (E2E, ejecutables sobre el fixture real STORY-090). Refs: `AC-n` = `story.md` (numeración de `design.md` › Context), `D-n` = decisiones de `design.md`, `V-n` = contratos de verificación de `design.md`, `CR-n` = registro de cambios de `design.md`, `T-x.y` = `tasks.md`.

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | El rechazo encola la historia y nombra al ejecutor de correcciones | `story.md` de STORY-NNN en `IMPLEMENT/DONE`, sin `fix-directives.md` previo; los revisores consolidan ≥1 hallazgo HIGH o MEDIUM | Se ejecuta `/story-code-review STORY-NNN` y cierra con `review-status: needs-changes` | `story.md` queda en `READY-FOR-IMPLEMENT/DONE`; existe `fix-directives.md` con `round: 1` en su frontmatter; `tasks.md` (si existe) no recibe ninguna línea nueva (`git diff -- tasks.md` vacío); el mensaje final contiene `→ Ejecuta /story-implement STORY-NNN` | AC-1, AC-5, V-1 |
| E2E-002 | End-to-End | Segunda ronda de rechazo | `fix-directives.md` con `round: 1` en el directorio; `story.md` en `IMPLEMENT/DONE`; `tasks.md` presente | `/story-code-review STORY-NNN` vuelve a cerrar en `needs-changes` | `fix-directives.md` se sobreescribe con `round: 2`; el mensaje final nombra `/story-implement STORY-NNN` y menciona `/story-implement-tasks STORY-NNN` como alternativa; `tasks.md` sin cambios | AC-2, NFR-4, V-2, V-11 |
| E2E-003 | End-to-End | La aprobación limpia la señal de rework | `fix-directives.md` de una ronda anterior (`round: N`) en el directorio; `story.md` en `IMPLEMENT/DONE`; ningún hallazgo HIGH/MEDIUM | `/story-code-review STORY-NNN` cierra en `approved` | `fix-directives.md` no existe en el directorio; `story.md` queda en `CODE-REVIEW/DONE`; el resumen muestra `🗑️ fix-directives.md eliminado (revisión anterior superada)` | AC-3, AC-4, V-4 |
| E2E-004 | End-to-End | Ciclo completo sin edición manual del frontmatter (smoke de EPIC-19, fixture STORY-090) | STORY-090 en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` legado (sin `round`) y `tasks.md` con el literal `- [ ] Implementar fix-directives.md` | Se ejecuta `/story-implement-tasks STORY-090` y después `/story-code-review STORY-090` | Tras el primer comando `story.md` está en `IMPLEMENT/DONE` y las correcciones se aplicaron una vez; tras el segundo, o bien `fix-directives.md` tiene `round: 1` y `story.md` vuelve a `READY-FOR-IMPLEMENT/DONE` con el mensaje `→ Ejecuta /story-implement STORY-090`, o bien `approved` elimina el archivo y deja `CODE-REVIEW/DONE`; en ningún punto se editó `story.md` a mano ni cambió `tasks.md` por acción de `story-code-review` | AC-1, AC-3, AC-5, AC-6, V-5, V-11, T-7.5, T-7.6 |
| EV-001 | Eval | `story-code-review` — needs-changes sin `fix-directives.md` previo genera `round: 1` | Caso `needs-changes-hallazgo-high-genera-fix-directives`: `IMPLEMENT/DONE`, `story.md` + `design.md` + `tasks.md`, hallazgo HIGH del Tech-Lead | Se ejecuta el skill | Output contiene `needs-changes`, `round: 1`, `READY-FOR-IMPLEMENT`, `→ Ejecuta /story-implement`; no contiene `Implementar fix-directives.md` ni `CODE-REVIEW/DONE` | AC-1, AC-5, D-2, D-4, V-1, T-1.1 |
| EV-002 | Eval | `story-code-review` — segunda ronda incrementa `round` | Caso `needs-changes-segunda-ronda-incrementa-round`: `fix-directives.md` previo con `round: 1`, `tasks.md` presente, hallazgo MEDIUM | Se ejecuta el skill | Output contiene `round: 2`, `→ Ejecuta /story-implement` y `/story-implement-tasks`; no contiene `round: 1` ni `Implementar fix-directives.md` | AC-2, D-2, D-3, V-2, T-1.2 |
| EV-003 | Eval | `story-code-review` — sin `tasks.md` no se menciona `/story-implement-tasks` | Caso `needs-changes-sin-tasks-md-no-menciona-implement-tasks`: artefactos `story.md` + `design.md` únicamente, hallazgo HIGH | Se ejecuta el skill | Output contiene `round: 1` y `→ Ejecuta /story-implement`; no contiene `/story-implement-tasks` ni `Implementar fix-directives.md`; el skill no falla por ausencia de `tasks.md` | AC-2, D-3, V-3, T-1.3 |
| EV-004 | Eval | `story-code-review` — `approved` elimina el `fix-directives.md` previo | Caso `approved-elimina-fix-directives-previo`: `fix-directives.md` previo (`round: 1`), cuatro agentes sin HIGH/MEDIUM | Se ejecuta el skill | Output contiene `approved`, `fix-directives.md eliminado`, `CODE-REVIEW`, `DONE`; no contiene `READY-FOR-IMPLEMENT` ni `round: 2` | AC-3, D-7, V-4, T-1.4 |
| EV-005 | Eval | `story-code-review` — `fix-directives.md` legado sin `round` se trata como ronda 0 | `fix-directives.md` previo cuyo frontmatter no tiene `round` (forma de STORY-090), hallazgo MEDIUM | Se ejecuta el skill en `needs-changes` | Genera `round: 1` sin error ni advertencia bloqueante; el archivo se sobreescribe | AC-5, D-2, V-5 |
| EV-006 | Eval | `story-code-review` — `round` ilegible reinicia en 1 | `fix-directives.md` previo con `round: abc` (editado a mano) | Se ejecuta el skill en `needs-changes` | Genera `round: 1`; el pipeline no se bloquea | D-2, riesgo "round editado a mano" |
| EV-007 | Eval | `story-code-review` — no escribe en `tasks.md` bajo ninguna condición | `tasks.md` presente con N líneas; review en `needs-changes` | Se ejecuta el skill | `tasks.md` conserva exactamente N líneas y el mismo contenido; el output no contiene `📝 Tarea agregada` | AC-1, AC-6, D-4, NFR-4, V-11 |
| EV-008 | Eval | `story-code-review` — idempotencia de la re-ejecución en `needs-changes` | Historia ya rechazada (`round: 1`), sin cambios de código | Se ejecuta el skill dos veces consecutivas | Solo cambian `fix-directives.md` (`round` +1 cada vez), `code-review-report.md` y `story.md`; ningún otro archivo del directorio cambia | NFR-4, D-2, V-11 |
| EV-009 | Eval | `story-code-review` — precondición de estado intacta (fail-fast) | `story.md` en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` presente (historia encolada tras rechazo) | Se ejecuta `/story-code-review` | El skill se detiene con el error de precondición existente (`requiere IMPLEMENT/DONE`) sin tocar `fix-directives.md`, `round` ni `story.md` | AC-4, D-4 (regresión) |
| EV-010 | Eval | `story-implement-tasks` — aplica `fix-directives.md` por presencia, sin literal de tarea | Caso `fix-directives-presente-sin-literal-aplica-correcciones`: `READY-FOR-IMPLEMENT/DONE`, `tasks.md` todo `[x]` sin el literal, `fix-directives.md` con un hallazgo en `src/auth.ts:42` | Se ejecuta el skill | Output contiene `Correcciones de fix-directives.md (ronda 1)`, `corregido: src/auth.ts`, `IMPLEMENT/DONE`; no contiene `No hay tareas pendientes` ni `Implementar fix-directives.md`; `tasks.md` sin líneas nuevas | AC-6, D-5, V-6, T-1.5, T-4.1, T-4.2 |
| EV-011 | Eval | `story-implement-tasks` — `tasks.md` legado con el literal no re-aplica correcciones | Caso `tasks-md-legado-con-literal-no-reaplica`: `tasks.md` con `- [ ] Implementar fix-directives.md` como única pendiente, `fix-directives.md` con un hallazgo | Se ejecuta el skill | La corrección se aplica una sola vez (pre-paso 2f); la tarea queda `[x]` con la nota `aplicado en pre-paso 2f`; output contiene `IMPLEMENT/DONE` | AC-6, D-5, V-7, T-1.6, T-4.3 |
| EV-012 | Eval | `story-implement-tasks` — gate de salida anticipada sigue activo sin `fix-directives.md` | `tasks.md` todo `[x]`, sin `fix-directives.md`, `story.md` en `READY-FOR-IMPLEMENT/DONE` | Se ejecuta el skill | Output contiene `No hay tareas pendientes en tasks.md`; no se modifica ningún archivo (`story.md` sigue en `READY-FOR-IMPLEMENT/DONE`) | D-5 (regresión AC-3 de STORY-067), T-4.1 |
| EV-013 | Eval | `story-implement-tasks` — literal legado sin `fix-directives.md` se bloquea | `tasks.md` con `- [ ] Implementar fix-directives.md` pendiente y sin `fix-directives.md` en el directorio | Se ejecuta el skill | La tarea se marca `[~]` con `fix-directives.md no encontrado en <ruta>`; el skill continúa con las demás tareas sin error fatal | D-5, T-4.3 |
| EV-014 | Eval | `story-implement-tasks` — hallazgo con archivo inexistente no aborta las correcciones restantes | `fix-directives.md` con dos hallazgos: uno en un archivo inexistente y otro en un archivo real | Se ejecuta el pre-paso 2f | Output contiene `⚠️ archivo no encontrado: <ruta>` y `💻 corregido: <ruta real>`; la sección "Correcciones de fix-directives.md (ronda N)" de `implement-report.md` lista el hallazgo omitido | D-5, T-4.2, T-4.5 |
| EV-015 | Eval | `story-implement-tasks` — `fix-directives.md` sin `round` se reporta como ronda 1 | `fix-directives.md` legado sin campo `round` (STORY-090) | Se ejecuta el pre-paso 2f | El anuncio y la sección del reporte dicen `(ronda 1)`; el skill no escribe `round` en `fix-directives.md` (escritor único: `story-code-review`) | AC-5, D-5, T-4.2 |
| IT-001 | Integration | Template `fix-directives-template.md` ↔ Paso 4f de `story-code-review` | Template con `round: {{ROUND}}` y línea `**Ronda:** {{ROUND}}`; SKILL.md Paso 4f lista los campos del frontmatter | Se comparan los placeholders del template con los campos que el Paso 4f declara completar | Todo placeholder del template tiene un campo en 4f (incluido `round`) y viceversa; ninguna línea del template ni de los ejemplos contiene `READY-FOR-VERIFY` (`grep -rn "READY-FOR-VERIFY" skills/story-code-review/` = 0) | AC-5, D-6, V-8, T-2.3, T-3.1 |
| IT-002 | Integration | Ejemplos `fix-directives.md` ↔ template | `examples/example-needs-changes/fix-directives.md` y `examples/example-needs-changes-medium/fix-directives.md` regenerados | Se comparan sus secciones con el template | Ambos tienen `round: 1`, la línea "Ronda: 1" y el "Ciclo de corrección" que nombra `/story-implement` y termina en `CODE-REVIEW/DONE` | D-6, NFR-1, T-3.2, T-3.3 |
| IT-003 | Integration | `story-code-review` SKILL.md ↔ contrato "sin escritura en tasks.md" | SKILL.md editado (Objetivo, Posicionamiento, 4g, Paso 7, Salida) | `grep -n "tasks.md" skills/story-code-review/SKILL.md` y `grep -rn "Implementar fix-directives.md" skills/story-code-review/` | El literal `Implementar fix-directives.md` no aparece en ningún archivo del skill; las menciones a `tasks.md` se limitan a la tabla de Entrada y al cálculo de `$TASKS_EXISTS`; no existe el sub-paso `4g.1` ni la referencia `4g.2` | AC-1, D-4, V-8, T-2.1, T-2.4, T-2.5, T-2.6 |
| IT-004 | Integration | Mensaje de cierre de `story-code-review` ↔ gate 1d de `story-implement-tasks` | Paso 7 nombra `/story-implement-tasks <id>` solo con `$TASKS_EXISTS`; 1d de `story-implement-tasks` acepta `READY-FOR-IMPLEMENT/DONE` | Se leen ambos skills | El estado que deja `story-code-review` (`READY-FOR-IMPLEMENT/DONE`) es una precondición válida de 1d; la descripción de 1d y el Posicionamiento ya no dicen "viene de story-code-review needs-changes" para `IMPLEMENT/IN-PROGRESS` | AC-4, D-3, D-5, T-4.6 |
| IT-005 | Integration | Evals ↔ SKILL.md (principio 11) | `skills/story-code-review/evals/evals.json` con 4 casos tocados y `skills/story-implement-tasks/evals/evals.json` nuevo con 2 casos | Se ejecuta `/skill-test-evals` sobre ambos skills tras refrescar `.claude/skills/` | Todos los casos pasan; `diff -r skills/story-code-review .claude/skills/story-code-review` y el equivalente para `story-implement-tasks` no muestran diferencias | V-12, CR-002, T-7.1, T-7.2, T-7.3 |
| IT-006 | Integration | Dominios ↔ ADR-0008 | `domain-story-lifecycle.md` (glosario "Rework") y `domain-state-management.md` §5.3 editados | `grep -n "REWORK" docs/domains/domain-state-management.md`; lectura del glosario | `REWORK` no aparece; ambos documentos dicen que la señal de rework es el artefacto de fallo y citan ADR-0008; invariante 6, diagrama y tabla 4.3 de `domain-story-lifecycle.md` no cambiaron (`git diff` limitado a la línea del glosario) | AC-4, NFR-1, D-8, V-9, T-6.1, T-6.2 |
| IT-007 | Integration | Épica EPIC-19 ↔ decisión | `epic.md` editado en bullet STORY-089, Escenario 3, dependencia crítica, riesgo, `updated` | `grep -n "NEEDS-CHANGES\|knowledge/guides/state-machine\|STORY-089-story-fix-post-code-review" docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` | 0 resultados; el criterio de éxito 4 (l. 110) sigue textual; STORY-089 sigue listada con `[ ]` hasta 7.7 | NFR-3, D-8, V-9, T-6.3 |
| IT-008 | Integration | ADR-0008 ↔ template e índice | `docs/adr/ADR-0008-rework-sin-estado-propio.md` creado; fila en `docs/adr/README.md` | Se compara con `adr-template.md` y se lee el índice | Frontmatter completo (`id`, `slug`, `status: ACCEPTED`, `date`, `supersedes: null`, `superseded-by: null`); secciones Contexto, Decisión, Rationale, Alternativas (≥4: `NEEDS-CHANGES`, `REWORK`, `rework:`, `story-fix`), Consecuencias, Referencias; cita EPIC-19 Escenario 3; ADR-0003 no recibe `superseded-by`; la fila del índice existe | NFR-2, D-8, V-10, T-5.1, T-5.2 |
| IT-009 | Integration | Guías y README ↔ flujo post-review | `sddf-commands-pipeline.md` con sección 4; `README.md` l. 406/412 y `docs/domains/README.md` l. 64 editados | Lectura y `grep -rn "state-machine.md" README.md docs/domains/README.md` | La sección 4 describe `needs-changes → READY-FOR-IMPLEMENT/DONE + fix-directives.md (round N) → /story-implement`; ninguna referencia a `state-machine.md` inexistente; l. 406 menciona `round`/señal de rework | NFR-1, D-8, CR-001, T-6.4, T-6.5 |
| IT-010 | Integration | CHANGELOG ↔ cambios de la historia | `CHANGELOG.md` con sección `[Unreleased]` | Lectura de la entrada | Menciona: `story-code-review` sin escritura en `tasks.md`, `round`, ejecutor nombrado; `story-implement-tasks` por presencia (2f); corrección `READY-FOR-VERIFY`; `[[ADR-0008-rework-sin-estado-propio]]` | NFR-1, T-6.6 |

## Notas de cobertura

- `tasks.md` fue usado como fuente de enriquecimiento: cada caso EV/IT referencia la tarea `T-x.y` que lo hace pasar; los grupos 1 (evals) y 7 (verificación) de `tasks.md` son el espejo ejecutable de EV-001…EV-004, EV-010, EV-011 e IT-005.
- Los tres escenarios Gherkin de `story.md` tienen E2E 1-a-1 (E2E-001…E2E-003). E2E-004 no proviene de un Gherkin de la historia sino del Flujo 4 de `design.md` y del criterio de éxito 4 de EPIC-19; se ejecuta sobre el fixture real STORY-090 y es el único caso que depende del resultado del review (bifurca en `needs-changes`/`approved`).
- Los requerimientos AC-4 (sin estado nuevo) y AC-5 (escritor único de `round`) no tienen escenario Gherkin propio: se cubren por inspección (IT-001, IT-004, IT-006) y por los evals de ronda (EV-001, EV-002, EV-005, EV-006, EV-015).
- EV-005, EV-006, EV-008, EV-009, EV-012…EV-015 no tienen caso en `evals.json` en `tasks.md` (grupo 1 solo crea los seis casos mínimos de D-7). Se especifican aquí para que `story-implement-tasks` pueda añadirlos si el presupuesto lo permite; EV-009 y EV-012 son regresiones de comportamiento existente y deben verificarse al menos manualmente.
- Fuera de alcance de este artefacto (por `story.md` › Non-Goals): el modo rework de `story-implement` (STORY-091), las reglas de RED/lista blanca (STORY-092) y las señales de rework de `story-verify`/`story-acceptance`. Ningún caso ejecuta `/story-implement`.
- Gap conocido: no existe un runner que ejecute `evals.json` de forma determinista contra un skill Markdown; `/skill-test-evals` evalúa con LLM. Los IT compensan con verificaciones deterministas (`grep`/`diff`).

## Test Cases Progress for STORY-089

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: El rechazo encola la historia y nombra al ejecutor de correcciones
- [ ] E2E-002: Segunda ronda de rechazo
- [ ] E2E-003: La aprobación limpia la señal de rework
- [ ] E2E-004: Ciclo completo sin edición manual del frontmatter (smoke de EPIC-19, fixture STORY-090)
- [ ] EV-001: `story-code-review` — needs-changes sin `fix-directives.md` previo genera `round: 1`
- [ ] EV-002: `story-code-review` — segunda ronda incrementa `round`
- [ ] EV-003: `story-code-review` — sin `tasks.md` no se menciona `/story-implement-tasks`
- [ ] EV-004: `story-code-review` — `approved` elimina el `fix-directives.md` previo
- [ ] EV-005: `story-code-review` — `fix-directives.md` legado sin `round` se trata como ronda 0
- [ ] EV-006: `story-code-review` — `round` ilegible reinicia en 1
- [ ] EV-007: `story-code-review` — no escribe en `tasks.md` bajo ninguna condición
- [ ] EV-008: `story-code-review` — idempotencia de la re-ejecución en `needs-changes`
- [ ] EV-009: `story-code-review` — precondición de estado intacta (fail-fast)
- [ ] EV-010: `story-implement-tasks` — aplica `fix-directives.md` por presencia, sin literal de tarea
- [ ] EV-011: `story-implement-tasks` — `tasks.md` legado con el literal no re-aplica correcciones
- [ ] EV-012: `story-implement-tasks` — gate de salida anticipada sigue activo sin `fix-directives.md`
- [ ] EV-013: `story-implement-tasks` — literal legado sin `fix-directives.md` se bloquea
- [ ] EV-014: `story-implement-tasks` — hallazgo con archivo inexistente no aborta las correcciones restantes
- [ ] EV-015: `story-implement-tasks` — `fix-directives.md` sin `round` se reporta como ronda 1
- [ ] IT-001: Template `fix-directives-template.md` ↔ Paso 4f de `story-code-review`
- [ ] IT-002: Ejemplos `fix-directives.md` ↔ template
- [ ] IT-003: `story-code-review` SKILL.md ↔ contrato "sin escritura en tasks.md"
- [ ] IT-004: Mensaje de cierre de `story-code-review` ↔ gate 1d de `story-implement-tasks`
- [ ] IT-005: Evals ↔ SKILL.md (principio 11)
- [ ] IT-006: Dominios ↔ ADR-0008
- [ ] IT-007: Épica EPIC-19 ↔ decisión
- [ ] IT-008: ADR-0008 ↔ template e índice
- [ ] IT-009: Guías y README ↔ flujo post-review
- [ ] IT-010: CHANGELOG ↔ cambios de la historia
