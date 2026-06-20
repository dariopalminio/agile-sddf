---
name: story-design
description: >-
  Genera design.md documentando el diseño técnico de una historia antes de implementar.
  Usar para crear el puente entre criterios de aceptación y código.
  Invocar para "diseño técnico", "generar design", "crear design.md", "story-design"
  o "decisiones técnicas antes de codificar".
triggers:
  - "diseño técnico"
  - "generar design"
  - "crear design.md"
  - "story-design"
  - "arquitectura de la historia"
  - "decisiones técnicas antes de codificar"
---

# Skill: `/story-design`

## Objetivo

Produce el documento de diseño técnico de una historia de usuario. Su propósito es **modelar el sistema antes de que se escriba el código**, tomando las decisiones técnicas necesarias para que la implementación pueda proceder sin ambigüedades.

El skill no prescribe ninguna metodología de diseño, arquitectura ni patrón. La estructura del documento la define el template leído en tiempo de ejecución. El contenido técnico concreto (lenguajes, frameworks, esquemas, convenciones) se extrae del proyecto — nunca se inventa.

### Posicionamiento

```
story.md   → What: requisitos, criterios de aceptación, comportamiento esperado
design.md  → How: arquitectura, componentes, interfaces, decisiones técnicas  ← aquí
tasks.md   → When: tareas de implementación, orden, seguimiento
```

**Qué hace este skill:**
- Genera `design.md` con rutas de archivos concretas a crear o modificar
- Documenta esquemas de datos en el formato que use el proyecto
- Define firmas de componentes, interfaces y contratos (nombres, parámetros, tipos de retorno)
- Documenta flujos de interacción entre componentes para los escenarios principales
- Registra decisiones técnicas tomadas, alternativas rechazadas y su justificación

**Qué NO hace este skill:**
- No genera código de implementación (bucles, condicionales, lógica interna) — eso va a `tasks.md`
- No inventa stack tecnológico ni convenciones — todo se extrae del proyecto existente

**Regla de suficiencia:** el diseño está terminado cuando un desarrollador puede implementar la historia sin tomar decisiones de arquitectura o diseño adicionales.

---

## Entrada

- `story.md` — historia de usuario con criterios de aceptación numerados (AC-1, AC-2 … AC-N)
- `$SPECS_BASE/policies/constitution.md` — stack, convenciones y restricciones técnicas del proyecto (opcional)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios de calidad mínimos (opcional)
- Archivo de dependencias del proyecto: `package.json`, `requirements.txt`, `go.mod` o `pom.xml` (opcional)
- Template de diseño: `assets/design-template.md` (opcional, hay fallback interno)

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-057`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--template {path}` — ruta al template de diseño (opcional)
- `--output {path}` — ruta de salida del documento (opcional)

---

## Precondiciones

- El directorio de la historia existe bajo `$SPECS_BASE/specs/stories/`
- `story.md` existe en el directorio de la historia con criterios de aceptación definidos
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`]
- Herramientas: ninguna externa requerida

---

## Modos de ejecución

- **Manual**: `/story-design {story_id}` — interactivo, muestra resumen de calidad y pide confirmación antes de cerrar
- **Automático**: invocado por orquestador — guarda directamente sin confirmación y reporta al orquestador

---

## Restricciones / Reglas

- El diseño no puede contener código de implementación — solo abstracciones, contratos y esquemas
- Todo elemento de diseño debe tener trazabilidad explícita a un AC (`// satisface: AC-{n}`)
- No se diseña nada nuevo sin verificar si ya existe un componente reutilizable en el proyecto
- Los nombres de componentes deben usar el vocabulario del dominio de la historia (no nombres técnicos genéricos)
- No hay decisiones aplazadas: toda ambigüedad se resuelve en el diseño o se registra como CR
- Todo contenido técnico tiene origen trazable en las fuentes del proyecto — nunca se inventa
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; este skill solo produce archivos de especificaciones de diseño `.md`.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Resolver parámetros de entrada

#### 1a. Resolución del story_id

Si no se proporcionó ningún argumento, preguntar:
```
¿A qué historia quieres generar el diseño?
Proporciona el ID (ej. FEAT-057) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia (primera coincidencia)

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — directorio cuyo nombre comienza con el ID
3. Si no se encuentra ninguno: notificar y detener

#### 1c. Resolución del template (primera coincidencia)

1. Ruta explícita `--template {path}` si se proporcionó
2. `assets/design-template.md`
3. Template interno de fallback (definido en la sección `## Salida`)

Informar qué template se está usando:
```
✓ Template: <ruta-del-template>  [externo | fallback interno]
```

#### 1d. Resolución de la ruta de salida (primera coincidencia)

1. Ruta explícita `--output {path}` si se proporcionó
2. `{directorio_historia}/design.md`

Si `design.md` **ya existe** en la ruta de salida, preguntar al usuario:
```
El archivo design.md ya existe en: <ruta>
¿Qué deseas hacer?
  (r) Regenerar — reemplazar el contenido existente
  (n) No modificar — saltar la generación
```
- `n` / `no modificar`: informar que se saltó y terminar
- `r` / `regenerar`: continuar

---

### Paso 2 — Leer la historia

Leer el archivo `story.md` del directorio resuelto en el Paso 1.

Extraer y registrar internamente:
- ID de la historia del frontmatter (`id: FEAT-NNN`) → base para frontmatter del diseño
- Slug del frontmatter
- Título de la historia
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — son la referencia de trazabilidad del diseño
- Condiciones de borde y escenarios alternativos
- Restricciones explícitas mencionadas
- Requisitos no funcionales

Si existen casos de prueba asociados a la historia (ej. archivos en el mismo directorio), leerlos también. Los escenarios de prueba señalan qué aspectos necesitan ser diseñados con precisión.

---

### Paso 3 — Extraer contexto técnico del proyecto

Construir el contexto técnico que se usará al generar el diseño. Leer todas las fuentes disponibles:

**Documentos de configuración del proyecto:**
- `$SPECS_BASE/policies/constitution.md` — stack, convenciones, principios técnicos inamovibles, restricciones de diseño
  - Si no existe: emitir advertencia y continuar
    ```
    ⚠️ No se encontró $SPECS_BASE/policies/constitution.md
       El diseño se generará sin restricciones técnicas explícitas del proyecto.
       Para definir políticas del proyecto, ejecuta /project-policies-generation.
    ```
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios de calidad mínimos
  - Si no existe: emitir advertencia y continuar
    ```
    ⚠️ No se encontró $SPECS_BASE/policies/definition-of-done-story.md
       El diseño se generará sin criterios de calidad explícitos del proyecto.
       Para definir la Definition of Done del proyecto, ejecuta /project-policies-generation.
    ```

**Inspección del código existente:**
- Archivo de dependencias del proyecto: buscar en este orden `package.json`, `requirements.txt`, `go.mod`, `pom.xml` — leer el primero que exista
- Estructura de directorios del módulo más cercano a la historia — detectar el patrón de organización establecido
- Implementaciones similares ya existentes — detectar convenciones reales de nomenclatura y patrones aplicados

Registrar internamente:
- Stack tecnológico real (lenguajes, frameworks, librerías)
- Patrón arquitectónico detectado del código (no asumido)
- Convenciones de nomenclatura de archivos, componentes y funciones
- Estándares de interfaces del proyecto

---

### Paso 3b — Cargar skills complementarios de la fase `plan`

Leer `sddf.config.yaml`.

Si el archivo no existe: emitir ⚠️ y continuar con Paso 4.

```
⚠️ No se encontró sddf.config.yaml
   Se omite la carga de skills complementarios. Continúa con flujo genérico.
```

Obtener `skills.plan` (lista de skills complementarios).

**Para cada skill con `type: reference`:**
- Leer todos los archivos `.md` en `references_path`
- Añadirlos al contexto técnico interno como "Guías de referencia: <nombre-skill>"
- Emitir: `[OK] Contexto enriquecido con referencias de <nombre-skill>`

**Para cada skill con `type: delegate` y `required: false`:**
- Invocar ese skill pasándole `story.md` como entrada
- El skill produce su artefacto de output (`skill.output`)
- Si el delegate falla: emitir advertencia y continuar
- Si el delegate tiene `required: true`: si falla, detener con error

**Al completar el Paso 3b:**
- Si algún delegate completó el artefacto que story-design iba a generar (design.md):
  - Omitir los pasos de generación genérica (Pasos 4–7)
  - Continuar directamente al Paso 8 (guardar)
- Si solo hubo references: continuar con Paso 4 usando el contexto enriquecido

---

### Paso 4 — Leer el template en tiempo de ejecución

Leer el archivo de template resuelto en el Paso 1.

Antes de completarlo, identificar:
- Todas las secciones y su jerarquía (encabezados `#`, `##`, `###`)
- Todos los placeholders en formato `{nombre_placeholder}`
- Filas de ejemplo en tablas (deben reemplazarse con datos reales)
- Comentarios `<!-- instrucción: ... -->` que indican cómo completar esa sección
- Secciones condicionales `<!-- if ... -->` que solo aplican bajo ciertas condiciones

> La estructura del documento de salida la dicta el template, no este skill.
> Si el template tiene 3 secciones, el diseño tiene 3. Si tiene 10, tiene 10.

---

### Paso 5 — Completar el template

Para cada sección y placeholder del template, seguir este procedimiento:

1. **Identificar la decisión técnica** que esa sección exige resolver
2. **Resolver la decisión** combinando los ACs del Paso 2 y el contexto técnico del Paso 3
3. **Aplicar durante la escritura** los principios de diseño (ver referencia P1–P12 más abajo)
4. **Anotar trazabilidad (P2)**: añadir `// satisface: AC-{n}` junto a cada componente, interfaz o decisión de diseño
5. **Marcar lo que no aplica**: usar `N/A — {razón}` en lugar de omitir la sección

**Reglas de calidad del contenido generado:**
- Cada criterio de aceptación (AC-N) tiene al menos un elemento de diseño que lo cubre
- Los elementos de diseño son concretos: nombres reales, rutas reales, formatos reales del proyecto
- No hay decisiones aplazadas: si algo es incierto, se decide aquí o se registra como CR (ver Paso 7)
- Incluir sección "Decisiones de complejidad justificada" para cualquier elección no obvia (P12)

**Frontmatter del documento generado:**
```yaml
type: design
id: <FEAT-NNN>              # ID de la historia origen
slug: <slug-historia-design>
title: "Design: <título>"
story: <FEAT-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <slug-historia>
```

#### Referencia de Principios de Diseño (P1–P12)

Al producir `design.md`, verificar y aplicar cada uno de los siguientes principios. Son condiciones de calidad del diseño, no recomendaciones opcionales.

**P1 — Alternativas Consideradas**
Antes de elegir una solución, considera al menos dos enfoques alternativos.
- **Qué hacer**: incluir sección "Decisiones de diseño" con alternativas evaluadas y razón del rechazo para cada decisión significativa.
- **Señal de fallo**: el diseño presenta una única solución sin evidencia de evaluación de alternativas.

**P2 — Trazabilidad Requisito → Diseño**
Cada elemento de diseño satisface al menos un criterio de aceptación de la historia.
- **Qué hacer**: anotar `// satisface: AC-{n}` junto a cada componente, interfaz o decisión de diseño.
- **Señal de fallo**: hay elementos de diseño sin referencia a ningún AC, o hay ACs sin elemento de diseño que los cubra.

**P3 — Reutilización Antes de Crear**
Antes de diseñar algo nuevo, verificar si existe un componente, patrón o solución reutilizable en el proyecto.
- **Qué hacer**: inspeccionar el código existente (Paso 3). Si se aplica un patrón conocido, nombrarlo explícitamente.
- **Señal de fallo**: el diseño crea componentes nuevos sin haber verificado si ya existen equivalentes.

**P4 — Distancia Intelectual Mínima**
La estructura del diseño debe reflejar el vocabulario del dominio de la historia.
- **Qué hacer**: si la historia habla de "Pedido", "Línea de pedido", el diseño debe tener componentes con esos nombres.
- **Señal de fallo**: los nombres de componentes e interfaces no son reconocibles desde el lenguaje de la historia.

**P5 — Uniformidad e Integración**
Las convenciones del proyecto se respetan y las interfaces entre componentes son explícitas.
- **Qué hacer**: verificar las convenciones detectadas en el Paso 3. Toda interfaz entre componentes debe estar explícitamente definida — ninguna puede quedar implícita.
- **Señal de fallo**: nombres que no siguen las convenciones del proyecto, o interfaces asumidas sin documentar.

**P6 — Diseño para el Cambio**
El diseño anticipa los puntos donde el sistema probablemente cambie.
- **Qué hacer**: identificar los puntos de variación esperados (ej. "cambio de proveedor de email"). Verificar bajo acoplamiento entre componentes.
- **Señal de fallo**: componentes que concentran múltiples responsabilidades, o dependencias que hacen costoso cambiar una parte.

**P7 — Degradación Gradual**
El sistema mantiene funcionalidad parcial cuando un componente o recurso falla.
- **Qué hacer**: para cada dependencia externa o componente crítico, documentar el comportamiento ante fallo (reintentos, fallback, circuit breaker, etc.).
- **Señal de fallo**: el diseño asume que todos los componentes y dependencias siempre funcionan correctamente.

**P8 — Diseño ≠ Programación**
El documento de diseño contiene abstracciones, no código.
- **Qué hacer**: usar firmas de interfaces, esquemas de datos abstractos, diagramas y contratos. Los detalles de implementación pertenecen a `tasks.md`.
- **Señal de fallo**: el documento contiene bloques de código con lógica de implementación.

**P9 — Autoevaluación de Calidad**
Después de generar el diseño, evaluar su calidad estructural antes de guardarlo.
- **Qué hacer**: verificar ausencia de dependencias cíclicas, que ningún componente tiene más de una razón de cambio, y que las interfaces son estrechas.
- **Señal de fallo**: no se realizó ninguna evaluación estructural del diseño.

**P10 — Revisión Conceptual Primero**
Antes de revisar formato o sintaxis, responder las preguntas conceptuales críticas.
- **Qué hacer**: responder explícitamente: (1) ¿Hay omisiones? (2) ¿Hay ambigüedad? (3) ¿Hay inconsistencia de nombres?
- **Señal de fallo**: el documento pasa revisión de formato pero tiene omisiones, ambigüedad o inconsistencia conceptual.

**P11 — Minimizar Acoplamiento, Maximizar Cohesión**
Cada componente hace una sola cosa bien definida y depende de abstracciones, no de implementaciones concretas.
- **Cohesión**: si puedes describir un componente usando "y" entre responsabilidades, debe dividirse.
- **Acoplamiento**: las dependencias entre componentes deben apuntar a contratos (API, firma, protocolo), no a detalles internos.
- **Señal de fallo**: un componente con múltiples responsabilidades no relacionadas, o un componente que conoce los detalles internos de otro.

**P12 — Simplicidad (KISS, YAGNI)**
Cada elemento, abstracción o mecanismo debe justificarse por una necesidad actual, no por especulación futura.
- **Qué hacer**: incluir sección "Decisiones de complejidad justificada" explicando por qué una solución más simple no era suficiente.
- **Señales de fallo**: jerarquías con un solo hijo concreto, patrones de diseño aplicados donde bastaba un condicional, capas que solo delegan al siguiente nivel.

---

### Paso 6 — Checklist de principios

Ejecutar la siguiente checklist sobre el borrador generado en el Paso 5. Corregir el documento antes de continuar si algún ítem falla.

**Revisión conceptual primero (P10):**
- [ ] ¿Todos los criterios de aceptación (AC-N) tienen cobertura en el diseño?
- [ ] ¿Algún componente hace dos cosas no relacionadas?
- [ ] ¿El mismo concepto aparece nombrado de más de una forma?

**Trazabilidad (P2):**
- [ ] Cada componente, interfaz y decisión tiene anotado el AC que satisface

**Alternativas consideradas (P1):**
- [ ] El documento incluye al menos 2 alternativas rechazadas con justificación por cada decisión significativa

**Vocabulario de dominio (P4):**
- [ ] Los nombres de componentes e interfaces son reconocibles desde el lenguaje de la historia

**Uniformidad e integración (P5):**
- [ ] Todas las interfaces entre componentes están explícitamente definidas
- [ ] Los nombres siguen las convenciones detectadas en el Paso 3

**Diseño para el cambio (P6):**
- [ ] Se identifican y documentan los puntos de variación esperados

**Degradación gradual (P7):**
- [ ] Para cada dependencia externa o componente crítico, se documenta el comportamiento ante fallo

**Diseño ≠ programación (P8):**
- [ ] El documento no contiene bloques de código con lógica de implementación

**Autoevaluación estructural (P9):**
- [ ] Sin dependencias cíclicas entre componentes
- [ ] Sin componentes con múltiples responsabilidades no relacionadas
- [ ] Las interfaces son estrechas (responsabilidad única, pocos parámetros)

**Cohesión y acoplamiento (P11):**
- [ ] Cada componente puede describirse sin usar "y" entre responsabilidades
- [ ] Cada dependencia entre componentes apunta a una abstracción, no a una implementación concreta

Por cada ítem que falle: corregir el diseño, o registrar como CR si no puede resolverse sin retroalimentar a la historia.

---

### Paso 7 — Detectar inconsistencias (retroalimentación ascendente)

Si durante los pasos anteriores se detecta alguna de las siguientes condiciones:

| Condición | Acción |
|---|---|
| Criterio de aceptación técnicamente inviable con la arquitectura existente | Registrar CR y notificar |
| Criterio ambiguo del que no puede derivarse un elemento de diseño concreto | Registrar CR y retroalimentar a la historia |
| Dependencia técnica no documentada en la historia | Registrar CR y notificar |
| Se descubren componentes reutilizables que evitan crear nuevos | Simplificar diseño y registrar CR |

Proceso: añadir sección `## Registro de Cambios (CR)` al documento con esta estructura para cada hallazgo:

```
### CR-001
- **Tipo**: [inviabilidad | ambigüedad | dependencia | reutilización]
- **Descripción**: <qué se detectó>
- **Documento afectado**: story.md / design.md
- **Acción requerida**: <qué debe hacerse>
```

En modo manual: notificar al usuario y esperar instrucción antes de guardar.
En modo Agent: guardar con los CRs incluidos y reportar al orquestador.

---

### Paso 8 — Guardar el documento

Guardar el documento completado en la ruta de salida resuelta en el Paso 1.

Si el directorio no existe, crearlo.

Si el documento supera las 1000 líneas, notificar al usuario que considere dividirlo.

---

### Paso 9 — Confirmación interactiva (solo modo manual)

Mostrar al usuario:

```
✅ Design guardado: <ruta>/design.md

📐 Resumen:
   Historia: <FEAT-NNN> — <título>
   Cobertura: <N>/<Total> criterios de aceptación cubiertos

   Elementos diseñados:
   · <N> componentes (<X> nuevos, <Y> modificados)
   · <N> interfaces definidas
   · <N> decisiones técnicas documentadas
   · <N> flujos documentados

✔ Checklist de principios: <X>/<Total> ítems pasados
   [listar cada principio con ✔ o ✗ y breve estado]

⚠️ CRs: <N>
   [listar cada CR si los hay]
```

Preguntar: "¿La solución técnica refleja correctamente la historia? ¿Necesita ajustes?"

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` | Detener. Sugerir `/release-generate-stories` |
| `story.md` ausente en el directorio | `❌ No se encontró story.md en: <ruta>` | Detener. Sugerir `/release-generate-stories` |
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No generar archivos |
| Template no encontrado | — | Usar template de fallback interno. Informar al usuario |
| `constitution.md` ausente | `⚠️ No se encontró constitution.md` | Advertir y continuar |
| `definition-of-done-story.md` ausente | `⚠️ No se encontró definition-of-done-story.md` | Advertir y continuar |

---

## Salida

- `{directorio_historia}/design.md` — documento de diseño técnico generado o actualizado
- Estado del workitem: sin cambio (el skill no actualiza el frontmatter de `story.md`)

### Template de Fallback

Usar solo si no se encontró ningún template externo en el Paso 1:

```markdown
---
type: design
id: {story_id}
slug: {story_slug}
title: "Design: {story_title}"
story: {story_id}
created: {date}
updated: {date}
---

# Diseño Técnico: {story_title}

## Contexto

{context}

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| {component} | crear / modificar / eliminar | {path} | AC-{n} |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| {interface} | {contract} | AC-{n} |

## Esquema de Datos

{data_schema}

## Flujos Clave

{key_flows}

## Decisiones Técnicas

| Decisión | Opción elegida | Alternativas rechazadas | Justificación |
|---|---|---|---|
| {decision} | {choice} | {rejected} | {rationale} |

## Decisiones de Complejidad Justificada

{complexity_decisions}

## Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | {criterion} | {method} | AC-{n} |

## Registro de Cambios (CR)

<!-- Completar solo si se detectaron inconsistencias en el Paso 7. Si no hay CRs, escribir: Sin CRs detectados. -->
```
