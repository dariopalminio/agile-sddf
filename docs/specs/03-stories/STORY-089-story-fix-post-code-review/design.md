---
alwaysApply: false
type: design
id: STORY-089
slug: STORY-089-story-fix-post-code-review-design
title: "Design: Ciclo de corrección con dueño tras un code review rechazado"
story: STORY-089
created: 2026-09-10
updated: 2026-09-10
related:
  - STORY-089-story-fix-post-code-review
  - EPIC-17-remediating-and-improvement
---

<!-- Referencias -->
[[STORY-089-story-fix-post-code-review]]

# Design: Ciclo de corrección con dueño tras un code review rechazado

<!-- TRAZABILIDAD — este diseño cubre los criterios de aceptación de STORY-089:
     AC-1: El rechazo deja una entrega accionable e inequívoca (escenario principal)
     AC-2: Corrección aplicada en una historia planificada sin tasks.md (escenario alternativo)
     AC-3: Invocación fuera de precondiciones (escenario de error)
     AC-4: Independencia del método de planificación (no exigir tasks.md)
     AC-5: Patrones estructurales de skills (skill-structural-pattern.md)
     AC-6: Lineamientos de skill-master (estructura, doc, funcionalidad, pruebas)
     NF-1: Trazabilidad del estado NEEDS-CHANGES en state-machine.md
     NF-2: Degradación controlada (archivo inexistente → omitido, no aborta)
     NF-3: Idempotencia (re-ejecución no reaplica ni degrada) -->

## Context

El ciclo de corrección posterior a un rechazo de `/story-code-review` está roto en tres puntos verificados en el código actual (ver `story.md` → Notas / contexto):

1. **Contrato de recolección incompatible.** `story-code-review` (Paso 4g.1) agrega la línea `- [ ] Implementar fix-directives.md` a `tasks.md`, pero el parser de `story-implement-tasks` (Paso 2c) solo reconoce tareas con patrón `- [ ] T\d+` o `- [ ] \d+\.\d+`. La tarea inyectada nunca se recolecta.
2. **Estado de retroceso incompatible.** El rechazo deja `story.md` en `READY-FOR-IMPLEMENT/DONE` (Paso 4g.2), pero `story-code-review` exige `IMPLEMENT/DONE` como precondición para reejecutarse. El desarrollador queda obligado a editar el frontmatter a mano.
3. **Sin rastro sin `tasks.md`.** Cuando la historia se planificó con `/story-plan --only-testcases` no existe `tasks.md`, por lo que el rechazo no deja ningún artefacto accionable: el sub-flujo de corrección de `story-implement-tasks` es inalcanzable.

**Estado actual relevante (fuentes inspeccionadas):**
- `.claude/skills/story-code-review/SKILL.md` — Pasos 4f (genera `fix-directives.md`), 4g.1 (tarea en `tasks.md`), 4g.2 (retroceso a `READY-FOR-IMPLEMENT/DONE`), Paso 7 (mensaje final que dice "Ejecuta /story-code-review {story_id} nuevamente").
- `.claude/skills/story-code-review/assets/fix-directives-template.md` — sección "Ciclo de corrección" que instruye reejecutar `/story-code-review` y menciona el estado inexistente `READY-FOR-VERIFY`.
- `.claude/skills/story-implement-tasks/SKILL.md` — Paso 3 "Sub-flujo: Implementar fix-directives.md" (sub-pasos 1–3): la lógica canónica de aplicación de correcciones que se reutiliza como base del nuevo skill.
- `docs/guides/state-machine.md` — documento canónico de estados; hoy la fila de `story-code-review` retrocede a `READY-FOR-IMPLEMENT/DONE` y no existe el substatus `NEEDS-CHANGES` ni skill de salida asociado.
- `docs/guides/skill-structural-pattern.md` — patrones estructurales obligatorios (directorios, frontmatter, preflight Paso 0, template como fuente de verdad, idempotencia, rutas de output predecibles).

**Convenciones detectadas (contexto técnico del proyecto):**
- El "código de producción" de este repositorio son **skills** (`sddf.config.yaml`: `layer: monolithic … todo el código de producción son skills`). No hay capas frontend/backend/database.
- Un skill vive en `.claude/skills/<skill-name>/` con `SKILL.md` (frontmatter `name`/`description`/`triggers` + instrucciones), `assets/`, `examples/`, `evals/`.
- Los skills que transitan estado leen y escriben el frontmatter de `story.md` (`status`/`substatus`) y validan precondiciones antes de actuar (fail-fast, sin modificar archivos si la precondición falla).
- Patrón de idempotencia declarado (patrón 11): si el artefacto ya existe u operación ya se aplicó, no reaplicar ni degradar.

**Decisión de alcance heredada de la historia (enfoque A + D):** crear un skill propio `/story-fix` (dueño único del ciclo de corrección) y un estado propio `CODE-REVIEW/NEEDS-CHANGES`. Se descartó reparar el parser de `story-implement-tasks` (obligaría a `tasks.md`) y extender `story-implement` (contradice su contrato). El sub-flujo antiguo dentro de `story-implement-tasks` **no se retira** en esta historia (fuera de alcance): queda inalcanzable de facto porque la vía de retroceso ya no produce `READY-FOR-IMPLEMENT/DONE` con la tarea inyectada.

## Goals / Non-Goals

**Goals:**
- **G1** — Que `/story-code-review`, ante `needs-changes`, deje una entrega accionable e inequívoca: `fix-directives.md` presente, `story.md` en `CODE-REVIEW/NEEDS-CHANGES`, y mensaje final que remita a `/story-fix <story_id>` sin mencionar reejecutar `/story-code-review` como acción inmediata. // satisface: AC-1
- **G2** — Un nuevo skill `/story-fix` que aplica las correcciones de `fix-directives.md` sobre los archivos indicados y genera `fix-report.md` con el resultado por hallazgo (aplicado / omitido + motivo), dejando `story.md` en `IMPLEMENT/DONE`. // satisface: AC-2
- **G3** — `/story-fix` opera únicamente desde `fix-directives.md` + frontmatter de `story.md`, sin exigir `tasks.md`. // satisface: AC-4
- **G4** — `/story-fix` valida sus precondiciones y, si no se cumplen, se detiene sin modificar nada, nombra la precondición incumplida y el estado real, e indica el skill que corresponde. // satisface: AC-3
- **G5** — Reflejar el estado `CODE-REVIEW/NEEDS-CHANGES` en `docs/guides/state-machine.md` con su skill de entrada (`story-code-review`) y de salida (`story-fix`). // satisface: NF-1
- **G6** — El skill cumple los patrones estructurales (AC-5) y los lineamientos de `skill-master` (AC-6): estructura de directorios, frontmatter, preflight Paso 0, template como fuente de verdad, ejemplos y evals.

**Non-Goals:**
- Retirar el sub-flujo de corrección alojado en `story-implement-tasks` (fuera de alcance; historia hermana en EPIC-17).
- Corregir el estado inexistente `READY-FOR-VERIFY` fuera de la mención concreta del `fix-directives-template.md` que este cambio toca.
- Implementar/hacer cumplir la lista blanca de archivos permitidos como mecanismo vinculante (candidata a `/story-fix` pero especificada aparte).
- Validación de precondición de estado en `story-implement`; estados huérfanos sin skill de salida.
- Generar código de dominio: `/story-fix` aplica las correcciones textuales indicadas en `fix-directives.md`, no reimplementa la historia con TDD.

## Decisions

### D-1 — `/story-fix` como skill propio con dueño único del ciclo de corrección
El ciclo de corrección post-rechazo tiene un solo dueño: el skill `story-fix`. Lee `fix-directives.md`, aplica correcciones y cierra en `IMPLEMENT/DONE`. // satisface: AC-2, AC-4

- **Alternativa rechazada A — reparar el parser de `story-implement-tasks`:** obligaría a que `tasks.md` sea artefacto obligatorio, rompiendo la promesa de `/story-plan --only-testcases`. Rechazada por la historia.
- **Alternativa rechazada B — extender `story-implement`:** contradice el contrato que ese skill declara sobre sí mismo (ciclo TDD RED→GREEN→REFACTOR). Rechazada por la historia.

### D-2 — Estado propio `CODE-REVIEW/NEEDS-CHANGES` como punto de traspaso
El rechazo deja `story.md` en `status: CODE-REVIEW` / `substatus: NEEDS-CHANGES`. Este substatus es el contrato explícito entre `story-code-review` (entrada) y `story-fix` (salida). // satisface: AC-1, NF-1

- **Por qué un substatus nuevo y no reutilizar `READY-FOR-IMPLEMENT/DONE`:** el estado anterior colisiona con la precondición de `story-code-review` (`IMPLEMENT/DONE`) y con la de `story-implement-tasks`, obligando a edición manual. Un substatus dedicado hace inequívoco que la historia espera correcciones dirigidas, no re-planificación ni re-implementación TDD completa.
- **Alternativa rechazada — nuevo `status` de primer nivel (p. ej. `FIXING`):** agregar un status al pipeline canónico es un cambio de mayor superficie (diagramas mermaid de story/epic, tablas, ADR). `NEEDS-CHANGES` como substatus dentro de `CODE-REVIEW` es la mínima intervención suficiente. // satisface: P12 (simplicidad)

### D-3 — Salida de `/story-fix` a `IMPLEMENT/DONE`
Tras aplicar las correcciones, `/story-fix` deja `story.md` en `status: IMPLEMENT` / `substatus: DONE`. // satisface: AC-2

- **Por qué `IMPLEMENT/DONE` y no `CODE-REVIEW/*`:** es exactamente la precondición de entrada de `story-code-review`, de modo que reejecutar la revisión no requiere ninguna edición manual de frontmatter (cierra el bucle del escenario alternativo).
- **Alternativa rechazada — dejar en `CODE-REVIEW/IN-PROGRESS`:** dispararía la relectura del review sobre un estado ambiguo y dejaría un estado huérfano; además `story-code-review` no admite ese estado como entrada.

### D-4 — Reutilización de la lógica de aplicación de correcciones ya existente
El motor de aplicación de `/story-fix` reutiliza el algoritmo del "Sub-flujo: Implementar fix-directives.md" de `story-implement-tasks` (Paso 3, sub-pasos 1–3): leer la tabla "Instrucciones de corrección", iterar filas, extraer `Archivo:Línea`, verificar existencia, aplicar `Acción requerida`, y no abortar ante archivo inexistente. // satisface: AC-2, NF-2, P3 (reutilización)

- **Alternativa rechazada — diseñar un formato nuevo de directivas:** `fix-directives.md` ya es el artefacto canónico producido por `story-code-review`; crear otro formato duplicaría fuente de verdad. Se reutiliza tal cual, incluida su tabla de columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`.

### D-5 — Idempotencia por precondición de estado
La idempotencia (NF-3) se obtiene "gratis" a partir de D-2 + D-3: tras un `/story-fix` exitoso la historia está en `IMPLEMENT/DONE`, que **no** es la precondición de `/story-fix` (`CODE-REVIEW/NEEDS-CHANGES`). Reejecutar el skill sobre una historia ya corregida cae en la validación de precondición (D-2/G4) y se detiene sin reaplicar cambios ni degradar el estado alcanzado. // satisface: NF-3

- **Alternativa rechazada — marcar filas aplicadas dentro de `fix-directives.md`:** añade estado mutable al artefacto de directivas y complejidad de parseo; la precondición de estado ya garantiza la no-reaplicación con menor superficie. // satisface: P12

### D-6 — Ajuste mínimo en `story-code-review` (productor del traspaso)
`story-code-review` se modifica en el punto de rechazo para producir el nuevo contrato: // satisface: AC-1, NF-1

- Paso 4g.2 → escribir `status: CODE-REVIEW` / `substatus: NEEDS-CHANGES` (antes `READY-FOR-IMPLEMENT/DONE`).
- Paso 4g.1 → deja de inyectar `- [ ] Implementar fix-directives.md` en `tasks.md` (mecanismo roto y ya innecesario; el rastro accionable pasa a ser `fix-directives.md` + el substatus). El paso queda sin dependencia de `tasks.md`. // satisface: AC-4
- Paso 7 (mensaje final needs-changes) → indicar "Ejecuta `/story-fix <story_id>`" como paso siguiente; **no** mencionar reejecutar `/story-code-review` como acción inmediata.
- Tabla "Restricciones / Reglas" y sección "Posicionamiento" → reflejar `CODE-REVIEW/NEEDS-CHANGES` como salida de needs-changes.
- `assets/fix-directives-template.md` → sección "Ciclo de corrección" apunta a `/story-fix`; se elimina la mención al estado inexistente `READY-FOR-VERIFY` en el punto que este cambio toca.

### D-7 — Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `story-fix/SKILL.md` | crear | `.claude/skills/story-fix/SKILL.md` | AC-2, AC-3, AC-4, AC-5, AC-6 |
| `fix-report-template.md` | crear | `.claude/skills/story-fix/assets/fix-report-template.md` | AC-2, NF-2 |
| Ejemplos de `story-fix` | crear | `.claude/skills/story-fix/examples/` | AC-6 |
| Evals de `story-fix` | crear | `.claude/skills/story-fix/evals/` | AC-6 |
| `story-code-review/SKILL.md` | modificar (Pasos 4g.1, 4g.2, 7; Posicionamiento; Restricciones) | `.claude/skills/story-code-review/SKILL.md` | AC-1 |
| `fix-directives-template.md` | modificar (sección "Ciclo de corrección") | `.claude/skills/story-code-review/assets/fix-directives-template.md` | AC-1 |
| `state-machine.md` | modificar (substatus, transiciones CR needs-changes y story-fix) | `docs/guides/state-machine.md` | NF-1 |

> Nota: todos los componentes son artefactos de skills/documentación (el "código de producción" de este repo). No hay esquema de base de datos ni API. La implementación efectiva de estos cambios ocurre en la fase IMPLEMENT, no en esta fase de PLAN.

### D-8 — Contrato de interfaz del skill `/story-fix`

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/story-fix {story_id}` \| `/story-fix {story_path}` | AC-2 |
| Precondición de estado | `story.md.status == CODE-REVIEW` **Y** `story.md.substatus == NEEDS-CHANGES` | AC-3, D-2 |
| Precondición de artefacto | `fix-directives.md` existe en `$STORY_DIR` | AC-3 |
| Entrada de datos | tabla "Instrucciones de corrección" de `fix-directives.md` (cols: `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`) | AC-2 |
| Salida — artefacto | `$STORY_DIR/fix-report.md` (resultado por hallazgo: aplicado / omitido + motivo) | AC-2, NF-2 |
| Salida — estado | `story.md` → `status: IMPLEMENT` / `substatus: DONE` | AC-2, D-3 |
| Salida — error precondición | mensaje que nombra la precondición incumplida + estado real + skill sugerido; **cero** archivos modificados | AC-3 |
| Independencia | no lee ni exige `tasks.md` en ninguna rama | AC-4, G3 |

**Frontmatter del `SKILL.md` de `story-fix`** (patrón estructural 2): `name: story-fix`, `description` con gatillos, `triggers` (p. ej. "story-fix", "aplicar fix-directives", "corregir hallazgos de code review", "ciclo de corrección post-rechazo"). Preflight como Paso 0 (patrón 3). Template `fix-report-template.md` como fuente de verdad del output (patrón 5). // satisface: AC-5, AC-6

### D-9 — Flujo de `/story-fix` (escenario alternativo, sin `tasks.md`) — satisface: AC-2, AC-4, NF-2

```
Paso 0  Preflight (skill-preflight) → si inválido, detener
Paso 1  Resolver story_id → $STORY_DIR (glob 03-stories/{id}-*)
Paso 2  Validar precondiciones (fail-fast, sin modificar nada):
          2a. story.md.status == CODE-REVIEW && substatus == NEEDS-CHANGES ?
          2b. fix-directives.md existe ?
          → si alguna falla: emitir error (precondición incumplida + estado real
            + skill sugerido) y DETENER   [AC-3]
Paso 3  Leer fix-directives.md → tabla "Instrucciones de corrección"
Paso 4  Por cada fila (NO requiere tasks.md):                    [AC-4]
          - extraer archivo:línea de "Archivo:Línea"
          - ¿archivo existe?
              no → registrar "omitido — archivo no encontrado", continuar   [NF-2]
              sí → aplicar "Acción requerida"; registrar "aplicado"
Paso 5  Generar fix-report.md (una fila por hallazgo: aplicado/omitido+motivo)
Paso 6  story.md → IMPLEMENT/DONE                                [D-3]
Paso 7  Resumen final: N aplicados / M omitidos; sugerir /story-code-review
        (reejecutable sin edición manual de frontmatter)
```

### D-10 — Flujo de traspaso desde `/story-code-review` (needs-changes) — satisface: AC-1

```
story-code-review (Paso 4d: review-status = needs-changes)
  → 4f  genera fix-directives.md            (sin cambios)
  → 4g.1 [D-6] YA NO inyecta tarea en tasks.md
  → 4g.2 [D-6] story.md → CODE-REVIEW/NEEDS-CHANGES
  → 7    [D-6] mensaje final: "Ejecuta /story-fix <story_id>"
              (no menciona reejecutar /story-code-review como acción inmediata)
```

### D-11 — Trazabilidad AC → elemento de diseño

| AC / NF | Enunciado (resumen) | Elemento(s) de diseño |
|---|---|---|
| AC-1 | Rechazo deja entrega accionable e inequívoca | D-6, D-10, D-7 (`story-code-review`, `fix-directives-template.md`) |
| AC-2 | Corrección aplicada sin `tasks.md` | D-1, D-3, D-4, D-8, D-9 |
| AC-3 | Invocación fuera de precondiciones | D-8 (precondiciones), D-9 (Paso 2), G4 |
| AC-4 | Independencia del método de planificación | D-1, D-6 (4g.1), D-8 (Independencia), D-9 (Paso 4) |
| AC-5 | Patrones estructurales de skills | D-8 (frontmatter, preflight, template), D-7 (estructura de directorios) |
| AC-6 | Lineamientos de skill-master | D-7 (assets/examples/evals), D-8 (frontmatter/triggers) |
| NF-1 | Trazabilidad de `NEEDS-CHANGES` en state-machine | D-2, D-6, G5, D-7 (`state-machine.md`) |
| NF-2 | Degradación controlada | D-4, D-9 (Paso 4: archivo inexistente → omitido) |
| NF-3 | Idempotencia | D-5 |

### D-12 — Decisiones de complejidad justificada
- **Substatus en vez de status nuevo (D-2):** un `status` nuevo obligaría a tocar los diagramas mermaid de story y epic, la tabla de estados y el ADR. El substatus `NEEDS-CHANGES` dentro de `CODE-REVIEW` es la intervención mínima que cierra el bucle. (KISS)
- **Idempotencia por precondición (D-5):** se evita introducir estado mutable en `fix-directives.md` (marcar filas aplicadas). La no-reaplicación emerge del propio contrato de estados. (YAGNI)
- **Reutilizar el algoritmo de corrección existente (D-4):** no se inventa un motor nuevo; se extrae el comportamiento ya probado del sub-flujo de `story-implement-tasks`. (Reutilización antes de crear)

## Risks / Trade-offs

- **[R1] Ambigüedad de "aplicar la Acción requerida"** → El texto de `Acción requerida` es lenguaje natural; su aplicación depende de interpretación del ejecutor. **Mitigación:** `/story-fix` aplica la corrección al `Archivo:Línea` indicado y **registra en `fix-report.md`** qué hizo por cada hallazgo, dejando trazabilidad auditable; los casos no aplicables se marcan "omitido + motivo" en lugar de forzar un cambio incorrecto. (Ver también Open Question OQ-1.)
- **[R2] Sub-flujo antiguo en `story-implement-tasks` queda como código muerto alcanzable en teoría** → Si una historia llegara a `IMPLEMENT` con la tarea `Implementar fix-directives.md` inyectada por una versión previa, ambos caminos podrían coexistir. **Mitigación:** con D-6 (4g.1) `story-code-review` deja de inyectar la tarea; el sub-flujo antiguo se vuelve inalcanzable de facto. Retirarlo es historia hermana (Non-Goal explícito).
- **[R3] Divergencia de estado documentado vs. real** → `state-machine.md` es la fuente de verdad; si no se actualiza, `NEEDS-CHANGES` queda huérfano. **Mitigación:** G5/D-6 incluyen la actualización del documento canónico como parte del alcance (NF-1).
- **[R4] Ruta de guías divergente en la historia** → `story.md` referencia `docs/knowledge/guides/…` pero los archivos reales están en `docs/guides/…`. **Mitigación:** ver CR-001; el diseño usa la ruta real verificada `docs/guides/`.
- **[R5] `fix-directives.md` sin filas bloqueantes o tabla vacía** → Podría dejar la historia sin correcciones que aplicar. **Mitigación:** `/story-fix` trata la tabla vacía como "0 aplicados / 0 omitidos", genera `fix-report.md` informativo y aun así transiciona a `IMPLEMENT/DONE` (el review posterior reevaluará). Confirmar en Open Question OQ-2.

## Open Questions

- **OQ-1** — ¿`fix-report.md` debe usar un template en `assets/` (patrón 5, "template como fuente de verdad") o basta una estructura embebida? El diseño asume **template en `assets/fix-report-template.md`** por coherencia con `story-code-review` y `story-implement-tasks`. A confirmar en tasking.
- **OQ-2** — Ante `fix-directives.md` con tabla de instrucciones vacía, ¿transicionar igualmente a `IMPLEMENT/DONE` (asunción actual, R5) o detener con aviso? Recomendación: transicionar con `fix-report.md` informativo, para no bloquear el bucle.
- **OQ-3** — ¿`/story-fix` debe hacer cumplir la "Lista blanca de archivos permitidos" de `fix-directives.md` (limitar cambios a esa lista)? La historia lo declara **fuera de alcance** explícitamente; se deja como no-goal salvo indicación contraria.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia (ruta documental incorrecta en la historia)
- **Descripción**: `story.md` referencia los lineamientos en `docs/knowledge/guides/skill-structural-pattern.md` y `docs/knowledge/guides/state-machine.md`, pero los archivos reales verificados en el repositorio están en `docs/guides/skill-structural-pattern.md` y `docs/guides/state-machine.md`. El directorio `docs/knowledge/guides/` no existe.
- **Documento afectado**: story.md (Requerimiento "Patrones estructurales" y Criterio no funcional "Trazabilidad")
- **Acción requerida**: corregir las rutas en `story.md` a `docs/guides/…`, o crear/mover los documentos a `docs/knowledge/guides/`. El diseño adopta la ruta real verificada (`docs/guides/`).
