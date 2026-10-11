---
name: epic-creation
description: >-
  Crea epic.md interactivamente, sección por sección, siguiendo el template
  epic-template.md en tiempo de ejecución. Usar para crear una épica
  sin necesitar project-plan.md previo.
  Invocar también cuando el usuario mencione "epic-creation", "crear épica",
  "nueva épica", "crear epic", "épica interactiva" o "épica desde cero".
triggers:
  - "epic-creation"
  - "crear épica"
  - "nueva épica"
  - "crear epic"
  - "épica interactiva"
  - "épica desde cero"
---

# Skill: `/epic-creation`

## Objetivo

Conduce al usuario a través de la creación de un archivo de épica completa mediante preguntas interactivas. Extrae la estructura del template `assets/epic-template.md` en tiempo de ejecución — si el template cambia, el flujo de preguntas se actualiza automáticamente.

**Qué hace este skill:**
- Guía la creación de una épica de forma interactiva, sección por sección, extrayendo estructura del template en tiempo de ejecución
- Soporta modo rápido (`--quick`) para omitir secciones opcionales sin preguntar individualmente
- Escribe las historias como planificadas (formato F1, sin ID) y los smoke tests como `SMOKE-N` + bloque `gherkin`
- Valida la épica generada invocando `epic-format-validation` al finalizar
- Ofrece corrección interactiva si la validación devuelve REFINAR

**Qué NO hace este skill:**
- Crear una épica a partir de un `project-plan.md` existente → usar `epic-from-project-plan`
- Validar una épica ya existente → usar `epic-format-validation`
- Generar historias de usuario de la épica → usar `epic-generate-stories`

---

## Entrada

- Nombre o descripción de la épica en lenguaje natural (opcional; si no se proporciona, el skill lo solicita)
- Flag `--quick` (opcional)

---

## Parámetros

- `{nombre}` — nombre de la épica (opcional; si se omite, el skill lo solicita en el Paso 1)
- `--quick` — omite todas las secciones opcionales sin preguntar individualmente

---

## Precondiciones

- `assets/epic-template.md` debe existir
- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.

---

## Dependencias

- Skills: [`epic-format-validation`]
- Archivos: [`assets/epic-template.md`], [`$SPECS_BASE/templates/epic-template.md`] (si existe)

---

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `DEFINE` de Epic (transición `DEFINE → PLAN`) |
| Guardrail DoD | **ninguno vigente**: no existe un guardrail DoD de Epic |
| Gate | "Gate de formato" `DEFINE → PLAN` de `domain-epic-lifecycle` §8, ejecutado por `epic-format-validation` en el Paso 7 |
| Override | no aplica |

La épica creada debe obtener `APROBADO` del gate antes de pasar a `PLAN`; un `REFINAR` se corrige en el Paso 7.

---

## Modos de ejecución

- **Manual** (`/epic-creation`): interactivo, guía al usuario sección por sección con preguntas
- **Modo rápido** (`/epic-creation --quick`): omite secciones opcionales sin preguntar
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

---

## Restricciones / Reglas

- El template `epic-template.md` es la **única fuente de estructura** — nunca hardcodear nombres de secciones; extraerlos dinámicamente en tiempo de ejecución
- El template es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- No pedir ni asignar IDs de historia (`STORY-NNN`): las historias se escriben como planificadas (F1) y el ID lo asigna `/epic-generate-stories` (F1 → F2)
- Las secciones se identifican por su `clave:` en el template, nunca por su título: este skill no contiene títulos de sección
- Los formatos de línea F1/F2/F3 y el patrón `SMOKE-N` son contrato de dominio (`domain-epic-lifecycle` §9, "Estructura de `epic.md`")
- En modo rápido (`--quick`), las secciones opcionales se omiten sin preguntar
- Si el directorio destino ya existe, preguntar al usuario antes de sobreescribir
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas ESPECIFICANDO, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver modo de ejecución y nombre de la épica

#### Detectar modo rápido

Si el input contiene `--quick` o el usuario indica "solo obligatorias" / "modo rápido": activar **modo rápido** (`QUICK_MODE=true`). En modo rápido, las secciones opcionales se omiten sin preguntar.

#### Pedir el nombre de la épica

Si el usuario no proporcionó un nombre de épica junto con el comando, preguntar:

> "¿Cómo se llama la épica? (Ej: 'Sistema de pagos', 'Onboarding v2')"

Con el nombre provisto:
- Derivar el **slug kebab-case**: minúsculas, palabras separadas por guiones, sin caracteres especiales (Ej: `"Sistema de pagos"` → `sistema-de-pagos`)
- Construir el **ID de directorio**: proponer el siguiente ID disponible buscando con Glob el
  patrón `$SPECS_BASE/specs/epics/EPIC-*/epic.md`. La herramienta Glob solo encuentra
  archivos, no directorios — usar siempre este patrón de archivo anidado. De cada ruta retornada,
  extraer el número `NN` del segmento `EPIC-NN-*` (directorio padre). Tomar el número más alto
  y sumarle 1; si Glob retorna vacío, verificar con Bash (`ls $SPECS_BASE/specs/epics/ |
  grep -E "^EPIC-"`) antes de asumir que no hay épicas previas.
  Formato final: `EPIC-NN-<slug>` con NN de 2 dígitos (Ej: `EPIC-14-mi-epica`).
  Si el usuario prefiere asignar el ID manualmente, aceptarlo sin objeción.
- Definir la **ruta de salida**: `$SPECS_BASE/specs/epics/<EPIC-NN-slug>/epic.md`

#### Verificar conflicto de directorio

Si el directorio `$SPECS_BASE/specs/epics/<EPIC-NN-slug>/` ya existe, preguntar:

> "El directorio `<ruta>` ya existe. ¿Qué deseas hacer?
> 1. Sobreescribir el archivo existente
> 2. Usar un nombre diferente"

Si elige "2", volver al inicio del Paso 1 para pedir un nombre diferente.

---

### Paso 2 — Leer template y extraer secciones

El archivo de plantilla es la **única fuente de información estructural**. Nunca hardcodear nombres de secciones.

Leer `$SPECS_BASE/templates/epic-template.md` (fuente de verdad del proyecto, puede contener personalizaciones). Si no existe, usar el seed `assets/epic-template.md` y emitir:
> ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/templates/`.

- Si ninguno de los dos archivos existe: detener la ejecución (ver Manejo de errores).
- Si el archivo **existe**: extraer dinámicamente, en el orden del template, cada línea que empiece con `## ` (fuera de bloques de código):
  - **título**: el texto del encabezado sin el comentario HTML;
  - **obligatoria / opcional**: el comentario contiene `sección obligatoria` o `sección opcional`;
  - **clave**: el valor de `clave: <clave>` del comentario (si lo declara); si dos secciones declaran la misma clave → `❌ Template inválido: clave <clave> duplicada` y detener;
  - **guía**: el comentario `<!-- … -->` de la línea siguiente al encabezado (si existe) y si declara la sección opcional **en contenido** (`contenido opcional` o una guía que empiece por "Opcional");
  - **ejemplo**: el contenido de ejemplo del template bajo el encabezado (solo como referencia de forma; no se copia).
  - **Campos de frontmatter obligatorios**: las claves YAML del bloque `---` del template, **menos** la allowlist de opcionales `alwaysApply`, `parent` y `related` (claves nullables o de configuración del documento, no del contrato). Es la misma derivación que aplica el gate `epic-format-validation` (Paso 3b): no hardcodear la lista aquí, para que una clave nueva en el template no desincronice productor y gate.

Guardar la lista `{ título, clave, obligatoria, guía }` para guiar los Pasos 3 a 6. Con el template v2 no hay
secciones opcionales y el Paso 5 no pregunta nada; se mantiene por si el proyecto personaliza el template.

---

### Paso 3 — Completar frontmatter

Preguntar los campos del frontmatter con valores sugeridos. Para cada campo, mostrar la pregunta con el valor por defecto entre paréntesis para que el usuario lo acepte o modifique:

| Campo | Pregunta | Valor por defecto |
|---|---|---|
| `type` | — | `epic` (fijo para este nivel) |
| `id` | — | El `EPIC-NN` resuelto en el Paso 1 |
| `title` | "¿Cuál es el título de la épica?" | El nombre ingresado en el Paso 1 |
| `status` | "¿Estado inicial?" | `DEFINE` — estado inicial de una épica recién creada (en etapa de definición de alcance) |
| `substatus` | "¿Subestado? (TODO / IN-PROGRESS / DONE / BLOCKED)" | `TODO` — una épica recién creada aún no está activa; activarla con `IN-PROGRESS` está sujeto al límite WIP=1 del nivel |
| `created` | "¿Fecha de creación de la épica? (YYYY-MM-DD)" | Fecha de hoy |
| `updated` | — | El mismo valor de `created` en la creación inicial |
| `slug` | — | Derivado automáticamente del nombre (mostrar al usuario, permitir corrección) |

Los campos opcionales del template (`parent`, `related`) se completan con el valor del template o con `null` / `[]` si no aplican; no se preguntan al usuario. Escribir solo las claves que declara el template (no añadir claves retiradas como `alwaysApply`, `deliveryModel` o `children`).

Confirmar el slug con el usuario antes de continuar. El slug determinará el nombre del directorio y del archivo.

---

### Paso 4 — Completar secciones obligatorias

Para cada sección obligatoria extraída en el Paso 2, en el orden del template, formular **una pregunta** construida en runtime con su **título** y su **comentario guía**:

> "**<título>** — <guía del template>. ¿Qué quieres registrar aquí?"

**No se permite saltar secciones obligatorias**, salvo las que la guía declara opcionales en contenido: en ellas se acepta "ninguna" y se deja solo el encabezado.

Solo dos claves tienen un manejo especial de entrada/salida (contrato de dominio, D-2b); el resto escribe la respuesta tal cual bajo su título:

#### Clave `historias`

Preguntar de forma iterativa, usando el título del template:
> "¿Qué historias (features) incluye **<título>**? Lista cada una con formato `Nombre: descripción breve` (escribe 'listo' cuando termines)."

Acepta varias en un mismo mensaje o una por una. **No pedir ni asignar IDs**: cada respuesta se escribe como **F1 (planificada)**, sin checkbox y sin `STORY-NNN`:

```
- {Nombre}: {descripción}
```

Los IDs se asignan al ejecutar `/epic-generate-stories` (F1 → F2); no se pre-asignan para evitar colisiones con otras épicas en definición simultánea.

#### Clave `smoke-tests`

> "Define al menos un flujo crítico que, si falla, debe detener el despliegue. Para cada escenario indica su nombre y los pasos **Dado** (contexto), **Cuando** (acción) y **Entonces** (resultado esperado)."

Escribir cada escenario como `### SMOKE-N — <nombre>`, numerando desde 1 en el orden dado, seguido de un bloque `gherkin`:

```
### SMOKE-1 — {nombre}
```gherkin
Escenario: {nombre}
  Dado {contexto}
  Cuando {acción}
  Entonces {resultado esperado}
```
```

Continuar hasta que el usuario indique que terminó. Los IDs `SMOKE-N` son estables: no se renumeran.

---

### Paso 5 — Completar secciones opcionales

Si `QUICK_MODE=true`: saltar toda esta fase, continuar al Paso 6.

De lo contrario, para cada sección opcional extraída en el Paso 2 (si el template declara alguna), preguntar:

> "¿Quieres completar la sección **<título>**? (sí / no / saltar todas)"

- Si "sí": formular la pregunta con el título y el comentario guía de la sección (como en el Paso 4) y registrar la respuesta.
- Si "no": omitir la sección del archivo final.
- Si "saltar todas": omitir todas las secciones opcionales restantes sin preguntar más.

---

### Paso 6 — Generar el archivo epic.md

Con todas las respuestas recopiladas, construir el archivo `epic.md` completo:

1. Construir el bloque frontmatter YAML con los valores del Paso 3 (sin los comentarios `# escritor:` del template)
2. Añadir el encabezado `# Épica: {título}`
3. Para cada sección, **en el orden del template**: insertar `## {título}` **sin** el comentario `<!-- sección … -->` (pertenece al template) y el contenido respondido, sin copiar los comentarios guía ni el contenido de ejemplo del template
4. Las secciones obligatorias van siempre (las opcionales en contenido, aunque estén vacías, como encabezado); las opcionales solo si el usuario las completó

#### Crear el directorio y escribir el archivo

```
$SPECS_BASE/specs/epics/<EPIC-NN-slug>/epic.md
```

Verificar que el directorio existe; si no, crearlo.

Mostrar al usuario una vista previa del archivo antes de escribirlo:

> "Voy a crear el archivo en `<ruta>`. ¿Confirmas? (sí / editar primero)"

Si el usuario pide editar: mostrar el contenido y permitir correcciones antes de guardar.

---

### Paso 7 — Validación automática

Después de escribir el archivo, invocar el skill `epic-format-validation` sobre el archivo generado.

#### Si el resultado es APROBADO

Mostrar:
```
✅ APROBADO

Archivo creado: $SPECS_BASE/specs/epics/<EPIC-NN-slug>/epic.md

Siguiente paso: ejecuta /epic-generate-stories para generar las historias de usuario de esta épica.
```

#### Si el resultado es REFINAR

Mostrar las secciones faltantes y los ítems de formato inválido y ofrecer completarlos:

```
⚠️ REFINAR

Las siguientes secciones están incompletas, ausentes o con formato inválido:
- [lista de secciones e ítems de formato]

¿Quieres completarlas ahora de forma interactiva? (sí / no)
```

Si el usuario responde "sí": volver al Paso 4 o Paso 5 según corresponda para las secciones faltantes y regenerar el archivo.

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Template no encontrado | `❌ No se encontró el template requerido en assets/epic-template.md. Por favor verifica que el archivo existe antes de continuar.` | Detener la ejecución |
| Conflicto de directorio | `El directorio <ruta> ya existe. ¿Qué deseas hacer? 1. Sobreescribir / 2. Usar un nombre diferente` | Esperar decisión del usuario; si elige "2", volver al Paso 1 |
| Validación retorna REFINAR | `⚠️ REFINAR — Las siguientes secciones están incompletas: [lista]` | Ofrecer completar las secciones faltantes de forma interactiva |

---

## Salida

- `$SPECS_BASE/specs/epics/<EPIC-NN-slug>/epic.md` — épica creada y validado, listo para `/epic-generate-stories`

### Referencias

- **Template canónico:** `assets/epic-template.md` (copia central: `$SPECS_BASE/templates/epic-template.md`)
- **Contrato de `epic.md` (claves, F1/F2/F3, `SMOKE-N`):** `domain-epic-lifecycle` §9
- **Validación de épicas:** `/epic-format-validation`
- **Generación de stories:** `/epic-generate-stories`
- **Generación desde plan:** `/epic-from-project-plan`
