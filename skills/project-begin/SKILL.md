---
name: project-begin
description: >-
  Produce product/vision.md mediante una entrevista de intención con project-pm. Usar para iniciar un proyecto, capturar o actualizar su visión de producto. Invocar también cuando el usuario mencione "comenzar proyecto", "iniciar proyecto", "capturar intención", "visión del producto" o "project-begin".
triggers:
  - project-begin
  - /project-begin
  - comenzar proyecto
  - iniciar proyecto
  - capturar intención
  - visión del producto
---

# Skill: `/project-begin`

## Objetivo

Orquesta una entrevista estructurada con el agente `project-pm` para completar la visión del producto en `$SPECS_BASE/product/vision.md`.

Qué hace:

- Resuelve el template de visión y el estado de `vision.md`.
- Deriva las secciones pendientes del template en runtime.
- Delega la entrevista y la escritura inicial a `project-pm`.
- Pide confirmación antes de llevar la visión a `substatus: DONE`.

No hace discovery ni planificación del proyecto.

## Entrada

- `$SPECS_BASE/templates/vision-template.md`, o el seed `assets/vision-template.md`.
- `$SPECS_BASE/product/vision.md`, opcional.

## Precondiciones

- La raíz se resuelve antes de escribir mediante `SDDF_ROOT` válido, `sddf.config.yaml.root` válido o `docs`.
- Debe existir el template central o el seed del skill.

## Dependencias

- Agente: `project-pm`.

## Modos de ejecución

| Estado de `vision.md` | Modo | Comportamiento |
|---|---|---|
| No existe o `TODO` | `full` | Entrevista todas las secciones hoja. |
| `IN-PROGRESS` | `resume` | Entrevista solo las secciones pendientes. |
| `DONE` | — | Ofrece `Actualizar` o `Cancelar`; no escribe antes de elegir. |
| Otro o ausente | `full` | Advierte y lo trata como `TODO`. |

## Restricciones

- El template es de solo lectura y la única fuente de estructura.
- No se crea ningún directorio de proyecto ni se deriva un ID de proyecto.
- `vision.md` se escribe en UTF-8 sin BOM.
- El cierre de la visión requiere una confirmación explícita del desarrollador.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y `SPECS_BASE`:

1. Si `SDDF_ROOT` está definida, debe ser un directorio accesible; úsala como `SPECS_BASE`. Una fuente explícita inválida detiene el flujo sin escribir.
2. Si no hay `SDDF_ROOT`, lee `sddf.config.yaml`; su `root` no vacío debe resolver a un directorio accesible, relativo a `REPO_ROOT` cuando corresponda.
3. Si no hay fuente explícita, usa `docs` relativo a `REPO_ROOT`.

El diagnóstico se solicita explícitamente con `/skill-preflight`; no se ejecuta en este flujo.

### Paso 1 — Resolver el template de visión

Busca `$SPECS_BASE/templates/vision-template.md` como fuente de verdad. Si no existe, usa `assets/vision-template.md` y muestra:

> ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/templates/`.

Si ninguno existe, informa y termina sin escribir:

> ❌ Template `vision-template.md` no encontrado. Ejecuta `sddf-init`.

Conserva la ruta resuelta como `$TEMPLATE_PATH`; el agente no la reconstruye.

### Paso 2 — Determinar el estado de la visión

Define `$VISION_PATH = $SPECS_BASE/product/vision.md`. No lo escribas antes de completar esta decisión.

- Si no existe, usa `$MODE = full`.
- Si tiene `substatus: TODO`, usa `$MODE = full` y ofrece el contenido existente como pre-relleno.
- Si tiene `substatus: IN-PROGRESS`, usa `$MODE = resume`.
- Si tiene `substatus: DONE`, usa `AskUserQuestion` con `Actualizar` y `Cancelar`. Con `Cancelar`, termina sin modificar el archivo; con `Actualizar`, usa `$MODE = full`.
- Para un valor no reconocido, muestra `⚠️ substatus no reconocido en vision.md: <valor>; se trata como TODO` y usa `$MODE = full`.

En modo `resume`, calcula `$PENDING_SECTIONS` en el orden del template. La unidad es una sección hoja: un `##` sin `###` hijas o un `###`. Una sección está pendiente si no existe, contiene `[Por completar` o conserva una línea placeholder idéntica a la del template. Si la lista queda vacía, salta al Paso 4.

### Paso 3 — Delegar a `project-pm`

Invoca a `project-pm` sustituyendo las variables ya resueltas:

> Lee `$TEMPLATE_PATH` y `$VISION_PATH` si existe. Recibe `$MODE` (`full` o `resume`) y `$PENDING_SECTIONS` para el modo de retoma.
>
> Conduce la entrevista en dos fases: captura (máximo 3–4 preguntas abiertas) y refinamiento por secciones hoja en el orden del template (máximo 3–4 preguntas por ronda). Deriva cada pregunta de los comentarios HTML del template, pre-rellena con el contenido existente y marca como `[inferido]` la información que debas deducir.
>
> En `full`, completa todas las secciones hoja; en `resume`, pregunta y modifica solo `$PENDING_SECTIONS`, sin sobrescribir el resto. Escribe `$VISION_PATH` con la estructura del template, `substatus: IN-PROGRESS` y UTF-8 sin BOM. Si no hay respuesta tras el protocolo de resiliencia, marca `[inferido: sin respuesta del usuario]` y lista las inferencias antes de devolver el control.

### Paso 4 — Gate de confirmación

Verifica que `$VISION_PATH` existe. Si no existe, informa el error y sugiere ejecutar `/project-begin` nuevamente.

Lee la visión, muestra un resumen por sección y usa `AskUserQuestion` con `Confirmar` y `Dejar en revisión`.

- Con `Confirmar`, edita solo `substatus: DONE` y `updated` con la fecha actual; muestra `✅ Visión del producto completa: $VISION_PATH · Siguiente comando: /project-discovery`.
- Con `Dejar en revisión` o sin respuesta, conserva `substatus: IN-PROGRESS` y finaliza sin otros cambios.

## Salida

- `$SPECS_BASE/product/vision.md`, con la estructura de `vision-template.md`; queda en `DONE` solo después de confirmar.
