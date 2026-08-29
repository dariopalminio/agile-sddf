---
alwaysApply: false
type: design
id: FEAT-081
slug: FEAT-081-implement-tdd-fase-green-refactor-design
title: "Design: story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar"
date: 2026-05-30
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
related:
  - FEAT-081-implement-tdd-fase-green-refactor
  - FEAT-078-implement-tdd-fase-red
  - FEAT-082-implement-tdd-modos-ejecucion
---

<!-- Referencias -->
[[FEAT-081-implement-tdd-fase-green-refactor]]

## Context

`story-implement` es el skill SDDF que orquesta el ciclo TDD completo (RED → GREEN → REFACTOR) de forma agnóstica al stack. FEAT-078 cubrió la Fase RED. Esta historia, FEAT-081, cubre las **Fases GREEN y REFACTOR**: invocar el skill de coding declarado en `sddf-config.yaml` para implementar el código mínimo que hace pasar los tests en verde (GREEN), luego refactorizar ese código sin romper los tests (REFACTOR), y finalmente actualizar `story.md` a `CODE-REVIEW/IN-PROGRESS` para habilitar la siguiente etapa del pipeline.

La Fase GREEN no puede ejecutarse si la Fase RED no fue completada exitosamente. El artefacto de desacoplamiento entre fases es `.tmp/story-implement/red-phase-status.json`, producido por FEAT-078 y consumido como precondición aquí.

**Posición en el pipeline:**
```
story-plan → story-testcases → story-implement (Fase RED, FEAT-078) → story-implement (GREEN+REFACTOR) ← aquí → story-code-review
```

**Criterios de aceptación de referencia:**
- AC-1: GREEN exitoso y REFACTOR con tests en verde → historia actualizada a CODE-REVIEW/IN-PROGRESS
- AC-2: Fase GREEN falla → detener ciclo sin ejecutar REFACTOR, sin modificar story.md
- AC-3: REFACTOR introduce regresiones → advertir con detalle sin actualizar story.md
- Req-4: Configurabilidad del skill de coding desde sddf-config.yaml (agnóstica al stack)
- Req-5: skill-preflight como Paso 0

---

## Goals / Non-Goals

**Goals:**
- Diseñar el algoritmo de lectura de precondición desde `red-phase-status.json`
- Diseñar el contrato de invocación del `code_generator` para fases GREEN y REFACTOR
- Definir cómo se confirma el estado verde tras GREEN y REFACTOR
- Definir la transición de estado de `story.md` al completar el ciclo
- Diseñar el output intermedio para Fases GREEN y REFACTOR en `.tmp/`
- Diseñar el comportamiento ante fallos de GREEN y regresiones de REFACTOR
- Extender el SKILL.md existente (`.claude/skills/story-implement/SKILL.md`) con las secciones GREEN y REFACTOR

**Non-Goals:**
- Diseñar skills de coding específicos (ej. `story-code-nodejs`) — son historias separadas
- Diseñar modos interactivo/automático — cubiertos en FEAT-082
- Rediseñar la Fase RED — ya cubierta en FEAT-078
- Definir cuándo un refactor es "suficiente" — responsabilidad del skill de coding subagente

---

## Decisions

### D-1: Lectura de precondición desde `red-phase-status.json`
// satisface: AC-1, AC-2

Antes de ejecutar cualquier lógica de GREEN, verificar la precondición de la Fase RED:

1. Buscar `.tmp/story-implement/red-phase-status.json`
2. Si no existe:
   ```
   ❌ Precondición no cumplida: Fase RED no completada
   
   Ejecuta story-implement en Fase RED antes de continuar con GREEN.
   ```
   Detener la ejecución.
3. Si existe, leer y verificar `red_confirmed: true`
4. Si `red_confirmed: false`:
   ```
   ❌ Precondición no cumplida: red_confirmed es false en red-phase-status.json
   
   Los tests no están en estado rojo. Verifica los archivos de prueba generados.
   ```
   Detener la ejecución.
5. Si `red_confirmed: true`: extraer `story_id`, `files_generated`, `generators_invoked` para el bundle de contexto.

**Alternativa rechazada — re-ejecutar la Fase RED como parte de GREEN:** El usuario ya confirmó el estado rojo; volver a ejecutar RED duplica trabajo y puede producir tests distintos si el contexto cambió entre ejecuciones. El archivo `.tmp/` actúa como contrato explícito entre fases.

**Alternativa rechazada — verificar los archivos de test directamente sin leer red-phase-status.json:** Los archivos de test pueden existir sin que RED haya confirmado el estado rojo (ej. tests que pasan). `red_confirmed` es el campo canónico de ese contrato.

---

### D-2: Schema del `code_generator` en sddf-config.yaml
// satisface: AC-1, Req-4

Reusar el campo `IMPLEMENT.code_generator` ya declarado en FEAT-078 D-1:

```yaml
IMPLEMENT:
  code_generator:
    skill: story-code-nodejs   # nombre del directorio en .claude/skills/
    required: true             # true = abortar si no existe; false = WARN y continuar
```

El `code_generator` es una entrada única (no lista) porque hay un solo skill de coding por stack. La misma entrada se usa para GREEN y REFACTOR; el `phase` se comunica como parámetro del bundle.

**Alternativa rechazada — entradas separadas `green_generator` y `refactor_generator`:** En la mayoría de los stacks el mismo skill maneja ambas fases con lógica interna diferenciada por el parámetro `phase`. Separar entradas fragmentaría la configuración innecesariamente y duplicaría el nombre del skill.

**Alternativa rechazada — hardcodear el skill de coding en SKILL.md:** Viola la agnósticidad de stack (Req-4). Cambiar de Node.js a Python requeriría modificar el skill en lugar de solo actualizar `sddf-config.yaml`.

---

### D-3: Validación de existencia del `code_generator` (fail-fast)
// satisface: AC-1, AC-2

Validar la existencia del skill de coding **antes** de cualquier ejecución de código:

1. Leer `IMPLEMENT.code_generator.skill` de `sddf-config.yaml`
2. Construir ruta: `.claude/skills/{skill}/SKILL.md`
3. Verificar existencia con Glob
4. Si no existe y `required: true`:
   ```
   ❌ Skill de coding '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/
   
   Verifica el nombre del skill o instálalo antes de ejecutar la Fase GREEN.
   ```
   Detener sin generar código.
5. Si no existe y `required: false`:
   ```
   [WARN] Skill de coding '<nombre>' no encontrado — Fases GREEN y REFACTOR omitidas
   ```
   Continuar sin invocar el code_generator.

**Alternativa rechazada — validación lazy (detectar ausencia al invocar):** Consistente con el principio de FEAT-078 D-2: fail-fast previene estados parciales donde se invierte tiempo sin posibilidad de completar el ciclo.

---

### D-4: Contrato de invocación del `code_generator`
// satisface: AC-1, Req-5 (un solo nivel de delegación)

El skill sigue el patrón de un solo nivel de delegación (igual que Fase RED):

```
story-implement (Fase GREEN/REFACTOR)   ← orquestador
  └── {code_generator skill}                ← subagente
```

**Bundle de inputs al subagente:**
```json
{
  "story_id": "FEAT-NNN",
  "phase": "GREEN | REFACTOR",
  "test_files": ["ruta/test1.spec.js", "ruta/test2.spec.js"],
  "story_path": "docs/specs/stories/FEAT-NNN-slug/story.md",
  "design_path": "docs/specs/stories/FEAT-NNN-slug/design.md"
}
```

**Output esperado del subagente:**
```json
{
  "status": "ok | error",
  "files_generated": ["ruta/src/service.js"],
  "files_modified": ["ruta/src/utils.js"],
  "message": "string"
}
```

El subagente escribe sus resultados en `.tmp/story-implement/{phase}/results.json` (en minúsculas: `green/results.json`, `refactor/results.json`).

**Alternativa rechazada — pasar contexto heredado completo al subagente:** Viola constitution.md §6 ("evitar el teléfono descompuesto"); el subagente solo necesita los archivos de test, la fase, y los artefactos de especificación.

---

### D-5: Confirmación de estado GREEN (tests pasan)
// satisface: AC-1, AC-2

Tras invocar el code_generator para GREEN:

1. Para cada tipo en `red_phase_status.generators_invoked`, leer `defaults.{type}.command` de `sddf-config.yaml`
2. Si el comando existe:
   - Ejecutarlo
   - Exit code 0: `✅ Fase GREEN exitosa — tests pasan (tipo: <tipo>)`
   - Exit code ≠ 0:
     ```
     ❌ Fase GREEN fallida: el skill '<nombre>' retornó error
     
     Detalle: tests de tipo '<tipo>' no pasan tras la implementación.
     Sugerencia: revisa el código generado en <rutas de files_generated>.
     ```
     Detener sin ejecutar REFACTOR. **No modificar story.md.**
3. Si no hay comando declarado:
   ```
   [INFO] Sin comando configurado para tipo '<tipo>' — confirmación GREEN omitida
   ```
   Asumir GREEN exitoso para ese tipo y continuar.

**Alternativa rechazada — continuar con REFACTOR si GREEN falla:** AC-2 establece explícitamente que Fase GREEN fallida detiene el ciclo sin ejecutar REFACTOR; ejecutar REFACTOR sobre código roto es inútil.

**Alternativa rechazada — delegar la confirmación al code_generator:** La verificación del ciclo TDD (estado verde/rojo) es responsabilidad del orquestador; mantiene la separación de responsabilidades establecida en FEAT-078 D-5.

---

### D-6: Fase REFACTOR — invocación y verificación de no-regresión
// satisface: AC-1, AC-3

Solo se ejecuta si GREEN fue confirmado exitosamente. El proceso es:

1. Invocar el code_generator con `phase: "REFACTOR"` y el mismo bundle del D-4 (excepto `phase`)
2. Si el subagente retorna `status: error`:
   ```
   ❌ Fase REFACTOR fallida: el skill '<nombre>' retornó error
   
   Los tests están en verde; el código no fue refactorizado. Puedes avanzar manualmente a CODE-REVIEW.
   ```
   No modificar story.md. (El código de producción está en verde aunque sin refactor.)
3. Si retorna `status: ok`: ejecutar los comandos de test de cada tipo generado
4. Si todos pasan (exit code 0): `✅ Fase REFACTOR exitosa — tests siguen en verde`
5. Si alguno falla (exit code ≠ 0):
   ```
   ⚠️ Fase REFACTOR introdujo regresiones: <N> tests que pasaban ahora fallan
   
   Tests que regresaron:
   · <tipo>: <detalle del fallo>
   
   Revisa los cambios del refactor en <rutas de files_modified>.
   ```
   **No actualizar story.md.** Esperar resolución manual.

**Alternativa rechazada — revertir automáticamente el refactor en regresión:** La reversión automática oculta el problema; el practitioner necesita ver qué cambió para corregirlo. El mensaje de advertencia con las rutas de archivos modificados proporciona la información necesaria.

**Alternativa rechazada — omitir REFACTOR si el subagente no lo soporta:** AC-1 establece que la historia solo se actualiza a CODE-REVIEW tras GREEN + REFACTOR completos. Si el code_generator no soporta REFACTOR, el skill debe reportarlo como error no fatal (D-6.2) y no bloquear la transición si el estado verde está garantizado.

---

### D-7: Transición de estado de story.md
// satisface: AC-1, AC-2, AC-3

La transición solo ocurre cuando tanto GREEN como REFACTOR completan sin errores ni regresiones:

```
Condición                          → Acción sobre story.md
GREEN exitoso + REFACTOR exitoso   → status: CODE-REVIEW / substatus: IN-PROGRESS
GREEN fallido                      → sin cambio (story.md permanece en estado previo)
REFACTOR fallido (error)           → sin cambio
REFACTOR con regresiones           → sin cambio
```

Actualizar también `updated: <YYYY-MM-DD>` en el frontmatter de `story.md`.

**Alternativa rechazada — actualizar story.md tras GREEN exitoso (sin esperar REFACTOR):** El pipeline SDDF avanza a CODE-REVIEW solo cuando el código está en su forma final (implementado y refactorizado). Avanzar tras GREEN produce deuda técnica en CODE-REVIEW.

---

### D-8: Output intermedio en `.tmp/`
// satisface: AC-1, constitution.md §6

Extender la estructura `.tmp/story-implement/` de FEAT-078 D-8:

```
.tmp/story-implement/
├── red-phase-status.json       # producido por FEAT-078 (precondición)
├── green/
│   └── results.json            # output del code_generator en Fase GREEN
├── refactor/
│   └── results.json            # output del code_generator en Fase REFACTOR
└── cycle-status.json           # resumen del ciclo completo (producido al finalizar)
```

Schema de `cycle-status.json`:
```json
{
  "story_id": "FEAT-NNN",
  "red_confirmed": true,
  "green_confirmed": true,
  "refactor_confirmed": true,
  "files_generated": ["ruta/src/service.js"],
  "files_modified": ["ruta/src/utils.js"],
  "final_status": "CODE-REVIEW",
  "timestamp": "ISO timestamp"
}
```

**Alternativa rechazada — sobrescribir `red-phase-status.json` con el estado del ciclo completo:** El archivo `red-phase-status.json` es el contrato de salida de FEAT-078; sobrescribirlo rompe la separación de responsabilidades entre fases. Cada fase produce su propio artefacto.

---

### D-9: Extensión del SKILL.md existente
// satisface: Req-5 (Patrones estructurales)

FEAT-081 **extiende** el SKILL.md de `story-implement` (creado en FEAT-078) en lugar de crear un nuevo archivo. El skill es un único punto de entrada; las fases son secciones numeradas internas:

```
.claude/skills/story-implement/
├── SKILL.md   ← extender con Pasos 7-11 (GREEN + REFACTOR) y actualizar "Qué hace este skill"
└── evals/
    └── evals.json   ← extender con casos TC-004, TC-005, TC-006
```

Los pasos del SKILL.md pasan de 6 (Fase RED) a 11 (ciclo completo):
- Paso 7: Verificar precondición RED
- Paso 8: Validar y resolver `code_generator`
- Paso 9: Fase GREEN (invocar + confirmar verde)
- Paso 10: Fase REFACTOR (invocar + verificar no-regresión)
- Paso 11: Transición de estado + escribir `cycle-status.json`

**Alternativa rechazada — SKILL.md separado por fase (ej. `story-implement-green.md`):** Viola D-6 de FEAT-078; el skill es un único punto de entrada invocable con una sola frase. Dividirlo requeriría que el practitioner conozca y ordene manualmente las fases.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| El code_generator genera código que pasa los tests pero viola las convenciones del proyecto | El orquestador pasa `design_path` al subagente; el code_generator es responsable de leer y respetar design.md |
| `red-phase-status.json` existe de una ejecución anterior con datos desactualizados | El skill verifica `story_id` del archivo contra el story_id actual; si difieren, emite `⚠️` y solicita re-ejecutar Fase RED |
| El code_generator no soporta la fase REFACTOR (solo implementa) | D-6 trata el error del subagente como no-fatal con `❌` de REFACTOR; el practitioner puede avanzar manualmente |
| Los tests pasan tras GREEN pero el coverage es insuficiente | Fuera de scope de story-implement; es responsabilidad del code_generator y del code-review posterior |
| Los archivos de test generados en RED apuntan a rutas que el code_generator no conoce | El bundle incluye `test_files` explícitos; el code_generator crea el código de producción en las rutas convencionales del stack |

---

## Open Questions

Sin preguntas abiertas — todas las ambigüedades técnicas están resueltas en D-1 a D-9 o delegadas explícitamente a FEAT-082.
