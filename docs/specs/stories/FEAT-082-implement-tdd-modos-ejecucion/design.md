---
alwaysApply: false
type: design
id: FEAT-082
slug: FEAT-082-implement-tdd-modos-ejecucion-design
title: "Design: story-implement-tdd — modos interactivo y automático de ejecución del ciclo TDD"
date: 2026-05-30
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
related:
  - FEAT-082-implement-tdd-modos-ejecucion
  - FEAT-078-implement-tdd-fase-red
  - FEAT-081-implement-tdd-fase-green-refactor
---

<!-- Referencias -->
[[FEAT-082-implement-tdd-modos-ejecucion]]

## Context

`story-implement-tdd` ya orquesta el ciclo TDD completo (RED → GREEN → REFACTOR) gracias a FEAT-078 y FEAT-081. FEAT-082 añade la capacidad de elegir entre dos modos de ejecución:

- **Modo interactivo** (predeterminado): el skill pausa al completar cada fase y pide confirmación antes de continuar con la siguiente.
- **Modo automático** (`--auto`): ejecuta las tres fases sin interrupciones, deteniéndose solo ante errores.

Esto permite adaptar el mismo skill a dos contextos distintos: trabajo manual supervisado (interactivo) y pipelines de CI donde no hay usuario presente (automático).

**Posición en el pipeline:**
```
[FEAT-078: Fase RED implementada]
[FEAT-081: Fases GREEN+REFACTOR implementadas]
→ story-implement-tdd (modos interactivo/auto) ← FEAT-082
→ story-code-review
```

**Criterios de aceptación de referencia:**
- AC-1: Modo interactivo — pausa después de RED (confirmación antes de GREEN) y después de GREEN (confirmación antes de REFACTOR)
- AC-2: Modo automático (`--auto`) — ejecuta las tres fases sin pausas; muestra resumen al finalizar
- AC-3: Modo automático con error — detiene sin solicitar confirmación al usuario
- Req-4: `skill-preflight` como Paso 0

---

## Goals / Non-Goals

**Goals:**
- Diseñar el parseo del flag `--auto` y la inicialización del modo de ejecución
- Definir los dos puntos de pausa (Pause-1 y Pause-2) y su protocolo en modo interactivo
- Definir el resumen de ciclo completo que muestra el modo automático al finalizar
- Definir el comportamiento ante error en modo automático (sin prompt)
- Definir cómo se propaga el modo a través de las fases sin acoplar los subagentes
- Extender el SKILL.md existente con las adiciones mínimas necesarias
- Extender `evals/evals.json` con TC-007, TC-008, TC-009

**Non-Goals:**
- Rediseñar la lógica de las fases RED, GREEN o REFACTOR (cubiertos en FEAT-078 y FEAT-081)
- Añadir más flags o modos de ejecución (ej. `--dry-run`, `--verbose`) — historias futuras
- Gestionar persistencia del modo entre ejecuciones distintas

---

## Decisions

### D-1: Parseo del flag `--auto` e inicialización de `$EXEC_MODE`
// satisface: AC-1, AC-2, AC-3

El flag se parsea en un nuevo **Paso 0b** (después de preflight, antes de cualquier lógica):

1. Inspeccionar los argumentos de invocación buscando `--auto`
2. Si `--auto` está presente → `$EXEC_MODE = auto`
3. Si `--auto` está ausente → `$EXEC_MODE = interactive` (predeterminado, Req NFN: modo predeterminado)
4. Emitir: `[INFO] Modo de ejecución: {$EXEC_MODE}`

`$EXEC_MODE` es una variable en memoria para la ejecución actual. No se persiste en ningún archivo.

**Alternativa rechazada — leer modo desde sddf-config.yaml:** Carga burocrática innecesaria para una preferencia de sesión. El flag de CLI es más explícito y no requiere modificar archivos de configuración. `sddf-config.yaml` es para configuración de skills del stack, no para preferencias de flujo del usuario.

**Alternativa rechazada — variable de entorno `SDDF_MODE`:** Menos descubrible que un flag CLI; el practitioner que invoca el skill en CI necesita ver `--auto` en el comando para entender el comportamiento sin consultar documentación externa.

---

### D-2: Puntos de pausa — ubicación en el flujo
// satisface: AC-1, AC-2

Los puntos de pausa se insertan como bloques condicionales en el SKILL.md:

| Punto | Posición en SKILL.md | Condición de activación |
|-------|---------------------|------------------------|
| **Pause-1** | Entre Paso 6 (escribir red-phase-status.json) y Paso 7 (verificar precondición GREEN) | Solo si `$EXEC_MODE = interactive` |
| **Pause-2** | Entre Paso 9b (confirmación estado GREEN) y Paso 10 (Fase REFACTOR) | Solo si `$EXEC_MODE = interactive` |

En modo `auto`: los bloques Pause-1 y Pause-2 se saltan completamente.

**Alternativa rechazada — pausa única al final de RED+GREEN (no entre RED y GREEN):** AC-1 establece explícitamente pausas al finalizar CADA fase; una sola pausa omite la confirmación intermedia antes del REFACTOR.

**Alternativa rechazada — pausa configurable por fase en sddf-config.yaml:** Complejidad injustificada para un comportamiento binario (pausar / no pausar). El flag `--auto` es suficiente.

---

### D-3: Protocolo de pausa en modo interactivo
// satisface: AC-1

Formato del bloque de pausa (aplicado en Pause-1 y Pause-2):

```
📋 Fase {FASE_COMPLETADA} completada
   {resumen_fase}

¿Continuar con la Fase {SIGUIENTE_FASE}? (s/n)
```

**Contenido del `{resumen_fase}` por fase:**

| Fase completada | Resumen |
|----------------|---------|
| RED | `· Tipos generados: {tipos} · Tests en rojo: ✅ / ⚠️` |
| GREEN | `· Archivos de producción generados: {N} · Tests: todos pasan ✅` |

**Respuestas del usuario:**
- `s` (o Enter) → continuar con la siguiente fase
- `n` → emitir `🛑 Ciclo TDD pausado por el usuario tras Fase {FASE}` y terminar sin error (exit limpio)
- Cualquier otra entrada → repetir la pregunta una vez más; si vuelve a ser inválida, asumir `n`

**Alternativa rechazada — pausa con timeout automático (continuar si no hay respuesta en N segundos):** Genera comportamiento impredecible en terminales lentas; el modo interactivo está explícitamente diseñado para espera activa del usuario.

---

### D-4: Resumen final en modo automático
// satisface: AC-2

Al completar las tres fases en modo `auto`, mostrar el resumen consolidado del ciclo:

```
── Ciclo TDD completado automáticamente (--auto) ──────────
✅ Fase RED:      {N} tipos generados | rojo confirmado: {✅ / ⚠️}
✅ Fase GREEN:    {N} archivo(s) de producción generados
✅ Fase REFACTOR: sin regresiones
──────────────────────────────────────────────────────────
📄 cycle-status.json → .tmp/story-implement-tdd/cycle-status.json
📋 story.md: CODE-REVIEW/IN-PROGRESS ✓
```

Este resumen reemplaza los mensajes individuales de confirmación que el modo interactivo muestra en las pausas.

**Alternativa rechazada — no mostrar resumen en modo auto (solo errores):** AC-2 establece explícitamente "muestra un resumen de las tres fases al finalizar el ciclo"; omitirlo viola la historia.

---

### D-5: Comportamiento ante error en modo automático
// satisface: AC-3

En modo `auto`, cuando ocurre un error en cualquier fase:
1. El skill detiene la ejecución inmediatamente (mismo comportamiento que modo interactivo)
2. Reporta el error: `❌ {mensaje_error_fase}` (mismo formato que en modo interactivo)
3. **No muestra prompt de confirmación ni espera input del usuario**
4. La salida es el mensaje de error y el proceso termina

La diferencia con modo interactivo es únicamente la ausencia del prompt. La lógica de detección y reporte de errores es idéntica (D-5 de FEAT-078 y D-5 de FEAT-081 se mantienen sin cambios).

**Alternativa rechazada — mostrar el error pero continuar con las fases restantes en auto:** Viola explícitamente AC-3 ("detiene la ejecución inmediatamente"); continuar tras un error produciría resultados no confiables.

---

### D-6: Propagación del modo a través del ciclo sin acoplar subagentes
// satisface: AC-1, AC-2, Req-4

`$EXEC_MODE` es una variable del orquestador (`story-implement-tdd`). Los subagentes (skills de test generation y code_generator) **no reciben ni conocen** `$EXEC_MODE`:
- El modo solo afecta al orquestador: cuándo pausar, cuándo continuar.
- Los subagentes reciben el mismo bundle de inputs independientemente del modo.

Esta separación mantiene los subagentes agnósticos al contexto de ejecución del orquestador (principle: no "teléfono descompuesto", constitution.md §6).

**Alternativa rechazada — incluir `exec_mode` en el bundle de inputs de subagentes:** Los subagentes no necesitan saber el modo; acoplarlos al contexto del orquestador viola la separación de responsabilidades y complica el contrato de los subagentes innecesariamente.

---

### D-7: Extensión del SKILL.md existente
// satisface: AC-1, AC-2, AC-3, Req-4

FEAT-082 extiende el mismo SKILL.md de `story-implement-tdd` (ya extendido por FEAT-081):

**Cambios en SKILL.md:**
1. Añadir `--auto` al campo `input` del frontmatter
2. Añadir `"--auto"` y `"modo automático"` a los triggers
3. Añadir **Paso 0b**: parseo de flags → `$EXEC_MODE`
4. Insertar **bloque Pause-1** entre Paso 6 y Paso 7
5. Insertar **bloque Pause-2** entre Paso 9b y Paso 10
6. Modificar **Paso 11** (resumen final): mostrar resumen consolidado si `$EXEC_MODE = auto`
7. Extender tabla "Manejo de errores" con: "Usuario responde 'n' en pausa" → `🛑 Ciclo pausado`

**Cambios en evals/evals.json:**
- TC-007: modo interactivo pausa en Pause-1 y solicita confirmación (AC-1)
- TC-008: modo `--auto` completa ciclo sin pausa + muestra resumen consolidado (AC-2)
- TC-009: modo `--auto` + error en Fase GREEN → detiene sin prompt (AC-3)

**Alternativa rechazada — Paso 0b como validación de entrada antes del preflight:** El flag `--auto` no es una precondición de entorno; es una preferencia de ejecución. Debe procesarse después de validar el entorno (preflight), no antes.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| El practitioner no pasa `--auto` en CI y el pipeline se bloquea esperando input | Documentar explícitamente en el SKILL.md que el modo interactivo espera input del usuario y no es adecuado para CI sin supervisión |
| En modo interactivo, el usuario responde 'n' en Pause-1 y los archivos de test quedan en el directorio sin código de producción | D-3 emite `🛑 Ciclo TDD pausado` indicando que los archivos de test existen; el practitioner puede retomar invocando con `--skip-red` o re-ejecutando (esto requiere coordinación con FEAT-078/081) |
| Integración con FEAT-081: los pasos FEAT-081 aún no están implementados cuando se fusiona FEAT-082 | D-7 extiende el SKILL.md; los bloques de pausa son no-operativos (pasan vacíos) si los pasos de FEAT-081 no existen — degradación controlada |

---

## Open Questions

Sin preguntas abiertas — todas las ambigüedades técnicas están resueltas en D-1 a D-7 o delegadas explícitamente a la implementación de FEAT-078 y FEAT-081.
