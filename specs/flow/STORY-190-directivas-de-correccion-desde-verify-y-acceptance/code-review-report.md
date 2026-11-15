---
type: code-review-report
story: STORY-190
title: "Code Review Report: Directivas de corrección desde verify y acceptance"
verdict: APPROVED
date: 2026-11-14
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-190

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

La ronda 1 de corrección resolvió los tres bloqueantes. La lista blanca de `story-verify` 6h.2 usa el formato con acentos graves que lee `story-implement` 0c.3. La plantilla común anota el escritor de cada clave y sección (P13), las tres semillas son idénticas a ella byte a byte y los tres gates omiten las anotaciones al instanciarla. Los cuatro informes son válidos y solo quedan tres LOW no bloqueantes.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-190 — Directivas de corrección desde verify y acceptance |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Guía de revisión | ✓ REVIEW.md |
| Hallazgos preexistentes | ✓ clasificación aplicada (base: origin/main@5f5ab4e) — sin hallazgos PREEXISTENTE |
| Control de LOW | tope 5 LOW por revisor (REVIEW.md) · ⚠️ arrastre no comprobado: no existe code-review-lows.json de la revisión anterior — no se omiten LOW por arrastre; se aplica el tope |
| Fecha | 2026-11-14 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-verify/evals/evals.json:323-329 | La ronda 1 añadió a 4f.2 (`skills/story-code-review/SKILL.md:699`), 6h.3 (`skills/story-verify/SKILL.md:576`) y 7f.3 (`skills/story-acceptance/SKILL.md:482`) una regla nueva: las anotaciones `escritor:` de la plantilla no se copian a `fix-directives.md`. Ningún caso de eval de los tres gates la comprueba: los `not_contains` de TC-009 de verify, TC-047 de code-review y TC-017 de acceptance no incluyen `escritor:`. Si un gate copiara la plantilla tal cual, ningún eval fallaría. No tiene impacto funcional, porque los ejecutores ignoran los comentarios `#` y `<!-- -->` al leer el frontmatter, la tabla y la lista blanca | Añadir `"escritor:"` a `not_contains` de TC-009 (`story-verify`), TC-047 (`story-code-review`) y TC-017 (`story-acceptance`) |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/SKILL.md:699 | La regla nueva de la ronda 1 (las anotaciones `escritor:` de la plantilla no se copian a `fix-directives.md`, también en `skills/story-verify/SKILL.md:576` y `skills/story-acceptance/SKILL.md:482`) no tiene ninguna aserción en los evals: ningún caso de `story-code-review`, `story-verify` ni `story-acceptance` lleva `escritor:` en `not_contains`. Las líneas copiadas serían comentarios YAML/HTML y no rompen la lectura de `round` ni `based-on` en los ejecutores, así que AC-1 y AC-2 no quedan comprometidos | Añadir `"# escritor:"` y `"<!-- escritor:"` a `not_contains` de un caso que ya escribe `fix-directives.md` en cada gate (p. ej. TC-048 de `story-code-review`, TC-009 de `story-verify`, TC-018 de `story-acceptance`) |

Los tres escenarios Gherkin siguen cubiertos por evals tras la ronda 1: AC-1 (sus tres filas: verify, verify por defecto de prueba y acceptance; y el anuncio del origen en los dos ejecutores), AC-2 (`round` continuo entre gates) y AC-3 (`IMPLEMENT/TODO` sin `fix-directives.md`, en los dos ejecutores). CNF-1 lo cubre `test/fix-directives-template.test.js` (8/8).

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-190-directivas-de-correccion-desde-verify-y-acceptance/design.md:109 | La corrección de la ronda 1 resuelve P13. La plantilla anota con `escritor:` sus 7 claves de frontmatter en línea completa, como `adr-template.md` y `domain-template.md`, y sus 4 secciones con `<!-- escritor: … -->`. Las tres semillas son iguales byte a byte (comprobado con `cmp` y con el test, 8/8). 4f.2, 6h.3 y 7f.3 dicen igual que las anotaciones no se copian. Pero D-01 (c) sigue rechazando los comentarios en la plantilla con el argumento de que «habría que añadir a los tres la regla de no copiarlos», que es justo lo que se hizo. `design.md` no tiene un CR que registre el cambio (el DoD IMPLEMENT, criterio 19, pide documentar las decisiones no previstas). | Añadir un CR-003 a `design.md`: la plantilla anota `escritor:` por P13 (hallazgo #2 de la ronda 1) y los tres gates omiten esas líneas al instanciarla. Así D-01 (c) deja de contradecir la implementación |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md (49 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (21 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-190`. Los tres LOW son opcionales: dos piden la misma aserción `escritor:` en `not_contains` de los evals de los tres gates, y el tercero, un CR-003 en `design.md` que alinee D-01 (c) con la corrección de P13.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Cubierto por Tech-Lead-Reviewer: sin hallazgos que cuenten |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Cubierto por Product-Owner-Reviewer: sin hallazgos que cuenten |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Cubierto por Integration-Reviewer: sin hallazgos que cuenten |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 0 líneas `- [ ]` (18/18 `[x]`) |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | Campos requeridos presentes; `id` y `slug` coinciden con el directorio |

**Resumen:** 5/5 criterios ✓
