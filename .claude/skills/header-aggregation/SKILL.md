---
name: header-aggregation
description: >-
  Añade o actualiza frontmatter YAML estandarizado en archivos Markdown de spec, individual o en batch.
  Usar para estandarizar metadatos de trazabilidad o preparar archivos para el patrón LLM Wiki.
  Invocar para "header-aggregation", "frontmatter", "añadir frontmatter",
  "estandarizar metadatos" o "slug/type/status de forma masiva".
---

# Skill: /header-aggregation

Aplica un bloque YAML frontmatter estandarizado a archivos Markdown de especificación del proyecto SDDF. El objetivo es habilitar el patrón LLM Wiki: cada archivo de spec tiene metadatos suficientes para que un índice pueda referenciar nodos sin abrir el contenido completo.

---

## Esquema canónico de frontmatter

Este esquema es la fuente de verdad del skill. Nunca lo hardcodees en otro lugar — si cambia aquí, el comportamiento del skill cambia automáticamente.

```yaml
---
alwaysApply: false                         # OBLIGATORIO — siempre false en archivos spec
type: <project | release | story | wiki>   # OBLIGATORIO
id: <PROJ-NN | EPIC-NN | FEAT-NNN>         # OBLIGATORIO (según type)
slug: <nombre-del-directorio>              # OBLIGATORIO
title: "<Título legible del documento>"    # OBLIGATORIO
status: <BACKLOG | BEGINNING | DISCOVERY | PLANNING | SPECIFY | READY-FOR-IMPLEMENT | IN-PROGRESS | IN-DEVELOPMENT | DEVELOPING | TESTING | ACCEPTANCE | DELIVER | DEFINE | PLAN | READY-FOR-DEV | DEVELOP | VALIDATE | SHIP | COMPLETED | MEASURING-VALUE | FINISHED | CANCELED> # OBLIGATORIO
substatus: <null | TODO | IN-PROGRESS | DONE | BLOCKED>    # OBLIGATORIO
parent: <null | PROJ-NN | EPIC-NN>         # OBLIGATORIO
created: <YYYY-MM-DD>                      # OBLIGATORIO
updated: <YYYY-MM-DD>                      # OBLIGATORIO
tags: []                                   # opcional
related:                                   # opcional
  - <id de nodo relacionado>
sources:                                   # opcional
  - <clave>: <valor>
---
```

Omite los campos opcionales del bloque generado si no tienen valor relevante.

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

---

## Paso 1: Resolver el input

El skill acepta tres formas de input:

**A) Nombre corto de directorio o archivo** (ej. `FEAT-043-header-aggregation` o `project-intent`):
- Busca el archivo canónico en este orden:
  - `$SPECS_BASE/specs/stories/*/story.md` (busca directorio que coincida con el término)
  - `$SPECS_BASE/specs/releases/*/release.md` (busca directorio que coincida)
  - `$SPECS_BASE/specs/projects/*/` (busca en todos los archivos del directorio del proyecto)
- Si hay exactamente un resultado → úsalo directamente
- Si hay múltiples resultados → muestra la lista y pide selección al usuario
- Si no hay resultado → trata el input como texto libre e informa al usuario

**B) Ruta relativa o absoluta** (ej. `$SPECS_BASE/specs/stories/FEAT-043-nombre/story.md` o directorio `$SPECS_BASE/specs/stories/`):
- Usa la ruta directamente sin búsqueda adicional
- Si es un directorio → activa el modo batch (ver Paso 4)

**C) Sin input**:
- Pregunta al usuario: "¿Deseas procesar un archivo individual o todos los archivos de un directorio?"
- Solicita la ruta correspondiente según la elección

---

## Paso 2: Derivar los campos del frontmatter

Para cada archivo a procesar, deriva automáticamente los campos obligatorios:

| Campo | Regla de derivación |
|-------|---------------------|
| `alwaysApply` | false |
| `id` | Extraer del frontmatter existente si tiene. Si no: prefijo del nombre de directorio → `FEAT-NNN` para stories, `EPIC-NN` para releases, `PROJ-NN` para projects |
| `slug` | Nombre del **directorio** contenedor en kebab-case (ej. `FEAT-043-header-aggregation`, `EPIC-01-nombre`, `PROJ-01-nombre`) |
| `type` | Prefijo del nombre de directorio: `FEAT-*` → `story`, `EPIC-*` → `release`, `PROJ-*` → `project`, archivos fuera de estas convenciones → `wiki` |
| `title` | Primer heading `#` del contenido del archivo. Si no hay heading `#`, usar el nombre del directorio formateado (guiones → espacios, capitalizar) |
| `status` | Buscar `**substatus**: IN‑PROGRESS` en el contenido → `IN-PROGRESS`; `**substatus**: DONE` → `COMPLETED`; ausente o desconocido → `BACKLOG` |
| `substatus` | no es un archivo spec → null; si es un archivo de spec → derivar según contenido; ausente o desconocido → null |
| `parent` | Para stories: extraer nombre del directorio del release (la Epic o release) padre del frontmatter existente o de la sección del documento o el slug del archivo release padre (ej. `EPIC-01-nombre`). Para releases: extraer nombre del directorio del proyecto padre o slug del archivo padre project.md (ej. `PROJ-01-nombre`). Para projects u otros archivos: `null` |
| `created` | Preservar del frontmatter existente (`created` o `date`). Si no existe → fecha actual `YYYY-MM-DD` |
| `updated` | Fecha actual `YYYY-MM-DD` siempre que se haga un merge/update |
| `related` | Lista de slug de elementos relacionados (ej. `EPIC-01-nombre`) incluida el parent |

Se agrega una referencias inmediatamente despues del frontmatter con el formato `[[slug-del-release-o-proyecto]]` con el listado de `related` para facilitar la navegación y trazabilidad.

Muestra los valores derivados al usuario antes de escribir y permite correcciones.

---

## Paso 3: Aplicar frontmatter a un archivo individual

### 3.1 Detección de frontmatter existente

Lee el archivo. El archivo tiene frontmatter YAML si comienza exactamente con `---` en la primera línea (antes de cualquier otro contenido).

### 3.2 Archivo sin frontmatter

1. Deriva los campos (Paso 2)
2. Valida referencias si aplica (Paso 5)
3. Genera el bloque YAML con los campos derivados
4. Antepone el bloque al contenido existente (sin modificar el contenido debajo)
5. Escribe el archivo
6. Muestra resumen: qué campos fueron añadidos y sus valores

### 3.3 Archivo con frontmatter existente — merge con confirmación

1. Lee los campos del bloque YAML existente
2. Construye un frontmatter propuesto:
   - Preserva todos los campos que ya existen con sus valores actuales
   - Añade los campos obligatorios del esquema canónico que falten, con valores derivados
3. Muestra el diff al usuario:
   ```
   Campos añadidos:   type, status
   Campos existentes: slug, title, date (sin cambios)
   ```
4. Pregunta al usuario qué hacer:
   - **Sobrescribir con propuesta** — reemplaza el bloque YAML con el propuesto
   - **Mantener el existente** — no modifica el archivo
   - **Cancelar** — sale sin escribir nada
5. Solo modifica el archivo si el usuario elige "Sobrescribir con propuesta"

---

## Paso 4: Modo batch (directorio)

Cuando el input es un directorio, el skill adapta el escaneo según el tipo de directorio recibido:

### 4.1 Resolución del conjunto de archivos a procesar

**Si el directorio es `$SPECS_BASE/specs/` o cualquier directorio padre equivalente:**
- Escanea los tres subdirectorios de artefactos en profundidad:
  - `$SPECS_BASE/specs/projects/*/project-intent.md` (y cualquier otro `.md` dentro de cada `PROJ-*-*/`)
  - `$SPECS_BASE/specs/releases/*/release.md`
  - `$SPECS_BASE/specs/stories/*/story.md`

**Si el directorio es uno de los tres tipos de artefacto** (ej. `$SPECS_BASE/specs/stories/`):
- Lista todos los **subdirectorios** directamente dentro (no recursivo en el segundo nivel)
- Busca el archivo canónico en cada subdirectorio:
  - Para `stories/`: busca `story.md`
  - Para `releases/`: busca `release.md`
  - Para `projects/`: busca `project-intent.md`
- Ignora subdirectorios que no contengan el archivo canónico esperado

**Si el directorio es un subdirectorio de artefacto** (ej. `$SPECS_BASE/specs/stories/FEAT-043-header-aggregation/`):
- Lista todos los archivos `.md` directamente dentro de ese directorio

### 4.2 Clasificación y confirmación

1. Clasifica cada archivo resuelto en 4.1:
   - **Sin frontmatter**: será modificado
   - **Con frontmatter existente**: conflicto potencial
2. Muestra el resumen anticipado antes de proceder:
   ```
   Archivos a modificar (sin frontmatter): 12
   Archivos con conflicto (frontmatter existente): 3
   ```
3. Para los archivos con conflicto, pregunta la estrategia:
   - **Proponer merge en todos** — aplica la lógica del Paso 3.3 en todos
   - **Saltar todos los conflictos** — procesa solo los archivos sin frontmatter
   - **Decidir uno por uno** — aplica el flujo interactivo del Paso 3.3 para cada conflicto
4. Solicita confirmación global antes de proceder: "¿Confirmas el procesamiento de N archivos?"
5. Procesa los archivos en secuencia y muestra el progreso con un resumen final

---

## Paso 5: Validación de referencias cruzadas

Para cada slug referenciado en los campos `related` y `parent` del frontmatter propuesto:

1. Busca ese slug en todos los archivos `.md` del repositorio (busca en los frontmatters existentes o en los nombres de archivo)
2. Si el slug **existe** → inclúyelo en el frontmatter normalmente
3. Si el slug **no existe** → márcalo como `[pendiente]` en el frontmatter generado:
   ```yaml
   related:
     - "[pendiente] slug-que-no-existe"
   ```
4. Incluye todos los avisos de referencias inválidas en el resumen final de la operación
5. No canceles ni falles la operación — genera el frontmatter con las marcas y avisa al usuario

---

## Resumen de salida

Al terminar (archivo individual o batch), muestra siempre:

```
✓ Frontmatter aplicado: <ruta-del-archivo>
  type:    story
  id:      FEAT-043
  slug:    FEAT-043-header-aggregation
  title:   "Encabezado de archivos spec con metadata de estado"
  status:  IN-PROGRESS
  created: 2026-04-26
  updated: 2026-05-01

⚠ Referencias marcadas como [pendiente]: 0
```

Para batch, añade contadores totales: archivos procesados / saltados / con error.
