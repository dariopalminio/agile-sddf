---
alwaysApply: false
type: tasks
id: STORY-166
slug: STORY-166-veredicto-de-epic-format-validation-tasks
title: "Tasks: Veredicto de epic-format-validation"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-166
design: STORY-166
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-166-veredicto-de-epic-format-validation
---

<!-- Referencias -->
[[STORY-166-veredicto-de-epic-format-validation]]

## 1. Pruebas del contrato de validación (RED)

- [ ] T001 En `test/verify-validation-contract.test.js`, añadir `'epic-format-validation': ['epic-format-validation-report.md', 'epic-format-validation-report-template.md']` al mapa `REPORTS` del fixture (D-7) // AC-4
- [ ] T002 En `test/verify-validation-contract.test.js`, añadir una prueba sobre la policy real (`docs/policies/validation-contract-policy.md`) que compruebe con `parsePolicyContract`: fila `epic-format-validation` con reporte `epic-format-validation-report.md` y valores exactamente `APPROVED`, `NEEDS-REFINEMENT`; que la línea `**Exclusiones:**` de §1 no menciona `epic-format-validation`; y que la celda Flowchart de la fila enlaza `flowchart-skill-epic-flow-relationship.mermaid` (D-7) // AC-4
- [ ] T003 En la misma prueba, leer el flowchart real y comprobar que el nodo de decisión al que apunta `epic-format-validation -->` tiene exactamente las ramas `APPROVED` y `NEEDS-REFINEMENT`, y que `NEEDS-REFINEMENT` apunta a `epic-improve` (D-7) // AC-4
- [ ] T004 Ejecutar `node --test test/verify-validation-contract.test.js` y confirmar que T001–T003 fallan por la policy y el verificador actuales (RED)

## 2. Template y verificador

- [ ] T005 Crear `skills/epic-format-validation/assets/epic-format-validation-report-template.md` con el esquema de D-5 y «Esquema del reporte»: frontmatter (`type`, `id`, `slug`, `title`, `epic`, `verdict: {APPROVED | NEEDS-REFINEMENT}`, `defects`, `created`, `updated`, sin `related`), `# Validación de formato de épica: {título}`, `## Veredicto` como primera sección con `**Veredicto:** \`{veredicto}\` — {motivo}`, `## Resumen`, `## Defectos` (columnas `ID │ Tipo │ Ubicación │ Encontrado │ Corrección esperada`, `Sin defectos.` si APPROVED) y `## Migración` condicional, con comentarios de instrucción por sección // AC-1, AC-2, CNF-1
- [ ] T006 En `scripts/verify-validation-contract.js`, añadir `'epic-format-validation': 'skills/epic-format-validation/assets/epic-format-validation-report-template.md'` a `REPORT_TEMPLATES` (D-7) // AC-4

## 3. Policy v1.3.0

- [ ] T007 En `docs/policies/validation-contract-policy.md` §1, retirar `epic-format-validation` de «Exclusiones» (quedan `security-audit` y `fix-directives.md`) (D-6.1) // AC-4
- [ ] T008 En §4, añadir como primera fila `` | `epic-format-validation` | `epic-format-validation-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT` | [épica](../architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid) | — | `` y cambiar la celda Flowchart de `epic-analyze` de `— (sin flowchart)` al mismo enlace (D-6.2, D-6.3) // AC-4
- [ ] T009 En §7, añadir el ejemplo `### 7.7 epic-format-validation` con `type: epic-format-validation`, `verdict: NEEDS-REFINEMENT` y `## Veredicto` conforme; subir la versión a `1.3.0`, actualizar `Última actualización` y añadir la fila de STORY-166 al «Historial de cambios»; §5 sin cambios (D-6.4–D-6.6) // AC-4
- [ ] T010 Ejecutar `node --test test/verify-validation-contract.test.js` y `npm run verify:validation-contract`; corregir hasta verde (GREEN de T001–T003)

## 4. Skill epic-format-validation

- [ ] T011 En `skills/epic-format-validation/SKILL.md`, actualizar `description` del frontmatter, «Objetivo», «Qué hace», «Modos de ejecución» y «Salida» al vocabulario `APPROVED` / `NEEDS-REFINEMENT`, mencionar el reporte `epic-format-validation-report.md` y la policy, y sustituir la regla «Solo lectura» por «Escritura acotada» (D-1) // AC-1, AC-2, CNF-1
- [ ] T012 En el Paso 1 de `SKILL.md`, reemplazar el bloque `RECHAZADO` por el error `❌ Épica no encontrada: <input>` con `Ruta buscada: <ruta exacta>` (Tipo A) o `Ruta buscada: specs/flow/EPIC-*<término>*/epic.md` (Tipo B); aclarar que termina sin veredicto y sin reporte; en el Paso 3a cambiar «ni APROBADO, ni REFINAR, ni RECHAZADO» por «sin veredicto ni reporte» (D-3) // AC-3
- [ ] T013 Reescribir el Paso 5 de `SKILL.md` como «Producir veredicto y reporte»: regla D-2, lectura bajo demanda de `assets/epic-format-validation-report-template.md`, tabla de defectos D-4 (tipos, ubicación por orden del template, corrección esperada con los textos actuales F1/F2/F3 y SMOKE-N), sección `## Migración` condicional, escritura en `<EPIC_DIR>/epic-format-validation-report.md` sobrescribiendo, y resumen de consola (línea `**Veredicto:**`, bloques `Secciones/campos faltantes:` / `Formato inválido:` y ruta del reporte); eliminar los bloques de salida `APROBADO` / `REFINAR` inline (D-4, D-5) // AC-1, AC-2, CNF-3
- [ ] T014 Añadir al Paso 5 el comportamiento ante fallo de escritura: veredicto en consola + `⚠️ No se pudo escribir <ruta>: <causa>` y aviso de reporte obsoleto si existía uno (F-5) // AC-1, AC-2
- [ ] T015 Verificar `wc -l skills/epic-format-validation/SKILL.md` ≤ 290 y que contiene `APPROVED` y `<!-- SDDF-FIXED-LAYOUT: v1 -->`; si supera 290, mover detalle al template (CNF-3, CNF-4) // CNF-4

## 5. Ejemplo, evals y README del skill

- [ ] T016 [P] Crear `skills/epic-format-validation/examples/needs-refinement/epic-format-validation-report.md`: reporte completo del caso «sin `## Criterios de salida` + línea `- [ ] Exportar CSV: descarga del historial`» con `verdict: NEEDS-REFINEMENT`, dos filas en `## Defectos` (`seccion-faltante`, `formato-historias`) y `## Migración` (D-9) // AC-2, AC-4
- [ ] T017 [P] En `skills/epic-format-validation/evals/evals.json`: versión `3.0.0`; en TC-001 y TC-003…TC-015 sustituir `APROBADO → APPROVED` y `REFINAR → NEEDS-REFINEMENT` en `contains` / `not_contains`, descripciones y `name`; añadir `RECHAZADO` a `not_contains` y, en los casos APPROVED, `APROBADO` a `not_contains` (D-9) // AC-1, AC-2
- [ ] T018 [P] En el mismo `evals.json`, reescribir TC-002 para AC-3 (input `EPIC-77`; `contains: ["EPIC-77", "specs/flow", "Ruta buscada"]`; `not_contains: ["APPROVED", "NEEDS-REFINEMENT", "RECHAZADO"]`) y añadir TC-016 para AC-2 (épica sin `## Criterios de salida` y con línea de historias inválida; `contains: ["NEEDS-REFINEMENT", "Criterios de salida", "Formato inválido:", "- [ ] Exportar CSV: descarga del historial", "epic-format-validation-report.md"]`; `not_contains: ["APPROVED", "APROBADO", "REFINAR"]`) (D-9) // AC-2, AC-3
- [ ] T019 [P] En `skills/epic-format-validation/README.md`, actualizar «What it does», «Produces» (reporte `epic-format-validation-report.md` con `verdict` y tabla de defectos) y «Does not do» (no modifica `epic.md`); enlazar `validation-contract-policy` (D-8) // CNF-2

## 6. Consumidores del veredicto

- [ ] T020 [P] En `skills/epic-creation/SKILL.md`, actualizar líneas 29 y 75, el Paso 7 («Si el `verdict` es `APPROVED`» / «Si el `verdict` es `NEEDS-REFINEMENT`», leyendo `verdict` de `epic-format-validation-report.md` según G-06) y la fila de la tabla de errores; mantener la corrección interactiva sin mencionar `/epic-improve` (D-8) // CNF-2
- [ ] T021 [P] En `skills/epic-creation/examples/test-01-epic-minimo.md`, `test-02-epic-completo.md` y `test-03-directorio-existente.md`, sustituir `APROBADO` por `APPROVED`; en `skills/epic-creation/evals/evals.json`, sustituir `APROBADO → APPROVED` y `REFINAR → NEEDS-REFINEMENT` en descripciones y expectativas (D-8) // CNF-2
- [ ] T022 [P] En `skills/epic-from-project-plan/SKILL.md` (líneas 77 y 81), cambiar a «un `NEEDS-REFINEMENT` se registra, pero no detiene el lote» y mostrar el `verdict` de cada épica en el resumen; actualizar los literales de TC-008 en su `evals/evals.json` (D-8) // CNF-2
- [ ] T023 [P] En `skills/epic-generate-stories/evals/evals.json` (línea 51), cambiar `not_contains: "APROBADO"` por `"APPROVED"` (D-8) // CNF-2
- [ ] T024 [P] En `docs/requirements/functional/FR-027-validacion-de-formato-de-epica-gate.md`, describir el veredicto `APPROVED` / `NEEDS-REFINEMENT` en `epic-format-validation-report.md` y la épica inexistente como error sin veredicto; actualizar `updated:` (D-8) // CNF-2

## 7. Verificación

- [ ] T025 Ejecutar `grep -rn "APROBADO\|REFINAR\|RECHAZADO"` sobre los archivos de D-8 y de `skills/epic-format-validation/`, y confirmar que no queda ninguna referencia al vocabulario heredado de este gate (contrato de verificación 6) // CNF-2
- [ ] T026 Revisar el template (T005) y el ejemplo (T016) contra el patrón `^[A-Z]+(-[A-Z]+)*$` y G-01…G-04, y comprobar que `npm run verify:validation-contract` reporta un template y un ejemplo más que antes // AC-1, AC-2, AC-4, CNF-1
- [ ] T027 Ejecutar `npm test` y `npm run verify:repository`; deben pasar sin errores (CS-21) // AC-4
- [ ] T028 Ejecutar `graphify update .` para actualizar el grafo tras los cambios
- [ ] T029 Registrar como pendiente de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-format-validation` (TC-001, TC-002, TC-016) y, opcionalmente, `epic-creation` y `epic-from-project-plan` // AC-1, AC-2, AC-3
