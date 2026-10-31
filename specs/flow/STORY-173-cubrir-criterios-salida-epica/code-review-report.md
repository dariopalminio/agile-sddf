---
type: code-review-report
story: STORY-173
title: "Code Review Report: Skill epic-refine: asignar la cobertura de criterios de salida"
verdict: NEEDS-CHANGES
date: 2026-10-30
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-173

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 3 hallazgo(s) bloqueante(s) (severidad máxima: MEDIUM).

Los cuatro informes son válidos y la implementación cumple AC-1, AC-2, CNF-1…CNF-4 y la arquitectura de `design.md`. Sin embargo, el eval TC-013 incluye una aserción (`"status: IMPLEMENT"` en `contains` con `threshold: 1.0`) que el skill nunca emite en modo dry-run, por lo que el caso falla aunque el skill se comporte bien. Los otros dos bloqueantes son criterios del DoD CODE-REVIEW que dependen de ese mismo hallazgo y se resuelven al corregirlo.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-173 — Skill epic-refine: asignar la cobertura de criterios de salida |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-refine/evals/evals.json:209 | TC-013 exige `"status: IMPLEMENT"` en `contains` con `threshold: 1.0`. Este caso no usa sandbox: `buildPrompt` de `scripts/run-evals.js` solo captura la consola y los archivos que el skill **escribe**. En TC-013 no se escribe ningún `story.md`, y ni `SKILL.md` ni `sal-corrections.md` muestran el `status` literal: la nota es `STORY-303 ya está implementada: añadir un AC reabre su alcance`, y el reporte no tiene campo de status. La aserción solo pasa si el modelo repite el frontmatter por su cuenta. Lo más probable es que el caso falle aunque el comportamiento sea correcto, y eso le quita valor al gate de regresión. | Quitar `"status: IMPLEMENT"` de `contains`. Si se quiere verificar que STORY-303 queda intacta, usar `not_contains` con `"STORY-303-totalizar-comisiones/story.md ==="` (ese es el patrón de TC-001) o convertir el caso a `sandbox` con `expected.files`. |
| LOW | skills/epic-refine/references/sal-corrections.md:43 | La tabla de la §3 no fija un orden cuando se cumplen varios casos a la vez, por ejemplo una historia de cierre en `IMPLEMENT` y sin sección de AC, o un SAL-02 cuyo smoke no tiene `Entonces` y cuya historia ya está implementada. La clasificación es la misma, pero la nota que va a `notas` no es determinista. Eso choca con «Las reglas son deterministas». | Añadir «se aplica el primer caso de la tabla que se cumpla» y ordenar las filas: primero las condiciones del elemento (smoke sin `Entonces`), después las de las candidatas y por último las de la historia de cierre. |
| LOW | skills/epic-refine/references/sal-corrections.md:62 | La tabla «Estados admitidos» aplica la escritura a una historia `sin status`, que `epic-analyze` clasifica como MAD-03 «no-clasificable». Tampoco define qué pasa con un valor de `status` que no está en el vocabulario de `domain-story-lifecycle` (una errata, por ejemplo). | Tratar como fuera de alcance, con responsable `PO` y la nota `<STORY-NNN> con status no reconocido`, tanto la ausencia de `status` como cualquier valor que no sea `SPECIFY`, `PLAN` o `READY-FOR-IMPLEMENT`. |
| LOW | skills/epic-refine/references/sal-corrections.md:93 | Si la historia de cierre no tiene la sección `## 📎 Notas`, el título se lee del template de historia (central → seed). Sin embargo, el Paso 1 de `SKILL.md` no resuelve ese template y la tabla «Manejo de errores» (`SKILL.md:243`) no cubre el caso en que faltan los dos. El comportamiento queda sin definir y el fallo podría aparecer después de crear los `.bak`. | Resolver el template de historia antes del Paso 6 y solo cuando haga falta. Si no existe ninguno, dejar el hallazgo fuera de alcance o terminar con `❌` antes de escribir, y añadir esa fila a la tabla de errores. |
| LOW | skills/epic-refine/references/sal-corrections.md:30 | La §«Regla E1» copia la normalización y las exclusiones de `epic-analyze` Paso 5b.2 en lugar de solo citarla. Son dos fuentes de la misma regla, que pueden divergir sin aviso y romper la idempotencia del Paso 4.3: el corrector daría por resuelto un elemento que `epic-analyze` no da por cubierto, o al revés. | Dejar la referencia como norma y añadir «ante divergencia prevalece `epic-analyze` Paso 5b.2», o centralizar la regla en `domain-epic-lifecycle` y citarla desde los dos skills. |
| LOW | skills/epic-refine/references/sal-corrections.md:83 | El AC de cierre y la línea E1 guardan para siempre la etiqueta posicional `CS-<n>`, que el propio catálogo define como «etiqueta posicional del reporte, no un ID de la épica». Si el PO reordena o inserta criterios en `epic.md`, la etiqueta escrita en el `story.md` pasa a señalar otro criterio. E1 sigue siendo válida porque se apoya en el texto literal, pero la etiqueta induce a error. | Opcional: documentar en la §4 que la etiqueta es informativa y que el texto literal es lo que vale, o escribir solo el texto literal en la cita. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 2/2 (AC-1 → TC-009 + `examples/cobertura-cierre/`; AC-2 → TC-010 + `examples/cobertura-sin-parcial/`). CNF-1…CNF-4 y Non-Goals respetados.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json (TC-009…TC-013) | Los evals que cubren AC-1, AC-2 y CNF-1/CNF-2 no se han ejecutado todavía (pendiente manual según implement-report.md, «Nota sobre los Tests Generados»). La cobertura se verifica a nivel de especificación, no con una ejecución observada. | Ejecutar `npm run test:eval -- epic-refine` antes de ACCEPTANCE y registrar el resultado. |
| LOW | skills/epic-refine/evals/evals.json (TC-009) | El paso «el story.md de STORY-301 no recibe ninguna cita nueva de CS-1» de AC-1 solo se comprueba de forma indirecta: por la ausencia de `STORY-301-exportar-pedidos-csv/story.md.bak` y de `→ STORY-301`. Ninguna aserción revisa el contenido final del `story.md` de STORY-301. | Opcional: agregar a TC-009 un `not_contains` del tipo `STORY-301-exportar-pedidos-csv/story.md ===` que demuestre que el archivo no se escribió. |
| LOW | skills/epic-refine/evals/evals.json | Las Notas de la historia incluyen SAL-02 (smoke test) dentro del alcance asignable, pero ningún eval cubre el camino feliz de SAL-02: asignar un `SMOKE-<N>` a la historia de cierre copiando los pasos Gherkin (§4.1, variante smoke) y la cita `Cubre SMOKE-<N>`. TC-013 solo prueba SAL-02 fuera de alcance. No es un escenario Gherkin de la historia. | Agregar un eval con un fixture SAL-02 asignable que verifique el AC de cierre con los pasos del smoke y la línea `- Cubre SMOKE-<N> de EPIC-30: …`. |

---

### Integración y Arquitectura (Integration-Reviewer)

Conformidad con `design.md` D-1…D-8 y CR-006 verificada sobre el estado actual de `skills/epic-refine/` (tras STORY-174 y STORY-165). `skills/epic-analyze/` sin cambios; templates de historia central = seed (`cmp`).

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/SKILL.md:13 | «Cuándo usar» y el README presentan SAL-02 como caso tratable por sí solo, pero un SAL-02 aislado es WARNING y con ≤ 3 WARNING `epic-analyze` emite `APPROVED`, que el gate del Paso 2 no procesa. La limitación solo está documentada en `design.md` CR-006 (2), no en el skill ni en `references/sal-corrections.md`. | Añadir una línea en `sal-corrections.md` (o en «Cuándo usar») indicando que SAL-02 solo se procesa cuando el reporte llega en `NEEDS-REFINEMENT` por otros hallazgos. |
| LOW | skills/epic-refine/references/sal-corrections.md:105 | §4.3 indica que el `.bak` único y la escritura única se mantienen «también si comparte cambios de otra familia (MAD-02)», pero no menciona COH (STORY-174), que también escribe `related` en el mismo `story.md`. Sin impacto funcional: el Paso 6 agrupa por archivo con independencia de la familia. | Reformular como «también si comparte cambios de otra familia (MAD-02, COH)». |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (58 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-refine/references/sal-corrections.md:26 | gr-code semántica (ruta confinada / validación de forma) · SEC-071 | El filtro de pertenencia de las candidatas SAL dice «`parent` sin prefijo `EPIC_ID`» (y «`parent` con prefijo `EPIC_ID`» en la línea 19) sin el límite de guion que sí fijan `int-corrections.md:11`, `coh-corrections.md:20` y `epic-analyze` Paso 4.3. Leído como prefijo de cadena, `EPIC-300-x` cuenta como `EPIC-30`. Un `epic-analyze-report.md` manipulado podría citar como `parcial` un `STORY-NNN` de otra épica; esa historia no tiene dependientes en el índice, así que saldría elegida como historia de cierre, y en `--auto` recibiría el AC y la cita sin confirmación, fuera de la «Escritura acotada» (`SKILL.md:66`). El impacto queda dentro del repositorio y es reversible por el `.bak`. | Reutilizar la regla exacta de `int-corrections.md:11` («el `parent` es exactamente `EPIC_ID` o empieza por `EPIC_ID` seguido de `-`, como en `epic-analyze` Paso 4.3») en las líneas 19 y 26, y añadir un fixture `EPIC-300` que lo cubra. Opcional: exigir `STORY-` seguido de ≥ 3 dígitos al extraer IDs de **Evidencia**, como en `epic-analyze/SKILL.md:247`. |
| LOW | skills/epic-refine/references/sal-corrections.md:109 | gr-ai semántica (contenido ingerido como dato) · SEC-051 | Cuando un criterio o un paso de smoke trae texto con forma de orden, el §4.4 lo copia igual en un `### AC-<k+1>` Gherkin de `story.md` y solo lo anota en `notas`. Un AC es un requisito que después ejecutan `/story-plan` y `/story-implement`, así que en `--auto` (sin confirmación humana) la orden pasa de dato del `epic.md` a requisito activo de otra historia. La fuente es el propio `epic.md` del PO, de ahí la severidad baja. | En `--auto`, cuando el elemento contiene texto con forma de instrucción, clasificar el hallazgo como «fuera de alcance» con responsable `PO` en vez de escribir el AC; en modo manual, señalarlo en el plan antes de `¿Aplicar el plan? (s / n)`. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (32 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Aplicar `fix-directives.md` (ronda 1) con `/story-implement STORY-173` (alternativa, al existir `tasks.md`: `/story-implement-tasks STORY-173`) y volver a ejecutar `/story-code-review STORY-173`. Los hallazgos LOW no bloquean; conviene valorar el LOW de seguridad sobre el límite de guion de `parent` (`sal-corrections.md:19,26`), que es barato de corregir en la misma ronda.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌; los ⚠️ dependen de ejecutar los evals (manual, AGENTS.md) — no evaluable desde artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Markdown en español, layout fijo, fuente única en `skills/epic-refine/`, UTF-8 sin BOM (Tech-Lead, Integration) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | AC-1 → TC-009 + `cobertura-cierre/`; AC-2 → TC-010 + `cobertura-sin-parcial/` (Product-Owner) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | D-1…D-8 y CR-006 conformes (Integration) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | Hallazgo MEDIUM del Tech-Lead en `skills/epic-refine/evals/evals.json:209` (TC-013) |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 23/23 tareas `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; status/substatus gestionados por este skill |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ❌ | MEDIUM | `verdict: NEEDS-CHANGES` por el criterio 5 |

**Resumen:** 6/9 criterios ✓ (2 ❌, 1 ⚠️)
