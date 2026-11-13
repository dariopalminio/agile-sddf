---
alwaysApply: false
type: story
id: STORY-190
kind: feat
slug: STORY-190-directivas-de-correccion-desde-verify-y-acceptance
title: "Directivas de corrección desde verify y acceptance"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Directivas de corrección desde verify y acceptance

**Como** Solo Builder que corrige una historia rechazada en VERIFY o en ACCEPTANCE  
**Quiero** que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriban `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte y un `round` que continúe las rondas de rework de la historia, y que `/story-implement` y `/story-implement-tasks` anuncien qué gate abrió el rework y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`  
**Para** que lo que rechazó el gate llegue al ejecutor como una corrección concreta, sin tener que leer el reporte, saber qué gate tengo que volver a pasar, y cerrar la deuda que registró ADR-0008

## ✅ Criterios de aceptación

### AC-1 — Escenario principal (con datos) – Rework con directivas desde verify y acceptance
```gherkin
Escenario: Rechazo con directivas y anuncio del origen
  Dado una historia STORY-NNN en "<estado de entrada>"
    Y <rechazo>
  Cuando "<gate> STORY-NNN" emite "NEEDS-CHANGES"
    Y luego el usuario ejecuta "/story-implement STORY-NNN"
  Entonces junto a "story.md" queda "fix-directives.md" con "based-on: <reporte>"
    Y "fix-directives.md" tiene <filas> fila(s) en "Instrucciones de corrección" con la dimensión "<dimensión>"
    Y "/story-implement" anuncia que el rework viene de "<gate>", entra en modo rework y <test>
Ejemplos:
  | estado de entrada | rechazo                                                                | gate              | reporte              | filas | dimensión                      | test                                                    |
  | CODE-REVIEW/DONE  | un defecto CRITICAL, un defecto HIGH y dos MEDIUM abiertos             | /story-verify     | verify-report.md     | 2     | la de verify que nombra el ADR | no exige un test nuevo, porque el test que falla ya existe |
  | CODE-REVIEW/DONE  | el criterio DoD VERIFY "Todos los tests del proyecto pasan" fallido    | /story-verify     | verify-report.md     | 1     | la de verify que nombra el ADR | no exige un test nuevo, porque el test que falla ya existe |
  | VERIFY/DONE       | el validador rechaza un criterio con una observación                   | /story-acceptance | acceptance-report.md | 1     | requirements-coverage          | exige un test del criterio rechazado antes de corregir el código |
```

### AC-2 — Escenario alternativo – round continúa entre gates
```gherkin
Dado una historia STORY-NNN cuya ronda de rework 1 la abrió "/story-code-review"
  Y "/story-code-review" aprobó la corrección y borró "fix-directives.md"
Cuando "/story-acceptance STORY-NNN" emite "NEEDS-CHANGES"
Entonces el nuevo "fix-directives.md" tiene "round: 2"
  Y la ronda anterior se leyó de la fuente versionada que fija el ADR
  Pero "round" no vuelve a 1 porque "/story-code-review" haya aprobado entre medias
```

### AC-3 — Escenario de error – IMPLEMENT/TODO sin fix-directives.md
```gherkin
Escenario: Ejecutor ante IMPLEMENT/TODO sin directivas
  Dado una historia STORY-NNN en "IMPLEMENT/TODO" sin "fix-directives.md"
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el ejecutor avisa de que encontró "IMPLEMENT/TODO" sin "fix-directives.md" y continúa sin modo rework
    Pero no deduce el rework de "verify-report.md" ni de "acceptance-report.md"
Ejemplos:
  | ejecutor               |
  | /story-implement       |
  | /story-implement-tasks |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Plantilla única:** `docs/templates/fix-directives-template.md` es la fuente de la estructura, con `based-on` según el gate. `story-code-review`, `story-verify` y `story-acceptance` llevan en `assets/` una copia semilla con el mismo contenido, y `docs/templates/README.md` la registra. La plantilla recoge lo que fijó EPIC-28: PREEXISTENTE y `no verificado` no entran, y un hallazgo fusionado entra una vez con `Reportado por:`.

- **CNF-2 — round con varios escritores:** `story-code-review` deja de ser el escritor único de `round`. Los tres gates leen la ronda anterior de la fuente versionada que fija el ADR, así que `round` cuenta todas las rondas de rework de la historia.

- **CNF-3 — Filas de verify:** entran los defectos CRITICAL y HIGH abiertos y los criterios del DoD VERIFY fallidos; los MEDIUM y LOW no bloquean y no entran.

- **CNF-4 — Lista blanca de acceptance:** un rechazo de aceptación no tiene archivo de origen; su lista blanca sigue la regla del ADR. Una lista vacía no es un error.

- **CNF-5 — Señal única:** `fix-directives.md` sigue siendo la única señal de rework (ADR-0008, conservado por el ADR nuevo). El anuncio del origen se toma de `based-on`, y el aviso de AC-3 no cambia esa regla ni bloquea la ejecución.

- **CNF-6 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-verify` y `story-acceptance` (CS-7), los del `round` continuo en los de `story-code-review`, y los del origen del rework y del aviso en los de `story-implement` y `story-implement-tasks`, antes de cambiar sus `SKILL.md` (principio 11 de la constitución).

- **CNF-7 — Sin regresión en la revisión:** con la plantilla común, `story-code-review` sigue escribiendo `based-on: code-review-report.md` y las mismas filas, y sigue borrando el archivo al aprobar.

- **CNF-8 — Reportes sin cambios:** el formato de `verify-report.md` y de `acceptance-report.md` no cambia.

- **CNF-9 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que los ejecutores lean `verify-report.md` o `acceptance-report.md` (descartado por la épica: tres formatos distintos, que conservan `NEEDS-CHANGES` después de corregir hasta que el gate vuelve a ejecutarse).
- Cambiar qué hallazgos de `story-code-review` entran en `fix-directives.md` (fijado en EPIC-28).
- El destino `IMPLEMENT/TODO` de los rechazos y la entrada `IMPLEMENT/TODO` de los ejecutores: STORY-189.

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-3** de EPIC-029, el **SMOKE-4** y la parte de **CS-7** que pide casos de `fix-directives.md` en los evals de `story-verify` y `story-acceptance`.
- **Reagrupación del 2026-11-13:** absorbe a STORY-198 (directivas desde verify) y STORY-199 (origen del rework en los ejecutores), que se habían separado de esta por complejidad de criterios (Patrón 4). Se vuelven a unir porque comparten la plantilla común, la regla de `round` y el mismo contrato del ADR; separadas, la plantilla y `round` se diseñaban y revisaban tres veces. Verify y acceptance se expresan como ejemplos de un mismo esquema (AC-1).
- Depende de STORY-186 (ADR-0022), que fija la fuente de la ronda anterior, el nombre de la dimensión de verify y la lista blanca de acceptance. La planificación espera a que el ADR esté aceptado. AC-1 también necesita STORY-189 (los gates dejan `IMPLEMENT/TODO` y el ejecutor acepta ese estado).
- El contrato actual vive en `skills/story-code-review/assets/fix-directives-template.md` (`based-on: code-review-report.md` fijo) y en el Paso 4f de `skills/story-code-review/SKILL.md`, que hoy declara a `story-code-review` escritor único de `round`.
- El ciclo de corrección de la plantilla manda volver a `/story-code-review` tras corregir. Sigue siendo válido para los tres orígenes, porque todo rework vuelve a pasar por la revisión.
- La dimensión `requirements-coverage` ya activa en el ejecutor la regla de evidencia que exige un test antes de corregir, así que esta historia no cambia esa regla.
