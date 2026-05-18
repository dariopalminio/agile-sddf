---
type: tasks
id: FEAT-075
slug: FEAT-075-integrar-historia-modo-manual-dryrun-tasks
title: "Tasks: story-integrate — Modos de ejecución manual y dry-run"
story: FEAT-075
design: FEAT-075
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-075-integrar-historia-modo-manual-dryrun
  - FEAT-074-integrar-historia-batch-configurable
---

[[FEAT-075-integrar-historia-modo-manual-dryrun]]

## 1. Setup / Scaffolding

- [ ] T001 Verificar que `.claude/skills/story-integrate/SKILL.md` existe (creado en FEAT-074); si no existe usar stub mínimo con estructura base para desarrollar sobre él

## 2. Core — Extensión de SKILL.md

- [ ] T002 Añadir sección de parámetros extendidos en SKILL.md: documentar `--manual` y `--dry-run` junto al `--story-id` existente, incluyendo descripción y regla de exclusividad mutua
- [ ] T003 Añadir Paso de parsing y validación de flags: verificar que no se usen `--manual` y `--dry-run` simultáneamente; emitir error `❌ Los flags --manual y --dry-run son mutuamente excluyentes.` y detener si ambos presentes
- [ ] T004 Añadir flujo completo del modo manual en SKILL.md:
  - Paso M1: mostrar opciones de modelo de entrega disponibles desde `integration-config.yaml`
  - Paso M2: solicitar confirmación de la versión del release leída (`[s/n] ¿Confirmar versión <version>?`)
  - Paso M3: mostrar rama objetivo calculada antes de ejecutar cualquier acción
  - Paso M4: iterar sobre pasos del IntegrationPlan; en pasos `ejecutar-git` y `crear-pr` pedir confirmación `[s/n]`; si respuesta `n` → mostrar mensaje de cancelación y detener sin cambios
  - Paso M5: si completado sin cancelación → actualizar `story.md` con status INTEGRATED
- [ ] T005 Añadir flujo completo del modo dry-run en SKILL.md:
  - Paso D1: llamar a `ejecutarIntegración(historyId, { dryRun: true })` (stub o real)
  - Paso D2: mostrar encabezado `🔍 Dry-run: pasos que se ejecutarían`
  - Paso D3: para cada paso del IntegrationPlan mostrar `[N/5] {tipo}: {descripcion}` sin ejecutar
  - Paso D4: mostrar `✅ Simulación completada — no se realizaron cambios en el repositorio ni en story.md`
  - Paso D5: NO actualizar `story.md` (verificación explícita al final del flujo)
- [ ] T006 Añadir stub del contrato `ejecutarIntegración` como fallback en SKILL.md: si FEAT-074 no está disponible o no exporta el contrato, usar el IntegrationPlan predefinido de `assets/stub-contract.md`

## 3. Assets — Stub y documentación

- [ ] T007 Crear `assets/stub-contract.md` con: definición de `IntegrationPlan`, el IntegrationPlan predefinido de 5 pasos para `FEAT-042` (resolver-versión, resolver-rama, ejecutar-git, crear-pr, modificar-story), instrucciones para reemplazar el stub cuando FEAT-074 exponga su contrato real

## 4. Examples

- [ ] T008 [P] Crear `examples/example-manual-mode.md`: sesión completa de `story-integrate --manual --story-id FEAT-042` mostrando la secuencia de prompts (opciones → confirmación versión → rama mostrada → confirmación PR → completado) y el frontmatter resultante de story.md con status INTEGRATED
- [ ] T009 [P] Crear `examples/example-dry-run.md`: sesión completa de `story-integrate --dry-run --story-id FEAT-042` mostrando el listado de 5 pasos del plan y el mensaje de simulación completada; incluir comparación del frontmatter de story.md antes/después (sin cambios)

## 5. Verificación de criterios de aceptación

- [ ] T010 Verificar AC-1 — revisar SKILL.md modo manual: la secuencia es opciones → versión → rama → PR → cancelación; cada ConfirmationPoint está en `ejecutar-git` y `crear-pr`; la cancelación con `n` detiene sin cambios
- [ ] T011 Verificar AC-1 seguridad — confirmar que en modo manual, antes de cada acción irreversible (`crear-pr`, fusión) hay un paso de confirmación explícita del usuario
- [ ] T012 Verificar AC-2 — revisar SKILL.md modo dry-run: los 5 pasos del plan se muestran sin ejecutar; story.md no se modifica; el mensaje final incluye "no se realizaron cambios"
- [ ] T013 Verificar exclusividad de flags — confirmar que SKILL.md tiene validación explícita de flags mutuamente excluyentes con mensaje de error correcto (CRV-8 del design.md)
