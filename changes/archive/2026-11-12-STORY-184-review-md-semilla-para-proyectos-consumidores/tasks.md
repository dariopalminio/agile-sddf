---
alwaysApply: false
type: tasks
id: STORY-184
slug: STORY-184-review-md-semilla-para-proyectos-consumidores-tasks
title: "Tasks: REVIEW.md semilla para proyectos consumidores"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-184
design: STORY-184
created: 2026-11-08
updated: 2026-11-11
related:
  - STORY-184-review-md-semilla-para-proyectos-consumidores
  - STORY-184-review-md-semilla-para-proyectos-consumidores-design
---

<!-- Referencias -->
[[STORY-184-review-md-semilla-para-proyectos-consumidores]] · [[STORY-184-review-md-semilla-para-proyectos-consumidores-design]]

> Alcance: se crean `skills/sddf-constitution/assets/REVIEW-template.md` y `skills/sddf-constitution/evals/evals.json`, y se modifican `skills/sddf-constitution/SKILL.md`, `skills/sddf-constitution/README.md`, `config/eval-exemptions.json` y `test/sddf-constitution.test.js`. No se tocan `docs/templates/REVIEW-template.md`, `package.json`, `sddf-init`, `story-code-review` ni `scripts/` (design.md, Non-Goals).
>
> Orden obligatorio (CNF-3, principio 11): los evals (grupo 2) se escriben y validan antes de cambiar el skill (grupo 4).

## 1. Precondiciones

- [x] T001 Comprobar el estado de partida que cita design.md (Context): `skills/sddf-constitution/assets/` no tiene `REVIEW-template.md` y no existe `skills/sddf-constitution/evals/`; `config/eval-exemptions.json` solo exime a `sddf-constitution`; EV-003 de `test/sddf-constitution.test.js` (196-205) afirma la exención; en `skills/sddf-constitution/SKILL.md` el Paso 3 termina en «continuar con el Paso 4» (3a, 3b `n`, 3c), el Paso 4 es el registro en `CLAUDE.md`/`AGENTS.md` (4a-4c) y el Paso 5 es el resumen; `docs/templates/REVIEW-template.md` tiene los cuatro `##` de UT-002. Buscar con `grep -rn "sddf-constitution" test scripts` si alguna prueba o script fija el texto del `description` del frontmatter, o los números de paso del skill. Hecho: los desplazamientos de línea y cualquier restricción sobre `description` quedan anotados para `implement-report.md`.

## 2. Evals primero (CNF-3)

- [x] T002 Crear `skills/sddf-constitution/evals/evals.json` con `skill: "sddf-constitution"`, `version: "1.0.0"`, `story: "STORY-184"`, una `description` que diga expresamente que los casos cubren solo la semilla de `REVIEW.md` (no la constitución ni el DoD, CR-001) y los cuatro casos de la tabla de D-5 (TC-001 `crea-review-md-si-falta`, TC-002 `conserva-review-md-existente`, TC-003 `segunda-ejecucion-no-modifica-review-md`, TC-004 `plantilla-ausente-no-bloquea`). Cada caso con `id`, `name`, `type`, `description` (con el AC), `input: { context, flags: [] }`, `expected: { contains, not_contains }` con los literales exactos de I-4 y `threshold` (0.9), sin `sandbox` (formato de `skills/sddf-init/evals/evals.json`). UTF-8 sin BOM (C-4, D-5, I-4, AC-1, AC-2, AC-3, CNF-3, CNF-4). Depende de T001. Hecho: `node -e "JSON.parse(require('fs').readFileSync('skills/sddf-constitution/evals/evals.json','utf8'))"` no falla y los cuatro `id` son únicos.
- [x] T003 Retirar la exención de `sddf-constitution` de `config/eval-exemptions.json`, dejando `{ "version": 1, "exemptions": [] }` (C-5, D-5, CNF-3). Depende de T002. Hecho: `npm run verify:eval-inventory` termina en `[OK]` con 0 excepciones.

## 3. Pruebas deterministas (RED)

- [x] T004 Modificar `test/sddf-constitution.test.js` según D-6: (1) E2E-001 añade `assets/REVIEW-template.md` y `evals/evals.json` a `requiredArtifacts`; (2) reescribir EV-003 para que afirme que `inventory.errors` está vacío y que `sddf-constitution` está en `skills` pero no en `missing` ni en `exemptions` (actualizar también su título, que hoy habla de «exención temporal»); (3) IT-001 comprueba además que `assets/REVIEW-template.md` existe en el skill instalado de cada runtime; (4) UT-001 nuevo: igualdad byte a byte entre `skills/sddf-constitution/assets/REVIEW-template.md` y `docs/templates/REVIEW-template.md` (I-6), con un mensaje que nombre las dos rutas; (5) UT-002 nuevo: la plantilla del skill no empieza por `EF BB BF`, no contiene code points de `ai-no-hidden-characters` (escritos como escapes `\u`) y sus `##` empiezan, en orden, por `Qué es «Importante» aquí`, `Tope de Minor`, `No reportar` y `Verificar siempre`; (6) EV-005 nuevo: `SKILL.md` contiene `### Paso 4 — Sembrar REVIEW.md`, `assets/REVIEW-template.md`, `✅ Creado: REVIEW.md` y `ℹ️ Conservado: REVIEW.md (ya existe)`; `evals.json` tiene TC-001 a TC-004, TC-001 exige `✅ Creado: REVIEW.md`, TC-002 y TC-003 exigen `ℹ️ Conservado: REVIEW.md (ya existe)` y lo excluyen de `✅ Creado: REVIEW.md`, TC-004 exige `⚠️ Plantilla no encontrada: assets/REVIEW-template.md`, y el archivo no tiene BOM (C-6, D-6, AC-1, CNF-1, CNF-2, CNF-3, CNF-4). Depende de T003. Hecho: `node --test test/sddf-constitution.test.js` falla solo en E2E-001, IT-001, UT-001, UT-002 y EV-005, por la plantilla y el Paso 4 que faltan (RED); EV-003 ya pasa, y el archivo de prueba no contiene ningún carácter invisible literal.

## 4. Plantilla y skill (componentes centrales)

- [x] T005 Crear `skills/sddf-constitution/assets/REVIEW-template.md` como copia binaria de `docs/templates/REVIEW-template.md` (`cp`, sin pasar por un editor que reescriba la codificación ni los finales de línea) (C-1, D-1, I-3, CNF-1, CNF-4). Depende de T004. Hecho: `cmp` entre las dos rutas no devuelve nada, y UT-001 y UT-002 pasan.
- [x] T006 Insertar en `skills/sddf-constitution/SKILL.md`, entre el final del Paso 3c y el actual Paso 4, el **`### Paso 4 — Sembrar REVIEW.md`** con la estructura del Esquema de datos de design.md: propósito (guía de revisión inicial para `/story-code-review`, ADR de la guía de revisión); condición por existencia de `<REPO_ROOT>/REVIEW.md` (archivo, directorio o enlace), sin abrirlo, compararlo ni preguntar (I-2, D-3); copia literal de `assets/REVIEW-template.md`, sin frontmatter ni fecha (I-3, D-4); los cuatro mensajes literales de I-4 con la línea `   Edita sus [placeholders]: …` tras `✅ Creado: REVIEW.md`; que el paso se ejecuta siempre, en modo manual y automático, y nunca bloquea (F-3); y `Continuar con el Paso 5` (C-2, D-2, AC-1, AC-2, AC-3). Depende de T005. Hecho: el paso existe con los cuatro literales copiados de I-4 sin variaciones.
- [x] T007 Renumerar en `skills/sddf-constitution/SKILL.md` el antiguo `### Paso 4 — Registrar referencias en CLAUDE.md / AGENTS.md` a `### Paso 5` (subpasos `#### 4a`-`#### 4c` → `5a`-`5c`) y el antiguo `### Paso 5 — Resumen` a `### Paso 6`. Comprobar que las tres salidas del Paso 3 que dicen «continuar con el Paso 4» siguen igual, porque ahora apuntan a la semilla (D-2) (C-2). Depende de T006. Hecho: `grep -n "Paso [0-9]" skills/sddf-constitution/SKILL.md` muestra los Pasos 0-6 en orden, sin números duplicados ni referencias a un paso inexistente.
- [x] T008 Actualizar el resto de `skills/sddf-constitution/SKILL.md`: en el Paso 6, añadir el bloque `📝 Guía de revisión:` con `- REVIEW.md   [creado | conservado | no creado]` (I-5); en «Qué hace este skill», añadir que crea `REVIEW.md` desde `assets/REVIEW-template.md` si falta y nunca lo sobrescribe; en `## Entrada` y `## Dependencias`, añadir `assets/REVIEW-template.md`; en `## Salida`, añadir `REVIEW.md` en la raíz, creado solo si no existía; y en el frontmatter `description`, mencionar la semilla de `REVIEW.md` sin quitar ningún disparador existente, salvo que T001 haya encontrado una restricción que lo impida (C-2, AC-1, AC-2). Depende de T007. Hecho: EV-001 y EV-005 pasan y el frontmatter sigue siendo YAML válido.
- [x] T009 [P] Actualizar `skills/sddf-constitution/README.md`: en «What it does», una viñeta para la semilla de `REVIEW.md` (crea si falta, nunca sobrescribe); en `## Input`, la fila `assets/REVIEW-template.md`; en `## Output`, `REVIEW.md` en la raíz. Mantener la frase «Nunca sobrescribe un guardrail DoD existente» y añadir que tampoco sobrescribe `REVIEW.md` (C-3, AC-1, AC-2). Depende de T005. Hecho: el README describe solo lo que existe en el `SKILL.md` tras T008 (veracidad).

## 5. Verificación (GREEN)

- [x] T010 Ejecutar `node --test test/sddf-constitution.test.js`: pasan todos los casos, incluidos E2E-001, EV-003, IT-001, UT-001, UT-002 y EV-005 (contratos 1-5; AC-1, CNF-1, CNF-2, CNF-3, CNF-4). Depende de T005-T009. Hecho: salida en verde copiada a `implement-report.md`. Si una prueba falla, se corrigen el skill o la plantilla, nunca la prueba, salvo un defecto demostrable de la prueba, que se registra.
- [x] T011 [P] Ejecutar `npm pack --dry-run --json` y confirmar que lista `skills/sddf-constitution/assets/REVIEW-template.md` y `skills/sddf-constitution/evals/evals.json`, y que no lista `REVIEW.md` de la raíz (contrato 5; CNF-2). Hecho: resultado registrado en `implement-report.md`.
- [x] T012 [P] Ejecutar el comando `ai-no-hidden-characters` de `docs/guardrails/gr-ai-security-checklist.md` sobre la plantilla del skill, `evals.json`, `SKILL.md`, `README.md`, `config/eval-exemptions.json` y `test/sddf-constitution.test.js`, y comprobar que ninguno empieza por `EF BB BF` (contrato 10; CNF-4). Hecho: ninguna comprobación devuelve resultados.
- [x] T013 Verificar AC-2 a mano (contrato 6): en un directorio temporal del scratchpad, crear un proyecto con `docs/constitution.md`, los seis DoD y un `REVIEW.md` propio; calcular su SHA-256; ejecutar `/sddf-constitution` respondiendo `n` a cada pregunta; volver a calcular el hash. Repetir en un proyecto sin `REVIEW.md` dos veces seguidas (AC-1 y AC-3, SMOKE-4): la primera muestra `✅ Creado: REVIEW.md` y el archivo es igual a la plantilla; la segunda muestra `ℹ️ Conservado: REVIEW.md (ya existe)` y el hash no cambia. Depende de T008. Hecho: hashes y mensajes registrados en `implement-report.md` como evidencia de AC-1, AC-2, AC-3 y SMOKE-4.
- [x] T014 Ejecutar `npm test` y `npm run verify:repository` (contrato 9; CNF-2, CNF-3, CNF-4). Depende de T010. Hecho: ambos terminan con código 0 y la salida resumida está en `implement-report.md`.
- [x] T015 Dejar anotado en `implement-report.md` el comando `npm run test:eval -- sddf-constitution` (TC-001 a TC-004, contrato 7) para que se ejecute a criterio humano; no ejecutarlo de forma automática (AGENTS.md). Depende de T014. Hecho: el comando y su estado (ejecutado con resultado, o pendiente de decisión humana) constan en el informe.
- [x] T016 Ejecutar `git status --short` y `git diff --stat`: solo aparecen los seis archivos del alcance y los artefactos de `specs/flow/STORY-184-review-md-semilla-para-proyectos-consumidores/`, y el historial muestra los evals (T002-T003) antes del cambio del skill (T006-T008) (contrato 8; Non-Goals). No usar `git stash` ni `checkout` para comparar: otras sesiones pueden estar editando el working tree. Hecho: lista registrada en `implement-report.md`, sin cambios en `docs/templates/`, `package.json`, `sddf-init` ni `story-code-review`.
