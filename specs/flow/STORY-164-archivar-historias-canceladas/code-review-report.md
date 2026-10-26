---
type: code-review-report
story: STORY-164
title: "Code Review Report: Skill story-complete: archivar historias canceladas"
verdict: APPROVED
date: 2026-10-26
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-164

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos y aprobados. Los nueve hallazgos son mejoras opcionales `LOW`: tres de calidad de código, dos de cobertura y cinco documentos fuera de C-7…C-14 que describen la regla de archivo de forma incompleta. Ninguno afecta el comportamiento de `archive-canceled`, `CANCELED_NOT_DONE` ni la cadena de fecha `updated:` → `created:` → `date:`.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-164 — Skill story-complete: archivar historias canceladas |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-26 |

Alcance revisado: los cambios de STORY-164 del commit `95791ec`. Los cambios sin commitear de `skills/story-complete/scripts/story-complete.js` y `test/story-complete.test.js` pertenecen al rework de STORY-160 y no se atribuyen a esta historia.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-complete/scripts/story-complete.js:88 | `archiveDateOf` replica literalmente la regla de `archiveDate` de `scripts/migrate-specs-to-flow.js:76` (`updated:` → `created:` → `date:` solo si faltan ambas claves). La copia es deliberada (CR-004: el motor del skill debe ser autocontenido al instalarse), pero STORY-164 tuvo que cambiar la regla en dos sitios y nada detecta si vuelven a divergir. | Añadir en `test/story-complete.test.js` una prueba de paridad que compare `archiveDateOf` con `archiveDate` (exportado por `migrate-specs-to-flow.js`) sobre los mismos casos, sin acoplar el motor en tiempo de ejecución. |
| LOW | skills/story-complete/scripts/story-complete.js:165 | El mensaje de `NOT_DELIVERED` ahora enumera `CANCELED/DONE` como estado admitido y en la misma frase indica «Ejecuta antes /story-delivery». La frase sigue siendo correcta para los estados que llegan a esa rama (nunca `CANCELED/*`), pero puede leerse como si una cancelada debiera pasar por delivery. | Opcional: separar la frase, por ejemplo «…requiere DELIVER/DONE, COMPLETED/DONE o CANCELED/DONE. Si la historia no está entregada, ejecuta antes /story-delivery STORY-NNN». |
| LOW | test/memory-system.test.js:1376 | S164-UT-001 delimita la sección con `content.indexOf('## 🧭 Dominio y arquitectura')`. Si ese encabezado del template cambia, `indexOf` devuelve -1, el `slice` recorta un carácter del final y la aserción podría pasar contra todo el índice en lugar de solo la sección. Sigue el mismo patrón que S152 (línea 1355). | Opcional: comprobar que ambos `indexOf` son `>= 0` antes del `slice`, o extraer un helper compartido entre S152 y S164 que falle si no encuentra los encabezados. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-complete/evals/evals.json:180 | AC-1 (paso «Cuando… y confirma la acción») y el «skill informa la ruta final» solo se verifican en los evals TC-007…TC-009, que no se ejecutaron (T027 a criterio humano). El motor sí cubre las tres filas de Ejemplos en `plan` (test/story-complete.test.js:159) y el movimiento real con frontmatter byte a byte idéntico, `status: CANCELED`, origen inexistente y conteo 1→1 (test/story-complete.test.js:177), pero `apply` solo se ejercita con la fila `date:`. | Ejecutar `npm run test:eval -- story-complete` antes de ACCEPTANCE; opcionalmente iterar el test de `apply` sobre las tres filas de fechas. |
| LOW | docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md:1 | AC-3 es documental y no tiene aserción automatizada; se verificó manualmente: ADR-0017 (`supersedes: ADR-0016`, admite COMPLETED y CANCELED con `updated:`/`created:`/`date:`), ADR-0016 con `status: SUPERSEDED`, `superseded-by: ADR-0017` y nota (únicos cambios permitidos por `docs/adr/README.md:34`, CNF-1), índice de ADRs, `AGENTS.md`, `docs/constitution.md` y los cuatro `docs/domains/` describen la regla nueva (CNF-2 incluido). S164-UT-001 (test/memory-system.test.js:1369) cubre CNF-3 para el índice/check. | Sin acción obligatoria; aceptable para un escenario documental. |

Cobertura por escenario:

- **AC-1** (archivado de cancelada, 3 filas de Ejemplos): Dado/Cuando/Entonces cubiertos en el motor (test/story-complete.test.js:159, :177) y en evals TC-007/TC-008/TC-009; TC-004 cubre la confirmación rechazada. Evidencia manual T025 con `R100` y conteo 5→5.
- **AC-2** (rechazos): fila 1 `CANCELED/IN-PROGRESS` → `CANCELED_NOT_DONE` nombra el estado, sin `/story-delivery` y snapshot sin cambios (test/story-complete.test.js:191, TC-010); fila 2 sin fecha válida → `NO_ARCHIVE_DATE` nombra `updated:`, `created:`, `date:` sin cambios (test/story-complete.test.js:203, TC-011).
- **AC-3** (regla documentada): correspondencia verificada en los documentos.

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/architecture/state-machine.md:108 | La fila `story-complete` de la tabla de transiciones declara como entrada solo `DELIVER/DONE o COMPLETED/DONE (solo archivar)` y omite `CANCELED/DONE`. La línea 110 sigue atribuyendo el archivo a ADR-0016 y no menciona las canceladas. El documento no figura en C-7…C-14 ni en CR-002/CR-005, pero describe una capacidad del skill que cambió (regla de Veracidad). | Añadir `CANCELED/DONE (solo archivar, status sin cambios)` a la fila y actualizar la referencia de la línea 110 a ADR-0017. |
| LOW | docs/guides/organization-of-artifacts.md:170 | Este archivo se editó en CR-005, pero su checklist de validación sigue diciendo «si es una historia `COMPLETED`, en `specs/flow/archive/`». Con esa regla, una `CANCELED` archivada se marcaría como no conforme. | Cambiar a «si es una historia `COMPLETED` o `CANCELED` (con `substatus: DONE`)». |
| LOW | docs/guides/skill-structural-pattern.md:164 | El mapa de rutas, una copia del de `constitution.md:225`, conserva «historias COMPLETED archivadas»; la constitución ya se actualizó. | Alinear con «historias COMPLETED o CANCELED archivadas». |
| LOW | docs/guides/flight-leves-model.md:56 | La línea 56 dice «archivada en specs/flow/archive/ al completarse» y la 64, «(Historias COMPLETED archivadas)»: describen la regla vieja de forma incompleta. | Usar «al completarse o cancelarse» y «Historias COMPLETED o CANCELED archivadas». |
| LOW | README.md:83 | La tabla de raíces dice «las historias completadas se archivan en `specs/flow/archive/`», sin las canceladas. La línea 219 es una nota histórica de 5.0.0 y no requiere cambio. | Añadir «y canceladas» a la frase de la línea 83. |

Conformidad verificada: C-1…C-16 y D-1…D-7 implementados; CR-004 (motor determinista) y CR-005 (documento extra) registran las desviaciones; el diff de ADR-0016 toca solo `status`, `superseded-by` y la nota (CNF-1); ningún texto activo afirma que las `CANCELED` no se archivan (contrato de verificación 6); `node --test test/story-complete.test.js test/memory-system.test.js` → 113/113 en verde.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (59 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (20 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia lista para verificación final: ejecuta `/story-verify STORY-164`. Antes de ACCEPTANCE conviene ejecutar a criterio humano `npm run test:eval -- story-complete` (TC-004, TC-007…TC-011). Los hallazgos `LOW` son opcionales y pueden atenderse en esta historia o en una posterior.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 16/24 ✓, 8 ⚠️, 0 ❌; los ⚠️ requieren CI o la ejecución de evals (T027 a criterio humano). `npm test` 350/350 y `verify:repository` en verde en local |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer: CommonJS, `node:test`, sin dependencias nuevas, secretos ni TODOs |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1, AC-2 y AC-3 cubiertos (motor, evals y documentos) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C-1…C-16 y D-1…D-7 conformes; desviaciones registradas en CR-004/CR-005 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW en los cuatro informes |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 28/28 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓
