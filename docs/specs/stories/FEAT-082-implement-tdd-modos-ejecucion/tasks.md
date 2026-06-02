---
alwaysApply: false
type: tasks
id: FEAT-082
slug: FEAT-082-implement-tdd-modos-ejecucion-tasks
title: "Tasks: story-implement — modos interactivo y automático de ejecución del ciclo TDD"
date: 2026-05-30
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
story: FEAT-082
design: FEAT-082
related:
  - FEAT-082-implement-tdd-modos-ejecucion
  - FEAT-078-implement-tdd-fase-red
  - FEAT-081-implement-tdd-fase-green-refactor
---

<!-- Referencias -->
[[FEAT-082-implement-tdd-modos-ejecucion]]

## 1. Setup — Evals antes de implementar (TDD)

- [x] 1.1 Extender `.claude/skills/story-implement/evals/evals.json` con tres casos nuevos: TC-007 (modo interactivo sin `--auto` → Pause-1 muestra resumen RED y pregunta "¿Continuar con la Fase GREEN? (s/n)", Pause-2 hace lo mismo tras GREEN — AC-1), TC-008 (modo `--auto` → ciclo completo sin pausas + resumen consolidado de 3 fases al finalizar — AC-2), TC-009 (modo `--auto` + error en cualquier fase → detiene sin prompt, reporta error con detalle de fase — AC-3) — D-7

## 2. Implementación — Extender SKILL.md con modos de ejecución

- [x] 2.1 Actualizar frontmatter del SKILL.md: añadir `--auto` al campo `input`; añadir `"modo automático"` e `"--auto"` al array `triggers`; actualizar campo `description` para mencionar modos interactivo y automático — D-7
- [x] 2.2 Agregar Paso 0b al SKILL.md (después del Paso 0 de preflight): leer argumentos de invocación; si `--auto` está presente → `$EXEC_MODE = auto`; si ausente → `$EXEC_MODE = interactive` (predeterminado); emitir `[INFO] Modo de ejecución: {$EXEC_MODE}` — D-1, AC-1, AC-2
- [x] 2.3 Insertar bloque Pause-1 en SKILL.md (entre Paso 6 "escribir red-phase-status.json" y Paso 7 "verificar precondición GREEN"): si `$EXEC_MODE = interactive` → mostrar resumen Fase RED (tipos generados, estado rojo); preguntar "¿Continuar con la Fase GREEN? (s/n)"; si 'n' → emitir `🛑 Ciclo TDD pausado por el usuario tras Fase RED` y terminar limpio; si 's' o Enter → continuar; entrada inválida → repetir una vez más, si vuelve a ser inválida → asumir 'n'; si `$EXEC_MODE = auto` → saltar bloque sin mostrar nada — D-2, D-3, AC-1
- [x] 2.4 Insertar bloque Pause-2 en SKILL.md (entre Paso 9b "confirmación estado GREEN" y Paso 10 "Fase REFACTOR"): si `$EXEC_MODE = interactive` → mostrar resumen Fase GREEN (archivos generados, todos los tests pasan); preguntar "¿Continuar con la Fase REFACTOR? (s/n)"; misma lógica de respuesta que Pause-1; si `$EXEC_MODE = auto` → saltar bloque — D-2, D-3, AC-1
- [x] 2.5 Actualizar Paso 11 del SKILL.md (resumen final): añadir rama para `$EXEC_MODE = auto` → mostrar resumen consolidado del ciclo completo con estado de las 3 fases (`✅ Fase RED`, `✅ Fase GREEN`, `✅ Fase REFACTOR`) y ruta de `cycle-status.json`; la rama `interactive` muestra el mismo resumen pero ya lo vio fase a fase en las pausas — D-4, AC-2
- [x] 2.6 Extender tabla "Manejo de errores" del SKILL.md con los casos nuevos: usuario responde 'n' en Pause-1 o Pause-2 (`🛑 Ciclo TDD pausado por el usuario tras Fase {fase}` → terminar sin error), entrada inválida en pausa (repetir pregunta → asumir 'n'), error en modo `--auto` (mismos mensajes ❌ de FEAT-078/081 pero sin prompt de confirmación posterior) — D-3, D-5, AC-3

## 3. Verificación — Validar escenarios de los ACs

- [x] 3.1 [P] Verificar eval TC-007 (modo interactivo, happy path): invocación sin `--auto` → Pause-1 solicita confirmación antes de GREEN (respuesta 's'), Pause-2 solicita confirmación antes de REFACTOR (respuesta 's'), ciclo completa con las 3 fases — AC-1
- [x] 3.2 [P] Verificar eval TC-008 (modo `--auto`, happy path): invocación con `--auto` → ningún bloque Pause-1 ni Pause-2 se ejecuta, ciclo completa sin interrupciones, resumen consolidado de 3 fases mostrado al finalizar — AC-2
- [x] 3.3 [P] Verificar eval TC-009 (modo `--auto` con error): invocación con `--auto`, error simulado en Fase GREEN → detiene sin mostrar prompt de confirmación al usuario, mensaje ❌ con nombre del skill y detalle de la fase fallida — AC-3
