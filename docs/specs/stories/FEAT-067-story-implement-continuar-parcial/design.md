---
alwaysApply: false
type: design
id: FEAT-067
slug: FEAT-067-story-implement-continuar-parcial-design
title: "Design: skill story-implement — continuar implementación parcial con tareas pendientes y fix-directives"
story: FEAT-067
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-067-story-implement-continuar-parcial
  - FEAT-061-skill-de-implementacion-el-programador-autonomo
  - FEAT-065-revision-con-bloqueantes
---

<!-- Referencias -->
[[FEAT-067-story-implement-continuar-parcial]]
[[FEAT-061-skill-de-implementacion-el-programador-autonomo]]

## Context

El skill `story-implement` en su estado actual (FEAT-061) asume que todas las tareas de `tasks.md` están pendientes (`[ ]`) y que el estado de `story.md` es `READY-FOR-IMPLEMENT/DONE`. Este contrato es correcto para la ejecución inicial.

Sin embargo, el flujo post-review introduce un nuevo escenario: `/story-code-review` con resultado `needs-changes` retrocede `story.md` a `IMPLEMENT/IN-PROGRESS` y agrega `- [ ] Implementar fix-directives.md` a `tasks.md`, que ya contiene las tareas previas marcadas como `[x]`. Al re-ejecutar `/story-implement`, el skill actual rechaza la historia porque no cumple la precondición `READY-FOR-IMPLEMENT/DONE`.

**Archivo afectado:** `.claude/skills/story-implement/SKILL.md` — único componente a modificar.

**Reutilización detectada:**
- El Paso 2c de `SKILL.md` **ya extrae** por separado `- [ ]` (pendientes) y `- [x]` (completadas). El loop del Paso 3 **ya opera solo sobre las pendientes**. El template de `implement-report.md` **ya tiene** el campo `Tareas omitidas (ya completadas antes)`. La lógica de reanudación no requiere nuevos componentes; solo extensiones a pasos existentes.

---

## Goals / Non-Goals

**Goals:**
- Relajar la precondición de estado para aceptar también `IMPLEMENT/IN-PROGRESS` // satisface: AC-1, AC-2
- Detectar el modo de reanudación y mostrarlo al usuario antes de ejecutar tareas // satisface: R-1
- Definir un gate de salida anticipada cuando no hay tareas `[ ]` pendientes // satisface: AC-3
- Especificar el procesamiento de la tarea `Implementar fix-directives.md` dentro del loop existente // satisface: AC-1, R-2
- Garantizar que `implement-report.md` refleja todas las tareas (previas + nuevas) // satisface: NF-2

**Non-Goals:**
- Re-ejecutar tareas ya marcadas `[x]`
- Modificar el formato de `tasks.md`
- Manejar múltiples archivos `fix-directives.md`
- Cambiar el comportamiento de ejecución inicial (todas las tareas `[ ]`)

---

## Decisions

### D-1: Relajar la precondición de estado en Paso 1d // satisface: AC-1, AC-2

**Opción elegida:** Aceptar dos estados válidos como precondición:

```
Precondición válida si:
  (status: READY-FOR-IMPLEMENT  AND substatus: DONE)    ← ejecución inicial
  OR
  (status: IMPLEMENTING          AND substatus: IN-PROGRESS) ← reanudación
```

Si el estado no es ninguno de los dos, emitir error descriptivo con ambas opciones como sugerencia.

El tipo de ejecución (inicial vs. reanudación) no se determina por el estado del frontmatter sino por el contenido de `tasks.md` (ver D-2). El frontmatter solo actúa como gate de entrada.

**Alternativas rechazadas:**
- Aceptar cualquier estado → demasiado permisivo; podría ejecutarse sobre historias en estados inesperados (ej. `CODE-REVIEW/DONE`) y generar efectos secundarios no deseados.
- Crear un nuevo estado `READY-FOR-RESUME` → introduce un estado de ciclo de vida adicional no necesario; la información ya está en `tasks.md`.

---

### D-2: Detección de modo de reanudación y gate de salida anticipada // satisface: AC-3, R-1

**Opción elegida:** Después de leer `tasks.md` en el Paso 2c, evaluar:

```
N_completadas = count(tareas [x])
N_pendientes  = count(tareas [ ])

si N_completadas = 0: modo = inicial (comportamiento original, sin cambios)
si N_completadas > 0: modo = reanudación
si N_pendientes  = 0 AND N_completadas > 0: salida anticipada (AC-3)
```

**En modo reanudación**, mostrar al inicio (antes de la primera tarea):

```
🔁 Modo reanudación detectado
   Tareas ya completadas (omitidas): <N_completadas>
   Tareas pendientes a ejecutar:     <N_pendientes>
   fix-directives.md:                <detectado | no encontrado>
```

**En salida anticipada** (AC-3):

```
ℹ️  No hay tareas pendientes en tasks.md — todas están completadas.
   Sugerencia: ejecuta /story-code-review <story_id> si la historia está en IMPLEMENTING.
```
Sin modificar ningún archivo.

**Alternativas rechazadas:**
- Detección por estado del frontmatter → el estado puede ser `IMPLEMENT/IN-PROGRESS` tanto en reanudación como en la ejecución inicial (si el skill se interrumpió), lo que hace el frontmatter poco fiable como señal de modo.
- Flag `--resume` explícito → requiere que el usuario recuerde pasarlo; la detección automática por `tasks.md` es más simple y menos error-prone.

---

### D-3: Procesamiento de `fix-directives.md` dentro del loop de tareas // satisface: AC-1, R-2

**Opción elegida:** La tarea `- [ ] Implementar fix-directives.md` es procesada dentro del loop estándar del Paso 3. Cuando el skill encuentra una tarea cuya descripción normalizada es `"Implementar fix-directives.md"`, ejecuta un sub-flujo especializado en lugar del ciclo TDD:

**Sub-flujo para la tarea `Implementar fix-directives.md`:**

1. Verificar que `$STORY_DIR/fix-directives.md` existe. Si no existe, marcar la tarea como bloqueada (`[~]`) con mensaje: `fix-directives.md no encontrado en <ruta>`.
2. Leer `fix-directives.md` y extraer la tabla "Instrucciones de corrección" (columnas: `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`).
3. Para cada fila de la tabla, aplicar la corrección indicada en el archivo y línea especificados.
4. Marcar la tarea como `[x]` en `tasks.md` al completar todas las correcciones.

**Contrato de detección de la tarea especial:**

```
si descripción_tarea.normalize() == "implementar fix-directives.md":
  ejecutar sub-flujo de fix-directives
sino:
  ejecutar ciclo TDD estándar
```

La normalización es: trim + lowercase. El nombre de la tarea es el literal generado por `story-code-review` en Paso 4g.1.

**Alternativas rechazadas:**
- Procesar `fix-directives.md` en un Paso separado antes del loop → rompe la trazabilidad en `tasks.md`; la tarea quedaría fuera del orden natural y no quedaría marcada como `[x]` de la misma forma.
- Nuevo agente `fix-applier.agent.md` → agrega un nivel de delegación para una operación de lectura y edición de archivos; viola P12 (KISS) y el principio de single-level delegation.

---

### D-4: Generación de `implement-report.md` en modo reanudación // satisface: NF-2

**Opción elegida:** Sobrescribir `implement-report.md` al finalizar con datos consolidados: todas las tareas del `tasks.md` (previas + nuevas), usando el campo `Tareas omitidas (ya completadas antes)` ya existente en el template.

```
Tabla de Estado por Tarea (en el report):
  - Tareas [x] previas → fila con estado "✓ completado (ejecución anterior)"
  - Tareas [x] nuevas  → fila con estado "✓ completado"
  - Tareas [~]        → fila con estado "⚠️ requiere aclaración"
```

El campo `Tareas omitidas (ya completadas antes)` del resumen refleja `N_completadas` del Paso 2c.

**Alternativas rechazadas:**
- Append de nueva sección al `implement-report.md` existente → genera un documento acumulativo difícil de leer; la fuente de verdad sigue siendo `tasks.md`, no el historial del report.
- Mantener el `implement-report.md` anterior sin modificar → la tarea `Implementar fix-directives.md` no quedaría registrada.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| La tarea `Implementar fix-directives.md` tiene nombre diferente al esperado (ej. traducción o typo) | La detección usa normalización (trim + lowercase); si aun así no coincide, la tarea se procesa como TDD estándar y el sub-flujo no se activa — comportamiento degradado sin error fatal |
| `fix-directives.md` referencia un archivo que no existe | El sub-flujo reporta la corrección como no aplicable e informa al usuario; no aborta el resto de correcciones |
| El usuario tiene `tasks.md` con `[x]` de una sesión abortada pero `story.md` en `READY-FOR-IMPLEMENT/DONE` | La precondición D-1 lo permite; D-2 detecta reanudación por `[x]` → comportamiento correcto |
| Re-ejecutar el skill sobre una historia ya en `READY-FOR-CODE-REVIEW/DONE` con todas las tareas `[x]` | D-2 activa salida anticipada (AC-3) → sin efectos secundarios |

---

## Open Questions

Sin preguntas abiertas. El diseño cubre los tres escenarios y los dos requirements de FEAT-067.

---

## Registro de Cambios (CR)

Sin CRs detectados. La historia es técnicamente realizable con la arquitectura actual de `story-implement`.
