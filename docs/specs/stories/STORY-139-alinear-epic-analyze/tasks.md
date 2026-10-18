---
type: tasks
id: STORY-139
slug: STORY-139-alinear-epic-analyze-tasks
title: "Tasks: Alinear epic-analyze"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-139
design: STORY-139
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-139-alinear-epic-analyze
  - STORY-139-alinear-epic-analyze-design
---

<!-- Referencias -->
[[STORY-139-alinear-epic-analyze]] · [[STORY-139-alinear-epic-analyze-design]]

> Orden: línea base (policy publicada) → template → `SKILL.md` → documentación de soporte → evals → verificación.
> Las tareas de los grupos 2, 3 y 5 editan un mismo archivo por grupo y se ejecutan en orden. Las de verificación son de solo lectura y pueden ir en paralelo, salvo la conformidad final y el gate.
> Los números de línea vienen del «Estado medido» del diseño (2026-10-17). Si se han movido, se localiza el texto por contenido.
> No se modifican la policy, los otros skills, `epic.md`, los reportes históricos, `CHANGELOG.md`, `package.json` ni las copias de `.claude/`. Todo archivo modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [ ] T001 Comprobar que `docs/policies/validation-contract-policy.md` existe (D-10). Si no existe, detener la historia sin editar nada: STORY-138 no está implementada. Si existe, leer G-01…G-06, §2, la fila `epic-analyze` de §4, §5, §6 y el ejemplo §7.1, y anotar cualquier diferencia con los puntos C-1…C-6 de D-9 y aplicar en su lugar la versión publicada — D-9, D-10, AC-2
- [ ] T002 [P] Confirmar el «Estado medido» del diseño: `grep -n BLOCKED skills/epic-analyze/SKILL.md` (l.19, 235, 255, 271, 306, 318, 335), `grep -n -E '^(verdict|errors|warnings):|^#|Veredicto' skills/epic-analyze/assets/epic-analyze-report-template.md` (l.7-9, l.18, l.20-26), `grep -n BLOCKED skills/epic-analyze/README.md docs/domains/domain-skills-map.md` (l.11 y l.19) y la lista de 11 casos de `evals.json` que esperan `BLOCKED`. Si alguna pieza falta o no coincide, detener e informar cuál — Context, D-7, D-8
- [ ] T003 [P] Registrar la línea base del gate: resultado de `npm run verify:repository` y de `npm test` en la rama actual, para distinguir después fallos nuevos de previos — V-9

## 2. Template del reporte

- [ ] T004 En el frontmatter de `skills/epic-analyze/assets/epic-analyze-report-template.md` (l.7), cambiar `verdict: {APPROVED | NEEDS-REFINEMENT | BLOCKED}` por `verdict: {APPROVED | NEEDS-REFINEMENT}`. Conservar sin cambios `errors: {n}` y `warnings: {n}` (l.8-9) — D-1, D-5, AC-1, CNF-1
- [ ] T005 Insertar, justo tras `# Análisis de épica: {título}` y antes de `## Resumen`, la sección `## Veredicto <!-- sección obligatoria · clave: veredicto · escritor: epic-analyze -->` con: un comentario guía de una línea que describe lo que escribe el skill, la primera línea `` **Veredicto:** `{veredicto}` — {motivo} `` y la segunda línea fija `Informativo: este análisis no cambia el estado de la épica.`, según el «Esquema de datos» del diseño — D-2, D-3, AC-1, AC-2
- [ ] T006 En `## Resumen`, eliminar la fila `| Veredicto | {veredicto} |` (l.26) y reescribir el comentario guía (l.21) sin la línea `**Veredicto:** … — informativo; …`. La sección conserva épica, conteos, contrato de salida, madurez, fecha y templates — D-4, AC-2

## 3. `SKILL.md` de epic-analyze

- [ ] T007 Paso 6 (l.267-275): sustituir la regla por la tabla de D-1 (ERROR ≥ 1 → `NEEDS-REFINEMENT`; 0 ERROR y WARNING ≤ 3 → `APPROVED`; 0 ERROR y WARNING > 3 → `NEEDS-REFINEMENT`), conservar la frase de función pura de los conteos y añadir una línea que remite al contrato de validación con `docs/policies/validation-contract-policy.md` de Agile-SDDF en código en línea, sin enlace Markdown y sin repetir la tabla de vocabulario de la policy — D-1, D-7, AC-1
- [ ] T008 Paso 7 (l.283-289): añadir a la tabla de claves la fila `veredicto` con las tres formas de la línea `**Veredicto:**` de D-3 (singular «hallazgo ERROR» con `<n> = 1`; `<n>` y `<m>` iguales a `errors` y `warnings`) y la línea informativa fija; quitar el veredicto de la fila `resumen` — D-2, D-3, D-4, AC-1
- [ ] T009 Regla de clave ausente (l.292): cuando el template no declara la clave `veredicto`, la sección se omite con `⚠️` y el aviso añade «el reporte no cumple el contrato de validación (G-02)»; `verdict` se escribe igual — D-2, F-3, AC-2
- [ ] T010 Objetivo (l.19) y catálogo MAD (l.255): dejar `APPROVED` / `NEEDS-REFINEMENT` y mencionar la sección `## Veredicto` en l.19; en l.255, eliminar «y nunca producen `BLOCKED` por sí solos» y dejar «todos WARNING: cuentan para el umbral de `NEEDS-REFINEMENT` del Paso 6». No tocar l.235 (`BLOCKED` como `substatus` de historia) — D-6, D-7, AC-1
- [ ] T011 Paso 9 y Salida: en las salidas de consola manual y Agent (l.306, l.318) usar `<APPROVED | NEEDS-REFINEMENT>` sin cambiar la forma de cuatro líneas; en la verificación del flujo (l.327) añadir que `## Veredicto` es el primer `##` y que su valor coincide con `verdict`; en l.335 reemplazar «Con veredicto `BLOCKED`, corregir…» por «Con `NEEDS-REFINEMENT` y `errors ≥ 1`, corregir…; con solo WARNING, además…» — D-7, Interfaces, AC-1

## 4. Documentación de soporte

- [ ] T012 [P] `skills/epic-analyze/README.md` (l.11): describir el veredicto como `APPROVED` o `NEEDS-REFINEMENT` en la sección `## Veredicto`, según el contrato de validación, sin nombrar `BLOCKED` — D-7, AC-1
- [ ] T013 [P] `docs/domains/domain-skills-map.md` (l.19): dejar el veredicto informativo de `epic-analyze` como `APPROVED` / `NEEDS-REFINEMENT` — D-7, AC-1

## 5. Evals del skill

- [ ] T014 En los 11 casos con ERROR (TC-002, TC-003, TC-004, TC-012, TC-014, TC-015, TC-016, TC-017, TC-026, TC-027, TC-028) de `skills/epic-analyze/evals/evals.json`: sustituir en `contains` `"BLOCKED"` y `"verdict: BLOCKED"` por `"verdict: NEEDS-REFINEMENT"`, `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" ``; conservar `"errors: 1"` en los 7 casos que ya lo afirman, sin añadirlo a TC-003, TC-017, TC-026 ni TC-027; añadir `"verdict: BLOCKED"` a `not_contains` si falta, sin añadir nunca `"BLOCKED"` a secas (MAD-01); ajustar las `description` que nombran `BLOCKED` — D-6, D-8, AC-1 (fila 3), CNF-1
- [ ] T015 TC-001 (fila 1 de AC-1): añadir `"## Veredicto"` y `` "**Veredicto:** `APPROVED`" `` a `contains`, y `"| Veredicto |"` a `not_contains` — D-4, D-8, AC-1 (fila 1)
- [ ] T016 TC-006 y TC-024 (fila 2 de AC-1): añadir a `contains`, si faltan, `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" ``. Ya afirman `"verdict: NEEDS-REFINEMENT"` y `"errors: 0"`, que se conservan — D-5, D-8, AC-1 (fila 2), CNF-1
- [ ] T026 TC-005 y TC-013 (casos `APPROVED`): sustituir en `not_contains` el `"BLOCKED"` a secas por `"verdict: BLOCKED"` — D-6, D-8
- [ ] T017 Actualizar la `description` del archivo (l.4) sin `BLOCKED` y `version` a `1.3.0`; comprobar que el archivo sigue siendo JSON válido con `node -e "JSON.parse(require('fs').readFileSync('skills/epic-analyze/evals/evals.json','utf8'))"` y que mantiene 28 casos — D-8

## 6. Verificación

- [ ] T018 [P] V-1: `grep -n BLOCKED skills/epic-analyze/SKILL.md` devuelve solo la línea del `substatus` de historia (antes l.235) — AC-1
- [ ] T019 [P] V-2, V-3 y V-4 sobre el template: `grep -n -E '^(verdict|errors|warnings):'` muestra `verdict: {APPROVED | NEEDS-REFINEMENT}` con `errors` y `warnings`; `grep -n '^#'` muestra el `#`, `## Veredicto` (con `clave: veredicto`) y `## Resumen` en ese orden y sin otro `##` entre ellos; `grep -n -i veredicto` solo coincide dentro de la sección `## Veredicto` y en el comentario guía de `## Notas del análisis` («no cuentan para el veredicto», que no declara un valor), y `grep -n -F -e '| Veredicto |'` no devuelve nada — AC-1, AC-2, CNF-1
- [ ] T020 [P] V-5: leer los Pasos 6 y 7 de `SKILL.md` y comprobar, para cada fila de los Ejemplos de AC-1 (0 ERROR y ≤ 3 WARNING; 0 ERROR y > 3 WARNING; ≥ 1 ERROR), que el valor de `verdict` y la línea `**Veredicto:**` que resultan coinciden con D-1 y D-3, y que ninguno es `BLOCKED` — AC-1
- [ ] T021 [P] V-7: `grep -n -E '"(verdict: )?BLOCKED"' skills/epic-analyze/evals/evals.json` solo aparece en `not_contains` o en la entrada de TC-008, y las tres filas de AC-1 tienen caso con `"## Veredicto"` (TC-001; TC-006 y TC-024; los 11 de ERROR) — AC-1, CNF-1
- [ ] T022 [P] V-8: `grep -n BLOCKED skills/epic-analyze/README.md docs/domains/domain-skills-map.md` no devuelve `BLOCKED` como veredicto de `epic-analyze` — AC-1
- [ ] T023 V-6: comparar el template y el Paso 6 con la policy publicada, punto por punto C-1…C-6 de D-9 (más las diferencias anotadas en T001); confirmar que §6 sigue con `Sin excepciones vigentes.` y que `git diff --stat docs/policies/` está vacío. Anotar el resultado en `implement-report.md` — AC-2
- [ ] T024 V-9: ejecutar `npm run verify:repository` y `npm test` y compararlos con la línea base de T003 (ningún fallo nuevo). Comprobar con `git status` que solo cambian los cinco componentes del diseño (`SKILL.md`, template, `README.md`, `evals.json`, `domain-skills-map.md`) además de los artefactos de la historia — AC-1, AC-2
- [ ] T025 V-10 (manual, a criterio humano según AGENTS.md): proponer al mantenedor `npm run test:eval -- epic-analyze` y registrar en `implement-report.md` si se ejecutó y su resultado; no lanzarlo de forma automática — AC-1, CNF-1
