---
type: code-review-report
story: STORY-096
title: "Code Review Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
review-status: approved
date: 2026-09-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-096

> **Cuarta ronda.** La tercera revisión devolvió `needs-changes` MEDIUM por dos restos de la corrección anterior: faltaban las anotaciones `escritor:` en las secciones de `policy-template.md`, y §10.3 de la arquitectura no listaba las tres plantillas de autoría manual. Ambos quedaron corregidos en `d6df301`, y esta ronda los da por cerrados.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (22 casos — UT:8/CT:0/IT:4/API:0/E2E:4/EV:6) |
| Fecha | 2026-09-23 |

### Severidad por dimensión

| Dimensión | Severidad | Hallazgos |
|---|---|---|
| Calidad de Código | LOW | 0 nuevos · 5 LOW heredados |
| Cobertura de Requisitos | LOW | 4 bloques Gherkin + 8 AC verificados · 6 LOW |
| Integración y Arquitectura | LOW | 2 LOW (heredados) |
| Seguridad | ninguna | 0 (49 reglas evaluadas) |
| DoD CODE-REVIEW | — | 9/9 ✓ |

### Verificación de los bloqueantes de la ronda 3

| # | Hallazgo | Estado | Evidencia |
|---|---|---|---|
| 1 | `policy-template.md`: 11 secciones sin `escritor: autoría manual` | ✅ cerrado | Las 11 secciones (§1–§10 e "Historial de Cambios") están anotadas en las dos copias, con el mismo formato que `domain` y `guardrail`. `cmp` confirma que semilla y `docs/templates/` son idénticas byte a byte |
| 2 | `docs/architecture/memory-system.md` §10.3 sin las tres plantillas | ✅ cerrado | §10.3 (l.311-328) lista las nueve plantillas y coincide con `memory-rules.md` §5, con el árbol real (22 archivos) y con `SHARED_TEMPLATES` (`memory-system.js:92-97`). §10.2 cita ADR-0012 y ADR-0007 |
| 3–5 | Criterios DoD derivados | ✅ cerrados | Sin hallazgos HIGH/MEDIUM; revisión aprobada |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

La corrección de la ronda 3 está en HEAD (`d6df301`); el árbol de trabajo solo difería en el frontmatter de `story.md`. `node --test test/memory-system.test.js`: 42/42. El commit no toca código de producción, y fuera de los artefactos de la historia solo modifica archivos de la lista blanca.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/assets/scaffold/templates/guardrail-template.md:7 | `type: guardrails` (plural); la convención es `type: guardrail` | Cambiar en las dos copias |
| LOW | README.md:246 · docs/guides/sddf-commands-pipeline.md:47 | Siguen diciendo "seis plantillas" | Cambiar a "nueve" |
| LOW | skills/memory-system/scripts/memory-system.js:797 | El sobre JSON de error se emite con `--json` en cualquier comando, contra lo que dice el comentario de l.796 | Condicionar a `check` o documentarlo |
| LOW | skills/memory-system/scripts/memory-system.js:711 | Heredado y aceptado: `[WARNING] template no copiado` también sin `--cli-root` | Mejora opcional |
| LOW | skills/memory-system/scripts/memory-system.js:654 | Heredado y aceptado: la copia byte a byte propaga CRLF | Mejora opcional |

**Veredicto:** approved.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

`node --test test/memory-system.test.js`: 42/42, con los 11 tests `S096-*` incluidos. Los evals de memory-system dieron 14/14 según `implement-report.md`. El rework solo añadió comentarios de autoría y prosa de arquitectura, así que no cambia el comportamiento de ningún modo.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/evals/evals.json:152 (TC-005) | Heredado: `not_contains` no incluye `"header-aggregation"`, así que la mitad negativa de AC-8 no se prueba | Añadirlo a `not_contains` |
| LOW | skills/memory-system/evals/evals.json:269 (TC-008) | Heredado: "no modifica ningún archivo" se comprueba solo por la salida; los hashes se revisan a mano (T019) | Registrar la comprobación de hashes en `/story-verify` |
| LOW | skills/memory-system/evals/evals.json:345 (TC-010) | Flaky: el `not_contains` "Sobrescribir con propuesta" falla cuando el modelo menciona una opción de menú que no elige. Falló 1 vez de 3 en la última implementación | Reformular la aserción para que dependa de lo que se elige, no de la redacción del menú |
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/story.md:58, 83-85 | La historia sigue diciendo "seis plantillas" y no recoge CR-004 | Nota de CR-004 en AC-6 |
| — | — | Escenarios cubiertos: `ensure`, `scaffold`, `rebuild` sin `--force` y `rebuild --force`. AC-1…AC-8 con cobertura ejecutable | — |

**Veredicto:** approved.

---

### Integración y Arquitectura (Integration-Reviewer)

§10.3 (l.311-328) coincide con `memory-rules.md` §5, con el árbol semilla real y con `SHARED_TEMPLATES`. Que los `.gitkeep` queden fuera de §10.3 es correcto: el motor no los procesa si el directorio existe (`memory-system.js:693`), así que `rebuild --force` nunca los sobrescribe. §10.1, §10.2, el árbol de §3 y `SKILL.md` §3.3 son coherentes con CR-004. Se respetan D-1…D-7: el gate `--force` vive en `SKILL.md` y ningún modo borra archivos.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/design.md:155-162, 207-209 | El cuerpo de D-2/D-4 no nombra `domain`/`guardrail`/`policy`; el banner de CR-004 lo cubre y prevalece | Opcional: alinear el cuerpo o anotar "ver CR-004" |
| LOW | README.md · docs/guides/sddf-commands-pipeline.md · story.md · testcases.md | Siguen diciendo "seis plantillas" | Cambiar a nueve |

**Veredicto:** approved.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md (49 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

- Delta de `d6df301` en `policy-template.md`: 11 líneas `<!-- escritor: autoría manual -->`, idénticas en las dos copias (`cmp`). No hay caracteres ocultos (ancho cero, bidi, BOM, tags Unicode, guion blando). Son marcadores inertes, sin instrucciones, URLs ni comandos.
- `docs/architecture/memory-system.md`: el cambio es solo prosa, referencias a ADR y una fila de tabla.
- `memory-system.js` no cambió desde la ronda 3 y sigue sin `eval`/`child_process`/`exec`/`spawn`.
- La ronda 3 contó 51 reglas porque sumó 8 reglas SEC del checklist de `security-audit`. Esta ronda usó solo los dos guardrails del repo (24 de código + 25 de IA).

**Veredicto:** approved.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (38 archivos modificados a lo largo de la historia: 22 semillas y 16 archivos de motor, skill, tests, fixtures y documentación). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer)**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | AC-6 · E2E-002 (l.44) | Espera "6 plantillas"; el motor crea nueve (el test `S096-UT-001c` sí lo exige) | Actualizar a nueve |
| LOW | E2E-001…004, IT-001…004 (l.84-87, 96-99) | 8 entradas `[ ]`, cubiertas de facto por evals, `S096-IT-001` y T019; ninguna `[!]` | Cerrarlas en `/story-verify` |
| — | AC-1…AC-8 | Todos los AC tienen al menos un caso con `Ref` | — |

**Trazabilidad de diseño en testcases.md (Integration-Reviewer)**

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Todas las referencias (D-1, D-2, D-3, D-4, D-6) existen en `design.md`; IT-001…IT-004 referencian al menos una decisión; no hay casos API | — |

---

## Decisión final

**review-status: approved**

Los dos MEDIUM de la ronda 3 están cerrados y verificados por tres revisores de forma independiente. No aparecen hallazgos nuevos de severidad MEDIUM o HIGH. El motor, los modos, los tests (42/42 y `npm test` 121/121), la cobertura de los ocho AC y la seguridad están aprobados. Quedan solo LOW de trazabilidad documental (textos que aún dicen "seis plantillas") y mejoras opcionales heredadas, que no afectan al comportamiento entregado.

---

## Siguiente acción

Ejecutar `/story-verify STORY-096`. Ahí conviene cerrar las 8 entradas E2E/IT pendientes de `testcases.md` con la evidencia existente (evals TC-005…TC-010, `S096-IT-001`, T019). Los LOW de "seis plantillas" (`README.md`, guía de comandos, `story.md`, `testcases.md`, cuerpo de `design.md`) y la aserción flaky de TC-010 se pueden resolver en una pasada corta a criterio del autor.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-checklist.md` §"Definition of Done para el estado CODE-REVIEW" (l.132). El skill busca `docs/policies/definition-of-done-story.md`, que no existe en este repo.

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ✓ | — | La tabla DoD IMPLEMENT de `implement-report.md` no tiene ❌; sus ⚠️ (linter no definido, CI no ejecutado, README con "seis") no bloquean |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Principio 13 cumplido en las cuatro plantillas de autoría manual (Tech-Lead-Reviewer) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | 4 bloques Gherkin y 8 AC cubiertos (Product-Owner-Reviewer) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | D-1…D-7 y CR-004 conformes (Integration-Reviewer) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | 0 entradas `- [ ]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos | ✓ | — | Campos completos; status/substatus actualizados a CODE-REVIEW/DONE |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este documento |
| 9 | Revisión de código aprobada | ✓ | — | review-status: approved |

**Resumen:** 9/9 criterios ✓
