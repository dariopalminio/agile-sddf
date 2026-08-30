---
name: project-planning
description: >-
  Produce project-plan.md (paso 3 de ProjectSpecFactory) delegando la generación del backlog
  al agente project-architect. Usar para planificar el proyecto a partir de project.md.
  Invocar también cuando el usuario mencione "planificación del proyecto", "plan del proyecto",
  "project-planning" o equivalentes.
triggers:
  - project-planning
  - /project-planning
  - planificación del proyecto
  - plan del proyecto
  - project plan
---

# Skill: `/project-planning`

**Cuándo usar este skill:**
Usar como tercer paso del pipeline de ProjectSpecFactory, después de completar
`/project-discovery`. Requiere que `project.md` exista con `substatus: DONE`.
Invocar también cuando el usuario mencione "planificación del proyecto", "plan del
proyecto", "project-planning" o equivalentes.

## Objetivo

Orquesta el estado **Planning** del pipeline de ProjectSpecFactory: delega al agente
`project-architect` la extracción de features atómicas, su priorización y agrupación
en épicas, produciendo `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md`.

**Qué hace este skill:**
- Valida que `project.md` esté completo (`substatus: DONE`) antes de iniciar
- Ofrece realizar un Story Mapping previo para enriquecer el plan estructuralmente
- Delega la generación del plan al agente `project-architect`
- Confirma la existencia del documento generado al finalizar

**Qué NO hace este skill:**
- No genera `project-plan.md` directamente — esa responsabilidad es del agente `project-architect`
- No avanza al siguiente paso del pipeline automáticamente

## Entrada

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` — documento de especificación de requisitos (precondición: `substatus: DONE`)
- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` — contexto adicional del proyecto
- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md` — guía estructural opcional para el plan
- `$SPECS_BASE/specs/templates/project-plan-template.md` — fuente de verdad estructural (solo lectura); si no existe, el seed `assets/project-plan-template.md` del skill

## Parámetros

- Ninguno — el skill opera de forma completamente interactiva mediante el agente `project-architect`

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` debe existir con `substatus: DONE`
- `project-plan-template.md` debe existir, sea el central en `$SPECS_BASE/specs/templates/` o el seed `assets/project-plan-template.md`

## Dependencias

- Skills: [`skill-preflight`, `project-story-mapping`]
- Agentes: [`project-architect`]
- Archivos: [`$SPECS_BASE/specs/templates/project-plan-template.md`, `assets/project-plan-template.md` (seed)]

## Modos de ejecución

- **Manual** (`/project-planning`): siempre interactivo — ofrece Story Mapping previo y delega la planificación.
- **Retoma**: si `project-plan.md` existe con `substatus: IN-PROGRESS`, el agente `project-architect`
  continúa solo las secciones incompletas sin reiniciar desde cero.

## Restricciones / Reglas

- **Precondición de entrada obligatoria:** `project.md` con `substatus: DONE` es requerido; cualquier otro estado detiene la ejecución.
- **Template de solo lectura:** el `project-plan-template.md` resuelto (`$TEMPLATE_PATH`) nunca se modifica ni se usa como ruta de salida.
- **Extracción dinámica:** la estructura del output se deriva en runtime del template; si el template cambia, el output se actualiza automáticamente.
- **Story map como guía, no como restricción:** si `story-map.md` existe, el `project-architect` lo usa como referencia estructural pero no está obligado a replicarlo exactamente.
- **Sin avance automático:** el skill no invoca el siguiente paso del pipeline — el usuario decide cuándo continuar.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de planeación y especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 0b — Resolver directorio del proyecto activo (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/01-projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE`.
3. Si se encuentra exactamente uno con `substatus: DONE` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → mostrar error y detener:
   > ❌ No se encontró ningún proyecto activo en `$SPECS_BASE/specs/01-projects/`.
   > Ejecuta `/project-begin` primero.

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/01-projects/$PROJ_DIR/`

### Paso 1 — Verificar precondición de entrada (`project.md`)

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`.
  > Debes completar primero la fase Discovery ejecutando `/project-discovery`.

- Si el archivo **existe** pero `substatus` es `IN-PROGRESS`: informa al usuario y deten la ejecucion.

  > ❌ `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` aun esta en `substatus: IN-PROGRESS`.
  > Debes completar Discovery y dejar el documento en `Estado: Ready` antes de ejecutar `/project-planning`.

- Si el archivo **existe** con `substatus: DONE`: continua al Paso 2.

### Paso 2 — Verificar estado del documento de output

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md` (si existe) y detecta el valor de `substatus:`.

- Si el archivo **no existe**: continua al Paso 3 (primera ejecucion).
- Si existe con `substatus: IN-PROGRESS`: activa flujo de retoma y continua al Paso 3.
- Si existe con `substatus: DONE`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al Paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### Paso 3 — Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derívelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/project-plan-template.md` (fuente de verdad del proyecto, puede contener personalizaciones).

- Si el archivo central **no existe**: usar el seed `assets/project-plan-template.md` y emitir:

  > ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si tampoco existe el seed: informar al usuario y detener la ejecución:

  > ❌ Template `project-plan-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

Guardar la ruta del template efectivamente resuelto (central o seed) como `$TEMPLATE_PATH`: es la que se le pasa al `project-architect` en el Paso 5. El agente no debe reconstruir la ruta por su cuenta — hacerlo lo acoplaría a una plataforma de instalación concreta (`.claude/`, `.agents/` o `.github/`).

### Paso 4 — Story Mapping (fase previa opcional)

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`:

**Si el archivo existe:**

- Informa al usuario:
  > ✅ Se encontró `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`. Se usará como guía estructural para el plan de proyecto.
- Continúa al Paso 5 con el story map disponible como contexto adicional.

**Si el archivo NO existe:**

- Pregunta al usuario:
  > ¿Deseas realizar un Story Mapping antes de planificar? Esto produce un mapa de actividades del usuario (backbone, walking skeleton y slices de épicas) que enriquecerá el plan.
  >
  > Opciones:
  > 1. **Sí, hacer Story Mapping ahora** — invoca el skill `project-story-mapping` y luego continúa con la planificación.
  > 2. **No, continuar sin Story Mapping** — salta directamente a la planificación (comportamiento anterior).

  - Si el usuario elige **opción 1**: invoca el skill `project-story-mapping`. Cuando termine y `story-map.md` esté generado, continúa al Paso 5 con el story map como contexto.
  - Si el usuario elige **opción 2**: continúa al Paso 5 sin story map (comportamiento idéntico a la versión anterior).

### Paso 5 — Delegar al project-architect

Invoca al agente `project-architect` con la siguiente instrucción, **sustituyendo `$SPECS_BASE`, `$PROJ_DIR` y `$TEMPLATE_PATH` por los valores ya resueltos** (el agente no los resuelve por su cuenta):

> Trabajás sobre el proyecto activo `$PROJ_DIR` en `$SPECS_BASE/specs/01-projects/$PROJ_DIR/`.
>
> Lee los documentos `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` y `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`. Lee también el template `$TEMPLATE_PATH` y deriva de él las secciones del output y el formato de los encabezados `### Épica ...`.
>
> Si estás en flujo de retoma (documento existente en `substatus: IN-PROGRESS`), primero lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continúa solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> [CONDICIONAL — incluir solo si `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md` existe]
> Lee también `$SPECS_BASE/specs/01-projects/$PROJ_DIR/story-map.md`. Usa las actividades del backbone como guía para agrupar features relacionadas en el plan. Usa los slices de épicas del story map como referencia estructural para definir qué features van en cada épica (respetando las dependencias técnicas y el valor de negocio). No estás obligado a replicar el story map exactamente — es una guía, no una restricción.
> [FIN CONDICIONAL]
>
> Extrae features atómicas con IDs STORY-NNN, priorízalas, agrúpalas en épicas con MVP en la Épica 1, y escribe el resultado en `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md`.

El `project-architect` se encargará de:
- Leer los documentos de entrada de fases anteriores
- Leer el template y derivar la estructura del output dinámicamente
- Leer `story-map.md` si existe y usar el backbone y los slices de épicas como guía estructural
- Extraer features atómicas con IDs únicos (STORY-NNN), descripciones y dependencias
- Priorizar por valor de negocio, dependencias y riesgo técnico
- Agrupar en épicas con MVP en la Épica 1, incluyendo criterios de éxito
- Escribir el documento final con metadatos y checkboxes vacíos `- [ ]`

### Paso 6 — Confirmar output

Cuando el `project-architect` termine:

1. Verifica que `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md`
  > Workflow completo: el documento esta listo para revision.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-planning` nuevamente.

## Salida

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md` — plan del proyecto con features STORY-NNN
  agrupadas en épicas priorizadas, generado por `project-architect`.
