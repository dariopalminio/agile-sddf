---
name: story-split
description: >-
  Divide una historia épica en historias más pequeñas usando los 8 patrones de Richard Lawrence.
  Usar cuando S≤2 en FINVEST, ≥4 escenarios Gherkin, o el equipo no puede estimarla.
  Invocar para "story-split", "dividir historia", "historia muy grande",
  "split de historia", "historia épica", "descomponer historia".
triggers:
  - "story-split"
  - "dividir historia"
  - "historia muy grande"
  - "split de historia"
  - "historia épica"
  - "descomponer historia"
---

# Skill: `/story-split`

## Objetivo

Toma una historia grande, épica o feature demasiado amplio y lo divide en historias más pequeñas e independientes. Cada historia resultante sigue **estrictamente** el template `$SPECS_BASE/specs/templates/story-template.md`.

**Qué hace este skill:**
- Divide historias grandes en historias más pequeñas aplicando los 8 patrones de splitting de Richard Lawrence
- Designa una historia core que hereda el ID y directorio original
- Asigna IDs nuevos consecutivos a las historias adicionales resultantes
- Valida que cada historia resultante cumple INVEST individualmente
- Soporta modo `--dry-run` para previsualizar el plan antes de crear archivos

**Qué NO hace este skill:**
- Dividir historias que ya son pequeñas y bien acotadas (no sobre-dividir)
- Crear splits con dependencias duras que bloqueen entrega de valor
- Dividir tareas técnicas sin valor de usuario directo
- Generar design, tasks ni artefactos de planning para las historias resultantes

---

## Entrada

El skill acepta tres tipos de input:

- **Tipo A — Texto libre**: historia completa o descripción de feature en lenguaje natural
- **Tipo B — Ruta de archivo**: ruta relativa o absoluta a un archivo `.md` con el contenido de la historia
- **Tipo C — Término de búsqueda**: palabra o frase corta para localizar una historia en `$SPECS_BASE/specs/stories/`

Fuente estructural del output: `$SPECS_BASE/specs/templates/story-template.md` (leído en tiempo de ejecución)

---

## Parámetros

- `{story_id}` — identificador o ruta de la historia a dividir (ej. `FEAT-042`)
- `--dry-run` — muestra el plan de splitting (patrón, historias propuestas, core designada) sin crear ni modificar ningún archivo
- `--pattern N` — fuerza el patrón de splitting 1–8, saltando la selección automática del Paso 4
- `--core N` — designa manualmente qué historia del split (por número de orden) será la core; omite la selección automática del Paso 5

---

## Precondiciones

- La historia a dividir existe bajo `$SPECS_BASE/specs/stories/` o fue provista como texto libre o ruta de archivo
- El archivo `$SPECS_BASE/specs/templates/story-template.md` existe
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`$SPECS_BASE/specs/templates/story-template.md`]

---

## Modos de ejecución

- **Manual**: `/story-split {story_id}` — interactivo, muestra diagnóstico y plan antes de escribir archivos
- **Automático**: invocado por orquestador de nivel superior — reporta resultado sin interacción

---

## Restricciones / Reglas

- El template es de solo lectura — nunca se escribe, modifica ni usa como ruta de salida
- La estructura del output la dicta el template en tiempo de ejecución — nunca se hardcodea
- Con `--dry-run` no se crea ni modifica ningún archivo — solo se muestra el plan
- Cada historia resultante debe cumplir INVEST individualmente; si alguna no cumple **V** (valor), revisar el patrón — probablemente se hizo corte horizontal en lugar de vertical
- **Idempotencia**: si el directorio original ya fue renombrado (slug no coincide), el skill lo detecta y omite el renombrado sin error; si los directorios de historias adicionales ya existen, informa al usuario y no los sobreescribe
- Los TADs (Patrón 8) no son historias — no se guardan como archivos `story.md`
- **Anti-patrones a evitar**:
  - Corte horizontal ("Historia 1: API. Historia 2: UI") — ninguna entrega valor sola; usar corte vertical
  - Over-splitting — solo dividir cuando hay señales claras de tamaño excesivo
  - Splits con el mismo `Para` — cada split debe tener un beneficio diferenciado
  - Dependencias duras entre splits — reordenar o replantear el patrón
  - Split arbitrario sin racionalidad de valor o workflow — usar uno de los 8 patrones con justificación
  - Dejar la historia original como huérfana con `status: SPLIT` — siempre repurpose el directorio como historia core
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; este skill solo produce archivos de especificaciones `.md`.
- NO incluya detalles de implementación (consultas específicas, estructuras JSON, firmas de métodos, anotaciones, inventarios de la capa de componentes, lógica paso a paso); estos detalles pertenecen a la etapa de planeación del diseño.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Leer template canónico

Leer el archivo `$SPECS_BASE/specs/templates/story-template.md`.

El template es la **única fuente de información estructural** para generar el output. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución.

Si el archivo central **no existe**, usar el fallback `.claude/skills/story-creation/assets/story-template.md` y emitir:
> ⚠️ Usando template del skill story-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

Si tampoco existe el fallback, detener y notificar (ver sección Manejo de errores).

---

### Paso 2 — Resolver el input

Detectar el tipo de input proporcionado:

#### Tipo A — Texto libre
**Señal:** El input es texto de una historia de usuario o descripción de feature.
**Acción:** Continuar directamente al Paso 3.

#### Tipo B — Ruta de archivo
**Señal:** El input parece una ruta (contiene `/` o `\`, o termina en `.md`).
**Acción:** Leer el archivo en esa ruta y usar su contenido como historia a dividir. Continuar al Paso 3.

#### Tipo C — Término de búsqueda
**Señal:** El input es una palabra o frase corta que no parece texto de historia ni ruta explícita.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/stories/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas)
2. Si hay exactamente 1 coincidencia → leerlo y usarlo como historia a dividir. Continuar al Paso 3.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → tratar el input como Tipo A (texto libre).

---

### Paso 3 — Diagnosticar la historia original

Leer la historia completa y responder:

1. ¿Cuántos escenarios Gherkin tiene? ¿Cuántos pasos totales?
2. ¿Hay múltiples flujos de usuario independientes bundleados?
3. ¿Mezcla varios roles, tipos de datos o reglas de negocio?
4. ¿Tiene dependencias externas múltiples?
5. ¿Por qué es difícil de estimar?

Identificar el **patrón de splitting más apropiado** (ver Paso 4). Si aplican varios, aplicarlos en orden.

#### Paso 3b — Leer reporte FINVEST (si existe)

Si el directorio de la historia contiene `finvest-evaluation-report.md`:

1. Leer el archivo usando Glob con el patrón `<directorio-historia>/finvest-evaluation-report.md`.
2. Verificar el frontmatter YAML: si `decision: DIVIDIR`, continuar; si no, ignorar el archivo.
3. Buscar en el cuerpo la sección `## Plan de división sugerido` o `### Plan de división sugerido`.
4. Si la sección existe, extraer la tabla de división: para cada fila capturar la historia hija
   propuesta (ej. `FEAT-074a`), los escenarios asignados y el foco.
5. Guardar este plan como `plan_finvest` para usarlo en el Paso 4.

Si el archivo no existe, si `decision` ≠ `DIVIDIR`, o si no contiene la sección de plan,
`plan_finvest` queda vacío y el Paso 4 continúa con la detección automática de patrones.

---

### Paso 4 — Seleccionar el patrón de splitting

#### Prioridad de decisión de splitting

Aplicar en este orden:

1. **Plan FINVEST (guía principal):** si `plan_finvest` fue poblado en el Paso 3b,
   usarlo como punto de partida de la división. Para cada fila de la tabla del plan:
   - El nombre de historia hija (ej. `FEAT-074a`) es orientativo del foco, no del ID final.
   - "Escenarios" indica qué escenarios del original incluir en cada historia hija.
   - "Foco" define el título y `Quiero` de cada historia resultante.
   Informar al usuario:
   `📊 Plan de división detectado en finvest-evaluation-report.md — usando como guía principal.`
   Continuar igualmente con la detección de patrones (punto 3) para validar o complementar
   el plan: si algún aspecto de la agrupación no queda completamente definido por la tabla
   FINVEST (escenarios ambiguos, criterios no funcionales sin historia asignada, requerimientos
   sueltos), aplicar el patrón de Richard Lawrence más apropiado para resolverlo.

2. **Flag explícito:** si se especificó `--pattern N`, usar ese patrón directamente.

3. **Detección automática:** si no hay plan previo ni flag, aplicar los 8 patrones de
   Richard Lawrence en orden hasta encontrar el que encaja:

#### Patrón 1 — Pasos del flujo de trabajo
**Cuándo:** La historia cubre pasos secuenciales de un mismo journey.
**Señal:** Los escenarios describen etapas de un proceso en cadena.

```
Original: "Como usuario quiero registrarme, verificar mi email y completar mi perfil"
↓
Split A: "Como visitante quiero registrarme con email/contraseña..."
Split B: "Como usuario registrado quiero verificar mi email..."
Split C: "Como usuario verificado quiero completar mi perfil..."
```

#### Patrón 2 — Variaciones de reglas de negocio
**Cuándo:** La historia aplica reglas diferentes según condiciones (roles, permisos, cálculos).
**Señal:** Un Scenario Outline con múltiples filas donde cada fila tiene lógica diferente.

```
Original: "Como usuario quiero aplicar descuentos (10% miembro, 20% VIP, 5% primer compra)"
↓
Split A: "Como miembro quiero aplicar 10% de descuento..."
Split B: "Como usuario VIP quiero aplicar 20% de descuento..."
Split C: "Como comprador primerizo quiero aplicar 5% de descuento..."
```

#### Patrón 3 — Variaciones de datos
**Cuándo:** La historia maneja tipos de datos o inputs distintos que tienen comportamientos propios.
**Señal:** Escenarios que difieren solo en el tipo de archivo, formato o dato de entrada.

```
Original: "Como usuario quiero subir archivos (imágenes, PDFs, videos)"
↓
Split A: "Como usuario quiero subir imágenes (JPG, PNG)..."
Split B: "Como usuario quiero subir documentos PDF..."
Split C: "Como usuario quiero subir videos (MP4, MOV)..."
```

#### Patrón 4 — Complejidad de criterios de aceptación *(más común)*
**Cuándo:** La historia tiene múltiples escenarios principales independientes (varios `Cuando` distintos).
**Señal:** Más de 1 escenario principal, o escenarios alternativos que son en realidad flujos completos.

```
Original: "Como usuario quiero gestionar mi carrito"
  Escenario: agregar ítem → carrito actualizado
  Escenario: eliminar ítem → carrito actualizado
  Escenario: cambiar cantidad → total recalculado
↓
Split A: "Como comprador quiero agregar ítems a mi carrito..."
Split B: "Como comprador quiero eliminar ítems de mi carrito..."
Split C: "Como comprador quiero actualizar la cantidad de un ítem..."
```

#### Patrón 5 — Esfuerzo mayor (incrementos técnicos)
**Cuándo:** La implementación requiere fases técnicas que pueden entregarse incrementalmente con valor en cada etapa.
**Señal:** El equipo dice "primero necesitamos X para poder hacer Y".

```
Original: "Como usuario quiero colaboración en tiempo real en documentos"
↓
Split A: "Como usuario quiero ver quién más está viendo el documento (presencia read-only)"
Split B: "Como usuario quiero ver los cursores en tiempo real de otros editores"
Split C: "Como usuario quiero ver las ediciones de otros en tiempo real"
```

#### Patrón 6 — Dependencias externas
**Cuándo:** La historia depende de múltiples sistemas, APIs o terceros distintos.
**Señal:** Escenarios que varían solo por el proveedor externo.

```
Original: "Como usuario quiero iniciar sesión con Google, Facebook o Twitter"
↓
Split A: "Como usuario quiero iniciar sesión con Google OAuth"
Split B: "Como usuario quiero iniciar sesión con Facebook OAuth"
Split C: "Como usuario quiero iniciar sesión con Twitter OAuth"
```

#### Patrón 7 — Pasos DevOps / infraestructura
**Cuándo:** La historia incluye requerimientos de despliegue o infraestructura que escalan por etapas.
**Señal:** El alcance cambia significativamente según el entorno o el volumen.

```
Original: "Como usuario quiero subir archivos grandes a la nube"
↓
Split A: "Como usuario quiero subir archivos pequeños (<10MB)"
Split B: "Como usuario quiero subir archivos medianos (10MB–1GB) con barra de progreso"
Split C: "Como usuario quiero retomar una subida interrumpida"
```

#### Patrón 8 — Tiny Acts of Discovery (TADs)
**Cuándo:** Ninguno de los patrones anteriores aplica porque hay demasiadas incógnitas para escribir historias concretas.
**Señal:** El equipo no puede imaginar los escenarios Gherkin porque no entiende el problema.

> Los TADs **no son historias** — son experimentos o spikes de investigación. Producir TADs en lugar de historias y volver a `/story-split` una vez que haya claridad. Los TADs **no se guardan como archivos**.

```
Original: "Como usuario quiero recomendaciones con IA" (demasiado vago)
↓
TAD 1: Prototipar 3 algoritmos de recomendación y testear con 10 usuarios
TAD 2: Definir métricas de éxito (tasa de clicks, satisfacción)
TAD 3: Construir el motor de recomendación más simple posible
```

---

### Paso 5 — Identificar la historia core

Si se especificó `--core N`, usar ese número directamente.

Si no, designar cuál de las historias resultantes será la **historia core** siguiendo estos criterios (en orden de prioridad):
1. La historia que contiene el **escenario principal / happy path** del flujo original
2. La historia que aporta el mayor valor independiente si se entrega sola
3. La historia que el equipo implementaría primero

La historia core hereda el ID original y su directorio (renombrado); no recibe un ID nuevo.

Documentar internamente `CORE = Historia N` antes de continuar.

---

### Paso 6 — Escribir cada historia resultante

Cada historia del split debe seguir **estrictamente** el template leído en el Paso 1, adaptando el contenido a cada historia específica. No agregar ni eliminar secciones del template — solo llenar cada sección con la información correspondiente. Siempre completar dinámicamente la estructura en tiempo de ejecución.

Aplicar las mismas reglas de calidad de `/story-creation`:
- `Como` → rol específico, no "usuario" genérico
- `Quiero` → acción del usuario, no implementación técnica
- `Para` → beneficio real, no restatement de `Quiero`
- Pasos Gherkin → específicos y verificables, con valores concretos cuando sea posible

---

### Paso 7 — Validar cada split (INVEST)

Antes de guardar, verificar que **cada historia** cumple:

| Criterio | Pregunta |
|---|---|
| **I** Independiente | ¿Se puede desarrollar sin esperar las demás historias del split? |
| **N** Negociable | ¿Documenta el qué/para qué sin prescribir el cómo técnico? |
| **V** Valiosa | ¿Entrega valor al usuario aunque las demás historias no estén hechas? |
| **E** Estimable | ¿El equipo puede estimar sin investigación previa? |
| **S** Small | ¿Tiene ≤ 3 escenarios Gherkin y ≤ 7 pasos totales? |
| **T** Testeable | ¿Los `Entonces` son verificables objetivamente? |

Si alguna historia no cumple **V** (no entrega valor por sí sola), revisar el patrón — probablemente se hizo corte horizontal en lugar de vertical.

Si se especificó `--dry-run`, mostrar el plan de splitting y detenerse aquí sin crear archivos.

---

### Paso 8 — Guardar y entregar

#### Derivar IDs para las historias resultantes

La **historia core** conserva el ID de la historia original — no se le asigna un ID nuevo.

Las **historias adicionales** reciben IDs nuevos consecutivos:

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios. El patrón
> `specs/stories/FEAT-*` (apuntando a directorios) retorna siempre vacío. Usar obligatoriamente
> el patrón de archivo anidado descrito a continuación.

1. Usar Glob con el patrón `$SPECS_BASE/specs/stories/FEAT-*/story.md` para localizar todas las
   historias existentes. De cada ruta retornada, extraer el número `NNN` del segmento `FEAT-NNN-*`
   (directorio padre inmediato). Ejemplo: de `docs/specs/stories/FEAT-074-integrar-.../story.md` → `74`.
   Si Glob retorna vacío, verificar con Bash (`ls $SPECS_BASE/specs/stories/ | grep -E "^FEAT-[0-9]+"`)
   antes de asumir que no hay historias previas.
2. Extraer los números de todos los prefijos `FEAT-NNN` encontrados
3. Tomar el número más alto y asignar IDs desde ese punto: `FEAT-(N+1)`, `FEAT-(N+2)`, etc.
4. Solo comenzar en `FEAT-002` si ambos mecanismos (Glob + fallback Bash) confirman que no existe ningún `FEAT-*`
5. Formatear con ceros a la izquierda hasta 3 dígitos

#### Repurpose del directorio original como historia core

1. Renombrar el directorio `FEAT-{NNN}-{slug-original}/` a `FEAT-{NNN}-{slug-core}/`
   - El `{slug-core}` se deriva del `Quiero` de la historia core (kebab-case, máx. 5 palabras, sin acentos)
2. Reescribir `story.md` dentro del directorio renombrado con el contenido de la historia core
3. Actualizar su frontmatter:
   - `id: FEAT-{NNN}` (conservado)
   - `slug: FEAT-{NNN}-{slug-core}` (actualizado)
   - `status: SPECIFY` / `substatus: IN‑PROGRESS`
   - Campo `related:` con los IDs de las historias adicionales: `[FEAT-{N+1}, FEAT-{N+2}, ...]`
4. Advertir en el resumen que el directorio fue renombrado y que las referencias al slug anterior deben actualizarse manualmente

#### Guardar cada historia adicional

Por cada historia adicional (no-core), crear en `$SPECS_BASE/specs/stories/`:
- **Directorio:** `FEAT-{NNN}-{slug}/`
- **Archivo:** `story.md` con la historia completa en formato del template
- **Frontmatter:** `id: FEAT-{NNN}`, `slug: FEAT-{NNN}-{slug}`, `status: SPECIFY`, campo `related:` con el ID de la core y las demás historias hermanas

#### Mostrar resumen

```
## Historia original
[Reproducir la historia tal como fue recibida]

## Diagnóstico
[Explicar por qué era demasiado grande y qué patrón se aplicó]

## Historias resultantes

### Historia 1 — {título corto}
**Archivo:** `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug}/story.md`
[Historia completa en formato story-template.md]

### Historia 2 — {título corto}
**Archivo:** `$SPECS_BASE/specs/stories/FEAT-{NNN+1}-{slug}/story.md`
[Historia completa en formato story-template.md]

...

## Notas del splitting
[Qué quedó fuera de scope, dependencias entre historias si las hay, orden de implementación sugerido]

## Archivos generados
- `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug-core}/story.md` ← repurposed (era `FEAT-{NNN}-{slug-original}/`)
- `$SPECS_BASE/specs/stories/FEAT-{N+1}-{slug-2}/story.md` ← nuevo
- `$SPECS_BASE/specs/stories/FEAT-{N+2}-{slug-3}/story.md` ← nuevo

> ⚠️ El directorio `FEAT-{NNN}-{slug-original}/` fue renombrado a `FEAT-{NNN}-{slug-core}/`.
> Actualiza manualmente cualquier referencia al slug anterior en `release.md` u otros documentos.
```

Si se generaron TADs en lugar de historias, explicar claramente que son experimentos previos a la escritura de historias y que no se guardan como archivos.

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Template no encontrado | `❌ No se encontró el template en $SPECS_BASE/specs/templates/story-template.md` | Detener. Pedir verificar que el archivo existe |
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` | Detener. Sugerir `/release-generate-stories` |
| Más de 1 coincidencia (Tipo C) | Mostrar lista de coincidencias | Pedir al usuario que elija antes de continuar |
| Directorio de historia adicional ya existe | Informar al usuario del conflicto | No sobreescribir; continuar con las demás |
| Directorio original ya renombrado | Detectar por diferencia de slug | Omitir el renombrado sin error; continuar |

---

## Salida

- `$SPECS_BASE/specs/stories/FEAT-{NNN}-{slug-core}/story.md` — historia core (directorio repurposed del original)
- `$SPECS_BASE/specs/stories/FEAT-{N+1}-{slug}/story.md` … — historias adicionales (nuevas)
- Estado de todas las historias resultantes: `SPECIFY` (pendiente de re-evaluación con `/story-evaluation`)

### Referencias

- **Template canónico:** `$SPECS_BASE/specs/templates/story-template.md`
- **Creación de historias:** `/story-creation`
- **Evaluación de calidad:** `/story-evaluation`
- Richard Lawrence & Peter Green, *Humanizing Work Guide to Splitting User Stories* — origen de los 8 patrones
- Bill Wake, *INVEST in Good Stories* (2003)
- Mike Cohn, *User Stories Applied* (2004)
