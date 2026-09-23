---
type: fix-directives
story: STORY-096
title: "Fix Directives: STORY-096"
review-status: needs-changes
date: 2026-09-23
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: STORY-096

## Resumen de bloqueantes

- **Story:** STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 5 (5 MEDIUM, 0 HIGH): 2 de agentes y 3 criterios DoD que se cierran solos al corregir los dos primeros

**Tercera ronda.** De las siete acciones (1a–1g) de la ronda anterior, cinco están aplicadas y verificadas (1b, 1c en las listas principales, 1d, 1f, 1g; `node --test test/memory-system.test.js` 42/42). Quedan **dos huecos concretos y mecánicos**: una acción incompleta (1a en `policy-template.md`) y una lista de archivos gestionados que no se actualizó (§10.3 de la arquitectura). La seguridad y la cobertura de requisitos quedaron aprobadas.

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/memory-system/assets/scaffold/templates/policy-template.md:35-197 | code-quality | MEDIUM | La acción 1a quedó incompleta: las 11 secciones del cuerpo (`## 1.` … `## 10.` y `## Historial de Cambios`) no llevan `<!-- escritor: autoría manual -->`, lo que infringe el principio 13 de la constitución y ADR-0012 (`domain` y `guardrail` sí cumplen). `implement-report.md:285` afirma "4 campos declarados + 8 secciones", que no coincide con el archivo | Añadir `<!-- escritor: autoría manual -->` al inicio de cada una de las 11 secciones en la semilla, replicar el cambio byte a byte en `docs/templates/policy-template.md` (verificar con `diff -q`) y corregir el recuento en `implement-report.md:285` (11 secciones) |
| 2 | docs/architecture/memory-system.md:309-322 | integration-architecture | MEDIUM | La tabla §10.3 "Archivos gestionados por el scaffold (alcance de `rebuild --force`)", definición normativa según CR-002, no se actualizó con CR-004: omite `templates/{domain,guardrail,policy}-template.md`, que el motor sí sobrescribe con `--force` | Añadir a la tabla una fila `templates/domain-template.md`, `guardrail-template.md`, `policy-template.md` con origen "semilla (autoría manual, sin skill dueño; ADR-0012)", en paralelo a `memory-rules.md` §5. De paso, actualizar la viñeta "Árbol semilla" de §10.2 (l.277-279) con las tres semillas y la cita a ADR-0012 |
| 3 | docs/guardrails/dod-story-checklist.md:135 | DoD-CODE-REVIEW | MEDIUM | "Se cumplen los estándares del proyecto (`constitution.md`)": no se cumple por el principio 13 en `policy-template.md` | Se cierra al resolver #1 |
| 4 | docs/guardrails/dod-story-checklist.md:138 | DoD-CODE-REVIEW | MEDIUM | "Sin hallazgo bloqueante de severidad HIGH o MEDIUM": hay dos (#1, #2) | Se cierra al resolver #1 y #2 |
| 5 | docs/guardrails/dod-story-checklist.md:142 | DoD-CODE-REVIEW | MEDIUM | "Revisión de código aprobada": el review status de esta ronda es `needs-changes` | Se cierra al resolver #1 y #2 y re-ejecutar `/story-code-review STORY-096` |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/memory-system/assets/scaffold/templates/policy-template.md` — hallazgo #1, #3
- `docs/templates/policy-template.md` — hallazgo #1 (copia byte a byte de la semilla)
- `docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/implement-report.md` — hallazgo #1 (recuento de secciones)
- `docs/architecture/memory-system.md` — hallazgo #2
- `docs/guardrails/dod-story-checklist.md` — hallazgos #3, #4, #5 (solo referencia; **no requiere edición**)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Hallazgos LOW — no bloquean, a criterio del autor

No requieren acción para superar el gate. Varios son restos de la acción 1e/1c de la ronda anterior y se cierran con una edición de una línea; si el autor decide aplicarlos en la misma pasada, amplía explícitamente la lista blanca con esos archivos.

| Dimensión | Archivo:Línea | Hallazgo |
|---|---|---|
| requirements-coverage · integration | `testcases.md:44, 50-51, 72` | La acción 1e **no llegó a `testcases.md`** (`fe74c30` no lo toca): E2E-002 sigue esperando "6 plantillas" y UT-004/UT-005 no mencionan las de autoría manual. Los tests reales ya exigen nueve |
| requirements-coverage | `testcases.md:43, 52` · `implement-report.md:58` | Cifras desfasadas: E2E-001 `creados 5 · preservados 14` (hoy 19/7), UT-006 `sobrescritos: 3`, `implement-report.md` cita `creados: 16` |
| requirements-coverage · integration | `story.md:58, 83-85, 110, 120` | AC-6 y el requisito "Seis plantillas base" no recogen CR-004; el AC se cumple (las 9 incluyen las 6), pero la ampliación no es trazable desde la historia |
| integration | `design.md:66, 121, 155-162, 308, 338` | El cuerpo de `design.md` sigue diciendo seis (tabla AC-2, árbol D-1, F-2, contrato #2); CR-004 prevalece |
| code-quality · integration | `README.md:246` · `docs/guides/sddf-commands-pipeline.md:47` | Siguen diciendo "seis plantillas" |
| code-quality | `skills/memory-system/assets/scaffold/templates/guardrail-template.md:7` | `type: guardrails` (plural); los guardrails existentes usan `type: guardrail` |
| code-quality | `skills/memory-system/scripts/memory-system.js:797` | El sobre JSON de error se emite con `--json` en cualquier comando, contra el comentario de l.796 (alcance CR-008 / STORY-097) |
| code-quality | `skills/memory-system/scripts/memory-system.js:711` · `:654` | Heredados y aceptados: `[WARNING] template no copiado` sin `--cli-root`; copia byte a byte que propaga CRLF |
| requirements-coverage | `skills/memory-system/evals/evals.json:152` · `:269` | Heredados: TC-005 sin `header-aggregation` en `not_contains` (AC-8 negativo); TC-008 verifica "no modifica" solo por la salida |
| requirements-coverage | `testcases.md:84-87, 96-99` | 8 entradas `[ ]` (E2E/IT) cubiertas de facto por evals, `S096-IT-001` y T019; cerrar en `/story-verify` |

## Ciclo de corrección

1. Aplica las correcciones #1 y #2 (las #3–#5 se cierran solas).
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-096`.
4. Si el resultado es `approved`, la historia avanza a CODE-REVIEW/DONE.
