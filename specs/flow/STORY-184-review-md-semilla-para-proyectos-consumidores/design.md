---
alwaysApply: false
type: design
id: STORY-184
slug: STORY-184-review-md-semilla-para-proyectos-consumidores-design
title: "Design: REVIEW.md semilla para proyectos consumidores"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-184
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-184-review-md-semilla-para-proyectos-consumidores
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-179-review-md-de-agile-sddf
  - STORY-180-story-code-review-lee-review-md
---

<!-- Referencias -->
[[STORY-184-review-md-semilla-para-proyectos-consumidores]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-178-adr-guia-de-revision]] · [[STORY-179-review-md-de-agile-sddf]] · [[STORY-180-story-code-review-lee-review-md]]

# Diseño técnico: REVIEW.md semilla para proyectos consumidores

## Context

`/sddf-constitution` es el skill que un proyecto consumidor ejecuta para crear su gobernanza (constitución y DoD por etapa). La historia le añade un paso: copiar `REVIEW.md` a la raíz desde una plantilla del skill cuando no existe, y no tocarlo nunca si ya existe. Es la misma regla de «copia si falta» que ya aplica a los `dod-story-<etapa>.md`.

Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `skills/sddf-constitution/SKILL.md` | Pasos 0-5. Paso 3 (238-301) crea los DoD que faltan desde `assets/dod-story/` y «ningún archivo existente se sobrescribe desde este paso» (301). Las salidas por 3a (269), 3b `n` (299) y 3c (341) dicen «continuar con el Paso 4». Paso 4 (343-396) registra `@docs/constitution.md` en `CLAUDE.md`/`AGENTS.md`; Paso 5 (398-415) es el resumen. `## Entrada` (39-43), `## Dependencias` (55-58) y `## Salida` (417-422) no mencionan `REVIEW.md`. Modo automático: invocado por `sddf-init` sin interacción (63). |
| `skills/sddf-constitution/assets/` | `project-constitution-template.md` y `dod-story/` (seis plantillas). No hay plantilla de `REVIEW.md`. |
| `skills/sddf-constitution/evals/` | No existe. |
| `config/eval-exemptions.json` | Única exención: `sddf-constitution` («Pendiente de fixtures…», `review_by: 2026-12-31`). |
| `scripts/verify-eval-inventory.js:105-116` | Si un skill tiene `evals/evals.json` y sigue exento, falla con «ya tiene evals y no debe seguir exento». Cada caso necesita un `id` `TC-NNN` único. |
| `test/sddf-constitution.test.js` | E2E-001 (102-140) lista los artefactos obligatorios del skill. EV-003 (196-205) **afirma** que `sddf-constitution` está en `missing` y en `exemptions`. IT-001 (225-245) instala el paquete en cada runtime soportado y comprueba que el skill llega. |
| `docs/templates/REVIEW-template.md` | 64 líneas, sin frontmatter: comentario de uso (1-17), H1 con `[nombre del proyecto]`, introducción con el vocabulario (21-22) y cuatro `##`: `Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM` (24), `Tope de nits — 🟡 Nit · LOW` (38), `No reportar` (44), `Verificar siempre` (55). |
| `test/epic-template.test.js:26,82-84` | Precedente de plantilla duplicada: la semilla vive en `skills/epic-creation/assets/`, la copia central en `docs/templates/`, y UT-002 exige igualdad byte a byte. |
| `skills/sddf-init/SKILL.md:120-136` | Paso 2b copia a `docs/templates/` los templates compartidos desde el `assets/` de su skill dueño. `REVIEW-template.md` no está en la tabla. |
| `skills/sddf-init/evals/evals.json` | Precedente de evals de un skill de bootstrap: casos solo con `input.context` y `expected.contains`/`not_contains`, sin `sandbox`. |
| `scripts/run-evals.js:166-169` | Un caso con `sandbox` se ejecuta sobre una copia desechable y califica `expected.files.written`. |
| `package.json:22-29` | `files` incluye `skills/`, así que todo `skills/sddf-constitution/assets/` se publica. No incluye `REVIEW.md` de la raíz. |
| ADR de la guía de revisión (STORY-178, D-2) | `REVIEW.md` vive en `<REPO_ROOT>/REVIEW.md`. Los consumidores reciben la semilla con `/sddf-constitution` (STORY-184). |

Stack: skill Markdown en español, evals JSON (`npm run test:eval`) y pruebas `node:test` (CommonJS) en `test/`.

## Goals / Non-Goals

**Goals:**

- Nuevo Paso 4 de `sddf-constitution` que crea `<REPO_ROOT>/REVIEW.md` desde `assets/REVIEW-template.md` si no existe e informa `✅ Creado: REVIEW.md`. // satisface: AC-1
- Si `REVIEW.md` existe, el paso no lo escribe, informa `ℹ️ Conservado: REVIEW.md (ya existe)` y el resto del flujo sigue igual. // satisface: AC-2, AC-3
- La plantilla del skill es idéntica byte a byte a `docs/templates/REVIEW-template.md`, y una prueba detecta la divergencia. // satisface: CNF-1
- Se publica en npm y se instala con el skill. // satisface: CNF-2
- `evals/evals.json` de `sddf-constitution` con los casos de `REVIEW.md`, escrito antes de cambiar el skill. // satisface: CNF-3
- UTF-8 sin BOM y sin caracteres invisibles en todo lo creado. // satisface: CNF-4

**Non-Goals:**

- Rellenar `REVIEW.md` con los riesgos del proyecto: la semilla conserva los placeholders (historia, Fuera de alcance).
- El `REVIEW.md` de agile-sddf ni modificar `docs/templates/REVIEW-template.md` (STORY-179, STORY-178).
- Que `/story-code-review` lea `REVIEW.md` (STORY-180).
- Añadir `REVIEW-template.md` a la tabla de templates compartidos de `sddf-init` (Paso 2b). El consumidor recibe directamente `REVIEW.md` y no necesita la plantilla en `docs/templates/` (P12).
- Evals de comportamiento de la constitución y del DoD (la exención decía «pendiente de fixtures»). Esta historia solo crea los casos de `REVIEW.md` (ver D-5 y CR-001).
- Cambiar `sddf-init`, `story-code-review`, `package.json` o los scripts del gate.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Plantilla semilla de la guía de revisión | crear (copia byte a byte de `docs/templates/REVIEW-template.md`) | `skills/sddf-constitution/assets/REVIEW-template.md` | AC-1, CNF-1, CNF-2, CNF-4 |
| C-2 | Paso «Sembrar REVIEW.md» del skill | modificar | `skills/sddf-constitution/SKILL.md`: frontmatter `description`, «Qué hace este skill», `## Entrada`, `## Dependencias`, Paso 4 nuevo, renumeración de los Pasos 4→5 y 5→6, resumen, `## Salida` | AC-1, AC-2, AC-3 |
| C-3 | README del skill | modificar | `skills/sddf-constitution/README.md`: «What it does», `## Input`, `## Output` | AC-1, AC-2 |
| C-4 | Evals del skill | crear | `skills/sddf-constitution/evals/evals.json` | CNF-3, AC-1, AC-2, AC-3 |
| C-5 | Inventario de exenciones | modificar (retirar la de `sddf-constitution`) | `config/eval-exemptions.json` | CNF-3 |
| C-6 | Pruebas del skill | modificar | `test/sddf-constitution.test.js`: E2E-001, EV-003, IT-001 y casos nuevos UT-001, UT-002, EV-005 | CNF-1, CNF-2, CNF-3, CNF-4, AC-1 |

Sin cambios: `docs/templates/REVIEW-template.md`, `package.json`, `sddf-init`, `story-code-review`, `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — Origen y destino de la semilla | Origen: `assets/REVIEW-template.md`, relativo al directorio del skill instalado (como `assets/dod-story/`). Destino: `<REPO_ROOT>/REVIEW.md`. Solo la raíz: nunca un `REVIEW.md` de subdirectorio (ADR de STORY-178, D-2). | AC-1, CNF-1 |
| I-2 — Condición de creación | Se crea **solo** si no existe ninguna entrada en `<REPO_ROOT>/REVIEW.md` (archivo, directorio o enlace). La condición es la existencia, no el contenido: el paso nunca lee, compara ni pregunta por un `REVIEW.md` existente. | AC-1, AC-2, AC-3 |
| I-3 — Copia | El contenido del destino es el de la plantilla, sin cambios: se conservan el comentario de uso, los `<!-- instrucción -->` y los `[placeholders]`. No se añade frontmatter ni fecha (la plantilla no tiene). | AC-1, CNF-4 |
| I-4 — Mensajes | Creado: `✅ Creado: REVIEW.md` y debajo `   Edita sus [placeholders]: Qué es «Importante» aquí · Tope de nits · No reportar · Verificar siempre`. Conservado: `ℹ️ Conservado: REVIEW.md (ya existe)`. Plantilla ausente: `⚠️ Plantilla no encontrada: assets/REVIEW-template.md — REVIEW.md no creado`. Fallo de escritura: `❌ No se pudo crear REVIEW.md: <motivo>`. Son literales: los evals (C-4) y EV-005 (C-6) los comprueban. | AC-1, AC-2 |
| I-5 — Línea del resumen (Paso 6) | Bloque `📝 Guía de revisión:` con `- REVIEW.md   [creado \| conservado \| no creado]`. | AC-1, AC-2 |
| I-6 — Igualdad de plantillas | `fs.readFileSync(C-1).equals(fs.readFileSync('docs/templates/REVIEW-template.md'))`. Si falla, UT-001 nombra las dos rutas. | CNF-1 |

## Decisions

### D-1 — La plantilla del skill es la semilla; `docs/templates/` es la copia central // satisface: CNF-1, CNF-2

`assets/REVIEW-template.md` es lo que se publica y lo que lee el skill instalado. `docs/templates/REVIEW-template.md` es la copia central del repo (STORY-178/179). Un cambio se hace en las dos en el mismo commit, y UT-001 falla si difieren byte a byte. Es el mismo patrón que `epic-template.md` (`test/epic-template.test.js`, UT-002). Así queda resuelta la observación N/CNF-1 del informe FINVEST: la divergencia la detecta `npm test`, que corre dentro de `verify:repository`.

| Alternativa | Motivo del rechazo |
|---|---|
| Que el skill lea `docs/templates/REVIEW-template.md` del proyecto consumidor | En el consumidor esa ruta solo existe si alguien la copió: `sddf-init` no la centraliza y `docs/` no se publica. El skill fallaría en un proyecto recién instalado, que es justo el caso de AC-1. |
| Generar la plantilla en `install` (script que copie `docs/templates/` → `assets/`) | Añade un paso de build a un paquete que publica sus fuentes tal cual (`package.json › files`). Una prueba de igualdad basta y tiene precedente. |
| Un nuevo verificador en `scripts/` | Ya hay un patrón de prueba unitaria para lo mismo. Un script para una sola pareja de archivos es complejidad sin necesidad (P12). |

### D-2 — Paso 4 nuevo, entre el DoD y el registro en `CLAUDE.md` // satisface: AC-1, AC-2

El paso se inserta como **Paso 4 — Sembrar REVIEW.md**. El antiguo Paso 4 (registro en `CLAUDE.md`/`AGENTS.md`, subpasos 4a-4c) pasa a ser Paso 5 (5a-5c), y el antiguo Paso 5 (resumen), Paso 6. Las tres salidas del Paso 3 que dicen «continuar con el Paso 4» (3a, 3b `n`, 3c) siguen siendo correctas sin editarlas: el siguiente paso es ahora la semilla. El paso se ejecuta siempre, en modo manual y en modo automático, sin preguntar y sin depender de las respuestas de los Pasos 2 y 3.

| Alternativa | Motivo del rechazo |
|---|---|
| Subpaso 3d dentro del DoD | El Paso 3 tiene salidas anticipadas (3a con DoD heredado, 3b `n` saltar) que se saltarían la semilla, y AC-2 pide que el resto del flujo no cambie. Además el DoD es un guardrail y `REVIEW.md` no lo es: mezclaría responsabilidades (P11). |
| Paso 1 «Preparar directorios» | El Paso 1 prepara `docs/policies/` y `docs/guardrails/`. `REVIEW.md` vive en la raíz, no en `docs/`. |
| Añadirlo al final, tras el resumen | El resumen no podría informar el resultado (I-5). |

### D-3 — Condición por existencia, sin preguntar // satisface: AC-2, AC-3

El paso comprueba si existe `<REPO_ROOT>/REVIEW.md` y, si existe, no lo abre. No ofrece «sobrescribir» ni «editar», a diferencia de la constitución (Paso 2c). Por eso AC-3 se reduce a AC-1 seguido de AC-2: la segunda ejecución encuentra el archivo de la primera y lo conserva. La restricción «Sin sobreescritura silenciosa» del skill se cumple sin más: nunca se sobrescribe.

| Alternativa | Motivo del rechazo |
|---|---|
| Preguntar `(s) sobrescribir / (n) conservar` como en la constitución | AC-2 exige que quede byte a byte igual, y en modo automático (`sddf-init`) no hay a quién preguntar. Una opción de sobrescribir arriesga perder la guía del equipo por una sola tecla. |
| Comparar con la plantilla y avisar si el usuario no la editó | Lee contenido ajeno sin necesidad. La historia no pide detectar placeholders sin rellenar (Fuera de alcance). |

### D-4 — Copia literal, con comentarios y placeholders // satisface: AC-1, CNF-4

`REVIEW.md` sale igual que la plantilla, incluidos el comentario de uso (que explica cómo rellenarla y pide borrar los comentarios al terminar) y los `<!-- instrucción -->`. La línea `Edita sus [placeholders]…` del mensaje (I-4) dirige al usuario a las cuatro secciones.

| Alternativa | Motivo del rechazo |
|---|---|
| Quitar los comentarios al copiar | El usuario pierde las instrucciones justo cuando tiene que rellenar los placeholders. |
| Sustituir `[nombre del proyecto]` por el `name` de `package.json` | No todos los consumidores tienen `package.json`, y la historia deja el relleno al usuario (Fuera de alcance). |

### D-5 — Evals de contexto, sin sandbox // satisface: CNF-3, AC-1, AC-2, AC-3

`evals/evals.json` (versión `1.0.0`, `story: STORY-184`) sigue el formato de `sddf-init`: cada caso describe el proyecto en `input.context` y califica la salida con los literales de I-4.

| Caso | Tipo | Escenario (`input.context`) | `contains` | `not_contains` | AC |
|---|---|---|---|---|---|
| TC-001 `crea-review-md-si-falta` | happy-path | Proyecto con agile-sddf instalado, sin `REVIEW.md` en la raíz. Ya existen `docs/constitution.md`, los seis DoD y `@docs/constitution.md` en `CLAUDE.md`. El usuario responde `n` a cada pregunta. | `✅ Creado: REVIEW.md`, `Qué es «Importante» aquí`, `Tope de nits`, `No reportar`, `Verificar siempre` | `ℹ️ Conservado: REVIEW.md`, `[ERROR]` | AC-1 |
| TC-002 `conserva-review-md-existente` | edge-case | Igual, pero con un `REVIEW.md` propio en la raíz. | `ℹ️ Conservado: REVIEW.md (ya existe)`, `docs/constitution.md` | `✅ Creado: REVIEW.md`, `Sobreescribir` | AC-2 |
| TC-003 `segunda-ejecucion-no-modifica-review-md` | edge-case | `REVIEW.md` creado por una ejecución anterior de `/sddf-constitution`, idéntico a la plantilla. | `ℹ️ Conservado: REVIEW.md (ya existe)` | `✅ Creado: REVIEW.md` | AC-3 |
| TC-004 `plantilla-ausente-no-bloquea` | fail-safe | Sin `REVIEW.md` y sin `assets/REVIEW-template.md` en el skill instalado. | `⚠️ Plantilla no encontrada: assets/REVIEW-template.md`, `docs/constitution.md` | `✅ Creado: REVIEW.md` | AC-1 (P7) |

Con los evals creados, la exención de `config/eval-exemptions.json` se retira (C-5): `verify-eval-inventory` falla si un skill con evals sigue exento. `exemptions` queda como `[]`, que el verificador acepta.

Orden (principio 11): C-4 y C-5 se escriben y se validan con `npm run verify:eval-inventory` **antes** de tocar C-2. La ejecución con LLM (`npm run test:eval -- sddf-constitution`) es manual y a criterio humano (AGENTS.md).

| Alternativa | Motivo del rechazo |
|---|---|
| Casos `sandbox` con `expected.files.written: []` para probar «byte a byte» con el runner | El skill es interactivo: para que solo cambie `REVIEW.md`, cada fixture necesitaría constitución, seis DoD, `policies/README.md` y `CLAUDE.md`, y harían falta tres fixtures (sin, con propio, con semilla). Mantener 27 archivos para una regla de existencia es desproporcionado. La igualdad de bytes se comprueba a mano con un hash (contrato 6). |
| Mantener la exención y no crear evals | CNF-3 los exige, y el principio 11 obliga a escribirlos cuando cambia el comportamiento del skill. |
| Cubrir también la constitución y el DoD | Fuera del alcance de la historia (ver Non-Goals y CR-001). |

### D-6 — Pruebas deterministas en `test/sddf-constitution.test.js` // satisface: CNF-1, CNF-2, CNF-3, CNF-4, AC-1

Se amplía el archivo de pruebas que ya cubre el skill, en lugar de crear otro:

1. **E2E-001**: `requiredArtifacts` añade `assets/REVIEW-template.md` y `evals/evals.json`.
2. **EV-003** (se reescribe): el inventario no da errores, `sddf-constitution` no está en `missing` ni en `exemptions` (antes afirmaba lo contrario).
3. **IT-001**: además de que el skill llega a cada runtime, comprueba que llega `assets/REVIEW-template.md` (CNF-2).
4. **UT-001** (nuevo): C-1 y `docs/templates/REVIEW-template.md` son iguales byte a byte (I-6, CNF-1).
5. **UT-002** (nuevo): C-1 no empieza con `EF BB BF`, no contiene code points de `ai-no-hidden-characters` (escritos en la prueba como escapes `\u`) y tiene cuatro `##` que empiezan por `Qué es «Importante» aquí`, `Tope de nits`, `No reportar` y `Verificar siempre`, en ese orden (AC-1, CNF-4). Se compara por prefijo, como pide el informe FINVEST, porque los dos primeros encabezados llevan sufijo.
6. **EV-005** (nuevo): `SKILL.md` contiene `### Paso 4 — Sembrar REVIEW.md`, `assets/REVIEW-template.md` y los literales `✅ Creado: REVIEW.md` y `ℹ️ Conservado: REVIEW.md (ya existe)`; y `evals/evals.json` tiene TC-001 a TC-004 con esos literales en `contains`/`not_contains` (CNF-3). Además, `evals.json` no tiene BOM (CNF-4).

| Alternativa | Motivo del rechazo |
|---|---|
| Un archivo nuevo `test/review-seed.test.js` | EV-003 y E2E-001 están en `test/sddf-constitution.test.js` y hay que cambiarlos igual. Dos archivos para un mismo skill dispersan el contrato. |
| Probar el comportamiento ejecutando el skill en `node:test` | El skill es Markdown que ejecuta un LLM: no hay función que llamar. Lo determinista es el contrato (literales, plantilla, inventario); el comportamiento lo cubren los evals. |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

Paso 4 de `SKILL.md` (estructura; el texto exacto de los mensajes está en I-4):

```
### Paso 4 — Sembrar REVIEW.md
  Propósito: guía de revisión inicial para /story-code-review (ADR de la guía de revisión)
  ¿Existe <REPO_ROOT>/REVIEW.md?            → sí: ℹ️ Conservado … ; no escribir ; continuar
  ¿Existe assets/REVIEW-template.md?        → no: ⚠️ Plantilla no encontrada … ; continuar
  Copiar plantilla → <REPO_ROOT>/REVIEW.md  → error: ❌ No se pudo crear … ; continuar
                                            → ok:    ✅ Creado: REVIEW.md + línea de placeholders
  Continuar con el Paso 5
```

Caso de `evals.json` (forma, igual que `sddf-init`):

```
{ id: "TC-00N", name, type, description,
  input: { context, flags: [] },
  expected: { contains: [...], not_contains: [...] },
  threshold }
```

`config/eval-exemptions.json` tras el cambio: `{ "version": 1, "exemptions": [] }`.

## Flujos clave

### F-1 — Proyecto sin `REVIEW.md` (AC-1)

1. El usuario ejecuta `/sddf-constitution`. Los Pasos 1-3 funcionan como hoy.
2. Paso 4: no existe `REVIEW.md` y existe la plantilla. Se copia e informa `✅ Creado: REVIEW.md` con la línea de placeholders.
3. Paso 5 (registro en `CLAUDE.md`) y Paso 6 (resumen, con `REVIEW.md [creado]`).

### F-2 — `REVIEW.md` ya existe (AC-2) y segunda ejecución (AC-3)

1. Pasos 1-3 como hoy.
2. Paso 4: existe `REVIEW.md`. No se abre ni se escribe; se informa `ℹ️ Conservado: REVIEW.md (ya existe)`.
3. Pasos 5 y 6 como en F-1, con `REVIEW.md [conservado]`.

En AC-3, la primera ejecución sigue F-1 y la segunda, F-2.

### F-3 — Degradación // P7

- **Plantilla ausente** (instalación parcial o manual): `⚠️ Plantilla no encontrada…`, no se crea nada y el flujo sigue (TC-004). No bloquea: la guía es opcional para `/story-code-review` (STORY-180 trata su ausencia como advertencia).
- **Fallo al escribir** (permisos, disco): `❌ No se pudo crear REVIEW.md: <motivo>` y el flujo sigue. El resumen marca `no creado`.
- **`REVIEW.md` es un directorio o un enlace roto**: cuenta como existente (I-2) y se conserva. Nunca se borra ni se reemplaza.
- **Plantillas divergentes en el repo**: UT-001 falla en `npm test` y el gate no pasa. Se corrige la copia, nunca la prueba.

### F-4 — Puntos de cambio // P6

- La forma de la guía cambia en `docs/templates/REVIEW-template.md` y en C-1 a la vez (D-1). UT-002 cambia solo si cambian los encabezados.
- Si algún día `sddf-init` centraliza la plantilla en `docs/templates/`, basta añadir una fila a su Paso 2b con dueño `sddf-constitution`. C-1 ya es el origen.
- Si se añaden evals de la constitución o del DoD, van en el mismo `evals.json` con `TC-005` en adelante.

## Decisiones de complejidad justificada

- **Dos copias de la plantilla (D-1):** el skill instalado no puede leer `docs/` del paquete. Duplicar con una prueba de igualdad es más simple que un paso de build.
- **Renumerar dos pasos (D-2):** la alternativa sin renumerar (subpaso 3d) se salta la semilla por las salidas del Paso 3. La renumeración solo toca dos encabezados y tres de subpaso; las referencias del Paso 3 siguen siendo válidas.
- **Cuatro casos de eval en vez de dos (D-5):** TC-003 corresponde a un AC propio (AC-3), y TC-004 cubre la única degradación del paso. Cada uno es un objeto JSON, sin fixtures.
- Sin script nuevo, sin fixtures y sin cambiar el gate.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | La plantilla del skill existe y es idéntica a la central | UT-001 y E2E-001 (`node --test test/sddf-constitution.test.js`) | CNF-1 |
| 2 | La plantilla tiene las cuatro secciones en orden, sin BOM ni caracteres invisibles | UT-002 | AC-1, CNF-4 |
| 3 | `SKILL.md` declara el Paso 4 con sus literales y los evals los usan | EV-005 | AC-1, AC-2, CNF-3 |
| 4 | El inventario reconoce los evals y no hay exención | EV-003; `npm run verify:eval-inventory` | CNF-3 |
| 5 | La plantilla se publica y se instala | IT-001; `npm pack --dry-run` lista `skills/sddf-constitution/assets/REVIEW-template.md` | CNF-2 |
| 6 | `REVIEW.md` existente queda byte a byte igual | Manual en VERIFY: en un proyecto temporal con `REVIEW.md` propio, hash SHA-256 antes y después de `/sddf-constitution` | AC-2 |
| 7 | Crea, conserva y segunda ejecución | `npm run test:eval -- sddf-constitution` (TC-001 a TC-004), a criterio humano | AC-1, AC-2, AC-3 |
| 8 | Evals antes del cambio del skill | El orden de `tasks.md` y del historial: C-4/C-5 antes de C-2 | CNF-3 |
| 9 | Gate verde | `npm test` y `npm run verify:repository` | CNF-2, CNF-3, CNF-4 |
| 10 | Codificación | Comando `ai-no-hidden-characters` de `docs/guardrails/gr-ai-security-checklist.md` sobre C-1 a C-4 | CNF-4 |

## Risks / Trade-offs

- **[Dependencia] STORY-180 aún no implementada** → la semilla se crea igual, pero `/story-code-review` no la leerá hasta STORY-180. La historia recomienda implementarla después (Notas), y no bloquea (CR-003).
- **[Riesgo] Cambiar la plantilla central y olvidar la del skill** → UT-001 falla en el gate.
- **[Riesgo] Al retirar la exención, el skill queda «con evals» aunque solo cubren `REVIEW.md`** → la descripción de `evals.json` lo dice expresamente y CR-001 lo registra.
- **[Trade-off] La igualdad byte a byte de AC-2 no la comprueba el runner** → es una regla de existencia sin lectura (I-2). Se verifica a mano una vez (contrato 6) y los evals comprueban que no se anuncia ninguna escritura.
- **[Limitación] Un consumidor con `REVIEW.md` en un subdirectorio** recibe igual la semilla en la raíz. Es lo que fija el ADR (D-2): solo cuenta la raíz.

## Open Questions

Ninguna. La fuente de la plantilla (observación FINVEST) se decide en D-1 y el mensaje literal de AC-2 en I-4.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → I-1, I-3, I-4, D-2, D-4, TC-001; AC-2 → I-2, D-3, TC-002, contrato 6; AC-3 → D-3, TC-003; CNF-1 → D-1, UT-001; CNF-2 → IT-001, contrato 5; CNF-3 → D-5, C-4, C-5, EV-003, EV-005; CNF-4 → UT-002, contrato 10. Todos tienen contrato de verificación.
- **Ambigüedad:** «informa que lo conserva» (AC-2) se fija con un literal en I-4. Las secciones de AC-1 se comparan por prefijo (UT-002).
- **Nombres:** «semilla», «guía de revisión» y «plantilla» como en la historia y en EPIC-28. El paso se llama «Sembrar REVIEW.md».
- **Estructura:** sin dependencias cíclicas: el paso lee la plantilla, la prueba lee plantilla, skill y evals, y nadie lee la prueba. Cada componente tiene una sola razón de cambio. Sin código en el diseño.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: CNF-3 crea `skills/sddf-constitution/evals/`, pero la historia no dice que eso obliga a retirar la exención de `config/eval-exemptions.json` (`verify-eval-inventory` falla si no) ni a reescribir EV-003 de `test/sddf-constitution.test.js`, que hoy afirma que el skill está exento. La exención cubría además las fixtures de constitución y DoD, que esta historia no crea.
- **Documento afectado**: design.md
- **Acción requerida**: incluidos como C-5 y C-6. Si se quieren evals de la constitución y del DoD, abrir una historia aparte; no se recrea la exención.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: AC-2 dice «el skill informa que lo conserva» sin fijar el texto, y AC-1 lista las secciones por nombre corto, mientras que dos encabezados de la plantilla llevan sufijo (informe FINVEST, T).
- **Documento afectado**: story.md
- **Acción requerida**: ninguna para implementar: I-4 fija `ℹ️ Conservado: REVIEW.md (ya existe)` y UT-002 compara por prefijo. Opcionalmente, citar el literal en AC-2.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la nota «Implementar después de STORY-180» es una recomendación de orden, no un bloqueo: el paso funciona sin STORY-180, pero la semilla no tendrá efecto en `/story-code-review` hasta entonces.
- **Documento afectado**: story.md
- **Acción requerida**: ninguna. Opcionalmente, moverla a `related` o «Fuera de alcance», como sugiere el informe FINVEST.
