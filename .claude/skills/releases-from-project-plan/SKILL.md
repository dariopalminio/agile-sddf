---
name: releases-from-project-plan
description: "Genera archivos de especificación de release (release-[ID]-[Nombre].md) a partir de los releases planificados en docs/specs/project/project-plan.md, usando el template release-spec-template.md."
---
# Skill: /releases-from-project-plan

Lee `docs/specs/project/project-plan.md` y genera automáticamente un archivo `release-[ID]-[Nombre].md` por cada release planificado en la sección "Propuesta de Releases". Cada archivo generado sigue exactamente la estructura de `.claude/skills/releases-from-project-plan/templates/release-spec-template.md`.

**Usar cuando:**
- Se quiere materializar los releases de un `project-plan.md` como archivos de especificación listos para editar
- Como paso previo a ejecutar `/release-format-validation` o `/story-creation` sobre un release específico
- Para asegurar consistencia de formato entre todos los releases de un proyecto

---

## Fase 0 — Verificar input

Verificar que el archivo `docs/specs/project/project-plan.md` existe.

**Si no existe**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontró docs/specs/project/project-plan.md

Asegúrate de haber ejecutado el skill /project-planning antes de usar este skill.
```

---

## Fase 1 — Extraer releases del plan

Leer `docs/specs/project/project-plan.md`.

Localizar la sección `## Propuesta de Releases`. Solo analizar el contenido dentro de esa sección (ignorar todo lo que esté antes o pertenezca a otras secciones `##`).

Dentro de esa sección, extraer cada bloque delimitado por un encabezado `### Release NN — Nombre` y el siguiente separador `---` o el siguiente `###`. Para cada bloque, capturar:

- **ID**: el número de dos dígitos que sigue a `### Release ` (ej. `00`, `01`, `06`)
- **Nombre**: el texto después de ` — ` en la misma línea (ej. `Estructura Base y Mecanismo de Templates`)
- **Estado**: el valor del campo `**Estado:**` si existe en el bloque (ej. `Ready`, `Doing`); si no existe, usar `Doing`
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

Verificar si el directorio `docs/specs/releases/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Generar archivos de release

Para cada release extraído en Fase 1, ejecutar los siguientes pasos:

### 3a. Construir el nombre de archivo

Convertir el nombre del release a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n (y sus mayúsculas)
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (reemplazar `--` por `-`)
5. Eliminar guiones al inicio o al final

Nombre de archivo resultante: `release-[ID]-[nombre-kebab].md`

**Ejemplo:** `### Release 00 — Estructura Base y Mecanismo de Templates` → `release-00-estructura-base-y-mecanismo-de-templates.md`

### 3b. Verificar existencia previa

Si ya existe un archivo con ese nombre en `docs/specs/releases/`, informar al usuario:

```
El archivo docs/specs/releases/release-[ID]-[nombre-kebab].md ya existe.
¿Deseas sobreescribirlo? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar este release y continuar con el siguiente.

### 3c. Escribir el archivo de release

Crear el archivo `docs/specs/releases/release-[ID]-[nombre-kebab].md` con la siguiente estructura, poblando cada sección con los datos del release:

```markdown
---
**Título**: [Nombre completo del release]
**Versión**: 1.0
**Estado**: [Estado extraído o "Doing"]
**Fecha**: [Fecha extraída o fecha actual]
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
```

---

## Fase 4 — Resumen

Al terminar de generar todos los archivos, mostrar un resumen en pantalla:

```
## Releases generados

Se generaron [N] archivos de release en docs/specs/releases/:

- docs/specs/releases/release-00-nombre.md
- docs/specs/releases/release-01-nombre.md
...

**Siguiente paso:** Ejecuta `/release-format-validation` para verificar que cada archivo cumple la estructura obligatoria del template.
```

Si algún release fue saltado (usuario eligió no sobreescribir), listarlo como:
```
- docs/specs/releases/release-XX-nombre.md — saltado (ya existía)
```

---

## Notas de implementación

- El skill **no valida** el formato de los archivos generados — esa responsabilidad es de `/release-format-validation`.
- El skill **no modifica** `project-plan.md`.
- Si el plan contiene releases con el mismo ID (duplicados), generar ambos archivos añadiendo sufijo `-bis` al segundo (ej. `release-01-nombre-bis.md`) e informar al usuario.
- Las secciones opcionales del template siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior y asegurar que el archivo tiene estructura completa.
