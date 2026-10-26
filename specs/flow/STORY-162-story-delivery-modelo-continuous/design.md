---
alwaysApply: false
type: design
id: STORY-162
slug: STORY-162-story-delivery-modelo-continuous-design
title: "Design: story-delivery en modelo continuous"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-162
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-162-story-delivery-modelo-continuous
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-163-story-delivery-dry-run-y-force
---

<!-- Referencias -->
[[STORY-162-story-delivery-modelo-continuous]] · [[EPIC-27-completar-flujo-de-story]] · [[STORY-159-story-delivery-interactivo]] · [[STORY-163-story-delivery-dry-run-y-force]]

# Diseño técnico: story-delivery en modelo continuous

## Context

STORY-159 crea el skill `story-delivery` solo para `delivery-model: batch` y deja en su Paso 2 una rama provisional: cualquier valor distinto de `batch` termina con `❌ story-delivery solo soporta delivery-model: batch (valor leído: <valor | ausente>)` (D-2 y F-4 de su `design.md`). Esta historia reemplaza esa rama: añade el modelo `continuous`, en el que `DELIVER` significa «incremento ya desplegado», y fija el mensaje definitivo cuando el valor falta o no es válido.

Estado actual verificado en el filesystem (2026-10-25):

- `skills/story-delivery/` **todavía no existe**: STORY-159 está en `READY-FOR-IMPLEMENT/DONE` (con `analyze.md` `verdict: APPROVED`) y aún no se implementó. Todos los componentes de esta historia modifican archivos que crea STORY-159 (ver CR-001).
- `sddf.config.yaml` declara `defaults.delivery-model: batch # batch | continuous`: el valor lleva comentario en línea, que la lectura debe descartar.
- `docs/domains/domain-story-lifecycle.md` define `DeliveryModel` como objeto de valor inmutable con valores `batch` y `continuous` (línea 59) y el doble significado de `DELIVER` (líneas 162–164): `continuous` = incremento ya desplegado en producción. No requiere cambios.
- `docs/guardrails/dod-story-deliver.md` (`enforcement: error`, siete criterios) incluye como último criterio «El paquete publicado puede instalarse limpiamente con `npm install agile-sddf` y ejecutarse sin errores». En `batch`, STORY-159 lo marca «no aplica en batch» (regla 1 de su tabla D-3). Ese mismo criterio cita un comando entre backticks, así que sin una regla explícita para `continuous` caería en la regla 2 (`comando`) y el skill ejecutaría `npm install agile-sddf` sobre el repositorio.
- La épica (`epic.md`, «Notas») fija que el skill no ejecuta despliegues: «en `continuous`, el paso irreversible es confirmar que el incremento ya está desplegado».
- `skills/story-verify/SKILL.md` lee el mismo campo y asume `batch` si falta (línea 241). Es otro skill y queda fuera de alcance (ver Risks).
- La convención de fallar cerrado ante valores inválidos ya existe en el repo (`npm run test:eval` con selección inválida, `--strategy` de STORY-161), como cita la nota de la historia.

Stack: el «código de producción» son skills en Markdown (`sddf.config.yaml › implement.code_generators: monolithic → skill-master`), probados con evals (`test_generators: eval → skill-test-evals`). Esta historia no toca scripts Node.js ni pruebas `node --test`.

## Goals / Non-Goals

**Goals:**

- Resolver el modelo de entrega en un único paso con tres salidas: `batch`, `continuous` o fallo cerrado con la lista de valores válidos. // satisface: AC-1, AC-3
- En `continuous`, pedir al usuario que afirme el despliegue antes de evaluar el DoD; sin afirmación, detener sin cambios con el motivo. // satisface: AC-1, AC-2
- En `continuous`, evaluar el criterio de paquete publicado o incremento desplegado con confirmación humana, sin ejecutar nunca despliegues ni instalaciones. // satisface: AC-1
- Los caminos de bloqueo nuevos (AC-2, AC-3) no escriben ni crean archivos. // satisface: CNF-1
- Gate en verde. // satisface: CNF-2

**Non-Goals:**

- Ejecutar, disparar o verificar automáticamente el despliegue.
- `--dry-run`, `--force` y su relación con la afirmación de despliegue (STORY-163; ver F-4).
- El modelo `batch` y los documentos de dominio (STORY-159): el comportamiento en `batch` no cambia.
- Alinear `story-verify` con el fallo cerrado ante `delivery-model` ausente.
- Persistir la afirmación de despliegue en un archivo (la evidencia se muestra en consola, D-6 de STORY-159).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Skill `story-delivery` | modificar (creado por STORY-159) | `skills/story-delivery/SKILL.md`: `## Objetivo`, `## Posicionamiento`, `## Restricciones / Reglas`, Paso 2 (resolución del modelo y afirmación de despliegue), Paso 4 (regla 1 de la tabla de evidencia por modelo), `## Salida` | AC-1, AC-2, AC-3, CNF-1 |
| C-2 | README del skill | modificar (creado por STORY-159) | `skills/story-delivery/README.md`: alcance `batch` + `continuous`, valores válidos de `delivery-model`, `continuous` deja de ser «extensión prevista» | AC-1, AC-3 |
| C-3 | Evals del skill | modificar (creado por STORY-159) | `skills/story-delivery/evals/evals.json`: `version` `1.1.0`; TC-005 reescrito; TC-007…TC-009 nuevos (ver Esquema de datos) | AC-1, AC-2, AC-3, CNF-1, CNF-2 |

Sin cambios: `sddf.config.yaml` (el comentario `# batch | continuous` ya documenta los valores), `docs/guardrails/dod-story-deliver.md` (D-3), `docs/domains/*` (el significado de `DELIVER` por modelo ya está documentado y la redacción de STORY-159 sobre `story-delivery` no depende del modelo), `skills/memory-system/scripts/dod-story.js`, `test/`, `package.json`, `skills/story-verify/SKILL.md`.

## Decisions

### D-1 — Resolución del modelo: un paso, tres salidas, fallo cerrado // satisface: AC-1, AC-3

El Paso 2 del SKILL.md (punto de extensión que deja STORY-159) pasa a llamarse «Resolver el modelo de entrega» y lee `defaults.delivery-model` de `<REPO_ROOT>/sddf.config.yaml`. El valor leído se normaliza: se descarta el comentario en línea (desde ` #`), las comillas simples o dobles que lo envuelvan y los espacios. La comparación es exacta y en minúsculas.

| Valor normalizado | Salida |
|---|---|
| `batch` | continúa al Paso 3 con el flujo de STORY-159, sin cambios |
| `continuous` | continúa al Paso 2b (afirmación de despliegue, D-2) |
| ausente (archivo, sección `defaults` o clave inexistentes), vacío, `null` o cualquier otro (p. ej. `weekly`, `Batch`) | se detiene sin cambios con el mensaje de valor inválido |

Mensaje de valor inválido (sustituye al provisional de STORY-159):
`❌ Falta un delivery-model válido en sddf.config.yaml › defaults.delivery-model (valor leído: <valor | ausente>). Valores válidos: batch, continuous.`

El Paso 1 (precondición `ACCEPTANCE/DONE`) se mantiene antes que el Paso 2: si la historia tampoco está en `ACCEPTANCE/DONE`, gana el mensaje de estado de STORY-159. Las dos filas de Ejemplos de AC-3 (`(ausente)`, `weekly`) parten de `ACCEPTANCE/DONE`, así que llegan al Paso 2.

| Alternativa | Motivo del rechazo |
|---|---|
| Asumir `batch` si el campo falta (como `story-verify`) | Descartada en la historia («Decisión confirmada», 2026-10-25): oculta un error de configuración y rompe la convención de fallar cerrado. |
| Comparación sin distinguir mayúsculas (`Batch` válido) | `DeliveryModel` es un objeto de valor con dos literales; aceptar variantes crea un tercer contrato implícito. El mensaje lista los literales exactos, así que corregirlo es inmediato. |
| Validar el modelo antes que el estado de la historia | Invierte el orden de STORY-159 sin que lo pida ningún AC; con el estado primero, el usuario corrige primero lo que depende de la historia. |

### D-2 — En `continuous`, la afirmación de despliegue es una precondición previa al DoD // satisface: AC-1, AC-2, CNF-1

Con `continuous`, el nuevo Paso 2b hace una sola pregunta antes de resolver y evaluar el DoD:

`¿El incremento de STORY-NNN ya está desplegado en producción? (s/n)`

- `s` / `si` / `sí` (sin distinguir mayúsculas) → se registra la afirmación y continúa al Paso 3.
- Cualquier otra respuesta → se detiene sin cambios con:
  `❌ En delivery-model: continuous, DELIVER exige que el incremento ya esté desplegado. Despliega el incremento y vuelve a ejecutar /story-delivery STORY-NNN. story.md no cambió.`

El skill no ejecuta, dispara ni comprueba ningún despliegue: la afirmación es solo humana. Los Pasos 3–6 de STORY-159 siguen igual, incluida la confirmación final `¿Confirmas la entrega de STORY-NNN a DELIVER/DONE? (s/n)` del Paso 5: es la confirmación del paso irreversible en los dos modelos y la exige el dominio (D-9 de STORY-159).

| Alternativa | Motivo del rechazo |
|---|---|
| Sustituir la confirmación final por la afirmación de despliegue (lectura literal de la nota de la épica) | Obliga a evaluar todo el DoD, ejecutar `npm pack --dry-run` y responder las preguntas por criterio antes de saber que la entrega no es posible (AC-2). También haría que el Paso 5 dependa del modelo, con dos textos de confirmación y dos mensajes de rechazo para el mismo paso. Con D-2, la afirmación sigue siendo la condición irreversible propia de `continuous` que pide la épica, y se pregunta primero. |
| Preguntar la afirmación como un criterio más del DoD | El DoD es de autoría manual y compartido entre modelos (ADR-0012); un «no» se mezclaría con los criterios incumplidos de AC-2 de STORY-159 en lugar de dar el motivo propio de AC-2 de esta historia. |
| Verificar el despliegue automáticamente (consultar npm, CI o el entorno) | Fuera de alcance (Non-Goals): el skill solo pide la afirmación humana. |

### D-3 — Regla 1 de la tabla de evidencia, dependiente del modelo // satisface: AC-1

La regla 1 de la tabla D-3 de STORY-159 (criterio que exige el paquete **publicado** o el incremento **desplegado**) se mantiene como primera coincidencia, pero su método depende del modelo resuelto en el Paso 2:

| Modelo | Método | Estado posible | Evidencia mostrada |
|---|---|---|---|
| `batch` | `no-aplica-batch` (sin cambios) | `no aplica en batch` | `delivery-model: batch` (sddf.config.yaml) |
| `continuous` | `confirmación` | ✅ / ❌ | `confirmación humana (delivery-model: continuous)` |

Es decir, en `continuous` el criterio de instalación del paquete publicado se pregunta con `¿Se cumple «<criterio>»? (s/n)` como los demás criterios de confirmación, y un `n` es ❌ (bloquea con `enforcement: error`). Las reglas 2–4 no cambian. La regla 1 se evalúa **siempre antes** que la regla 2, así que los comandos que citan estos criterios (p. ej. `npm install agile-sddf`) nunca se ejecutan en ningún modelo.

Aplicado al DoD actual en `continuous`: CI, secrets e instalación del paquete publicado → `confirmación`; SemVer, CHANGELOG y `files` → `artefacto`; `npm pack --dry-run` → `comando`.

| Alternativa | Motivo del rechazo |
|---|---|
| Dar el criterio por ✅ con la afirmación de despliegue como evidencia | «Desplegado» no implica «se instala limpiamente y se ejecuta sin errores»: daría un ✅ que nadie comprobó. |
| Dejar que el criterio caiga en la regla 2 y ejecutar `npm install agile-sddf` | Modifica `package.json` y `node_modules` del repositorio, necesita red y prueba la versión del registro, no el incremento entregado. Va contra la regla «no despliega ni publica» del SKILL.md. |
| Mantener «no aplica» también en `continuous` | En `continuous` el paquete ya está publicado: el criterio aplica y omitirlo vaciaría el DoD justo en el modelo en que se puede comprobar. |

### D-4 — Sin escritura ni archivos en los caminos nuevos // satisface: CNF-1

El Paso 2 y el Paso 2b solo leen `sddf.config.yaml` y hacen preguntas; no escriben `story.md`, no crean archivos en la carpeta de la historia ni en `.tmp/`. La única escritura sigue siendo la del Paso 6 de STORY-159 (D-5 de STORY-159), a la que solo se llega con modelo válido, afirmación (en `continuous`), DoD sin bloqueo y confirmación final.

| Alternativa | Motivo del rechazo |
|---|---|
| Registrar la afirmación de despliegue en `story.md` o en un `delivery-report.md` | CNF-1 prohíbe crear archivos al bloquear; en el camino de éxito no lo pide ningún AC, y `delivery-report.md` queda reservado al override de `--force` (STORY-163). |

### D-5 — Evals: reemplazar el caso provisional y cubrir los nuevos caminos // satisface: AC-1, AC-2, AC-3, CNF-1, CNF-2

TC-005 de STORY-159 («`delivery-model: continuous` falla cerrado») queda falso con esta historia. Se reescribe para AC-3 (`weekly`) en lugar de borrarlo, para que los IDs `TC-NNN` sigan siendo contiguos, y se añaden tres casos (detalle en Esquema de datos). `version` pasa de `1.0.0` a `1.1.0` (casos nuevos, compatibles con los existentes).

| Alternativa | Motivo del rechazo |
|---|---|
| Borrar TC-005 y numerar los nuevos desde TC-007 | Deja un hueco en la numeración sin ganancia; el ID no tiene historia propia que conservar. |
| Un solo caso parametrizado para `(ausente)` y `weekly` | El formato de `evals.json` no admite parámetros por caso: cada `input` es un contexto distinto. |

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| Invocación | `/story-delivery {story_id \| story_path}`, sin cambios. Sin flags nuevos. | AC-1 |
| Lectura de configuración | `sddf.config.yaml › defaults.delivery-model`: literal `batch` o `continuous` tras normalizar (D-1). | AC-1, AC-3 |
| Mensaje de modelo inválido | `❌ Falta un delivery-model válido en sddf.config.yaml › defaults.delivery-model (valor leído: <valor \| ausente>). Valores válidos: batch, continuous.` | AC-3 |
| Afirmación de despliegue (solo `continuous`) | `¿El incremento de STORY-NNN ya está desplegado en producción? (s/n)` → `s`/`si`/`sí` continúa; otra respuesta bloquea (D-2). | AC-1, AC-2 |
| Mensaje de despliegue no afirmado | `❌ En delivery-model: continuous, DELIVER exige que el incremento ya esté desplegado. Despliega el incremento y vuelve a ejecutar /story-delivery STORY-NNN. story.md no cambió.` | AC-2 |
| Clasificación de evidencia | Regla 1 → `no-aplica-batch` en `batch`, `confirmación` en `continuous` (D-3). | AC-1 |
| Confirmación final y escritura | Las de STORY-159 (Pasos 5 y 6), sin cambios en ningún modelo. | AC-1 |

## Esquema de datos // satisface: AC-1, AC-3

**Modelo de entrega resuelto** (en memoria del agente durante la ejecución, no persistido):

| Campo | Tipo | Valores |
|---|---|---|
| `delivery_model` | enum | `batch` · `continuous` (cualquier otro valor detiene el skill en el Paso 2) |
| `despliegue_afirmado` | booleano | `true` solo en `continuous` tras `s`; no se usa en `batch` |

**Resultado por criterio:** el esquema de STORY-159 sin campos nuevos; en `continuous`, el criterio de la regla 1 tiene `metodo: confirmación` y `evidencia: confirmación humana (delivery-model: continuous)`.

**Casos de `evals.json` (C-3)**, mismo formato que los de STORY-159; en todos los casos de bloqueo `expected.not_contains` incluye `status: DELIVER` escrito y la confirmación final:

| ID | Nombre | Contexto (`input`) | Esperado | Origen |
|---|---|---|---|---|
| TC-005 (reescrito) | delivery-model inválido | `ACCEPTANCE/DONE`, `delivery-model: weekly` | mensaje de modelo inválido con `weekly`, `batch` y `continuous`; sin preguntas; `story.md` intacto | AC-3, CNF-1 |
| TC-007 | delivery-model ausente | `ACCEPTANCE/DONE`, `sddf.config.yaml` sin `defaults.delivery-model` | mensaje de modelo inválido con `ausente`, `batch` y `continuous`; `story.md` intacto | AC-3, CNF-1 |
| TC-008 | entrega en continuous con despliegue afirmado | `ACCEPTANCE/DONE`, `continuous`, DoD cumplido, respuestas `s` a la afirmación, a las confirmaciones por criterio y a la final | pregunta de despliegue; criterio de instalación evaluado por confirmación (no «no aplica en batch»); no se ejecuta `npm install`; `DELIVER/DONE` y `updated` de hoy | AC-1 |
| TC-009 | continuous sin despliegue | `ACCEPTANCE/DONE`, `continuous`, respuesta `n` a la afirmación | mensaje «DELIVER exige que el incremento ya esté desplegado»; no se evalúa el DoD ni se pregunta la confirmación final; `story.md` intacto | AC-2, CNF-1 |

TC-001…TC-004 y TC-006 de STORY-159 no cambian (su contexto ya es `delivery-model: batch`).

## Flujos clave

### F-1 — Entrega en continuous con despliegue afirmado // AC-1

1. Paso 0–1 (STORY-159): `REPO_ROOT`, historia resuelta, `ACCEPTANCE/DONE` ✓.
2. Paso 2: `defaults.delivery-model` → `continuous` ✓ (D-1).
3. Paso 2b: `¿El incremento de STORY-NNN ya está desplegado en producción?` → `s` (D-2).
4. Paso 3 (STORY-159): DoD resuelto, 7 criterios, `enforcement: error`.
5. Paso 4: clasificación con la regla 1 en modo `continuous` (D-3): la instalación del paquete publicado se pregunta; tabla mostrada.
6. Paso 5 (STORY-159): sin ❌ → confirmación final → `s`.
7. Paso 6 (STORY-159): `status: DELIVER`, `substatus: DONE`, `updated: <hoy>`; ningún despliegue ejecutado.

### F-2 — Despliegue no afirmado // AC-2, CNF-1

Pasos 1–2 de F-1; en el Paso 2b la respuesta no es `s`/`si`/`sí` → mensaje de D-2 y fin. No se ha leído el DoD, no se ha ejecutado ningún comando y no se ha escrito nada.

### F-3 — Modelo ausente o inválido // AC-3, CNF-1

Paso 1 ✓; en el Paso 2 el valor normalizado no es `batch` ni `continuous` → mensaje de D-1 y fin, sin preguntas ni escrituras.

### F-4 — Degradación y puntos de cambio // P6, P7

| Dependencia / punto | Situación | Comportamiento |
|---|---|---|
| `sddf.config.yaml` | ausente o ilegible | se trata como valor `ausente` (F-3), sin cambios |
| Respuesta a la afirmación | vacía o ambigua | cuenta como «no desplegado» (F-2): nunca se entrega sin afirmación explícita |
| Nuevo modelo de entrega | se añade un tercer literal | solo cambian la tabla de D-1, la lista del mensaje y, si hace falta, la regla 1 de D-3 |
| `--dry-run` / `--force` (STORY-163) | flags que alteran los gates | el Paso 2b es una pregunta sin escritura, así que `--dry-run` puede mantenerla; si `--force` la omite o no, lo decide STORY-163. El valor inválido de D-1 no es un gate de estado ni de DoD, así que `--force` no debería saltarlo (a confirmar en STORY-163) |

## Decisiones de complejidad justificada

- **Paso 2b separado de la confirmación final (D-2):** añade una pregunta en `continuous`, pero es la forma más simple de dar a AC-2 su motivo propio sin evaluar el DoD en vano ni bifurcar el Paso 5 por modelo.
- **Regla 1 dependiente del modelo (D-3):** una fila más en la tabla existente, no un mecanismo nuevo. Es necesaria porque, sin ella, el criterio de instalación caería en la regla de comandos y el skill ejecutaría `npm install`.
- **Normalización del valor (D-1):** descartar el comentario en línea es imprescindible: el `sddf.config.yaml` del propio repo trae `batch # batch | continuous`. Descartar las comillas y los espacios cubre la sintaxis YAML equivalente; no se añade nada más (ni alias ni mayúsculas).

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| 1 | `continuous` + afirmación + DoD cumplido + confirmación → `DELIVER/DONE`, `updated` de hoy, sin despliegue ni `npm install` ejecutado | eval TC-008 (`npm run test:eval -- story-delivery`, ejecución manual) | AC-1 |
| 2 | `continuous` + `n` → mensaje de despliegue previo, DoD no evaluado, `story.md` intacto, sin archivos nuevos | eval TC-009 | AC-2, CNF-1 |
| 3 | Valor `weekly` → mensaje con `batch` y `continuous`, `story.md` intacto | eval TC-005 | AC-3, CNF-1 |
| 4 | Valor ausente → mensaje con `ausente`, `batch` y `continuous`, `story.md` intacto | eval TC-007 | AC-3, CNF-1 |
| 5 | `batch` sin regresión: el criterio de instalación sigue en «no aplica en batch» | eval TC-001 de STORY-159 | AC-1 (no regresión) |
| 6 | El SKILL.md ya no contiene el mensaje provisional «solo soporta delivery-model: batch» | `grep -n "solo soporta" skills/story-delivery/SKILL.md` sin resultados | AC-3 |
| 7 | Gate completo | `npm run verify:repository` y `npm test` en verde (incluye `verify-eval-inventory` y `verify-fixed-layout`) | CNF-2 |

## Risks / Trade-offs

- [STORY-159 no implementada todavía] → esta historia no puede empezar hasta que existan `skills/story-delivery/SKILL.md`, `README.md` y `evals/evals.json` (CR-001). Los nombres de los pasos de este diseño (Paso 2, 2b, 4, 5, 6) siguen el `design.md` y el `tasks.md` de STORY-159; si la implementación los renumera, se aplica la misma decisión al paso equivalente.
- [Dos preguntas en `continuous` (afirmación y confirmación final)] → se acepta: la primera es una precondición (¿se puede entregar?) y la segunda el paso irreversible (¿escribo el estado?), y la segunda solo aparece después de ver la tabla del DoD.
- [Afirmación falsa del usuario] → el skill no puede comprobarla (Non-Goal); el criterio de instalación del paquete publicado sigue pidiendo su propia confirmación (D-3), así que la afirmación no basta para aprobar el DoD.
- [Incoherencia con `story-verify`, que asume `batch` si falta el campo] → fuera de alcance; un proyecto sin `delivery-model` verá el fallo cerrado de este skill al entregar, con un mensaje que dice cómo corregirlo.
- [Normalización hecha por el agente, sin parser YAML] → el contrato es corto y explícito (comentario, comillas, espacios), con evals para ausente e inválido; ante cualquier duda, el resultado es el fallo cerrado, nunca una entrega.

## Open Questions

Ninguna bloqueante. La interacción de `--dry-run`/`--force` con el Paso 2b queda para STORY-163 (F-4).

## Autoevaluación (P9, P10)

- **Cobertura:** AC-1 → D-1, D-2, D-3, F-1, TC-008; AC-2 → D-2, F-2, TC-009; AC-3 → D-1, F-3, TC-005, TC-007; CNF-1 → D-4, F-2, F-3; CNF-2 → C-3, contrato 7.
- **Omisiones:** el orden estado → modelo queda explícito (D-1); el comportamiento de `batch` no cambia (contrato 5).
- **Ambigüedad:** «afirma que el incremento ya está desplegado» → pregunta s/n con respuestas aceptadas definidas (D-2); «(ausente)» → archivo, sección, clave, vacío o `null` (D-1).
- **Nombres:** un término por concepto: «modelo de entrega» (`delivery-model`), «afirmación de despliegue» (Paso 2b), «confirmación final» (Paso 5 de STORY-159), «valor inválido».
- **Estructura:** sin ciclos; los cambios se concentran en el Paso 2 (único punto por modelo, como previó STORY-159) y en una fila de la tabla de evidencia. Cada paso tiene una responsabilidad: el 2 resuelve el modelo, el 2b es la precondición propia de `continuous`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: los tres componentes (C-1, C-2, C-3) modifican archivos que crea STORY-159, que hoy está en `READY-FOR-IMPLEMENT/DONE` sin implementar. La historia lo indica en sus notas («implementarla después de esa historia»), pero no como precondición formal.
- **Documento afectado**: story.md
- **Acción requerida**: implementar STORY-159 antes que STORY-162; `story-implement-tasks` debe comprobar que `skills/story-delivery/SKILL.md` existe antes de empezar. Opcional: declarar la dependencia en story.md.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la historia no aclara si la afirmación de despliegue sustituye a la confirmación final de STORY-159 ni cómo se trata en `continuous` el criterio del DoD que exige el paquete publicado. Leído al pie de la letra, ese criterio caería en la regla de comandos y el skill ejecutaría `npm install agile-sddf`.
- **Documento afectado**: design.md
- **Acción requerida**: resuelto en D-2 (afirmación como precondición previa, confirmación final intacta) y D-3 (regla 1 por modelo: confirmación humana en `continuous`); sin cambio en story.md.

### CR-003
- **Tipo**: dependencia
- **Descripción**: TC-005 de `skills/story-delivery/evals/evals.json` (STORY-159) afirma que `continuous` falla cerrado, y esta historia lo vuelve falso.
- **Documento afectado**: design.md
- **Acción requerida**: incluido en C-3 / D-5 (TC-005 se reescribe para el valor `weekly`).

### CR-004
- **Tipo**: dependencia
- **Descripción**: la entrada STORY-162 de `epic.md` solo describe el fallo cerrado ante un `delivery-model` inválido; tras el split, la historia también cubre el soporte de `continuous` (AC-1, AC-2).
- **Documento afectado**: epic.md (EPIC-27)
- **Acción requerida**: actualizar la descripción de STORY-162 en la épica cuando se revise (junto con INC-002 de `analyze.md` de STORY-159); no bloquea esta historia.

### CR-005
- **Tipo**: ajuste en implementación
- **Descripción**: recomendación 3 de `analyze.md`. En TC-008, `expected.not_contains` no lleva «`npm install`»: el texto del criterio del DoD que el skill muestra en la tabla contiene `npm install agile-sddf`, así que la aserción fallaría aunque no se ejecute. El contrato se verifica en positivo con la evidencia `confirmación humana (delivery-model: continuous)` y en negativo con `no aplica en batch`. En TC-009, «la tabla del DoD» se expresa con el encabezado literal `| # | Criterio | Estado | Evidencia |`.
- **Documento afectado**: `skills/story-delivery/evals/evals.json` (C-3)
- **Acción requerida**: ninguna; aplicado en T004 y T005 de `story-implement-tasks`.
