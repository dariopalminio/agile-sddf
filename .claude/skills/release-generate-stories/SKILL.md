---
name: release-generate-stories
description: "Genera historias de usuario (directorio `<SPECS_BASE>/specs/stories/FEAT-NNN-nombre/story.md`) a partir de las features definidas en el release.md de un directorio de release, usando el template story-template.md. El usuario puede indicar el nombre del directorio de release."
triggers:
  - "release-generate-stories"
  - "generar historias"
  - "historias del release"
  - "stories del release"
  - "generar stories"
  - "derivar historias de release"
---

# Skill: `/release-generate-stories`

**Cuándo usar este skill:**
Usar cuando se quiera generar automáticamente las historias de usuario a partir de las
features definidas en un `release.md`. Invocar también cuando el usuario mencione
"generar historias", "historias del release", "stories del release", "generar stories",
"derivar historias de release", "release-generate-stories" o equivalentes.

## Objetivo

Lee `release.md` de un directorio de release en `$SPECS_BASE/specs/releases/` y genera automáticamente un directorio `FEAT-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada feature definida en la sección `## Features` del release. Cada archivo generado sigue exactamente la estructura de `../story-creation/assets/story-template.md`.

**Qué hace este skill:**
- Resuelve el release a procesar por nombre de directorio (parcial o completo) o por ruta explícita
- Extrae todas las features de la sección `## Features` del `release.md` indicado
- Genera un `story.md` por feature, respetando el template canónico en tiempo de ejecución
- Pregunta al usuario antes de sobreescribir historias existentes

**Qué NO hace este skill:**
- Validar la calidad FINVEST de las historias generadas → usar `/story-evaluation`
- Modificar el archivo de release
- Realizar evaluación INVEST ni splitting automático

## Entrada

- Nombre de directorio de release (parcial o completo), o ruta relativa al directorio/archivo `release.md`

## Parámetros

- `{release}` — nombre de directorio (parcial o completo) o ruta relativa al directorio de release o a `release.md` (obligatorio)

## Precondiciones

- El directorio de release indicado debe existir en `$SPECS_BASE/specs/releases/` y contener `release.md`
- `../story-creation/assets/story-template.md` debe existir
- `skill-preflight` retorna estado OK (entorno válido)

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`../story-creation/assets/story-template.md`]

## Modos de ejecución

- **Manual** (`/release-generate-stories {release}`): interactivo cuando hay conflictos de sobreescritura — pregunta al usuario historia por historia
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

## Restricciones / Reglas

- El skill **no valida** calidad FINVEST — en flujo batch la validación INVEST se delega al paso posterior `/story-evaluation` para no bloquear la generación masiva de historias; ejecutar `/story-evaluation` sobre cada historia generada como siguiente paso obligatorio
- El skill **no modifica** el archivo de release
- El skill procesa **todas** las features del release (pendientes `[ ]` y completadas `[x]`)
- Si dos features tienen el mismo ID (duplicado en el release), añadir sufijo `-bis` al segundo archivo (ej. `FEAT-029-nombre-bis/`) e informar al usuario
- Las secciones opcionales de cada historia se incluyen con placeholder `[Por completar]` para facilitar la edición posterior
- El skill no realiza evaluación INVEST ni splitting — si una historia parece demasiado grande, sugerirlo en las notas pero no dividirla automáticamente
- El template `story-template.md` es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver el input

El skill acepta dos formatos de input:

#### Formato A — Nombre de directorio (parcial o completo)

**Señal:** el input no contiene separadores de directorio (`/` o `\`) o es un nombre de directorio sin `release.md`.

**Acción:**
1. Buscar en `$SPECS_BASE/specs/releases/` **subdirectorios** cuyo nombre contenga el término (sin distinguir mayúsculas).
2. Si hay exactamente 1 coincidencia → usar ese directorio y leer `release.md` dentro. Continuar al Paso 2.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que especifique cuál usar antes de continuar.
4. Si no hay ninguna coincidencia → mostrar el mensaje de error y terminar (ver Manejo de errores).

#### Formato B — Ruta relativa completa al directorio o al archivo `release.md`

**Señal:** el input contiene separadores de directorio (`/` o `\`) o empieza con `$SPECS_BASE/`.

**Acción:** resolver la ruta al archivo `release.md` del directorio indicado. Si el archivo no existe, mostrar el mensaje de error y terminar (ver Manejo de errores).

**En ambos casos, si `release.md` no se encuentra: terminar inmediatamente sin generar ningún archivo de historia.**

---

### Paso 2 — Leer el release y extraer features

Leer el archivo de release resuelto en el Paso 1.

Localizar la sección `## Features`. Solo analizar el contenido dentro de esa sección.

Dentro de esa sección, extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- `- [ ] **FEAT-NNN — Nombre:** descripción`
- Variantes con guion largo `—`, doble guión `--` o dos puntos como separador

Para cada feature, capturar:
- **ID**: el identificador de la feature (ej. `FEAT-027`, `FEAT-029`)
- **Nombre**: el texto después del ID hasta el separador (ej. `Validación de formato de Release`)
- **Descripción**: el texto después del separador, si existe
- **Estado**: `[ ]` (pendiente) o `[x]` (completada) — se procesan todas independientemente del estado

**Si la sección `## Features` no existe o no contiene ninguna entrada**: terminar sin generar ningún archivo (ver Manejo de errores).

---

### Paso 3 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

### Paso 4 — Generar archivos de historia

Para cada feature extraída en el Paso 2, ejecutar los siguientes sub-pasos:

#### 4a. Construir el nombre del directorio

Convertir el nombre de la feature a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (`--` → `-`)
5. Eliminar guiones al inicio o al final

Nombre de directorio resultante: `FEAT-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`

**Ejemplo:** `FEAT-029 — Generar stories` → directorio `FEAT-029-generar-stories/` con archivo `story.md`

#### 4b. Verificar existencia previa

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios. Para
> verificar si ya existe la historia, usar el patrón de archivo anidado:
> `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`.
> Si Glob retorna ese archivo, el directorio existe. Si retorna vacío, no existe.
> Nunca usar el patrón de directorio desnudo (`FEAT-[NNN]-[nombre-kebab]/`) — retornará
> vacío aunque el directorio exista, causando sobreescritura silenciosa sin confirmación.

Si ya existe `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md`, informar al usuario:

```
El directorio $SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/ ya existe.
¿Deseas sobreescribir story.md? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar esta feature y continuar con la siguiente.

#### 4c. Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. El template es de **solo lectura**.

Leer el archivo `../story-creation/assets/story-template.md`.

- Si el archivo **no existe**: detener la ejecución (ver Manejo de errores).
- Si el archivo **existe**: continuar.

#### 4d. Inferir el contenido de la historia

Usando el nombre y la descripción de la feature, inferir:

- **Rol** (`Como`): el desarrollador, PM o practitioner que ejecuta o se beneficia de esta feature dentro del sistema SDDF. Ser específico — evitar "usuario" genérico.
- **Acción** (`Quiero`): la acción concreta que habilita la feature, orientada al usuario y no a la implementación técnica.
- **Beneficio** (`Para`): el valor real que aporta al flujo de trabajo, medible o concreto.

Generar al menos:
- **1 escenario Gherkin principal** (happy path): con `Dado/Cuando/Entonces` específicos y verificables.
- **1 escenario alternativo/error**: con condición de fallo y comportamiento esperado.

Si la feature tiene descripción detallada, usarla para enriquecer los escenarios. Si la descripción es mínima, inferir escenarios razonables desde el nombre y el contexto del sistema SDDF (framework de especificación de software con skills, agents y templates Markdown).

Las secciones opcionales (`⚙️ Criterios no funcionales`, `📎 Notas`) se incluyen con placeholder `[Por completar]` si no hay datos suficientes.

#### 4e. Escribir el archivo de historia

Crear el directorio `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/` si no existe, luego crear el archivo `story.md` dentro de ese directorio con la estructura del template `../story-creation/assets/story-template.md`. Completar dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros.

Al completar el frontmatter del archivo generado, usar:
- `status: SPECIFY` — estado inicial de toda historia generada desde un release planificado (pendiente de refinamiento)

Si no se puede leer el template, generar el archivo con la siguiente estructura de fallback:

```markdown
---
type: story
id: <FEAT-NNN>
slug: <nombre-del-directorio-de-historia>
title: "<Nombre de la feature>"
status: SPECIFY
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

### Escenario principal – [título descriptivo del happy path]
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

### Paso 5 — Resumen

Al terminar de procesar todas las features, mostrar un resumen en pantalla:

```
## Historias generadas

Se generaron [N] directorios de historia en $SPECS_BASE/specs/stories/:

- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/story.md
...

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de cada historia generada, o `/story-refine` para refinarlas de forma interactiva.
```

Si alguna feature fue saltada (usuario eligió no sobreescribir), listarla como:
```
- $SPECS_BASE/specs/stories/FEAT-NNN-nombre/ — saltada (ya existía)
```

Si alguna feature no pudo procesarse por formato inesperado, listarla como:
```
- FEAT-NNN — [Nombre] — no procesada (formato no reconocido)
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Release no encontrado (Formato A, sin coincidencias) | `No se encontró el directorio de release: <término>. Asegúrate de que el directorio existe en $SPECS_BASE/specs/releases/ y vuelve a intentarlo.` | Detener sin generar archivos |
| Release no encontrado (Formato B, ruta inválida) | `No se encontró release.md en: <ruta>. Asegúrate de que la ruta es correcta y vuelve a intentarlo.` | Detener sin generar archivos |
| Sección `## Features` vacía o ausente | `No se encontraron features en el archivo de release indicado.` | Mostrar orientación y detener |
| Template `story-template.md` no encontrado | `❌ No se encontró el template requerido en ../story-creation/assets/story-template.md.` | Detener la ejecución |

---

## Salida

- Directorios `$SPECS_BASE/specs/stories/FEAT-[NNN]-[nombre-kebab]/story.md` creados — uno por feature del release
- Resumen con: historias generadas, historias saltadas (por conflicto), features con formato no reconocido
