---
type: implement-report
id: STORY-096
slug: STORY-096-memory-system-scaffold-ensure-rebuild-implement-report
title: "Implement Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
story: STORY-096
created: 2026-09-22
updated: 2026-09-22
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]

# Implement Report: STORY-096

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (6/6 casos nuevos fallan; TC-003 pasa por rama preexistente) |
| Fase GREEN confirmada | sí (evals 10/10; `npm test` 89/89) |
| Fase REFACTOR confirmada | sí (evals 10/10; `npm test` 106/106; salida del motor idéntica) |
| Archivos de prueba generados | 6 casos TC-005…TC-010 en `evals.json` + 17 fixtures + 10 tests nuevos en `test/memory-system.test.js` |
| Archivos de producción generados | 22 semillas creadas · 12 archivos modificados |
| Modo de ejecución | interactive |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` (`skill-test-evals`): TC-005…TC-010 ← EV-001…EV-006; TC-003 reconvertido de "modo ensure no disponible" a "modo no reconocido" (D-3 lo sustituye); fixtures `examples/{sddf-partial,empty,no-frontmatter}/`. `unit` y `e2e` omitidos por `skill: none`. Rojo confirmado: 6/7 FAIL. |
| GREEN | ✅ | Capa `monolithic` (`skill-master`): subcomando `scaffold` en el motor, árbol semilla `assets/scaffold/` (22 archivos), modos `ensure`/`scaffold`/`rebuild` en `SKILL.md`, §5 en `memory-rules.md`, 10 tests `S096-*`, documentación. Evals 10/10 (4 casos requirieron reejecución por fallo transitorio del CLI headless). |
| REFACTOR | ✅ | Helper `placeFile()` unifica semillas y plantillas compartidas; `assertSeedsCoverLayers()` y `profileOf()` extraídos; constantes de CLI a cabecera; LOW de STORY-095 aplicados (`Object.hasOwn`, `UsageError` por flag sin valor, `--date` validado). Tests con helpers compartidos. Sin regresiones: evals 10/10, `npm test` 106/106, salida de `scaffold` byte a byte idéntica a la línea base. |

## Artefactos producidos

| Acción | Archivo | Componente (design.md) |
|---|---|---|
| crear | `skills/memory-system/assets/scaffold/**` (22 archivos) | Árbol semilla (D-1, D-5) |
| modificar | `skills/memory-system/scripts/memory-system.js` | Subcomando `scaffold` (D-1, D-2, D-4) |
| modificar | `skills/memory-system/SKILL.md` | Modos `ensure`/`scaffold`/`rebuild` (D-3, D-4) |
| modificar | `skills/memory-system/references/memory-rules.md` | §5 "Scaffold y archivos gestionados" (D-4) |
| modificar | `skills/memory-system/assets/index-template.md` | Placeholder `{layer:specs}` (ver desviación 1) |
| modificar | `skills/memory-system/evals/evals.json` | TC-005…TC-010; TC-003 reconvertido; v1.1.0 |
| crear | `skills/memory-system/examples/{sddf-partial,empty,no-frontmatter}/` | Fixtures (17 archivos) |
| modificar | `test/memory-system.test.js` | `S096-UT-001…008`, `S096-UT-001b`, `S096-IT-001` |
| modificar | `skills/header-aggregation/SKILL.md` | Nota D-6 (una línea, sin cambios funcionales) |
| modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | Documentación (D-7, NFR-6, CR-002, CR-003) |
| regenerar | `docs/index.md` | +2 líneas por `{layer:specs}` |

## Desviaciones respecto a design.md

1. **`{layer:specs}` en `assets/index-template.md`**: la semilla `specs/README.md` es obligatoria (D-1), pero la regla de STORY-095 hacía fallar `index` con exit 2 ante un archivo suelto en `specs/`. Sin el placeholder, `ensure` rompería en cualquier proyecto scaffoldeado. El exit 2 se mantiene para `specs/<x>/` desconocidos.
2. **`--force` sobrescribe todos los archivos gestionados** (`preservados: 0`, conforme a D-4); el literal `sobrescritos: 3` que ilustra UT-006 en `testcases.md` no aplica: el test verifica que los 3 archivos editados salen `[SOBRESCRITO]` y que el contador suma todos los gestionados.
3. **`.gitkeep` de `specs/01..03`** solo se crea si el directorio no existe (evita ensuciar `03-stories/` e inflar contadores).
4. Las cifras `creados 5 · preservados 14` de F-1/E2E-001 son ilustrativas: el motor reporta `creados: 16 · preservados: 7` sobre `sddf-partial`. Los `contains` de TC-005 no dependen del número.
5. La salida del motor añade `harness: <h>` y `capas faltantes: …` antes de las marcas (ningún `not_contains` lo prohíbe).
6. `CHANGELOG.md`: los modos se documentan bajo `[3.2.1]`, la misma sección donde el mantenedor situó la entrada de STORY-095 (decisión suya en `b71e9e9`); la inconsistencia "desde 3.3.0" de los textos sigue pendiente de decisión.

## Cobertura de casos de prueba (testcases.md)

| Tipo | Estado | Evidencia |
|---|---|---|
| EV-001…006 | ✅ 6/6 | `npm run test:eval -- memory-system` (10/10 contando los 4 de STORY-095) |
| UT-001…008 | ✅ 8/8 | `node --test test/memory-system.test.js` (27 tests) |
| IT-001…004, E2E-001…004 | ⏳ manual | IT-001/IT-004 y E2E-001…004 cubiertos de facto por EV-001/EV-003/EV-004/EV-005 y por `S096-IT-001`; IT-002 (motor sin `index`) no aplica porque STORY-095 ya está implementada; verificación manual en VERIFY |

## Observaciones

- Cuatro casos (`TC-005`, `TC-007`, `TC-009`, `TC-010`) fallaron en la primera pasada de GREEN con `claude exit 1: sin salida` — fallo transitorio del CLI headless, ya visto en STORY-095. La reejecución con `--concurrency 2` pasó 4/4.
- `STORY-095` quedó commiteada (`84f8ddb`) antes de esta historia; el árbol de trabajo solo contiene los cambios de STORY-096.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | Escenario 1 → EV-001/EV-002; Escenario 2 → EV-003; rebuild sin/con `--force` → EV-004/EV-005; más UT-001…008 sobre el motor. Confirmación E2E manual pendiente en VERIFY. |
| Criterios no funcionales verificados | ✓ | Idempotencia (UT-002, EV-002), preservación (UT-006, UT-007), trazabilidad del informe (marcas + contadores), sin `package.json` (solo `node:`), portabilidad (ejecutado en Windows, rutas normalizadas), documentación (4 docs). |
| Comportamiento coincide con `design.md` | ✓ | Seis desviaciones documentadas arriba, todas justificadas. |
| No hay regresiones | ✓ | `npm test` 106/106; evals 10/10; `index --dry-run` == `docs/index.md` salvo `updated`. |
| Código sigue `constitution.md` | ✓ | `SKILL.md` 314 líneas, `memory-rules.md` 174, motor solo con módulos `node:`, rutas relativas, kebab-case. |
| Sin código comentado ni `TODO` | ✓ | `grep TODO` sin resultados. |
| Sin variables/imports/funciones sin usar | ✓ | Revisado en REFACTOR (`cwd` eliminado de `run`); `verify:syntax` OK. |
| Pasa linter y formateador | ⚠️ | El repo no define linter; `npm run verify:syntax` OK (34 JS). |
| Sin dependencias nuevas | ✓ | Solo `node:fs`, `node:path`, `node:process`. |
| Se usó `skill-master` para el skill | ✓ | Capa `monolithic` vía `skill-master` (GREEN y REFACTOR). |
| Skill incluido en `files` de `package.json` | ✓ | `skills/` completo ya está en `files`. |
| Checklist de Seguridad de IA | ⚠️ | No ejecutado formalmente; sin credenciales ni URLs externas; verificado `ai-no-hidden-characters` (grep sin resultados en `skills/memory-system` y el test). |
| Checklist de Seguridad de Código | ⚠️ | No ejecutado formalmente; sin `eval`/`exec`/shell; escritura confinada a la raíz indicada; ningún modo elimina archivos (UT-007). |
| Checklist de Creación de Skills | ✓ | Frontmatter `name`+`description` (498 chars, `>-`), subdirectorios canónicos, `evals.json` con inputs existentes, referencias enlazadas, < 500 líneas. |

> Los tests deben ejecutarse manualmente para confirmar el resultado final:
> `npm test` · `npm run test:eval -- memory-system` · `/memory-system scaffold --dry-run`.

---

## Pasada de corrección — `fix-directives.md` (2026-09-22)

Segunda pasada sobre la historia, disparada por `code-review-report.md` (`review-status: needs-changes`, severidad máxima MEDIUM). No es un ciclo TDD nuevo: no se regeneró `evals.json` ni se reinvocó ningún generador. Se aplicaron únicamente las correcciones de `fix-directives.md`, dentro de su lista blanca.

### Hallazgos atendidos

| # | Severidad | Estado | Evidencia |
|---|---|---|---|
| 1 | MEDIUM | ✅ resuelto | `skills/memory-system/assets/scaffold/templates/adr-template.md` anota `escritor: autoría manual` en los 8 campos del frontmatter y en las 6 secciones del cuerpo. |
| 2 | MEDIUM | ✅ resuelto | Derivado de #1 (criterio DoD "estándares de `constitution.md`"). |
| 3 | MEDIUM | ⚠️ parcial | `tasks.md` marcado contra evidencia ejecutada: 17/20 tareas `[x]`. T016, T017 y T019 siguen `[ ]` con el motivo anotado (ver abajo). |
| 4 | MEDIUM | ⏳ derivado | Se cierra al re-ejecutar `/story-code-review`. |
| 5 | MEDIUM | ⏳ derivado | Se cierra al re-ejecutar `/story-code-review`. |

### Decisión de diseño registrada

El principio 13 de la constitución ofrece dos remedios para un campo sin escritor —retirarlo, o anotar el skill que pasará a escribirlo en la misma historia— y **ninguno aplica** a `adr-template.md`: retirar los campos vaciaría la plantilla, y ningún skill escribe ADRs ni está previsto que lo haga. Se registra [[ADR-0012-escritor-en-templates-de-autoria-manual]]: un template de autoría humana cumple el principio anotando `escritor: autoría manual`.

Restricción técnica descubierta al aplicarlo: `parseFrontmatter` (`memory-system.js:237`) **no reconoce comentarios finales de línea**. La forma inline que usa `story-template.md` habría producido como valor literal el título con sus comillas y el comentario pegado, porque `unquote` solo actúa si el valor empieza y termina por comilla.

La capa `templates/` está excluida del índice (`memory-rules.md` §2), así que la copia scaffoldeada no se indexa — pero **`docs/adr/adr-template.md` sí**, por vivir en la capa `adr/`, y ADR-0012 exige mantener ambas copias byte a byte idénticas. Por eso las anotaciones van en **comentario de línea completa** encima del campo, forma que el parser ya ignora. `story-template.md` no sufre el problema porque vive en los assets de un skill, fuera de `SPECS_BASE`.

Verificado: `parseFrontmatter` sobre la plantilla anotada devuelve exactamente los mismos 8 valores que antes de anotar (`title` limpio, sin comillas ni comentario). Ningún índice cambia.

De paso se cierra el hallazgo LOW de deriva entre copias: la semilla y `docs/adr/adr-template.md` quedan byte a byte idénticas.

### Artefactos modificados

| Acción | Archivo | Hallazgo | En lista blanca |
|---|---|---|---|
| modificar | `skills/memory-system/assets/scaffold/templates/adr-template.md` | #1, #2 | sí |
| modificar | `docs/adr/adr-template.md` | #1 (sincronía byte a byte) | sí (`docs/adr/`) |
| crear | `docs/adr/ADR-0012-escritor-en-templates-de-autoria-manual.md` | #1 | sí (`docs/adr/`) |
| modificar | `skills/memory-system/references/memory-rules.md` §5 | #1 | sí |
| modificar | `docs/specs/03-stories/STORY-096-*/tasks.md` | #3 | sí |

`memory-rules.md` §5 afirmaba que las semillas "no declaran `escritor:` (son documentos iniciales, no plantillas de generación)" — la afirmación que originó la omisión. Ahora lleva la excepción explícita de `adr-template.md`, la única semilla que sí es plantilla de generación.

### Verificación ejecutada

| Comando | Resultado |
|---|---|
| `npm test` | ✅ 106/106 (antes y después de los cambios) |
| `npm run verify:syntax` | ✅ 34 archivos JavaScript |
| `npm run verify:links` | ✅ 37 archivos Markdown; enlaces y anclas resuelven |
| `npm run verify:eval-inventory` | ✅ 33 skills; 8 excepciones explícitas |
| `npm run verify:config` | ✅ contrato de configuración válido |
| `npm run verify:repository` | ✅ contenido publicable + smoke del tarball (4 runtimes) |
| `npm run test:eval -- memory-system` | ✅ 10/10 (TC-001…TC-010) tras los cambios, sin reejecuciones |

> Nota: `sddf.config.yaml` declara los comandos de prueba bajo `verify:`, no bajo `defaults:`. Se usó `verify.eval.command` (`npm run test:eval`) como comando de confirmación del tipo `eval`.

### Trabajo que estuvo fuera de la lista blanca — cerrado

Durante la pasada de corrección, T016 y T017 quedaron parciales porque completarlas exigía tocar archivos que `fix-directives.md` no autorizaba. **Ambas se cerraron después, el 2026-09-22**, y `tasks.md` las registra `[x]` con su nota de cierre. Estado verificado en el árbol:

| Tarea | Estado | Verificación |
|---|---|---|
| **T016 — `CHANGELOG.md`** | ✓ cerrada | Las entradas de `memory-system` (3 Added, 3 Changed, 1 Deprecated) están bajo `## 3.3.0 [Unreleased]`. En `## [3.2.1] — 2026-09-21` solo queda la nota que explica el traslado: el tag `v3.2.1` (commit `d335738`) no contiene ningún archivo de `skills/memory-system/`. El encabezado `[3.2.1]` se conserva porque `scripts/verify-release.js` exige exactamente una sección de la versión actual. |
| **T017 — `docs/product/` y `docs/requirements/`** | ✓ cerrada | `ensure` se ejecutó sobre este repositorio (previo `scaffold --dry-run`): 8 creados, 0 sobrescritos, 13 preservados. Existen `product/{README,vision,stakeholders,objectives}.md` y `requirements/README.md`, más `runbooks/README.md`, `specs/README.md` y `templates/adr-template.md`, que el mismo árbol semilla crea. |

Con esto, el hallazgo LOW de `code-review-report.md` (desviación 6, "pendiente de decisión del mantenedor") queda resuelto.

**T019** permanece `[ ]` por diseño: es verificación manual de extremo a extremo en un directorio temporal, propia de la fase VERIFY (`/story-verify`), no de IMPLEMENT.

### DoD IMPLEMENT — reevaluación

| Criterio | Estado | Observación |
|---|---|---|
| Escenarios Gherkin pasan | ✓ | Sin cambios respecto a la primera pasada; `npm test` 106/106. |
| Criterios no funcionales verificados | ✓ | Idempotencia, preservación, trazabilidad, portabilidad y documentación sin cambios. |
| Comportamiento coincide con `design.md` | ✓ | La pasada no altera el motor; solo contenido de plantilla y documentación. |
| Sin regresiones | ✓ | 106/106 y las cinco verificaciones deterministas en verde tras los cambios. |
| Código sigue `constitution.md` | ✓ | **Corregido:** principio 13 satisfecho vía ADR-0012. Era el ❌ que bloqueaba el code review. |
| Sin código comentado ni `TODO` | ✓ | Sin cambios. |
| Sin variables/imports/funciones sin usar | ✓ | Sin cambios (los 6 exports sin consumidor siguen siendo un LOW abierto). |
| Pasa linter y formateador | ⚠️ | El repo no define linter; `verify:syntax` OK. |
| Sin dependencias nuevas | ✓ | Ninguna. |
| Se usó `skill-master` para el skill | ✓ | Sin cambios respecto a la primera pasada. |
| Skill incluido en `files` de `package.json` | ✓ | `skills/` completo; confirmado por `verify:repository`. |
| Checklist de Seguridad de IA | ✓ | **Cerrado:** el Security-Reviewer del code review evaluó 71 reglas de ambos checklists con máximo LOW. |
| Checklist de Seguridad de Código | ✓ | Ídem. |
| Checklist de Creación de Skills | ✓ | Sin cambios. |
| Skills críticos tienen `evals/evals.json` | ✓ | 10 casos; `verify:eval-inventory` en verde. |
| **`tasks.md` con todas las tareas `[x]`** | ❌ | **Bloqueante.** 17/20 marcadas. T016 y T017 exigen archivos fuera de la lista blanca; T019 corresponde a VERIFY. |
| README/docs actualizados si cambian contratos | ✓ | Arquitectura §3/§10, guía §0, README. |
| Decisiones de diseño no previstas documentadas | ✓ | ADR-0012 y la excepción en `memory-rules.md` §5. |
| CHANGELOG actualizado si aplica | ⚠️ | La entrada existe pero bajo `[3.2.1]`; ver T016. |
| Build de CI pasa | ⚠️ | No evaluable localmente; las verificaciones deterministas del repo pasan. |
| Sin secrets ni credenciales expuestos | ✓ | Confirmado por el Security-Reviewer (cero coincidencias en el alcance). |

**`$DOD_BLOQUEADO = true`** en el momento de escribir esta sección. Resuelto más abajo, en "Cierre de la pasada de corrección".

Para desbloquear hace falta una decisión del mantenedor sobre T016 y T017. Resueltas esas dos, la historia pasa a `IMPLEMENT/DONE` y `/story-code-review STORY-096` debería cerrar en `approved`: el único hallazgo MEDIUM de agente ya está corregido.

---

## Cierre de la pasada de corrección (2026-09-22, misma sesión)

Con aprobación explícita se completó el trabajo que antes quedaba fuera de la lista blanca.

### T016 — CHANGELOG reubicado

La investigación cambió el diagnóstico: no era solo la entrada de STORY-096 la que estaba mal situada, sino **todo el cuerpo de la sección `[3.2.1]`**. Evidencia contra el repositorio:

- `git ls-tree -r v3.2.1 | grep skills/memory-system` → **0 coincidencias**. El tag publicado como 3.2.1 no contiene el skill.
- El commit del tag (`d335738`, "3.2.1") toca **solo** `package.json` y `package-lock.json`.
- `git show v3.2.1:CHANGELOG.md` → la sección `## [3.2.1]` **no existía**; se añadió después, en `b71e9e9` ("doc: fix changelog").

Se movieron a `3.3.0 [Unreleased]` las 3 entradas `Added`, 3 `Changed` y 1 `Deprecated`. El encabezado `## [3.2.1] — 2026-09-21` se **conserva** porque `scripts/verify-release.js` exige exactamente una sección con la versión de `package.json` y formato `## [X.Y.Z] — YYYY-MM-DD`; queda con una nota de publicación de mantenimiento. Sin pérdida de contenido: 174 entradas `- **` antes y después. `verify:release` y `verify:links` en verde.

### T017 — `ensure` ejecutado sobre este repositorio

Revisado primero con `scaffold --dry-run` como pide la tarea. Resultado real: **creados 8 · sobrescritos 0 · preservados 13**.

| Creado | Nota |
|---|---|
| `docs/product/{README,vision,stakeholders,objectives}.md` | el objetivo explícito de T017 |
| `docs/requirements/README.md` | ídem |
| `docs/runbooks/README.md`, `docs/specs/README.md` | también faltaban; los crea el mismo árbol semilla |
| `docs/templates/adr-template.md` | la plantilla recién anotada |

Después, `index` regeneró `docs/index.md`: 237 nodos, 42 sin frontmatter, 31 pendientes. **Ningún archivo sobrescrito ni eliminado.**

### T019 — verificación de extremo a extremo

Ejecutada en un directorio temporal (`mktemp -d`), sin tocar el repositorio: **13/13 PASS**. Cubre proyecto vacío → 11 capas + `constitution.md` + 6 plantillas + `index.md`; idempotencia (`creados: 0`); `scaffold` no altera el hash de `index.md`; sin `--force` ningún hash cambia; con `--force` se restaura `constitution.md` editado a mano mientras `ADR-0001-x.md` y `STORY-001-a/story.md` conservan su hash y el recuento de archivos no baja (27 → 27); `--dry-run` no escribe; el motor rechaza `rebuild` con exit 2, confirmando que el gate `--force` vive en `SKILL.md` (D-4).

Queda para `/story-verify` la mitad que exige un LLM ejecutando el skill: `ensure --fix-frontmatter` invocando `header-aggregation` en batch (AC-8, hoy cubierta por el eval TC-010) y los literales de `rebuild` que emite `SKILL.md` (TC-008/TC-009).

### Corrección a la justificación de ADR-0012

La primera redacción afirmaba que una anotación inline contaminaría "el índice de cada proyecto scaffoldeado". **Es inexacto:** la capa `templates/` es una exclusión explícita del índice (`memory-rules.md` §2, "sus wikilinks son placeholders"), así que la copia scaffoldeada nunca se indexa. El vector real es `docs/adr/adr-template.md`, que **sí** se indexa por vivir en la capa `adr/` — aparece en `docs/index.md:288`. Como ADR-0012 exige mantener ambas copias byte a byte idénticas, la forma de anotación debe ser segura para la copia indexada, así que la decisión (comentario de línea completa) no cambia. ADR-0012 y este informe quedan corregidos.

Confirmado sobre el índice realmente regenerado: la entrada sigue limpia, sin comillas ni comentario filtrado.

### Verificación final

| Comando | Resultado |
|---|---|
| `npm test` | ✅ 106/106 |
| `npm run test:eval -- memory-system` | ✅ 10/10 (TC-001…TC-010) |
| `verify:syntax` · `verify:links` · `verify:eval-inventory` · `verify:config` · `verify:release` · `verify:repository` | ✅ las seis |
| T019 en directorio temporal | ✅ 13/13 |

### DoD IMPLEMENT — estado final

`tasks.md` queda con **21/21 tareas `[x]` y 0 pendientes**, que era el único criterio en `❌`. Los dos `⚠️` restantes no son bloqueantes: el repositorio no define linter (`verify:syntax` cubre la sintaxis) y el build de CI no es evaluable localmente.

**`$DOD_BLOQUEADO = false` → `story.md` pasa a `IMPLEMENT/DONE`.**

El hallazgo MEDIUM que bloqueaba el code review (principio 13) está resuelto, y los hallazgos LOW de CHANGELOG y de deriva entre copias de `adr-template.md` también. Siguiente paso: `/story-code-review STORY-096`.

### Pendiente de revisión humana — cambios de origen desconocido

`skills/project-policies-generation/SKILL.md` aparece modificado sin que esta sesión lo tocara (mtime 19:57, posterior a las ediciones propias). El cambio invierte la migración del DoD que el propio CHANGELOG documenta:

```
- $SPECS_BASE/guardrails/dod-story-checklist.md no existe. ¿Cómo deseas crearlo?
+ $SPECS_BASE/policies/definition-of-done-story.md no existe. ¿Cómo deseas crearlo?
```

Apunta a la ruta antigua y además duplica el prefijo (`$SPECS_BASE` ya resuelve a `docs`). Es el mismo patrón que los seis `analyze.md` revertidos en esta sesión. No se revierte: queda fuera del alcance aprobado.

---

## Segunda ronda de review — plantillas de autoría manual (2026-09-23)

`/story-code-review STORY-096` devolvió `needs-changes` con un único `MEDIUM`, detectado de forma independiente por el Tech-Lead-Reviewer y el Integration-Reviewer: el árbol semilla tenía **22 archivos y no los 19** declarados, por tres plantillas —`templates/{domain,guardrail,policy}-template.md`— añadidas en el commit `911a188` sin documentar.

**Decisión del autor: las tres se quedan.** Se añadieron a mano de forma deliberada porque las considera necesarias. El hallazgo no era que existieran, sino que estaban sin documentar y contradecían cuatro reglas escritas por la propia historia: `listSeeds()` recorre el árbol sin filtro, así que `scaffold` las copia a `docs/templates/` de **todo** proyecto consumidor mientras `memory-rules.md` §5 afirmaba que su lista era "lo único" que `rebuild --force` sobrescribe, y el `README.md` de la semilla decía "Las seis plantillas base son…".

### El precedente que resuelve el caso

El `fix-directives.md` afirmó en su primera versión que documentarlas obligaba a "resolver su conflicto con ADR-0001". **Es incorrecto** y se retiró:

- **ADR-0001 está `SUPERSEDED` por ADR-0007**, que conserva su regla de propiedad y solo cambia la ubicación. La cita de `memory-rules.md` §5 se corrigió para apuntar a ADR-0007.
- **ADR-0012 ya cubre exactamente este caso**: *"Un template cuyos campos no escribe ningún skill satisface el principio 13 anotando `escritor: autoría manual`"*, y llama a `adr-template.md` *"el **primer** template bajo esta regla"*. Estas tres son el segundo, tercero y cuarto. No había conflicto que resolver, había un precedente que aplicar.

### Cambios aplicados

| # | Acción | Archivos |
|---|---|---|
| a | Anotación `escritor: autoría manual` según ADR-0012 | `policy-template.md` (4 campos declarados + 8 secciones), `guardrail-template.md` (5 secciones), `domain-template.md` (13 secciones) |
| b | Frontmatter canónico (`type`, `slug`, `title`); eran las únicas semillas `.md` sin él | Los tres |
| c | Cuatro listas de archivos gestionados: "seis plantillas" → nueve, más la corrección ADR-0001 → ADR-0007 | `memory-rules.md` §5, `SKILL.md` (§3.3 y *Salida*), `docs/architecture/memory-system.md` (§3 árbol y §10), `assets/scaffold/templates/README.md` |
| e | Conteos e inventario | Este informe (19 → 22 semillas), `CHANGELOG.md`, `evals.json` (3 descripciones que enumeraban el estado esperado) |
| f | Sincronización de `docs/templates/` del framework, que no las tenía | `docs/templates/{domain,guardrail,policy}-template.md` |
| g | **Aserción de exhaustividad** del árbol semilla | `S096-UT-001c` en `test/memory-system.test.js` |

**`evals.json` se sumó al alcance sobre la marcha**: tres descripciones enumeraban "las seis plantillas" como parte del estado esperado. Documentar nueve en todas partes y dejar los evals en seis solo habría movido la inconsistencia de sitio.

### Por qué los tests no lo detectaron, y qué lo impide ahora

`SIX_TEMPLATES` comprobaba **presencia**, no exhaustividad: verificaba que las seis plantillas estuvieran, no que no hubiera más. `S096-UT-001c` compara ahora el conjunto exacto de archivos de `assets/scaffold/` contra la lista declarada, y verifica además que las cinco plantillas compartidas **no** viajen en la semilla (se copian desde su skill dueño, ADR-0007). Un archivo añadido sin documentar rompe ese test.

La constante pasa a `NINE_TEMPLATES`, con `MANUAL_TEMPLATES` como subconjunto de las cuatro sin dueño.

### Acción d — CR-004 en `design.md`

Registrado con el rationale del autor: **las tres plantillas son parte del estándar que todo proyecto SDDF debe recibir**, no material de un consumidor concreto. El argumento encaja con el modelo de capas: `domains/`, `guardrails/` y `policies/` son tres de las once capas de memoria y eran las únicas de autoría humana que el scaffold creaba **sin** una plantilla con la que empezar a escribir — el proyecto recibía el `README.md` de la capa pero ninguna guía de estructura para su primer artefacto.

CR-004 amplía D-1 y D-2 de seis a nueve y deja explícitos los dos grupos por origen: cinco compartidas copiadas en runtime desde su skill dueño (ADR-0007) y cuatro de autoría manual que viajan en la semilla por no tener dueño (ADR-0012). El encabezado de D-2 y la lista de D-7 quedan alineados.

Con esto, las siete acciones de `fix-directives.md` están aplicadas.
