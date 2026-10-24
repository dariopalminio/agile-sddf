---
type: implement-report
id: STORY-132
slug: STORY-132-implement-report
title: "Implement Report: Partir project-architect en roles locales"
story: STORY-132
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-132-partir-project-architect-en-roles-locales
---

<!-- Referencias -->
[[STORY-132-partir-project-architect-en-roles-locales]] · [[STORY-132-partir-project-architect-en-roles-locales-design]] · [[STORY-132-partir-project-architect-en-roles-locales-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Implementación: Partir project-architect en roles locales

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-132 |
| Total de tareas | 23 |
| Tareas completadas | 23 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-15 |

**Estado:** ✅ Implementación completa

La historia no tiene código ejecutable: los artefactos son Markdown (roles, `SKILL.md`, `README.md`) y `evals.json`. El TDD se aplicó como en STORY-131: los casos TC-008/TC-009 de `project-planning` y TC-009/TC-010 de `project-discovery` describen AC-1 y AC-2 (fase RED: no se cumplen sin los roles ni la comprobación del Paso 0), y los contratos de verificación 1–7 y 9 de `design.md` se ejecutaron sobre el resultado.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Línea base: STORY-131 integrada en el árbol de trabajo (`discovery-pm.md` indexado, `project-pm.agent.md` fuera del índice, lista de roles en el Paso 0); `project-architect.agent.md` con 59 líneas; sin `skills/project-planning/assets/agents` | ✓ completado | — (solo verificación) |
| T002 | Crear el rol `planning.md` desde el original, antes del `git mv` | ✓ completado | `skills/project-planning/assets/agents/planning.md` |
| T003 | `git mv` de `project-architect.agent.md` a `discovery-architect.md` sin editar | ✓ completado | `skills/project-discovery/assets/agents/discovery-architect.md` (renombrado) |
| T004 | Frontmatter I-1, ajustes de intro D-3 y retiro de `## Estado Planning` en `discovery-architect.md` | ✓ completado | `skills/project-discovery/assets/agents/discovery-architect.md` |
| T005 | Textos D-6 en `project-planning/SKILL.md` (`description`, Objetivo, Dependencias, Restricciones) | ✓ completado | `skills/project-planning/SKILL.md` |
| T006 | Comprobación del rol al final del Paso 0 con I-3 y sin fallback | ✓ completado | `skills/project-planning/SKILL.md` |
| T007 | Paso 5 «Propuesta con el rol `planning` y validación del staging» | ✓ completado | `skills/project-planning/SKILL.md` |
| T008 | `README.md:7` de `project-planning` | ✓ completado | `skills/project-planning/README.md` |
| T009 | Textos D-6 en `project-discovery/SKILL.md` (Dependencias, Restricciones) | ✓ completado | `skills/project-discovery/SKILL.md` |
| T010 | `discovery-architect.md` en la lista de roles del Paso 0, una línea I-3 por rol ausente | ✓ completado | `skills/project-discovery/SKILL.md` |
| T011 | Paso 5: `$OUTPUT_PATH = $UX_FINDINGS_PATH = …` | ✓ completado | `skills/project-discovery/SKILL.md` |
| T012 | Paso 6 «Propuesta de requisitos con el rol `discovery-architect`» | ✓ completado | `skills/project-discovery/SKILL.md` |
| T013 | TC-008 y TC-009 en `project-planning` (escape `t`) | ✓ completado | `skills/project-planning/evals/evals.json` |
| T014 | TC-009 y TC-010 en `project-discovery`; contexto de TC-007 corregido (escape `t`) | ✓ completado | `skills/project-discovery/evals/evals.json` |
| T015 | Contratos 1 y 2: los dos roles indexados; `agents/project-architect.agent.md` fuera del índice | ✓ completado | — (verificación) |
| T016 | Contrato 3: `git grep "project-architect"` vacío en ambos skills; sin `agents/` fuera de `assets/agents/` en los `SKILL.md` | ✓ completado | — (verificación) |
| T017 | Contrato 4: reparto de `## Principios`, estados y las cinco subsecciones `###` | ✓ completado | — (verificación) |
| T018 | Contrato 5: `git diff -M --cached main` muestra el renombrado (similaridad 55 %) y el archivo nuevo, solo con los cambios de D-2/D-3 y la sección retirada | ✓ completado | — (verificación) |
| T019 | Contrato 6: sin `tools:` ni `model:` en los roles | ✓ completado | — (verificación) |
| T020 | Contrato 7: los 7 archivos sin BOM y sin mojibake | ✓ completado | — (verificación) |
| T021 | `npm run verify:repository` → exit 0 (incluye smoke del tarball con 4 runtimes) | ✓ completado | — (verificación) |
| T022 | Contrato 8 queda a ejecución manual (ver «Nota sobre los Tests Generados») | ✓ completado | `implement-report.md` |
| T023 | Reinstalación local `--target claude-code --force`; borrada a mano `.claude/agents/project-architect.agent.md`; roles presentes en `.claude/skills/` | ✓ completado | — (salida no versionada) |

---

## Observaciones de implementación

- **Escape `t` en `evals.json` (CR-001):** las herramientas de edición del agente decodificaban la secuencia y escribían `project-architect` literal. El escape se aplicó con un script Node que construye la barra invertida con `String.fromCharCode(92)`. Resultado: 3 apariciones escapadas y 0 literales en cada `evals.json`; los escapes previos (`e`, `J`, `m`, `-`) conservan el mismo conteo que en el índice.
- **Formato de los casos nuevos:** se siguió el formato existente de cada archivo (un caso por línea; `threshold: 1` en `project-planning` y `1.0` en `project-discovery`), no un formato multilínea.
- **Indexado de `planning.md`:** se hizo `git add` (sin commit) de los dos roles para que `git ls-files` del contrato 1 los liste, igual que STORY-131 con `discovery-pm.md`.
- **Mensaje I-3 en `project-discovery`:** el Paso 0 muestra ahora las dos líneas posibles y aclara «una línea por cada rol que falte» (D-5).

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests: los evals (contrato 8) se corren a mano según `AGENTS.md` |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 verificado con los contratos 4 y 5 (T017, T018) |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-7 aplicados literalmente; contratos 1–7 y 9 en verde |
| 4 | Sin regresiones | ⚠️ | `verify:repository` exit 0; TC-001…TC-007 de `project-planning` sin cambios, pero su ejecución es manual |
| 5 | Convenciones de `constitution.md` | ✓ | Español, UTF-8 sin BOM, frontmatter uniforme con `begin-intent.md` y `discovery-pm.md` |
| 6 | Sin código comentado ni `TODO` | ✓ | Ninguno en los archivos tocados |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica (Markdown/JSON); `$UX_FINDINGS_PATH` ahora queda definido donde se produce |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` exit 0; los dos `evals.json` parsean |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No se crea ningún skill; solo archivos de rol en skills existentes |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No hay skill nuevo; `skills/` ya está en `files` y `npm pack --dry-run` incluye los dos roles |
| 12 | [[gr-ai-security-checklist]] | ✓ | Se retiran `tools` del agente; los roles no amplían permisos ni escriben fuera de staging |
| 13 | [[gr-code-security-checklist]] | ✓ | Sin código ejecutable, secretos ni entradas externas nuevas |
| 14 | [[gr-skill-creation-checklist]] | ✓ | Skills existentes modificados con `description` y evals actualizados |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Ambos skills tienen evals con los casos de AC-1 y AC-2 |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests: `npm run test:eval` queda a criterio humano (`AGENTS.md`) |
| 17 | `tasks.md` con todas las tareas en `[x]` | ✓ | 23/23 |
| 18 | README/docs actualizados si cambia un contrato | ✓ | `skills/project-planning/README.md` actualizado; docs fuera de alcance (`FR-009`, `FR-010`, `NFR-015`, `stakeholders.md`, `roadmap.md`) quedan para el chore de cierre de EPIC-24 (Non-Goals) |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | No hubo decisiones de diseño nuevas; las observaciones de implementación son de herramienta |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | No actualizado; la épica concentra la documentación en su chore de cierre |
| 21 | Build de CI pasa | ✓ | El mismo gate de `quality.yml` (`verify:repository`) pasa en local |
| 22 | Sin secretos ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ✓ | No se introducen variables de entorno |
| 24 | Despliegue reversible | ✓ | Cambios de archivos versionados; revertibles con git |

**Resumen:** 20/24 criterios ✓ · 4 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

El contrato 8 queda pendiente de ejecución humana:

```
npm run test:eval -- project-planning    # TC-001…TC-009
npm run test:eval -- project-discovery   # TC-001…TC-010
```

Si un TC-001…TC-007 de `project-planning` falla porque el runner asume que falta el rol local (y emite I-3), añade «existe el rol local» a su `input.context` sin tocar `expected` (Risks de `design.md`).

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
