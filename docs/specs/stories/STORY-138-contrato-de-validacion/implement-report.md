---
type: implement-report
id: STORY-138
slug: STORY-138-implement-report
title: "Implement Report: Contrato de validación"
story: STORY-138
created: 2026-10-18
updated: 2026-10-18
---

# Reporte de Implementación: Contrato de validación

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-138 |
| Total de tareas | 25 |
| Tareas completadas | 25 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-18 |

**Estado:** ✅ Implementación completa

Historia de documentación: no genera código ni tests unitarios. El «test fallido» de cada tarea es su contrato de
verificación (V-1…V-13 de `design.md`), comprobado por inspección y por scripts de solo lectura sobre la policy.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Confirmar el «Estado medido» del diseño | ✓ completado | — (solo lectura; todo coincide, ver «Línea base») |
| T002 | Línea base de enlaces activos | ✓ completado | — (`[OK] Checked 48 active Markdown files`, 0 errores) |
| T003 | Crear la policy con frontmatter, cabecera y encabezados | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T004 | Redactar §1 Propósito y alcance | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T005 | Redactar §2 Vocabulario de veredictos | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T006 | Redactar §3 Reglas G-01…G-06 | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T007 | Redactar §4 Valores permitidos por skill | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T008 | Redactar §5 Equivalencias de valores heredados | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T009 | Redactar §6 Excepciones | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T010 | Redactar §7 Ejemplos de reportes conformes | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T011 | Completar Historial de cambios | ✓ completado | `docs/policies/validation-contract-policy.md` |
| T012 | V-1 y V-2 | ✓ completado | — |
| T013 | V-3 y V-4 | ✓ completado | — |
| T014 | V-5 y V-6 | ✓ completado | — |
| T015 | V-7 (trazado a los flowcharts) | ✓ completado | — (ver «Comparación V-7») |
| T016 | V-8 | ✓ completado | — |
| T017 | V-9 y CNF-1 | ✓ completado | `docs/policies/validation-contract-policy.md` (compactada de 234 a 198 líneas) |
| T018 | Crear ADR-0015 | ✓ completado | `docs/adr/ADR-0015-contrato-de-validacion.md` |
| T019 | V-11 | ✓ completado | — |
| T020 | Registrar la policy en su índice | ✓ completado | `docs/policies/README.md` |
| T021 | Registrar ADR-0015 en su índice | ✓ completado | `docs/adr/README.md` |
| T022 | Regenerar `docs/index.md` | ✓ completado | `docs/index.md` (vía motor de `memory-system index`) |
| T023 | V-12 | ✓ completado | — |
| T024 | V-13 | ✓ completado | — |
| T025 | Preparar la evidencia de V-10 | ✓ completado | — (ver «Evidencia V-10») |

---

## Evidencia de verificación

### Línea base (T001, T002)

- `docs/policies/` contenía solo `README.md`; no existía ADR-0015.
- Ramas `-->|…|` de los flowcharts idénticas a las de D-4 (incluidas las ramas `BLOCKED` al mismo gate de CR-002).
- Los valores heredados siguen en sus fuentes: `verdict: {APPROVED | NEEDS-REFINEMENT | BLOCKED}` (epic-analyze),
  `APROBADA / REFINAR / RECHAZAR / DIVIDIR` (story-evaluation), `✓ Coherente | ⚠️ Advertencias | ❌ Inconsistencias
  bloqueantes` (story-analyze), `approved` / `needs-changes` (story-code-review), `VERIFY-PASSED / VERIFY-REJECTED` y
  `$VERIFY_RECHAZADO` / `REJECTED` (story-verify), `ACCEPTANCE-*` y `session-status: partial` (story-acceptance).
- Los títulos `#` y el primer `##` de cada template coinciden con la tabla de D-9. `story-evaluation` no tiene
  frontmatter en su template: su `type: finvest-evaluation` sale de `SKILL.md` (paso de escritura del reporte).

### V-1…V-9 (T012–T017)

| Verificación | Resultado |
|---|---|
| V-1 | Frontmatter `type: policy`, `slug: validation-contract-policy` (= nombre de archivo), `title`, `derives-from: constitution`; sin `enforced-by` ni `escritor:`. UTF-8 sin BOM. |
| V-2 | `grep -n -E '^## ([0-9]+\. \|Historial)'` → §1…§7 y «Historial de cambios», en orden. Los `##` de §7 van dentro de bloques cercados. |
| V-3 | §3 contiene G-01 (`verdict`) y G-02 (`## Veredicto` primer `##` tras el `#`, línea literal de veredicto). |
| V-4 | 6 valores en §2, todos cumplen `^[A-Z]+(-[A-Z]+)*$`. |
| V-5 | §4 tiene 7 filas con los valores de las Notas de `story.md`, incluida `epic-validate` (sin enlace). |
| V-6 | §5 tiene 18 filas; las 7 filas de Ejemplos de AC-2 aparecen con el mismo par y el mismo valor canónico (7/7). |
| V-8 | 6 ejemplos; en cada uno `verdict` = valor de `**Veredicto:**`, el valor está permitido en §4 y `## Veredicto` es el primer `##` tras el `#`. Cubren los 6 valores del vocabulario. |
| V-9 | 198 líneas (≤ 200). Cada regla y lista de valores aparece una sola vez: §2 semántica, §4 valores por skill, §5 traducciones. |

### Comparación V-7 (T015)

| Flowchart | Nodo | Ramas `verdict` en el `.mermaid` | §4: permitidos − sin rama | ¿Coincide? |
|---|---|---|---|---|
| `flowchart-story-specify.mermaid` | `story-evaluation` (D) | `SPLIT`, `NEEDS-REFINEMENT`, `APPROVED` | `APPROVED`, `NEEDS-REFINEMENT`, `SPLIT` | ✓ |
| `flowchart-story-plan.mermaid` | `story-analyze` (F) | `NEEDS-CHANGES`, `APPROVED` | `APPROVED`, `NEEDS-CHANGES` | ✓ |
| `flowchart-story-excecution-qa.mermaid` | `story-code-review` (E) | `NEEDS-CHANGES`, `BLOCKED` → C (mismo skill), `APPROVED` | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | ✓ |
| `flowchart-story-excecution-qa.mermaid` | `story-verify` (I) | `NEEDS-CHANGES`, `BLOCKED` → H (mismo skill), `APPROVED` | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | ✓ |
| `flowchart-story-excecution-qa.mermaid` | `story-acceptance` (K) | `NEEDS-CHANGES`, `BLOCKED` → J (mismo skill), `APPROVED` | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` (− `PENDING`) | ✓ |

«Valores sin rama» solo contiene `PENDING` (fila `story-acceptance`). `epic-analyze` y `epic-validate` no tienen flowchart.

### V-11 (T019)

Frontmatter de ADR-0015 según D-10; `grep -c '^| \`story-'` = 0 (no reproduce §4 ni §5); los enlaces relativos a la
policy, a `epic.md` de EPIC-25 y a los tres flowcharts resuelven. `docs/adr` es raíz histórica excluida de
`check-doc-links.js`, por eso los enlaces se comprobaron con `test -f`.

### V-12 y V-13 (T023, T024)

- `grep -n validation-contract-policy` → una coincidencia en `docs/policies/README.md` (línea 62) y una en
  `docs/index.md` (línea 35).
- `npm run verify:repository` → `[OK] Verificación determinista del repositorio aprobada.`; `node --test`: 251 pass,
  0 fail; enlaces: `[OK] Checked 49 active Markdown files` (48 en la línea base + la policy nueva), sin errores nuevos.

### Diff de `docs/index.md` (T022)

Entradas propias de la historia: `validation-contract-policy` en «Policies» y `contrato-de-validacion` en «Decisiones
de arquitectura».

**Cambios ajenos a la historia** (el índice no se regeneraba desde el 2026-10-13): `updated`, EPIC-24, EPIC-25,
`EPIC-21-…-test-cases`, STORY-129…STORY-146 (excepto STORY-136, que no existe), `skills-independientes` (ADR-0014),
las métricas (389 nodos) y el aviso `⚠️ sin frontmatter` de
`specs/stories/STORY-130-renombrar-skill-story-improve-a-story-refine/plan.md`, un archivo previo a esta historia. El mismo motor reescribió `docs/requirements/index.md`, donde solo cambia
`updated` (2026-10-13 → 2026-10-18).

### Evidencia V-10 (T025) — para la revisión del PO en `/story-acceptance`

1. **¿Qué valor emite `story-verify` cuando no puede ejecutar las pruebas?** `BLOCKED`. Respaldo: §2 («Un bloqueo impide
   completar el proceso. No es un defecto del artefacto»), §4 (fila `story-verify`: `APPROVED`, `NEEDS-CHANGES`,
   `BLOCKED`) y el ejemplo 7.5.
2. **¿Qué valor canónico corresponde a `ACCEPTANCE-BLOCKED`?** `BLOCKED`. Respaldo: §5 (fila `story-acceptance` ·
   `final-status` · `ACCEPTANCE-BLOCKED` → `BLOCKED`), con G-03 (el valor heredado no es conforme).

---

## Decisiones de implementación no previstas

- **Compactación para CNF-4 (T017):** la primera redacción tenía 234 líneas. Se unieron los párrafos partidos en
  varias líneas y se quitaron líneas en blanco dentro de los ejemplos de §7, hasta 198 líneas, sin cambiar el contenido
  normativo. Los separadores `---` entre secciones de la plantilla no se usan.
- **Enlace a la constitución sin ancla:** §1 enlaza `../constitution.md` sin ancla al encabezado de los principios, que
  lleva emoji; así se evita depender del algoritmo de slugs de `check-doc-links.js`.

---

## Cumplimiento DoD — Fase IMPLEMENT

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. Por inspección: AC-1 (V-1…V-4, V-8), AC-2 (V-6) y AC-3 (V-7) se verificaron. |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1 (V-11, V-12, sin listas duplicadas), CNF-2 (V-4) y CNF-4 (V-9) verificados; CNF-3 requiere la revisión del PO (V-10, en ACCEPTANCE). |
| 3 | El comportamiento coincide con `design.md` | ✓ | Secciones, tablas, reglas y ejemplos según D-1…D-11; V-1…V-12 pasan. |
| 4 | Sin regresiones | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. Ejecutado igualmente: `npm test` 251/251. |
| 5 | Convenciones de `constitution.md` | ✓ | Documentos en español, frontmatter con `type`/`slug`, sin anotaciones `escritor:` en documentos generados (regla 13), ADR por decisión transversal (regla 16). |
| 6 | Sin código comentado ni `TODO` | ✓ | Sin `TODO` en los archivos creados. |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: sin código. |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado. |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios. |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills. |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crean skills. |
| 12 | Se cumple gr-ai-security-checklist | ✓ | No aplica: solo documentación, sin prompts ni código. |
| 13 | Se cumple gr-code-security-checklist | ✓ | No aplica: sin código. |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | No aplica: no se crean ni modifican skills. |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: ningún skill modificado. |
| 16 | Casos de prueba ejecutados según `skill-master` | ✓ | No aplica: ningún skill modificado. |
| 17 | `tasks.md` con todas las tareas en `[x]` | ✓ | 25/25 `[x]`. |
| 18 | README o docs actualizados si cambia un contrato | ✓ | El contrato es la propia policy; índices de policies, ADRs y wiki actualizados. El README del framework es alcance de STORY-139…145 (Non-Goals). |
| 19 | Decisiones no previstas documentadas | ✓ | Sección «Decisiones de implementación no previstas»; no alteran el diseño. |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | El repositorio actualiza el CHANGELOG al cerrar la épica o preparar el release; no se modificó. |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. El mismo gate (`verify:repository`) aprobó localmente. |
| 22 | Sin secrets ni credenciales | ✓ | Solo documentación. |
| 23 | Variables de entorno documentadas | ✓ | No aplica: sin variables nuevas. |
| 24 | Despliegue reversible | ✓ | Solo documentación versionada; se revierte con git. |

**Resumen:** 19/24 criterios ✓ · 5 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no genera tests: sus verificaciones son de inspección y se registran arriba. No se ejecutaron evals
(`npm run test:eval`), porque ningún skill cambió.
