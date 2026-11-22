---
type: design
id: STORY-075
slug: STORY-075-integrar-historia-modo-manual-dryrun-design
title: "Design: story-integrate — Modos de ejecución manual y dry-run"
story: STORY-075
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-075-integrar-historia-modo-manual-dryrun
  - STORY-074-integrar-historia-batch-configurable
---

[[STORY-075-integrar-historia-modo-manual-dryrun]]

## Context

STORY-075 extiende el skill `story-integrate` (creado en STORY-074) con dos modos de ejecución opcionales:
- **Modo manual** (`--manual`): guía interactiva paso a paso con confirmación explícita antes de cada acción irreversible
- **Modo dry-run** (`--dry-run`): simulación completa del flujo sin ejecutar ningún comando Git/PR

El skill depende del contrato de integración que STORY-074 expone. Durante el desarrollo de STORY-075, se usa un stub de ese contrato. El flujo base comprende cinco pasos: `resolver-versión → resolver-rama → ejecutar-git → crear-pr → modificar-story`. El modo manual intercepta en `ejecutar-git` y `crear-pr`; el modo dry-run simula todos los pasos sin ejecutarlos.

**Restricciones:**
- La secuencia de confirmaciones en modo manual es un requerimiento UX deliberado (opciones → versión → rama → PR → cancelación): el diseño la respeta y no puede reordenarse
- En modo manual: el usuario puede cancelar en cualquier punto sin que se produzcan cambios en el repositorio
- En modo dry-run: no se modifica `story.md` ni se crea/fusiona ningún PR
- Flags `--manual` y `--dry-run` son mutuamente excluyentes; sin flag = modo batch normal (STORY-074)

**Criterios de aceptación (para trazabilidad):**
- AC-1: Modo manual con guía interactiva (presentar opciones → confirmar versión → mostrar rama → confirmar PR → permitir cancelación)
- AC-2: Modo dry-run / simulación (mostrar pasos sin ejecutar, no crear PR, no modificar story.md, finalizar con mensaje de simulación completada)

---

## Goals / Non-Goals

**Goals:**
- Extender `.claude/skills/story-integrate/SKILL.md` con secciones de parsing de flags y flujos para `--manual` y `--dry-run`
- Definir el stub de `ejecutarIntegración` para testing independiente de STORY-074
- Documentar los puntos de interceptación del modo manual dentro del flujo base de STORY-074
- Crear ejemplos de sesión para ambos modos

**Non-Goals:**
- Modificar el flujo batch normal de STORY-074 — los cambios son aditivos (nuevas secciones al SKILL.md)
- Soporte de múltiples modelos de entrega en la selección de opciones — eso es STORY-076
- Persistir el historial de ejecuciones en modo dry-run — fuera de scope

---

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `story-integrate/SKILL.md` | modificar | `.claude/skills/story-integrate/SKILL.md` | AC-1, AC-2 |
| `stub-contract.md` | crear | `.claude/skills/story-integrate/assets/stub-contract.md` | AC-1, AC-2 |
| `example-manual-mode.md` | crear | `.claude/skills/story-integrate/examples/example-manual-mode.md` | AC-1 |
| `example-dry-run.md` | crear | `.claude/skills/story-integrate/examples/example-dry-run.md` | AC-2 |

---

## Interfaces

### ModeFlag — Parsing de flags // satisface: AC-1, AC-2

```
--manual    Activa modo manual con guía interactiva paso a paso
--dry-run   Activa modo simulación sin efectos reales
(sin flag)  Modo batch normal (comportamiento STORY-074)
```

Regla de exclusividad: si se proporcionan ambos flags simultáneamente, emitir error y detener:
```
❌ Los flags --manual y --dry-run son mutuamente excluyentes.
   Usa uno o el otro, no ambos.
```

### IntegrationPlan — Contrato del stub (STORY-074) // satisface: AC-1, AC-2

```typescript
// Stub a usar hasta que STORY-074 exponga su implementación real
ejecutarIntegración(historyId: string, opciones: { dryRun?: boolean }): Promise<IntegrationPlan>

// IntegrationPlan
{
  pasos: Array<{
    tipo: 'resolver-versión' | 'resolver-rama' | 'ejecutar-git' | 'crear-pr' | 'modificar-story',
    descripcion: string,   // descripción legible del paso (ej: "Crear PR feat/STORY-042 → release/v1.2.0")
    ejecutado: boolean     // false en el plan inicial; true tras ejecutar en modo real
  }>,
  completado: boolean
}
```

**Stub predefinido para testing:**
```
pasos = [
  { tipo: 'resolver-versión', descripcion: 'Leer versión desde .release-version → v1.2.0', ejecutado: false },
  { tipo: 'resolver-rama',    descripcion: 'Rama objetivo: release/v1.2.0', ejecutado: false },
  { tipo: 'ejecutar-git',     descripcion: 'Checkout feat/STORY-042 y push', ejecutado: false },
  { tipo: 'crear-pr',         descripcion: 'Crear PR feat/STORY-042 → release/v1.2.0', ejecutado: false },
  { tipo: 'modificar-story',  descripcion: 'Actualizar story.md con metadatos INTEGRATED', ejecutado: false }
]
```

### ConfirmationPoint — Puntos de interceptación en modo manual // satisface: AC-1

Los pasos de tipo `ejecutar-git` y `crear-pr` son puntos de confirmación. En cada uno, el skill:
1. Muestra la descripción del paso
2. Solicita `[s/n] ¿Confirmar?`
3. Si `n` (o cualquier entrada que no sea `s`): detener inmediatamente sin ejecutar ningún comando pendiente ni modificar story.md

---

## Flujos Clave

### Flujo modo manual — guía interactiva (AC-1)

```
1. Parsear --manual flag
2. Verificar exclusividad de flags
3. Obtener IntegrationPlan desde stub/contrato STORY-074
4. [PRESENTAR]  Mostrar opciones de modelo de entrega desde integration-config.yaml
5. [CONFIRMAR]  Solicitar confirmación de la versión del release leída
6. [MOSTRAR]    Mostrar rama objetivo calculada (target-branch) antes de ejecutar
7. Para cada paso del plan:
   a. Si tipo = 'ejecutar-git':
      → [CONFIRMAR] solicitar confirmación → si n → CANCELAR (sin cambios)
      → Si s → ejecutar
   b. Si tipo = 'crear-pr':
      → [CONFIRMAR] solicitar confirmación explícita → si n → CANCELAR (sin cambios)
      → Si s → ejecutar
   c. Cualquier otro tipo → ejecutar sin confirmación
8. Si completado sin cancelación → actualizar story.md (status: INTEGRATED)
```

**Comportamiento en cancelación:**
```
❌ Integración cancelada por el usuario.
   No se realizaron cambios en el repositorio ni en story.md.
```

### Flujo modo dry-run — simulación (AC-2)

```
1. Parsear --dry-run flag
2. Verificar exclusividad de flags
3. Llamar a ejecutarIntegración(historyId, { dryRun: true })
4. Mostrar encabezado: "🔍 Dry-run: pasos que se ejecutarían"
5. Para cada paso del plan:
   → Mostrar: "[paso N/5] {tipo}: {descripcion}"
   → NO ejecutar ningún comando
6. Finalizar: "✅ Simulación completada — no se realizaron cambios en el repositorio ni en story.md"
7. NO actualizar story.md
```

---

## Decisions

### D1 — Extensión aditiva del SKILL.md de STORY-074 vs skill nuevo // satisface: AC-1, AC-2

**Opción elegida:** Modificar `.claude/skills/story-integrate/SKILL.md` añadiendo secciones para parsing de flags y flujos modales. Los flujos existentes de STORY-074 no se modifican.

**Alternativas rechazadas:**
- Skill nuevo `story-integrate-manual.md` — duplica la lógica base de STORY-074; rompe la cohesión de un único punto de entrada para el comando `/story-integrate`
- Skill wrapper `story-integrate-modes.md` que invoca `story-integrate` — agrega un nivel de delegación innecesario (viola principio de un solo nivel)

**Justificación:** Los flags son parte natural de la interfaz del skill. La extensión aditiva respeta el principio de distancia intelectual mínima (P4): el usuario usa un solo comando con flags opcionales.

---

### D2 — Implementación de la cancelación en modo manual // satisface: AC-1

**Opción elegida:** Verificación de cancelación por input diferente de `s` (cualquier entrada que no sea `s`). Al cancelar: no ejecutar comandos pendientes, no modificar story.md, mostrar mensaje de cancelación.

**Alternativas rechazadas:**
- Cancelación solo en pasos específicos — el AC dice "en cualquier punto"; limitar los puntos de cancelación viola el requerimiento
- Ctrl+C como mecanismo de cancelación — no controlable desde el skill en Markdown; el mecanismo `[s/n]` es explícito y portable

**Justificación:** La cancelación "en cualquier punto" del AC se implementa verificando la respuesta en cada `ConfirmationPoint`. Solo dos pasos son puntos de confirmación (`ejecutar-git`, `crear-pr`), lo que satisface el AC sin interrumpir pasos informativos.

---

### D3 — Stub del contrato STORY-074 // satisface: AC-1, AC-2

**Opción elegida:** Documentar el stub como un `IntegrationPlan` predefinido hardcodeado en `assets/stub-contract.md` que el implementador usará hasta que STORY-074 exponga su contrato real.

**Alternativas rechazadas:**
- Esperar a STORY-074 para implementar STORY-075 — el story improvement ya documentó que es posible trabajar con stub; esperar crea bloqueo innecesario
- Mock dinámico (generar el plan desde story-id) — añade complejidad innecesaria; el stub predefinido es suficiente para verificar AC-1 y AC-2

**Justificación:** El stub predefinido permite desarrollar y probar ambos modos independientemente. Una vez que STORY-074 esté disponible, reemplazar el stub por la implementación real en un paso trivial.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El contrato real de STORY-074 difiere del stub documentado | El stub está en `assets/stub-contract.md` como referencia explícita; el cambio se limita a un único punto en SKILL.md |
| Modo manual en un skill Markdown: la interactividad depende del runtime Claude Code | Los pasos de confirmación `[s/n]` funcionan nativamente en modo manual de Claude Code; no requieren código ejecutable |
| El flag `--dry-run` puede confundirse con el modo dry-run de otros tools del proyecto | El flag es específico de `story-integrate`; documentado en los ejemplos con el contexto correcto |

---

## Open Questions

Ninguna — todas las ambigüedades están resueltas en este diseño o delegadas explícitamente a STORY-074/STORY-076.

---

## Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Modo manual presenta opciones de modelo de entrega al inicio | Ejecutar `story-integrate --manual --story-id STORY-042`; verificar que el primer output muestra modelos disponibles | AC-1 |
| 2 | Modo manual solicita confirmación de versión antes de mostrar rama | Verificar secuencia en SKILL.md: mostrar opciones → confirmar versión → mostrar rama | AC-1 |
| 3 | Modo manual muestra rama objetivo antes de ejecutar cualquier acción | Verificar que paso 'resolver-rama' se muestra antes del primer ConfirmationPoint | AC-1 |
| 4 | Cancelación en modo manual no produce cambios | Responder `n` en primer ConfirmationPoint; verificar que story.md no fue modificado y no existe PR nuevo | AC-1 |
| 5 | Modo dry-run muestra todos los pasos sin ejecutarlos | Ejecutar `story-integrate --dry-run --story-id STORY-042`; verificar output lista los 5 pasos del plan | AC-2 |
| 6 | Modo dry-run NO modifica story.md | Comparar frontmatter de story.md antes y después de dry-run; deben ser idénticos | AC-2 |
| 7 | Modo dry-run finaliza con mensaje de simulación completada | Verificar que el último output contiene "Simulación completada — no se realizaron cambios" | AC-2 |
| 8 | Flags --manual y --dry-run son mutuamente excluyentes | Ejecutar con ambos flags; verificar mensaje de error y detención | AC-1, AC-2 |

---

## Registro de Cambios (CR)

Sin CRs detectados.
