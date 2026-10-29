---
alwaysApply: false
type: design
id: STORY-126
slug: STORY-126-operar-validacion-epica-segura-design
title: "Design: Operar la validación de épicas de manera segura"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-126
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-126-operar-validacion-epica-segura
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-137-controlar-detalle-ejecucion-validacion-epica
  - STORY-169-suites-de-integracion-y-regresion-de-la-epica
---

<!-- Referencias -->
[[STORY-126-operar-validacion-epica-segura]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]] · [[STORY-125-validar-evidencia-operativa-epica]] · [[STORY-137-controlar-detalle-ejecucion-validacion-epica]]

## Context

`/epic-validate` es el gate de la fase `VALIDATE` de EPIC-23. Tres historias ya diseñadas (todas `READY-FOR-IMPLEMENT/DONE`) definen qué evalúa; esta historia define **cómo se invoca y qué efectos tiene cada ejecución** (CS-7 y la parte de CS-10 sobre `--mode manual`, `--mode auto` y `--dry-run`).

Estado verificado en el filesystem (2026-10-29):

- **Skill base:** `skills/epic-validate/` aún no existe (`ls skills/`). STORY-124 lo crea con `SKILL.md` (Pasos 0–6: layout, argumentos y épica, `EST-01`, `EST-02`, veredicto y motivos, template y escritura, salida en consola), `references/story-sources.md`, el template seed `assets/epic-validate-report-template.md` y `evals/evals.json` (TC-001…TC-005). Su D-7 rechaza **todo** argumento distinto de `<epica>` con `❌ Argumento no reconocido: <arg>` y fin sin escribir, «hasta que STORY-126/137 amplíen la lista de flags».
- **Evidencia operativa:** STORY-125 agrega `OPE-01` (smoke tests), `OPE-02` (`npm run verify:release`) y `OPE-03` (DoD de épica) y un paso «Modo de evidencia» (su C1/T008) que acepta `--mode auto|manual` y, sin `--mode`, fija `MODO = auto` si `sddf.config.yaml › verify.e2e-smoke.command` está declarado y `MODO = manual` si no. En auto nunca pregunta; en manual nunca ejecuta smoke tests, pero sí `verify:release` (su CNF-2). Delega en esta historia el mensaje ante valores inválidos y `--dry-run` (su D-6).
- **Suites de épica:** STORY-169 agrega suites en `--mode auto` y ya usa el resultado `no ejecutada` (sin efecto en el veredicto) para las suites en `--mode manual`. Su AC-1 exige registrar en el reporte la duración de cada suite con un decimal; STORY-125 T012 hace lo mismo con `OPE-02`.
- **Motor de comandos:** todo comando de verificación se ejecuta con `node <CLI_ROOT>/skills/epic-validate/scripts/epic-suites.js check-command` (STORY-169 I1, reutilizado por STORY-125 D-8). Es el **único** punto de ejecución de comandos del skill.
- **Retorno estructurado existente (P3):** `skills/epic-analyze/SKILL.md` Paso 9 cierra el modo Agent con un bloque fijo `STATUS: OK|FAIL` · `VEREDICTO:` · `HALLAZGOS:` · `REPORTE:` y `MOTIVO:` ante fallo. Allí `STATUS: OK` significa «el skill corrió», no «la épica aprobó».
- **Previsualización existente (P3):** `skills/memory-system/SKILL.md` define `--dry-run` como «imprime el plan o el índice, no escribe», con cabecera y formas condicionales. Es el precedente de imprimir el contenido completo en consola en lugar de escribirlo.
- **Comandos ejecutados:** `scripts/verify-release.js` no escribe archivos (`grep writeFile|mkdir|appendFile` sin coincidencias).
- **Mecanismo:** el skill es Markdown ejecutado por el agente (STORY-124 D-1); no hay proceso propio cuyo código de salida pueda leer quien lo invoca.

## Goals / Non-Goals

**Goals:**
- Reconocer `--mode auto`, `--mode manual` y `--dry-run` en cualquier orden, y rechazar sin escribir todo valor o argumento no reconocido informando los valores válidos de `--mode` // satisface: AC-1, AC-3, CS-10
- Hacer que `--mode auto` nunca pregunte y que `--mode manual` sea interactivo, de modo que el primero se pueda invocar desde una automatización // satisface: AC-1
- Ejecutar `--dry-run` como una evaluación sin escrituras, sin comandos y sin confirmaciones, que imprime el reporte completo que se escribiría // satisface: AC-2, CNF-2
- Cerrar toda ejecución (también los errores de invocación) con un bloque de resultado legible por una automatización que distingue éxito de fallo sin leer el reporte // satisface: AC-1, AC-3
- Garantizar que fuera de `--dry-run` el único archivo escrito es `<EPIC_DIR>/epic-validate-report.md` // satisface: AC-1, AC-4, CNF-2, CS-7
- Hacer el reporte determinista: dos ejecuciones equivalentes solo difieren en los datos de la ejecución (fecha de evaluación y duraciones medidas) // satisface: AC-4, CNF-1

**Non-Goals:**
- Comprobaciones estructurales u operativas nuevas, y la fuente de evidencia de cada modo (STORY-124, STORY-125, STORY-169).
- `--verbose` y el rechazo de `--mode auto` sin pruebas configuradas (STORY-137).
- Cambiar el estado de la épica o integrar el veredicto en la transición (STORY-127).
- Documentar o publicar el skill en guías (STORY-127); evals de cobertura CS-9 (STORY-128).
- Un motor Node para el parseo de argumentos o para emitir un código de salida (D-2).

## Decisions

### Componentes

Todos modifican artefactos que crea STORY-124 (CR-002). No se crean archivos nuevos.

| # | Componente | Acción | Ubicación | Responsabilidad única | AC que satisface |
|---|---|---|---|---|---|
| C1 | Paso 1 «Argumentos» | modificar | `skills/epic-validate/SKILL.md` (Paso 1 de STORY-124) | Parsear la invocación a `{ epica, modoFlag, dryRun }` y rechazar lo no reconocido antes de leer ningún archivo | AC-1, AC-3, CS-10 |
| C2 | Paso «Modo de evidencia» | modificar | `skills/epic-validate/SKILL.md` (paso C1 de STORY-125) | Resolver `MODO` (`auto` \| `manual`) y su origen (`flag` \| `regla por defecto`) a partir de `modoFlag` | AC-1 |
| C3 | Sección «Política de efectos» | crear (sección) | `skills/epic-validate/SKILL.md` (`## Restricciones / Reglas`) | Declarar, por tipo de ejecución, qué se escribe, qué se ejecuta y qué se pregunta | AC-1, AC-2, AC-3, CNF-2, CS-7 |
| C4 | Guardia de previsualización | modificar | `skills/epic-validate/SKILL.md` (pasos `OPE-*` de STORY-125 y de suites de STORY-169) | Con `dryRun`, marcar como `no ejecutada` toda comprobación cuya evidencia requiere ejecutar un comando o preguntar al mantenedor | AC-2 |
| C5 | Paso 5 «Template y escritura» | modificar | `skills/epic-validate/SKILL.md` (Paso 5 de STORY-124) | Con `dryRun`, imprimir el reporte renderizado en lugar de escribirlo; sin `dryRun`, escribir solo `epic-validate-report.md` | AC-1, AC-2, AC-4, CNF-2 |
| C6 | Reglas de determinismo | modificar | `skills/epic-validate/SKILL.md` (Paso 5) | Fijar el orden de todas las filas y notas, los campos volátiles y la forma de las rutas | AC-4, CNF-1 |
| C7 | Paso 6 «Salida» | modificar | `skills/epic-validate/SKILL.md` (Paso 6 de STORY-124) | Agregar el bloque de resultado final en todas las ejecuciones | AC-1, AC-3 |
| C8 | Regla del veredicto | modificar | `skills/epic-validate/SKILL.md` (Paso 4) | Tratar `no ejecutada` como sin efecto (igual que `omitida`); la función no cambia | AC-2 |
| C9 | Casos de eval | modificar | `skills/epic-validate/evals/evals.json` | Cubrir AC-1 (dos filas), AC-2, AC-3 y AC-4 | AC-1, AC-2, AC-3, AC-4 |

El template seed **no cambia**: la previsualización usa el mismo template y las mismas claves (D-4). No se edita `package.json` ni `docs/domains/domain-skills-map.md` (la fila de STORY-124 sigue siendo veraz: el skill escribe `epic-validate-report.md`; `--dry-run` no escribe nada).

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-validate <epica> [--mode auto\|manual] [--dry-run]`. Los tokens se pueden dar en cualquier orden. `--mode=<valor>` se normaliza a `--mode <valor>` | AC-1, AC-2, CS-10 |
| Errores de invocación (C1), en este orden de evaluación, primer error gana | 1. Token que empieza por `--` y no es `--mode`, `--mode=…` ni `--dry-run` → `❌ Argumento no reconocido: <arg>` (incluye `--verbose` hasta STORY-137). 2. `--mode` sin valor, o seguido de otro token `--…` → `❌ Falta el valor de --mode. Valores válidos: auto, manual`. 3. Valor distinto de `auto` o `manual` (sensible a mayúsculas) → `❌ Valor no reconocido para --mode: <valor>. Valores válidos: auto, manual`. 4. `--mode` más de una vez → `❌ --mode se indicó más de una vez. Valores válidos: auto, manual`. 5. Más de un posicional → `❌ Argumento no reconocido: <segundo posicional>`. `--dry-run` repetido no es error. Ante cualquiera: no se lee ningún archivo, no se escribe nada y se emite el bloque de resultado con `FALLO` | AC-3 |
| Argumento `<epica>` ausente | `MODO = auto` → `❌ Falta el argumento <epica>` (error de invocación, sin preguntar). `MODO = manual` → pregunta de STORY-124 `¿Qué épica deseas validar? …` | AC-1 |
| Resolución de `MODO` (C2) | `modoFlag` presente → `MODO = modoFlag`, origen `flag`. Ausente → regla de STORY-125 (`auto` si `verify.e2e-smoke.command` está declarado; si no, `manual`), origen `regla por defecto` | AC-1 |
| Interacción por modo | `MODO = auto`: el skill no hace ninguna pregunta; toda evidencia que requeriría confirmación queda `sin evidencia` (STORY-125 D-9). `MODO = manual`: el skill puede preguntar (argumento ausente, confirmaciones de STORY-125) | AC-1 |
| Previsualización (C5) | La consola muestra, en este orden: `── Previsualización (--dry-run): no se escribió <ruta relativa del reporte> ──`, el reporte completo renderizado (frontmatter y cuerpo) en un bloque de código `markdown`, y `── Fin de la previsualización ──` | AC-2 |
| Bloque de resultado (C7) | Últimas líneas de **toda** ejecución, sin texto después: `RESULTADO: <ÉXITO \| FALLO \| SIMULACIÓN>` · `VEREDICTO: <APPROVED \| NEEDS-CHANGES \| BLOCKED \| —>` · `MODO: <auto \| manual \| —>` · `REPORTE: <ruta relativa a REPO_ROOT \| —>`; ante un error de invocación o un fallo que detiene el skill, una quinta línea `MOTIVO: <mensaje ❌>` | AC-1, AC-3 |
| Correspondencia del resultado | `ÉXITO` ⇔ reporte escrito con `verdict: APPROVED`. `FALLO` ⇔ reporte escrito con `NEEDS-CHANGES` o `BLOCKED`, o error de invocación, o fallo que detiene el skill (template ausente, escritura fallida). `SIMULACIÓN` ⇔ `--dry-run` completado; `VEREDICTO` es el de la previsualización y `REPORTE: —`. Quien automatiza trata todo valor distinto de `ÉXITO` como no aprobado (G-06) | AC-1, AC-2, AC-3 |

### Esquema de datos

**Invocación parseada** (salida de C1) // satisface: AC-1, AC-2, AC-3

`{ epica: string | null, modoFlag: "auto" | "manual" | null, dryRun: boolean }`. Es la única entrada de C2 y de C3. C1 no lee `sddf.config.yaml`, `epic.md` ni ningún otro archivo.

**Política de efectos** (C3) // satisface: AC-1, AC-2, AC-3, CNF-2, CS-7

| Ejecución | Archivos escritos | Comandos ejecutados (vía `check-command`) | Preguntas al mantenedor |
|---|---|---|---|
| Error de invocación (C1) | ninguno | ninguno | ninguna |
| `--dry-run` (cualquier `MODO`) | ninguno | ninguno | solo el argumento ausente con `MODO = manual` |
| `MODO = auto`, sin `--dry-run` | solo `<EPIC_DIR>/epic-validate-report.md` | los de STORY-125 (smoke tests, `verify:release`, criterios del DoD) y STORY-169 (suites) | ninguna |
| `MODO = manual`, sin `--dry-run` | solo `<EPIC_DIR>/epic-validate-report.md` | los que STORY-125 permite en manual (`verify:release` y comandos de verificación del DoD); nunca smoke tests ni suites | las confirmaciones de STORY-125 y el argumento ausente |

En ninguna ejecución el skill crea `.tmp/`, copias `.bak`, ni modifica `epic.md`, ningún `story.md`, `epic-analyze-report.md`, reportes de historias, templates ni código fuente. La escritura del reporte es una sobrescritura completa (STORY-124 D-9).

**Resultado `no ejecutada`** (C4, C8) // satisface: AC-2

Se aplica con `dryRun` a toda comprobación cuya evidencia proviene de un comando o de una confirmación: `OPE-01`, `OPE-02`, `OPE-03` (STORY-125) y las suites de STORY-169. La evidencia registrada es `` `--dry-run`: no se ejecutan comandos ni se piden confirmaciones ``; en la tabla de smoke tests cada `SMOKE-N` figura `no ejecutado` con esa misma fuente, y en `## Notas de la validación` se agrega una nota con la lista de comprobaciones no ejecutadas. `EST-01` y `EST-02` se evalúan siempre (solo leen frontmatter). Para el veredicto, `no ejecutada` cuenta como `omitida` (sin efecto), tal como STORY-169 ya la usa en `--mode manual`.

**Campos volátiles del reporte** (C6) // satisface: AC-4, CNF-1

Son los únicos que pueden cambiar entre dos ejecuciones equivalentes («datos de la ejecución», CR-001):

| Campo | Ubicación |
|---|---|
| `updated` | frontmatter (fecha `YYYY-MM-DD`, sin hora) |
| Fecha de evaluación | fila de `## Resumen` (fecha `YYYY-MM-DD`, sin hora) |
| Duraciones medidas | fila `OPE-02` de `## Comprobaciones`, fuentes `ejecución: …` de los smoke tests y suites de STORY-169 (segundos con un decimal) |

`created` se conserva del reporte previo (STORY-124). Ningún otro valor depende del momento ni de la máquina.

**Reglas de orden y forma** (C6) // satisface: AC-4, CNF-1

| Elemento | Regla |
|---|---|
| Filas de `## Comprobaciones` | por familia (`EST` < `OPE` < las de STORY-169) y número |
| Filas de `## Historias de la épica` | `STORY-NNN` por número ascendente; después las líneas F1 en el orden en que aparecen en el índice |
| Smoke tests | `N` numérico ascendente |
| Criterios del DoD | número de criterio |
| Motivos `M-NNN` | regla de STORY-124/125, numerados tras ordenar; un elemento produce como máximo un motivo |
| Notas | por fuente (ruta relativa) y línea; las notas sin fuente al final, por texto |
| Rutas | siempre relativas a `REPO_ROOT`, con `/` como separador |
| Codificación | UTF-8 sin BOM, finales de línea LF |

### Flujos clave

**F1 — Ejecución automática aprobada** // satisface: AC-1 (fila `auto` / `APPROVED`)
1. C1 parsea `EPIC-23 --mode auto` → `{ epica: "EPIC-23", modoFlag: "auto", dryRun: false }`.
2. C2 fija `MODO = auto` (origen `flag`). Pasos de STORY-124/125/169 sin preguntas.
3. Veredicto `APPROVED`; C5 escribe solo `epic-validate-report.md`.
4. C7 termina con `RESULTADO: ÉXITO` · `VEREDICTO: APPROVED` · `MODO: auto` · `REPORTE: specs/flow/EPIC-23-…/epic-validate-report.md`.

**F2 — Ejecución manual bloqueada** // satisface: AC-1 (fila `manual` / `BLOCKED`)
1. C1 → `modoFlag: "manual"`; C2 fija `MODO = manual`.
2. Un `SMOKE-N` sin reporte aprobado recibe `o` (o no se puede preguntar) → `sin evidencia` → `OPE-01 bloqueada`; nada `no cumple` → `BLOCKED`.
3. C5 escribe el reporte con `verdict: BLOCKED`; C7 termina con `RESULTADO: FALLO` · `VEREDICTO: BLOCKED`.

**F3 — Previsualización** // satisface: AC-2, CNF-2
1. C1 → `dryRun: true`. C2 resuelve `MODO` igual que sin el flag (se informa en el reporte).
2. `EST-01` y `EST-02` se evalúan; C4 marca `OPE-*` y suites como `no ejecutada`; no se invoca `check-command` ni se pregunta nada.
3. C5 renderiza el reporte con el template efectivo (incluido `created` del reporte previo, si existe) y lo imprime entre las líneas de previsualización; no escribe.
4. C7 termina con `RESULTADO: SIMULACIÓN` · `VEREDICTO: <el de la previsualización>` · `REPORTE: —`.

**F4 — Modo no reconocido** // satisface: AC-3
1. C1 encuentra `--mode rapido` → `❌ Valor no reconocido para --mode: rapido. Valores válidos: auto, manual`.
2. Fin inmediato: no se lee `sddf.config.yaml`, ni la épica, ni el template; no se escribe nada.
3. C7: `RESULTADO: FALLO` · `VEREDICTO: —` · `MODO: —` · `REPORTE: —` · `MOTIVO: ❌ Valor no reconocido para --mode: rapido. Valores válidos: auto, manual`.

**F5 — Repetición sin cambios** // satisface: AC-4, CNF-1
1. Existe un `epic-validate-report.md` previo con `created: D0`. Se vuelve a invocar con el mismo `MODO` sobre la misma épica sin cambios (y, en manual, con las mismas respuestas).
2. Las comprobaciones dan los mismos resultados; C6 ordena filas, motivos y notas con las reglas fijas; `created` se conserva.
3. C5 sobrescribe el reporte: solo cambian los campos volátiles. No se escribe ningún otro archivo.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo del «resultado observable» | Bloque de resultado de texto al final de toda ejecución (`RESULTADO:` …) | (a) Código de salida de proceso; (b) reutilizar `STATUS: OK\|FAIL` de `epic-analyze` | (a) El skill no es un proceso: lo ejecuta el agente y no hay código de salida propio; requeriría un motor Node envolvente (rechazado en D-2). (b) En `epic-analyze`, `STATUS: OK` significa «el skill corrió» aunque el veredicto rechace; usar la misma clave con otro significado nombraría dos conceptos igual (P10). Se conserva la forma `CLAVE: valor` en líneas fijas, que es lo que un orquestador ya sabe leer | AC-1, AC-3 |
| D-2 | Dónde vive el parseo de argumentos | Instrucciones del Paso 1 del `SKILL.md` | (a) Subcomando `parse-args` en `epic-suites.js`; (b) script nuevo | Cinco reglas de error sobre tokens no justifican código ni pruebas Node (P12, STORY-124 D-1). `epic-suites.js` ejecuta comandos; sumarle el parseo le daría dos razones de cambio (P11) | AC-1, AC-3 |
| D-3 | Orden de validación | Validar todos los argumentos antes de leer ningún archivo | Resolver la épica primero | Un error de invocación nunca depende del estado del repositorio, así que «no se crea ni modifica ningún archivo» se cumple trivialmente y el mensaje es el mismo exista o no la épica. Es el mismo principio que STORY-137 pide para su rechazo («error de invocación, no genera reporte») | AC-3 |
| D-4 | Qué se previsualiza con `--dry-run` | El reporte renderizado con el mismo template y las mismas claves, con las comprobaciones operativas `no ejecutada`, impreso en consola | (a) Solo un resumen de lo que se haría; (b) escribir en `.tmp/` o en un archivo `.preview.md`; (c) ejecutar las comprobaciones y no escribir | (a) AC-2 exige el contenido completo. (b) Viola «no se crea ni modifica ningún archivo». (c) AC-2 prohíbe ejecutar smoke tests y comandos de verificación; la nota de la historia fija que figuran como no ejecutadas. Sigue el precedente de `memory-system index --dry-run` | AC-2 |
| D-5 | Confirmaciones en `--dry-run` | No se pide ninguna; las comprobaciones que las requerirían quedan `no ejecutada` | Preguntar igual en manual | Una confirmación es evidencia operativa, como un comando; pedirla en una simulación haría que el humano trabaje para un reporte que no se guarda. Solo se mantiene la pregunta del argumento ausente, que no es evidencia | AC-2 |
| D-6 | Efecto de `no ejecutada` en el veredicto | Sin efecto (como `omitida`), y el resultado se marca `SIMULACIÓN` | (a) Contarla como `bloqueada`; (b) contarla como `cumple` y dar `ÉXITO` | (a) Toda previsualización daría `BLOCKED` y no mostraría el estado estructural. (b) Una simulación nunca debe pasar por un gate aprobado (G-06); `SIMULACIÓN` es distinto de `ÉXITO`, así que una automatización que exige `ÉXITO` falla cerrada. El valor `no ejecutada` ya existe en STORY-169 con esta semántica | AC-2 |
| D-7 | Rigor del valor de `--mode` | Solo `auto` y `manual` literales (minúsculas); `--mode` repetido es error | (a) Insensible a mayúsculas; (b) el último `--mode` gana | (a) y (b) aceptan invocaciones ambiguas o con erratas; fallar cerrado con los valores válidos en el mensaje es lo que pide AC-3 y lo que permite la reproducibilidad de la nota de la historia | AC-3 |
| D-8 | Argumento `<epica>` ausente en auto | Error de invocación | Preguntar | «`--mode auto` nunca pide confirmación» (nota de la historia); una automatización bloqueada esperando una respuesta no es observable | AC-1 |
| D-9 | Duraciones frente a «idéntico salvo la fecha» | Las duraciones medidas forman parte de los campos volátiles («datos de la ejecución») | (a) Sacar las duraciones del reporte; (b) redondearlas | (a) Contradice STORY-169 AC-1 y STORY-125 T012, que exigen la duración en el reporte. (b) Sigue variando entre ejecuciones. Se retroalimenta a la historia en CR-001 | AC-4 |
| D-10 | Mensaje ante `--mode` inválido | El mensaje específico de esta historia reemplaza al genérico `Argumento no reconocido` que STORY-125 T008 usa para valores de `--mode` | Mantener el genérico | AC-3 exige informar los valores válidos; el genérico no lo hace. Ver CR-003 | AC-3 |

### Decisiones de complejidad justificada

- **Tabla «Política de efectos» en vez de reglas dispersas:** STORY-124, STORY-125, STORY-137 y STORY-169 añaden pasos con efectos; una única tabla por tipo de ejecución es la fuente que esos pasos consultan y la que verifica el eval de CS-7. Es una sección de texto, no un mecanismo nuevo.
- **Tres valores de `RESULTADO` en vez de dos:** con solo `ÉXITO`/`FALLO`, `--dry-run` tendría que mentir en un sentido u otro (D-6). El tercer valor no añade pasos.
- **Reglas de orden explícitas para todas las tablas:** STORY-124/125 solo fijan el orden de los motivos; sin fijar historias, notas y comprobaciones, CNF-1 dependería del orden del glob del runtime.
- **Sin template nuevo ni clave nueva:** la previsualización reutiliza el template (D-4); no se agrega una sección de «modo de ejecución» porque el modo ya figura en la sección de smoke tests de STORY-125.

### Puntos de variación (P6)

- **Flags nuevos** (STORY-137 `--verbose`): se agregan a la lista de tokens reconocidos de C1 y, si tienen efectos, a una fila o columna de la Política de efectos. El orden de evaluación de errores no cambia.
- **Rechazo de `--mode auto` sin pruebas** (STORY-137 AC-2): se agrega como error de invocación posterior a C2 (necesita leer `sddf.config.yaml`), con el mismo bloque de resultado `FALLO`.
- **Comprobaciones nuevas que ejecutan comandos:** quedan cubiertas por la guardia C4 si pasan por `check-command`; la regla es genérica, no una lista cerrada.
- **Campos volátiles:** si una historia agrega un dato de ejecución al reporte, se agrega a la tabla de campos volátiles; cualquier otro dato nuevo debe ser determinista.

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `sddf.config.yaml` ausente o ilegible al resolver `MODO` sin flag | Regla de STORY-125: no hay `verify.e2e-smoke.command` → `MODO = manual` |
| No se puede preguntar en `MODO = manual` | Argumento ausente → `❌ Falta el argumento <epica>` (error de invocación); confirmaciones → `sin evidencia` (STORY-125 D-9) |
| Reporte previo ilegible al conservar `created` | `created` = hoy (STORY-124), y también en la previsualización |
| Template ausente | Error de STORY-124 sin escribir; bloque con `FALLO` y `MOTIVO:` (también en `--dry-run`) |
| Escritura del reporte falla | `❌ No se pudo escribir <ruta>: <causa>`; bloque con `FALLO`, `VEREDICTO: —` (no se informa como emitido) y `MOTIVO:` |
| Motor `check-command` no disponible | No afecta a `--dry-run` (no se invoca); fuera de él, reglas de STORY-125/169 (`no ejecutable` → `bloqueada`) |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| V-1 | `--mode auto` con fixture aprobada → reporte `verdict: APPROVED`, sin preguntas, y última línea de bloque `RESULTADO: ÉXITO` | Eval TC (siguiente número libre) | AC-1 |
| V-2 | `--mode manual` con un `SMOKE-N` sin evidencia → reporte `verdict: BLOCKED` y `RESULTADO: FALLO` · `VEREDICTO: BLOCKED` | Eval TC | AC-1 |
| V-3 | `--dry-run` → salida con `── Previsualización (--dry-run)`, `## Veredicto`, `no ejecutada` y `RESULTADO: SIMULACIÓN`; sin `=== epic-validate-report.md ===` ni ninguna otra escritura, sin `check-command` | Eval TC (`contains` / `not_contains`) | AC-2, CNF-2 |
| V-4 | `--mode rapido` → `❌ Valor no reconocido para --mode: rapido. Valores válidos: auto, manual`, `RESULTADO: FALLO`, ningún archivo escrito | Eval TC | AC-3 |
| V-5 | Fixture con reporte previo idéntico (`created: 2026-10-01`) y dos motivos → el reporte conserva `created: 2026-10-01`, los motivos aparecen como `M-001`, `M-002` en el mismo orden y no aparece `M-003`; no se escribe ningún otro archivo | Eval TC | AC-4, CNF-1 |
| V-6 | `--dry-run --mode manual` y `--mode manual --dry-run` producen el mismo resultado | Eval TC (dos invocaciones del mismo fixture, mismo `expected`) | AC-2, CS-10 |
| V-7 | `--mode` sin valor y `--mode` repetido → sus mensajes y `FALLO` | Eval TC | AC-3 |
| V-8 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (C1, C2, C7; F1, F2; D-1, D-8), AC-2 (C3, C4, C5, C8; F3; D-4…D-6), AC-3 (C1, C7; F4; D-3, D-7, D-10), AC-4 (C5, C6; F5; D-9); CNF-1 (C6), CNF-2 (C3). Sin omisiones.
- **Ambigüedad:** el mecanismo del resultado observable (que la historia deja al diseño) queda en D-1; las duraciones frente a AC-4 en D-9 y CR-001.
- **Nombres:** `MODO`, «previsualización», `no ejecutada`, «campos volátiles», `RESULTADO` se usan con un único significado; `omitida` (control no configurado) y `no ejecutada` (control no corrido en esta ejecución) se distinguen.
- **Estructura:** sin ciclos: C1 → C2 → pasos de comprobación (con C4) → C8 → C5 (con C6) → C7. C3 es una tabla que los pasos consultan, no un componente con lógica. Cada componente tiene una razón de cambio.

## Risks / Trade-offs

- [Una salida de comando citada (`outputTail`) puede variar entre ejecuciones aunque la épica no cambie] → Solo aparece en motivos de comandos fallidos; es un dato del proyecto, no del skill. El contrato de equivalencia cubre lo que el skill genera; se documenta en el `SKILL.md` junto a los campos volátiles.
- [Los comandos declarados por el proyecto podrían escribir archivos] → CS-7 se refiere a lo que escribe el skill; `--dry-run` nunca los ejecuta y `verify:release` de este repositorio no escribe. La Política de efectos lo declara.
- [STORY-125 (auto sin smoke config → `BLOCKED` con reporte) y STORY-137 AC-2 (auto sin pruebas → error sin reporte) dan resultados distintos para el mismo caso] → No es alcance de esta historia; el bloque de resultado los distingue (`FALLO` con `REPORTE:` presente o `—`). Se resuelve al planificar STORY-137 (punto de variación).
- [`RESULTADO:` y `STATUS:` de `epic-analyze` conviven en el framework] → D-1 lo justifica; STORY-127, que documenta el gateway, puede unificar el vocabulario de retorno si se decide.
- [Implementar esta historia antes que STORY-125/169 deja la guardia C4 sin comprobaciones que proteger] → La guardia es genérica; los evals V-3 y V-6 se escriben contra los pasos operativos existentes en el momento de implementar (CR-002).

## Open Questions

Ninguna: las decisiones abiertas se resuelven en D-1…D-10; las que afectan a otros documentos se registran como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-4 y la regla «Contenido equivalente» dicen que dos reportes de la misma épica sin cambios «solo pueden diferir en la fecha de evaluación». STORY-169 AC-1 y STORY-125 (T012) exigen registrar en el reporte la duración medida de cada comando, que varía entre ejecuciones. El diseño trata fecha y duraciones como «datos de la ejecución» (D-9).
- **Documento afectado**: story.md
- **Acción requerida**: en AC-4, cambiar «salvo la fecha de evaluación» por «salvo los datos de la ejecución (fecha de evaluación y duraciones medidas)», y ajustar igual la regla «Contenido equivalente» de las notas.

### CR-002
- **Tipo**: dependencia
- **Descripción**: todos los componentes modifican `skills/epic-validate/SKILL.md` y `evals/evals.json`, que crea STORY-124 (`READY-FOR-IMPLEMENT/DONE`). La guardia C4 y los evals V-2, V-3 y V-6 actúan sobre los pasos `OPE-*` de STORY-125 y las suites de STORY-169.
- **Documento afectado**: tasks.md
- **Acción requerida**: ordenar las tareas detrás de STORY-124 implementada. Las partes de C4, C8 y los evals que tocan comprobaciones operativas se aplican sobre los pasos que existan al implementar; si STORY-125 aún no está, usar un validador stub de veredicto fijo (nota de la historia) y dejar una tarea de verificación posterior.

### CR-003
- **Tipo**: dependencia
- **Descripción**: STORY-125 T008 dice que un valor de `--mode` distinto de `auto`/`manual`, o `--mode` sin valor, «mantiene el error `❌ Argumento no reconocido: <arg>`». Esta historia lo reemplaza por mensajes que informan los valores válidos (D-10, AC-3).
- **Documento afectado**: STORY-125 tasks.md
- **Acción requerida**: al implementar STORY-125 después de esta historia, conservar los mensajes de C1; si se implementa antes, esta historia los reemplaza en su tarea del Paso 1. Anotar la remisión en T008 de STORY-125 al refinar la épica.
