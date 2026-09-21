---
alwaysApply: false
type: tasks
id: STORY-099
slug: STORY-099-sddf-init-level-full-tasks
title: "Tasks: Inicializar la memoria completa desde sddf-init con el parámetro --level"
date: 2026-09-21
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-099
design: STORY-099
related:
  - STORY-099-sddf-init-level-full
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-054-inicializar-entorno-sddf
  - memory-system
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (4 ACs, 4 NFRs);
> D-n a las decisiones; F-n a los flujos; V-n a los contratos de verificación; CR-n a los
> cambios registrados. Orden: evals (RED) → SKILL.md de sddf-init → documentación →
> verificación. Precondición blanda: `memory-system scaffold --yes` (STORY-096); sin él, el
> nivel full degrada a standard con aviso (D-2, V-7).

## 1. Evals (fase RED)

- [ ] T001 Añadir a skills/sddf-init/evals/evals.json, sin modificar los casos existentes,
  los casos: `--level minimal` (contiene `[OMITIDO] project-policies-generation (nivel
  minimal)`, `sddf.config.yaml` y `.env.template`; no contiene `templates/story-template.md`
  ni `¿Deseas inicializar los documentos de políticas`); `--level full` (contiene
  `── memory-system scaffold (nivel full) ──`, `creados:` y `[PRESERVADO] docs/templates/
  story-template.md`); `--level full` sin memory-system instalado (contiene `memory-system
  no está instalado — nivel full termina como standard`; no contiene `creados:`); `--level
  foo` (contiene `--level no admitido: foo`; no contiene `[CREADO]`); `--level full` ×2
  (segunda corrida contiene `[YA EXISTÍA]` y `creados: 0`, no contiene `[ERROR]`) — AC-1,
  AC-2, AC-3, NFR-1, NFR-2, D-5, V-2, V-4, V-5, V-6, V-7.

## 2. SKILL.md de sddf-init

- [ ] T002 Añadir a skills/sddf-init/SKILL.md la sección "Parámetros" con `--level
  minimal|standard|full` (default `standard`), la tabla de pasos por nivel de D-1 y la
  validación previa al Paso 1: `❌ --level no admitido: <valor>. Valores válidos: minimal,
  standard, full.` sin escrituras — AC-2, AC-3, AC-4, NFR-1, D-1, F-4.
- [ ] T003 Modificar el Paso 5 para que en `minimal` se omita sin preguntar y registre
  `[OMITIDO] project-policies-generation (nivel minimal)`; en `standard` y `full` sin
  cambios — AC-2, D-4, F-3.
- [ ] T004 Añadir el Paso 5b (solo `full`, tras el Paso 5): comprobar
  `$CLI_ROOT/skills/memory-system/SKILL.md`; si falta, `⚠️ memory-system no está instalado
  — nivel full termina como standard` y continuar; si existe, invocar inline el skill
  `memory-system` en modo `scaffold --yes` y capturar su informe completo — AC-1, D-2, D-3,
  F-1, F-4, CR-003.
- [ ] T005 Modificar el Paso 6 para emitir el informe compuesto de D-2: bloque `── sddf-init
  ──`, en `full` el bloque `── memory-system scaffold (nivel full) ──` con el informe
  capturado tal cual, y la línea de cierre con `(nivel <n>)`; anotar que los `[PRESERVADO]`
  de los cinco templates en el bloque de scaffold son esperados — AC-1, NFR-3, D-2, CR-001.
- [ ] T006 Revisar el diff de skills/sddf-init/SKILL.md: los Pasos 1, 2, 2b, 3 y 4 no cambian
  de contenido; el cambio se limita a Parámetros, tabla de niveles, Paso 5 (omisión en
  minimal), Paso 5b e informe; comprobar < 500 líneas — AC-4, V-8.
- [ ] T007 Ejecutar `npm run test:eval -- sddf-init` y ajustar SKILL.md hasta que los casos
  existentes y los de T001 pasen — V-2…V-7.

## 3. Documentación y trazabilidad

- [ ] T008 [P] Actualizar docs/guides/sddf-commands-pipeline.md ("Configuración" y §0):
  los tres niveles, `sddf-init --level full` como comando recomendado para proyectos
  nuevos, `minimal` para CI (sin pregunta interactiva) y el orden 5 → 5b — NFR-4, D-4, D-6.
- [ ] T009 [P] Actualizar README.md (fila "Preparar un repositorio" → `/sddf-init [--level
  …]`, párrafo de onboarding) y CHANGELOG.md 3.3.0 (Added `--level` en `sddf-init`) —
  NFR-4, D-6.
- [ ] T010 Retroalimentar story.md con CR-002 (en `full`, el scaffold se ejecuta después de
  la pregunta de políticas) — CR-002.

## 4. Verificación de extremo a extremo

- [ ] T011 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/sddf-init
  (bloques Python en 0, greps sin salida) — V-10.
- [ ] T012 Ejecutar la verificación sugerida de story.md en directorios temporales:
  `/sddf-init --level full` produce el mismo listado de archivos que `/sddf-init` +
  `/memory-system scaffold`; `/sddf-init` sin argumentos produce el mismo informe que la
  versión anterior; `/sddf-init --level minimal` no copia templates ni pregunta por
  políticas — AC-1, AC-2, V-1, V-3, V-4.
- [ ] T013 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-4, V-9.
