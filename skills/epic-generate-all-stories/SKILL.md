---
name: epic-generate-all-stories
description: "Genera historias de usuario (directorio STORY-NNN-nombre/story.md) para todas las épicas existentes en `<SPECS_BASE>/specs/02-epics/`, aplicando el mismo flujo de extracción y generación del skill epic-generate-stories. Procesa todos los directorios de épica en orden alfabético en una sola invocación."
triggers:
  - "epic-generate-all-stories"
  - "generar todas las historias"
  - "historias de todas las épicas"
  - "batch de historias"
  - "poblar historias"
  - "generar historias batch"
---

# Skill: `/epic-generate-all-stories`

## Objetivo

Escanea todos los **directorios** de épica en `$SPECS_BASE/specs/02-epics/`, lee `epic.md` de cada uno, y genera automáticamente un directorio `STORY-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada feature encontrada, siguiendo exactamente la estructura de `$SPECS_BASE/specs/templates/story-template.md`. Es el equivalente batch de `/epic-generate-stories`.

**Qué hace este skill:**
- Descubre automáticamente todas las épicas en `$SPECS_BASE/specs/02-epics/`
- Detecta conflictos anticipadamente y consulta al usuario antes de comenzar el procesamiento
- Genera un `story.md` por cada feature de cada épica, respetando el template canónico en tiempo de ejecución
- Produce un resumen consolidado con el estado de cada historia generada, saltada o fallida

**Qué NO hace este skill:**
- Validar la calidad FINVEST de las historias generadas → usar `/story-evaluation`
- Modificar los archivos de épica existentes
- Reemplazar la lógica de `/epic-generate-stories` — la replica en modo batch sin invocarlo

---

## Entrada

Ninguna — el skill opera sobre todas las épicas existentes en `$SPECS_BASE/specs/02-epics/` sin input explícito del usuario.

---

## Parámetros

Sin parámetros — el skill no expone flags ni argumentos posicionales.

---

## Precondiciones

- `$SPECS_BASE/specs/02-epics/` debe existir y contener al menos un subdirectorio con `epic.md`
- `$SPECS_BASE/specs/templates/story-template.md` debe existir (para estructurar las historias generadas)
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`$SPECS_BASE/specs/templates/story-template.md`]

---

## Modos de ejecución

- **Manual** (`/epic-generate-all-stories`): interactivo cuando hay conflictos (pregunta al usuario cómo manejarlos); sin conflictos, procesa sin interacción adicional
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

---

## Restricciones / Reglas

- El skill **no valida** calidad FINVEST — en flujo batch la validación INVEST se delega al paso posterior `/story-evaluation` para no bloquear la generación masiva de historias; ejecutar `/story-evaluation` sobre cada historia generada como siguiente paso obligatorio
- El skill **no modifica** los archivos de épica
- El skill procesa **todas** las features de cada épica (pendientes `[ ]` y completadas `[x]`)
- El template `story-template.md` es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- Si dos features en distintos épicas generan el mismo nombre de directorio (mismo ID y slug), el segundo se nombra con sufijo `-bis` (ej. `STORY-027-nombre-bis/`) e informa al usuario en el resumen
- Las secciones opcionales de cada historia se incluyen con placeholder `[Por completar]` para facilitar la edición posterior
- El orden de procesamiento es siempre alfabético por nombre de directorio de la épica, equivalente al orden numérico dado el patrón `EPIC-NN-nombre/`
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Descubrir directorios de épica

Listar todas las épicas disponibles usando Glob con el patrón `$SPECS_BASE/specs/02-epics/EPIC-*/epic.md`. La herramienta Glob solo encuentra archivos, no directorios — el patrón debe apuntar al archivo `epic.md` anidado dentro de cada directorio `EPIC-NN-*`. Ordenar los resultados alfabéticamente por nombre de directorio padre.

**Si el directorio `$SPECS_BASE/specs/02-epics/` no existe o no contiene ningún subdirectorio con `epic.md`**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron directorios de épica en $SPECS_BASE/specs/02-epics/

Asegúrate de haber ejecutado el skill /epic-from-project-plan antes de usar este skill,
o verifica que el directorio contiene subdirectorios EPIC-NN-nombre/ con archivo epic.md.
```

Mostrar al usuario la lista de épicas descubiertas antes de continuar:
```
Se encontraron [N] directorios de épica en $SPECS_BASE/specs/02-epics/:
- EPIC-00-nombre/
- EPIC-01-nombre/
...
Procesando en orden alfabético.
```

---

### Paso 2 — Detección anticipada de conflictos

Antes de procesar ningún épica, verificar qué historias ya existen en `$SPECS_BASE/specs/03-stories/` que serían generadas en este batch.

Para ello, leer la sección `## Historias` de cada `epic.md` descubierto en el Paso 1 y calcular los nombres de directorio que se generarían (`STORY-[NNN]-[nombre-kebab]/`). Verificar cuáles de esos directorios ya existen en `$SPECS_BASE/specs/03-stories/`.

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios.
> Para verificar si ya existe una historia, usar el patrón de archivo anidado:
> `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md`.
> Si Glob retorna ese archivo, el directorio existe. Nunca usar el patrón de directorio
> desnudo — retornará vacío aunque el directorio exista, causando detección fallida.

**Si no hay ningún conflicto**, continuar directamente al Paso 3 sin mostrar pantalla de confirmación.

**Si hay al menos un conflicto**, mostrar la lista de directorios en conflicto y presentar la siguiente pregunta antes de comenzar el procesamiento:

```
Se detectaron [N] directorios de historia que ya existen y serían sobreescritos:
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/ (EPIC-XX)
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/ (EPIC-YY)
...

¿Cómo deseas manejar los conflictos?
  (a) Sobreescribir todos los existentes
  (b) Saltar todos los existentes (generar solo los nuevos)
  (c) Decidir uno por uno durante el procesamiento
```

Esperar la respuesta del usuario antes de continuar al Paso 3. Registrar la decisión para aplicarla durante el Paso 4.

---

### Paso 3 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/03-stories/` existe.

Si no existe, crearlo antes de continuar.

---

### Paso 4 — Procesar épicas en batch

Iterar sobre cada archivo de épica en el orden alfabético establecido en el Paso 1. Para cada épica, ejecutar los siguientes sub-pasos:

#### 4a. Extraer features de la épica

Leer la sección `## Historias` del archivo de épica. Extraer cada línea de feature con el formato:
- `- [ ] STORY-NNN — Nombre: descripción` (pendiente)
- `- [x] STORY-NNN — Nombre: descripción` (completada)
- Variantes con `**` (bold), guion largo `—`, doble guión `--` o dos puntos como separador

Capturar para cada feature: **ID** (ej. `STORY-027`), **Nombre** (texto después del ID hasta el separador), **Descripción** (texto después del separador, si existe).

**Si la sección `## Historias` no existe o está vacía:**
- Registrar: `[nombre-epica] — saltada (sin historias)`
- Continuar con el siguiente épica **sin interrumpir el batch**

#### 4b. Generar archivo de historia por feature

Para cada feature extraída de la épica:

**1. Construir el nombre del directorio:**

Convertir el nombre de la feature a kebab-case:
1. Convertir a minúsculas
2. Normalizar acentos: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y caracteres no alfanuméricos por guion `-`
4. Eliminar guiones consecutivos y al inicio/final

Nombre de directorio resultante: `STORY-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md`

**2. Gestionar idempotencia según la decisión del Paso 2:**
- **(a) Sobreescribir todos:** sobreescribir sin preguntar
- **(b) Saltar todos los existentes:** si el archivo ya existe, registrar como saltado y continuar con la siguiente feature
- **(c) Decidir uno por uno:** si el archivo ya existe, preguntar al usuario antes de continuar

**3. Verificar que el template existe:**

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. El template es de **solo lectura**.

Leer el archivo `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/story-creation/assets/story-template.md` y emitir:
  > ⚠️ Usando template del skill story-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.
- Si tampoco existe el fallback: detener la ejecución (ver Manejo de errores).
- Si alguno de los dos **existe**: continuar.

**4. Inferir el contenido de la historia:**

Usar el archivo de plantilla leído para inferir la estructura de la historia, extrayendo el contenido específico de cada sección a partir del nombre y la descripción de la feature.

Usando el nombre y la descripción de la feature, inferir:
- **Como**: rol específico que se beneficia dentro del sistema SDDF (desarrollador, PM, practitioner — ser específico, no "usuario")
- **Quiero**: acción concreta orientada al usuario, no a la implementación técnica
- **Para**: beneficio real y medible, no restatement de la acción

Generar al menos un escenario Gherkin principal (happy path) y uno alternativo/error, con pasos `Dado/Cuando/Entonces` específicos y verificables.

**5. Escribir el archivo:**

Crear el directorio `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/` si no existe, luego crear `story.md` dentro de ese directorio con la estructura del template `$SPECS_BASE/specs/templates/story-template.md` infiriendo la información. Completar dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros.

Al completar el frontmatter del archivo generado, usar:
- `status: SPECIFY` — estado inicial de toda historia generada desde una épica planificada (pendiente de refinamiento). No usar `READY-FOR-IMPLEMENT`: saltaría los gates SPECIFY y PLAN que la máquina de estados declara secuenciales
- `kind: feat` — tipo de historia por defecto; cambiar a `fix`, `chore` o `hotfix` según la naturaleza del trabajo (determina el prefijo de rama)
- `parent: <EPIC-NN>-<slug>` — el **nombre del directorio** de la épica de origen (ej. `EPIC-01-features-spec-builder`), no el ID desnudo

Si no se puede leer el template, generar el archivo con la siguiente estructura de fallback:

```markdown
---
type: story
id: <STORY-NNN>
kind: feat
slug: <nombre-del-directorio-de-historia>
title: "<Nombre de la feature>"
status: SPECIFY
substatus: IN-PROGRESS
parent: <EPIC-NN>-<slug>
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

Generado automáticamente desde la épica: [nombre del archivo de épica]
Feature origen: [ID] — [Nombre de la feature]
```

---

### Paso 5 — Resumen consolidado

Al finalizar el procesamiento de todas las épicas, mostrar el resumen:

```
## Historias generadas — Resumen batch

**Épicas procesados:** [N total]
**Historias generadas:** [N creadas]
**Historias saltadas:** [N saltadas por conflicto]
**Épicas sin historias:** [N épicas que no tenían historias]

### Directorios creados
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/story.md  (EPIC-XX)
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/story.md  (EPIC-YY)
...

### Directorios saltados (ya existían)
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/  (EPIC-XX)
...

### Épicas sin historias (no procesadas)
- $SPECS_BASE/specs/02-epics/EPIC-NN-nombre/

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de las historias generadas, o `/story-specify` para especificarlas de forma interactiva.
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| `$SPECS_BASE/specs/02-epics/` vacío o sin `epic.md` | `No se encontraron directorios de épica en $SPECS_BASE/specs/02-epics/` | Mostrar mensaje de orientación y detener |
| Template `story-template.md` no encontrado | `❌ No se encontró el template requerido en $SPECS_BASE/specs/templates/story-template.md` | Detener la ejecución del batch |
| Épica sin sección `## Historias` | — | Registrar como `[nombre-epica] — saltada (sin historias)` y continuar con la siguiente épica |

---

## Salida

- Directorios `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md` creados — una historia por feature de cada épica procesada
- Resumen consolidado con: épicas procesadas, historias generadas, historias saltadas, épicas sin historias
