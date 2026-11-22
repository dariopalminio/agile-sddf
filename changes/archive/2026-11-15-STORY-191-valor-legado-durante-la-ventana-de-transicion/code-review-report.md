---
type: code-review-report
story: STORY-191
title: "Code Review Report: Valor legado durante la ventana de transición"
verdict: APPROVED
date: 2026-11-14
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-191

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron un informe válido y aprobaron. Ningún hallazgo es HIGH ni MEDIUM, y los 5 criterios del DoD CODE-REVIEW se cumplen. Quedan 8 hallazgos LOW: son detalles de las aserciones de los evals, del texto de la línea `Estado` y del `description`, de terminología y de la variable `$ENTRADA_LEGADO`. Ninguno tiene impacto funcional.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-191 — Valor legado durante la ventana de transición |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-11-14 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-implement/SKILL.md:300 y :311; skills/story-implement-tasks/SKILL.md:273 y :284 | `$ENTRADA_LEGADO` se asigna (`true`/`false`), pero ninguna regla posterior la lee. El aviso `[WARN] Valor legado…` se emite en el mismo paso de la clasificación y los pasos siguientes leen solo el equivalente. design.md:175 justifica la variable porque «el aviso necesita saber que hubo sustitución», pero el aviso no está diferido, así que la variable no tiene consumidor (DoD: sin variables sin usar) | Darle un consumidor explícito (por ejemplo, una línea `Entrada legada` en implement-report.md) o eliminarla de ambos skills y del diseño. Confirmar con el autor; no bloquea |
| LOW | skills/story-implement-tasks/SKILL.md:269-271 | La lista «Registrar internamente» del Paso 1d enumera `$ENTRADA_STATUS` y `$ENTRADA_SUBSTATUS`, pero no `$ENTRADA_LEGADO`, que story-implement sí incluye en las variables del Paso 0c (SKILL.md:250). Los dos ejecutores comparten la regla (CNF-1), así que la diferencia es una pequeña asimetría | Añadir `$ENTRADA_LEGADO` a la lista del Paso 1d, o retirarla de los dos skills, según se resuelva el hallazgo anterior |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

ℹ️ Las pruebas de esta historia son evals que no se han ejecutado (`npm run test:eval` es manual según AGENTS.md); la cobertura se verificó de forma estática. Las 11 filas Gherkin (AC-1 ×4, AC-2 ×5, AC-3 ×2) y el CNF-3 tienen un caso de eval trazable.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-implement-tasks/evals/evals.json:594 | TC-014 (AC-1 fila 4) no afirma el paso `Y pasa story.md a IMPLEMENT/IN-PROGRESS` ni el estado final: `contains` solo lleva `Estado: PLAN/DONE ✓` y `Reporte generado`. Además, su `description` cita `Estado: PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS`, mientras que el bloque de inicio real (`SKILL.md:293`) no lleva flecha | Añadir `IMPLEMENT/IN-PROGRESS` (o `Estado story.md: IMPLEMENT/DONE`) a `contains` y alinear la `description` con la línea real |
| LOW | skills/story-implement/evals/evals.json:4440 | TC-047 (AC-1 fila 2) y TC-013 de `story-implement-tasks` (línea 551) no afirman `7.0.0`, que es la parte de AC-1 «indica hasta qué versión se acepta». TC-052 y TC-014 sí lo afirman | Añadir `7.0.0` a `contains` de TC-047 y TC-013 |
| LOW | skills/skill-preflight/evals/evals.json:67 | TC-008 a TC-012 comprueban que no cambia ningún archivo solo con el texto `sin cambios`, sin un campo `files_unchanged` / `no_files_written`. Siguen el patrón de TC-001 a TC-007 | Opcional: añadir `files_unchanged` con los `story.md` / `epic.md` de la entrada |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-implement-tasks/SKILL.md:293 | La Interfaz «Línea `Estado` del bloque de inicio» de design.md fija `Estado: PLAN/DONE ✓  → IMPLEMENT/IN-PROGRESS`, pero `story-implement-tasks` conserva `Estado: PLAN/DONE ✓` sin flecha, el formato de STORY-188. El eval TC-014 es coherente con el skill e implement-report.md menciona la desviación, pero design.md no la recoge. Sin impacto funcional | Anotar en design.md (Interfaz o CR) que se conserva el formato de STORY-188, o alinear la línea con la de `story-implement` y ajustar TC-014 |
| LOW | skills/skill-preflight/SKILL.md:3 | El `description` del frontmatter no menciona la nueva Verificación 3b (status legados de work items), aunque «Usar cuando», «No hace», README.md e «Informe final» sí la recogen. Por eso el skill podría no activarse ante peticiones como «status legado» o «migrar a 6.0.0» | Añadir al `description` una mención breve a los work items con status legado |
| LOW | skills/story-plan/SKILL.md:319 | Deriva terminológica: `story-plan` (SKILL.md:319, 445; README.md:67) llama a `READY-FOR-IMPLEMENT` «valor anterior a 6.0.0» y `epic-analyze` (SKILL.md:243) «valor legado, anterior a 6.0.0», mientras que los tres skills de esta historia usan «valor legado … (ADR-0022) … hasta 7.0.0». Fuera del alcance de STORY-191 | Unificar la etiqueta en STORY-193 o en la historia que toque esos skills |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (40 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (9 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia en `CODE-REVIEW/DONE`. Siguiente paso: `/story-verify STORY-191`. Los 8 hallazgos LOW son opcionales; se pueden atender en esta historia o en STORY-193. Antes de verificar, una persona debe ejecutar `npm run test:eval` para `story-implement`, `story-implement-tasks` y `skill-preflight`, y `npx agile-sddf install` para que `.claude/skills/` refleje los cambios (dogfooding).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Integration-Reviewer y Tech-Lead-Reviewer: fuente en `skills/`, español, solo Markdown y JSON, sin BOM, diagnóstico no mutante (Principio 7) |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: las 11 filas de AC-1/AC-2/AC-3 trazadas a un paso del skill y a un caso de eval (TC-052/047/053, TC-013/014, TC-008..012) |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C-1 a C-7 en sus rutas, Interfaces copiadas literalmente y D-01 a D-07 cumplidas. Una desviación LOW en la línea `Estado` |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 14/14 tareas `[x]`, ninguna `[ ]` ni `[!]` |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | `type`, `id`, `kind`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` y `related` presentes y coherentes con EPIC-029 |

**Resumen:** 5/5 criterios ✓
