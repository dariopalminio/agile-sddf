---
name: story-tasking
description: >-
  Genera tasks.md con tareas atómicas ordenadas por dependencia desde story.md y design.md.
  Usar antes de codificar para descomponer la historia en pasos ejecutables.
  Invocar para "tasking", "tareas de la historia", "generar tasks" o "plan de implementación".
triggers:
  - "tasking"
  - "plan de implementación"
  - "tareas de la historia"
  - "generar tasks"
  - "qué hay que hacer para implementar"
  - "cómo implemento esta historia"
alwaysApply: false
invocable: true
---

# Skill: /story-tasking

## Objetivo

Produce el documento de tareas de implementación de una historia de usuario. Su propósito es **descomponer el diseño técnico en pasos ejecutables**, transformando los criterios de aceptación y los componentes del diseño en una lista de tareas concretas, ordenadas y trazables.

**Qué hace este skill:**
- Genera tareas atómicas completables en una sesión con IDs secuenciales (`T001`, `T002`...)
- Agrupa las tareas bajo encabezados `##` numerados por área técnica
- Ordena por dependencias: setup → componentes → soporte → verificación
- Marca con `[P]` las tareas paralelizables sin dependencias entre sí
- Toma el template en tiempo de ejecución como fuente de verdad de la estructura de salida

**Qué NO hace este skill:**
- Escribir código de implementación (el código va directamente al repositorio)
- Tomar decisiones de arquitectura o diseño (esas pertenecen a `design.md`)

### Posicionamiento

```
story.md   → What: requisitos, criterios de aceptación, comportamiento esperado
design.md  → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md   → When: tareas de implementación, orden, seguimiento  ← aquí
```

---

## Entrada

| Artefacto | Categoría | Justificación |
|---|---|---|
| `story.md` | **Requerido** | Fuente de criterios de aceptación y comportamiento esperado |
| `design.md` | **Requerido** | Fuente de componentes e interfaces a implementar; el skill no puede generar tareas sin diseño técnico |
| `assets/tasks-template.md` | **Requerido** | Estructura del documento de salida — sin este template no se genera ningún archivo (sin fallback) |

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-058`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--output {path}` — ruta de salida del documento (opcional)

---

## Precondiciones

- `story.md` debe existir en el directorio de la historia
- `design.md` debe existir en el directorio de la historia
- `assets/tasks-template.md` debe existir

---

## Dependencias

- Skills: [`skill-preflight`]

---

## Modos de ejecución

- **Modo manual** (`/story-tasking {story_id}`): interactivo, muestra resumen y pide confirmación antes de cerrar
- **Modo Agent** (invocado por orquestador): automático, guarda directamente sin confirmación y reporta al orquestador

---

## Restricciones / Reglas

**Reglas de calidad de tareas:**
- Cada tarea es completable en una sesión (≤ 2 horas de trabajo)
- La descripción es suficientemente específica para saber exactamente cuándo está hecha
- No hay decisiones de diseño aplazadas: si algo es incierto, está documentado en `design.md`
- Todas las tareas de verificación cubren los escenarios de los ACs
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; este skill solo produce archivos de especificaciones de tareas `.md`.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

**Formato de líneas de tarea:**

| Tipo | Formato |
|---|---|
| Secuencial (pendiente) | `- [ ] T001 Descripción de tarea` |
| Paralelizable (pendiente) | `- [ ] T002 [P] Descripción de tarea` |
| Completada | `- [x] T003 Descripción de tarea` |

**Criterio de paralelización `[P]`:** marcar solo si la tarea no tiene dependencias con otras del mismo grupo y su resultado no es input de otra tarea pendiente en el mismo grupo.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver parámetros de entrada

#### 1a. Argumentos aceptados

Si no se proporcionó ningún argumento, preguntar:
```
¿A qué historia quieres generar las tareas?
Proporciona el ID (ej. FEAT-058) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia (primera coincidencia)

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — directorio cuyo nombre comienza con el ID
3. Si no se encuentra ninguno: notificar y detener
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

   Verifica el ID o ejecuta /release-generate-stories para generar la historia.
   ```

#### 1c. Verificación de story.md

Verificar que el directorio resuelto contiene `story.md`. Si no:
```
❌ No se encontró story.md en: <ruta>

Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```
Detener la ejecución.

#### 1d. Verificación de design.md (precondición obligatoria)

Verificar que el directorio resuelto contiene `design.md`. Si no:
```
❌ No se encontró design.md en: <ruta>

El skill story-tasking requiere que el diseño técnico esté disponible antes de generar tareas.
Sugerencia: ejecuta /story-design {story_id} para generar el diseño técnico primero.
```
Detener la ejecución. **No se genera ningún archivo.**

#### 1e. Verificación del template de tareas (sin fallback)

Verificar que `assets/tasks-template.md` existe. Si no:
```
❌ No se encontró el template de tareas en: assets/tasks-template.md

El skill no puede generar tasks.md sin el template. No se usa fallback interno.
Verifica que el archivo existe en la ruta indicada.
```
Detener la ejecución. **No se genera ningún archivo.**

Informar qué template se está usando:
```
✓ Template: assets/tasks-template.md
```

#### 1f. Resolución de la ruta de salida

1. Ruta explícita `--output {path}` si se proporcionó
2. `{directorio_historia}/tasks.md`

Si `tasks.md` **ya existe** en la ruta de salida, preguntar al usuario:
```
El archivo tasks.md ya existe en: <ruta>
¿Qué deseas hacer?
  (r) Regenerar — reemplazar el contenido existente
  (n) No modificar — saltar la generación
```
- `n` / `no modificar`: informar que se saltó y terminar
- `r` / `regenerar`: continuar

---

### Paso 2 — Leer story.md y extraer criterios de aceptación

Leer el archivo `story.md` del directorio resuelto.

Extraer y registrar internamente:
- ID de la historia del frontmatter (`id: FEAT-NNN`) → base para frontmatter del tasks.md
- Slug del frontmatter
- Título de la historia
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — referencia de trazabilidad para las tareas
- Requisitos no funcionales
- Requerimientos adicionales explícitos en la historia

Los criterios de aceptación son la fuente de verdad del **comportamiento esperado** que las tareas deben implementar.

---

### Paso 3 — Leer design.md y extraer contexto técnico

Leer el archivo `design.md` del directorio resuelto.

Extraer y registrar internamente:
- **Componentes afectados**: nombre, acción (crear/modificar/eliminar), ubicación de archivo, AC que satisface
- **Interfaces definidas**: nombre, contrato, AC que satisface
- **Decisiones técnicas**: opciones elegidas y su justificación
- **Flujo principal del skill** (si existe): orden de pasos de implementación
- **Puntos de variación**: comportamientos alternativos a implementar
- **Comportamiento ante fallos**: casos de error a manejar

Los componentes e interfaces del diseño son la fuente de verdad de las **tareas concretas** a ejecutar.

---

### Paso 4 — Leer el template en tiempo de ejecución

Leer el archivo `assets/tasks-template.md`.

Identificar:
- La estructura de grupos (`##` numerados) y sus placeholders
- El formato de línea de tarea esperado
- El frontmatter requerido

> La estructura del documento de salida la dicta el template, no este skill.

---

### Paso 5 — Derivar las tareas

Combinar los ACs del Paso 2 y los componentes del Paso 3 para derivar la lista completa de tareas.

#### 5a. Fuentes de tareas

| Fuente | Genera tareas de tipo |
|---|---|
| Componentes de `design.md` | Creación/modificación de archivos concretos |
| Interfaces de `design.md` | Definición de contratos e integraciones |
| Flujo principal de `design.md` | Pasos de implementación del skill/feature |
| ACs de `story.md` | Verificación de criterios de aceptación |
| Comportamiento ante fallos de `design.md` | Manejo de errores y casos edge |
| Artefactos de soporte (examples, assets) | Documentación y ejemplos |

#### 5b. Asignación de IDs

Asignar IDs secuenciales `T001`, `T002`... en el orden definitivo de ejecución (después del ordenamiento del paso 5c).

#### 5c. Ordenamiento por dependencias lógicas

Ordenar las tareas siguiendo este esquema:

1. **Setup / Scaffolding** — creación de estructura de directorios, archivos base
2. **Componentes centrales** — el artefacto principal del cambio (ej. SKILL.md, archivo core)
3. **Componentes de soporte** — assets, ejemplos, templates
4. **Integración y verificación** — tests, validación manual, verificación de escenarios

Las tareas dentro de cada grupo que no dependen entre sí pueden marcarse `[P]`.

#### 5d. Marcador [P] para tareas paralelizables

Marcar con `[P]` las tareas que:
- No tienen dependencias entre sí dentro del mismo grupo
- Pueden ejecutarse en paralelo sin riesgo de conflicto
- Su resultado no es input de otra tarea del mismo grupo

**No marcar [P]** si la tarea depende del output de otra tarea pendiente en el mismo grupo.

#### 5e. Formato de líneas de tarea

Aplicar los formatos definidos en `## Restricciones / Reglas`.

#### 5f. Reglas de calidad de tareas

Aplicar las reglas de calidad definidas en `## Restricciones / Reglas` al evaluar cada tarea derivada.

---

### Paso 6 — Completar el template

Usar la estructura del template del Paso 4 como base.

Completar el frontmatter del documento generado:
```yaml
type: tasks
id: <FEAT-NNN>
slug: <slug-historia-tasks>
title: "Tasks: <título>"
story: <FEAT-NNN>
design: <FEAT-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <slug-de-la-story-relacionada>
```

Distribuir las tareas del Paso 5 en los grupos del template, usando encabezados `##` numerados con nombres descriptivos del área técnica correspondiente.

---

### Paso 7 — Guardar el documento

Guardar el documento completado en la ruta de salida resuelta en el Paso 1.

Si el directorio no existe, crearlo.

---

### Paso 8 — Confirmación interactiva (solo modo manual)

Mostrar al usuario:

```
✅ Tasks guardado: <ruta>/tasks.md

📋 Resumen:
   Historia: <FEAT-NNN> — <título>

   Tareas generadas: <N> total
   · <N> grupos bajo encabezados ##
   · <N> tareas paralelizables [P]
   · <N> tareas de verificación

   Orden: setup → componentes → soporte → verificación
```

Preguntar: "¿El plan de implementación refleja correctamente el diseño? ¿Necesita ajustes?"

---

## Salida

- `{story_dir}/tasks.md` — plan de implementación con tareas atómicas en orden de ejecución (o la ruta indicada con `--output`)
- No modifica `story.md` ni otros artefactos existentes
