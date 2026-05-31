---
alwaysApply: false
type: design
id: FEAT-077
slug: FEAT-077-mejorar-historia-desde-reporte
title: "Design: story-improve — Mejora automática de historia desde reporte FINVEST"
story: FEAT-077
created: 2026-05-17
updated: 2026-05-17
status: PLANNING
substatus: IN-PROGRESS
parent: <nombre-del-release-padre>
related:
  - FEAT-077-mejorar-historia-desde-reporte
---

<!-- Referencias -->
[[FEAT-077-mejorar-historia-desde-reporte]]

# Diseño Técnico: story-improve — Mejora automática de historia desde reporte FINVEST

## Contexto

El skill `story-improve` cierra el ciclo de refinamiento de historias SDDF. Cuando `story-evaluation` emite una decisión `REFINAR` o `RECHAZAR`, el usuario actualmente debe reescribir la historia de forma manual consultando las recomendaciones del reporte `finvest-evaluation-report.md`. Este skill automatiza ese paso: lee el reporte, identifica las dimensiones con score ≤ 3, aplica las recomendaciones de forma concreta sobre `story.md` y deja trazabilidad completa del proceso en `story-improvement-log.md`, preservando siempre el original en `story.md.bak`.

El skill se ubica en `.claude/skills/story-improve/SKILL.md`, sigue los lineamientos de /skill-master, sigue los patrones estructurales del proyecto (skill-structural-pattern.md): frontmatter YAML estandarizado, preflight como Paso 0, un solo nivel de delegación (skill → subagentes opcionales), templates como fuente de verdad dinámica y salida en rutas predecibles; y respeta el template .claude\skills\skill-master\assets\skill-template.md para la estructura del markdown del skill.

Actores principales: desarrolladores y product owners que iteran historias en el pipeline SDDF (estados SPECIFYING/PLANNING).

## Goals / Non-Goals

**Goals:**
- Leer `finvest-evaluation-report.md` y extraer `decision:`, tabla de scores y sección "Recomendaciones" (AC-1, AC-2)
- Aplicar mejoras concretas sobre `story.md` solo cuando `decision: REFINAR` o `RECHAZAR` (AC-1)
- Proteger el contenido original generando `story.md.bak` antes de cualquier escritura (AC-1)
- Generar `story-improvement-log.md` con los cambios realizados y las dimensiones afectadas (AC-1)
- Informar y salir sin cambios cuando `decision: APROBADA` (AC-2)
- Respetar idempotencia: si `story.md.bak` ya existe, sobreescribirlo con el contenido actual de `story.md`

**Non-Goals:**
- Ejecutar `story-evaluation` automáticamente tras la mejora (fuera de scope de esta historia)
- Modificar historias hermanas ni el epic/release padre
- Modificar `finvest-evaluation-report.md`
- Crear o modificar artefactos de planning (`design.md`, `tasks.md`, `analyze.md`)

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `SKILL.md` del skill story-improve | crear | `.claude/skills/story-improve/SKILL.md` | AC-1, AC-2 |
| `assets/improvement-log-template.md` | crear | `.claude/skills/story-improve/assets/improvement-log-template.md` | AC-1 |
| `examples/example-refinar-input/` | crear | `.claude/skills/story-improve/examples/` | AC-1 |
| `examples/example-aprobada-input/` | crear | `.claude/skills/story-improve/examples/` | AC-2 |
| `story.md` de la historia objetivo | modificar (en runtime) | `$SPECS_BASE/specs/stories/<FEAT-NNN>-*/story.md` | AC-1 |
| `story.md.bak` | crear (en runtime) | `$SPECS_BASE/specs/stories/<FEAT-NNN>-*/story.md.bak` | AC-1 |
| `story-improvement-log.md` | crear (en runtime) | `$SPECS_BASE/specs/stories/<FEAT-NNN>-*/story-improvement-log.md` | AC-1 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación CLI del skill | `/story-improve --story-id <FEAT-NNN>` — recibe un ID de historia y ejecuta la mejora sobre el directorio correspondiente | AC-1, AC-2 |
| Lectura de `finvest-evaluation-report.md` | Lee frontmatter YAML para extraer `decision:` y `finvest-score:`; lee el cuerpo Markdown para extraer la tabla de scores por dimensión y la sección "Recomendaciones" o "Comentarios y Recomendaciones" | AC-1, AC-2 |
| Lectura de `story.md` | Lee el contenido completo del archivo como texto Markdown; extrae frontmatter, sección historia (`Como/Quiero/Para`) y criterios de aceptación Gherkin para aplicar mejoras dimensión a dimensión | AC-1 |
| Escritura de `story.md.bak` | Copia byte a byte del contenido actual de `story.md` antes de cualquier modificación | AC-1 |
| Escritura de `story.md` (mejorado) | Reemplaza el contenido del archivo con la versión mejorada; mantiene frontmatter intacto excepto el campo `updated:` | AC-1 |
| Escritura de `story-improvement-log.md` | Genera el log usando `assets/improvement-log-template.md`; incluye: fecha, dimensiones afectadas, descripción del cambio por dimensión, score original y recomendación aplicada | AC-1 |
| Output de consola (APROBADA) | Imprime `"<FEAT-NNN> ya tiene decisión APROBADA — no se realizan cambios"` y termina sin escribir archivos | AC-2 |

## Esquema de Datos

### Estructura de `finvest-evaluation-report.md` (entrada)

```
---                               # frontmatter YAML
type: finvest-evaluation
story-id: FEAT-NNN
finvest-score: X.XX
decision: APROBADA | REFINAR | RECHAZAR | DIVIDIR
evaluated: YYYY-MM-DD
---
# Evaluación FINVEST
...
| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| I – Independencia | 2 | ... |
| E – Estimable     | 3 | ... |
...
## Comentarios y Recomendaciones
### I – Independencia
<recomendación concreta>
### E – Estimable
<recomendación concreta>
```

El skill extrae:
- `decision` del frontmatter
- Tabla de scores: mapeo `{ dimensión → score }` para filtrar dimensiones con score ≤ 3
- Sección "Comentarios y Recomendaciones": mapeo `{ dimensión → texto_recomendación }`

### Estructura del contexto de hermanas (lectura opcional)

El skill carga historias con el mismo `parent:` o con `related:` compartidos para contextualizar la dimensión I (independencia). Sólo lectura; nunca modifica historias hermanas.

### Estructura de `story-improvement-log.md` (salida)

```
---
type: improvement-log
story-id: FEAT-NNN
improved: YYYY-MM-DD
dimensions-improved: [I, E]
previous-score: X.XX
---
# Log de mejoras: FEAT-NNN
## Resumen
- Fecha: YYYY-MM-DD
- Dimensiones mejoradas: I, E
- Score previo (FINVEST): X.XX

## Cambios por dimensión

### I – Independencia (score previo: 2)
**Recomendación aplicada:** <texto del reporte>
**Cambio realizado:** <descripción concreta del cambio en story.md>

### E – Estimable (score previo: 3)
**Recomendación aplicada:** <texto del reporte>
**Cambio realizado:** <descripción concreta del cambio en story.md>
```
### Estructura de story-improve/SKILL.md
El `SKILL.md` sigue la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`, con secciones adaptadas al contexto de este skill específico. Se documentan explícitamente las interacciones con los archivos del directorio de la historia objetivo y se incluyen ejemplos de entrada/salida para validar cada criterio de aceptación.
Se debe usar /skill-master para generar el `SKILL.md` inicial y luego adaptarlo al caso de uso específico, asegurando que se mantengan los lineamientos de estructura, documentación, funcionalidad y pruebas con ejemplos.

## Flujos Clave

### Flujo 1 — Mejora exitosa (decision: REFINAR/RECHAZAR) — satisface AC-1

```
/story-improve --story-id FEAT-075
  │
  ├─ Paso 0: skill-preflight → OK (resuelve SDDF_ROOT y SPECS_BASE)
  │
  ├─ Paso 1: Resolver ruta del directorio de la historia
  │          Glob: $SPECS_BASE/specs/stories/FEAT-075-*/
  │
  ├─ Paso 2: Leer finvest-evaluation-report.md
  │          → decision: REFINAR
  │          → scores: { I: 2, E: 3, ... }
  │          → recomendaciones: { I: "...", E: "..." }
  │
  ├─ Paso 3: Leer story.md actual
  │
  ├─ Paso 4 (opcional): Cargar contexto de historias hermanas
  │          si dimensión I tiene score ≤ 3
  │
  ├─ Paso 5: Crear story.md.bak (copia del original)
  │          si story.md.bak ya existe → sobreescribir
  │
  ├─ Paso 6: Aplicar mejoras por dimensión (score ≤ 3)
  │          → I: ajustar texto para reducir dependencias descritas
  │          → E: añadir criterios de tamaño/complejidad estimables
  │          (mínimo 1 mejora concreta por dimensión con score ≤ 3)
  │
  ├─ Paso 7: Escribir story.md actualizado
  │          (actualizar campo updated: en frontmatter)
  │
  ├─ Paso 8: Generar story-improvement-log.md
  │
  └─ Paso 9: Mostrar resumen en consola
             "Mejoras aplicadas: dimensiones I, E"
             "Archivos: story.md.bak, story.md, story-improvement-log.md"
```

### Flujo 2 — Historia ya aprobada (decision: APROBADA) — satisface AC-2

```
/story-improve --story-id FEAT-074
  │
  ├─ Paso 0: skill-preflight → OK
  ├─ Paso 1: Resolver ruta
  ├─ Paso 2: Leer finvest-evaluation-report.md
  │          → decision: APROBADA
  └─ Salida inmediata:
     "FEAT-074 ya tiene decisión APROBADA — no se realizan cambios"
     (no crea ni modifica ningún archivo)
```

## Decisiones Técnicas

| Decisión | Opción elegida | Alternativas rechazadas | Justificación |
|---|---|---|---|
| Representación del skill | Markdown puro en `SKILL.md` (instrucciones para el agente Claude) | Script TypeScript/Python ejecutable | Los skills del proyecto son Markdown; el "código" es la instrucción al agente. Cumple KISS y la constitución del proyecto. |
| Estrategia de backup | `story.md.bak` con sobreescritura si existe (idempotencia) | Versión numerada `story.md.bak.1`, `story.md.bak.2` | Mantiene simplicidad; el log registra qué había antes. Alinea con principio KISS y regla 11 de idempotencia. |
| Extracción de scores y recomendaciones | Leer el cuerpo Markdown del reporte en tiempo de ejecución sin hardcodear estructura | Hardcodear nombres de dimensiones FINVEST en el skill | Alinea con el patrón 5 (template como fuente de verdad dinámica): si el formato del reporte evoluciona, el skill se adapta. |
| Carga de contexto de historias hermanas | Solo si dimensión I tiene score ≤ 3 (lectura condicional) | Cargar siempre todas las hermanas | YAGNI: solo se necesita el contexto de independencia cuando esa dimensión es débil. Reduce carga de contexto innecesaria. |
| Aplicación de mejoras | El agente aplica las recomendaciones del reporte como guía semántica (no reemplazo mecánico de texto) | Reemplazo regex/texto de cadenas específicas | Las historias son texto semántico en lenguaje natural; las mejoras requieren comprensión del contexto, no sustitución literal. |
| Log de cambios | Archivo dedicado `story-improvement-log.md` con template en `assets/` | Comentarios inline en `story.md` | Mantiene `story.md` limpio; el log provee trazabilidad externa sin contaminar el artefacto principal. |

## Decisiones de Complejidad Justificada

**Carga condicional de historias hermanas (Paso 4):** se carga solo cuando la dimensión I tiene score ≤ 3. Esta condicionalidad agrega una rama de lógica, pero es necesaria para cumplir el criterio no funcional de "contextualizar la dimensión I y evitar introducir dependencias que ya resuelven otras historias". Sin este contexto, el agente podría mejorar el texto de forma aislada e introducir dependencias que ya están resueltas por historias hermanas.

**Idempotencia del backup:** sobreescribir `story.md.bak` en cada ejecución simplifica el modelo mental del usuario (siempre hay una sola versión de backup = el estado inmediatamente anterior a la última mejora). Se documenta explícitamente en el SKILL.md para evitar confusión.

## Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `story.md.bak` existe tras ejecutar el skill con historia REFINAR y contiene el texto original de `story.md` | Comparar `story.md.bak` con el `story.md` anterior a la ejecución (ejemplo en `examples/`) | AC-1 |
| 2 | `story.md` actualizado aplica al menos una mejora concreta por cada dimensión con score ≤ 3 presente en el reporte | Revisar el cuerpo de `story.md` post-ejecución contra las recomendaciones del reporte del ejemplo | AC-1 |
| 3 | `story-improvement-log.md` lista cada dimensión mejorada con la recomendación aplicada y el cambio realizado | Leer `story-improvement-log.md` del ejemplo de referencia y verificar secciones | AC-1 |
| 4 | Con historia APROBADA: no se crea ni modifica ningún archivo (`story.md`, `story.md.bak`, `story-improvement-log.md`) | Verificar que el directorio no contiene archivos nuevos tras la ejecución del ejemplo APROBADA | AC-2 |
| 5 | La salida de consola para historia APROBADA contiene la frase exacta: `"ya tiene decisión APROBADA — no se realizan cambios"` | Capturar el output del ejemplo APROBADA y buscar la frase | AC-2 |
| 6 | Idempotencia: ejecutar el skill dos veces sobre la misma historia produce el mismo `story.md` resultado y `story.md.bak` con el contenido de la primera ejecución | Ejecutar dos veces el ejemplo REFINAR y comparar `story.md.bak` (debe ser igual al `story.md` tras la primera ejecución) | AC-1 |
| 7 | El skill no modifica `finvest-evaluation-report.md` en ningún escenario | Comparar hash del reporte antes y después de la ejecución | AC-1, AC-2 |

## Registro de Cambios (CR)

Sin CRs detectados.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El formato del reporte `finvest-evaluation-report.md` puede variar entre versiones del skill `story-evaluation` | Diseñar el Paso 2 para extraer secciones por encabezados Markdown y frontmatter YAML, no por posición fija de líneas |
| El agente puede sobreinterpretar "mejora" y reescribir secciones válidas de la historia | Instrucción explícita en SKILL.md: aplicar el mínimo cambio necesario para satisfacer la recomendación; preservar intención original |
| Historia con múltiples dimensiones débiles puede resultar en un `story.md` incoherente si las mejoras no se aplican de forma integral | Indicar en SKILL.md que las mejoras deben revisarse en conjunto antes de escribir; aplicar todas las dimensiones en un único ciclo de edición |

## Open Questions

- ¿El skill debe actualizar el frontmatter de `story.md` con un nuevo `substatus` tras aplicar las mejoras (por ejemplo, para indicar "mejora pendiente de re-evaluación")? Por ahora no se modifica el `status/substatus` para evitar avanzar el estado sin una nueva evaluación formal.
- ¿Debe el skill invocar `story-evaluation` automáticamente como flag opcional (`--re-evaluate`)? Fuera de scope de esta historia; puede considerarse en una historia futura.
