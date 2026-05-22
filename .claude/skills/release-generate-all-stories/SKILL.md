---
name: release-generate-all-stories
description: "Genera historias de usuario (directorio FEAT-NNN-nombre/story.md) para todos los releases existentes en `<SPECS_BASE>/specs/releases/`, aplicando el mismo flujo de extracción y generación del skill release-generate-stories. Procesa todos los directorios de release en orden alfabético en una sola invocación."
triggers:
  - "release-generate-all-stories"
  - "generar todas las historias"
  - "historias de todos los releases"
  - "batch de historias"
  - "poblar historias"
  - "generar historias batch"
---

# Skill: `/release-generate-all-stories`

## Objetivo

Escanea todos los **directorios** de release en `$SPECS_BASE/specs/releases/`, lee `release.md` de cada uno, y genera automáticamente un directorio `FEAT-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada feature encontrada, siguiendo exactamente la estructura de `$SPECS_BASE/specs/templates/story-template.md`. Es el equivalente batch de `/release-generate-stories`.

**Qué hace este skill:**
- Descubre automáticamente todos los releases en `$SPECS_BASE/specs/releases/`
- Detecta conflictos anticipadamente y consulta al usuario antes de comenzar el procesamiento
- Genera un `story.md` por cada feature de cada release, respetando el template canónico en tiempo de ejecución
- Produce un resumen consolidado con el estado de cada historia generada, saltada o fallida

**Qué NO hace este skill:**
- Validar la calidad FINVEST de las historias generadas → usar `/story-evaluation`
- Modificar los archivos de release existentes
- Reemplazar la lógica de `/release-generate-stories` — la replica en modo batch sin invocarlo

---

## Entrada

Ninguna — el skill opera sobre todos los releases existentes en `$SPECS_BASE/specs/releases/` sin input explícito del usuario.

---

## Parámetros

Sin parámetros — el skill no expone flags ni argumentos posicionales.

---

## Precondiciones

- `$SPECS_BASE/specs/releases/` debe existir y contener al menos un subdirectorio con `release.md`
- `$SPECS_BASE/specs/templates/story-template.md` debe existir (para estructurar las historias generadas)
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`$SPECS_BASE/specs/templates/story-template.md`]

---

## Modos de ejecución

- **Manual** (`/release-generate-all-stories`): interactivo cuando hay conflictos (pregunta al usuario cómo manejarlos); sin conflictos, procesa sin interacción adicional
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

---

## Restricciones / Reglas

- El skill **no valida** calidad FINVEST — en flujo batch la validación INVEST se delega al paso posterior `/story-evaluation` para no bloquear la generación masiva de historias; ejecutar `/story-evaluation` sobre cada historia generada como siguiente paso obligatorio
- El skill **no modifica** los archivos de release
- El skill procesa **todas** las features de cada release (pendientes `[ ]` y completadas `[x]`)
- El template `story-template.md` es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- Si dos features en distintos releases generan el mismo nombre de directorio (mismo ID y slug), el segundo se nombra con sufijo `-bis` (ej. `FEAT-027-nombre-bis/`) e informa al usuario en el resumen
- Las secciones opcionales de cada historia se incluyen con placeholder `[Por completar]` para facilitar la edición posterior
- El orden de procesamiento es siempre alfabético por nombre de directorio de release, equivalente al orden numérico dado el patrón `EPIC-NN-nombre/`
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Descubrir directorios de release

Listar todos los releases disponibles usando Glob con el patrón `$SPECS_BASE/specs/releases/EPIC-*/release.md`. La herramienta Glob solo encuentra archivos, no directorios — el patrón debe apuntar al archivo `release.md` anidado dentro de cada directorio `EPIC-NN-*`. Ordenar los resultados alfabéticamente por nombre de directorio padre.

**Si el directorio `$SPECS_BASE/specs/releases/` no existe o no contiene ningún subdirectorio con `release.md`**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron directorios de release en $SPECS_BASE/specs/releases/

Asegúrate de haber ejecutado el skill /releases-from-project-plan antes de usar este skill,
o verifica que el directorio contiene subdirectorios EPIC-NN-nombre/ con archivo release.md.
```

Mostrar al usuario la lista de releases descubiertos antes de continuar:
```
Se encontraron [N] directorios de release en $SPECS_BASE/specs/releases/:
- EPIC-00-nombre/
- EPIC-01-nombre/
...
Procesando en orden alfabético.
```

---

### Paso 2 — Detección anticipada de conflictos

Antes de procesar ningún release, verificar qué historias ya existen en `$SPECS_BASE/specs/stories/` que serían generadas en este batch.

Para ello, leer la sección `## Features` de cada `release.md` descubierto en el Paso 1 y calcular los nombres de directorio que se generarían (`FEAT-[NNN]-[nombre-kebab]/`). Verificar cuáles de esos directorios ya existen en `$SPECS_BASE/specs/stories/`.

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios.
> Para verificar si ya existe una historia, usar el patrón de archivo anidado:
> `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`.
> Si Glob retorna ese archivo, el directorio existe. Nunca usar el patrón de directorio
> desnudo — retornará vacío aunque el directorio exista, causando detección fallida.

**Si no hay ningún conflicto**, continuar directamente al Paso 3 sin mostrar pantalla de confirmación.

**Si hay al menos un conflicto**, mostrar la lista de directorios en conflicto y presentar la siguiente pregunta antes de comenzar el procesamiento:

```
Se detectaron [N] directorios de historia que ya existen y serían sobreescritos:
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ (EPIC-XX)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ (EPIC-YY)
...

¿Cómo deseas manejar los conflictos?
  (a) Sobreescribir todos los existentes
  (b) Saltar todos los existentes (generar solo los nuevos)
  (c) Decidir uno por uno durante el procesamiento
```

Esperar la respuesta del usuario antes de continuar al Paso 3. Registrar la decisión para aplicarla durante el Paso 4.

---

### Paso 3 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

### Paso 4 — Procesar releases en batch

Iterar sobre cada archivo de release en el orden alfabético establecido en el Paso 1. Para cada release, ejecutar los siguientes sub-pasos:

#### 4a. Extraer features del release

Leer la sección `## Features` del archivo de release. Extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- Variantes con `**` (bold), guion largo `—`, doble guión `--` o dos puntos como separador

Capturar para cada feature: **ID** (ej. `FEAT-027`), **Nombre** (texto después del ID hasta el separador), **Descripción** (texto después del separador, si existe).

**Si la sección `## Features` no existe o está vacía:**
- Registrar: `[nombre-release] — saltado (sin features)`
- Continuar con el siguiente release **sin interrumpir el batch**

#### 4b. Generar archivo de historia por feature

Para cada feature extraída del release:

**1. Construir el nombre del directorio:**

Convertir el nombre de la feature a kebab-case:
1. Convertir a minúsculas
2. Normalizar acentos: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y caracteres no alfanuméricos por guion `-`
4. Eliminar guiones consecutivos y al inicio/final

Nombre de directorio resultante: `FEAT-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`

**2. Gestionar idempotencia según la decisión del Paso 2:**
- **(a) Sobreescribir todos:** sobreescribir sin preguntar
- **(b) Saltar todos los existentes:** si el archivo ya existe, registrar como saltado y continuar con la siguiente feature
- **(c) Decidir uno por uno:** si el archivo ya existe, preguntar al usuario antes de continuar

**3. Verificar que el template existe:**

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. El template es de **solo lectura**.

Leer el archivo `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo **no existe**: detener la ejecución (ver Manejo de errores).
- Si el archivo **existe**: continuar.

**4. Inferir el contenido de la historia:**

Usar el archivo de plantilla leído para inferir la estructura de la historia, extrayendo el contenido específico de cada sección a partir del nombre y la descripción de la feature.

Usando el nombre y la descripción de la feature, inferir:
- **Como**: rol específico que se beneficia dentro del sistema SDDF (desarrollador, PM, practitioner — ser específico, no "usuario")
- **Quiero**: acción concreta orientada al usuario, no a la implementación técnica
- **Para**: beneficio real y medible, no restatement de la acción

Generar al menos un escenario Gherkin principal (happy path) y uno alternativo/error, con pasos `Dado/Cuando/Entonces` específicos y verificables.

**5. Escribir el archivo:**

Crear el directorio `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/` si no existe, luego crear `story.md` dentro de ese directorio con la estructura del template `$SPECS_BASE/specs/templates/story-template.md` infiriendo la información. Completar dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros.

Al completar el frontmatter del archivo generado, usar:
- `status: READY-FOR-IMPLEMENT` — estado inicial de toda historia generada desde un release planificado (pendiente de refinamiento)

Si no se puede leer el template, generar el archivo con la siguiente estructura de fallback:

```markdown
---
type: story
id: <FEAT-NNN>
slug: <nombre-del-directorio-de-historia>
title: "<Nombre de la feature>"
status: READY-FOR-IMPLEMENT
substatus: IN‑PROGRESS
parent: <EPIC-NN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Historia de Usuario

## 📖 Historia: [Nombre de la feature]

**Como** [rol específico inferido]
**Quiero** [acción concreta orientada al usuario]
**Para** [beneficio real y medible]

## ✅ Criterios de aceptación

### Escenario principal – [título descriptivo]
```gherkin
Dado [contexto inicial específico]
  Y [condición adicional si aplica]
Cuando [acción del usuario]
Entonces [resultado esperado concreto]
  Y [resultado adicional si aplica]
```

### Escenario alternativo / error – [título]
```gherkin
Dado [contexto de fallo]
Cuando [acción inválida o condición de error]
Entonces [mensaje de error o comportamiento alternativo]
  Pero [excepción si aplica]
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: [nombre del archivo de release]
Feature origen: [ID] — [Nombre de la feature]
```

---

### Paso 5 — Resumen consolidado

Al finalizar el procesamiento de todos los releases, mostrar el resumen:

```
## Historias generadas — Resumen batch

**Releases procesados:** [N total]
**Historias generadas:** [N creadas]
**Historias saltadas:** [N saltadas por conflicto]
**Releases sin features:** [N releases que no tenían features]

### Directorios creados
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md  (EPIC-XX)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md  (EPIC-YY)
...

### Directorios saltados (ya existían)
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/  (EPIC-XX)
...

### Releases sin features (no procesados)
- $SPECS_BASE/specs/releases/EPIC-NN-nombre/

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de las historias generadas, o `/story-refine` para refinarlas de forma interactiva.
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| `$SPECS_BASE/specs/releases/` vacío o sin `release.md` | `No se encontraron directorios de release en $SPECS_BASE/specs/releases/` | Mostrar mensaje de orientación y detener |
| Template `story-template.md` no encontrado | `❌ No se encontró el template requerido en $SPECS_BASE/specs/templates/story-template.md` | Detener la ejecución del batch |
| Release sin sección `## Features` | — | Registrar como `[nombre-release] — saltado (sin features)` y continuar con el siguiente release |

---

## Salida

- Directorios `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md` creados — una historia por feature de cada release procesado
- Resumen consolidado con: releases procesados, historias generadas, historias saltadas, releases sin features
