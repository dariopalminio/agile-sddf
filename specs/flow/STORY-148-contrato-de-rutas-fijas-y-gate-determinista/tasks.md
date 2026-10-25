---
alwaysApply: false
type: tasks
id: STORY-148
slug: STORY-148-contrato-de-rutas-fijas-y-gate-determinista-tasks
title: "Tasks: Contrato de rutas fijas y gate determinista"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-148
design: STORY-148
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
---

<!-- Referencias -->
[[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista-design]]

## 1. Preparación

- [x] T001 Verificar la precondición: existe `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`; registrar si su `## Decisión` incluye el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, el texto canónico del bloque y la región `SDDF-LEGACY-DIAGNOSTIC` (CR-001). Si el ADR no está `ACCEPTED`, detener la implementación — design Risks, CR-001
- [x] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-148/baseline.txt` (línea base en verde); guardar también la lista de `ls skills/` (valor inicial de `PENDING_MIGRATION`) y la salida de `git grep -n "audit-root-resolution" -- ':!CHANGELOG.md' ':!docs/specs' ':!.tmp' ':!.temp'` (5 referencias esperadas: D-6) — design Context, contrato #2

## 2. Pruebas del validador (RED)

- [x] T003 Crear `test/verify-fixed-layout.test.js` con `node:test` y `node:assert/strict`, helper `fixture(t)` sobre `fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-layout-'))` con limpieza en `t.after`, y helper que escribe un árbol mínimo (`skills/<skill>/SKILL.md`, `skills/skill-preflight/SKILL.md` con «diagnóstico explícito», `.env.template` y los `ACTIVE_DOCS` de D-5) para los casos de `verifyFixedLayout` — D-7, CNF-3
- [x] T004 Añadir los casos de `checkSkillLayout` del contrato R1–R4: «Conforme» (bloque canónico de D-1 → `[]`), «Bloque legado» (`SDDF-ROOT-RESOLUTION: v1` en la línea N y `SPECS_BASE` en la M → mensajes con `skills/<skill>/SKILL.md:N` / `:M` y el token), «Sin marcador» (R1), «Bloque incompleto» sin `docs/guardrails/` (R2 nombra el token) y «Lectura de `root`» (R4 con línea) — D-1, D-7, AC-1, AC-2
- [x] T005 Añadir los casos de la región de diagnóstico: `SDDF_ROOT` dentro de `<!-- SDDF-LEGACY-DIAGNOSTIC:start -->`…`:end -->` en `skill-preflight` → sin error; fuera de la región → error R3 con línea; región en otro skill → error «solo se admite en skill-preflight» y la línea interna reportada; `start` sin `end` → error «sin cerrar» y la región no exime — D-3, D-7, AC-2
- [x] T006 Añadir los casos de `verifyFixedLayout` sobre fixture: skill legado en `pending` → sin error de layout y `warnings` con el aviso de pendientes; skill conforme en `pending` → error `ya cumple el contrato — retíralo de la lista`; entrada inexistente en `pending` → error `no existe en skills/`; skill legado fuera de `pending` → `errors.length > 0`; «Determinismo»: dos llamadas con `process.env.SDDF_ROOT` distinto (restaurado en `t.after`) devuelven resultados `deepEqual` — D-4, D-7, AC-1, AC-2, CNF-1
- [x] T007 Ejecutar `node --test test/verify-fixed-layout.test.js` y confirmar que falla por ausencia de `scripts/verify-fixed-layout.js` (RED); registrar la salida en `.tmp/story-implement/STORY-148/red.txt` — CNF-3

## 3. Validador del contrato de layout fijo (GREEN)

- [x] T008 Crear `scripts/verify-fixed-layout.js` (CommonJS `'use strict'`, solo `node:fs` y `node:path`, encabezado de uso como el script legado) con las constantes exportadas `LAYOUT_MARKER`, `REQUIRED_BLOCK_TOKENS`, `LEGACY_TOKENS`, `DIAGNOSTIC_SKILL` y `PENDING_MIGRATION` (los 36 nombres de `ls skills/` registrados en T002, en orden alfabético) — D-1, D-2, D-4, AC-1, AC-2, CNF-2
- [x] T009 Implementar `checkSkillLayout(name, content)` puro: R1 (línea exacta del marcador), R2 (bloque hasta el siguiente encabezado `#`–`######` o fin de archivo con los cuatro tokens; error con la línea del marcador), R3 y R4 línea a línea con número 1-based y un error por línea y token, y la región `SDDF-LEGACY-DIAGNOSTIC` de D-3 (efectiva solo en `skill-preflight`; errores de región en otro skill, sin cerrar o sin abrir) con los formatos de mensaje de D-1 y D-3 — D-1, D-3, AC-1, AC-2
- [x] T010 Trasladar desde `scripts/audit-root-resolution.js` los chequeos que D-5 conserva, sin cambiar su comportamiento: `read`, `rel`, `listSourceSkills`, `findStalePreflightClaim`, `collectSupportFiles`, `ACTIVE_DOCS`, la regla de `.env.template` sin `SDDF_ROOT=` asignado y las reglas de `skill-preflight` («diagnóstico explícito», sin `openspec/config.yaml`); no trasladar el marcador v1 obligatorio, la exigencia de `root:` ni el `[WARN]` de `ACTIVE_DOCS` sin `SDDF_ROOT` — D-5
- [x] T011 Implementar `verifyFixedLayout({ repoRoot, pending = PENDING_MIGRATION })`: listar skills en orden alfabético, omitir `checkSkillLayout` para los pendientes, aplicar los dos errores de higiene de la lista y el `[WARN]` de pendientes de D-4, ejecutar los chequeos de T010 y devolver `{ errors, warnings, skills, pending }`; sin leer `process.env` ni `sddf.config.yaml` — D-2, D-4, AC-1, AC-2, CNF-1
- [x] T012 Implementar el CLI bajo `if (require.main === module)`: `repoRoot = path.resolve(__dirname, '..')`, flags `--quiet` y `--json`, encabezado `── Contrato de layout fijo ──`, `[WARN]`/`[ERROR]` por línea, `[OK] Contrato de layout fijo verificado en <N> skill(s); <M> pendiente(s) de migración.` sin errores y `process.exitCode = 1` con errores; exportar `checkSkillLayout`, `verifyFixedLayout` y las constantes — D-2, AC-1, AC-2
- [x] T013 Ejecutar `node --test test/verify-fixed-layout.test.js` (GREEN) y `node scripts/verify-fixed-layout.js` sobre el repo real: exit 0, `[WARN]` con los 36 pendientes y `[OK] … 36 pendiente(s)` — contratos #1, #3, #4, #5, #6

## 4. Sustitución en el gate y referencias

- [x] T014 Editar `scripts/verify-repository.js`: sustituir el paso `{ label: 'resolución de raíces', … 'scripts/audit-root-resolution.js' }` por `{ label: 'contrato de layout fijo', command: process.execPath, args: ['scripts/verify-fixed-layout.js'] }` en la misma posición (3.º) — D-6, AC-1, AC-2
- [x] T015 [P] Editar `test/verify-repository.test.js`: label esperado `'resolución de raíces'` → `'contrato de layout fijo'` en la misma posición — D-6, CR-002
- [x] T016 [P] Editar `sddf.config.yaml`: `verify.integration.command` → `"node scripts/verify-fixed-layout.js"`; no tocar `root: docs` ni ninguna otra clave — D-6, AC-1
- [x] T017 [P] Editar `config/profiles.json`: en el stack `sddf-authoring`, `"node scripts/audit-root-resolution.js"` → `"node scripts/verify-fixed-layout.js"` con `required: true` igual — D-6, CR-002
- [x] T018 [P] Editar `test/profile-contract.test.js`: en la lista de `profileFixture`, `'scripts/audit-root-resolution.js'` → `'scripts/verify-fixed-layout.js'` — D-6, AC-1
- [x] T019 [P] Editar `package.json › scripts`: añadir `"verify:layout": "node scripts/verify-fixed-layout.js"` junto a los demás `verify:*`; no tocar `dependencies` — D-2, D-6, CNF-2
- [x] T020 Eliminar `scripts/audit-root-resolution.js` (tras T010 y T014–T018) y confirmar que `git grep -n "audit-root-resolution" -- ':!CHANGELOG.md' ':!docs/specs' ':!.tmp' ':!.temp'` no devuelve coincidencias — D-6, AC-2, contrato #9

## 5. Verificación

- [x] T021 Verificar AC-1 (skill conforme → gate verde): `npm test` → exit 0 incluyendo `test/verify-fixed-layout.test.js` (caso «Conforme») y `npm run verify:repository` → exit 0 con el paso `contrato de layout fijo` en verde — AC-1, CNF-3, CS-12, contratos #1, #2, #8
- [x] T022 Verificar AC-2 (skill legado → gate rojo con skill y línea): en una copia temporal del repo (`.tmp/story-implement/STORY-148/ac2/`, nunca en `skills/`), retirar un skill de `PENDING_MIGRATION` y ejecutar `node scripts/verify-fixed-layout.js` → exit 1 y `[ERROR] skills/<skill>/SKILL.md:<línea>: referencia legada …`; registrar la salida y descartar la copia. Confirmar en el test que la región de `skill-preflight` no se reporta — AC-2, contratos #3, #4, #5
- [x] T023 [P] Verificar CNF-1 y CNF-2: `grep -n "process.env" scripts/verify-fixed-layout.js` y `grep -n "sddf.config.yaml" scripts/verify-fixed-layout.js` no muestran lecturas de entorno ni de la configuración (solo literales del patrón R4); `git diff package.json` solo añade `verify:layout` — CNF-1, CNF-2, contratos #6, #7
- [x] T024 [P] Verificar perfiles y alcance: `npm run verify:profiles` y `node --test test/profile-contract.test.js` → exit 0; `git diff --stat` muestra solo los 9 archivos de «Componentes afectados» (más artefactos de la historia y, solo si aplica la rama de CR-001, `docs/guides/skill-structural-pattern.md`) y ningún `SKILL.md` — contratos #10, #11, Non-Goals
- [x] T025 Verificar encoding de los archivos creados o modificados (UTF-8 sin BOM: no empiezan con `EF BB BF`; sin `Ã`/`ðŸ`) y ejecutar `graphify update .` para refrescar el grafo — AGENTS.md
- [x] T026 Registrar en `implement-report.md` el resultado de T001 (si ADR-0016 incluye el marcador y el texto del bloque; si no, documentarlos en `docs/guides/skill-structural-pattern.md` según CR-001) y el estado de CR-002 para retroalimentar `story.md` — CR-001, CR-002
