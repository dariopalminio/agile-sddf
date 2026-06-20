---
name: project-context-diagram
description: >-
  Genera context-diagram.puml (C4 Nivel 1 en PlantUML) para el proyecto activo, con modos
  --interactive y --from-files. Usar para documentar la arquitectura de contexto o comunicar
  el scope a stakeholders. Invocar también cuando el usuario mencione "diagrama de contexto",
  "C4 context", "context-diagram", "project-context-diagram" o equivalentes.
triggers:
  - /project-context-diagram
  - /context-diagram
  - diagrama de contexto
  - context diagram
  - C4 context
---

# Skill: /project-context-diagram

**Cuándo usar este skill:**
Usar cuando se quiera documentar la arquitectura de contexto de un proyecto junto al resto
de los artefactos de specs, comunicar a stakeholders el scope del sistema y sus integraciones
externas, o complementar `/project-planning` al comenzar la especificación de un proyecto.
Invocar también cuando el usuario mencione "diagrama de contexto", "C4 context",
"context-diagram", "project-context-diagram" o equivalentes.

## Objetivo

Genera un **diagrama de contexto C4 Nivel 1** (System Context) en formato PlantUML para
el proyecto activo en SDDF, describiendo cómo el sistema principal interactúa con actores
externos (personas/roles) y sistemas adyacentes. Escribe el resultado en
`$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`.

**Qué hace este skill:**
- Guía al usuario con preguntas estructuradas (modo `--interactive`) o infiere los elementos
  desde los documentos de specs y código fuente (modo `--from-files`)
- Genera el archivo `.puml` siguiendo semántica C4 estricta (solo Nivel 1)
- Muestra preview del diagrama y pide confirmación antes de escribir
- Verifica conflictos de sobreescritura antes de guardar

**Qué NO hace este skill:**
- No genera diagramas de niveles C4 superiores (Nivel 2 Container, Nivel 3 Component)
- No renderiza el `.puml` a imagen — el usuario debe usar la extensión PlantUML de VS Code
  o el servidor en línea de PlantUML

## Entrada

- Argumentos opcionales: `--interactive`, `--from-files`, o ruta a un archivo de specs
- `assets/c4-context-template.puml` — template base del diagrama (solo lectura)
- `$SPECS_BASE/specs/projects/` — directorio de proyectos para modo `--from-files` y selección de destino
- Archivos del proyecto (modo `--from-files`): `project.md`, `README.md`, `package.json`,
  `pyproject.toml`, archivos de código fuente

## Parámetros

- `--interactive` (por defecto): conduce una entrevista guiada sobre actores, sistemas y relaciones
- `--from-files`: infiere el diagrama automáticamente desde documentos de specs y código fuente
- `<ruta>`: ruta a un archivo de specs específico para usar como fuente en modo `--from-files`

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `assets/c4-context-template.puml` debe existir en el directorio del skill
- En modo `--from-files`, debe existir al menos un proyecto en `$SPECS_BASE/specs/projects/`

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`assets/c4-context-template.puml`]
- Librería de referencia: C4-PlantUML (`github.com/plantuml-stdlib/C4-PlantUML`)

## Modos de ejecución

| Modo | Señal de activación | Comportamiento |
|---|---|---|
| **`--interactive`** (por defecto) | Sin argumentos o con `--interactive` | Entrevista guiada: nombre del sistema, actores, sistemas externos y relaciones |
| **`--from-files`** | Flag `--from-files` o ruta de archivo | Inferencia automática desde `project.md`, `README.md`, código fuente e imports |
| **Fallback interactivo** | Ruta proporcionada pero el archivo no existe | Muestra error, lista proyectos disponibles y ofrece elegir modo |

- **Manual** (`/project-context-diagram`): siempre muestra preview y pide confirmación antes de escribir.
- **Automático**: invocado por otro skill — no pide confirmación de preview.

## Restricciones / Reglas

- **Template de solo lectura:** `assets/c4-context-template.puml` nunca se modifica ni se usa como ruta de salida.
- **Semántica C4 estricta Nivel 1:** solo se usan `Person()`, `System()`, `System_Ext()` y `Rel()`. Nunca `Container()`, `Component()` ni elementos de niveles superiores.
- **Un único `System()` principal:** el sistema en foco es siempre exactamente uno.
- **Relaciones con etiqueta obligatoria:** cada `Rel()` debe incluir una etiqueta descriptiva.
- **`Person()` solo para humanos/roles:** los sistemas técnicos externos siempre van en `System_Ext()`.
- **Preview obligatorio:** siempre mostrar el diagrama generado al usuario y pedir confirmación antes de escribir el archivo.
- **Verificación de sobreescritura:** si `context-diagram.puml` ya existe, pedir confirmación antes de sobreescribir.
- NO modifique ningún archivo existente en el código fuente (estamos diagramando, no implementando)
- NO genere código; estas diagramando, no implementando los artefactos técnicos

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Leer y validar el template PlantUML

Lee el archivo `assets/c4-context-template.puml` de este skill.

- Si el archivo **no existe** → detener la ejecución con:
  > ❌ No se encontró el template requerido en `assets/c4-context-template.puml`.  
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe** → continuar. El template es la guía estructural del diagrama de salida.

### Paso 2 — Detectar modo de operación

El skill acepta tres formas de invocación:

#### Modo A — `--interactive` (por defecto)
**Señal:** No se pasan argumentos, o se pasa explícitamente `--interactive`.  
**Acción:** Continuar al **Paso 3 — Modo interactivo**.

#### Modo B — `--from-files` sin ruta
**Señal:** Se pasa `--from-files` sin ninguna ruta adicional.  
**Acción:** Continuar al **Paso 3 — Modo from-files** (escaneo del proyecto activo).

#### Modo C — Ruta de archivo explícita
**Señal:** El argumento contiene `/`, `\` o termina en `.md` (parece una ruta).  
**Acción:** Verificar si el archivo existe:
- **Existe** → leerlo y continuar al **Paso 3 — Modo from-files** con ese documento como input.
- **No existe** → mostrar error y continuar al **Paso 3 — Fallback interactivo**:
  > ❌ No se encontró el archivo de especificaciones indicado: `<ruta>`

### Paso 3 — Recopilar datos según modo

#### Modo interactivo (`--interactive`)

Formular las siguientes preguntas al usuario en orden. No omitir ninguna:

**1. Sistema principal**
- **Nombre del sistema:** ¿Cómo se llama el sistema que estás documentando?
- **Descripción breve:** ¿Qué hace este sistema en una frase?

**2. Actores** (personas o roles que interactúan con el sistema)
Preguntar en loop hasta que el usuario indique que no hay más actores:
- **Nombre del actor:** ¿Cómo se llama este actor o rol?
- **Descripción:** ¿Cuál es su rol o cómo interactúa con el sistema?
- *(Preguntar: ¿Hay otro actor? Sí / No)*

**3. Sistemas externos**
Preguntar en loop hasta que el usuario indique que no hay más sistemas externos:
- **Nombre del sistema externo:** ¿Cómo se llama el sistema externo?
- **Descripción:** ¿Qué hace ese sistema? ¿Qué provee o consume?
- **Protocolo de comunicación:** ¿Qué protocolo o tecnología usa la integración? (ej: REST API, SMTP, WebSocket, SDK, etc.)
- *(Preguntar: ¿Hay otro sistema externo? Sí / No)*

**4. Relaciones**
Para cada actor y sistema externo recopilado, preguntar:
- **¿Qué hace `<actor/sistema_ext>` con el sistema `<nombre_sistema>`?** Describe la interacción en una frase corta.
- El sentido de la relación puede ser: actor → sistema, sistema → sistema_ext, o sistema_ext → sistema.

#### Modo from-files (`--from-files`)

Escanear los siguientes archivos en orden de prioridad para inferir los elementos del diagrama:

1. **`$SPECS_BASE/specs/projects/*/project.md`** — leer si existe; extraer nombre del sistema, actores mencionados ("Como un..."), sistemas externos e integraciones.
2. **`README.md`** — extraer nombre del sistema, descripción y sistemas mencionados.
3. **`package.json` / `pyproject.toml` / `*.csproj`** — inferir stack tecnológico como hint para protocolos.
4. **Imports del código fuente** — buscar imports de servicios conocidos (Stripe, SendGrid, AWS SDK, Firebase, etc.) para inferir sistemas externos.
5. **Código fuente** — analizar comentarios o strings para deducir actores (ej: "Como un admin...") o integraciones.

Construir los elementos `Person`, `System`, `System_Ext` y `Rel` a partir de la información recopilada.

#### Fallback interactivo (cuando el archivo indicado no existe)

1. Mostrar: `❌ No se encontró el archivo de especificaciones indicado: <ruta>`
2. Listar los proyectos disponibles en `$SPECS_BASE/specs/projects/` (mostrar nombres de directorios).
3. Ofrecer al usuario:
   - **Opción A:** Seleccionar uno de los proyectos listados y continuar en modo `--from-files` con su `project.md`.
   - **Opción B:** Continuar en modo `--interactive` con preguntas guiadas.

### Paso 4 — Generar el diagrama PlantUML

Con los datos recopilados (interactivo o inferidos), construir el contenido PlantUML usando `assets/c4-context-template.puml` como estructura base:

1. Sustituir los placeholders del template con los datos reales.
2. Añadir un elemento `Person(id, "Nombre", "Descripción")` por cada actor.
3. Añadir el elemento `System(id, "Nombre", "Descripción")` para el sistema principal.
4. Añadir un elemento `System_Ext(id, "Nombre", "Descripción")` por cada sistema externo.
5. Añadir un elemento `Rel(origen, destino, "etiqueta", "protocolo")` por cada relación.
6. Añadir el `title` con el nombre del sistema.

### Paso 5 — Preview y confirmación

Mostrar en la conversación el diagrama PlantUML generado completo:

```
Vista previa del diagrama:

[contenido del diagrama PlantUML]
```

Luego preguntar:
> ¿El diagrama está correcto? (Sí / No / Editar)
- **Sí** → continuar al Paso 6.
- **No / Editar** → volver al paso correspondiente para corregir actores, sistemas o relaciones, luego regenerar.

### Paso 6 — Determinar ruta de salida y escribir el archivo

#### 6.1 — Identificar el proyecto destino

Si se está en modo `--from-files` con un documento específico, usar el slug del directorio de ese documento.

Si se está en modo `--interactive`, preguntar:
> ¿En qué proyecto deseas guardar el diagrama?
Listar los directorios disponibles en `$SPECS_BASE/specs/projects/` y pedir al usuario que elija uno.

Si el directorio del proyecto no existe → mostrar:
> ❌ El proyecto `<PROJ-slug>` no existe en `$SPECS_BASE/specs/projects/`. Lista de proyectos disponibles: [...]

#### 6.2 — Verificar si el archivo ya existe

Comprobar si `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml` ya existe:
- **No existe** → escribir el archivo directamente.
- **Ya existe** → preguntar al usuario:
  > ⚠️ Ya existe un `context-diagram.puml` en `$SPECS_BASE/specs/projects/<PROJ-slug>/`. ¿Deseas sobreescribirlo? (Sí / No)
  - **Sí** → sobreescribir.
  - **No** → detener sin escribir.

#### 6.3 — Escribir el archivo

Escribir el contenido PlantUML generado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`.

### Paso 7 — Confirmar resultado

Mostrar:

```
✅ Diagrama de contexto C4 generado:
   $SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml

Para renderizarlo localmente, instala la extensión PlantUML en VS Code
(ext: jebbs.plantuml) o visita https://www.plantuml.com/plantuml

Siguiente paso sugerido: /project-planning
```

## Salida

- `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml` — diagrama de contexto C4
  Nivel 1 en formato PlantUML, listo para renderizar con la extensión PlantUML de VS Code.
