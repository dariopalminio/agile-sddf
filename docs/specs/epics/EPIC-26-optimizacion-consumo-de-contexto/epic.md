---
type: epic
id: EPIC-26
slug: EPIC-26-optimizacion-consumo-de-contexto
title: "Optimización del consumo de contexto"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-20
updated: 2026-10-20
related: []
---

# Épica: Optimización del consumo de contexto

## Alcance

Reducir el contexto que consume una sesión del harness, que hoy está entre 125K y 140K tokens en `/story-implement`. La primera meta es bajar de 125K (unos 85K estimados) y la segunda, de 65K. Los subagentes pasarán a recibir la ruta del skill en lugar de su contenido. Los SKILL.md grandes primero se comprimirán, eliminando texto redundante, plantillas y reglas globales repetidas y resumiendo la prosa en listas o tablas, y después se dividirán en un núcleo más `references/` por fase; la meta es reducir el tamaño total del skill, no solo el de su núcleo. Los artefactos y los índices tendrán un tamaño máximo y la resolución de raíz pasará a un script. Para que el problema no vuelva, se añaden linters y gates deterministas a `verify:repository`. Origen: informe de optimización del consumo de contexto (`.temp/propuestas-de-mejoras/optimization-report.md`).

## Historias

- **Medición del presupuesto de contexto**: Script que estima los tokens de una sesión de orquestador (`/story-implement` como referencia) a partir de los archivos que carga, a razón de unos 3,7 bytes por token, con desglose por componente y una línea base registrada antes de los cambios
- **ADR de invocación por ruta**: ADR nuevo que reemplaza a ADR-0002 (`superseded-by`). El orquestador pasa `skill_path` y el subagente lee el SKILL.md en su propio contexto limpio
- **Orquestadores con invocación por ruta**: Aplicar el nuevo contrato en `story-implement` y en los demás orquestadores que hoy leen un SKILL.md y lo pegan íntegro en el prompt del subagente
- **Retorno compacto de subagentes**: Los subagentes devuelven al orquestador un `results.json` de 20 líneas o menos en `.tmp/<skill-name>/`, nunca el log completo de pruebas o herramientas
- **Limpieza del catálogo**: Eliminar las instalaciones obsoletas `.claude/skills/project-policies-generation` y `.claude/skills/story-fix`, retirar `docs-wiki-builder` de `skills/` (lo sustituye `memory-system`), planificar el retiro del alias `story-improve` según su deprecación y documentar `skillOverrides: name-only` como decisión explícita
- **Lectura acotada de archivos grandes**: AGENTS.md prohíbe leer `graphify-out/GRAPH_REPORT.md` completo (solo `graphify query`/`path`/`explain`) y fija leer por `offset`/`limit` los archivos de más de 300 líneas
- **Guía de redacción comprimida de skills**: Reglas en `docs/guides/best-practices-for-skills.md` y checklist de compresión que se aplica antes de cada división: una instrucción por línea en imperativo, el "por qué" solo cuando cambia la conducta, nada repetido de las plantillas de `assets/`, de las reglas globales (AGENTS.md, constitución, DoD) ni de la resolución de raíz, ejemplos solo cuando cambian la conducta, tablas en lugar de párrafos para parámetros, errores y transiciones, y sin secciones de cierre que resuman el flujo ya descrito (`## Resumen`, `## Arquitectura de delegación`)
- **Núcleo de story-implement**: Comprimir y dividir `story-implement/SKILL.md` (1260 líneas, 80 KB) en un núcleo de 120 líneas o menos con `references/red.md`, `green.md`, `refactor.md`, `rework.md` y `report.md`, que se cargan solo al entrar en cada fase. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-implement-tasks**: Comprimir y dividir `story-implement-tasks/SKILL.md` (828 líneas) en un núcleo de 120 líneas o menos con `references/context.md` (resolución de entrada y carga del contexto de planning), `references/tdd-loop.md` (implementación de tareas en orden TDD) y `references/report.md`, y mover la plantilla de `implement-report.md`, hoy incrustada en el SKILL.md, a `assets/`. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-analyze**: Comprimir y dividir `story-analyze/SKILL.md` (709 líneas) en un núcleo de 120 líneas o menos más `references/` por fase; el núcleo remite a `assets/analyze-report-template.md` sin repetir su estructura. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-code-review**: Comprimir y dividir `story-code-review/SKILL.md` (697 líneas) en un núcleo de 120 líneas o menos más `references/` para la delegación en subagentes, el rework y el reporte; el núcleo remite a sus plantillas de `assets/` sin repetir su estructura. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-verify**: Comprimir y dividir `story-verify/SKILL.md` (596 líneas) en un núcleo de 120 líneas o menos más `references/` por modo de verificación (unit, e2e, manual); el núcleo remite a `assets/verify-report-template.md` sin repetir su estructura. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-acceptance**: Comprimir y dividir `story-acceptance/SKILL.md` (557 líneas) en un núcleo de 120 líneas o menos más `references/` para la sesión de validación y el reporte; el núcleo remite a `assets/acceptance-report-template.md` sin repetir su estructura. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de story-design**: Comprimir y dividir `story-design/SKILL.md` (565 líneas) en un núcleo de 120 líneas o menos más `references/` por fase, alineado con el tope de 200 líneas de design.md. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Núcleo de memory-system**: Comprimir y dividir `memory-system/SKILL.md` (554 líneas) en un núcleo de 120 líneas o menos más un archivo de `references/` por modo (`ensure`, `scaffold`, `rebuild`, `index`, `check`, `migrate`), junto a las reglas que ya viven en `references/`. Tras comprimir, el núcleo más `references/` ocupa al menos un 40 % menos de bytes que el SKILL.md original, y la regresión se valida con `npm run test:eval -- <skill>` a criterio humano
- **Tope de design.md y lectura por sección**: Limitar design.md a 200 líneas, con un resumen inicial y secciones con ancla. Los skills que lo consumen leen primero el resumen y después solo las secciones que necesitan
- **Script de resolución de raíz**: Script determinista que devuelve `SPECS_BASE` y `ROOT_SOURCE` en JSON y sustituye el bloque `SDDF-ROOT-RESOLUTION` copiado en cada SKILL.md por una línea de referencia, manteniendo coherente `audit-root-resolution.js`
- **Índices compactos**: `docs/index.md` de 80 líneas o menos con índices por capa, y `README.md` reducido que delega el detalle en `docs/`
- **Linter de tamaño**: Gate en `verify:repository` que avisa si un SKILL.md supera 150 líneas y da error si supera 300 (con una baseline temporal que solo puede bajar), da error en `references/*.md` por encima de 500 líneas, avisa en descripciones de más de 350 caracteres y mantiene una baseline de bytes totales por skill (SKILL.md más `references/`) que solo puede bajar, para que mover texto a `references/` no cuente como mejora
- **Linter de duplicación**: Gate en `verify:repository` que detecta párrafos largos repetidos en 3 o más SKILL.md y exige moverlos a `references/` o a un script
- **Gates de WIP y ADR inmutables**: Scripts en `verify:repository` que comprueban que no haya más de un ítem con `substatus: IN-PROGRESS` por nivel en `docs/specs/`, y que un ADR `ACCEPTED` solo cambie en `status`, `superseded-by` y la nota de reemplazo. Los WIP Limits deben ser configurables en un solo lugar de forma determinista.
- **Higiene de skills**: Reescribir en positivo las instrucciones en negativo, traducir los "MUST" al español, añadir `## Salida` a `epic-from-project-plan`, `header-aggregation`, `sddf-init` y `skill-preflight`, y mover `story-code-review/agents/` y `story-verify/agents/` a `assets/agents/` (ADR-0014)

## Criterios de salida

- [ ] **CS-1** — Existe un script de medición del presupuesto de contexto que reporta, por componente, la línea base y el valor final de una sesión de `/story-implement`.
- [ ] **CS-2** — Meta 1: la sesión estimada de `/story-implement` consume menos de 125K tokens.
- [ ] **CS-3** — Meta 2: la sesión estimada de `/story-implement` consume menos de 65K tokens.
- [ ] **CS-4** — Hay un ADR aceptado que reemplaza a ADR-0002, y ADR-0002 declara `status: SUPERSEDED` y `superseded-by`.
- [ ] **CS-5** — Ningún orquestador incluye el contenido de un SKILL.md en el prompt de un subagente; solo le pasa `skill_path`.
- [ ] **CS-6** — Los ocho SKILL.md divididos (`story-implement`, `story-implement-tasks`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`, `story-design` y `memory-system`) tienen 120 líneas o menos cada uno, y ningún SKILL.md supera 500 líneas.
- [ ] **CS-7** — `npm run verify:repository` falla si un SKILL.md supera el umbral de error, si un `references/*.md` supera 500 líneas, si un párrafo largo se repite en 3 o más SKILL.md, si hay más de un `IN-PROGRESS` por nivel o si un ADR `ACCEPTED` cambia fuera de lo permitido.
- [ ] **CS-8** — El catálogo no contiene `project-policies-generation`, `story-fix` ni `docs-wiki-builder`, y la decisión sobre `skillOverrides: name-only` está documentada.
- [ ] **CS-9** — AGENTS.md prohíbe la lectura completa de `GRAPH_REPORT.md` y la de archivos de más de 300 líneas sin `offset`/`limit`.
- [ ] **CS-10** — Ningún SKILL.md contiene el bloque de resolución de raíz copiado; todos remiten al script, y `audit-root-resolution.js` pasa.
- [ ] **CS-11** — `docs/index.md` tiene 80 líneas o menos, y design.md queda limitado a 200 líneas en el template y en la validación.
- [ ] **CS-12** — Todos los skills declaran `## Salida`, sus agentes locales están en `assets/agents/` y ningún SKILL.md usa "MUST".
- [ ] **CS-13** — `npm run verify:repository` y `npm test` pasan.
- [ ] **CS-14** — Cada uno de los ocho skills divididos reduce su tamaño total (SKILL.md más `references/`) en un 40 % o más de bytes respecto de la línea base de CS-1.
- [ ] **CS-15** — El script de medición de CS-1 reporta los bytes cargados en un recorrido típico de `/story-implement` (núcleo más las `references/` de RED, GREEN, REFACTOR y reporte), no solo los del núcleo.

## Smoke tests

### SMOKE-1 — Sesión de story-implement dentro de la meta
```gherkin
Escenario: La sesión estimada de story-implement queda por debajo de la meta de contexto
  Dado el framework con las historias de esta épica implementadas
  Cuando se ejecuta el script de medición del presupuesto de contexto sobre una sesión de /story-implement
  Entonces el total estimado es menor de 125K tokens
  Y ningún componente individual supera 25K tokens
```

### SMOKE-2 — El subagente recibe la ruta del skill
```gherkin
Escenario: Un orquestador delega en un subagente sin incrustar el skill
  Dado story-implement en la fase GREEN
  Cuando lanza el subagente generador de código
  Entonces el prompt del subagente contiene skill_path y el contexto de invocación
  Y no contiene el contenido del SKILL.md delegado
  Y el subagente devuelve un results.json de 20 líneas o menos
```

### SMOKE-3 — El gate bloquea un SKILL.md sobredimensionado
```gherkin
Escenario: verify:repository rechaza un skill que supera el umbral de tamaño
  Dado un SKILL.md que supera el umbral de error y no está en la baseline
  Cuando se ejecuta npm run verify:repository
  Entonces el gate falla e indica el archivo y su número de líneas
```

### SMOKE-4 — El gate bloquea la violación de WIP = 1
```gherkin
Escenario: verify:repository rechaza dos historias en curso a la vez
  Dado dos story.md con substatus IN-PROGRESS en docs/specs/stories/
  Cuando se ejecuta npm run verify:repository
  Entonces el gate falla e indica los dos ítems en conflicto
```

## Notas

- **Origen:** `docs\specs\epics\EPIC-26-optimizacion-consumo-de-contexto\context-optimization-report.md` (no versionado). 
- **Problema a resolver:** el consumo de contexto excesivo en las sesiones de algunos skills (como `/story-implement` e `/story-implement-tasks`) limita el desarrollo con LLMs locales, aumenta el costo de cuota de suscripciones y aumeta la probabilidad de compactaciones de sesiones, afectando la eficiencia y escalabilidad del desarrollo con este harness.
- **Cifras verificadas el 2026-10-20:** 21 SKILL.md superan 300 líneas y 8 superan 500 (también `story-acceptance`, con 557, y `memory-system`, con 554). `README.md` tiene 484 líneas, `docs/index.md` 504 y `GRAPH_REPORT.md` unos 380 KB.
- **Decisión: reglas solo como gates.** Las reglas deterministas (tamaño, duplicación, WIP = 1, ADR inmutables) se implementan como scripts multi-runtime en `verify:repository`. No se configuran hooks `PreToolUse` porque acoplarían el harness al runtime Claude. La prohibición de lecturas grandes queda como regla en AGENTS.md.
- **Umbral de 300 líneas con baseline (ratchet):** si el error entrara en vigor de golpe, rompería el gate en 21 skills. El linter parte de una baseline con los incumplimientos actuales que solo puede reducirse; un skill nuevo o uno que crezca falla.
- **ADR inmutables:** el gate debe permitir los cambios que `docs/adr/README.md` autoriza en un ADR `ACCEPTED` (`status`, `superseded-by` y la nota de reemplazo bajo el título), porque el reemplazo de ADR-0002 los necesita.
- **Decisión abierta (script de raíz):** con ADR-0014 los skills son independientes y se instalan en otros proyectos. Hay que decidir si el script de resolución de raíz se distribuye en cada skill o se invoca vía `CLI_ROOT`/`npx agile-sddf`.
- **Decisión: comprimir antes de dividir.** Dividir sin comprimir solo aplaza la carga: un orquestador que recorre todas sus fases, como `/story-implement` (RED → GREEN → REFACTOR → reporte), termina cargando casi todas sus `references/`, y el ahorro sería casi nulo. Por eso las historias de núcleo miden el tamaño total del skill (CS-14) y la medición cuenta lo cargado en un recorrido típico (CS-15). El objetivo del 40 % es provisional y se ajusta tras registrar la línea base.
- **Orden sugerido:** medición → ADR y orquestadores por ruta → limpieza y lectura acotada (Meta 1) → guía de redacción comprimida → compresión y división de skills, tope de design.md, script de raíz y retorno compacto (Meta 2) → linters y gates.
