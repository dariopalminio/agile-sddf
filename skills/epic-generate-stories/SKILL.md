---
name: epic-generate-stories
description: "Genera historias de usuario (directorio `<SPECS_BASE>/specs/03-stories/STORY-NNN-nombre/story.md`) a partir de las features definidas en el epic.md de un directorio de épica, usando el template story-template.md. El usuario puede indicar el nombre del directorio de la épica."
triggers:
  - "epic-generate-stories"
  - "generar historias"
  - "historias de la épica"
  - "stories de la épica"
  - "generar stories"
  - "derivar historias de épica"
---

# Skill: `/epic-generate-stories`

**Cuándo usar este skill:**
Usar cuando se quiera generar automáticamente las historias de usuario a partir de las
features definidas en un `epic.md`. Invocar también cuando el usuario mencione
"generar historias", "historias de la épica", "stories de la épica", "generar stories",
"derivar historias de épica", "epic-generate-stories" o equivalentes.

## Objetivo

Lee `epic.md` de un directorio de la épica en `$SPECS_BASE/specs/02-epics/` y genera automáticamente un directorio `STORY-[ID]-[Nombre-kebab]/` con un archivo `story.md` por cada historia de la sección de clave `historias` de la épica (su título se lee del template de épica). Cada archivo generado sigue exactamente la estructura de `$SPECS_BASE/templates/story-template.md`.

**Qué hace este skill:**
- Resuelve la épica a procesar por nombre de directorio (parcial o completo) o por ruta explícita
- Localiza la sección de historias por su `clave: historias` en el template de épica (no por título) y extrae sus líneas F1/F2/F3
- Asigna `STORY-NNN` a cada historia planificada (F1 → F2) reescribiendo solo esa sección de la épica
- Genera un `story.md` por feature, respetando el template canónico en tiempo de ejecución
- Pregunta al usuario antes de sobreescribir historias existentes

**Qué NO hace este skill:**
- Validar la calidad FINVEST de las historias generadas → usar `/story-evaluation`
- Modificar el archivo de épica fuera de la sección de historias (salvo `updated:` del frontmatter)
- Realizar evaluación INVEST ni splitting automático

## Entrada

- Nombre de directorio de la épica (parcial o completo), o ruta relativa al directorio/archivo `epic.md`

## Parámetros

- `{epic}` — nombre de directorio (parcial o completo) o ruta relativa al directorio de la épica o a `epic.md` (obligatorio)

## Precondiciones

- El directorio de la épica indicada debe existir en `$SPECS_BASE/specs/02-epics/` y contener `epic.md`
- `$SPECS_BASE/templates/story-template.md` debe existir
- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.

## Dependencias

- Archivos: [`$SPECS_BASE/templates/story-template.md`], [`$SPECS_BASE/templates/epic-template.md`] (o el seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md`)

## Modos de ejecución

- **Manual** (`/epic-generate-stories {epic}`): interactivo cuando hay conflictos de sobreescritura — pregunta al usuario historia por historia
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

## Restricciones / Reglas

- El skill **no valida** calidad FINVEST — en flujo batch la validación INVEST se delega al paso posterior `/story-evaluation` para no bloquear la generación masiva de historias; ejecutar `/story-evaluation` sobre cada historia generada como siguiente paso obligatorio
- El skill **solo modifica** el archivo de épica para asignar IDs: reescribe cada línea **F1** `- <Nombre>: <desc>` de la sección de clave `historias` como **F2** `- [ ] **STORY-NNN** — <Nombre>: <desc>` antes de generar los directorios de historia, y actualiza `updated:` del frontmatter. El resto del archivo (otras secciones, líneas F2/F3, sub-ítems indentados) queda byte a byte igual.
- Formatos de línea aceptados (contrato de dominio `domain-epic-lifecycle` §9): F1 planificada, F2 creada, F3 completada. Los formatos heredados de versiones anteriores del template no se interpretan: la épica se migra con `/memory-system migrate --from=epic-template-v1`.
- El skill procesa **todas** las historias de la sección (F1, F2 y F3)
- Este skill no contiene títulos de sección de la épica: los lee del template por clave
- Si dos features tienen el mismo ID (duplicado en la épica), añadir sufijo `-bis` al segundo archivo (ej. `STORY-029-nombre-bis/`) e informar al usuario
- Las secciones opcionales de cada historia se incluyen con placeholder `[Por completar]` para facilitar la edición posterior
- El skill no realiza evaluación INVEST ni splitting — si una historia parece demasiado grande, sugerirlo en las notas pero no dividirla automáticamente
- El template `story-template.md` es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas especificando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver el input

El skill acepta dos formatos de input:

#### Formato A — Nombre de directorio (parcial o completo)

**Señal:** el input no contiene separadores de directorio (`/` o `\`) o es un nombre de directorio sin `epic.md`.

**Acción:**
1. Buscar en `$SPECS_BASE/specs/02-epics/` **subdirectorios** cuyo nombre contenga el término (sin distinguir mayúsculas).
2. Si hay exactamente 1 coincidencia → usar ese directorio y leer `epic.md` dentro. Continuar al Paso 2.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que especifique cuál usar antes de continuar.
4. Si no hay ninguna coincidencia → mostrar el mensaje de error y terminar (ver Manejo de errores).

#### Formato B — Ruta relativa completa al directorio o al archivo `epic.md`

**Señal:** el input contiene separadores de directorio (`/` o `\`) o empieza con `$SPECS_BASE/`.

**Acción:** resolver la ruta al archivo `epic.md` del directorio indicado. Si el archivo no existe, mostrar el mensaje de error y terminar (ver Manejo de errores).

**En ambos casos, si `epic.md` no se encuentra: terminar inmediatamente sin generar ningún archivo de historia.**

---

### Paso 1b — Resolver la sección de historias desde el template

Leer el template de épica: `$SPECS_BASE/templates/epic-template.md`; si no existe, el seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md`. Si ninguno existe → `❌ Template epic-template.md no encontrado. Ejecuta sddf-init.` y detener.

Para cada línea del template que empiece con `## `, leer la `clave: <clave>` de su comentario. Tomar el **título** (texto del encabezado sin el comentario) de la sección con `clave: historias`; en adelante `<título>`.

- Template sin ninguna sección con `clave: historias` → mostrar `❌ El template no declara una sección con clave historias` y detener sin escribir nada.
- Dos secciones con `clave: historias` → `❌ Template inválido: clave historias duplicada` y detener.
- La épica no tiene un encabezado `## <título>` → **fail-fast sin escribir ningún archivo** (ni la épica ni historias):

  ```
  ❌ La épica no tiene la sección "<título>". Si se creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1
  ```

---

### Paso 2 — Leer la épica y extraer las historias

Leer el archivo de épica resuelto en el Paso 1 y localizar la sección `## <título>` (hasta el siguiente encabezado `## `). Solo analizar las **líneas de nivel superior** de esa sección que empiezan por `- ` (los sub-ítems indentados no son historias y se conservan intactos).

Cada línea debe casar con uno de los tres formatos del dominio:

| Formato | Estado | Forma | Captura |
|---|---|---|---|
| F1 | planificada, sin ID | `- <Nombre>: <descripción>` (sin checkbox y sin `STORY-NNN`) | ID `null` |
| F2 | creada | `- [ ] **STORY-NNN** — <Nombre>: <descripción>` | ID `STORY-NNN` |
| F3 | completada | `- [x] **STORY-NNN** — <Nombre>: <descripción>` | ID `STORY-NNN` |

Para cada historia, capturar **ID**, **Nombre**, **Descripción** y **Estado** (planificada / creada / completada); se procesan todas. Una línea que no casa con ningún formato se lista en el resumen como "no procesada (formato no reconocido)" y no se modifica.

**Si la sección no contiene ninguna historia reconocible**: terminar sin generar ningún archivo (ver Manejo de errores).

---

### Paso 2b — Asignar IDs a las historias planificadas (F1 → F2)

Si **ninguna** historia es F1 → saltar este paso.

Si **alguna** historia es F1:

1. **Calcular el máximo ID en uso desde dos fuentes:**
   - **Fuente A — Filesystem:** usar Glob `$SPECS_BASE/specs/03-stories/STORY-*/story.md`. De cada ruta extraer el número `NNN` del segmento `STORY-NNN-*`. Tomar el mayor.
   - **Fuente B — Épicas existentes:** leer todos los archivos `$SPECS_BASE/specs/02-epics/*/epic.md` y extraer cualquier `STORY-NNN` presente en ellos. Tomar el mayor.
   - `MAX_ID = máximo entre Fuente A y Fuente B` (o `0` si ambas están vacías).

2. **Asignar IDs secuencialmente** a las historias F1, en orden de aparición:
   - Primera F1 → `STORY-(MAX_ID+1)` con cero-padding a 3 dígitos (ej. `STORY-091`)
   - Segunda F1 → `STORY-(MAX_ID+2)`, etc.

3. **Reescribir en `epic.md` solo esas líneas**, dentro de la sección `## <título>`:
   - `- <Nombre>: <desc>` → `- [ ] **STORY-NNN** — <Nombre>: <desc>` (F2; raya `—` U+2014 tras el ID, guion ASCII dentro del ID)
   - Las líneas F2/F3, los sub-ítems y el resto del archivo quedan **byte a byte iguales**; solo se actualiza `updated:` del frontmatter a la fecha de hoy.

   Escribir el archivo actualizado antes de continuar al Paso 3.

4. Emitir resumen de asignación:
   ```
   ℹ️ IDs de historia asignados y registrados en epic.md:
   - Exportar CSV → STORY-091
   - Filtros → STORY-092
   ...
   ```

---

### Paso 3 — Preparar directorio de destino

Verificar si el directorio `$SPECS_BASE/specs/03-stories/` existe.

Si no existe, crearlo antes de continuar.

---

### Paso 4 — Generar archivos de historia

Para cada historia extraída en el Paso 2 (con el ID ya asignado), ejecutar los siguientes sub-pasos:

#### 4a. Construir el nombre del directorio

Convertir el nombre de la feature a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (`--` → `-`)
5. Eliminar guiones al inicio o al final

Nombre de directorio resultante: `STORY-[NNN]-[nombre-kebab]`

Ruta del archivo de salida: `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md`

**Ejemplo:** `- [ ] **STORY-029** — Generar stories: …` → directorio `STORY-029-generar-stories/` con archivo `story.md`

#### 4b. Verificar existencia previa

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios. Para
> verificar si ya existe la historia, usar el patrón de archivo anidado:
> `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md`.
> Si Glob retorna ese archivo, el directorio existe. Si retorna vacío, no existe.
> Nunca usar el patrón de directorio desnudo (`STORY-[NNN]-[nombre-kebab]/`) — retornará
> vacío aunque el directorio exista, causando sobreescritura silenciosa sin confirmación.

Si ya existe `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md`, informar al usuario:

```
El directorio $SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/ ya existe.
¿Deseas sobreescribir story.md? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar esta feature y continuar con la siguiente.

#### 4c. Verificar que el template existe

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. El template es de **solo lectura**.

Leer el archivo `$SPECS_BASE/templates/story-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/story-creation/assets/story-template.md` y emitir:
  > ⚠️ Usando template del skill story-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/templates/`.
- Si tampoco existe el fallback: detener la ejecución (ver Manejo de errores).
- Si alguno de los dos **existe**: continuar.

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

Crear el directorio `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/` si no existe, luego crear el archivo `story.md` dentro de ese directorio con la estructura del template `$SPECS_BASE/templates/story-template.md`. Completar dinámicamente la estructura de la plantilla en tiempo de ejecución para asegurar flexibilidad ante cambios futuros.

Al completar el frontmatter del archivo generado, usar:
- `status: SPECIFY` — estado inicial de toda historia generada desde una épica planificada (pendiente de refinamiento)
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

Generado automáticamente desde la épica: [nombre del archivo de épica]
Feature origen: [ID] — [Nombre de la feature]
```

---

### Paso 5 — Resumen

Al terminar de procesar todas las features, mostrar un resumen en pantalla:

```
## Historias generadas

Se generaron [N] directorios de historia en $SPECS_BASE/specs/03-stories/:

- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/story.md
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/story.md
...

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de cada historia generada, o `/story-specify` para especificarlas de forma interactiva.
```

Si alguna feature fue saltada (usuario eligió no sobreescribir), listarla como:
```
- $SPECS_BASE/specs/03-stories/STORY-NNN-nombre/ — saltada (ya existía)
```

Si alguna feature no pudo procesarse por formato inesperado, listarla como:
```
- STORY-NNN — [Nombre] — no procesada (formato no reconocido)
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Épica no encontrado (Formato A, sin coincidencias) | `No se encontró el directorio de la épica: <término>. Asegúrate de que el directorio existe en $SPECS_BASE/specs/02-epics/ y vuelve a intentarlo.` | Detener sin generar archivos |
| Épica no encontrado (Formato B, ruta inválida) | `No se encontró epic.md en: <ruta>. Asegúrate de que la ruta es correcta y vuelve a intentarlo.` | Detener sin generar archivos |
| Template sin `clave: historias` | `❌ El template no declara una sección con clave historias` | Detener sin escribir |
| Épica sin la sección de clave `historias` | `❌ La épica no tiene la sección "<título>". Si se creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1` | Detener sin escribir ningún archivo |
| Sección de historias sin historias reconocibles | `No se encontraron historias en el archivo de épica indicada.` | Mostrar orientación y detener |
| Template `story-template.md` no encontrado | `❌ No se encontró el template requerido en $SPECS_BASE/templates/story-template.md.` | Detener la ejecución |

---

## Salida

- Directorios `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre-kebab]/story.md` creados — uno por feature de la épica
- Resumen con: historias generadas, historias saltadas (por conflicto), features con formato no reconocido
