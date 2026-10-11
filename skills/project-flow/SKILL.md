---
name: project-flow
description: >-
  Orquesta Begin → Discovery → Planning componiendo /project-begin,
  /project-discovery y /project-planning sobre las capas product/ y
  requirements/, con gates de avance entre etapas.
---

# Skill: /project-flow

Guía el pipeline de especificación de un proyecto en una única sesión. El flujo detecta la primera etapa pendiente en las capas y compone el skill propietario de esa etapa; no duplica su entrevista, sus plantillas ni sus escrituras.

## Objetivo

Completar o retomar, en orden, **Begin → Discovery → Planning** usando las capas:

| Etapa | Skill compuesto | Capa que escribe el skill compuesto |
|---|---|---|
| Begin | `/project-begin` | `$SPECS_BASE/product/vision.md` |
| Discovery | `/project-discovery` | `$SPECS_BASE/product/stakeholders.md` y `$SPECS_BASE/requirements/{functional,non-functional}/` |
| Planning | `/project-planning` | `$SPECS_BASE/product/roadmap.md` |

El gate del skill de etapa aprueba su documento. El gate de este orquestador aprueba avanzar a la etapa siguiente.

## Entrada

El flujo solo lee, para detectar la etapa:

- `$SPECS_BASE/product/vision.md`
- `$SPECS_BASE/requirements/functional/FR-*.md`
- encabezados `### FR-NNN` en `$SPECS_BASE/requirements/srs-*.md`
- `$SPECS_BASE/product/roadmap.md`

Los directorios `product/` y `requirements/` pueden no existir: se tratan como capas vacías, no como un error.

## Precondiciones

Antes de componer una etapa, debe existir el archivo `$CLI_ROOT/skills/<skill>/SKILL.md` del skill correspondiente. Si falta, informa:

```text
❌ El skill <skill> no está instalado en $CLI_ROOT/skills/. Ejecuta npx agile-sddf install.
```

Después termina sin escribir.

## Dependencias

- `/project-begin`
- `/project-discovery`
- `/project-planning`

## Restricciones / Reglas

- `project-flow` no escribe en `product/` ni `requirements/` y nunca edita `substatus`.
- No verifica WIP, no resuelve plantillas y no contiene lógica de entrevistas de las etapas.
- La detección de etapa usa exclusivamente las lecturas de `## Entrada`.
- La composición es inline, sin argumentos y en la misma sesión: se lee el `SKILL.md` del skill de etapa y se siguen sus instrucciones.
- Una ausencia de respuesta en un gate elige siempre la alternativa que no avanza ni escribe.

## Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` de forma independiente, solo para localizar skills instalados; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

## Paso 1 — Detectar la etapa

Evalúa estas condiciones en orden. La primera etapa pendiente gana:

| # | Condición | Etapa |
|---|---|---|
| 1 | `vision.md` no existe, su frontmatter es ilegible o `substatus` no es `DONE` | Begin |
| 2 | `$FR_COUNT = 0` | Discovery |
| 3 | `$ROADMAP_PLANNED = false` | Planning |
| 4 | Ninguna de las anteriores | Pipeline completo |

Definiciones:

- `$FR_COUNT`: número de archivos `$SPECS_BASE/requirements/functional/FR-*.md` más encabezados `### FR-NNN` en `$SPECS_BASE/requirements/srs-*.md`. Un directorio ausente cuenta como cero.
- `$ROADMAP_PLANNED`: `$SPECS_BASE/product/roadmap.md` existe y contiene una sección `## Propuesta (` o una línea con un ID `EPIC-NN` dentro de su sección `## Épicas`.

Informa siempre:

```text
🚀 Pipeline de proyecto — estado: vision.md <substatus|ausente> · <n> FR · roadmap <planificado|sin planificar|ausente>
Etapas a ejecutar: <lista desde la etapa detectada>
```

## Paso 2 — Ejecutar y re-detectar

Mientras exista una etapa pendiente:

1. Localiza `$CLI_ROOT/skills/<skill>/SKILL.md`. Si falta, aplica la degradación indicada en `## Precondiciones`.
2. Lee ese archivo y compón el skill en esta sesión, sin argumentos. El skill propietario resuelve su raíz, realiza su entrevista y decide cuándo escribir su capa.
3. Ejecuta de nuevo exactamente la detección del Paso 1, sin conservar estado de etapa en memoria.

### Etapa no cerrada

Si la re-detección devuelve la misma etapa, informa:

```text
⏸ La etapa <Etapa> no quedó cerrada (<condición de detección que sigue pendiente>).
```

Luego usa `AskUserQuestion` con `Reintentar <Etapa>` y `Detener`. Si no hay respuesta, el valor por defecto es `Detener`. Al detener, muestra `Retoma cuando quieras con /project-flow.` y finaliza sin escribir.

### Avance a una etapa siguiente

Si la re-detección devuelve una etapa siguiente, informa:

```text
📋 Etapa <Etapa> completa.
```

Luego usa `AskUserQuestion` con `Continuar con <Siguiente>` y `Detener aquí`. Si no hay respuesta, el valor por defecto es `Detener aquí`. Al detener, muestra `Retoma cuando quieras con /project-flow.` y finaliza sin escribir.

### Cierre

Si la re-detección devuelve Pipeline completo, muestra:

```text
🎉 Pipeline de proyecto completo

- $SPECS_BASE/product/vision.md
- $SPECS_BASE/product/stakeholders.md
- $SPECS_BASE/requirements/
- $SPECS_BASE/product/roadmap.md

Siguiente comando: /epic-from-project-plan
```

## Pipeline completo al iniciar

Si el Paso 1 detecta que el pipeline ya está completo, informa:

```text
✅ El pipeline de proyecto ya está completo: visión cerrada, <n> FR y roadmap planificado.
```

Luego usa `AskUserQuestion` con `Replanificar` y `Cancelar`. Si no hay respuesta, el valor por defecto es `Cancelar` y finaliza sin escribir. Si se elige `Replanificar`, compone `/project-planning` y termina; esa etapa agrega una propuesta sin modificar las demás capas.

## Salida

Este skill no genera ni actualiza artefactos de capa directamente. Los skills compuestos son quienes escriben la visión, stakeholders, requisitos y roadmap.

## Degradación

- Skill de etapa no instalado: informa el error de `## Precondiciones` y termina sin escribir.
- Etapa no cerrada por cancelación, precondición o error: informa `⏸` y ofrece `Reintentar` o `Detener`.
- Frontmatter de `vision.md` ilegible o sin `substatus`: se trata como Begin pendiente.
- Capas `product/` o `requirements/` ausentes: se tratan como vacías.
- Sin respuesta en un gate: se usa la opción que no avanza ni escribe.
