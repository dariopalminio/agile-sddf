---
alwaysApply: false
type: tasks
id: STORY-163
slug: STORY-163-story-delivery-dry-run-y-force-tasks
title: "Tasks: story-delivery: --dry-run y --force"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-163
design: STORY-163
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-163-story-delivery-dry-run-y-force
  - STORY-163-story-delivery-dry-run-y-force-design
---

<!-- Referencias -->
[[STORY-163-story-delivery-dry-run-y-force]] · [[STORY-163-story-delivery-dry-run-y-force-design]]

> Precondición de implementación (CR-003): `skills/story-delivery/` existe porque STORY-159 ya se implementó. Si STORY-162 se implementó antes, respetar su Paso 2 y sus casos de evals.

## 1. Setup y pruebas primero (RED)

- [ ] T001 Comprobar la precondición CR-003: existen `skills/story-delivery/SKILL.md`, `README.md` y `evals/evals.json`; anotar el último `TC-NNN` de `evals.json` y la numeración real de pasos del SKILL.md para anclar los cambios a los gates (estado, modelo, DoD, confirmación) y no a números de paso (Risks). Hecho: se conoce el primer ID libre (TC-007 si STORY-162 no añadió casos) y el paso donde vive cada gate.
- [ ] T002 [P] Añadir a `skills/story-delivery/evals/evals.json`, con IDs consecutivos desde el primero libre, los siete casos del esquema de datos de design.md con sus `expected.contains`/`not_contains`: dry-run sin bloqueos (AC-1 fila 1, CNF-1), dry-run con bloqueos `VERIFY/DONE` + DoD incumplido (AC-1 fila 2), dry-run + force (D-1), force confirmado con `delivery-report.md` (estado previo, criterio incumplido, fecha de hoy) (AC-2), force rechazado sin sugerencia ni reporte (CNF-2, AC-3), sugerencia por estado (AC-3) y sugerencia por DoD (AC-3) (C-3). Hecho: `node scripts/verify-eval-inventory.js` acepta todos los IDs (`TC-\d{3,}`) y no hay duplicados.
- [ ] T003 [P] En el caso de rechazo del usuario de STORY-159 (TC-004) añadir `--force` a `expected.not_contains` (C-3, D-7, AC-3 «Pero»). Hecho: el caso falla si el rechazo sugiere `--force`.

## 2. Skill story-delivery: modos y gates (componente central)

- [ ] T004 Actualizar el frontmatter de `skills/story-delivery/SKILL.md`: `outputs` = `[story.md (frontmatter actualizado), delivery-report.md (solo con --force y gates omitidos)]` y `triggers` con «dry-run de entrega» y «forzar entrega»; en `## Parámetros` documentar `--dry-run` y `--force` (orden libre) y en `## Modos de ejecución` la tabla de cuatro modos de D-1 (`interactivo`, `forzado`, `previsualización`, `previsualización forzada`) (C-1, D-1, D-9). Hecho: las tres secciones describen ambos flags y la combinación.
- [ ] T005 En `## Restricciones / Reglas` añadir: «`--dry-run` nunca crea, modifica ni borra archivos, tampoco en `.tmp/`» (CNF-1); «`--force` solo omite el gate de estado y el de DoD incumplido; nunca la confirmación final ni los errores de configuración» (CNF-2, D-3); y la línea única de sugerencia `→ Para entregar igualmente: /story-delivery STORY-NNN --force (el override queda en delivery-report.md). Para previsualizar: --dry-run.` (D-7) (C-1). Hecho: la línea de sugerencia aparece definida una sola vez.
- [ ] T006 Añadir el «Paso 0b — Resolver modo» tras el Paso 0 (sin tocar el bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->`): resuelve el modo con la tabla de D-1 y detiene con `❌ Flag no reconocido: <flag>. Flags válidos: --dry-run, --force` ante un flag desconocido (C-1, D-1). Hecho: ningún paso posterior lee los flags directamente, solo el modo.
- [ ] T007 Modificar el gate de estado (Paso 1) según D-2 y D-3: `interactivo` bloquea con el mensaje del diseño base + la línea de sugerencia; `forzado` emite `⚠️ --force: se omite la precondición ACCEPTANCE/DONE (estado actual: <status>/<substatus>)`, guarda `estado_previo` y continúa; `previsualización` registra el bloqueo `estado` y continúa; el rechazo de `specs/flow/archive/` no cambia en ningún modo (C-1, AC-1, AC-2, AC-3). Hecho: con `VERIFY/DONE` solo el modo `interactivo` se detiene en este paso.
- [ ] T008 Dejar explícito en los gates de `delivery-model` (Paso 2) y de DoD ausente (Paso 3) que fallan cerrado en todos los modos y no muestran la línea de sugerencia; añadir que la afirmación de despliegue de `continuous` (STORY-162), si existe, es una confirmación humana que `--force` no omite (C-1, D-3, F-5, CR-001). Hecho: ninguno de los dos mensajes contiene `--force`.
- [ ] T009 Modificar la evaluación del DoD (Paso 4) según D-4: en `previsualización` (con o sin `--force`) un criterio `comando` solo se ejecuta si el comando citado lleva `--dry-run`; si no, estado `⏸ no evaluado (dry-run)` y evidencia `se ejecutaría: <comando>`; añadir `⏸` al enum de estados de la tabla de salida; las preguntas de `confirmación` se hacen en todos los modos (C-1, D-2, D-4, CNF-1). Hecho: aplicado al DoD actual, `npm pack --dry-run` se ejecuta en dry-run y ningún otro comando se lanza.
- [ ] T010 Modificar la decisión (Paso 5) según D-2, D-3, D-6 y D-7: `interactivo` con ❌ y `enforcement: error` → mensaje de bloqueo + línea de sugerencia; `forzado` con ❌ → `⚠️ --force: se omiten <N> criterio(s) incumplidos del DoD` + lista; `forzado` sin gates omitidos → `ℹ️ --force no fue necesario: no se omitió ningún gate.` y pregunta del diseño base; `forzado` con gates omitidos → `¿Confirmas la entrega FORZADA de STORY-NNN a DELIVER/DONE omitiendo <gates>? (s/n)`; rechazo en cualquier modo → `Entrega cancelada por el usuario. story.md no cambió.` sin sugerencia; `previsualización` no pregunta y pasa al Paso 7 (C-1, AC-2, AC-3, CNF-2). Hecho: la pregunta final aparece en `forzado` y nunca en `previsualización`.

## 3. Registro del override y previsualización

- [ ] T011 [P] Crear `skills/story-delivery/assets/delivery-report-template.md` con el frontmatter de D-5 (`type: delivery-report`, `id`, `slug: <slug-historia>-delivery-report`, `title`, `story`, `created`, `updated`, `related`; **sin** `verdict`), el enlace `[[<slug-historia>]]` y la sección repetible `## Override <n> — <YYYY-MM-DD>` con `Fecha del override`, `Estado previo`, `Estado escrito: DELIVER/DONE`, `Gates omitidos`, tabla `| # | Criterio | Evidencia |` de criterios incumplidos (`Ninguno` si solo se omitió el estado), `Criterios no aplicables` y `Confirmado por` (C-2, D-5, AC-2). Hecho: el template no contiene `APROBADA`, `Aprobada`, `review-status` ni `verdict`.
- [ ] T012 Modificar la escritura (Paso 6) según D-8 para `forzado` con gates omitidos: (1) leer el template —si falta, detener **antes** de la confirmación final con `❌ No se encontró assets/delivery-report-template.md: no se puede registrar el override. story.md no cambió.` (mover esta comprobación al Paso 5, F-4)—; (2) crear `delivery-report.md` o añadir `## Override <n+1>` y actualizar `updated:` si ya existe, sin reescribir secciones previas; si existe y no se puede ampliar → `❌ delivery-report.md existe pero no se puede ampliar: <motivo>. story.md no cambió.`; (3) escribir `story.md` como en el diseño base; si falla, borrar el reporte recién creado o restaurar su contenido previo y emitir `❌ No se pudo escribir story.md. Se deshizo delivery-report.md; el estado no cambió.`; (4) mensaje `✅ STORY-NNN entregada (forzada): DELIVER/DONE — override registrado en <ruta>/delivery-report.md` + `/story-complete STORY-NNN` (C-1, D-5, D-8, F-4, AC-2). Hecho: no existe camino en que `story.md` quede en `DELIVER/DONE` forzado sin sección de override.
- [ ] T013 Añadir el «Paso 7 — Mostrar la previsualización» (solo en `previsualización`, sustituye al Paso 6): imprime la acción de la tabla de D-2 según bloqueos y `--force`, el aviso `ℹ️ <N> criterio(s) no evaluados en dry-run…` si hubo `⏸`, el aviso de template ausente si aplica (F-4) y el cierre fijo `🔍 Dry-run: no se creó, modificó ni borró ningún archivo.` (C-1, D-2, AC-1, CNF-1). Hecho: el paso no contiene ninguna instrucción de escritura.
- [ ] T014 Actualizar `## Salida` del SKILL.md: `story.md` (frontmatter, solo tras confirmación), `delivery-report.md` (solo `forzado` con gates omitidos, append-only) y la garantía de que `previsualización` no escribe (C-1, D-9). Hecho: la sección coincide con `outputs` del frontmatter.
- [ ] T015 [P] Actualizar `skills/story-delivery/README.md`: uso de `--dry-run`, `--force` y su combinación, qué omite `--force` (D-3), cuándo se crea `delivery-report.md` (D-5, D-6); retirar el texto que presentaba los flags como extensión prevista (C-4). Hecho: el README no describe como pendiente nada que esta historia implementa.

## 4. Documentación de dominio y guías (CR-002)

- [ ] T016 [P] `docs/domains/domain-story-lifecycle.md` §4.3: añadir la fila **Entrega forzada** — `* → DELIVER/DONE` desde cualquier historia no archivada, vía `/story-delivery --force`, con confirmación humana y override registrado en `delivery-report.md`; no tocar el diagrama de §4.2 (C-5, CR-002). Hecho: `grep -n "forzada" docs/domains/domain-story-lifecycle.md` devuelve la fila.
- [ ] T017 [P] `docs/guides/sddf-commands-pipeline.md`: en la fila `deliver` que dejó STORY-159 añadir `[--dry-run] [--force]` y que `delivery-report.md` solo se genera con override (C-6). Hecho: la fila menciona ambos flags.

## 5. Verificación

- [ ] T018 Verificar CNF-1 manualmente sobre una historia de prueba: `git status --porcelain` idéntico antes y después de `/story-delivery <id> --dry-run` y de `--dry-run --force`, sin archivos nuevos en `.tmp/` (Contratos 1 y 3).
- [ ] T019 Ejecutar `npm test` y `npm run verify:repository` y corregir hasta verlos en verde (incluye `verify-validation-contract` sobre el template, `verify-fixed-layout`, `verify-eval-inventory` y `check-doc-links`) (Contratos 7 y 9, CNF-3).
- [ ] T020 Ejecutar a criterio humano `npm run test:eval -- story-delivery` y revisar los siete casos nuevos y TC-004 modificado (AC-1, AC-2, AC-3, CNF-1, CNF-2; ejecución manual por cuota, regla de `AGENTS.md`) (Contratos 1–6).
- [ ] T021 Ejecutar `graphify update .` para refrescar el grafo tras los cambios.
