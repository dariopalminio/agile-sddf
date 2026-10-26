---
alwaysApply: false
type: design
id: STORY-159
slug: STORY-159-story-delivery-interactivo-design
title: "Design: story-delivery interactivo en modelo batch"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-159
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-159-story-delivery-interactivo
  - EPIC-27-completar-flujo-de-story
  - STORY-160-completar-y-archivar-historia-entregada
  - STORY-162-story-delivery-modelo-continuous
  - STORY-163-story-delivery-dry-run-y-force
---

<!-- Referencias -->
[[STORY-159-story-delivery-interactivo]] · [[EPIC-27-completar-flujo-de-story]] · [[STORY-160-completar-y-archivar-historia-entregada]] · [[STORY-162-story-delivery-modelo-continuous]] · [[STORY-163-story-delivery-dry-run-y-force]]

# Diseño técnico: story-delivery interactivo en modelo batch

## Context

El pipeline de story termina hoy en `story-acceptance` (`ACCEPTANCE/DONE`). La transición a `DELIVER` es manual: el humano edita el frontmatter de `story.md` sin evidencia del DoD de entrega. Esta historia crea el skill `story-delivery`, que recorre `docs/guardrails/dod-story-deliver.md` criterio por criterio y, con confirmación humana, escribe `DELIVER/DONE`. Solo cubre `delivery-model: batch`; `continuous` y la validación del modelo llegan en STORY-162, y `--dry-run`/`--force` en STORY-163.

Estado actual verificado en el filesystem (2026-10-25):

- `skills/story-delivery/` **no existe**. El diagrama `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid` ya dibuja `dec_acceptance -->|APPROVED| story-delivery`.
- `sddf.config.yaml` declara `defaults.delivery-model: batch` y `guardrails.dod.story.deliver: dod-story-deliver`.
- `docs/guardrails/dod-story-deliver.md` existe: `kind: content`, `enforcement: error`, `applies-to: deliver`, siete criterios `- [ ]`. El último («El paquete publicado puede instalarse limpiamente con `npm install agile-sddf`…») exige que el paquete ya esté publicado.
- `package.json › files` ya contiene `skills/` completo: cualquier `skills/<nombre>/` se publica sin tocar el arreglo (ver CR-001).
- `skills/memory-system/scripts/dod-story.js` define `DOD_STAGES`; la entrada `deliver` tiene `skills: []` y el comentario «sin skill por ahora». `skillProblems()` comprueba que cada skill listado en una etapa tenga `## DoD aplicable` citando su slug. `test/dod-story.test.js` UT-003 fija `deliver.skills = []`.
- `scripts/verify-eval-inventory.js` (parte de `verify:repository`) exige `skills/<skill>/evals/evals.json` con casos `TC-NNN` o una excepción en `config/eval-exemptions.json`.
- `scripts/verify-fixed-layout.js` valida el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` en cada skill.
- La prohibición de que un skill escriba `DELIVER` aparece en: invariante 6 de §4 y §5.2 de `docs/domains/domain-state-management.md`; fila `DELIVER` de §5 de `docs/domains/domain-story-lifecycle.md`; BR-006 y el resumen de substatus («los terminales requieren acción humana o CI/CD») de `docs/domains/domain.md`; y, como documentación derivada, `docs/architecture/state-machine.md` (líneas 72, 92, 108), `docs/guides/sddf-commands-pipeline.md` (fila `deliver`, «sin skill por ahora») y `README.md` (línea 205).
- Skill de referencia más cercano: `skills/story-acceptance/SKILL.md` (gate humano, precondición de estado, actualización de frontmatter, mensajes de error sin modificar archivos). Se reutilizan su estructura de secciones, su resolución de historia (Paso 1) y su sección `## DoD aplicable`.

Stack: el «código de producción» de este repo son skills en Markdown más scripts Node.js (`sddf.config.yaml › implement.code_generators: monolithic → skill-master`); las pruebas de skills son evals (`implement.test_generators: eval → skill-test-evals`) y las de scripts, `node --test`.

## Goals / Non-Goals

**Goals:**

- Skill `story-delivery` con flujo interactivo en `batch`: precondición `ACCEPTANCE/DONE`, evaluación del DoD con evidencia por criterio, criterio de publicación como «no aplica en batch», confirmación humana y escritura de `DELIVER/DONE` + `updated`. // satisface: AC-1
- Tres caminos de bloqueo (estado inválido, DoD incumplido, rechazo del usuario) que no modifican `story.md` ni crean archivos. // satisface: AC-2, CNF-3
- Documentos de dominio coherentes: `story-delivery` escribe `DELIVER` con confirmación humana; `SHIP` y `COMPLETED` siguen sin skill escritor. // satisface: AC-3
- Skill publicable y gate en verde (`verify:repository`, `npm test`). // satisface: CNF-1, CNF-2, CNF-4

**Non-Goals:**

- Modelo `continuous`, `delivery-model` ausente o inválido (STORY-162): aquí solo se falla cerrado ante un valor distinto de `batch`.
- `--dry-run`, `--force` y registro de override (STORY-163).
- Ejecutar despliegues, publicar en npm, crear tags o escribir manifiestos de release.
- `COMPLETED` y archivado (STORY-160), y ADR nuevo para el cambio de invariante.
- Reporte persistente de entrega (`delivery-report.md`): la evidencia se muestra en consola (ver D-6).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Skill `story-delivery` | crear | `skills/story-delivery/SKILL.md` | AC-1, AC-2, CNF-1, CNF-3 |
| C-2 | README del skill | crear | `skills/story-delivery/README.md` | CNF-4 (convención: los 35 skills tienen README) |
| C-3 | Evals del skill | crear | `skills/story-delivery/evals/evals.json` | AC-1, AC-2, CNF-4 |
| C-4 | Registro de etapa deliver | modificar | `skills/memory-system/scripts/dod-story.js` (`DOD_STAGES`, entrada `deliver`: `skills: ['story-delivery']`; comentario de cabecera) | AC-1, CNF-4 |
| C-5 | Prueba de la etapa deliver | modificar | `test/dod-story.test.js` (UT-003: `deliver.skills` = `['story-delivery']`) | CNF-4 |
| C-6 | Invariante transversal | modificar | `docs/domains/domain-state-management.md` (§4 invariante 6, §5.2) | AC-3 |
| C-7 | Ciclo de vida de story | modificar | `docs/domains/domain-story-lifecycle.md` (§5 fila `DELIVER`) | AC-3 |
| C-8 | Reglas de negocio | modificar | `docs/domains/domain.md` (BR-006, resumen de substatus en `## State Models`) | AC-3 |
| C-9 | Máquina de estados | modificar | `docs/architecture/state-machine.md` (línea 72, fila `DELIVER` de la tabla de estados, tabla de transiciones por skill + párrafo de la línea 108) | AC-3 (coherencia derivada) |
| C-10 | Guía del pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` (fila `deliver`: skill `story-delivery`) | AC-3 (coherencia derivada) |
| C-11 | README raíz | modificar | `README.md` (línea 205: `DELIVER` la escribe `story-delivery` con confirmación) | AC-3 (coherencia derivada) |

Sin cambios: `package.json` (ver CR-001), `config/runtimes.json`, `config/profiles.json`, `docs/guardrails/dod-story-deliver.md` (ver D-3), `sddf.config.yaml`, el diagrama Mermaid (ya incluye `story-delivery`), `scripts/verify-validation-contract.js` (`story-delivery` no es un gate con reporte, D-6).

## Decisions

### D-1 — Precondición de estado única: `ACCEPTANCE/DONE` // satisface: AC-1, AC-2

`story-delivery` solo actúa si el frontmatter de `story.md` es exactamente `status: ACCEPTANCE` y `substatus: DONE`. Cualquier otro par detiene el skill con el mensaje de estado inválido, que nombra el estado actual (`VERIFY/DONE` en la fila 1 de AC-2), antes de leer el DoD y sin preguntar nada.

| Alternativa | Motivo del rechazo |
|---|---|
| Aceptar también `DELIVER/IN-PROGRESS` como reanudación | Ningún skill escribe `DELIVER/IN-PROGRESS` (D-5): no hay sesión que reanudar. |
| Aceptar `ACCEPTANCE/IN-PROGRESS` o `BLOCKED` con advertencia | Saltaría el gate humano de aceptación; forzar el estado es `--force` (STORY-163). |

### D-2 — Fail-closed ante `delivery-model` distinto de `batch` // satisface: AC-1

El skill lee `defaults.delivery-model` de `<REPO_ROOT>/sddf.config.yaml`. Con `batch` sigue; con cualquier otro valor, valor ausente o archivo ausente se detiene sin cambios con `❌ story-delivery solo soporta delivery-model: batch (valor leído: <valor | ausente>)`. Es el comportamiento mínimo hasta STORY-162, que reemplaza esta rama por el soporte de `continuous` y el mensaje de valor inválido definitivo. El punto de variación queda aislado en un único paso del skill (Paso 2, ver F-1).

| Alternativa | Motivo del rechazo |
|---|---|
| Asumir `batch` si falta el valor | Ocultaría un error de configuración y contradice el fail-closed que la épica pide (CS-2, STORY-162). |
| Implementar ya `continuous` | Fuera de alcance (Non-Goals); agranda la historia que el split redujo. |

### D-3 — Evidencia por criterio: tres métodos, clasificación en runtime // satisface: AC-1

El DoD se lee en runtime (líneas `- [ ]`, nunca hardcodeadas, igual que `story-acceptance`). Cada criterio se clasifica con la tabla de evidencia del SKILL.md, en este orden (primera coincidencia):

| Orden | Señal en el texto del criterio | Método | Estado posible | Evidencia mostrada |
|---|---|---|---|---|
| 1 | Exige el paquete **publicado** o el incremento **desplegado** (p. ej. «paquete publicado», `npm install <paquete>`, «desplegado en producción») | `no-aplica-batch` | `no aplica en batch` | `delivery-model: batch` (sddf.config.yaml) |
| 2 | Cita un comando ejecutable entre backticks (p. ej. `npm pack --dry-run`) | `comando` | ✅ / ❌ | el comando y su resultado resumido (código de salida y, si falla, la línea relevante) |
| 3 | Cita un archivo o campo del repo (`package.json`, `CHANGELOG.md`, `.npmignore`, campo `files`) | `artefacto` | ✅ / ❌ | la ruta leída y el dato observado (p. ej. versión `x.y.z` y entrada en CHANGELOG) |
| 4 | Ninguna de las anteriores (p. ej. «El build de CI pasa», «No hay secrets») | `confirmación` | ✅ / ❌ | `confirmación humana` (pregunta s/n por criterio) |

Aplicado al DoD actual: CI → `confirmación`; secrets → `confirmación`, apoyada en `npm run verify:repository` si el usuario lo pide (el skill no ejecuta scanners propios); SemVer y CHANGELOG → `artefacto`; `files`/`.npmignore` → `artefacto`; `npm pack --dry-run` → `comando`; instalación del paquete publicado → `no-aplica-batch`.

Reglas: un `comando` que falla o no puede ejecutarse es ❌ con la salida como evidencia (no se reintenta); un `artefacto` ausente es ❌; la respuesta `n` en `confirmación` es ❌. «No aplica en batch» no cuenta como incumplido.

| Alternativa | Motivo del rechazo |
|---|---|
| Anotar el método en el propio DoD (`<!-- evidence: … -->`) | Cambia el formato de un guardrail de autoría manual (ADR-0012) y los proyectos consumidores no tendrían esas anotaciones. |
| Mapeo fijo por texto exacto del criterio | Se rompe al editar una coma del DoD; el DoD es dinámico por contrato. |
| Verificar el criterio de instalación con el tarball de `npm pack` | La nota de la historia lo deja a evaluar; AC-1 fija «no aplica en batch». Instalar el tarball exige un proyecto temporal y red: es trabajo de `smoke:package`, no de un gate de entrega mínimo. |

### D-4 — Orden: evaluar todo, luego decidir, luego confirmar // satisface: AC-1, AC-2

1. Se evalúan **todos** los criterios (incluidas las preguntas de `confirmación`) y se muestra la tabla completa.
2. Si hay algún ❌ y `enforcement: error` → se informa la lista de incumplidos y se detiene **sin hacer la pregunta final** (fila 2 de AC-2). Con `enforcement: warn` se muestran los ❌ como advertencia y se continúa a la confirmación (contrato de `## DoD aplicable` compartido con los demás skills).
3. Sin bloqueo → pregunta final `¿Confirmas la entrega de STORY-NNN a DELIVER/DONE? (s/n)`. Solo `s`/`si`/`sí` (sin distinguir mayúsculas) confirma; cualquier otra respuesta cancela con `Entrega cancelada por el usuario` (fila 3 de AC-2).

Las preguntas por criterio de `confirmación` no son la confirmación de entrega: responder `n` a una produce ❌, no cancelación.

| Alternativa | Motivo del rechazo |
|---|---|
| Detenerse en el primer ❌ | El usuario necesita la lista completa de incumplidos para corregir de una vez (AC-2 pide «la lista de criterios incumplidos»). |
| Pedir la confirmación final antes de evaluar | Confirmaría a ciegas; AC-1 exige ver el DoD antes del paso irreversible. |

### D-5 — Escritura atómica `DELIVER/DONE` sin estado intermedio // satisface: AC-1, CNF-3

`story-delivery` es el único punto que escribe y lo hace una vez, al final: sustituye en el frontmatter de `story.md` exactamente las líneas `status:`, `substatus:` y `updated:` (fecha de hoy `YYYY-MM-DD`; si `updated:` falta, se añade tras `created:`). El resto del archivo queda byte a byte igual (UTF-8 sin BOM, finales de línea preservados). No escribe `DELIVER/IN-PROGRESS` al iniciar, a diferencia de `story-acceptance`, porque cualquier escritura previa violaría CNF-3 en los caminos de bloqueo.

En consecuencia, la fila `DELIVER` de `domain-story-lifecycle.md` cambia su «Substatus inicial» de `IN-PROGRESS` a `DONE` (C-7).

| Alternativa | Motivo del rechazo |
|---|---|
| Escribir `DELIVER/IN-PROGRESS` al iniciar y revertir al bloquear | La reversión deja `updated:` alterado o exige restaurar bytes: viola CNF-3 por diseño y añade un camino de fallo. |
| Reescribir todo el frontmatter serializando YAML | Reordena claves y cambia comillas: modifica bytes ajenos a la transición. |

### D-6 — Sin artefacto persistente de entrega // satisface: AC-1, CNF-3

La evidencia se presenta en consola (tabla criterio · estado · evidencia); no se crea `delivery-report.md`. La épica decidió un skill mínimo sin manifiesto, y CNF-3 prohíbe crear archivos al bloquear. Por eso `story-delivery` no entra en `REPORT_TEMPLATES` de `scripts/verify-validation-contract.js` ni declara `verdict`.

| Alternativa | Motivo del rechazo |
|---|---|
| `delivery-report.md` solo en el camino de éxito | Añade un artefacto con contrato de validación (G-01…G-06) que nadie consume; la trazabilidad la da el commit del cambio de estado. |
| Añadir la evidencia como sección en `story.md` | Mezcla requisitos con registro de ejecución y complica la edición mínima de D-5. |

### D-7 — Registrar `story-delivery` en la etapa `deliver` de `DOD_STAGES` // satisface: AC-1, CNF-4

La entrada `deliver` pasa a `skills: ['story-delivery']`. Así `memory-system check` (función `skillProblems`) comprueba que `skills/story-delivery/SKILL.md` tenga `## DoD aplicable` citando `dod-story-deliver`, igual que el resto de etapas. Se mantienen `kind: content`, `from/to: null` y `optional: true`: el guardrail sigue siendo de contenido. Se actualiza el comentario de cabecera («sin skill por ahora») y UT-003.

| Alternativa | Motivo del rechazo |
|---|---|
| Dejar `skills: []` | El nuevo skill quedaría fuera de la comprobación que protege a los demás; el comentario del script quedaría falso. |
| Convertir `deliver` en `transition` (`from: ACCEPTANCE/DONE`, `to: DELIVER/DONE`) | Cambia el frontmatter esperado de `dod-story-deliver.md` (UT-003, UT-007) y el contrato de guardrails de contenido; no lo pide ningún AC. |

### D-8 — DoD de entrega ausente: fail-closed // satisface: AC-1, AC-2

Resolución del DoD como en los demás skills (`sddf.config.yaml › guardrails.dod.story.deliver` → convención `docs/guardrails/dod-story-deliver.md`). A diferencia de las etapas de transición, si no se resuelve ningún archivo o no tiene líneas `- [ ]`, `story-delivery` se detiene sin cambios: `❌ DoD de entrega no encontrado (probado: <rutas>) → crea docs/guardrails/dod-story-deliver.md`. El propósito del skill es dejar evidencia del DoD; sin DoD no hay entrega que registrar.

| Alternativa | Motivo del rechazo |
|---|---|
| Advertir y entregar sin DoD (como `story-acceptance`) | Vaciaría el propósito de la historia («sin saltarme los criterios de entrega»); saltarse el DoD es `--force` (STORY-163). |

### D-9 — Redacción de dominio: `DELIVER` sale de la prohibición; `SHIP` y `COMPLETED` quedan // satisface: AC-3

Texto objetivo (la implementación puede ajustar la prosa, no el contenido):

- `domain-state-management.md` §4 invariante 6: «Las transiciones terminales `SHIP` y `COMPLETED` son manuales o disparadas por CI/CD; ningún skill las escribe automáticamente. `DELIVER` de story la escribe `story-delivery`, siempre con confirmación humana explícita.» §5.2: añadir que una transición terminal escrita por un skill solo ocurre tras confirmación humana (caso `story-delivery`).
- `domain-story-lifecycle.md` §5 fila `DELIVER`: descripción «… La escribe `story-delivery` tras verificar el DoD de entrega y con confirmación humana.»; actor «Humano (vía `story-delivery`) / CI-CD»; substatus inicial `DONE` (D-5).
- `domain.md` BR-006: «`SHIP` y `COMPLETED` no los escribe automáticamente un skill; son manuales o de CI/CD. `DELIVER` lo escribe `story-delivery` solo con confirmación humana.» Resumen de substatus: «los terminales requieren acción humana o CI/CD (`DELIVER` de story, mediante `story-delivery` con confirmación)».

Coordinación con STORY-160: esta historia solo retira `DELIVER` de la frase; STORY-160 retira `COMPLETED` editando la misma frase después, sin reescribir el invariante entero. No se crea ADR (Non-Goals; los documentos de dominio no son ADR inmutables).

| Alternativa | Motivo del rechazo |
|---|---|
| Reescribir el invariante para `DELIVER` y `COMPLETED` a la vez | Invade el alcance de STORY-160 y declararía un escritor de `COMPLETED` que aún no existe (viola «Veracidad»). |
| Excepción en una nota al pie, invariante intacto | Dejaría el invariante literal falso; AC-3 exige que los tres documentos lo declaren. |

### D-10 — Estructura del SKILL.md: la de `story-acceptance` // satisface: CNF-1, AC-1, AC-2

Secciones, en el orden de los skills existentes: frontmatter (`name`, `description`, `triggers`, `outputs: [story.md (frontmatter actualizado)]`), `## Objetivo`, `## Posicionamiento`, `## Entrada`, `## Parámetros`, `## Dependencias`, `## DoD aplicable` (etapa `deliver`, archivo, override, enforcement), `## Modos de ejecución` (solo manual; automático no disponible por diseño), `## Restricciones / Reglas`, `## Flujo de ejecución` (Paso 0 con el bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->` idéntico al de los demás skills, Pasos 1–6 de F-1), `## Salida`. El Paso 1 (resolución de historia por ID o ruta, rechazo de `specs/flow/archive/`) se replica de `story-acceptance` 1a–1c.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| Invocación | `/story-delivery {story_id \| story_path}`. Sin argumento → pregunta el ID. Sin flags en esta historia. | AC-1 |
| Lectura de configuración | `sddf.config.yaml › defaults.delivery-model` (`batch` requerido, D-2); `› guardrails.dod.story.deliver` (override opcional del slug, D-8). | AC-1 |
| Lectura del DoD | `docs/guardrails/<slug>.md`: frontmatter `enforcement` (`error`\|`warn`) y líneas `- [ ] <texto>`. | AC-1, AC-2 |
| Pregunta por criterio (`confirmación`) | `¿Se cumple «<criterio>»? (s/n)` → ✅ / ❌. | AC-1 |
| Confirmación final | `¿Confirmas la entrega de STORY-NNN a DELIVER/DONE? (s/n)` — se omite si hay bloqueo. | AC-1, AC-2 |
| Escritura | `story.md` frontmatter: `status: DELIVER`, `substatus: DONE`, `updated: <hoy>` (D-5). Único archivo escrito, solo en éxito. | AC-1, CNF-3 |
| Mensajes de bloqueo | Estado inválido: `❌ La historia STORY-NNN no está en ACCEPTANCE/DONE. Estado actual: <status>/<substatus>` · DoD incumplido: `❌ Entrega bloqueada: criterios incumplidos del DoD` + lista · Rechazo: `Entrega cancelada por el usuario. story.md no cambió.` · Modelo no soportado (D-2) · DoD ausente (D-8). | AC-2 |
| Registro de etapa | `DOD_STAGES[deliver].skills` = `['story-delivery']` (D-7). | CNF-4 |

## Esquema de datos // satisface: AC-1

Resultado de evaluación por criterio (en memoria del agente, mostrado en consola, no persistido):

| Campo | Tipo | Valores |
|---|---|---|
| `n` | entero | posición del criterio en el DoD (1…N) |
| `texto` | texto | línea `- [ ]` sin el prefijo |
| `metodo` | enum | `comando` · `artefacto` · `confirmación` · `no-aplica-batch` |
| `estado` | enum | `✅` · `❌` · `no aplica en batch` |
| `evidencia` | texto | comando + resultado · ruta + dato observado · `confirmación humana` · `delivery-model: batch` |

Tabla de salida: `| # | Criterio | Estado | Evidencia |`.

Casos de `evals.json` (C-3), formato de `skills/story-acceptance/evals/evals.json` (`skill`, `version`, `description`, `cases[]` con `id: TC-NNN`, `name`, `type`, `description`, `input`, `expected.contains`/`not_contains`): TC-001 happy path batch (AC-1), TC-002 estado `VERIFY/DONE` (AC-2 fila 1), TC-003 DoD incumplido sin pregunta final (AC-2 fila 2), TC-004 usuario rechaza (AC-2 fila 3), TC-005 `delivery-model: continuous` falla cerrado (D-2), TC-006 DoD ausente falla cerrado (D-8).

## Flujos clave

### F-1 — Entrega en batch con DoD cumplido // AC-1

1. Paso 0: resolver `REPO_ROOT` (layout fijo).
2. Paso 1: resolver historia → leer frontmatter → `ACCEPTANCE/DONE` ✓ (D-1).
3. Paso 2: leer `defaults.delivery-model` → `batch` ✓ (D-2).
4. Paso 3: resolver DoD → 7 criterios, `enforcement: error` (D-8).
5. Paso 4: clasificar y evaluar cada criterio; preguntar los de `confirmación`; ejecutar `npm pack --dry-run`; leer `package.json`/`CHANGELOG.md`; marcar instalación como «no aplica en batch» (D-3). Mostrar tabla.
6. Paso 5: sin ❌ → confirmación final → `s` (D-4).
7. Paso 6: escribir `DELIVER/DONE` + `updated` (D-5); mostrar `✅ STORY-NNN entregada: DELIVER/DONE` y sugerir `/story-complete STORY-NNN` (STORY-160).

### F-2 — Bloqueos sin efectos // AC-2, CNF-3

- Estado ≠ `ACCEPTANCE/DONE` → termina en el paso 2 de F-1 con el estado actual en el mensaje.
- DoD con ❌ y `enforcement: error` → termina en el paso 6 de F-1 sin pregunta final, listando los incumplidos.
- Respuesta ≠ `s` en la confirmación final → termina sin escribir.

En los tres casos no se ha escrito nada antes (D-5) y el skill no crea archivos (D-6). `npm pack --dry-run` no escribe en la carpeta de la historia.

### F-3 — Degradación // P7

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| `sddf.config.yaml` | ausente o ilegible | fail-closed (D-2), sin cambios |
| DoD de entrega | ausente o sin criterios | fail-closed (D-8), sin cambios |
| Comando de evidencia (`npm pack --dry-run`) | no ejecutable o código ≠ 0 | criterio ❌ con la salida como evidencia; el resto se sigue evaluando |
| Artefacto citado (`CHANGELOG.md`) | ausente | criterio ❌; el resto se sigue evaluando |
| Escritura de `story.md` | error de E/S | `❌ No se pudo escribir story.md` y se informa que el estado no cambió; no se reintenta |

### F-4 — Puntos de cambio // P6

- Modelo de entrega: el Paso 2 es la única rama por `delivery-model` (STORY-162 añade `continuous` ahí y cambia la regla `no-aplica-batch` por su equivalente).
- Flags: `--dry-run` corta tras el Paso 4; `--force` salta los Pasos 1 y 5 de bloqueo (STORY-163). Ningún paso actual depende de otro de forma que impida insertarlos.
- Contenido del DoD: clasificación en runtime (D-3); añadir criterios no exige cambiar el skill.

## Decisiones de complejidad justificada

- **Tabla de clasificación de evidencia (D-3):** un único método (todo por confirmación humana) sería más simple, pero AC-1 exige «el comando o archivo que lo evidencia»; tres métodos más la regla «no aplica» es el mínimo que lo satisface sin mapear textos exactos.
- **Registro en `DOD_STAGES` (D-7):** un cambio de una línea más una prueba; evita que el nuevo skill quede fuera de la comprobación existente. No se introduce ningún tipo de etapa nuevo.
- **Sin artefacto ni estado intermedio (D-5, D-6):** es la opción más simple y la única compatible con CNF-3.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| 1 | Happy path batch: tabla con 7 criterios, instalación «no aplica en batch», `story.md` en `DELIVER/DONE` con `updated` de hoy | eval TC-001 (`npm run test:eval -- story-delivery`, ejecución manual) | AC-1 |
| 2 | `VERIFY/DONE` → mensaje con el estado actual, `story.md` intacto, sin pregunta | eval TC-002 | AC-2, CNF-3 |
| 3 | DoD incumplido → lista de incumplidos, sin pregunta final, `story.md` intacto | eval TC-003 | AC-2, CNF-3 |
| 4 | Rechazo → «canceló la entrega», `story.md` intacto | eval TC-004 | AC-2, CNF-3 |
| 5 | Los tres documentos de dominio declaran que `story-delivery` escribe `DELIVER` con confirmación humana; `SHIP` y `COMPLETED` siguen sin escritor | revisión por búsqueda (`grep -n "story-delivery"` y «ningún skill» en los tres archivos) | AC-3 |
| 6 | Marcador de layout y resolución solo de `REPO_ROOT` | `node scripts/verify-fixed-layout.js` | CNF-1 |
| 7 | Skill incluido en el paquete | `npm pack --dry-run` lista `skills/story-delivery/SKILL.md` | CNF-2 |
| 8 | `DOD_STAGES[deliver].skills` contiene `story-delivery` y el SKILL.md cita `dod-story-deliver` | `npm test` (UT-003 actualizado) y `memory-system check` dentro de `verify:repository` | CNF-4, D-7 |
| 9 | Gate completo | `npm run verify:repository` y `npm test` en verde (incluye `verify-eval-inventory` con C-3) | CNF-4 |

## Risks / Trade-offs

- [Clasificación heurística de criterios mal aplicada por el agente] → la tabla D-3 es ordenada y explícita, con ejemplos del DoD actual; el caso por defecto es `confirmación`, que nunca aprueba sin respuesta humana.
- [`npm pack --dry-run` lento o sin red] → no necesita red; si falla, el criterio es ❌ con evidencia (F-3), nunca un falso ✅.
- [Proyectos consumidores con DoD de entrega propio sin comandos] → todo criterio cae en `confirmación`: el skill sigue funcionando con evidencia humana.
- [STORY-160 edita la misma frase del invariante] → D-9 fija que esta historia solo retira `DELIVER`; orden de implementación: STORY-159 antes que STORY-160.
- [Trade-off: sin `delivery-report.md`] → la evidencia no queda persistida; se acepta por el alcance mínimo de la épica y queda abierto para una historia futura.

## Open Questions

Ninguna bloqueante. Las ambigüedades detectadas se resolvieron en D-2, D-3, D-5, D-8 o se registran como CR.

## Autoevaluación (P9, P10)

- **Cobertura:** AC-1 → D-1…D-8, F-1; AC-2 → D-1, D-4, D-5, F-2; AC-3 → D-9, C-6…C-11; CNF-1 → D-10; CNF-2 → CR-001; CNF-3 → D-5, D-6, F-2; CNF-4 → C-3, D-7.
- **Omisiones:** sin flags, sin `continuous` (Non-Goals explícitos). Reanudación: no aplica (sin estado intermedio).
- **Ambigüedad:** «el comando o archivo que lo evidencia» para criterios no observables → resuelto con `confirmación humana` como evidencia (D-3).
- **Nombres:** un solo término por concepto: «entrega», «DoD de entrega», «no aplica en batch», «confirmación final».
- **Estructura:** sin ciclos (skill → config/DoD/story.md; `dod-story.js` solo lee SKILL.md); cada componente una responsabilidad.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: reutilización
- **Descripción**: CNF-2 pide agregar `skills/story-delivery` al arreglo `files` de `package.json`, pero `files` ya incluye `skills/` completo (`["skills/", "config/", "scripts/", "sddf.config.yaml", "README.md", "LICENSE"]`); añadir la entrada sería redundante.
- **Documento afectado**: story.md (CNF-2)
- **Acción requerida**: no modificar `package.json`; CNF-2 se verifica con `npm pack --dry-run` (contrato 7). Opcional: reformular CNF-2 como «`skills/story-delivery` se incluye en el paquete publicado».

### CR-002
- **Tipo**: dependencia
- **Descripción**: la historia no menciona que el gate exige evals o excepción por skill (`verify-eval-inventory`) ni la comprobación `DOD_STAGES`/UT-003 de `memory-system`. Sin C-3, C-4 y C-5, CNF-4 falla.
- **Documento afectado**: design.md
- **Acción requerida**: incluidos como C-3, C-4 y C-5; sin cambio en story.md.

### CR-003
- **Tipo**: dependencia
- **Descripción**: además de los tres documentos de AC-3, la prohibición aparece en `docs/architecture/state-machine.md`, `docs/guides/sddf-commands-pipeline.md` y `README.md`. Dejarlos sin cambios incumple la regla de Veracidad de `AGENTS.md`.
- **Documento afectado**: design.md
- **Acción requerida**: incluidos como C-9, C-10 y C-11; sin cambio en story.md.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: la historia no define el comportamiento con DoD de entrega ausente ni con `delivery-model` distinto de `batch` dentro de su alcance.
- **Documento afectado**: design.md
- **Acción requerida**: resuelto como fail-closed sin cambios (D-2, D-8); STORY-162 sustituye la rama de D-2.

### CR-005
- **Tipo**: conflicto con guardrail (registrado en implementación, 2026-10-25)
- **Descripción**: D-10 pedía `triggers` y `outputs` en el frontmatter del SKILL.md, pero `docs/guardrails/gr-skill-creation-checklist.md` (`skill-frontmatter-keys`, error) solo admite `name`, `description`, `allowed-tools` y `license`. Prevalece el guardrail (flujo de autoridad de `AGENTS.md`).
- **Documento afectado**: design.md (D-10)
- **Acción requerida**: el frontmatter de `skills/story-delivery/SKILL.md` declara solo `name` y `description`; los disparadores van dentro de `description` y la salida en `## Salida`.

### CR-006
- **Tipo**: dependencia / seguridad (registrado en implementación, 2026-10-25)
- **Descripción**: (a) la prohibición de que un skill escriba `DELIVER` aparecía además en `docs/requirements/functional/FR-046-…md`, `docs/guardrails/README.md` y `skills/memory-system/references/dod-rules.md`; se ajustaron por la regla de Veracidad, igual que C-9…C-11. (b) Por `gr-ai-security-checklist`, el método `comando` de D-3 solo ejecuta comandos de verificación (no escriben, no publican, no despliegan); un comando citado que podría hacerlo se evalúa como `confirmación`, y la salida de los comandos se trata como dato no confiable. (c) `docs/index.md` se regeneró con `memory-system index` porque tenía un enlace roto previo (`EPIC-23-skill-epic-validate`, renombrada en `c2e8fc2`) que hacía fallar `verify:repository`.
- **Documento afectado**: design.md (Componentes afectados, D-3)
- **Acción requerida**: ninguna adicional; el contrato de D-3 se conserva para comandos de verificación.
