---
type: code-review-report
story: STORY-096
title: "Code Review Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
review-status: needs-changes
date: 2026-09-23
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-096

> **Tercera ronda.** La segunda revisión (2026-09-23) devolvió `needs-changes` MEDIUM por tres plantillas semilla (`domain`, `guardrail`, `policy`) sin documentar. El autor aplicó las acciones 1a–1g en `fe74c30` (CR-004 en `design.md`). Esta ronda verifica esa corrección: cinco acciones están completas y dos quedan con un hueco puntual cada una.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild |
| Review status | needs-changes |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (22 casos — UT:8/CT:0/IT:4/API:0/E2E:4/EV:6) |
| Fecha | 2026-09-23 |

### Severidad por dimensión

| Dimensión | Severidad | Hallazgos |
|---|---|---|
| Calidad de Código | MEDIUM | 1 MEDIUM · 6 LOW |
| Cobertura de Requisitos | LOW | 4 escenarios Gherkin y 8 AC verificados · 6 LOW |
| Integración y Arquitectura | MEDIUM | 1 MEDIUM · 6 LOW |
| Seguridad | ninguna | 0 (51 reglas evaluadas) |
| DoD CODE-REVIEW | MEDIUM | 3 criterios ❌ (derivados de los dos MEDIUM) |

### Verificación de las acciones de la ronda anterior

| Acción | Estado | Evidencia |
|---|---|---|
| 1a `escritor: autoría manual` (ADR-0012) | ⚠️ parcial | `domain` 13/13 y `guardrail` 5/5 secciones anotadas; `policy-template.md` anota sus 4 campos pero **ninguna** de sus 11 secciones |
| 1b Frontmatter canónico | ✅ | `type`/`slug`/`title` en los tres, con `# escritor:` en línea completa |
| 1c Listas de archivos gestionados → nueve | ⚠️ parcial | `memory-rules.md` §5 (y cita ADR-0007), `SKILL.md`, `templates/README.md`, `memory-system.md` §3 y tabla de modos ✅; **`memory-system.md` §10.3 sin actualizar** |
| 1d CR en `design.md` | ✅ | CR-004 con rationale y referencia a ADR-0012 |
| 1e Artefactos de la historia | ⚠️ parcial | `implement-report.md`, `tasks.md`, `CHANGELOG.md` ✅; `testcases.md` no se tocó (LOW) |
| 1f Sincronizar `docs/templates/` | ✅ | `diff -q` vacío para las tres plantillas |
| 1g Aserción de exhaustividad | ✅ | `S096-UT-001c` (conjunto exacto, 22 archivos); `node --test test/memory-system.test.js` 42/42 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/memory-system/assets/scaffold/templates/policy-template.md:35-197 (y docs/templates/policy-template.md) | Acción 1a incompleta: ninguna de las 11 secciones (`## 1.` … `## 10.`, `## Historial de Cambios`) lleva `<!-- escritor: autoría manual -->`, contra el principio 13 y ADR-0012. `implement-report.md:285` afirma "8 secciones" anotadas. La plantilla se copia a todo proyecto consumidor | Anotar las 11 secciones en ambas copias (idénticas byte a byte) y corregir el recuento del informe |
| LOW | skills/memory-system/assets/scaffold/templates/guardrail-template.md:7 | `type: guardrails` (plural); la convención existente es `type: guardrail` | Cambiar en ambas copias |
| LOW | README.md:246 · docs/guides/sddf-commands-pipeline.md:47 | Siguen diciendo "seis plantillas" | Cambiar a "nueve" |
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/testcases.md:44 | E2E-002 espera "6 plantillas"; la acción 1e no llegó a este archivo | Actualizar a nueve |
| LOW | skills/memory-system/scripts/memory-system.js:797 | El sobre JSON de error se emite con `--json` en cualquier comando, contra el comentario de l.796 (CR-008 / STORY-097) | Condicionar a `check` o documentarlo |
| LOW | skills/memory-system/scripts/memory-system.js:711 | Heredado y aceptado: `[WARNING] template no copiado` también sin `--cli-root` | Mejora opcional |
| LOW | skills/memory-system/scripts/memory-system.js:654 | Heredado y aceptado: copia byte a byte que propaga CRLF sin `.gitattributes` | Mejora opcional |

El LOW previo sobre `scaffoldSummaryLine` "exportado sin consumidor" se retira: se usa en `memory-system.js:733`.

**Veredicto:** needs-changes. Seis de las siete acciones están aplicadas desde la perspectiva de calidad, pero 1a quedó incompleta en `policy-template.md`. La corrección es mecánica.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Evidencia ejecutada: los 11 tests `S096-*` pasan (incluido `S096-UT-001c`); el motor sobre `examples/sddf-partial` da `creados: 19 · sobrescritos: 0 · preservados: 7` y preserva `constitution.md`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/evals/evals.json:152 (TC-005) | Heredado: la mitad negativa de AC-8 (sin flag no se invoca `header-aggregation`) no está en `not_contains` | Añadir `"header-aggregation"` a `not_contains` |
| LOW | skills/memory-system/evals/evals.json:269 (TC-008) | Heredado: "no modifica ningún archivo" se verifica solo por la salida; los hashes solo en T019 manual | Registrar la comprobación de hashes en `/story-verify` |
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/story.md:58, 83-85 | CR-004 amplía a nueve plantillas; `story.md` sigue diciendo seis. El AC se cumple, pero la ampliación no es trazable desde la historia | Nota de CR-004 en AC-6 o en Notas |
| — | — | Escenarios cubiertos. `ensure`: TC-005/TC-006, `S096-UT-002`, `S096-IT-001`. `scaffold`: TC-007, `S096-UT-001`. `rebuild` sin `--force`: TC-008. `rebuild --force`: TC-009, `S096-UT-006`. AC-7: `S096-UT-002`/`UT-006`/`UT-007`. AC-8: TC-010 | — |

**Veredicto:** approved. Los cuatro bloques Gherkin y los ocho AC tienen cobertura observable que se ejecuta. Solo quedan huecos LOW de trazabilidad documental.

---

### Integración y Arquitectura (Integration-Reviewer)

Árbol semilla real: 22 archivos según `find` (incluye 3 `.gitkeep` y 4 plantillas de autoría manual), más 5 plantillas compartidas en runtime: nueve plantillas en total. `memory-rules.md` §5 (fuente de verdad), `SKILL.md`, la semilla, `evals.json`, `CHANGELOG.md` y los tests son coherentes con CR-004. La arquitectura D-1…D-7 sigue conforme.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | docs/architecture/memory-system.md:309-322 | §10.3 "Archivos gestionados por el scaffold (alcance de `rebuild --force`)", la definición normativa según CR-002, no se actualizó con CR-004: dice que `--force` sobrescribe **únicamente** su lista, que omite `templates/{domain,guardrail,policy}-template.md`, y el motor sí las sobrescribe. Es la misma clase de defecto que la ronda 2 marcó MEDIUM | Añadir la fila con origen "semilla (autoría manual, sin skill dueño; ADR-0012)" |
| LOW | docs/architecture/memory-system.md:277-279 | La viñeta "Árbol semilla" de §10.2 omite las tres plantillas y no cita ADR-0012 | Completar |
| LOW | docs/guides/sddf-commands-pipeline.md:47 | "seis plantillas" | "nueve" |
| LOW | README.md:246 | "las seis plantillas" | "nueve" |
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/design.md:66, 121, 155-162, 308, 338 | El cuerpo sigue diciendo seis (tabla AC-2, árbol D-1, F-2, contrato #2); la tabla D-2 incluye `adr-template.md` aunque CR-004 dice que cubre solo las cinco compartidas. CR-004 prevalece | Opcional: alinear o anotar "ver CR-004" |
| LOW | docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/story.md:58, 83-85, 110, 120 | AC-6 y el requisito "Seis plantillas base" no recogen CR-004 | Decidir si se registra en la historia |

**Veredicto:** needs-changes. Todo es coherente con CR-004 excepto §10.3 de la arquitectura, que contradice lo que el motor sobrescribe.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-code-security-checklist.md`, `docs/guardrails/gr-ai-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (solo SEC-021/022/023/046/047/056/063/071) (51 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

- Checks deterministas de código y de IA sobre los 98 archivos del alcance: sin salida. La única marca es `ai-confirm-before-irreversible` en `CHANGELOG.md:52`, una mención histórica de `npm publish`; el check pasa.
- Plantillas cambiadas en `fe74c30`: idénticas byte a byte entre semilla y `docs/templates/`. No contienen caracteres ocultos (ancho cero, bidi, tags Unicode, ANSI, NBSP, homoglifos, BOM) ni texto de tipo prompt-injection.
- `memory-system.js` usa solo `fs`/`path`/`process`, sin `child_process`, `eval` ni red. Escribe confinado a `--root`, nunca borra, y valida `--harness` y `--date` contra una lista blanca o regex.

**Veredicto:** approved.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (38 archivos modificados: 22 semillas + 16 archivos de motor, skill, tests, fixtures y documentación). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer)**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | AC-6 · E2E-002 (l.44), UT-004/UT-005 (l.50-51), notas (l.72) | La acción 1e no se aplicó a `testcases.md` (`fe74c30` no lo toca; último cambio en `911a188`). E2E-002 espera "6 plantillas". Los tests reales (`NINE_TEMPLATES`, `S096-UT-001c`) sí exigen nueve: el hueco es de redacción, no de cobertura | Actualizar E2E-002 a nueve y referenciar `S096-UT-001c` (AC-6, D-1, D-2, CR-004) |
| LOW | E2E-001 (l.43), UT-006 (l.52) | Cifras desfasadas: `creados 5 · preservados 14` (hoy 19/7), `sobrescritos: 3`; `implement-report.md:58` cita `creados: 16` | Reescribir sin cifras fijas o con las actuales |
| LOW | E2E-001…004, IT-001…004 (l.84-87, 96-99) | 8 entradas `[ ]`, cubiertas de facto por TC-005…TC-010, `S096-IT-001` y T019; ninguna `[!]` | Cerrar en `/story-verify` |
| — | AC-1…AC-8 | Todos los AC tienen al menos un caso con `Ref`; los cuatro bloques Gherkin tienen E2E 1 a 1 | — |

**Trazabilidad de diseño en testcases.md (Integration-Reviewer)**

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Todas las referencias (D-1, D-2, D-3, D-4, D-6) existen en `design.md` y los cuatro IT tienen al menos una | — |
| LOW | E2E-002 | Espera "6 plantillas"; CR-004 fija nueve | Actualizar |

---

## Decisión final

**review-status: needs-changes**

Quedan dos hallazgos MEDIUM, ambos restos puntuales de la corrección anterior y no defectos nuevos del motor:

1. **`policy-template.md` sin anotar sus 11 secciones** (principio 13, ADR-0012). La plantilla viaja a todo proyecto consumidor, e `implement-report.md` afirma lo contrario.
2. **`docs/architecture/memory-system.md` §10.3** sigue sin las tres plantillas en la lista normativa de lo que `rebuild --force` sobrescribe.

El motor, los modos, los tests (42/42), la cobertura de los ocho AC y la seguridad están aprobados. Ambas correcciones son de documentación y caben en una pasada corta sobre cuatro archivos.

---

## Siguiente acción

Aplicar `fix-directives.md` (hallazgos #1 y #2; los #3–#5 del DoD se cierran solos) y re-ejecutar `/story-code-review STORY-096`. Los LOW de "seis plantillas" (`testcases.md`, `README.md`, guía de comandos, `story.md`, `design.md`) conviene cerrarlos en la misma pasada, ampliando explícitamente la lista blanca, para no arrastrar un cuarto ciclo por el mismo tema.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-checklist.md` §"Definition of Done para el estado CODE-REVIEW" (l.132). El skill buscaba `docs/policies/definition-of-done-story.md`, que no existe en este repo.

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ⚠️ | — | La sección DoD IMPLEMENT de `implement-report.md` está en ✓, con ⚠️ en linter y checklists de seguridad. Pero `implement-report.md:285` da por anotadas secciones de `policy-template.md` que no lo están |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ❌ | MEDIUM | El principio 13 no se cumple en las 11 secciones de `policy-template.md` (hallazgo #1) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: los 4 bloques Gherkin y los 8 AC están cubiertos por tests y evals que se ejecutan |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-7 y CR-004 conformes en motor, `SKILL.md` y `memory-rules.md`. El MEDIUM #2 es de documentación de arquitectura, no de componentes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | Hallazgos #1 y #2 |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | No había `- [ ]` en `tasks.md` al revisar. Esta revisión añade la tarea "Implementar fix-directives.md" |
| 7 | Metadatos frontmatter de `story.md` completos y correctos | ✓ | — | `id`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related` presentes |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este documento |
| 9 | Revisión de código aprobada | ❌ | MEDIUM | review-status: needs-changes |

**Resumen:** 5/9 criterios ✓ · 3 ❌ (MEDIUM, todos derivados de los hallazgos #1 y #2) · 1 ⚠️
