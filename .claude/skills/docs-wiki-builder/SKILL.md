---
name: docs-wiki-builder
description: >-
  Reorganiza $SPECS_BASE/ como wiki navegable con index.md central y wikilinks [[slug]] (patrón LLM Wiki).
  Usar para generar o actualizar la estructura wiki de docs o crear el índice central.
  Invocar para "wiki de docs", "índice de documentación", "wikilinks",
  "LLM wiki" o "docs-wiki-builder".
triggers:
  - docs-wiki-builder
  - /docs-wiki-builder
  - wiki de docs
  - índice de documentación
  - generar wiki
  - wikilinks
---

# Skill: `/docs-wiki-builder`

**Cuándo usar este skill:**
Usar cuando se quiere generar o actualizar la estructura wiki de `$SPECS_BASE/`, crear el
índice central de documentación, validar wikilinks internos, o reorganizar el directorio de
docs como una wiki navegable que el LLM puede leer eficientemente. Invocar también cuando
el usuario mencione "wiki de docs", "índice de documentación", "wikilinks", "LLM wiki",
"docs-wiki-builder" o equivalentes.

## Objetivo

Reorganiza el directorio `$SPECS_BASE/` como una wiki navegable, genera `$SPECS_BASE/index.md`
como mapa principal de toda la documentación y valida los wikilinks internos. Implementa el
patrón LLM Wiki (Karpathy): el LLM lee `index.md` primero para obtener el mapa completo antes
de abrir nodos individuales, haciendo el acceso O(index) en lugar de O(all-files).

Opera completamente inline — sin delegar a subagentes.

**Qué hace este skill:**
- Detecta el estado actual de `$SPECS_BASE/` y elige el flujo adecuado (crear, reorganizar o actualizar)
- Crea la estructura de directorios de la wiki si no existe
- Reorganiza archivos `.md` dispersos en los subdirectorios correctos (con confirmación previa)
- Genera `$SPECS_BASE/index.md` con wikilinks `[[slug]]` organizados por sección
- Valida wikilinks y marca nodos pendientes (archivos referenciados que aún no existen)
- Aplica frontmatter YAML a archivos procesados que no lo tengan

**Qué NO hace este skill:**
- No elimina archivos existentes bajo ninguna circunstancia
- No sobreescribe frontmatter existente en archivos — el usuario puede invocar `/header-aggregation` para eso
- No renderiza el grafo de wikilinks — se recomienda la extensión Foam en VS Code

## Entrada

- `$SPECS_BASE/` — directorio base de documentación (resuelto por `skill-preflight`)
- `assets/wiki-index-template.md` — template base para `$SPECS_BASE/index.md` (solo lectura)
- Argumentos opcionales del usuario: `--update`, `--dry-run`

## Parámetros

- `--update`: modo actualización — solo regenera `$SPECS_BASE/index.md` sin modificar estructura de directorios
- `--dry-run`: modo simulación — muestra el plan completo sin ejecutar ninguna acción

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `assets/wiki-index-template.md` debe existir en el directorio del skill

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`assets/wiki-index-template.md`]
- Extensión recomendada: Foam (`foam.foam-vscode`) para visualizar el grafo de wikilinks en VS Code

## Modos de ejecución

- **Manual** (`/docs-wiki-builder`): modo completo — analiza el estado de `$SPECS_BASE/`, propone plan, confirma con el usuario y ejecuta.
- **`--update`**: regenera solo `$SPECS_BASE/index.md` incorporando archivos nuevos; no modifica la estructura de directorios.
- **`--dry-run`**: muestra el plan completo (directorios, movimientos, frontmatter) sin escribir ni crear ningún archivo.

## Restricciones / Reglas

- **No-eliminación:** este skill NUNCA elimina archivos existentes. Solo crea nuevos archivos o directorios, o propone mover archivos con confirmación explícita del usuario.
- **Confirmación obligatoria antes de mover:** en el Flujo B, siempre solicitar confirmación antes de ejecutar cualquier movimiento.
- **No sobreescritura de frontmatter:** si un archivo ya tiene frontmatter, se preserva sin modificación. No fusionar automáticamente.
- **Wikilinks no bloqueantes:** nodos pendientes (wikilinks sin archivo correspondiente) no detienen la generación del índice — se marcan con ⚠️.
- **Template de solo lectura:** `assets/wiki-index-template.md` nunca se modifica ni se usa como ruta de salida.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

### Paso 1 — Detectar modo de invocación

Antes de cualquier acción, determina el modo de ejecución según los argumentos del usuario:

| Argumento | Modo |
|-----------|------|
| (ninguno) | Modo completo — analizar, proponer, confirmar, ejecutar |
| `--update` | Modo actualización — solo regenerar `$SPECS_BASE/index.md` |
| `--dry-run` | Modo simulación — mostrar plan sin ejecutar nada |

### Paso 2 — Detectar estado actual de $SPECS_BASE/

1. Verifica si el directorio `$SPECS_BASE/` existe en la raíz del repositorio.
2. Si existe, verifica si contiene `$SPECS_BASE/index.md`.
3. Lista recursivamente todos los archivos `.md` en `$SPECS_BASE/` para entender la estructura actual.

Con esa información, determina el flujo a seguir:

| Estado detectado | Flujo |
|-----------------|-------|
| `$SPECS_BASE/` no existe o está vacío | → Flujo A: crear estructura desde cero |
| `$SPECS_BASE/` existe pero sin `index.md` ni subdirectorios wiki | → Flujo B: reorganizar estructura existente |
| `$SPECS_BASE/` existe con `index.md` | → Flujo C: actualizar índice existente |

### Paso 3 — Flujo A: Crear estructura desde cero

Si `$SPECS_BASE/` no existe o está vacío:

1. Crea los siguientes directorios:
   ```
   $SPECS_BASE/specs/projects/
   $SPECS_BASE/specs/releases/
   $SPECS_BASE/specs/stories/
   $SPECS_BASE/knowledge/constitution/
   $SPECS_BASE/knowledge/architecture/
   $SPECS_BASE/knowledge/process/
   $SPECS_BASE/knowledge/ux/
   $SPECS_BASE/knowledge/guides/
   $SPECS_BASE/knowledge/how-to/
   ```
2. Continúa al **Paso 5** para generar el índice.

### Paso 4 — Flujo B: Reorganizar estructura existente

Si `$SPECS_BASE/` existe con archivos pero sin estructura wiki:

1. Analiza cada archivo `.md` encontrado e infiere su ubicación en la nueva estructura:
   - Archivos con prefijo `story-*` → `$SPECS_BASE/specs/stories/`
   - Archivos con prefijo `release-*` → `$SPECS_BASE/specs/releases/`
   - Archivos con prefijo `project-*` → `$SPECS_BASE/specs/projects/`
   - Documentación técnica / artículos → `$SPECS_BASE/knowledge/guides/` o `$SPECS_BASE/knowledge/how-to/`
   - Archivos que ya están en la ubicación correcta → sin movimiento

2. Genera un resumen de los movimientos propuestos:
   ```
   ## Plan de reorganización

   Mover:
   - <SPECS_BASE>/docker-dev-container.md → <SPECS_BASE>/knowledge/how-to/docker-dev-container.md
   - <SPECS_BASE>/extreme-agile/extreme-agile.md → <SPECS_BASE>/knowledge/guides/extreme-agile.md

   Sin cambios (ya en ubicación correcta):
   - <SPECS_BASE>/specs/projects/project-intent.md
   - <SPECS_BASE>/specs/releases/...
   - <SPECS_BASE>/specs/stories/...

   Crear directorios nuevos:
   - <SPECS_BASE>/knowledge/constitution/
   - <SPECS_BASE>/knowledge/architecture/
   ...
   ```

3. **Solicita confirmación explícita** antes de ejecutar cualquier movimiento:
   > ¿Confirmas este plan de reorganización? Responde "sí" para ejecutar o "no" para cancelar.

4. Si el usuario confirma, ejecuta los movimientos. Si cancela, detiene la ejecución sin modificar nada.

5. Si un movimiento requeriría sobreescribir un archivo existente, avisar al usuario y saltarlo.

### Paso 5 — Generar $SPECS_BASE/index.md

Lee el template `assets/wiki-index-template.md`.

Construye `$SPECS_BASE/index.md` listando todos los archivos `.md` encontrados en `$SPECS_BASE/`:

1. **Organiza por sección** según el subdirectorio:
   - Archivos en `$SPECS_BASE/specs/projects/` → sección "L3 — Proyecto"
   - Archivos en `$SPECS_BASE/specs/releases/` → sección "L2 — Releases"
   - Archivos en `$SPECS_BASE/specs/stories/` → sección "L1 — Historias de usuario"
   - Archivos en `$SPECS_BASE/knowledge/constitution/` → sección "Constitución"
   - Archivos en `$SPECS_BASE/knowledge/architecture/` → sección "Arquitectura"
   - Archivos en `$SPECS_BASE/knowledge/process/` → sección "Proceso"
   - Archivos en `$SPECS_BASE/knowledge/ux/` → sección "UX"
   - Archivos en `$SPECS_BASE/knowledge/guides/` → sección "Guías teóricas"
   - Archivos en `$SPECS_BASE/knowledge/how-to/` → sección "How-to"

2. **Genera wikilinks** para cada archivo usando la sintaxis `[[slug]]` donde `slug` = nombre del archivo sin extensión (kebab-case). Ejemplo: `$SPECS_BASE/specs/projects/project-intent.md` → `[[project-intent]]`.

3. **Valida wikilinks** (ver Paso 6) y marca los rotos antes de escribir el índice.

4. **Añade frontmatter al índice**:
   ```yaml
   ---
   type: wiki
   slug: index
   title: "Índice de documentación"
   date: <fecha-actual YYYY-MM-DD>
   status: IN-PROGRESS
   substatus: IN‑PROGRESS
   parent: null
   ---
   ```

5. Escribe el archivo en `$SPECS_BASE/index.md`.

**Modo `--update`:** En este modo, solo regenera `$SPECS_BASE/index.md` incorporando archivos nuevos. No modifica la estructura de directorios ni el contenido de otros archivos. Los archivos ya referenciados en el índice previo se mantienen.

### Paso 6 — Validar wikilinks y detectar nodos pendientes

Para cada wikilink `[[slug]]` que aparezca en el índice generado:

1. Busca si existe algún archivo en `$SPECS_BASE/` cuyo nombre (sin extensión) coincida exactamente con `slug`.
2. Si el archivo **existe**: incluye el wikilink sin marcador adicional — `[[slug]]`.
3. Si el archivo **no existe**: marca el wikilink con el indicador de nodo pendiente — `[[slug]] ⚠️ nodo pendiente`.

**Este paso no bloquea la operación.** El índice se genera siempre, con o sin nodos pendientes.

Después de generar el índice, muestra un resumen de nodos pendientes al usuario:
```
## Nodos pendientes detectados

Los siguientes wikilinks apuntan a archivos que aún no existen:
- [[constitution]] → <SPECS_BASE>/knowledge/constitution/constitution.md
- [[tech-stack]] → <SPECS_BASE>/knowledge/architecture/tech-stack.md

Crea estos archivos cuando estés listo para expandir la wiki.
```

Si no hay nodos pendientes, omite el resumen.

### Paso 7 — Aplicar frontmatter YAML a nodos

Para cada archivo `.md` procesado (creado o movido) por el skill:

#### Reglas de derivación de frontmatter

- **`type`**: Se deriva según la ubicación del archivo:
  - Archivos en `$SPECS_BASE/knowledge/` → `knowledge`
  - Archivos con prefijo `story-*` → `story`
  - Archivos con prefijo `release-*` → `release`
  - Archivos con prefijo `project-*` → `project`
  - Otros → `knowledge`
- **`slug`**: Nombre del archivo sin extensión, en kebab-case. Ejemplo: `project-intent.md` → `project-intent`.
- **`title`**: Primer heading `#` del documento. Si no hay heading, usar el nombre de archivo formateado.
- **`date`**: Fecha actual en formato YYYY-MM-DD.
- **`status`**: `substatus: IN‑PROGRESS` → `IN-PROGRESS`; `substatus: DONE` → `COMPLETED`; ausente → `BACKLOG`.
- **`substatus`**: `substatus: IN‑PROGRESS` → `IN‑PROGRESS`; `substatus: DONE` → `DONE`; ausente → `N/A`.
- **`parent`**: `N/A` por defecto (sin nodo padre).

#### Comportamiento según estado del archivo

- **Archivo sin frontmatter**: añadir el bloque YAML al inicio del archivo preservando el contenido original intacto debajo del bloque.
- **Archivo con frontmatter existente**: preservarlo sin modificación. No sobreescribir ni fusionar automáticamente — el usuario puede invocar `/header-aggregation` si necesita actualizar el frontmatter de archivos existentes.

### Paso 8 — Modo --dry-run

Si el usuario invocó el skill con `--dry-run`:

1. Ejecuta los Pasos 2-7 completos pero **sin escribir ningún archivo** ni crear ningún directorio.
2. Muestra en la conversación todas las acciones que se realizarían:
   ```
   ## Plan de ejecución (--dry-run)

   Directorios a crear:
   - <SPECS_BASE>/knowledge/constitution/
   - <SPECS_BASE>/knowledge/architecture/
   ...

   Archivos a mover:
   - <SPECS_BASE>/docker-dev-container.md → <SPECS_BASE>/knowledge/how-to/docker-dev-container.md

   Archivos a generar:
   - <SPECS_BASE>/index.md (nuevo)

   Frontmatter a añadir:
   - <SPECS_BASE>/extreme-agile/extreme-agile.md (sin frontmatter actualmente)

   Nodos pendientes en el índice:
   - [[constitution]], [[tech-stack]], ...

   No se realizó ningún cambio. Invoca el skill sin --dry-run para ejecutar.
   ```

### Paso 9 — Resumen final

Al completar la ejecución, muestra un resumen:

```
## Wiki generada ✅

$SPECS_BASE/index.md — actualizado
Nodos indexados: [N]
Wikilinks rotos: [M] (ver nodos pendientes arriba)

Estructura:
<SPECS_BASE>/
├── index.md
├── specs/
│   ├── project/  ([N] archivos)
│   ├── releases/ ([N] archivos)
│   └── stories/  ([N] archivos)
└── knowledge/
    ├── constitution/ ([N] archivos)
    ├── architecture/ ([N] archivos)
    ├── process/      ([N] archivos)
    ├── ux/           ([N] archivos)
    ├── guides/       ([N] archivos)
    └── how-to/       ([N] archivos)

Siguiente paso: Invoca con --update para regenerar el índice cuando añadas nuevos archivos.
```

> 💡 Para visualizar el grafo de la wiki, instala la extensión [Foam](https://marketplace.visualstudio.com/items?itemName=foam.foam-vscode) en VS Code.

## Salida

- `$SPECS_BASE/index.md` — índice central de la wiki con wikilinks `[[slug]]` organizados por sección.
- Estructura de directorios de la wiki creada o actualizada en `$SPECS_BASE/`.
- Archivos `.md` procesados con frontmatter YAML añadido (solo los que no tenían frontmatter previo).
