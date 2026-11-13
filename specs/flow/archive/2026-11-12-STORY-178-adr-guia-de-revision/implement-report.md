---
type: implement-report
id: STORY-178
slug: STORY-178-implement-report
title: "Implement Report: ADR de la guía de revisión"
story: STORY-178
created: 2026-11-10
updated: 2026-11-10
---

# Reporte de Implementación: ADR de la guía de revisión

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-178 |
| Total de tareas | 22 |
| Tareas completadas | 0 (rework: ronda 1 de `fix-directives.md`) |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 22 |
| Fecha de implementación | 2026-11-10 (ejecución inicial y rework ronda 1) |

**Estado:** ✅ Implementación completa

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | docs/adr/ADR-0021-guia-de-revision-review-md.md:70-72 | MEDIUM | 💻 corregido: `docs/adr/ADR-0021-guia-de-revision-review-md.md` — el nivel 2 de «Precedencia» incluye los checklists que el DoD incorpora por referencia (`gr-ai-security-checklist`, `gr-code-security-checklist` vía `dod-story-implement`); el nivel 4 queda en los agentes y el baseline embebido del Security-Reviewer; nuevo párrafo «Checklists incorporados por el DoD» (`REVIEW.md` solo acota su aplicación y la severidad de cada hallazgo, sin declararlos no aplicables). Rationale 1 y 4 ajustados en coherencia |
| 2 | docs/adr/ADR-0021-guia-de-revision-review-md.md:110,123-125 | MEDIUM | 💻 corregido: `docs/adr/ADR-0021-guia-de-revision-review-md.md` — opción (b): `🟡 Nit` y «Tope de nits», como la plantilla; se quitó «las nombra STORY-179» y las secciones se atribuyen a `docs/templates/REVIEW-template.md`; nueva regla «`Nit`, no `Minor`» que documenta el ajuste |

**Archivos corregidos:** `docs/adr/ADR-0021-guia-de-revision-review-md.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

De paso se resolvió el LOW «baseline embebido no se define» (ahora «baseline embebido del Security-Reviewer»), en la
misma línea del hallazgo #1 y dentro de la lista blanca.

La historia es un `chore` documental, así que no hay ciclo TDD. Lo que verifica esta historia son los contratos de
verificación 1 a 11 de `design.md` (T016 a T022) y el gate del repositorio.

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Confirmar que ADR-0021 y el slug `guia-de-revision-review-md` siguen libres | ✓ completado | — (ADR-0021 libre; el slug no existe en `docs/`) |
| T002 | Estado de CR-001 | ✓ completado | — (ver «Decisiones durante la implementación») |
| T003 | Crear ADR-0021 con frontmatter y seis secciones | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T004 | `## Contexto y problema` con los dos bloques | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T005 | `### Ubicación` (D-2) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T006 | `### Precedencia` (D-3) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T007 | `### Fuente de lectura` (D-4) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T008 | `### Historias que modifican la guía o el DoD` (D-5) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T009 | `### Vocabulario` (D-6) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T010 | `## Rationale` | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T011 | `## Alternativas consideradas` (incluye rama base) | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T012 | `## Consecuencias` con puntos de cambio | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T013 | `## Referencias` con wikilinks verificados | ✓ completado | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| T014 | Fila en el índice de ADRs | ✓ completado | `docs/adr/README.md` |
| T015 | Línea en el índice wiki | ✓ completado | `docs/index.md` |
| T016 | Contratos 1 y 2 | ✓ completado | — |
| T017 | Contratos 3, 6 y 7 | ✓ completado | — |
| T018 | Contrato 5 (AC-2) | ✓ completado | — |
| T019 | Contratos 8 y 9 | ✓ completado | — |
| T020 | Contrato 4 y codificación | ✓ completado | — |
| T021 | `npm run verify:repository` y `npm test` | ✓ completado | — |
| T022 | Contrato 11 (alcance) | ✓ completado | — |

## Decisiones durante la implementación

- **CR-001 (T002):** `specs/flow/STORY-181-hallazgos-preexistentes/story.md` todavía dice «el método que fija el ADR de
  la guía de revisión» (AC-3 y nota «Depende de STORY-178»). Pero el `design.md` de STORY-181 ya fija el método en sus
  D-1 a D-3 y cita la delegación de ADR-0021 (D-6), y su `analyze.md` lo registra. Por eso el ADR **delega** el método
  en el `design.md` de STORY-181, como prevé D-6. El texto de `story.md` de STORY-181 queda fuera del alcance de esta
  historia: lo actualiza STORY-181, según su propio `analyze.md`.
- **Número del ADR:** ADR-0021 estaba libre. F-3 (degradación por número ocupado) no se aplicó.
- **Bloques de Contexto:** los dos bloques que pide CNF-3 son subtítulos `###` dentro de `## Contexto y problema`, así
  que los seis encabezados `##` coinciden con el template.
- **Vocabulario `Minor`, no `Nit` (decisión del mantenedor, 2026-11-10, durante la revisión ronda 2):** el rework de
  la ronda 1 eligió la opción (b) (`🟡 Nit` / «Tope de nits»). El mantenedor la revirtió a la opción (a) de
  `fix-directives.md`: `🟡 Minor` / «Tope de Minor», como el AC-2 de `story.md`. Motivo: «Nit» (de *nitpick*) es poco
  didáctico, mientras que «Minor» nombra un problema menor que vale la pena corregir pero no bloquea. El ADR lo documenta
  en la regla «`Minor`, no `Nit`» de «Vocabulario». El bloque «Lo que dice la convención de Anthropic» conserva la
  veracidad (CNF-3): dice que la documentación la llama *Nit*. `design.md` (D-6, F-2, contrato 5 y la atribución de las
  secciones) se alineó con el ADR.
- **Alineación fuera de STORY-178 (autorizada por el mantenedor, 2026-11-10):** se cambió «Nit» por «Minor» (y «Tope
  de nits» por «Tope de Minor») en `docs/templates/REVIEW-template.md` (líneas 10, 22, 36, 38 y 40-42), en
  `epic.md` de EPIC-28 (líneas 30, 31, 41 y 88) y en los artefactos de planificación de STORY-179, STORY-180, STORY-184
  y STORY-185. Así la plantilla coincide con la atribución de secciones del ADR. Estos archivos no son entregables de
  STORY-178 y no se cuentan en «Componentes afectados». Los informes históricos (`analyze.md`,
  `finvest-evaluation-report.md`, `code-review-report.md` de rondas anteriores) no se reescribieron.

## Verificación de contratos

| # | Contrato | Resultado | Evidencia |
|---|---|---|---|
| 1 | ADR-0021 existe y está aceptado | ✓ | `id: ADR-0021`, `status: ACCEPTED`, `slug: guia-de-revision-review-md` = nombre de archivo |
| 2 | Seis secciones en orden | ✓ | `##` en las líneas 14, 47, 136, 150, 196 y 223, en el orden del template; 0 coincidencias de `[Por completar]` y `escritor:` |
| 3 | Ubicación, precedencia y fuente | ✓ | `<REPO_ROOT>/REVIEW.md`; la tabla nombra `docs/constitution.md` y `docs/guardrails/dod-story-code-review.md`, y el párrafo siguiente `code-review-report-template.md`; «working tree» aparece 6 veces |
| 4 | README igual al frontmatter | ✓ | `docs/adr/README.md:70`: mismo título, `ACCEPTED`, `2026-11-10` |
| 5 | Una fila por severidad | ✓ | Líneas 115-117: Important → `HIGH` o `MEDIUM`/bloquea; Minor → `LOW`/no bloquea; Pre-existing → `PREEXISTENTE`/no bloquea (decisión del mantenedor en la ronda 2) |
| 6 | Historia que modifica la guía o el DoD | ✓ | Rige el working tree, hay advertencia en `code-review-report.md` y se detecta con `$IMPL_FILES` sin git |
| 7 | Sin cuarta raíz y ADR-0019 intacto | ✓ | Nombra `AGENTS.md` y `CLAUDE.md`; `git diff --stat -- docs/adr/ADR-0019-…` vacío |
| 8 | Rama base descartada con motivo | ✓ | `## Alternativas consideradas` › «Fuente de lectura» |
| 9 | Fuente citada y distinguida | ✓ | URL citada 2 veces con fecha 2026-11-07; bloques «Lo que dice la convención de Anthropic» y «Lo que decide agile-sddf» |
| 10 | Gate verde | ✓ | Ver «Pruebas ejecutadas» |
| 11 | Alcance acotado | ✓ | `git status`: los 3 archivos de «Componentes afectados» más artefactos de STORY-178 y la línea del checklist en `epic.md` |

Wikilinks de `## Referencias` comprobados a mano contra `slug:` (porque `check-doc-links.js` excluye `docs/adr`): los 11
resuelven. Codificación: los tres archivos empiezan por `---` (sin BOM) y tienen 0 bytes `EF BB BF` en el contenido.

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `npm run verify:repository` | ✓ código 0: «Verificación determinista del repositorio aprobada.» |
| `npm test` | ✓ código 0: 516 tests, 516 pass, 0 fail |

Tras el rework ronda 1 se volvieron a ejecutar los dos comandos, con el mismo resultado: `verify:repository` código 0 y
`npm test` 516/516. El ADR sigue con seis `##`, sin BOM y sin bytes `EF BB BF`.

No se ejecutaron evals (`npm run test:eval`): la historia no modifica ningún skill.

## Cumplimiento DoD — Fase IMPLEMENT

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1: contratos 1-4; AC-2: contrato 5; AC-3: contrato 6 |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: contrato 7; CNF-2: contrato 8; CNF-3: contrato 9; CNF-4: contrato 10 |
| 3 | El comportamiento coincide con `design.md` | ✓ | `## Decisión` sigue D-2 a D-6 en el orden del esquema de datos; Contexto, Rationale, Consecuencias y Referencias según D-7 |
| 4 | Sin regresiones | ✓ | `npm test` 516/516 y `verify:repository` en verde |
| 5 | Convenciones de `constitution.md` | ✓ | Documento en español; ADR nuevo sin editar ADRs aceptados (regla 16 / ADRs inmutables) |
| 6 | Sin código comentado ni `TODO` | ✓ | No se añade código; el ADR no tiene `TODO` ni `[Por completar]` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: no hay código |
| 8 | Linter y formateador sin errores | ⚠️ | El repo no tiene linter de Markdown aparte de `verify:repository`, que pasa |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Skill nuevo en `package.json › files` | ✓ | No aplica: no se crean skills |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | Sin prompts, agentes ni código ejecutable nuevos |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Sin código nuevo |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crean ni modifican skills |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: no se tocan skills |
| 16 | Casos de prueba ejecutados según `skill-master` | ⚠️ | No aplica a un ADR; requiere ejecución de evals, fuera del alcance de story-implement |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 22/22 `[x]` |
| 18 | README o docs actualizados si cambian contratos | ✓ | `docs/adr/README.md` y `docs/index.md` listan ADR-0021 |
| 19 | Decisiones no previstas documentadas | ✓ | CR-001 está resuelta en este informe; `design.md` ya la preveía (D-6, CR-001) |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | El bloque de CHANGELOG lo escribe `epic-ship` al cerrar EPIC-28 |
| 21 | Build de CI pasa | ⚠️ | Pasa el gate local que corre `quality.yml`; CI remoto no ejecutado (requiere ejecución externa) |
| 22 | Sin secrets ni credenciales | ✓ | Solo Markdown documental |
| 23 | Variables de entorno documentadas | ✓ | No aplica: no hay variables nuevas |
| 24 | Despliegue reversible | ✓ | Archivo nuevo y dos líneas de índice; se revierte con git |

**Resumen:** 20/24 criterios ✓ (4 ⚠️, 0 ❌)

## Checklist de épica

✓ `specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`: STORY-178 marcada `[x]` en `## Historias` y
`updated: 2026-11-10`.

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto. Esta historia no genera tests (es un
`chore` documental), y el gate del repositorio ya se ejecutó (ver «Pruebas ejecutadas»).
