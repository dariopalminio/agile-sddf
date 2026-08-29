---
name: project-discovery
description: >-
  Produce project.md (paso 2 de ProjectSpecFactory) delegando discovery y requisitos a agentes especializados.
  Usar a partir de project-intent.md para iniciar la fase de discovery.
  Invocar para "discovery del proyecto", "especificación de requisitos" o "project-discovery".
triggers:
  - project-discovery
  - /project-discovery
  - discovery del proyecto
  - especificación de requisitos
  - project spec
---

# Skill: `/project-discovery`

**Cuándo usar este skill:**
Usar como segundo paso del pipeline de ProjectSpecFactory, después de completar
`/project-begin`. Requiere que `project-intent.md` exista con `substatus: DONE`.
Invocar también cuando el usuario mencione "discovery del proyecto", "especificación de
requisitos", "project-discovery" o equivalentes.

## Objetivo

Orquesta el estado **Discovery** del pipeline de ProjectSpecFactory: conduce el discovery
de usuarios con el agente `project-pm` y la especificación de requisitos con
`project-architect`, produciendo `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`.

**Qué hace este skill:**
- Valida que `project-intent.md` esté completo (`substatus: DONE`) antes de iniciar
- Delega el discovery de usuarios al agente `project-pm`
- Delega la especificación de requisitos al agente `project-architect` (apoyado por `project-ux`)
- Confirma la existencia del documento generado al finalizar

**Qué NO hace este skill:**
- No genera `project.md` directamente — esa responsabilidad es del agente `project-architect`
- No avanza al siguiente estado del pipeline (`project-planning`)

## Entrada

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` — input principal (precondición: `substatus: DONE`)
- `assets/project-template.md` — fuente de verdad estructural (solo lectura)
- `$SPECS_BASE/specs/01-projects/` — directorio para resolver el proyecto activo

## Parámetros

- Ninguno — el skill opera de forma completamente interactiva mediante los agentes `project-pm` y `project-architect`

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` debe existir con `substatus: DONE`
- `assets/project-template.md` debe existir

## Dependencias

- Skills: [`skill-preflight`]
- Agentes: [`project-pm`, `project-architect`, `project-ux`]
- Archivos: [`assets/project-template.md`]

## Modos de ejecución

- **Manual** (`/project-discovery`): siempre interactivo — conduce discovery y especificación con el usuario.
- **Retoma**: si `project.md` existe con `substatus: IN-PROGRESS`, el agente `project-architect`
  continúa solo las secciones incompletas sin reiniciar desde cero.

## Restricciones / Reglas

- **Precondición de entrada obligatoria:** `project-intent.md` con `substatus: DONE` es requerido; cualquier otro estado detiene la ejecución.
- **Template de solo lectura:** `project-template.md` nunca se modifica ni se usa como ruta de salida.
- **Extracción dinámica:** las secciones del documento se derivan en runtime del template; si el template cambia, el output se actualiza automáticamente.
- **Sin avance automático:** el skill no invoca `project-planning` — el usuario decide cuándo continuar.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de descubrimiento y especificación, no de implementación)
- NO genere código; estas en descubrimiento, no implementando los artefactos técnicos
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

### Paso 1 — Verificar precondición de entrada (`project-intent.md`)

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md`.
  > Debes completar primero la fase Begin Intention ejecutando `/project-begin`.

- Si el archivo **existe** pero `substatus` es `IN‑PROGRESS`: informa al usuario y deten la ejecucion.

  > ❌ `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` aun esta en `Estado: IN‑PROGRESS`.
  > Debes completar Begin Intention y dejar el documento en `Estado: Ready` antes de ejecutar `/project-discovery`.

- Si el archivo **existe** con `substatus: DONE`: continua al Paso 2.

### Paso 2 — Verificar estado del documento de output

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` (si existe) y detecta el valor de `substatus:`.

- Si el archivo **no existe**: continua al Paso 3 (primera ejecucion).
- Si existe con `substatus: IN‑PROGRESS`: activa flujo de retoma y continua al Paso 3.
- Si existe con `substatus: DONE`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al Paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### Paso 3 — Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derívelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/project-template.md` (fuente de verdad del proyecto, puede contener personalizaciones).

- Si el archivo central **no existe**: usar el seed `assets/project-template.md` y emitir:

  > ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si tampoco existe el seed: informar al usuario y detener la ejecución:

  > ❌ Template `project-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

### Paso 4 — Fase Discovery: delegar al project-pm

Invoca al agente `project-pm` con la siguiente instrucción:

> Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md`. Conduce el discovery de usuarios con el usuario:
> - Identifica los perfiles de usuario del sistema (quiénes son, qué necesitan, cuál es su contexto de uso)
> - Descubre los flujos de uso principales y los puntos de dolor actuales
> - Identifica restricciones de negocio, integraciones externas y contexto del ecosistema
> Usa máx 3-4 preguntas por ronda. Infiere lo que sea posible desde `project-intent.md` y pregunta solo lo que falta.
> Al terminar, entrega un resumen estructurado del discovery para que el project-architect lo use en la siguiente fase.
> Si necesitas apoyo para los flujos de usuario y usabilidad, invoca al agente `project-ux`.
> Si no puedes obtener respuesta del usuario, aplica tu Protocolo de Resiliencia: degrada a inferencia, marca con `[inferido: sin respuesta del usuario]` y lista las inferencias al final.

### Paso 5 — Fase SPECIFY: delegar al project-architect

Una vez completado el discovery, invoca al agente `project-architect` con la siguiente instrucción:

> Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-intent.md` y el resumen del discovery de la fase anterior. Lee tambien el template `assets/project-template.md`.
>
> Si estas en flujo de retoma (documento existente en `Estado: IN‑PROGRESS`), primero lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Extrae las secciones del template en runtime y conduce la entrevista de especificación de requisitos con el usuario por secciones (máx 3-4 preguntas por ronda).
> Pre-rellena con la información ya disponible del discovery y el project-intent. Infiere contenido faltante marcándolo con `[inferido]`.
> Para secciones de experiencia de usuario y usabilidad, puedes apoyarte en el agente `project-ux`.
> Al completar el frontmatter del documento generado, usar `status: DISCOVERY` — estado inicial de todo proyecto en etapa de descubrimiento de requisitos.
> Escribe el documento final en `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`.

El `project-architect` se encargará de:
- Pre-rellenar secciones con información del discovery y project-intent
- Conducir la entrevista de especificación por secciones (máx 3-4 preguntas por ronda)
- Apoyarse en `project-ux` para requisitos de experiencia de usuario
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### Paso 6 — Confirmar output

Cuando el `project-architect` termine:

1. Verifica que `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md`
  > Siguiente comando: `/project-planning`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-discovery` nuevamente.

## Salida

- `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project.md` — documento de especificación de requisitos
  generado por `project-architect`, con `status: DISCOVERY` al completarse.
