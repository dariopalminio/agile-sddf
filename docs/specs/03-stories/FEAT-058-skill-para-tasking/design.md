---
alwaysApply: false
type: design
id: FEAT-058
slug: FEAT-058-skill-para-tasking
title: "Design: Skill para Tasking (story-tasking)"
story: FEAT-058-skill-para-tasking
created: 2026-05-07
updated: 2026-05-07
related:
  - FEAT-058-skill-para-tasking
---

<!-- Referencias -->
[[FEAT-058-skill-para-tasking]]

# Design: Skill para Tasking (story-tasking)

<!-- TRAZABILIDAD: este diseño cubre los criterios de aceptación de FEAT-058:
     AC-1: Generación exitosa de tasks.md a partir de story.md + design.md válidos
     AC-2: Error descriptivo si design.md no existe, con sugerencia de /story-design
     AC-3: Error descriptivo si tasks-template.md no existe
     AC-4: Formato correcto de tareas (TNNN, [P], checkboxes) -->

---

## 📋 Contexto

**Historia de origen:** `FEAT-058` — Skill para Tasking (story-tasking)

**Problema técnico:**
El workflow SDD de SDDF tiene `story.md` (el qué) y `design.md` (el cómo), pero carece de un skill formal para el tercer artefacto: `tasks.md` (el cuándo). Actualmente, las tareas de implementación se crean ad-hoc sin estructura ni trazabilidad con los criterios de aceptación. El skill `story-tasking` debe leer `story.md` y `design.md` para derivar un `tasks.md` estructurado con tareas atómicas, ordenadas por dependencias y marcadas con `[P]` cuando son paralelizables.

**Restricciones del proyecto:**
- Stack principal: Claude Code + Markdown — toda la lógica vive en instrucciones Markdown, sin código ejecutable en el skill
- Convención kebab-case para nombres de archivos y directorios (`constitution.md`)
- Template como única fuente de verdad estructural del output (patrón #5 SDDF)
- Un solo nivel de delegación: skill orquesta directamente sin subagentes intermedios (patrón #4 SDDF)
- Preflight obligatorio como Paso 0 (patrón #3 SDDF)
- Skill debe crearse usando `skill-master` para garantizar estándares SDDF (DoD)

---

## 🔍 Decisiones de Diseño

### Decisión 1: Estrategia de generación del tasks.md

<!-- satisface: AC-1 -->

**Opción elegida:** Template dinámico leído en runtime + extracción dual de `story.md` y `design.md`

**Justificación:**
Coherente con el patrón #5 SDDF ("template como fuente de verdad dinámica"). El skill no hardcodea la estructura del output — la lee del `tasks-template.md` en tiempo de ejecución. Si el template evoluciona, el skill se adapta automáticamente. La extracción dual (story + design) garantiza trazabilidad completa: las tareas nacen de los criterios de aceptación **y** de los componentes técnicos concretos a implementar.

#### Alternativa A: Derivar tareas solo desde story.md

**Descripción:** El skill lee únicamente `story.md` y genera tareas abstractas a partir de los criterios de aceptación.

**Ventajas:**
- Implementación más simple, una sola fuente de entrada

**Desventajas:**
- Las tareas resultantes son abstractas (nivel de criterio), no concretas (nivel de implementación)
- No refleja las decisiones técnicas documentadas en `design.md`
- No cumple AC-1: la historia especifica explícitamente que el skill lee `design.md`

**Descartada porque:** la historia especifica explícitamente que el skill lee ambos documentos; tareas derivadas solo del story serían incompletas para implementar.

---

#### Alternativa B: Template dinámico + extracción dual story.md + design.md (elegida)

**Descripción:** El skill lee el template en runtime para su estructura, luego extrae ACs de `story.md` y componentes/interfaces/decisiones de `design.md` para derivar tareas concretas y trazables.

**Ventajas:**
- Las tareas reflejan tanto el comportamiento esperado (story) como la arquitectura técnica (design)
- Si el template evoluciona, el skill se adapta automáticamente (patrón #5)
- Trazabilidad completa: cada tarea puede mapearse a un AC y a un componente del diseño
- Los marcadores `[P]` se derivan de las dependencias reales entre componentes

**Desventajas:**
- Requiere que `design.md` exista (comportamiento correcto: es una precondición declarada en AC-2)
- Requiere que `tasks-template.md` exista (comportamiento correcto: error explícito en AC-3)

**Descartada porque:** N/A — esta es la alternativa elegida.

---

### Decisión 2: Estrategia de ordenamiento y marcadores [P]

<!-- satisface: AC-1, AC-4 -->

**Opción elegida:** Ordenamiento por dependencias lógicas derivadas del diseño + `[P]` para tareas sin dependencias entre sí dentro del mismo grupo

**Justificación:**
El AC-1 exige ordenamiento por dependencias lógicas y el AC-4 exige el marcador `[P]` para tareas paralelizables. Las dependencias lógicas se derivan del diseño: los componentes que dependen de otros se implementan después; los componentes independientes dentro del mismo grupo de implementación pueden ejecutarse en paralelo.

#### Alternativa A: Ordenamiento secuencial simple sin análisis de dependencias

**Descripción:** Las tareas se numeran T001, T002... en orden de aparición sin análisis de dependencias ni marcadores `[P]`.

**Ventajas:**
- Más simple de implementar

**Desventajas:**
- No optimiza el tiempo de implementación (el propósito del marcador `[P]`)
- No garantiza que las precondiciones estén cubiertas antes de las tareas dependientes
- No cumple AC-1 (ordenamiento por dependencias) ni AC-4 (marcadores `[P]`)

**Descartada porque:** no cumple los criterios de aceptación AC-1 y AC-4.

---

#### Alternativa B: Ordenamiento por dependencias + [P] para tareas independientes (elegida)

**Descripción:** El skill analiza los componentes e interfaces de `design.md` para determinar el orden lógico. El orden global respeta: setup/preflight → componentes base → componentes dependientes → tests → documentación. Las tareas cuya implementación no depende de otras dentro del mismo grupo se marcan `[P]`.

**Ventajas:**
- Cumple AC-1 y AC-4
- Optimiza el tiempo de implementación permitiendo paralelismo donde es seguro
- El plan resultante es directamente ejecutable

**Desventajas:**
- N/A — esta es la alternativa elegida.

---

### Decisión 3: Uso de skill-master en la creación del skill

<!-- satisface: requisito de skill-master en story.md -->

**Opción elegida:** Invocar `skill-master` como herramienta de scaffolding y validación antes de entregar el skill

**Justificación:**
La historia especifica explícitamente el uso de `skill-master`. El DoD del proyecto también lo requiere: "Se uso el skill `skill-master` para crear skills nuevos". El skill-master garantiza que el nuevo skill siga los estándares SDDF: frontmatter correcto, estructura de directorios, ejemplos input/output y validación de casos de prueba.

#### Alternativa A: Crear el skill manualmente sin invocar skill-master

**Descripción:** Crear los archivos del skill directamente sin invocar `skill-master`.

**Ventajas:**
- Más directo, sin dependencia de otra herramienta

**Desventajas:**
- Puede omitir artefactos obligatorios (README, ejemplos, evals)
- Viola el criterio del DoD: "Se uso el skill `skill-master` para crear skills nuevos"
- Sin validación automática de calidad del skill generado

**Descartada porque:** viola el DoD y el requisito explícito de la historia.

---

#### Alternativa B: Usar skill-master como herramienta de scaffolding (elegida)

**Descripción:** El flujo de implementación incluye la invocación de `skill-master` para generar y validar los artefactos del skill `story-tasking`.

**Ventajas:**
- Garantiza artefactos completos y conformes con el estándar SDDF
- Validación integrada mediante casos de prueba

**Desventajas:**
- N/A — esta es la alternativa elegida y requerida.

---

## 🏗️ Plan de Implementación

### Flujo principal del skill story-tasking

```
/story-tasking {story_id}
  → Paso 0: skill-preflight (verificar entorno, resolver SPECS_BASE)
  → Paso 1: resolver parámetros
      ├── directorio historia: glob $SPECS_BASE/specs/stories/{story_id}-*/
      ├── verificar story.md existe (fail-fast si no)
      ├── verificar design.md existe (fail con sugerencia /story-design si no)  ← AC-2
      ├── verificar tasks-template.md existe (fail explícito si no, sin fallback) ← AC-3
      └── salida: {directorio}/tasks.md (preguntar si ya existe)
  → Paso 2: leer story.md → extraer ACs como contexto de trazabilidad
  → Paso 3: leer design.md → extraer componentes, interfaces, decisiones técnicas
  → Paso 4: leer tasks-template.md → estructura dinámica del output
  → Paso 5: derivar tareas agrupadas por área técnica
      ├── asignar IDs T001, T002... secuencialmente por orden de ejecución
      ├── ordenar por dependencias lógicas (componentes base antes de dependientes)
      └── marcar [P] en tareas sin dependencias entre sí del mismo grupo        ← AC-4
  → Paso 6: completar template con tareas derivadas
  → Paso 7: guardar tasks.md en directorio de la historia                       ← AC-1
  → Paso 8 (modo manual): mostrar resumen y pedir confirmación
```

### Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `SKILL.md` | crear | `.claude/skills/story-tasking/SKILL.md` | AC-1, AC-2, AC-3, AC-4 |
| `assets/README.md` | crear | `.claude/skills/story-tasking/assets/README.md` | AC-1 |
| `examples/input/story.md` | crear | `.claude/skills/story-tasking/examples/input/story.md` | AC-1, AC-4 |
| `examples/input/design.md` | crear | `.claude/skills/story-tasking/examples/input/design.md` | AC-1 |
| `examples/output/tasks.md` | crear | `.claude/skills/story-tasking/examples/output/tasks.md` | AC-1, AC-4 |
| `tasks-template.md` | verificar existencia | `docs/specs/templates/tasks-template.md` | AC-1, AC-3 |

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación del skill | Input: `{story_id}` \| `{story_path}` → Output: `tasks.md` creado en directorio de la historia | AC-1 |
| Lectura de `story.md` | Input: ruta → Output: lista de ACs extraídos (AC-1…AC-N) como contexto de trazabilidad | AC-1 |
| Lectura de `design.md` | Input: ruta → Output: componentes, interfaces, decisiones técnicas como fuente de tareas concretas | AC-1 |
| Lectura de `tasks-template.md` | Input: ruta → Output: estructura de secciones extraída en runtime; error bloqueante si no existe | AC-1, AC-3 |
| `skill-preflight` | Input: ninguno → Output: `SPECS_BASE` resuelto + estado del entorno | AC-1, AC-2 |
| Formato de tarea | Input: tipo (secuencial / paralelizable / completada) → Output: línea `- [ ] TNNN [P]? descripción` | AC-4 |

### Puntos de Variación

- **`{story_id}` vs `{story_path}`**: el skill acepta resolución por glob (ID) o ruta directa, sin romper el flujo
- **Modo manual vs modo agent**: manual muestra resumen y pide confirmación; agent guarda directo y reporta al orquestador
- **`tasks.md` ya existente**: si el archivo existe, el skill pregunta antes de sobrescribir (idempotencia)

### Comportamiento ante Fallos

| Dependencia | Comportamiento ante fallo | Estrategia |
|---|---|---|
| `design.md` no existe | Error descriptivo + sugerencia de ejecutar `/story-design` | Fail-fast con mensaje accionable (AC-2) |
| `tasks-template.md` no existe | Error descriptivo indicando ruta faltante, no genera ningún archivo | Fail-fast sin fallback (AC-3) |
| `story.md` no existe | Error descriptivo, detiene ejecución | Fail-fast |
| `skill-preflight` falla | Detiene la ejecución completamente | Fail-fast, no genera ningún archivo |
| `tasks.md` ya existe | Pregunta al usuario: sobrescribir / saltar | Modo interactivo / idempotente |

---

## 🔎 Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `/story-tasking FEAT-NNN` genera `tasks.md` en el directorio de la historia | Manual: verificar existencia del archivo | AC-1 |
| 2 | El `tasks.md` generado tiene frontmatter con `type: tasks` y referencia a `story` y `design` | Manual: leer frontmatter | AC-1 |
| 3 | Las tareas tienen IDs secuenciales `T001`, `T002`... y checkboxes `- [ ]` | Manual: inspeccionar líneas del archivo | AC-1, AC-4 |
| 4 | Las tareas paralelizables tienen marcador `[P]` y las secuenciales no | Manual: comparar tasklist del ejemplo contra el diseño | AC-4 |
| 5 | Si se elimina `design.md` y se ejecuta el skill, el error incluye sugerencia `/story-design` | Manual: eliminar design.md y ejecutar | AC-2 |
| 6 | Si se elimina `tasks-template.md`, el error menciona la ruta faltante y no se genera ningún archivo | Manual: eliminar template y ejecutar | AC-3 |
| 7 | Las tareas están agrupadas bajo encabezados `##` numerados | Manual: inspeccionar estructura del archivo | AC-1 |
| 8 | Las tareas están ordenadas: setup → componentes base → dependientes → tests → docs | Manual: revisar orden del tasklist generado | AC-1 |

---

## 🧩 Decisiones de Complejidad Justificada

- **Sin fallback de template**: a diferencia de `story-design`, este skill no tiene template embebido como fallback. El AC-3 exige error explícito si el template no existe — un fallback silencioso ocultaría el problema en un entorno mal configurado. La complejidad se reduce al eliminarse un nivel del fallback chain.
- **Extracción dual `story.md` + `design.md`**: podría simplificarse usando solo `design.md`, pero AC-1 requiere explícitamente leer ambos. La trazabilidad AC ↔ tarea solo es posible leyendo los ACs de `story.md`.
- **Formato de tarea como contrato de interfaz**: el formato `- [ ] TNNN [P]? descripción` es específico porque AC-4 lo especifica como contrato verificable (Scenario Outline con ejemplos). Definirlo como interfaz lo hace testeable sin código ejecutable.

---

## 📎 Registro de Cambios (CR)

Sin CRs detectados.

---

<!-- Resumen del checklist de principios (Paso 6):

✔ Checklist de principios: 12/12 ítems pasados
   ✔ P1  Alternativas consideradas — 3 decisiones con 2 alternativas cada una documentadas
   ✔ P2  Trazabilidad — todos los elementos anotados con AC-1…AC-4
   ✔ P3  Reutilización — skill-preflight reutilizado como Paso 0; patrón template dinámico heredado de story-design
   ✔ P4  Vocabulario de dominio — "tarea", "tasking", "paralelizable", "dependencias" del vocabulario SDDF
   ✔ P5  Uniformidad — convenciones kebab-case, SPECS_BASE y frontmatter YAML respetados
   ✔ P6  Diseño para el cambio — 3 puntos de variación documentados (ID vs path, modo manual/agent, idempotencia)
   ✔ P7  Degradación gradual — todos los fallos documentados con estrategia explícita
   ✔ P8  Sin código de implementación — solo contratos, flujos abstractos y estructuras
   ✔ P9  Sin dependencias cíclicas; interfaces estrechas (una responsabilidad por interfaz)
   ✔ P10 Sin omisiones (todos los ACs cubiertos), sin ambigüedades, nombres consistentes
   ✔ P11 Cada componente/interfaz tiene una sola responsabilidad; dependencias apuntan a contratos
   ✔ P12 Complejidad justificada: extracción dual requerida por AC-1; sin fallback por AC-3
-->
