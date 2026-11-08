---
alwaysApply: false
type: tasks
id: STORY-179
slug: STORY-179-review-md-de-agile-sddf-tasks
title: "Tasks: REVIEW.md de agile-sddf"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-179
design: STORY-179
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-179-review-md-de-agile-sddf
  - STORY-179-review-md-de-agile-sddf-design
---

<!-- Referencias -->
[[STORY-179-review-md-de-agile-sddf]] · [[STORY-179-review-md-de-agile-sddf-design]]

> Alcance: solo se crean `REVIEW.md` en la raíz y `test/review-md.test.js`. No se tocan la plantilla, los agentes de `story-code-review`, `package.json`, `.gitignore`, `docs/` ni `scripts/` (design.md, Non-Goals y contrato 12).

## 1. Precondición y prueba primero (RED)

- [ ] T001 Comprobar el estado de partida que cita design.md (Context): `REVIEW.md` no existe; `docs/templates/REVIEW-template.md` conserva el H1, las líneas 21-22 y los cuatro encabezados `##` de I-1; `scripts/verify-repository.js:12-31` tiene los 14 pasos de D-4; `verify-validation-contract.js:300-303` revisa los `*.md` de la raíz; y `.gitignore` ignora `.claude`, `.github/*`, `.agents`, `.tmp`, `node_modules` y `graphify-out/`. Comprobar también si existe `docs/adr/ADR-0021-*.md` y si su tabla de vocabulario coincide con la línea 22 de la plantilla (F-1 paso 1). Si no existe o difiere, aplicar F-3 (CR-001) y anotarlo para `implement-report.md`. Hecho: se conoce el estado de ADR-0021 y cualquier desplazamiento de línea está anotado.
- [ ] T002 Crear `test/review-md.test.js` con `node:test` y `node:assert`, leyendo `REVIEW.md` desde la raíz del repositorio como `test/epic-complete.test.js`, con las ocho aserciones de D-7: (1) estructura de I-1: H1 exacto, cuatro `##` literales en orden, sin `<!--` y sin placeholders entre corchetes; no cuentan como placeholder `[ ]` ni `[texto](url)`; (2) seis viñetas de primer nivel en «Qué es «Importante» aquí», con los prefijos de I-2 en orden; (3) «Tope de nits» contiene `Máximo **5**`; (4) cada marcador de la tabla de D-3 aparece en su sección y en ninguna otra; (5) cada sección tiene al menos un par término-traducción de I-3 (`🔴 Important`/`HIGH/MEDIUM`, `🟡 Nit`/`LOW`, `🟣 Pre-existing`/`PREEXISTENTE`) y ningún término aparece sin su traducción; (6) toda ruta de I-5 existe (`fs.existsSync`, con el prefijo anterior al primer `*` si es un glob) o `git check-ignore -q` la reconoce como ignorada; si `git` no está disponible, la aserción falla nombrando la ruta (F-3); (7) ninguna entrada de `package.json › files` es `REVIEW.md` ni un patrón que la alcance (`*.md`, `/`, `.`); (8) los bytes iniciales no son `EF BB BF` y el texto no contiene ningún code point de `ai-no-hidden-characters`, escritos como escapes `\u` en la prueba (C-2, D-7, D-8). Depende de T001. Hecho: `node --test test/review-md.test.js` falla porque `REVIEW.md` no existe (RED), y el propio archivo de prueba no contiene ningún carácter invisible literal.

## 2. REVIEW.md (componente central)

- [ ] T003 Crear `REVIEW.md` en la raíz copiando `docs/templates/REVIEW-template.md`. Borrar el comentario de uso (líneas 1-17) y todos los `<!-- instrucción … -->`. Sustituir `[nombre del proyecto]` por `agile-sddf` en el H1 y conservar sin cambios las líneas 21-22 y los cuatro encabezados `##` (C-1, I-1, D-1, AC-1). Hecho: el archivo tiene el H1, la introducción y los cuatro `##` en orden, y no contiene `<!--`.
- [ ] T004 Escribir «Qué es «Importante» aquí» según D-2: conservar la línea 29 de la plantilla; poner seis viñetas de primer nivel en el orden de I-2 (`` `skills/` ``, `` `scripts/` ``, `` `docs/adr/` ``, `` `docs/templates/` ``, `` `docs/guardrails/` ``, `Cualquier archivo`), con los defectos de la tabla de D-2 en subviñetas (4, 3, 1, 1, 1 y 2); y cerrar con las líneas 35-36 de la plantilla. Las subviñetas usan los marcadores literales de D-3 `delega en otro subagente`, `fuera de la ruta de` e `in place`. El secreto se describe como «real», sin citar `skills/*/examples/`. No incluir «carácter invisible» ni «rutas no portables a Windows» (C-1, D-2, D-3, AC-1, AC-2). Depende de T003. Hecho: las seis viñetas y las 12 subviñetas coinciden con D-2, y ningún marcador de «No reportar» ni de «Verificar siempre» aparece en esta sección.
- [ ] T005 Escribir «Tope de nits» según D-1 y el esqueleto: `Máximo **5** 🟡 Nit (LOW) por revisor`, seguido de las líneas 41-42 de la plantilla, sin la regla «Sin archivo:línea…» del borrador, que ya está en «Qué es «Importante» aquí» (C-1, D-1, AC-1, CNF-1). Depende de T004. Hecho: la sección tiene tres viñetas y ningún placeholder `[5]`.
- [ ] T006 Escribir «No reportar» con las seis viñetas de D-4, en su orden: (1) `npm run verify:repository` con sus 14 pasos nombrados en una línea; (2) copias de instalación como destinos de `config/runtimes.json` (p. ej. `.claude/`, `.github/skills/`, `.agents/`), que no se revisan ni sirven como **fuente de reglas**; (3) `.tmp/`, `graphify-out/` y `specs/flow/archive/` como artefactos generados e históricos; (4) datos falsos intencionados en `skills/*/examples/` y `skills/*/evals/`; (5) `node_modules/`; (6) líneas no tocadas → 🟣 Pre-existing (PREEXISTENTE). No listar el resto de destinos de runtime (C-1, D-4, D-3, AC-2, AC-3, CNF-1). Depende de T005. Hecho: los marcadores `fuente de reglas` y `skills/*/examples/` aparecen solo aquí, y los 14 pasos coinciden con `verify-repository.js:17-30`.
- [ ] T007 Escribir «Verificar siempre» según D-5: la línea `Un incumplimiento es 🔴 Important (HIGH/MEDIUM).` y cuatro casillas `- [ ]`: `ai-no-hidden-characters` por bytes en el alcance, con referencia al comando de `docs/guardrails/gr-ai-security-checklist.md`; `evals/evals.json` actualizado cuando cambia el comportamiento de un skill (principio 11); lista de runtimes no duplicada en `skills/` ni en `scripts/`, derivada de `config/runtimes.json`; skills, agentes y documentos en español, salvo los skills heredados en inglés (C-1, D-5, D-3, AC-2, AC-3, CNF-1). Depende de T006. Hecho: las cuatro casillas existen y los marcadores `ai-no-hidden-characters` y `evals/evals.json` aparecen solo en esta sección.
- [ ] T008 Revisar la redacción completa de `REVIEW.md` contra D-6: no contiene `APROBADA`, `Aprobada`, `review-status` ni `approved` en minúsculas; las rutas van entre comillas invertidas y no como enlaces Markdown; cada término de Claude Code Review va con su traducción (I-3); y se guarda en UTF-8 sin BOM (C-1, D-6, CNF-1, CNF-3). Depende de T007. Hecho: `grep -nE "APROBADA|Aprobada|review-status|approved" REVIEW.md` no devuelve nada.

## 3. Verificación (GREEN)

- [ ] T009 Ejecutar `node --test test/review-md.test.js`: pasan las ocho aserciones (contratos 1-4 y 7-10; AC-1, AC-2, AC-3, CNF-1, CNF-2, CNF-3). Depende de T002-T008. Hecho: salida en verde copiada a `implement-report.md`. Si una aserción falla, se corrige `REVIEW.md`, nunca la prueba (F-3), salvo un defecto demostrable de la prueba, que se registra.
- [ ] T010 [P] Revisar a mano las cuatro casillas de «Verificar siempre» contra los 14 pasos de `scripts/verify-repository.js:12-31` y los verificadores que invocan (`verify-eval-inventory.js`, `verify-runtime-documentation.js:17-27`): ninguna casilla nombra algo que el gate ya ejecuta. Confirmar también que la viñeta 1 de «No reportar» nombra los 14 pasos (contratos 5 y 6; AC-3). Hecho: cada casilla tiene en `implement-report.md` la razón por la que el gate no la cubre.
- [ ] T011 [P] Ejecutar `npm pack --dry-run --json` y confirmar que `REVIEW.md` no aparece en la lista de archivos (contrato 9; CNF-2). Ejecutar el comando `ai-no-hidden-characters` de `docs/guardrails/gr-ai-security-checklist.md:113` sobre `REVIEW.md` y `test/review-md.test.js`, y comprobar los bytes iniciales de ambos (distintos de `EF BB BF`) (contrato 10; CNF-3). Hecho: ninguna de las comprobaciones devuelve resultados, y queda registrado en `implement-report.md`.
- [ ] T012 Ejecutar `npm test` y `npm run verify:repository` (contrato 11; CNF-4). Si falla `contrato de validación`, aplicar F-3: reescribir la frase de `REVIEW.md`, sin relajar el verificador. Depende de T009. Hecho: ambos comandos terminan con código 0 y la salida resumida está en `implement-report.md`.
- [ ] T013 Ejecutar `git status --short` y `git diff --stat`: solo aparecen `REVIEW.md`, `test/review-md.test.js` y los artefactos de `specs/flow/STORY-179-review-md-de-agile-sddf/` (contrato 12; Non-Goals). Hecho: lista registrada en `implement-report.md`, sin cambios en los agentes, la plantilla ni `package.json`.
