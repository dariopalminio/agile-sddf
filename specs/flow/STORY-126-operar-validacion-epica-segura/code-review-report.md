---
type: code-review-report
story: STORY-126
title: "Code Review Report: Operar la validación de épicas de manera segura"
verdict: NEEDS-CHANGES
date: 2026-10-31
max-severity: HIGH
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-126

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 5 hallazgos bloqueantes, con severidad máxima `HIGH`.

La política de efectos de STORY-126 exige que solo se escriba `epic-validate-report.md`, pero el skill vigente añade una transición de gateway que escribe `epic.md`. El revisor de integración sitúa esa transición en la ampliación posterior de STORY-127; sin embargo, los contratos y evals propios de STORY-126 todavía declaran la escritura única. Esa contradicción y la cobertura incompleta de repetición obligan a alinear las historias antes de aprobar.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-126 — Operar la validación de épicas de manera segura |
| Severidad máxima detectada | HIGH |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| HIGH | skills/epic-validate/SKILL.md:349 | El flujo permite escribir el frontmatter de `epic.md` mediante el gateway. STORY-126 exige que fuera de `--dry-run` el único artefacto escrito sea `epic-validate-report.md`. | Alinear el contrato: eliminar o excluir el gateway del alcance de STORY-126; si pertenece a una historia posterior, aislarlo y cubrirlo allí. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-validate/evals/evals.json:1109, 1206; skills/epic-validate/SKILL.md:100-105, 383-390 | TC-014 y TC-015 no sitúan la épica en `VALIDATE` ni observan la escritura del gateway; esperan solamente el reporte y dejan sin probar ese estado permitido. | Acordar el contrato y añadir fixtures `VALIDATE` para `auto` y `manual` que aserten exactamente los archivos y campos modificables. |
| MEDIUM | skills/epic-validate/evals/evals.json:1429-1541 | TC-018 no compara los dos reportes completos tras normalizar solo `updated`, fecha de evaluación y duraciones; tampoco repite desde `VALIDATE`. | Comparar ambos reportes normalizando exclusivamente los campos volátiles y cubrir la política acordada de `epic.md` en la repetición. |

ℹ️ `testcases.md` no encontrado — análisis de cobertura de test cases omitido.

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/SKILL.md:138 | El skill declara el layout fijo correcto, pero cita ADR-0017, que fue sustituido por ADR-0019. | Sustituir la referencia textual por ADR-0019 en este rework o mantenimiento posterior. |

ℹ️ `testcases.md` no encontrado — análisis de trazabilidad de diseño omitido.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md` (18 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad concretos en los artefactos de alcance | — |

---

### Nota de Tamaño de Cambio

El alcance declarado por `implement-report.md` incluye dos archivos de implementación: `skills/epic-validate/SKILL.md` y `skills/epic-validate/evals/evals.json`.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Revisar el límite entre STORY-126 y el gateway de STORY-127, alinear el contrato de efectos y ampliar los evals antes de ejecutar `/story-implement STORY-126` o `/story-implement-tasks STORY-126`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | El informe de implementación registra evals y CI como ejecución manual o externa; no evaluable desde los artefactos. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Revisión de los cuatro informes: layout fijo, delegación y seguridad se ajustan a la constitución. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ⚠️ | — | Los evals están especificados, pero su ejecución manual sigue pendiente y el revisor de requisitos detectó huecos de observación. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | El revisor de integración confirma C1–C9 y las rutas previstas. |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | HIGH | Hay un hallazgo HIGH y dos MEDIUM en este reporte. |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 24/24 tareas están marcadas `[x]`. |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | La transición final de esta revisión deja la historia en `READY-FOR-IMPLEMENT/DONE`. |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo fue generado en la revisión. |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ❌ | HIGH | El veredicto consolidado es `NEEDS-CHANGES`; depende de resolver los hallazgos 1–3. |

**Resumen:** 5/9 criterios ✓ · 2 ⚠️ · 2 ❌
