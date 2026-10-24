---
type: code-review-report
story: STORY-147
title: "Code Review Report: ADR del layout fijo de tres raíces"
verdict: APPROVED
date: 2026-10-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-147

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con estado `approved`. Ningún hallazgo es HIGH ni MEDIUM. Los siete hallazgos LOW son de trazabilidad y del gate preexistente, y ninguno afecta a los criterios de aceptación. Lo más urgente es la atribución a ADR-0004 en ADR-0016: el ADR está `ACCEPTED` y será inmutable una vez versionado.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-147 — ADR del layout fijo de tres raíces |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (8 casos — UT:0/CT:0/IT:4/API:0/E2E:4/EV:0) |
| Fecha | 2026-10-23 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/adr/ADR-0016-layout-fijo-de-tres-raices.md:54-55,102 | ADR-0016 atribuye a ADR-0004 la convención de directorio con slug (`STORY-NNN-<slug>/`, `EPIC-NN-<slug>/`): en `## Decisión` dice «como en ADR-0004» y en `## Referencias` lo repite. ADR-0004 no define esa convención: decide el nombre «épica» y los directorios numerados `01-projects/…`, y además está parcialmente superado por ADR-0013. La convención `STORY-NNN-kebab` la fija ADR-0005 (línea 41). El error viene de AC-3 de `story.md` y de `design.md`, así que la implementación sigue la spec, pero queda en un ADR `ACCEPTED`, que será inmutable una vez versionado. | Antes del primer commit, corregir la atribución (citar ADR-0005, o ADR-0005 y ADR-0013 para `epics/`/`stories/`) en la línea 55 y en la referencia de la línea 102. Para que todo quede coherente, alinear también AC-3 y `design.md`. Si se decide no tocarlo, registrarlo para un ADR posterior. |
| LOW | docs/adr/ADR-0016-layout-fijo-de-tres-raices.md:95 | ADR-0016 cita «ADR-0013» sin desambiguar, pero `docs/adr/` tiene dos archivos con ese número: `ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md` y `ADR-0013-eliminar-specs-01-projects.md`. Ambos mencionan `$SPECS_BASE` en la línea 119. El duplicado es anterior a esta historia y no depende de ella; `implement-report.md` ya lo señala. | Opcional: usar el wikilink `[[asegurar-dos-niveles-de-flujo-epics-stories]]` o el nombre de archivo para eliminar la ambigüedad. Resolver el número duplicado en una historia aparte. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

> Historia `chore` documental: no hay archivos de test. La cobertura de cada escenario Gherkin se verificó contra los archivos Markdown entregados y los contratos de verificación 1–10 de `implement-report.md`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| — | — | Todos los escenarios Gherkin están cubiertos.<br>**AC-1:** ADR-0016 tiene `status: ACCEPTED` y `supersedes: ADR-0010` (`docs/adr/ADR-0016-layout-fijo-de-tres-raices.md:6-8`). Declara las raíces hermanas `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` (:46). Retira `SDDF_ROOT`, la clave `root` y `SPECS_BASE` (:47-49). Fija la convención `<YYYY-MM-DD>-STORY-NNN-<slug>/` (:41 y :51). ADR-0010 queda con `status: SUPERSEDED` y `superseded-by: ADR-0016`, y `docs/adr/README.md` tiene la fila de ADR-0016.<br>**AC-2:** el `git diff` de ADR-0010 solo toca `status`, `superseded-by` y la nota bajo el título, que `docs/adr/README.md:34` autoriza. Contexto, Decisión y Consecuencias quedan intactos.<br>**AC-3:** ADR-0016 decide explícitamente conservar el slug, de forma coherente con SMOKE-1 y SMOKE-2 (:54-57), y descarta la alternativa sin slug (:77-78). | — |
| LOW | docs/specs/stories/STORY-147-adr-del-layout-fijo-de-tres-raices/story.md:28 | Los `Dado` de AC-1 y AC-2 suponen que ADR-0010 estaba `ACCEPTED`, pero en HEAD estaba `PROPOSED`. La implementación usa el estado real, como indican CR-001 de `design.md` y la nota de `testcases.md`, y ADR-0016:20-21 lo explica. La intención del AC se cumple, pero el texto de la historia no lo refleja. | Opcional: aclarar la precondición en `story.md` o en el acceptance-report, para que la trazabilidad no dependa de `design.md`. |
| LOW | docs/adr/ADR-0016-layout-fijo-de-tres-raices.md:55 | ADR-0016 atribuye la convención del slug a ADR-0004 («como en ADR-0004»), que en el índice figura `SUPERSEDED → ADR-0013`. Es lo que pide literalmente AC-3, pero un lector puede creer que la fuente vigente es un ADR reemplazado. | Opcional: citar también el ADR vigente. Ver el hallazgo del Tech-Lead sobre ADR-0005. |
| LOW | implement-report.md (Contrato 9) | CNF-2: `npm run verify:repository` termina con exit 1 por 15 pruebas del template de épica que ya fallaban antes, y fallan igual en HEAD sin los cambios. El paso «enlaces activos», que es lo que protege CNF-2, termina con exit 0 (`[OK] Checked 49 active Markdown files`). | No bloquea esta historia. Registrar la deuda para que CS-12 de la épica pueda cerrarse en verde. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/specs/stories/STORY-147-adr-del-layout-fijo-de-tres-raices/design.md:0 (Contratos de verificación #9) | El contrato 9 (`npm run verify:repository` termina con exit 0, CNF-2) no se cumple al pie de la letra. El gate falla en «pruebas deterministas» por 15 pruebas del template de épica y de la migración `epic-template-v1`. `implement-report.md` demuestra con `git stash -u` que ya fallaban antes de esta historia. El paso que CNF-2 protege sí está en verde: `node scripts/check-doc-links.js` devuelve `[OK] Checked 49 active Markdown files`, reverificado en esta revisión. No afecta a la integración de los 4 archivos. | Dejar constancia del fallo preexistente en el informe de code-review o de verify. Recuperar el gate completo en verde en una historia aparte antes de dar por cerrado el contrato 9 en VERIFY. |
| LOW | docs/specs/stories/STORY-147-adr-del-layout-fijo-de-tres-raices/story.md:0 | La implementación sigue D-5 y D-6: añade la nota visible bajo el título de ADR-0010 y parte del estado previo `PROPOSED`. Pero CR-001 y CR-002 de `design.md` no se trasladaron a `story.md`: AC-1 y AC-2 siguen diciendo «ADR-0010 está ACCEPTED» y «solo cambian status y superseded-by». Leído al pie de la letra, AC-2 choca con la línea de nota añadida (ADR-0010-specs-dentro-de-docs.md:14). | Aplicar CR-001 y CR-002 a `story.md` (fuera de esta etapa) para que AC-2 incluya la nota visible que exige `docs/adr/README.md`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md y .claude/skills/security-audit/assets/security-checklist.md (16 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

Sin nota: 4 archivos modificados (umbral ≤ 5).

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer):**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| — | — | Todos los ACs están cubiertos en testcases.md, cada escenario Gherkin con al menos un caso E2E:<br>• AC-1 → E2E-001, IT-001, IT-002<br>• AC-2 → E2E-002<br>• AC-3 → E2E-003<br>• CNF-1 → E2E-002<br>• CNF-2 → E2E-004, IT-003, IT-004 | — |
| LOW | Test Cases Progress | Las 8 entradas (E2E-001…E2E-004, IT-001…IT-004) siguen en `[ ]`, aunque implement-report da por verificados los contratos equivalentes. No hay entradas `[!]`. | Marcar `[x]` los casos verificados (E2E-004 solo si se acepta el gate parcial de CNF-2). |

**Trazabilidad de diseño en testcases.md (Integration-Reviewer):**

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | La trazabilidad de diseño en testcases.md es correcta. Todas las referencias D-N existen en `design.md`. IT-004 no cita un D-N, pero sí «Non-Goals» y las tareas T014 y T016. | — |

---

## Siguiente acción

Ejecutar `/story-verify STORY-147`. Antes del primer commit, conviene corregir la atribución a ADR-0004 en ADR-0016 (líneas 55 y 102), porque el ADR quedará inmutable una vez versionado.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 22/24 criterios ✓ y 2 ⚠️. Las regresiones son 15 pruebas que ya fallaban antes, y el build de CI requiere acceso a CI/CD, así que no se puede evaluar desde los artefactos disponibles. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Integration-Reviewer y Tech-Lead-Reviewer: documento en español, nombre de archivo en kebab-case, ADR en `docs/adr/` e inmutabilidad respetada. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1, AC-2 y AC-3 tienen correspondencia en ADR-0016, en el diff de ADR-0010 y en los índices. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-9 aplicados; los archivos cambiados son exactamente los 4 de «Componentes afectados». |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima entre los cuatro informes: LOW. |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 16/16 tareas `[x]`. |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; pasa a `CODE-REVIEW/DONE` con `updated: 2026-10-23`. |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo. |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED`. |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
