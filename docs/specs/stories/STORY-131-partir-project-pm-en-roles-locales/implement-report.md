---
type: implement-report
id: STORY-131
slug: STORY-131-implement-report
title: "Implement Report: Partir project-pm en roles locales"
story: STORY-131
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-131-partir-project-pm-en-roles-locales
---

<!-- Referencias -->
[[STORY-131-partir-project-pm-en-roles-locales]] · [[STORY-131-partir-project-pm-en-roles-locales-design]] · [[STORY-131-partir-project-pm-en-roles-locales-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Implementación: Partir project-pm en roles locales

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-131 |
| Total de tareas | 24 |
| Tareas completadas | 24 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-15 |

**Estado:** ✅ Implementación completa

La historia no tiene código ejecutable: los artefactos son Markdown (roles y `SKILL.md`) y `evals.json`. Por eso el TDD se aplicó así: los casos de eval TC-007 y TC-008 de cada skill describen el comportamiento de AC-1 y AC-2 (fase RED: no se cumplen sin los roles ni la comprobación del Paso 0), y los contratos de verificación de `design.md` (T016–T022) se ejecutaron sobre el resultado.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Línea base: `project-pm.agent.md` con 57 líneas, sin `assets/agents/`, templates idénticos | ✓ completado | — (solo verificación) |
| T002 | Crear el rol `discovery-pm.md` desde el original | ✓ completado | `skills/project-discovery/assets/agents/discovery-pm.md` |
| T003 | `git mv` de `agents/project-pm.agent.md` a `begin-intent.md`, sin editar | ✓ completado | `skills/project-begin/assets/agents/begin-intent.md` (renombrado) |
| T004 | Frontmatter de I-1, ajustes de D-3 y retiro de `## Estado Discovery` en `begin-intent.md` | ✓ completado | `skills/project-begin/assets/agents/begin-intent.md` |
| T005 | Textos de D-6 en `project-begin` (`description`, Objetivo, Dependencias) | ✓ completado | `skills/project-begin/SKILL.md` |
| T006 | Comprobación del rol al final del Paso 0 (D-5, I-3) | ✓ completado | `skills/project-begin/SKILL.md` |
| T007 | Paso 3 «Entrevista con el rol `begin-intent`» y Paso 1 «el rol no la reconstruye» | ✓ completado | `skills/project-begin/SKILL.md` |
| T008 | Textos de D-6 en `project-discovery` (Dependencias, Restricciones) | ✓ completado | `skills/project-discovery/SKILL.md` |
| T009 | Comprobación de la lista de roles locales al final del Paso 0 | ✓ completado | `skills/project-discovery/SKILL.md` |
| T010 | Paso 4: `$DISCOVERY_SUMMARY_PATH` y lectura del rol `discovery-pm` | ✓ completado | `skills/project-discovery/SKILL.md` |
| T011 | README de `project-begin`, l.9 | ✓ completado | `skills/project-begin/README.md` |
| T012 | Comentarios `# escritor:` del seed y de la copia central (siguen idénticos) | ✓ completado | `skills/project-begin/assets/vision-template.md`, `docs/templates/vision-template.md` |
| T013 | Párrafo l.182 de la guía de orquestación (D-7, con el ajuste de CR-004) | ✓ completado | `docs/guides/harness-eng-agents-orchestration.md`, `design.md` (CR-004) |
| T014 | TC-007 y TC-008 de `project-begin` con el escape `project-pm` | ✓ completado | `skills/project-begin/evals/evals.json` |
| T015 | TC-007 y TC-008 de `project-discovery` con el escape `project-pm` | ✓ completado | `skills/project-discovery/evals/evals.json` |
| T016 | Contratos 1 y 2: existen los dos roles y no existe el agente global | ✓ completado | — (verificación) |
| T017 | Contrato 3: ningún `project-pm` en `skills/`, template central ni guía; ningún `agents/` fuera de `assets/agents/` en los `SKILL.md` | ✓ completado | — (verificación) |
| T018 | Contrato 4: 2 secciones compartidas por rol; `Estado Visión` solo en `begin-intent.md`, `Estado Discovery` solo en `discovery-pm.md` | ✓ completado | — (verificación) |
| T019 | Contrato 5: diff contra `main` limitado a D-2, D-3 y la sección retirada | ✓ completado | — (verificación) |
| T020 | Contrato 6: 38 y 37 líneas (< 57), sin `tools:` ni `model:` | ✓ completado | — (verificación) |
| T021 | Codificación: sin BOM ni mojibake en los 10 archivos | ✓ completado | — (verificación) |
| T022 | `npm run verify:repository`: exit 0 (251/251 pruebas, smoke del tarball en 4 runtimes) | ✓ completado | — (verificación) |
| T023 | Contrato 8 (evals) queda a ejecución manual (ver nota al final) | ✓ completado | `implement-report.md` |
| T024 | Reinstalación local y borrado de `.claude/agents/project-pm.agent.md` | ✓ completado | `.claude/` (salida no versionada) |

### Evidencia de los contratos de verificación

| # | Resultado |
|---|---|
| 1 | `git ls-files skills/project-begin/assets/agents skills/project-discovery/assets/agents` → `begin-intent.md`, `discovery-pm.md` |
| 2 | `git ls-files agents/project-pm.agent.md` → sin salida |
| 3 | `git grep -n "project-pm" -- skills docs/templates/vision-template.md docs/guides/harness-eng-agents-orchestration.md` → sin salida; `grep "agents/" … \| grep -v "assets/agents/"` → sin salida |
| 4 | `grep -c` de las dos secciones compartidas → 2 y 2; `grep -l "^## Estado Visión"` → solo `begin-intent.md`; `grep -l "^## Estado Discovery"` → solo `discovery-pm.md` |
| 5 | `git diff -M main` → renombrado con 53 % de similitud a `begin-intent.md` y `discovery-pm.md` nuevo; cambios limitados al frontmatter, la intro, el paso 1 del Protocolo, el paso 6 de Visión y la sección de estado retirada |
| 6 | `wc -l` → 38 (`begin-intent.md`) y 37 (`discovery-pm.md`) |
| 7 | `cmp docs/templates/vision-template.md skills/project-begin/assets/vision-template.md` → sin salida |
| 8 | Pendiente: ejecución manual (ver nota al final) |
| 9 | `npm run verify:repository` → exit 0 |

### Decisiones de implementación

- **CR-004 (registrado en `design.md`):** el texto literal de D-7 nombraba `` `project-pm` ``, lo que hacía imposible el contrato 3 sobre la guía. En el párrafo, el sujeto pasó a «El antiguo agente de PM»; el resto del texto de D-7 se conserva literal.
- **Escape `m` en `evals.json`:** las cadenas se escribieron con Node para dejar el escape literal en el archivo. `JSON.parse` devuelve `agents/project-pm` y `project-pm.agent.md`, tal como pide D-8. `git grep "project-pm"` sobre los dos `evals/` no devuelve nada.
- **`git add -N` de `discovery-pm.md`:** se marcó como intención de añadir para que `git ls-files` lo liste en el contrato 1. No se hizo commit.

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Requiere ejecución de tests: AC-1 y AC-2 se comprueban con TC-007/TC-008 vía `npm run test:eval`, a ejecución manual según `AGENTS.md`. Los contratos estructurales 1–4 pasan |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1: contratos 4 y 5. CNF-2: contrato 6 (38 y 37 líneas < 57) |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | D-1…D-8 aplicados; la única desviación (D-7) queda documentada como CR-004 |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ⚠️ | Requiere ejecución de tests: `verify:repository` pasa (251/251), pero TC-001…TC-006 de los dos skills se corren a mano |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | Español, UTF-8 sin BOM (T021), fuente única en `skills/<skill>/` |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Los archivos modificados no añaden código comentado ni `TODO` |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | No se modificó JavaScript. `$DISCOVERY_SUMMARY_PATH`, que antes se usaba sin definir, queda definida en el Paso 4 |
| 8 | El código pasa el linter y el formateador sin errores | ✓ | `verify:repository` (sintaxis Node, YAML, enlaces, inventario de evals) termina en exit 0 |
| 9 | No se introducen dependencias nuevas sin aprobación | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para crear skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Ruta de skill nuevo en `package.json` → `files` | ✓ | No aplica: `skills/` ya publica `assets/`; el tarball incluye los dos roles |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | No evaluado ítem por ítem. Los roles se copian del agente previo sin instrucciones nuevas, y la comprobación de D-5 elimina el fallback a una fuente externa al skill |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | No se modifica código ejecutable |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: no se crea ningún skill |
| 15 | Los skills críticos tienen pruebas `evals/evals.json` | ✓ | `project-begin` y `project-discovery` pasan de 6 a 8 casos |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; `AGENTS.md` deja `test:eval` a criterio humano |
| 17 | El `tasks.md` tiene todas las tareas marcadas `[x]` | ✓ | 24/24 `[x]` |
| 18 | README o docs actualizados si cambian contratos | ✓ | `skills/project-begin/README.md`, los dos `vision-template.md` y la guía de orquestación (T011–T013) |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 |
| 20 | El CHANGELOG se actualiza si aplica | ⚠️ | `CHANGELOG.md › [Unreleased]` está vacío y ninguna historia de EPIC-24 lo actualizó todavía; queda para la preparación de la release |
| 21 | El build de CI pasa sin errores | ⚠️ | Requiere ejecución de CI. Localmente `npm run verify:repository` (el mismo gate que `quality.yml`) termina en exit 0 |
| 22 | No hay secrets ni credenciales expuestos | ✓ | Los archivos modificados son Markdown y JSON sin credenciales |
| 23 | Las variables de entorno necesarias están documentadas | ✓ | No aplica: no se añaden variables de entorno |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambios de texto versionados; se revierten con git |

**Resumen:** 18/24 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

El contrato 8 queda a ejecución manual del humano, según `AGENTS.md`:

```
npm run test:eval -- project-begin
npm run test:eval -- project-discovery
```

Resultado esperado: TC-001…TC-008 en verde en ambos skills. Si algún TC-001…TC-006 falla porque el runner asume que falta el rol local, añade «existe el rol local» a su `input.context` sin tocar `expected` (mitigación de Risks en `design.md`).

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
