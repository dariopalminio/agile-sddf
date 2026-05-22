---
name: project-begin
description: >-
  Primer paso del pipeline de ProjectSpecFactory. Entrevista al usuario mediante
  el agente project-pm para capturar la intención del proyecto y refinarla,
  produciendo project-intent.md en una sola sesión.
  Usar siempre que el usuario quiera iniciar un nuevo proyecto, capturar la intención
  inicial, o generar el primer artefacto del pipeline (project-intent.md).
  Invocar también cuando el usuario mencione "comenzar proyecto", "iniciar proyecto",
  "capturar intención", "project-begin" o equivalentes.
triggers:
  - project-begin
  - /project-begin
  - comenzar proyecto
  - iniciar proyecto
  - capturar intención de proyecto
---

# Skill: `/project-begin`

**Cuándo usar este skill:**
Usar como primer paso del pipeline de ProjectSpecFactory, cuando el usuario quiera iniciar
un nuevo proyecto, capturar la intención inicial o generar el artefacto `project-intent.md`.
Invocar también cuando el usuario mencione "comenzar proyecto", "iniciar proyecto",
"capturar intención", "project-begin" o equivalentes.

## Objetivo

Orquesta el estado **Begin Intention** del pipeline de ProjectSpecFactory: conduce una
entrevista estructurada con el usuario a través del agente `project-pm` para capturar y
refinar la intención del proyecto, produciendo
`$SPECS_BASE/specs/projects/<PROJ-ID>-<nombre>/project-intent.md` en una sola sesión.

**Qué hace este skill:**
- Verifica el entorno y la regla WIP=1 antes de iniciar
- Resuelve o crea el directorio del proyecto activo
- Delega la entrevista de dos fases (captura + refinamiento) al agente `project-pm`
- Confirma la existencia del documento generado al finalizar

**Qué NO hace este skill:**
- No genera el documento directamente — esa responsabilidad es del agente `project-pm`
- No avanza al siguiente estado del pipeline (`project-discovery`)

## Entrada

- No se requiere input explícito — el skill inicia una entrevista interactiva
- `assets/project-intent-template.md` — fuente de verdad estructural del documento de salida (solo lectura)
- `$SPECS_BASE/specs/projects/` — directorio donde se detectan proyectos activos (WIP=1)

## Parámetros

- Ninguno — el skill opera de forma completamente interactiva mediante el agente `project-pm`

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `assets/project-intent-template.md` debe existir
- No debe existir ningún proyecto con `substatus: IN-PROGRESS` en `$SPECS_BASE/specs/projects/`
  (regla WIP=1), salvo que el usuario elija retomar o sobrescribir el activo

## Dependencias

- Skills: [`skill-preflight`]
- Agentes: [`project-pm`]
- Archivos: [`assets/project-intent-template.md`]

## Modos de ejecución

- **Manual** (`/project-begin`): siempre interactivo — conduce la entrevista con el usuario.
- **Retoma**: si existe un `project-intent.md` con `substatus: IN-PROGRESS`, el agente
  `project-pm` continúa solo las secciones incompletas sin reiniciar desde cero.

## Restricciones / Reglas

- **WIP=1:** solo puede haber un proyecto activo (`substatus: IN-PROGRESS`) a la vez;
  si ya existe uno, el skill ofrece Retomar o Sobrescribir antes de continuar.
- **Template de solo lectura:** `assets/project-intent-template.md` nunca se modifica ni
  se usa como ruta de salida.
- **Extracción dinámica:** las secciones del documento se derivan en runtime del template;
  si el template cambia, el output se actualiza automáticamente.
- **Sin avance automático:** el skill no invoca `project-discovery` — el usuario decide cuándo continuar.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de  inicial, no de implementación)
- NO genere código; estas iniciando la especificación, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
  
## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

### Paso 0b — Resolver o crear directorio del proyecto (`PROJ_DIR`)

Antes de iniciar la entrevista, determinar el directorio del proyecto activo:

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/projects/`.
2. Para cada subdirectorio encontrado, leer `project-intent.md` y verificar si `substatus` es `IN‑PROGRESS`.
3. Si se encuentra exactamente uno con `substatus: IN‑PROGRESS` → usar ese directorio como `$PROJ_DIR`. Ejemplo: `PROJ-01-mi-proyecto`.
4. Si no se encuentra ninguno → `$PROJ_DIR` se determinará durante la entrevista (ver Paso 4): el `project-pm` derivará el ID desde el título del proyecto (formato `PROJ-NN-nombre-kebab`) y lo confirmará con el usuario antes de crear el directorio.
5. Si se encuentran varios con `substatus: IN‑PROGRESS` → mostrar la lista y pedir al usuario que elija uno antes de continuar.

La ruta completa del proyecto será: `$SPECS_BASE/specs/projects/$PROJ_DIR/`

### Paso 1 — Verificar WIP=1

Antes de iniciar, escanea `$SPECS_BASE/specs/projects/` y detecta si existe algún subdirectorio con `project-intent.md` que tenga `substatus: IN‑PROGRESS`.

- Si **no** existe ningun documento en substatus `IN‑PROGRESS`: continua al Paso 2.
- Si **existe** al menos uno en substatus `IN‑PROGRESS`: notifica el conflicto WIP=1 e indica que ya hay un proyecto activo. Muestra cual documento esta en substatus `IN‑PROGRESS` y ofrece solo estas opciones:
  - `Sobrescribir`: iniciar de cero y continuar con el flujo normal.
  - `Retomar`: continuar el proyecto activo aplicando flujo de retoma sobre el documento en substatus `IN‑PROGRESS`.

Si el usuario elige retomar, activa el flujo de retoma del Paso 4 sin reiniciar desde cero.

### Paso 2 — Verificar estado del documento de output

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md` (si existe) y detecta el valor de `**Estado**:`.

- Si el archivo **no existe**: continua al Paso 3 (primera ejecucion).
- Si existe con `substatus: IN‑PROGRESS`: activa flujo de retoma y continua al Paso 3.
- Si existe con `substatus: DONE`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al Paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### Paso 3 — Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derívelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `assets/project-intent-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:
  > ❌ No se encontró el template requerido en `assets/project-intent-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.
- Si el archivo **existe**: continua.

### Paso 4 — Delegar al project-pm

Invoca al agente `project-pm` con la siguiente instrucción:

> Lee el template en `assets/project-intent-template.md`. Extrae las secciones del template en runtime.
>
> Si estas en flujo de retoma (documento existente en `Estado: IN‑PROGRESS`), primero lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Conduce la entrevista de intencion de proyecto con el usuario en dos fases dentro de la misma sesion:
>
> **Fase 1 — Captura de intención:** Pregunta al usuario por la idea general del proyecto (qué quiere construir, para quién, qué problema resuelve). Usa máx 3-4 preguntas abiertas para entender el contexto.
>
> **Fase 2 — Refinamiento:** A partir de las respuestas de la Fase 1, profundiza sección por sección del template (máx 3-4 preguntas por ronda). Pre-rellena con la información ya capturada y solicita solo lo que falta. Infiere el contenido faltante marcándolo con `[inferido]`.
>
> Escribe el resultado completo en `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`.

El `project-pm` se encargará de:
- Capturar la intención inicial del proyecto en la Fase 1
- Refinar y completar todas las secciones del template en la Fase 2
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### Paso 5 — Confirmar output

Cuando el `project-pm` termine:

1. Verifica que `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `$SPECS_BASE/specs/projects/$PROJ_DIR/project-intent.md`
  > Siguiente comando: `/project-discovery`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-begin` nuevamente.

## Salida

- `$SPECS_BASE/specs/projects/<PROJ-ID>-<nombre>/project-intent.md` — documento de intención
  del proyecto generado por `project-pm`, con `substatus: DONE` al completarse.
