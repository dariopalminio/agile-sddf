---
type: implement-report
id: BUG-003
slug: BUG-003-implement-report
title: "Implement Report: epic-analyze acepta CS-<id> por ID y cita el criterio literal"
story: BUG-003
created: 2026-11-12
updated: 2026-11-12
---

# Reporte de implementación: BUG-003 — epic-analyze acepta `CS-<id>` por ID y cita el criterio literal

## Resumen

| Métrica | Valor |
|---|---|
| Work item | BUG-003 |
| Plan | [plan.md](plan.md) (`plan-03`) |
| Pasos del plan | 8 (sección «Orden de trabajo»; el bug no tiene `tasks.md`) |
| Pasos completados | 8 |
| Verificación pendiente | Puntos 5 y 6 de «Verificación» (evals y comprobación del proceso), manuales por cuota |
| Fecha de implementación | 2026-11-12 |
| Commit | sin commit (los cambios están en el árbol de trabajo) |

**Estado:** ✅ Implementación completa y verificada de forma determinista. ⏸ Faltan los evals y la comprobación del proceso, que se ejecutan a criterio humano por la cuota de LLM (principio 14 de la constitución).

Había dos defectos. Primero, `skills/epic-analyze/SKILL.md` aceptaba `SMOKE-<N>` por ID como evidencia E1, pero a un criterio de salida le exigía el texto completo, aunque el template de épica le da un ID estable (`**CS-N**`). Segundo, el informe citó CS-5 de EPIC-28 con una cláusula tomada del índice de historias. La corrección aplica las decisiones D-1 a D-5 del plan:

- **D-1:** el ID declarado pasa a ser la etiqueta del criterio en el informe.
- **D-2:** citar `CS-<id>` cuenta como E1, con límite de palabra.
- **D-3:** el texto del criterio se copia literal de su línea en `epic.md`.
- **D-4:** con ID declarado, SAL-01 sugiere citar `CS-<id>`.
- **D-5:** `epic-refine` aplica las mismas reglas.

Los evals se escribieron antes de cambiar los skills.

## Estado por paso del plan

| # | Paso | Estado | Evidencia verificada en el filesystem (2026-11-12) |
|---|---|---|---|
| 1 | Activar el bug | ✅ DONE | `bug.md` y `plan.md` pasaron a `PLAN/IN-PROGRESS`; al cerrar, `bug.md` quedó en `IMPLEMENT/DONE` y `plan.md` en `COMPLETED/DONE` |
| 2 | Evals de `epic-analyze` | ✅ DONE | `skills/epic-analyze/evals/evals.json`: 34 casos (TC-031 a TC-034 al final), versión 1.5.0; TC-011 y TC-012 sin cambios |
| 3 | Eval de `epic-refine` | ✅ DONE | `skills/epic-refine/evals/evals.json`: 26 casos (TC-026), versión 1.5.0; fixture nuevo `skills/epic-refine/examples/cobertura-por-id/` (épica con `**CS-1**`, informe con SAL-01 sobre CS-1 y STORY-302 que cita `**CS-1**` sin copiar el texto) |
| 4 | Gate antes de tocar los skills | ✅ DONE | `npm run verify:repository` aprobado con los evals nuevos |
| 5 | `epic-analyze/SKILL.md` | ✅ DONE | D-1 en `SKILL.md:191`; D-2 en `:198`; D-3 («Texto citado (copia literal)») en `:203`; ejemplos nuevos en `:212-213`; D-4 en `:221`; clave `cobertura-salida` en `:295`; `SDDF-FIXED-LAYOUT: v1` intacto |
| 6 | Plantilla seed del informe | ✅ DONE | `skills/epic-analyze/assets/epic-analyze-report-template.md:47`: etiqueta declarada o posicional con `(implícito)`, y copia literal del enunciado |
| 7 | `epic-refine/references/sal-corrections.md` | ✅ DONE | Etiqueta en `:16`; elemento vigente por ID en `:18`; regla E1 en `:32`; además `:13`, `:78`, `:85` y `:98` (ver Observación 1) |
| 8 | Verificación y actualización de `bug.md` | ✅ DONE | Sección «Corrección aplicada (2026-11-12)» en `bug.md`; tabla siguiente |

## Casos de eval añadidos

| ID | Skill | Qué fija | Decisión |
|---|---|---|---|
| TC-031 | `epic-analyze` | `**CS-1**` y `**CS-2**` citados solo por ID, sin AC que los verifique → `3/3 cubiertos`, `mención · story.md:16`, APPROVED | D-1, D-2 |
| TC-032 | `epic-analyze` | `**CS-1**` y `**CS-1a**`; la historia cita solo `CS-1a` → SAL-01 sobre CS-1 con «citar `CS-1` en su `story.md`» | D-2, D-4 |
| TC-033 | `epic-analyze` | `CS-2` citado solo en `## Fuera de alcance` → SAL-01 en `epic.md:23` | D-2 |
| TC-034 | `epic-analyze` | `**CS-1a**`, `**CS-1b**` y `**CS-2**`; el índice parafrasea CS-2 con una cláusula extra → filas con el ID declarado, nunca `CS-3`; el SAL-01 sin la cláusula del índice | D-1, D-3 |
| TC-026 | `epic-refine` | SAL-01 sobre `CS-1` que STORY-302 ya cita por ID → `ya resuelto`, «STORY-302 ya cita CS-1», sin AC de cierre ni `.bak` | D-5 |

TC-011 y TC-012, con criterios sin ID, no cambian: comprueban que las épicas sin IDs se analizan como antes.

## Verificación determinista (2026-11-12)

| # | Comprobación del plan | Resultado |
|---|---|---|
| 1 | `npm run verify:repository` | ✅ `[OK] Verificación determinista del repositorio aprobada` (incluye el inventario de evals, `verify:layout` y el smoke del tarball en 4 runtimes); ver Observación 2 |
| 2 | `npm test` | ✅ 584/584 pass, 0 fail |
| 3 | `grep -rn "no un ID de la épica" skills/epic-analyze skills/epic-refine` | ✅ Sin resultados |
| 4 | Sin U+FEFF literal | ✅ 0 ocurrencias en los 5 archivos editados, en los 4 del fixture nuevo y en `bug.md` y `plan.md` |
| — | `node scripts/check-doc-links.js` | ✅ `[OK] Checked 57 active Markdown files` |
| 7 | `graphify update .` | ✅ `graphify-out/graph.json` actualizado el 2026-11-12 |

## Verificación manual pendiente (criterio humano por cuota)

| # | Comprobación | Estado |
|---|---|---|
| 5a | `npm run test:eval -- epic-analyze` (TC-011, TC-012, TC-031 a TC-034) | ⏸ Sin ejecutar |
| 5b | `npm run test:eval -- epic-refine` (TC-026 y los casos SAL: TC-009, TC-010, TC-012 y TC-013) | ⏸ Sin ejecutar |
| 6 | `/epic-analyze` sobre la próxima épica que cite `CS-<id>`, o sobre una copia temporal de EPIC-28 tomada de `a33621b9`: CS-2, CS-5 y CS-7 deben salir ✓ y el texto de CS-5 debe ser literal | ⏸ Sin ejecutar |

Este es el único trabajo restante. Al completarlo, las evidencias se anotan en `bug.md` y en este reporte.

## Evidencias del cambio (árbol de trabajo, sin commit)

| Archivo | Δ |
|---|---|
| `skills/epic-analyze/evals/evals.json` | +459/−2 (TC-031 a TC-034, versión y descripción) |
| `skills/epic-analyze/SKILL.md` | +8/−4 (D-1 a D-4, ejemplos y clave `cobertura-salida`) |
| `skills/epic-analyze/assets/epic-analyze-report-template.md` | +1/−1 (comentario de `cobertura-salida`) |
| `skills/epic-refine/evals/evals.json` | +30/−1 (TC-026 y versión) |
| `skills/epic-refine/references/sal-corrections.md` | +7/−7 (D-5) |
| `skills/epic-refine/examples/cobertura-por-id/` | Nuevo: `epic.md`, `epic-analyze-report.md`, STORY-301 y STORY-302 |
| `specs/flow/BUG-003-epic-analyze-ignora-cs-por-id/` | Nuevo: `bug.md`, `plan.md` y este reporte |

Sin cambios, conforme al plan: E2, la suma de coberturas parciales (`SKILL.md:201`), las familias INT y MAD, el veredicto, `epic-validate` y `.claude/skills/` (salida de `agile-sddf install`).

## Observaciones

1. **Alcance de `sal-corrections.md` mayor que el del plan.** El plan listaba las líneas 16, 18 y 32. También se ajustaron la `:13` («Elemento» = enunciado literal) y, sobre todo, la `:78`, la `:85` y la `:98`: el AC de cierre y la cita E1 que escribe `epic-refine` copiaban el «texto literal del criterio, sin la casilla», que con un ID declarado habría incluido el prefijo `**CS-<id>** —`. Ahora copian el enunciado sin ese prefijo.
2. **Gate intermitente.** La primera ejecución de `npm run verify:repository`, tras editar los skills, falló en una prueba de `test/run-evals.test.js`. No se reprodujo al repetir el gate ni en `npm test`. Ningún archivo de BUG-003 toca `run-evals`, así que se deja anotado como posible prueba inestable, sin investigarla.
3. **Ajustes de los evals respecto al plan.**
   - Se añadió la condición de que la épica no vuelva a mostrar etiquetas posicionales cuando los criterios declaran ID (`not_contains: "CS-3"` en TC-034).
   - En TC-032 se retiró una aserción frágil sobre `epic.md:23`.
   - Se subió la versión de los dos `evals.json` a 1.5.0 y se amplió la descripción de los evals de `epic-analyze`.
4. **Cambios ajenos en el árbol de trabajo.** `git status` muestra el archivado de BUG-001 y BUG-002 y cambios en `docs/index.md` que hizo otra sesión, y no forman parte de BUG-003. Al hacer commit, conviene incluir solo los archivos de la tabla anterior.
5. **Estado del work item.** `bug.md` está en `IMPLEMENT/DONE` y `plan.md` en `COMPLETED/DONE`. El cierre del bug depende de la verificación manual pendiente.

## Veredicto

**Implementación completa (8/8 pasos) y verificada de forma determinista.** Faltan los evals TC-031 a TC-034 y TC-026, más los casos de regresión, y una ejecución real de `/epic-analyze`, a criterio humano por la cuota. Cuando estén hechos y anotados, el bug puede cerrarse.
