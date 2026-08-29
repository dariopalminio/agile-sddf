---
name: story-specify
description: >-
  Orquesta el flujo de especificación (story-creation → story-evaluation → story-split → story-improve)
  produciendo historias SPECIFY/DONE listas para el pipeline de planning.
  Invocar para "story-specify", "especificar historia" o "ciclo de especificación".
triggers:
  - "story-specify"
  - "especificar historia"
  - "ciclo de especificación"
  - "especificación de historia"
  - "orquestar especificación"
  - "flujo de especificación"
---

# Skill: `/story-specify`

## Objetivo

Orquestador del flujo completo de especificación de historias. Guía al usuario a través de un ciclo interactivo de creación, evaluación, división y mejora continua de historias de usuario, produciendo especificaciones completas y aprobadas (SPECIFY/DONE) listas para pasar al pipeline de planning. No modifica los skills existentes `story-creation`, `story-evaluation` ni `story-split`.

El flujo base es: **story-creation → story-evaluation → story-split**.

**Qué hace este skill:**
- Orquesta `story-creation → story-evaluation → story-split → story-improve → story-product-owner` en ciclo interactivo
- Gestiona un backlog de sesión con registro de todas las historias activas y derivadas
- Mantiene trazabilidad de historias originales y sus splits durante toda la sesión
- Aplica mejoras automáticas por dimensión FINVEST con `story-improve` antes del refinamiento conversacional
- Invoca al agente `story-product-owner` para atender discovery y gaps de contexto que la automatización no puede resolver
- Actualiza el frontmatter de cada historia conforme avanza el ciclo
- Implementa un gate anti-bucle que requiere decisión explícita del usuario antes de iterar

**Qué NO hace este skill:**
- Modificar los skills invocados (`story-creation`, `story-evaluation`, `story-split`)
- Reemplazar la lógica interna de ninguno de los sub-skills
- Iterar automáticamente sin confirmación del usuario tras una decisión no aprobada

### Ciclo de vida de estados

| Evento | status | substatus |
|---|---|---|
| Historia nueva o retomada para refinamiento | `SPECIFY` | `IN‑PROGRESS` |
| `story-evaluation` retorna `APROBADA` | `SPECIFY` | `DONE` |
| Usuario pausa sin aprobación | `SPECIFY` | `IN‑PROGRESS` (sin cambio) |

---

## Entrada

- Descripción de la historia en lenguaje natural (para historia nueva)
- Historias existentes en `$SPECS_BASE/specs/03-stories/` con `status: SPECIFY/IN‑PROGRESS` (para retomar backlog)

---

## Parámetros

Sin parámetros posicionales — el skill es interactivo y detecta el contexto automáticamente al inicio (backlog existente vs. historia nueva).

---

## Precondiciones

- `skill-preflight` retorna estado OK (entorno válido)
- `$SPECS_BASE/specs/03-stories/` accesible (se crea si no existe)

---

## Dependencias

- Skills: [`skill-preflight`, `story-creation`, `story-evaluation`, `story-split`, `story-improve`]
- Agentes: [`story-product-owner`]

---

## Modos de ejecución

- **Manual** (`/story-specify`): interactivo, guía al usuario paso a paso, muestra backlog en tiempo real y pide confirmación antes de cada ciclo de especificación
- **Retomar** (`/story-specify` con historias en `SPECIFY/IN‑PROGRESS`): detecta el backlog existente y pregunta si retomar o crear historia nueva
- **Automático**: invocado por orquestador de nivel superior — reporta resultado sin interacción

---

## Restricciones / Reglas

- No modificar los skills existentes `story-creation`, `story-evaluation` ni `story-split`
- Usar `$SPECS_BASE/specs/03-stories/` como único directorio de salida para historias
- Toda historia activa debe tener `status: SPECIFY` / `substatus: IN‑PROGRESS` en su frontmatter
- Una historia pasa automáticamente a `status: SPECIFY` / `substatus: DONE` cuando `story-evaluation` devuelve `Decision: APROBADA`
- Si la decisión es `REFINAR` o `RECHAZAR`, nunca entrar en bucle infinito — siempre pedir al usuario una decisión explícita antes de iterar (gate anti-bucle, Paso 6)
- Para indagar, analizar el problema, enriquecer la redacción o proponer mejoras, usar el agente `story-product-owner`
- Mantener la interactividad con el usuario en todo momento — nunca avanzar en silencio
- Conservar la esencia y el formato de los skills originales sin reescribir su lógica
- Nunca perder trazabilidad de historias derivadas — toda historia del split se registra inmediatamente
- Mantener `$SPECS_BASE/specs/03-stories/` como fuente de verdad del estado real de cada historia
- NO modifique ningún archivo existente en el código solo se debe orquestar
- NO genere código; este skill solo orquestar y produce archivos de especificaciones `.md`.
- NO incluya detalles de implementación (consultas específicas, estructuras JSON, firmas de métodos, anotaciones, inventarios de la capa de componentes, lógica paso a paso); estos detalles pertenecen a la etapa de planeación del diseño.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Crear o normalizar la historia activa

#### Caso A — Historia nueva

1. Si el input del usuario es incompleto, invocar al agente `story-product-owner` para aclarar usuario, necesidad, valor, contexto y restricciones
2. Invocar el skill `story-creation` con el contexto refinado
3. Cuando `story-creation` genere el archivo en `$SPECS_BASE/specs/03-stories/`, actualizar el frontmatter: establecer `status: SPECIFY` / `substatus: IN‑PROGRESS`; si los campos no existen, agregarlos
4. Registrar la historia en la tabla de backlog con `Estado = SPECIFY/IN‑PROGRESS` y `Decision FINVEST = Pendiente`

#### Caso B — Historia existente en refinamiento

1. Leer el archivo existente
2. Si el frontmatter no tiene `status`, establecer `status: SPECIFY` / `substatus: IN‑PROGRESS`
3. Si ya tiene `status: SPECIFY` / `substatus: IN‑PROGRESS`, no modificar
4. Usarlo como historia activa para la siguiente iteración

---

### Paso 2 — Procesar backlog con cola de trabajo

Procesar una historia por vez hasta que no queden historias pendientes en substatus `IN‑PROGRESS` o el usuario decida detenerse.

Reglas de cola:
1. La siguiente historia a trabajar es la primera del registro con `Estado = SPECIFY/IN‑PROGRESS` y `Siguiente acción` pendiente
2. Cuando una historia se divide, las historias hijas se agregan al final de la cola
3. La historia origen de un split deja de iterarse como ítem activo y debe quedar registrada como `SPECIFY/IN‑PROGRESS` con nota `dividida en historias derivadas`, salvo que el usuario decida cerrarla manualmente en `SPECIFY/DONE`

Antes de cada iteración, mostrar:

```
Historia activa: [ID y archivo]
Backlog actual: [resumen corto]
```

---

### Paso 3 — Evaluar la historia activa

Para la historia activa:

1. Invocar `story-evaluation` usando el archivo de la historia actual
2. Extraer del resultado:
   - `FINVEST Score`
   - `Decision`
   - Dimensiones débiles
   - Recomendaciones accionables
3. Actualizar la tabla de backlog con la decisión obtenida
4. Mostrar al usuario un resumen corto de la evaluación

**Si la decisión es `APROBADA`:**
1. Editar el frontmatter del archivo: establecer `status: SPECIFY` / `substatus: DONE`
2. Actualizar el registro con `Estado = SPECIFY/DONE`
3. Continuar con la siguiente historia pendiente

---

### Paso 4 — Intentar split después de evaluación no aprobada

Si la decisión es `DIVIDIR` o `RECHAZAR` con recomendación de división, ejecutar `story-split` después de mostrar el resumen de la evaluación.

**Si `story-split` devuelve historias derivadas útiles:**
1. Registrar cada historia hija con un nuevo ID (`ST-00X`)
2. Para cada archivo derivado, actualizar el frontmatter con `status: SPECIFY` / `substatus: IN‑PROGRESS` si no existe o si tiene valores distintos
3. Marcar la historia origen con `Siguiente acción = dividida en historias derivadas`
4. Agregar las historias hijas al backlog para seguir refinándolas una por una
5. Mostrar al usuario cuántas historias nuevas fueron creadas y cuáles son sus archivos

**Si `story-split` no aplica o no aporta valor:**
Conservar la historia actual como ítem activo y continuar al Paso 5A.

---

### Paso 5A — Aplicar mejoras automáticas FINVEST (`story-improve`, modo Agent)

Si la decisión no es `APROBADA` y la historia sigue activa tras el split (o el split no aplica):

Invocar el skill `story-improve` en modo Agent:
- `--story-id <FEAT-NNN>` con el ID de la historia activa
- Modo Agent: automático, sin confirmación interactiva

**Si `story-improve` informa que la decisión ya es `APROBADA` (gate interno del skill):**
- Mostrar: `ℹ️ <FEAT-NNN> ya tiene decisión APROBADA — avanzando al gate`
- Actualizar el registro con `Decision FINVEST = APROBADA`
- Ir directamente al Paso 6 (omitir Paso 5B)

**Si `story-improve` completa con mejoras aplicadas:**
- Registrar en el backlog: `story-improvement-log.md generado`
- Mostrar resumen breve de dimensiones mejoradas
- Continuar al Paso 5B para atender gaps de discovery o contexto que la automatización no resolvió

**Si `story-improve` falla con error técnico o no encuentra `finvest-evaluation-report.md`:**
- Registrar en el backlog: `⚠️ story-improve — no ejecutado`
- Continuar al Paso 5B sin bloquear el flujo

---

### Paso 5B — Refinar historias no aprobadas con ayuda del Product Owner

Si la decisión es `REFINAR` o `RECHAZAR`, si la historia sigue activa después del Paso 5A, o si el usuario quiere mejorar una historia derivada:

1. Invocar al agente `story-product-owner`
2. Proveer como contexto:
   - El contenido actual de la historia (ya mejorado por `story-improve` si ejecutó en 5A)
   - El resultado de `story-evaluation`
   - Si existió, el diagnóstico de `story-split`
   - Si existió, el `story-improvement-log.md` generado en el Paso 5A
3. El agente debe:
   - Hacer preguntas adicionales si falta información relevante
   - Proponer mejoras de redacción y claridad
   - Fortalecer valor, claridad y testabilidad
   - Sugerir simplificaciones o recortes de alcance si conviene
4. Aplicar las mejoras al archivo manteniendo `status: SPECIFY` / `substatus: IN‑PROGRESS`

---

### Paso 6 — Gate anti-bucle para decisiones no aprobadas

Después de cada ciclo con decisión `REFINAR` o `RECHAZAR`, preguntar explícitamente al usuario qué desea hacer con esa historia.

Opciones:
- `Seguir iterando ahora`: volver al Paso 3 para una nueva evaluación después del refinamiento
- `Cerrar manualmente en READY`: establecer `status: SPECIFY` / `substatus: DONE` en el archivo aunque la historia no tenga `APROBADA`
- `Dejar en IN‑PROGRESS para retomar luego`: conservar `status: SPECIFY` / `substatus: IN‑PROGRESS` y terminar el trabajo sobre esa historia por ahora

Reglas:
1. Nunca volver automáticamente al Paso 3 sin confirmar al usuario
2. Si el usuario elige `Cerrar manualmente en READY`, actualizar el frontmatter y dejar constancia en la conversación de que el cierre fue manual
3. Si el usuario elige `Dejar en IN‑PROGRESS`, conservar el estado en el backlog pero no seguir iterando en esta sesión salvo que el usuario lo pida

---

### Paso 7 — Confirmación final de la sesión

Cuando no queden historias pendientes para iterar o el usuario decida detenerse, mostrar:

1. Resumen del backlog final:
   - Historias con `SPECIFY/DONE`
   - Historias con `SPECIFY/IN‑PROGRESS`
   - Historias derivadas creadas
2. Ruta de todos los archivos afectados en `$SPECS_BASE/specs/03-stories/`
3. Próximo paso recomendado para cada historia en `SPECIFY/IN‑PROGRESS`

Formato:

```
Refinamiento finalizado.
SPECIFY/DONE: [lista]
SPECIFY/IN‑PROGRESS: [lista]
Historias derivadas creadas: [lista]
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| `$SPECS_BASE/specs/03-stories/` no existe | — | Crear el directorio y continuar |
| `story-creation` falla | Informar el error al usuario | No registrar la historia en el backlog; preguntar si reintentar |
| `story-evaluation` falla | Informar el error al usuario | Conservar `Decision FINVEST = Pendiente`; ofrecer reintentar |
| `story-split` falla o no aplica | Informar al usuario | Conservar historia como activa; continuar al Paso 5A |
| `story-improve` falla o no encuentra reporte | `⚠️ story-improve — no ejecutado` | Non-blocking; registrar en backlog y continuar al Paso 5B |
| Frontmatter de `story.md` sin campos `status`/`substatus` | — | Agregarlos con `SPECIFY/IN‑PROGRESS` y continuar |

---

## Salida

- Archivos `story.md` en `$SPECS_BASE/specs/03-stories/FEAT-{NNN}-{slug}/` — creados o actualizados durante el ciclo
- `story.md.bak` — backup del original antes de aplicar mejoras automáticas (generado por `story-improve` en Paso 5A, cuando aplica)
- `story-improvement-log.md` — log de cambios por dimensión FINVEST (generado por `story-improve` en Paso 5A, cuando aplica)
- Estado final de cada historia:
  - `SPECIFY / DONE` — aprobada por `story-evaluation` o cerrada manualmente
  - `SPECIFY / IN‑PROGRESS` — pausada para retomar en sesión futura
