---
type: implement-report
id: STORY-147
slug: STORY-147-implement-report
title: "Implement Report: ADR del layout fijo de tres raíces"
story: STORY-147
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: ADR del layout fijo de tres raíces

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-147 |
| Total de tareas | 16 |
| Tareas completadas | 16 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

Historia `chore` documental: no se generó código ni tests (design, «Decisiones de complejidad justificada»). Los
criterios de aceptación se verificaron con los contratos de verificación 1–10 de `design.md`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Confirmar que ADR-0016 es el número libre | ✓ completado | — (sin `ADR-0016-*` previo) |
| T002 | Confirmar que el slug `layout-fijo-de-tres-raices` es único en frontmatter | ✓ completado | — (solo aparece en el cuerpo de `design.md`, no indexado) |
| T003 | Crear ADR-0016 con frontmatter y título | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| T004 | Redactar `## Contexto y problema` | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| T005 | Redactar `## Decisión` (árbol, raíces hermanas, retiro de configuración) | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| T006 | Convención de `archive/` y decisión explícita sobre el slug | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| T007 | Rationale, Alternativas, Consecuencias (D-8) y Referencias | ✓ completado | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` |
| T008 | Marcar ADR-0010 como reemplazado (solo metadatos + nota) | ✓ completado | `docs/adr/ADR-0010-specs-dentro-de-docs.md` |
| T009 | Actualizar el índice de ADRs | ✓ completado | `docs/adr/README.md` |
| T010 | Añadir ADR-0016 al índice wiki | ✓ completado | `docs/index.md` |
| T011 | Verificar AC-1 (contratos 1–6) | ✓ completado | — |
| T012 | Verificar AC-2 y CNF-1 (`git diff` de ADR-0010) | ✓ completado | — |
| T013 | Verificar AC-3 (slug, SMOKE-1/SMOKE-2) | ✓ completado | — |
| T014 | Verificar a mano los enlaces de ADR-0016 y de la nota de ADR-0010 | ✓ completado | — |
| T015 | Ejecutar `npm run verify:repository` | ✓ completado con observación | — (ver «Verificación») |
| T016 | Verificar alcance con `git diff --stat` | ✓ completado | — |

---

## Verificación

| # | Contrato (design) | Resultado |
|---|---|---|
| 1 | ADR-0016 `ACCEPTED`, `supersedes: ADR-0010` | ✓ |
| 2 | `## Decisión` contiene `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` | ✓ |
| 3 | `## Decisión` contiene `SDDF_ROOT`, `root`, `SPECS_BASE` | ✓ |
| 4 | Convención `<YYYY-MM-DD>-STORY-NNN-<slug>/` | ✓ |
| 5 | ADR-0010 `status: SUPERSEDED`, `superseded-by: ADR-0016` | ✓ |
| 6 | `docs/adr/README.md` lista `ADR-0016-layout-fijo-de-tres-raices.md` | ✓ |
| 7 | `git diff` de ADR-0010: solo `status`, `superseded-by` y la nota bajo el título (más su línea en blanco separadora) | ✓ |
| 8 | `## Decisión` contiene `STORY-NNN-<slug>/`, `EPIC-NN-<slug>/`, SMOKE-1 y SMOKE-2 | ✓ |
| 9 | `npm run verify:repository` exit 0 | ⚠️ ver abajo |
| 10 | `git diff --stat`: solo los 4 archivos de «Componentes afectados» más artefactos de la historia | ✓ |

**Contrato 9 (CNF-2):** `npm run verify:repository` termina con exit 1 en el paso «pruebas deterministas»: 15
pruebas fallan, todas sobre el template de épica y la migración `epic-template-v1` (UT-001, UT-003, UT-005…UT-016,
UT-019, UT-020, IT-001). La misma lista de 15 fallos se reproduce exactamente con `git stash -u` (HEAD sin los cambios
de esta historia): son preexistentes y ajenos a STORY-147. El resto de pasos del gate, ejecutados uno a uno, terminan
con exit 0, incluido «enlaces activos» (`check-doc-links.js`: `[OK] Checked 49 active Markdown files`), que es lo que
CNF-2 protege. `npm pack --dry-run` y el smoke del tarball no se ejecutaron por separado.

Los enlaces relativos y wikilinks de ADR-0016 y de la nota de ADR-0010 (excluidos del checker por estar en `docs/adr`)
se verificaron a mano: apuntan a archivos existentes y los slugs `specs-dentro-de-docs`,
`nivel-l2-epic-y-directorios-numerados`, `templates-como-capa-propia` y `EPIC-26-layout-y-flow-forward-mejorado`
resuelven a un único archivo.

**Observación ajena al alcance:** `docs/adr/` contiene dos archivos con número 0013
(`ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md` y `ADR-0013-eliminar-specs-01-projects.md`); no se tocó.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1, AC-2 y AC-3 verificados con los contratos 1–8 |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: diff de ADR-0010 sin cambios en secciones; CNF-2: «enlaces activos» exit 0 |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1…D-9 aplicados; frontmatter según «Esquema de datos» |
| 4 | Sin regresiones | ⚠️ | 15 pruebas fallan, preexistentes e idénticas en HEAD sin estos cambios; no se introducen fallos nuevos |
| 5 | Convenciones de `constitution.md` | ✓ | Español; ADR según `adr-template.md` y convención de ADR-0013/ADR-0015 |
| 6 | Sin código comentado ni `TODO` | ✓ | Sin `[Por completar]` ni comentarios `escritor:` en ADR-0016 |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: sin código |
| 8 | Linter y formateador sin errores | ✓ | No aplica: sin código; `verify-syntax.js` exit 0 |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crean skills |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | No aplica: cambio solo documental |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | No aplica: sin código |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crean skills |
| 15 | Skills críticos con `evals/evals.json` | ✓ | No aplica: no se modifican skills |
| 16 | Casos de prueba ejecutados según `skill-master` | ✓ | No aplica: no se modifican skills |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 16/16 `[x]` |
| 18 | README o docs de contratos actualizados | ✓ | `docs/adr/README.md` y `docs/index.md`; `AGENTS.md` y guías quedan para STORY-154 (Non-Goals) |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Sin decisiones no previstas |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica: el cambio incompatible y la versión mayor los registra STORY-154 |
| 21 | Build de CI sin errores | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement; localmente el gate falla por las 15 pruebas preexistentes |
| 22 | Sin secrets ni credenciales | ✓ | Solo Markdown documental |
| 23 | Variables de entorno documentadas | ✓ | No se añaden variables; el retiro de `SDDF_ROOT` se aplica en STORY-148 a STORY-158 |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios documentales revertibles con git |

**Resumen:** 22/24 criterios ✓ (2 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no genera tests (chore documental); el gate existente (`npm run verify:repository`) cubre CNF-2.

Pasos recomendados:
1. Corregir las 15 pruebas preexistentes del template de épica para recuperar el gate en verde
2. Ejecutar `npm run verify:repository` completo
3. Consultar `design.md` para verificar que la implementación respeta las decisiones D-1…D-9
