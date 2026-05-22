---
name: project-policies-generation
description: >-
  Inicializa o actualiza los documentos de políticas y constitución del proyecto SDDF
  (constitution.md y definition-of-done-story.md) a partir de templates Markdown, y
  registra las referencias en CLAUDE.md / AGENTS.md para que los agentes IA los lean
  automáticamente. Usar cuando se quiere establecer o actualizar las reglas técnicas,
  convenciones y criterios de calidad del proyecto.
  Invocar también cuando el usuario mencione "generar políticas", "actualizar constitución",
  "definition of done", "project-policies-generation" o equivalentes.
triggers:
  - project-policies-generation
  - /project-policies-generation
  - generar políticas del proyecto
  - actualizar políticas
  - constitution.md
  - definition of done
---

# Skill: `/project-policies-generation`

**Cuándo usar este skill:**
Usar cuando se configura un proyecto SDDF por primera vez y se necesitan documentos de
políticas, cuando se quiere actualizar las políticas existentes (stack tecnológico, criterios
de DoD, etc.), o cuando se quiere asegurar que los agentes IA operen con las mismas reglas
y estándares. Invocar también cuando el usuario mencione "generar políticas", "actualizar
constitución", "definition of done", "project-policies-generation" o equivalentes.

## Objetivo

Genera o actualiza los documentos de políticas del proyecto SDDF a partir de templates
Markdown y registra sus referencias en `CLAUDE.md` / `AGENTS.md` para que todos los
agentes IA los lean automáticamente antes de cualquier acción:

- `$SPECS_BASE/policies/constitution.md` — principios técnicos inamovibles del proyecto (stack, convenciones, metodologías)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios de calidad para considerar una historia completada

**Qué hace este skill:**
- Crea o actualiza `constitution.md` desde el template, con confirmación del usuario si ya existe
- Crea o actualiza `definition-of-done-story.md` desde el template, con confirmación del usuario si ya existe
- Registra referencias a las políticas en `CLAUDE.md` o `AGENTS.md`

**Qué NO hace este skill:**
- No rellena el contenido de las políticas — el usuario es responsable de editarlas según su proyecto
- No modifica el contenido de archivos existentes sin confirmación explícita del usuario

## Entrada

- `$SPECS_BASE/specs/templates/project-constitution-template.md` — template fuente para constitution (solo lectura)
- `$SPECS_BASE/specs/templates/definition-of-done-story-template.md` — template fuente para DoD (solo lectura)
- `CLAUDE.md` o `AGENTS.md` en la raíz del repositorio — archivo de entrada del agente donde se registran las referencias

## Parámetros

- Ninguno — el skill opera de forma interactiva cuando detecta archivos existentes

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `$SPECS_BASE/specs/templates/project-constitution-template.md` debe existir
- `$SPECS_BASE/specs/templates/definition-of-done-story-template.md` debe existir

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`$SPECS_BASE/specs/templates/project-constitution-template.md`, `$SPECS_BASE/specs/templates/definition-of-done-story-template.md`]

## Modos de ejecución

- **Manual** (`/project-policies-generation`): interactivo — pide confirmación antes de sobreescribir archivos existentes.
- **Automático**: invocado por `sddf-init` como parte de la inicialización — reporta resultado sin interacción adicional.

## Restricciones / Reglas

- **Templates de solo lectura:** los templates fuente nunca se modifican ni se usan como ruta de salida.
- **Sin sobreescritura silenciosa:** si un archivo de políticas ya existe, siempre se pide confirmación antes de sobreescribir.
- **Inserción conservadora en CLAUDE.md:** si no se puede identificar la sección correcta para insertar referencias, el skill muestra las líneas a agregar manualmente en lugar de modificar el archivo.
- **Extracción dinámica:** la estructura de los documentos de políticas se deriva en runtime del template; si los templates cambian, el output se actualiza automáticamente.
- NO modifique ningún archivo existente en el código fuente (estamos especificando políticas de desarrollo, no implementando los artefactos técnicos)
- NO genere código; estas especificando políticas de desarrollo, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

Verificar adicionalmente que existen los templates requeridos:
- `$SPECS_BASE/specs/templates/project-constitution-template.md`
- `$SPECS_BASE/specs/templates/definition-of-done-story-template.md`

Si alguno de los templates no existe, mostrar el mensaje y detener la ejecución:

```
❌ No se encontró el template requerido en: $SPECS_BASE/specs/templates/<nombre>.md

Por favor verifica que el archivo existe o ejecuta `sddf-init` para inicializar la estructura base.
```

### Paso 1 — Preparar directorio de políticas

Verificar si el directorio `$SPECS_BASE/policies/` existe.

Si no existe, crearlo antes de continuar e informar al usuario:
```
📁 Directorio creado: $SPECS_BASE/policies/
```

### Paso 2 — Generar constitution.md

#### 2a. Leer el template

Leer el archivo `$SPECS_BASE/specs/templates/project-constitution-template.md`.

La estructura del output la define íntegramente el template — nunca hardcodear secciones en este skill.

#### 2b. Verificar existencia previa

Si `$SPECS_BASE/policies/constitution.md` **no existe**:
- Crear el archivo con el contenido del template, completando el frontmatter con:
  - `created: <YYYY-MM-DD>` (fecha actual)
  - `updated: <YYYY-MM-DD>` (fecha actual)
- Informar: `✅ Creado: $SPECS_BASE/policies/constitution.md`

Si `$SPECS_BASE/policies/constitution.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/constitution.md ya existe.
¿Qué deseas hacer?
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Esperar respuesta antes de continuar:
- `e` / `editar`: abrir el archivo para que el usuario lo edite; no modificar su contenido
- `s` / `sobreescribir`: reemplazar el contenido con el template y actualizar el campo `updated`
- `n` / `saltar`: no modificar el archivo y continuar con el Paso 3

### Paso 3 — Generar definition-of-done-story.md

#### 3a. Leer el template

Leer el archivo `$SPECS_BASE/specs/templates/definition-of-done-story-template.md`.

La estructura del output la define íntegramente el template.

#### 3b. Verificar existencia previa

Si `$SPECS_BASE/policies/definition-of-done-story.md` **no existe**:
- Crear el archivo con el contenido del template, completando el frontmatter con `created` y `updated`.
- Informar: `✅ Creado: $SPECS_BASE/policies/definition-of-done-story.md`

Si `$SPECS_BASE/policies/definition-of-done-story.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/definition-of-done-story.md ya existe.
¿Qué deseas hacer?
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Proceder según la respuesta, con la misma lógica que en el Paso 2.

### Paso 4 — Registrar referencias en CLAUDE.md / AGENTS.md

#### 4a. Detectar archivo de entrada del agente

Verificar en la raíz del repositorio:
1. Si existe `CLAUDE.md` → usarlo
2. Si no existe `CLAUDE.md` pero existe `AGENTS.md` → usarlo
3. Si no existe ninguno → notificar al usuario y mostrar las líneas a agregar manualmente:

```
⚠️ No se encontró CLAUDE.md ni AGENTS.md en la raíz del repositorio.

Agrega las siguientes líneas manualmente a tu archivo de entrada del agente:

@docs/policies/constitution.md
@docs/policies/definition-of-done-story.md
```

#### 4b. Verificar referencias existentes

Buscar en el archivo detectado si ya contiene referencias a los archivos de políticas:
- `@$SPECS_BASE/policies/constitution.md` (o la ruta relativa equivalente)
- `@$SPECS_BASE/policies/definition-of-done-story.md`

Si **ambas referencias ya existen**: informar que no es necesario modificar el archivo:
```
ℹ️ Las referencias a las políticas ya están registradas en CLAUDE.md — sin cambios.
```

#### 4c. Agregar referencias faltantes

Si alguna referencia no está presente, intentar insertarla al final del archivo.

Si el archivo tiene una sección de contexto identificable (por ejemplo, un bloque con encabezado `# Contexto` o similar), insertar antes del cierre de esa sección.

Si el formato del archivo es no estándar o no se puede determinar la sección correcta, **no modificar el archivo** y mostrar las líneas a agregar manualmente:

```
⚠️ No se pudo determinar el lugar correcto en CLAUDE.md para insertar las referencias.

Agrega las siguientes líneas manualmente:

@docs/policies/constitution.md
@docs/policies/definition-of-done-story.md
```

Si se insertaron las referencias exitosamente:
```
✅ Referencias agregadas en CLAUDE.md:
   @docs/policies/constitution.md
   @docs/policies/definition-of-done-story.md
```

### Paso 5 — Resumen

Mostrar el resumen de la ejecución:

```
## Políticas del proyecto generadas

📄 Archivos de políticas:
- $SPECS_BASE/policies/constitution.md    [creado | actualizado | saltado]
- $SPECS_BASE/policies/definition-of-done-story.md  [creado | actualizado | saltado]

🔗 Referencias en CLAUDE.md:
- [registradas | ya existían | requieren acción manual]

**Siguiente paso:**
Edita los archivos de políticas generados para adaptar el contenido al contexto específico de tu proyecto.
Luego ejecuta `/story-design` para comenzar a diseñar la implementación de una historia.
```

## Salida

- `$SPECS_BASE/policies/constitution.md` — documento de constitución del proyecto con principios técnicos inamovibles.
- `$SPECS_BASE/policies/definition-of-done-story.md` — documento de criterios DoD para historias de usuario.
- Actualizaciones en `CLAUDE.md` o `AGENTS.md` con referencias `@` a los archivos de políticas generados.
