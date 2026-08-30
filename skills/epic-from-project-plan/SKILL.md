---
name: epic-from-project-plan
description: "Genera especificaciones de épica (directorio `EPIC-NN-nombre/epic.md`) a partir de las épicas planificadas en `<SPECS_BASE>/specs/01-projects/<PROJ-ID>-<nombre>/project-plan.md`, usando el template `epic-template.md`."
---
# Skill: /epic-from-project-plan

Lee `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md` y genera automáticamente un directorio `EPIC-[ID]-[nombre-kebab]/` con un archivo `epic.md` por cada épica planificada en la sección "Propuesta de Épicas". Cada archivo generado sigue exactamente la estructura de `$SPECS_BASE/specs/templates/epic-template.md`.

**Usar cuando:**
- Se quiere materializar las épicas de un `project-plan.md` como archivos de especificación listos para editar
- Como paso previo a ejecutar `/epic-format-validation` o `/story-creation` sobre una épica específica
- Para asegurar consistencia de formato entre todas las épicas de un proyecto

---

## Restricciones / Reglas

- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

---

## Configuración 0b — Resolver directorio del proyecto activo (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/01-projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE`.
3. Si se encuentra exactamente uno con `substatus: DONE` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → mostrar error y detener:
   > ❌ No se encontró ningún proyecto activo en `$SPECS_BASE/specs/01-projects/`.
   > Ejecuta `/project-begin` primero.

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/01-projects/$PROJ_DIR/`

---

## Fase 0 — Verificar input

Verificar que el archivo `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md` existe.

**Si no existe**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontró $SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md

Asegúrate de haber ejecutado el skill /project-planning antes de usar este skill.
```

---

## Fase 1 — Extraer épicas del plan

Leer `$SPECS_BASE/specs/01-projects/$PROJ_DIR/project-plan.md`.

Localizar la sección `## Propuesta de Épicas`. Solo analizar el contenido dentro de esa sección (ignorar todo lo que esté antes o pertenezca a otras secciones `##`).

Dentro de esa sección, extraer cada bloque delimitado por un encabezado `### Épica ...` y el siguiente separador `---` o el siguiente `###`.

El separador entre el identificador y el nombre puede ser **em dash (`—`) o dos puntos (`:`)** — ambas formas están vigentes: el template genera `### Épica 1: [Nombre]` y los planes existentes usan `### Épica 01 — Nombre`. Aceptar las dos.

Para cada bloque, capturar:

- **ID**: el número que sigue a `### Épica `, normalizado a dos dígitos (`1` → `01`, `06` → `06`).
  **Caso especial — bloque sin número:** el template define un bloque inicial `### Épica Walking Skeleton: MVP`. Ese bloque recibe el ID `00` (es el MVP, siempre la primera épica). Si además existe un bloque numerado `00`, aplicar la regla de duplicados de las Notas de implementación.
- **Nombre**: el texto después del separador en la misma línea (ej. `Estructura Base y Mecanismo de Templates`). Para el bloque Walking Skeleton, el nombre es el texto después de los dos puntos (`MVP`).
- **substatus**: el valor del campo `substatus:` si existe en el bloque (ej. `DONE`, `IN-PROGRESS`); si no existe, usar `IN-PROGRESS`
- **Objetivo**: el párrafo que sigue a `**Objetivo:**`
- **Historias**: las líneas con formato `- [ ] STORY-NNN - Nombre` o `- [x] STORY-NNN - Nombre` dentro del bloque
- **Criterios de éxito**: las líneas que siguen a `**Criterios de éxito:**` dentro del bloque

Las fechas del frontmatter (`created` / `updated`) no se extraen del plan: se usa la fecha actual en formato YYYY-MM-DD.

**Si no se encuentra ningún bloque `### Épica`** dentro de la sección, mostrar el siguiente mensaje y terminar:

```
No se encontraron épicas planificadas en project-plan.md

Verifica que el archivo contiene una sección "## Propuesta de Épicas" con bloques "### Épica NN — Nombre" o "### Épica N: Nombre".
```

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/02-epics/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Generar archivos de épica

Para cada épica extraída en Fase 1, ejecutar los siguientes pasos:

### 3a. Construir el nombre del directorio

Convertir el nombre de la épica a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n (y sus mayúsculas)
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (reemplazar `--` por `-`)
5. Eliminar guiones al inicio o al final

Nombre de directorio resultante: `EPIC-[ID]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/02-epics/EPIC-[ID]-[nombre-kebab]/epic.md`

**Ejemplo:** `### Épica 00 — Estructura Base y Mecanismo de Templates` → directorio `EPIC-00-estructura-base-y-mecanismo-de-templates/` con archivo `epic.md`

### 3b. Verificar existencia previa

Si ya existe el **directorio** `$SPECS_BASE/specs/02-epics/EPIC-[ID]-[nombre-kebab]/`, informar al usuario:

```
El directorio $SPECS_BASE/specs/02-epics/EPIC-[ID]-[nombre-kebab]/ ya existe.
¿Deseas sobreescribir epic.md? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar esta épica y continuar con la siguiente.

### 3c. Verificar que el template de épica existe y leerlo

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/epic-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` y emitir:

  > ⚠️ Usando template del skill epic-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si tampoco existe el fallback: informar al usuario y detener la ejecución:

  > ❌ Template `epic-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

### 3d. Escribir el archivo de épica

Crear el directorio `$SPECS_BASE/specs/02-epics/EPIC-[ID]-[nombre-kebab]/` si no existe, luego crear el archivo `epic.md` dentro de ese directorio, poblando cada sección con los datos de la épica:

Completa el archivo de plantilla `$SPECS_BASE/specs/templates/epic-template.md` infiriendo la información. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros en la estructura del template. Para cada sección del template, si el dato correspondiente no existe en el bloque de la épica, usar el placeholder `[Por completar]` para asegurar que la sección siempre está presente y el archivo tiene estructura completa.

Al completar el frontmatter del archivo generado, usar:
- `type: epic` y `id: EPIC-[ID]` — contrato canónico del nivel L2
- `status: DEFINE` — estado inicial de toda épica generada desde un project-plan (en etapa de definición de alcance)
- `created` y `updated` con la fecha actual en formato YYYY-MM-DD

El frontmatter debe cubrir todas las claves obligatorias que valida `/epic-format-validation`: `type`, `id`, `slug`, `title`, `status`, `substatus`, `created`, `updated`. Derívalas del bloque frontmatter del template, no de este ejemplo.

Por ejemplo:

```markdown
---
alwaysApply: false
type: epic
id: EPIC-[ID]
slug: <nombre-kebab del directorio de la épica>
title: <"Nombre completo de la épica">
status: DEFINE
substatus: <substatus extraido o IN-PROGRESS>
parent: <PROJ-NN del proyecto del cual se genera la épica, o null>
created: <fecha actual con formato YYYY-MM-DD>
updated: <fecha actual con formato YYYY-MM-DD>
related: []
---

# Épica: [Nombre completo de la épica]

## Descripción
[Objetivo de la épica extraída del plan. Si no hay objetivo, usar "[Por completar]".]

## Historias
[Lista de features extraída del plan, manteniendo el formato `- [ ] STORY-NNN - **Nombre:** descripción`.
Si no hay features, usar `- [ ] [Por completar]`.]

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

[Generar escenarios de smoke test basados en los criterios de éxito de la épica.
Por cada criterio de éxito, crear un escenario con el formato:]

### Escenario [N]: [Nombre descriptivo derivado del criterio]
**DADO** [precondición implícita del criterio]
**CUANDO** [acción que verifica el criterio]
**ENTONCES** [resultado esperado según el criterio]

[Si no hay criterios de éxito, incluir un escenario placeholder:]

### Escenario 1: Verificación de entrega
**DADO** que la épica ha sido desplegada
**CUANDO** se ejecuta la verificación de las features incluidas
**ENTONCES** todas las features listadas funcionan según lo especificado

## Requerimiento
[Por completar]

## Impacto en Procesos Claves
[Por completar]

## Dependencias Críticas (si las hay)
[Por completar]

## Riesgos (opcional)
[Por completar]

**Criterios de éxito:**
[Lista de criterios de éxito extraída del plan, manteniendo el formato `- [ ] criterio`.
Si no hay criterios, usar `- [ ] [Por completar]`.]

## Notas adicionales
[Por completar]

Este es solo un ejemplo, recuerda que el archivo de plantilla es la guía a completar. No asumas que las secciones siempre estarán en el mismo orden o que tendrán los mismos nombres. Siempre derréglelas dinámicamente de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros en la estructura del template.
```

---

## Fase 4 — Resumen

Al terminar de generar todos los archivos, mostrar un resumen en pantalla:

```
## Épicas generados

Se generaron [N] directorios de épica en $SPECS_BASE/specs/02-epics/:

- $SPECS_BASE/specs/02-epics/EPIC-00-nombre/epic.md
- $SPECS_BASE/specs/02-epics/EPIC-01-nombre/epic.md
...

**Siguiente paso:** Ejecuta `/epic-format-validation` para verificar que cada archivo cumple la estructura obligatoria del template.
```

Si alguna épica fue saltada (usuario eligió no sobreescribir), listarla como:
```
- $SPECS_BASE/specs/02-epics/EPIC-XX-nombre/ — saltado (ya existía)
```

---

## Notas de implementación

- El skill **no valida** el formato de los archivos generados — esa responsabilidad es de `/epic-format-validation`.
- El skill **no modifica** `project-plan.md`.
- Si el plan contiene épicas con el mismo ID (duplicados), generar ambos archivos añadiendo sufijo `-bis` al segundo (ej. `EPIC-01-nombre-bis/`) e informar al usuario.
- Las secciones opcionales del template siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior y asegurar que el archivo tiene estructura completa.
