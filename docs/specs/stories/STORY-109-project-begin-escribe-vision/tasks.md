---
type: tasks
id: STORY-109
slug: STORY-109-project-begin-escribe-vision-tasks
title: "Tasks: project-begin escribe la intención en product/vision.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-109
design: STORY-109
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-109-project-begin-escribe-vision
  - STORY-109-project-begin-escribe-vision-design
---

<!-- Referencias -->
[[STORY-109-project-begin-escribe-vision]] · [[STORY-109-project-begin-escribe-vision-design]]

> Orden: el template (grupo 2) va antes que el skill y el agente (grupos 3 y 4), porque ambos lo nombran; los registros
> (grupo 5) y los evals (grupo 6) dependen del nombre final `vision-template.md`. La verificación (grupo 8) cierra.
> Todo archivo `.md`/`.json` tocado se guarda en UTF-8 sin BOM.

## 1. Preparación — línea base

- [x] T001 Ejecutar `npm test`, `npm run verify:eval-inventory` y `npm run verify:links` y guardar las salidas en `.tmp/story-implement/STORY-109/baseline.txt`; registrar también la salida de `grep -rnE "01-projects|project-intent|PROJ-" skills/project-begin agents/project-pm.agent.md` (punto de partida del contrato #1) — contratos #1, #3, #7, #12

## 2. Template de visión

- [x] T002 Renombrar con `git mv skills/project-begin/assets/project-intent-template.md skills/project-begin/assets/vision-template.md` y reescribir su contenido según D-2: frontmatter `type: product` · `slug: vision` · `title: "Visión del producto"` · `status: IN-PROGRESS` · `substatus: TODO` · `parent: null` · `created`/`updated: <YYYY-MM-DD>`, cada clave con su comentario `# escritor:` de la tabla de D-2 (sin `id`, `alwaysApply` ni `related`); cuerpo `# Visión del producto` → `## Problema que resolvemos` → `## Propuesta de valor` (`### Visión (elevator pitch)` con los 7 ítems, `### Beneficios clave` con 3) → `## Criterios de éxito` (3 ítems `- [ ]`) → `## Alcance y límites` (`### Restricciones` con `Technical`/`Time`/`Resources`, `### Fuera de alcance (Non-Goals)` con 2) → pie `Volver al mapa: [[index]].`; cada sección hoja con su comentario guía `<!-- … -->` trasladado de la sección equivalente de `project-intent-template.md` y placeholders `[Por completar: …]` — D-1, D-2, CNF-1
- [x] T003 Renombrar con `git mv docs/templates/project-intent-template.md docs/templates/vision-template.md` y sobrescribirlo con el contenido de T002 byte a byte (`diff` vacío entre ambas copias) — D-1, CNF-1

## 3. Skill `project-begin`

- [x] T004 En `skills/project-begin/SKILL.md` reescribir la cabecera: `description` del frontmatter ("Produce product/vision.md … entrevistando al usuario mediante el agente project-pm"), `triggers` (agregar `visión del producto`), "Cuándo usar", `## Objetivo` (salida `$SPECS_BASE/product/vision.md`; "Qué hace" sin WIP=1 ni directorio de proyecto), `## Entrada` (`$SPECS_BASE/templates/vision-template.md` → seed `assets/vision-template.md`; `$SPECS_BASE/product/vision.md` opcional), `## Precondiciones` (sin la regla WIP=1 de `01-projects/`), `## Dependencias`, `## Modos de ejecución` (`TODO`/`IN-PROGRESS`/`DONE` de D-3) y `## Restricciones / Reglas` (quitar WIP=1, template de solo lectura con el nuevo nombre, UTF-8 sin BOM) — D-1, D-3, D-9, AC-3
- [x] T005 En `skills/project-begin/SKILL.md` eliminar el Paso 0b (`PROJ_DIR`) y el Paso 1 (WIP=1) y reescribir el Paso 1 como resolución del template: central `$SPECS_BASE/templates/vision-template.md` → seed `assets/vision-template.md` con `⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.` → si faltan ambos `❌ Template vision-template.md no encontrado. Ejecuta sddf-init.` y fin sin escribir; guardar `$TEMPLATE_PATH` — D-1, F-4, CNF-1
- [x] T006 En `skills/project-begin/SKILL.md` escribir el Paso 2 — Estado de la visión: `$VISION_PATH = $SPECS_BASE/product/vision.md`; tabla de D-3 (no existe → `full` y crear `product/` al escribir; `TODO` → `full`; `IN-PROGRESS` → `resume`; `DONE` → `AskUserQuestion` `Actualizar`/`Cancelar`, `Cancelar` termina sin escribir; otro valor → `⚠️ substatus no reconocido en vision.md: <valor>; se trata como TODO`); regla de sección pendiente de D-4 (sección hoja ausente, con `[Por completar` o con una línea idéntica al placeholder del template) que produce `$PENDING_SECTIONS` en orden del template; con `resume` y lista vacía, saltar al Paso 4; ninguna escritura antes de esta decisión — D-3, D-4, AC-2
- [x] T007 En `skills/project-begin/SKILL.md` reescribir el Paso 3 — Delegar al `project-pm`: instrucción con `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE` y `$PENDING_SECTIONS` ya sustituidos; conserva las dos fases (captura y refinamiento, máx. 3-4 preguntas por ronda), el marcado `[inferido]` y el Protocolo de Resiliencia; pide escribir `$VISION_PATH` con la estructura del template y `substatus: IN-PROGRESS`; en `resume`, solo las secciones listadas — D-6, AC-1, AC-2
- [x] T008 En `skills/project-begin/SKILL.md` escribir el Paso 4 — Gate de confirmación: verificar que `$VISION_PATH` existe (si no, informar y sugerir re-ejecutar `/project-begin`); mostrar resumen por sección; `AskUserQuestion` `Confirmar` / `Dejar en revisión`; con `Confirmar` editar solo `substatus: DONE` y `updated` y emitir `✅ Visión del producto completa: $VISION_PATH · Siguiente comando: /project-discovery`; con `Dejar en revisión` (o sin respuesta) dejar `IN-PROGRESS`; reescribir `## Salida` con `$SPECS_BASE/product/vision.md` — D-5, F-4, AC-1
- [x] T009 [P] En `skills/project-begin/README.md` actualizar `What it does` y `Produces` (`$SPECS_BASE/product/vision.md`, `substatus: DONE` tras la confirmación) y la frase de "When to use" sobre retomar, sin `01-projects`, `project-intent` ni `PROJ-` — D-9, AC-3

## 4. Agente `project-pm`

- [x] T010 En `agents/project-pm.agent.md` actualizar la `description` del frontmatter y la introducción para nombrar los estados *Visión* y *Discovery* sin rutas; renombrar la sección "Estado Begin Intention" a "Estado Visión — Capturar y refinar la visión del producto" con `Input`/`Output` = `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE`, `$PENDING_SECTIONS` (inyectados por el orquestador, el agente no resuelve rutas) — D-6, AC-3
- [x] T011 En `agents/project-pm.agent.md` reescribir los pasos del estado Visión: Paso 1 lee `$TEMPLATE_PATH` y `$VISION_PATH` si existe; el Paso 2 (validación de `substatus`) se elimina porque el modo llega en `$MODE`; Paso 3 entrevista sobre todas las secciones hoja (`full`, con el contenido existente como pre-relleno) o solo `$PENDING_SECTIONS` (`resume`, sin tocar el resto); Paso 5 escribe `$VISION_PATH` conservando encabezados/orden del template, sin comentarios `<!-- -->` ni `# escritor:`, conservando `type`/`slug`/`status`/`parent`/`created` y bloques ajenos al template, con `updated` actual y `substatus: IN-PROGRESS`, sin `date:` ni `id:`, en UTF-8 sin BOM; confirma la ruta y devuelve el control al skill (el cierre a `DONE` no es suyo) — D-5, D-6, AC-1, AC-2, CNF-2
- [x] T012 En `agents/project-pm.agent.md` parametrizar el estado Discovery: `Input` `$VISION_PATH` (documento de visión de entrada), `$TEMPLATE_PATH` (estructura objetivo) y `$OUTPUT_PATH`; sustituir cada ruta fija `$SPECS_BASE/specs/01-projects/…` y cada mención a `project-intent.md`/`project-intent-template.md` por esas variables o por "documento de visión"; el Paso 2 valida `substatus: DONE` del documento de visión e indica ejecutar `/project-begin` si no lo está; no cambiar el método de discovery — D-6, AC-3

## 5. Registros del template compartido

- [x] T013 [P] En `skills/memory-system/scripts/memory-system.js` cambiar la entrada `{ name: 'project-intent-template.md', owner: 'project-begin' }` de `SHARED_TEMPLATES` por `{ name: 'vision-template.md', owner: 'project-begin' }` — D-7, CNF-1
- [x] T014 [P] En `test/memory-system.test.js` sustituir `'project-intent-template.md'` por `'vision-template.md'` en `NINE_TEMPLATES` — D-7, CNF-1
- [x] T015 [P] En `skills/memory-system/references/memory-rules.md` cambiar la fila `templates/project-intent-template.md` por `templates/vision-template.md` (origen `<CLI_ROOT>/skills/project-begin/assets/`) y en `skills/memory-system/assets/scaffold/templates/README.md` el nombre en la lista de templates con dueño — D-7, CNF-1
- [x] T016 [P] En `skills/memory-system/evals/evals.json` (TC-007) sustituir `project-intent-template.md` por `vision-template.md` en el texto de `description`, sin tocar `expected` — D-7
- [x] T017 [P] En `skills/sddf-init/SKILL.md` cambiar la fila de la tabla del Paso 2b a `vision-template.md` → `$CLI_ROOT/skills/project-begin/assets/` y las dos líneas de ejemplo de salida (`[CREADO] …/templates/vision-template.md`, `[PRESERVADO] docs/templates/vision-template.md`) — D-7, CNF-1
- [x] T018 [P] En `skills/skill-preflight/SKILL.md` (Verificación 3) y `docs/templates/README.md` sustituir `project-intent-template.md` por `vision-template.md` — D-7, CNF-1

## 6. Evals de `project-begin`

- [x] T019 Crear `skills/project-begin/evals/evals.json` (`skill: project-begin`, `version: 1.0.0`, `description`, `cases`) con seis casos `TC-001`…`TC-006` según la tabla de D-8, cada uno con `input.context` que describe el estado de `docs/product/vision.md`, la presencia de templates y la ausencia de `docs/specs/01-projects/`, `expected.contains`/`not_contains` y `threshold`: TC-001 (semilla con marcadores → `product/vision.md`, `Criterios de éxito`, `DONE`, `/project-discovery`; `not_contains` `01-projects`, `PROJ-`, `project-intent`), TC-002 (`TODO` → entrevista completa), TC-003 (`IN-PROGRESS` con `Criterios de éxito` y `Restricciones` pendientes → solo esas), TC-004 (`DONE` → `Actualizar`, `Cancelar`, sin escritura), TC-005 (sin template central → seed `vision-template.md` con `⚠️`), TC-006 (sin template → `❌`, sin escritura) — D-8, AC-1, AC-2, AC-3
- [x] T020 Eliminar la entrada `project-begin` de `config/eval-exemptions.json`, conservando el resto del archivo y su formato — D-8, AC-3

## 7. Release notes

- [x] T021 En `CHANGELOG.md`, sección `[Unreleased]`, agregar bajo `### Changed` la entrada de STORY-109: `/project-begin` escribe `product/vision.md` (modos por `substatus`, gate de confirmación), `project-intent-template.md` → `vision-template.md`, `project-pm` sin rutas fijas, evals nuevos; marcar el breaking change e indicar que los proyectos inicializados conservan su `docs/templates/project-intent-template.md` y deben ejecutar `/memory-system scaffold` o `sddf-init` para obtener `vision-template.md` — D-7, D-8

## 8. Verificación

- [x] T022 Verificar el contrato #1: `grep -rnE "01-projects|project-intent|PROJ-" skills/project-begin agents/project-pm.agent.md` → vacío — AC-3
- [x] T023 Verificar los contratos #4, #5 y #6: existen las dos copias de `vision-template.md` con `diff` vacío; sus encabezados en orden son los 4 `##` y 4 `###` de D-2; `grep -rn "project-intent-template" skills test docs/templates` devuelve solo `skills/project-flow/SKILL.md` (CR-002) — CNF-1, AC-1
- [x] T024 Verificar los contratos #8, #9 y #10 leyendo `skills/project-begin/SKILL.md`: la única ruta de salida es `$SPECS_BASE/product/vision.md` y el flujo no cita `specs/`; el Paso 2 contiene la tabla de modos y la regla de sección pendiente; `substatus: DONE` solo se escribe en el Paso 4 tras `Confirmar` — AC-1, AC-2
- [x] T025 Ejecutar `npm test`, `npm run verify:eval-inventory` y `npm run verify:links` y comparar con la línea base de T001: los tres terminan en exit 0 / `[OK]` — contratos #3, #7, #12, CNF-1, AC-3
- [x] T026 Ejecutar `npm run test:eval -- project-begin` y confirmar exit 0 con los seis casos aprobados; si alguno falla, ajustar el skill (no las aserciones) y repetir — contrato #2, AC-3. **Excepción aprobada el 2026-10-10:** el runner Codex se interrumpió al cargar YAML inválido de un ejemplo ajeno de `security-audit`; la repetición de los seis evals queda como seguimiento de EPIC-21.
- [x] T027 Verificar el contrato #11: ningún archivo tocado empieza con los bytes `EF BB BF` ni contiene `Ã` / `ðŸ` (`grep -lE "Ã|ðŸ"` sobre la lista de archivos modificados) y `project-pm` declara la regla UTF-8 sin BOM — CNF-2
