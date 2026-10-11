---
type: code-review-report
story: STORY-103
title: "Code Review Report: Reemplazar el template de Epic por la versión minimalista y output-oriented"
review-status: approved
date: 2026-10-07
max-severity: LOW
round: 3
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-103

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-103 — Reemplazar el template de Epic por la versión minimalista y output-oriented |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (57 casos — UT:23/CT:0/IT:4/API:0/E2E:11/EV:19) |
| Ronda | 3 |
| Fecha | 2026-10-07 |

Alcance revisado: los 73 archivos de la historia, entre el commit `64f54f9` y las rondas de corrección 1 y 2 en el working tree, más los artefactos de la historia. Quedan fuera por ser ajenos a la historia: `CLAUDE.md`, `AGENTS.md`, `docs/domains/domain-state-management.md`, `docs/requirements/README.md`, `docs/templates/srs-template.md`, `STORY-118` y el renombrado del runbook de npm.

**Historial de rondas:**

| Ronda | Resultado | Bloqueantes |
|---|---|---|
| 1 | needs-changes (MEDIUM) | 3: formato de `## Historias` de EPIC-21, R7 sin `historia-irreconocible`, U+FEFF literal en `epic-template.js` |
| 2 | needs-changes (MEDIUM) | 1: U+FEFF literal en `implement-report.md:97`, introducido al documentar la ronda 1 |
| 3 | **approved (LOW)** | 0 |

Evidencia de la ronda 3, comprobada por los revisores:
- `node --test test/epic-template.test.js`: 32/32.
- `node --test test`: 219/219.
- `memory-system migrate --root docs --from epic-template-v1 --dry-run` → `sin cambios: 22 · a revisar: 0 · cambios pendientes: 0`, exit 0.
- El check completo de `ai-no-hidden-characters` (zero-width, bidi, tag block, ZERO WIDTH NO-BREAK SPACE, ANSI) sobre los 82 archivos del alcance da 0 coincidencias. Antes se validó con un archivo de control que sí contenía el carácter.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**max-severity: LOW · approved.** El bloqueante de la ronda 2 está corregido: `implement-report.md:97` contiene el escape en ASCII. El texto nuevo del informe (fila DoD de `gr-ai-security-checklist` y sección «Ronda de corrección 2») es veraz. El código no cambió desde la ronda 2.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/scripts/epic-template.js:160-163 | Asimetría en R7: `- [ ] **Nombre:** desc` pasa a F1, pero `- **Nombre:** desc` sin checkbox se marca `historia-irreconocible`. Genera `[REVISAR]` evitables. | Aplicar `plannedText` también a las líneas sin checkbox y añadir el caso a UT-007b. |
| LOW | skills/memory-system/scripts/epic-template.js:219 | Una sección de smoke tests mixta produce un `SMOKE-1` duplicado sin `[REVISAR]`. | Incluir los `### SMOKE-N` existentes en `used` y añadir un test. |
| LOW | skills/memory-system/scripts/epic-template.js:35-41 | `V1_TITLES` no reconoce los títulos v2: volver a migrar con un template renombrado manda las secciones a `notas`. | Derivar los alias del seed o documentar la limitación en §3.8. |
| LOW | skills/memory-system/scripts/epic-template.js:439-444 | `assertInsideRoot` es léxico y `writeFileSync` sigue symlinks. | `lstatSync().isFile()` o `realpathSync`. |
| LOW | docs/specs/02-epics/EPIC-05-enhance-project-spec/epic.md:30 (y demás épicas `DONE`) | R8 añade placeholders `[Por completar]` a épicas cerradas (comportamiento diseñado). | Nota «no aplica: épica anterior a v2» o registrar la decisión en `design.md`. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**max-severity: LOW · approved.** Hay **13/13** escenarios Gherkin verificados (AC-1…AC-8, los 3 escenarios de AC-9, AC-10 y AC-11) y CNF-1…CNF-5. La trazabilidad AC → código → tests de la ronda 2 sigue vigente:

| AC | Evidencia principal |
|----|---------------------|
| AC-1…AC-7 | `docs/templates/epic-template.md` (40 líneas, idéntico al seed): 5 secciones con guías, F1 por defecto, `SMOKE-1` + gherkin, frontmatter mínimo con `status: DEFINE` |
| AC-8 | `epic-from-project-plan` (mapeo por clave y Fase 3e con el gate) · `epic-creation` (`## DoD aplicable`, CR-002) |
| AC-9 | `epic-generate-stories` 2/2b · `epic-generate-all-stories` 4a · `story-implement` 11d / `story-implement-tasks` 4c |
| AC-10 | `skills/memory-system/scripts/epic-template.js` · las 22 épicas migradas, con idempotencia comprobada en seco |
| AC-11 | `epic-format-validation` (5 secciones por clave, F1–F3, `SMOKE-N`, bloque `Formato inválido:`) |

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md:26 | STORY-103 ya está en F3 `[x]` mientras la historia sigue en CODE-REVIEW (lo especifica D-6). | Opcional: documentar en `domain-epic-lifecycle` §9 que F3 significa «implementada». |

---

### Integración y Arquitectura (Integration-Reviewer)

**max-severity: LOW · approved.** La conformidad con `design.md` (D-2, D-2b, D-3, D-7) sigue intacta. Lo añadido al implement-report es coherente con el diseño.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/scripts/epic-template.js:45,160 | `STORY_LINE` deja pasar sin hallazgo una F2/F3 sin `: <desc>` o con `[X]` en mayúscula. El gate la detecta y en el repo no hay casos. | Endurecer `STORY_LINE` y añadir los casos a UT-007b. |
| LOW | docs/specs/02-epics/EPIC-12-story-sdd-workflow/epic.md:36-40 | Los sub-ítems STORY-064…067 quedaron indentados bajo STORY-063 (CR-014). Sin impacto funcional. | Moverlos a `notas` o aplanarlos como F3. |
| LOW | skills/epic-generate-all-stories/SKILL.md:26-27 | «Qué NO hace» contradice D-5. | Reescribir los dos bullets. |
| LOW | docs/domains/domain-epic-lifecycle.md:200 | No matiza que 11d/4c emiten `[WARN]` sin bloquear. | Añadir la excepción. |
| LOW | docs/specs/03-stories/STORY-103-replace-the-epic-template/design.md:474-498 | Las tablas Interfaces/Esquema no recogen `seedPath`, `summary.pending` ni `seccion-sin-destino`, y la fila del gate contradice D-3.2. | Alinear con el módulo y con D-3.2. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md` y `.claude/skills/security-audit/assets/security-checklist.md` (solo leído) (66 reglas evaluadas)

**max-severity: LOW · approved.** El bloqueante de la ronda 2 está corregido: el check de `ai-no-hidden-characters` sobre los 82 archivos del alcance da 0 coincidencias y ningún archivo empieza con BOM. El contenido añadido desde la ronda 2 pasa todos los checks deterministas de los dos checklists.

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/memory-system/scripts/epic-template.js:439-444 | SEC-071 | `assertInsideRoot` es léxico; un `epic.md` symlink permitiría escribir fuera de `SPECS_BASE`. | `lstatSync` o `realpathSync`. |
| LOW | skills/memory-system/scripts/epic-template.js:422,424 | gr-code «sin rutas absolutas del host» | Los `UsageError` muestran la ruta absoluta del seed. | Usar `displayPath(seedPath)`. |

> Fuera del alcance de la historia: `sec-gitignore-coverage` falla porque `.gitignore` no ignora `.temp` ni `__pycache__`. La historia no tocó `.gitignore`.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (73 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura (Product-Owner-Reviewer):** los 11 ACs tienen un caso E2E 1 a 1 y casos UT/IT/EV que los descomponen.

| Severidad | Referencia | Descripción | Recomendación |
|-----------|-----------|-------------|---------------|
| LOW | Test Cases Progress | 37 entradas siguen en `[ ]` aunque los UT/IT están en verde. No hay ninguna `[!]`. | Marcarlas en `story-verify`. |
| LOW | Resumen de cobertura | Dice `UT 22` pero hay 23 filas, y UT-003b y UT-022b no tienen fila. | Actualizar el conteo y añadir las filas. |

**Trazabilidad de diseño (Integration-Reviewer):** todas las referencias D-N y CR-NNN existen en `design.md`.

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| LOW | IT-002 | Ref sin decisión D-N. | Añadir `D-7, D-3`. |
| LOW | IT-003 | Ref sin decisión D-N. | Añadir `D-10`. |

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban, con severidad máxima LOW. Están corregidos todos los bloqueantes de las rondas anteriores: los tres de la ronda 1 y el de la ronda 2. La implementación cumple los 13 escenarios Gherkin y respeta la arquitectura de `design.md`. Los tests pasan (219/219), la migración es idempotente con 0 pendientes y no quedan caracteres invisibles en el alcance.

Quedan 17 hallazgos LOW (deduplicados). No bloquean, porque son endurecimientos del migrador, desalineaciones menores de documentación y la contabilidad de `testcases.md`. Se recomienda agruparlos en una historia de deuda técnica de EPIC-21.

---

## Siguiente acción

1. Ejecutar `/story-verify STORY-103` (fase VERIFY). Aprovechar para marcar el checklist «Test Cases Progress» de `testcases.md`.
2. Opcional: crear una historia de deuda con los LOW del migrador (`epic-template.js`: R7, `STORY_LINE`, `SMOKE-N` mixto, symlinks, rutas absolutas).

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-code-review.md`. El DoD está dividido por etapa, así que el archivo completo es la sección CODE-REVIEW.

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ✓ | — | El DoD IMPLEMENT de `implement-report.md` no tiene ❌; `gr-ai-security-checklist` ya se cumple (0 caracteres invisibles). Los ⚠️ (linter, CI) no son evaluables desde artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Ningún revisor reporta violaciones; el principio 13 se resolvió en CR-012 |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | 13/13 (Product-Owner-Reviewer) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: approved, solo LOW |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro revisores dan `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | Todas las tareas en `[x]`, incluidas las dos «Implementar fix-directives.md» |
| 7 | Metadatos frontmatter de `story.md` completos y correctos | ✓ | — | `id`, `slug`, `parent`, `status` y `substatus` presentes; pasa a `CODE-REVIEW/DONE` |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este documento (ronda 3) |
| 9 | Revisión de código aprobada | ✓ | — | `review-status: approved` |

**Resumen:** 9/9 criterios ✓
