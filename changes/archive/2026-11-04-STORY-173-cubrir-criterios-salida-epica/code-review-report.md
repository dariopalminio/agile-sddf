---
type: code-review-report
story: STORY-173
title: "Code Review Report: Skill epic-refine: asignar la cobertura de criterios de salida"
verdict: APPROVED
date: 2026-10-30
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-173

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Esta es la ronda 2. Los cuatro informes son válidos y aprueban el cambio. El rework de la ronda 1 corrigió el único bloqueante, la aserción `"status: IMPLEMENT"` de TC-013. Ahora TC-013 verifica con `not_contains` que no aparece el bloque FILE de STORY-303, y esa aserción es coherente con la forma en que `scripts/run-evals.js` califica los casos sin sandbox. Solo quedan mejoras LOW, que no bloquean.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-173 — Skill epic-refine: asignar la cobertura de criterios de salida |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/references/sal-corrections.md:43 | Sigue vigente desde la ronda 1. La tabla de la §3 no dice qué caso gana cuando se cumplen varios a la vez (por ejemplo, historia de cierre en `IMPLEMENT` y sin sección de AC, o un smoke sin `Entonces` cuya historia ya está implementada). La clasificación no cambia, pero la nota de `notas` deja de ser determinista, y el catálogo afirma «Las reglas son deterministas». | Añadir «se aplica el primer caso de la tabla que se cumpla» y ordenar las filas: elemento → candidatas → historia de cierre. |
| LOW | skills/epic-refine/references/sal-corrections.md:62 | Sigue vigente desde la ronda 1. «Estados admitidos» aplica la escritura a una historia `sin status` (que `epic-analyze` trata como MAD-03 no clasificable) y no define qué hacer con un `status` fuera del vocabulario de `domain-story-lifecycle`. | Tratar la ausencia de `status` y cualquier valor distinto de `SPECIFY`, `PLAN` o `READY-FOR-IMPLEMENT` como fuera de alcance, con `PO` y la nota `<STORY-NNN> con status no reconocido`. |
| LOW | skills/epic-refine/references/sal-corrections.md:93 | Sigue vigente desde la ronda 1. Si falta `## 📎 Notas`, el título se lee del template de historia (central → seed). El Paso 1 de `SKILL.md` no resuelve ese template, y la tabla «Manejo de errores» no cubre el caso en que faltan ambos. El fallo podría aparecer después de crear los `.bak`. | Resolver el template antes del Paso 6 y solo cuando haga falta. Si no existe ninguno, terminar con `❌` antes de escribir y añadir la fila a la tabla de errores. |
| LOW | skills/epic-refine/references/sal-corrections.md:30 | Sigue vigente desde la ronda 1. La §«Regla E1» duplica la normalización y las exclusiones de `epic-analyze` Paso 5b.2. Las dos copias pueden divergir sin aviso y romper la revalidación de la §1.3, que es la base de la idempotencia. | Declarar que, ante una divergencia, prevalece `epic-analyze` Paso 5b.2, o centralizar la regla en `domain-epic-lifecycle` y citarla desde los dos skills. |
| LOW | skills/epic-refine/references/sal-corrections.md:81 | Sigue vigente desde la ronda 1. El AC de cierre y la cita E1 guardan la etiqueta posicional `CS-<n>`, que el propio catálogo define como «no un ID de la épica». Si el PO reordena los criterios, la etiqueta escrita apunta a otro criterio. E1 sigue siendo correcta porque se apoya en el texto literal. | Opcional: documentar en la §4 que la etiqueta es informativa y que lo que vale es el texto literal. |
| LOW | skills/epic-refine/evals/evals.json:206 | Nuevo, menor. La convención de rutas de los bloques FILE solo se fija en el `context` de TC-013. TC-009 y TC-010 también dependen de rutas FILE, pero no la declaran. Además, la frase «ruta relativa a specs/flow/ del fixture» es ambigua sobre el prefijo `specs/flow/`. No afecta a TC-013: su patrón casa con las dos lecturas. | Opcional: aclarar la frase y extender la convención a los `context` de TC-009…TC-012. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 2/2.
- AC-1 → TC-009 + `examples/cobertura-cierre/`. STORY-302 declara `depends-on: STORY-301`, así que es la única historia de cierre.
- AC-2 → TC-010 + `examples/cobertura-sin-parcial/`.
- El rework de TC-013 refuerza la prueba de que la historia implementada no se escribe y no pierde cobertura.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:146 | TC-009 prueba que STORY-301 "no recibe ninguna cita nueva de CS-1" (AC-1) solo de forma indirecta: con la ausencia de su `.bak` y de `→ STORY-301`. No incluye la aserción por bloque FILE que el rework sí añadió a TC-013. | Opcional: añadir `"STORY-301-exportar-pedidos-csv/story.md ==="` a `not_contains` de TC-009 (y la nota de formato FILE en su `context`). |
| LOW | skills/epic-refine/evals/evals.json:212 | TC-013 no afirma de forma explícita la etiqueta `SAL-01 · CS-1` como fuera de alcance. Hoy solo la cubre de forma implícita `FUERA-DE-ALCANCE: 2`. | Opcional: añadir `"SAL-01 · CS-1"` a `contains`. |

---

### Integración y Arquitectura (Integration-Reviewer)

Se verificaron D-1 a D-8, los componentes y los contratos de `design.md`. CR-006 se trata como desviación documentada. Resultados:
- V-6: `SKILL.md` tiene 265 líneas.
- `description`: 490 caracteres.
- V-7: el template central y el seed son idénticos.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-173-cubrir-criterios-salida-epica/design.md:199 | La tabla de evals de D-8 sigue listando `status: IMPLEMENT` como esperado `contains` de TC-013. Tras el rework, `evals.json:208-210` lo sustituye por `not_contains` del bloque FILE de STORY-303. La intención (CS-15) se conserva, pero CR-006 no registra esta diferencia literal. | Opcional: ampliar CR-006 (o añadir CR-007) con el cambio de aserción de TC-013. |
| LOW | skills/epic-refine/evals/evals.json:205 | Solo TC-013 declara en `context` la convención de rutas de los bloques FILE. TC-009…TC-012 dependen implícitamente de ella. | Opcional: unificar el `context` de TC-009…TC-013 en una próxima revisión de evals. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (49 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-refine/references/sal-corrections.md:109 | gr-ai-security-checklist (semántica: contenido ingerido como dato / OWASP LLM01) | El texto del criterio o del smoke de `epic.md` se copia literal en un AC Gherkin nuevo del `story.md` de cierre, también cuando tiene forma de orden. En `--auto` se aplica sin confirmación. Después lo consumen como requisito `story-plan` y `story-implement`. Se mitiga con el registro en `notas` y con el origen (`epic.md` lo redacta el PO). Ningún eval cubre este camino SAL. | Opcional: añadir un eval SAL con un criterio que contenga una orden y verificar que se registra en `notas`. Valorar que, en `--auto`, un SAL con texto en forma de orden quede «fuera de alcance · PO». |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (15 archivos modificados; 31 contando uno por uno los archivos de los cinco fixtures `cobertura-*`). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

- Ejecutar `/story-verify STORY-173`.
- Antes de ACCEPTANCE, ejecutar a mano `npm run test:eval -- epic-refine` para confirmar TC-009…TC-013, como decida una persona (AGENTS.md).
- Los hallazgos LOW quedan como mejoras opcionales.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌. Los ⚠️ dependen de ejecutar evals o CI, que no se pueden evaluar desde los artefactos disponibles. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Fuente única en `skills/epic-refine/`, en español, layout fijo, UTF-8 sin BOM (Tech-Lead, Integration) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | AC-1 → TC-009 + `cobertura-cierre/`; AC-2 → TC-010 + `cobertura-sin-parcial/` (Product-Owner) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | D-1…D-8, V-6 y V-7 verificados; CR-006 documentado (Integration) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW en los cuatro informes |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 23/23 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; `CODE-REVIEW/DONE` al cerrar esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo (ronda 2) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
