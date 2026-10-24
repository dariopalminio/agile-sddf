---
type: implement-report
id: STORY-096
slug: STORY-096-memory-system-scaffold-ensure-rebuild-implement-report
title: "Implement Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
story: STORY-096
created: 2026-09-22
updated: 2026-09-23
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]

# Implement Report: STORY-096

> Informe sobrescrito en la ejecución de rework del 2026-09-23, tras la tercera revisión de código. Las pasadas de corrección anteriores (2026-09-22 y la segunda ronda del 2026-09-23) están en el historial de git (`fe74c30` y anteriores). Se conservan abajo *Artefactos producidos* y *Desviaciones respecto a design.md* porque describen la implementación vigente, no una ronda.

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (nominal: `npm run test:eval` sale con exit 1 porque no hay ningún skill evaluable con cambios respecto a HEAD; no hay tests nuevos) |
| Fase GREEN confirmada | sí (evals de memory-system 14/14: TC-010 falló una vez por flakiness y pasó 2/2 al reejecutarlo; `node --test test/memory-system.test.js` 42/42) |
| Fase REFACTOR confirmada | sí (`npm test` 121/121; `verify:links` OK; sin regresiones) |
| Archivos de prueba generados | 0 |
| Archivos de producción generados | 0 creados · 4 modificados |
| Modo de ejecución | interactive (rework) |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` (`skill-test-evals`): 0 archivos. Los hallazgos son contenido estático de plantilla y documentación, que no se observa en la salida conductual de `claude -p`. `unit` y `e2e` se omiten por `skill: none`. Gate de evidencia: `warning` (dimensiones: code-quality, integration-architecture, DoD-CODE-REVIEW; ninguna requirements-coverage). |
| GREEN | ✅ | Capa `monolithic` (`skill-master`). Las 11 secciones de `policy-template.md` quedan anotadas con `<!-- escritor: autoría manual -->`, con el mismo formato que `domain`/`guardrail`. La semilla se copió byte a byte a `docs/templates/` (`cmp`: idénticas). En `docs/architecture/memory-system.md` se añadió una fila a la tabla §10.3 y se amplió la viñeta de §10.2. Evals 14/14 tras reejecutar TC-010, que es flaky: su `not_contains` salta cuando el modelo menciona una opción de menú que no eligió. |
| REFACTOR | ✅ | Capa `monolithic` (`skill-master`). La viñeta "Plantillas compartidas" de §10.2 queda alineada con `memory-rules.md` §5: cita ADR-0007, que conserva la regla de ADR-0001. Además se reajustó el ancho de la viñeta "Árbol semilla". Sin regresiones: `npm test` 121/121 y `verify:links` OK. No se reejecutaron los evals: REFACTOR solo tocó `docs/architecture/`, fuera de `skills/`. |

## Ciclo de corrección — ronda 1

- **Origen:** `fix-directives.md` (max-severity: MEDIUM), con 5 hallazgos bloqueantes
- Nota: `fix-directives.md` no declara `round` en el frontmatter, así que la regla numera el ciclo como 1. En el historial de la historia es la **tercera** revisión de código.

| # | Archivo:Línea | Dimensión | Acción requerida | Archivos tocados | Estado |
|---|---|---|---|---|---|
| 1 | skills/memory-system/assets/scaffold/templates/policy-template.md:35-197 | code-quality | Anotar las 11 secciones en las dos copias (idénticas byte a byte) y corregir el recuento de secciones del informe | `skills/memory-system/assets/scaffold/templates/policy-template.md`, `docs/templates/policy-template.md`, `implement-report.md` | ✓ aplicado |
| 2 | docs/architecture/memory-system.md:309-322 | integration-architecture | Añadir a §10.3 la fila de las tres plantillas de autoría manual (ADR-0012) y actualizar la viñeta de §10.2 | `docs/architecture/memory-system.md` | ✓ aplicado |
| 3 | docs/guardrails/dod-story-checklist.md:135 | DoD-CODE-REVIEW | Se cierra al resolver #1 | — | ⚠️ sin evidencia |
| 4 | docs/guardrails/dod-story-checklist.md:138 | DoD-CODE-REVIEW | Se cierra al resolver #1 y #2 | — | ⚠️ sin evidencia |
| 5 | docs/guardrails/dod-story-checklist.md:142 | DoD-CODE-REVIEW | Se cierra al resolver #1 y #2 y re-ejecutar `/story-code-review` | — | ⚠️ sin evidencia |

Los hallazgos #3–#5 no requieren editar ningún archivo, porque el DoD es solo de referencia. Por eso se espera que figuren "sin evidencia": los juzga el próximo `story-code-review`.

**Lista blanca recibida:**
- `skills/memory-system/assets/scaffold/templates/policy-template.md` — hallazgo #1, #3
- `docs/templates/policy-template.md` — hallazgo #1 (copia byte a byte de la semilla)
- `docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/implement-report.md` — hallazgo #1 (recuento de secciones)
- `docs/architecture/memory-system.md` — hallazgo #2
- `docs/guardrails/dod-story-checklist.md` — hallazgos #3, #4, #5 (solo referencia; **no requiere edición**)

### Archivos fuera de lista blanca

| Fase | Archivo | Origen | Resolución |
|---|---|---|---|
| cierre | `docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/tasks.md` | orquestador (`story-implement`) | registrado: tarea "Implementar fix-directives.md" marcada `[x]` (seguimiento de la historia; lo exige el criterio del DoD IMPLEMENT sobre tareas marcadas) |

Ningún generator tocó archivos fuera de la lista blanca: el delta de `git status --porcelain` se verificó en RED, GREEN y REFACTOR.

**Archivos nuevos:**
Ninguno

## Estado de los LOW de la tercera revisión (no bloqueantes)

Los siguientes hallazgos LOW no se tocaron porque están fuera de la lista blanca, y quedan pendientes a criterio del autor:

- Textos que aún dicen "seis plantillas": `testcases.md`, `README.md:246`, `docs/guides/sddf-commands-pipeline.md:47`, `story.md` y el cuerpo de `design.md`.
- `type: guardrails` en `guardrail-template.md:7`.
- `memory-system.js:797/711/654`.
- Casos TC-005 y TC-008 de `evals.json`.

## Artefactos producidos

| Acción | Archivo | Componente (design.md) |
|---|---|---|
| crear | `skills/memory-system/assets/scaffold/**` (22 archivos) | Árbol semilla (D-1, D-5; CR-004) |
| modificar | `skills/memory-system/scripts/memory-system.js` | Subcomando `scaffold` (D-1, D-2, D-4) |
| modificar | `skills/memory-system/SKILL.md` | Modos `ensure`/`scaffold`/`rebuild` (D-3, D-4) |
| modificar | `skills/memory-system/references/memory-rules.md` | §5 "Scaffold y archivos gestionados" (D-4) |
| modificar | `skills/memory-system/assets/index-template.md` | Placeholder `{layer:specs}` (ver desviación 1) |
| modificar | `skills/memory-system/evals/evals.json` | TC-005…TC-010; TC-003 reconvertido; v1.1.0 |
| crear | `skills/memory-system/examples/{sddf-partial,empty,no-frontmatter}/` | Fixtures (17 archivos) |
| modificar | `test/memory-system.test.js` | `S096-UT-001…008`, `S096-UT-001b`, `S096-UT-001c`, `S096-IT-001` |
| modificar | `skills/header-aggregation/SKILL.md` | Nota D-6 (una línea, sin cambios funcionales) |
| modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | Documentación (D-7, NFR-6, CR-002, CR-003, CR-004) |
| crear | `docs/templates/{domain,guardrail,policy}-template.md` | Sincronización con la semilla (CR-004) |
| regenerar | `docs/index.md` | +2 líneas por `{layer:specs}` |

## Desviaciones respecto a design.md

1. **`{layer:specs}` en `assets/index-template.md`**: la semilla `specs/README.md` es obligatoria (D-1), pero la regla de STORY-095 hacía fallar `index` con exit 2 ante un archivo suelto en `specs/`. Sin el placeholder, `ensure` fallaría en cualquier proyecto recién scaffoldeado. El exit 2 se mantiene para los `specs/<x>/` desconocidos.
2. **`--force` sobrescribe todos los archivos gestionados** (`preservados: 0`, conforme a D-4). El literal `sobrescritos: 3` que ilustra UT-006 en `testcases.md` no aplica: el test verifica que los 3 archivos editados salen `[SOBRESCRITO]` y que el contador suma todos los archivos gestionados.
3. **`.gitkeep` de `specs/01..03`** solo se crea si el directorio no existe, para no ensuciar `03-stories/` ni inflar los contadores.
4. Las cifras `creados 5 · preservados 14` de F-1/E2E-001 son ilustrativas. Con las nueve plantillas, el motor reporta hoy `creados: 19 · preservados: 7` sobre `sddf-partial`. Los `contains` de TC-005 no dependen del número.
5. La salida del motor añade `harness: <h>` y `capas faltantes: …` antes de las marcas; ningún `not_contains` lo prohíbe.
6. `CHANGELOG.md`: los modos se documentan bajo `[3.2.1]`, la misma sección donde el mantenedor situó la entrada de STORY-095 (decisión suya en `b71e9e9`). La inconsistencia con el "desde 3.3.0" de los textos sigue pendiente de decisión.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | Los evals TC-005…TC-010 (escenarios de STORY-096) pasan; TC-010 es flaky y pasó 2/2 al reejecutarlo. Los tests de `test/memory-system.test.js` pasan 42/42 |
| Criterios no funcionales verificados | ✓ | Esta pasada no cambia el comportamiento; idempotencia y preservación siguen cubiertas por `S096-UT-002/006/007` |
| Comportamiento coincide con `design.md` | ✓ | CR-004 queda reflejado también en la definición normativa de la arquitectura (§10.3) |
| No hay regresiones | ✓ | `npm test` 121/121; evals 14/14 |
| Código sigue `constitution.md` | ✓ | Principio 13: las 11 secciones de `policy-template.md` llevan `escritor: autoría manual` (ADR-0012) |
| Sin código comentado ni `TODO` | ✓ | Los comentarios HTML añadidos son anotaciones que exige ADR-0012, no código comentado |
| Sin variables/imports/funciones sin usar | ✓ | No se tocó código ejecutable |
| Pasa linter y formateador | ⚠️ | El repo no define linter; `verify:links` OK |
| Sin dependencias nuevas | ✓ | Ninguna |
| Se usó `skill-master` | ✓ | Capa `monolithic` en GREEN y REFACTOR |
| Skill incluido en `files` de `package.json` | ✓ | No aplica (no hay skill nuevo); `skills/` ya está en `files` |
| Checklist de Seguridad de IA | ✓ | La tercera revisión no encontró hallazgos; esta pasada solo añade comentarios de autoría, sin instrucciones |
| Checklist de Seguridad de Código | ✓ | Sin cambios en código ejecutable |
| Checklist de Creación de Skills | ⚠️ | No se reejecutó: la estructura del skill no cambió |
| Skills críticos con `evals/evals.json` | ✓ | `skills/memory-system/evals/evals.json` (14 casos) |
| Casos de prueba ejecutados automáticamente | ✓ | `npm run test:eval` (memory-system) y `node --test` |
| `tasks.md` con todas las tareas `[x]` | ✓ | La tarea de fix-directives se marcó al cierre (ver *Archivos fuera de lista blanca*) |
| README / docs actualizados si cambian contratos | ⚠️ | `docs/architecture/memory-system.md` está actualizado; `README.md:246` y la guía de comandos siguen diciendo "seis" (LOW, fuera de la lista blanca) |
| Decisiones de diseño no previstas en `design.md` | ✓ | Ninguna nueva; CR-004 ya está registrado |
| CHANGELOG actualizado si aplica | ⚠️ | No aplica a esta corrección documental |
| Build de CI pasa | ⚠️ | No se ejecutó en CI; el equivalente local pasa |
| Sin secrets ni credenciales | ✓ | Ninguno |
| Variables de entorno documentadas | ✓ | No aplica |
| Despliegue reversible | ✓ | Solo cambian documentación y una plantilla |

> Los tests deben ejecutarse manualmente para confirmar el resultado final:
> `npm test` · `npm run test:eval -- memory-system` · `npm run verify:links`.
