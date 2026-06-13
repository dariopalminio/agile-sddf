---
name: releases-from-project-plan
description: "Genera especificaciones de release (directorio `EPIC-NN-nombre/release.md`) a partir de los releases planificados en `<SPECS_BASE>/specs/projects/<PROJ-ID>-<nombre>/project-plan.md`, usando el template `release-spec-template.md`."
---
# Skill: /releases-from-project-plan

Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md` y genera automáticamente un directorio `EPIC-[ID]-[nombre-kebab]/` con un archivo `release.md` por cada release planificado en la sección "Propuesta de Releases". Cada archivo generado sigue exactamente la estructura de `$SPECS_BASE/specs/templates/release-spec-template.md`.

**Usar cuando:**
- Se quiere materializar los releases de un `project-plan.md` como archivos de especificación listos para editar
- Como paso previo a ejecutar `/release-format-validation` o `/story-creation` sobre un release específico
- Para asegurar consistencia de formato entre todos los releases de un proyecto

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

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE`.
3. Si se encuentra exactamente uno con `substatus: DONE` → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija antes de continuar.
5. Si no se encuentra ninguno → mostrar error y detener:
   > ❌ No se encontró ningún proyecto activo en `$SPECS_BASE/specs/projects/`.
   > Ejecuta `/project-begin` primero.

La ruta completa del proyecto activo es: `$SPECS_BASE/specs/projects/$PROJ_DIR/`

---

## Fase 0 — Verificar input

Verificar que el archivo `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md` existe.

**Si no existe**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontró $SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md

Asegúrate de haber ejecutado el skill /project-planning antes de usar este skill.
```

---

## Fase 1 — Extraer releases del plan

Leer `$SPECS_BASE/specs/projects/$PROJ_DIR/project-plan.md`.

Localizar la sección `## Propuesta de Releases`. Solo analizar el contenido dentro de esa sección (ignorar todo lo que esté antes o pertenezca a otras secciones `##`).

Dentro de esa sección, extraer cada bloque delimitado por un encabezado `### Release NN — Nombre` y el siguiente separador `---` o el siguiente `###`. Para cada bloque, capturar:

- **ID**: el número de dos dígitos que sigue a `### Release ` (ej. `00`, `01`, `06`)
- **Nombre**: el texto después de ` — ` en la misma línea (ej. `Estructura Base y Mecanismo de Templates`)
- substatus: el valor del campo `substatus:` si existe en el bloque (ej. `DONE`, `IN‑PROGRESS`); si no existe, usar `IN‑PROGRESS`
- **Fecha**: el valor del campo `**Fecha:**` si existe; si no existe, usar la fecha actual en formato YYYY-MM-DD
- **Objetivo**: el párrafo que sigue a `**Objetivo:**`
- **Features**: las líneas con formato `- [ ] FEAT-NNN - Nombre` o `- [x] FEAT-NNN - Nombre` dentro del bloque
- **Criterios de éxito**: las líneas que siguen a `**Criterios de éxito:**` dentro del bloque

**Si no se encuentra ningún bloque `### Release`** dentro de la sección, mostrar el siguiente mensaje y terminar:

```
No se encontraron releases planificados en project-plan.md

Verifica que el archivo contiene una sección "## Propuesta de Releases" con bloques "### Release NN — Nombre".
```

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/releases/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Generar archivos de release

Para cada release extraído en Fase 1, ejecutar los siguientes pasos:

### 3a. Construir el nombre del directorio

Convertir el nombre del release a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n (y sus mayúsculas)
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (reemplazar `--` por `-`)
5. Eliminar guiones al inicio o al final

Nombre de directorio resultante: `EPIC-[ID]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/releases/EPIC-[ID]-[nombre-kebab]/release.md`

**Ejemplo:** `### Release 00 — Estructura Base y Mecanismo de Templates` → directorio `EPIC-00-estructura-base-y-mecanismo-de-templates/` con archivo `release.md`

### 3b. Verificar existencia previa

Si ya existe el **directorio** `$SPECS_BASE/specs/releases/EPIC-[ID]-[nombre-kebab]/`, informar al usuario:

```
El directorio $SPECS_BASE/specs/releases/EPIC-[ID]-[nombre-kebab]/ ya existe.
¿Deseas sobreescribir release.md? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar este release y continuar con el siguiente.

### 3c. Verificar que el template de release existe y leerlo

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/release-spec-template.md`.

- Si el archivo central **no existe**: usar el fallback `.claude/skills/release-creation/assets/release-spec-template.md` y emitir:

  > ⚠️ Usando template del skill release-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si tampoco existe el fallback: informar al usuario y detener la ejecución:

  > ❌ Template `release-spec-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

### 3d. Escribir el archivo de release

Crear el directorio `$SPECS_BASE/specs/releases/EPIC-[ID]-[nombre-kebab]/` si no existe, luego crear el archivo `release.md` dentro de ese directorio, poblando cada sección con los datos del release:

Completa el archivo de plantilla `$SPECS_BASE/specs/templates/release-spec-template.md` infiriendo la información. Siempre completa dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros en la estructura del template. Para cada sección del template, si el dato correspondiente no existe en el bloque del release, usar el placeholder `[Por completar]` para asegurar que la sección siempre está presente y el archivo tiene estructura completa.

Al completar el frontmatter del archivo generado, usar:
- `status: DEFINITION` — estado inicial de todo release generado desde un project-plan (en etapa de definición, pendiente de validación)

Por ejemplo:

```markdown
---
title: <"Nombre completo del release">
date: <Fecha extraída o fecha actual con formato YYYY-MM-DD>
status: DEFINITION
substatus: <substatus extraido o IN‑PROGRESS>
parent: <nombre del archivo de requirement-spec del proyecto del cual se genera el releaseo N/A>
---

# Release/Epic: [Nombre completo del release]

## Descripción
[Objetivo del release extraído del plan. Si no hay objetivo, usar "[Por completar]".]

## Features
[Lista de features extraída del plan, manteniendo el formato `- [ ] FEAT-NNN - **Nombre:** descripción`.
Si no hay features, usar `- [ ] [Por completar]`.]

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

[Generar escenarios de smoke test basados en los criterios de éxito del release.
Por cada criterio de éxito, crear un escenario con el formato:]

### Escenario [N]: [Nombre descriptivo derivado del criterio]
**DADO** [precondición implícita del criterio]
**CUANDO** [acción que verifica el criterio]
**ENTONCES** [resultado esperado según el criterio]

[Si no hay criterios de éxito, incluir un escenario placeholder:]

### Escenario 1: Verificación de entrega
**DADO** que el release ha sido desplegado
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
## Releases generados

Se generaron [N] directorios de release en $SPECS_BASE/specs/releases/:

- $SPECS_BASE/specs/releases/EPIC-00-nombre/release.md
- $SPECS_BASE/specs/releases/EPIC-01-nombre/release.md
...

**Siguiente paso:** Ejecuta `/release-format-validation` para verificar que cada archivo cumple la estructura obligatoria del template.
```

Si algún release fue saltado (usuario eligió no sobreescribir), listarlo como:
```
- $SPECS_BASE/specs/releases/EPIC-XX-nombre/ — saltado (ya existía)
```

---

## Notas de implementación

- El skill **no valida** el formato de los archivos generados — esa responsabilidad es de `/release-format-validation`.
- El skill **no modifica** `project-plan.md`.
- Si el plan contiene releases con el mismo ID (duplicados), generar ambos archivos añadiendo sufijo `-bis` al segundo (ej. `release-01-nombre-bis.md`) e informar al usuario.
- Las secciones opcionales del template siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior y asegurar que el archivo tiene estructura completa.
