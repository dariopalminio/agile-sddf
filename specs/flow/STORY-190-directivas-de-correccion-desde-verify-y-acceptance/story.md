---
alwaysApply: false
type: story
id: STORY-190
kind: feat
slug: STORY-190-directivas-de-correccion-desde-verify-y-acceptance
title: "Directivas de corrección desde verify y acceptance"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-el-rework-vuelve-a-implement-todo
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Directivas de corrección desde verify y acceptance

**Como** Solo Builder que corrige una historia rechazada en VERIFY o en ACCEPTANCE  
**Quiero** que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriban `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on` apuntando a su reporte, que los tres gates numeren `round` con todas las rondas de rework de la historia, y que `/story-implement` y `/story-implement-tasks` anuncien el origen del rework y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`  
**Para** que los tres rechazos lleguen al ejecutor con lo que hay que corregir y se cierre la deuda que registró ADR-0008

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por aceptación con directivas
```gherkin
Dado una historia STORY-NNN en "VERIFY/DONE"
Cuando el validador rechaza un criterio con una observación en "/story-acceptance STORY-NNN"
  Y luego el usuario ejecuta "/story-implement STORY-NNN"
Entonces "story.md" queda en "IMPLEMENT/TODO" junto a "fix-directives.md" con "based-on: acceptance-report.md"
  Y "fix-directives.md" tiene una fila por criterio rechazado, con la dimensión "requirements-coverage" y la observación del validador
  Y "/story-implement" anuncia que el rework viene de "story-acceptance", entra en modo rework y exige un test del criterio rechazado antes de corregir el código
```

### AC-2 — Escenario con datos – Filas de un rechazo de verify
```gherkin
Escenario: fix-directives.md de story-verify
  Dado una historia STORY-NNN en "CODE-REVIEW/DONE"
    Y "/story-verify STORY-NNN" encuentra <hallazgos>
  Cuando "/story-verify" emite "NEEDS-CHANGES"
  Entonces "fix-directives.md" tiene "based-on: verify-report.md" y <filas> fila(s) en "Instrucciones de corrección"
    Y cada fila usa la dimensión de verify que nombra el ADR, que no exige un test nuevo
Ejemplos:
  | hallazgos                                                          | filas |
  | un defecto CRITICAL y un defecto HIGH abiertos                     | 2     |
  | un defecto HIGH y dos MEDIUM abiertos                              | 1     |
  | el criterio DoD VERIFY "Todos los tests del proyecto pasan" fallido | 1     |
```

### AC-3 — Escenario alternativo – round continúa entre gates
```gherkin
Dado una historia STORY-NNN cuya ronda de rework 1 la abrió "/story-code-review"
  Y "/story-code-review" aprobó la corrección y borró "fix-directives.md"
Cuando "/story-verify STORY-NNN" emite "NEEDS-CHANGES"
Entonces el nuevo "fix-directives.md" tiene "round: 2"
  Y la ronda anterior se leyó de la fuente versionada que fija el ADR
  Pero "round" no vuelve a 1 porque "/story-code-review" haya aprobado entre medias
```

### AC-4 — Escenario alternativo / error – IMPLEMENT/TODO sin fix-directives.md
```gherkin
Escenario: Ejecutor ante IMPLEMENT/TODO sin directivas
  Dado una historia STORY-NNN en "IMPLEMENT/TODO" sin "fix-directives.md"
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el ejecutor avisa de que encontró "IMPLEMENT/TODO" sin "fix-directives.md"
    Y continúa sin modo rework
    Pero no deduce el rework de "verify-report.md" ni de "acceptance-report.md"
Ejemplos:
  | ejecutor               |
  | /story-implement       |
  | /story-implement-tasks |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Plantilla única:** `docs/templates/fix-directives-template.md` es la fuente de la estructura. Cada skill que escribe directivas (`story-code-review`, `story-verify`, `story-acceptance`) lleva en `assets/` una copia semilla con el mismo contenido, y `docs/templates/README.md` la registra. La plantilla recoge lo que fijó EPIC-28: PREEXISTENTE y `no verificado` no entran, y un hallazgo fusionado entra una vez con `Reportado por:`.

- **CNF-2 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-verify` y `story-acceptance` (CS-7), y los del origen del rework y del aviso en los de `story-implement` y `story-implement-tasks`, antes de cambiar los `SKILL.md` (principio 11 de la constitución).

- **CNF-3 — Lista blanca de acceptance:** un rechazo de aceptación no tiene archivo de origen; su lista blanca sigue la regla del ADR. Una lista vacía no es un error.

- **CNF-4 — Reportes sin cambios:** el formato de `verify-report.md` y de `acceptance-report.md` no cambia.

- **CNF-5 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que los ejecutores lean `verify-report.md` o `acceptance-report.md`. La épica lo descartó: son tres formatos distintos y conservan `NEEDS-CHANGES` después de corregir, hasta que el gate vuelve a ejecutarse.
- Cambiar qué hallazgos de `story-code-review` entran en `fix-directives.md` (fijado en EPIC-28).
- El destino `IMPLEMENT/TODO` de los tres gates: STORY-189.

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-3** de EPIC-029, el **SMOKE-4** y la parte de **CS-7** que pide casos de `fix-directives.md` en los evals de `story-verify` y `story-acceptance`.
- Depende de STORY-186, que fija el nombre de la dimensión de verify, la fuente de la ronda anterior y la lista blanca de acceptance, y de STORY-189, que lleva los tres rechazos a `IMPLEMENT/TODO`. La épica la ordena después de la de rework.
- El contrato actual vive en `skills/story-code-review/assets/fix-directives-template.md` (`based-on: code-review-report.md` fijo) y en el Paso 4f de `skills/story-code-review/SKILL.md`. Hoy `story-code-review` es el escritor único de `round` (línea 681): esa regla cambia a tres escritores.
- El ciclo de corrección de la plantilla manda volver a `/story-code-review` tras corregir. Sigue siendo válido para los tres orígenes, porque todo rework vuelve a pasar por la revisión. `story-code-review` sigue borrando el archivo al aprobar.
- **Tamaño:** toca cinco skills, sus evals y una plantilla nueva. Si `/story-evaluation` la considera grande, un split natural es: (a) plantilla común y `round` continuo en los tres gates; (b) directivas de verify; (c) directivas de acceptance; (d) origen y aviso en los ejecutores.
