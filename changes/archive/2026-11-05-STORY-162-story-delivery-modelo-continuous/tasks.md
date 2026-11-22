---
alwaysApply: false
type: tasks
id: STORY-162
slug: STORY-162-story-delivery-modelo-continuous-tasks
title: "Tasks: story-delivery en modelo continuous"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-162
design: STORY-162
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-162-story-delivery-modelo-continuous
  - STORY-162-story-delivery-modelo-continuous-design
---

<!-- Referencias -->
[[STORY-162-story-delivery-modelo-continuous]] · [[STORY-162-story-delivery-modelo-continuous-design]]

## 1. Precondición y pruebas primero (RED)

- [x] T001 Comprobar la precondición de CR-001: `skills/story-delivery/SKILL.md`, `skills/story-delivery/README.md` y `skills/story-delivery/evals/evals.json` existen (STORY-159 implementada) y el Paso 2 del SKILL.md contiene la rama provisional `❌ story-delivery solo soporta delivery-model: batch`. Si falta alguno, detener la historia sin modificar nada. Ubicar los pasos equivalentes a Paso 2, 4, 5 y 6 del diseño si la implementación de STORY-159 los numeró distinto (CR-001, Risks). Hecho: los tres archivos existen y los pasos están identificados.
- [x] T002 En `skills/story-delivery/evals/evals.json` reescribir TC-005 como «delivery-model inválido» (`ACCEPTANCE/DONE`, `delivery-model: weekly`; `expected.contains`: `weekly`, `batch`, `continuous`; `expected.not_contains`: `status: DELIVER`, la pregunta de confirmación final y el texto provisional `solo soporta delivery-model: batch`) y subir `version` a `1.1.0` (C-3, D-5, AC-3, CNF-1). Hecho: TC-005 ya no espera que `continuous` falle cerrado.
- [x] T003 En el mismo `evals.json` añadir TC-007 «delivery-model ausente» (`sddf.config.yaml` sin `defaults.delivery-model`; contiene `ausente`, `batch` y `continuous`; `not_contains` `status: DELIVER` y la confirmación final) (C-3, D-5, AC-3, CNF-1). Hecho: el caso existe con `id: TC-007`.
- [x] T004 En el mismo `evals.json` añadir TC-008 «entrega en continuous con despliegue afirmado» (`continuous`, DoD cumplido, `s` a la afirmación de despliegue, a las preguntas por criterio y a la confirmación final; contiene la pregunta `¿El incremento de STORY-NNN ya está desplegado en producción?`, `DELIVER` y `DONE`; `not_contains` `no aplica en batch` y la ejecución de `npm install`) (C-3, D-2, D-3, AC-1). Hecho: el caso existe con `id: TC-008`.
- [x] T005 En el mismo `evals.json` añadir TC-009 «continuous sin despliegue» (`continuous`, `n` a la afirmación; contiene `DELIVER exige que el incremento ya esté desplegado` y `story.md no cambió`; `not_contains` `status: DELIVER`, la confirmación final y la tabla del DoD) (C-3, D-2, AC-2, CNF-1). Hecho: el caso existe con `id: TC-009` y `node -e "JSON.parse(require('fs').readFileSync('skills/story-delivery/evals/evals.json','utf8'))"` no falla.

## 2. Skill story-delivery: modelo de entrega (GREEN)

- [x] T006 Reescribir el Paso 2 de `skills/story-delivery/SKILL.md` como «Resolver el modelo de entrega» según D-1: leer `defaults.delivery-model` de `<REPO_ROOT>/sddf.config.yaml`; normalizar descartando el comentario en línea (desde ` #`), las comillas que lo envuelvan y los espacios; comparar de forma exacta en minúsculas; tabla de salidas `batch` → Paso 3 · `continuous` → Paso 2b · ausente (archivo, `defaults` o clave inexistentes), vacío, `null` u otro valor → detener sin cambios con `❌ Falta un delivery-model válido en sddf.config.yaml › defaults.delivery-model (valor leído: <valor | ausente>). Valores válidos: batch, continuous.`; eliminar el mensaje provisional de STORY-159; dejar explícito que el Paso 1 (estado) se evalúa antes (C-1, D-1, AC-3, CNF-1). Hecho: `grep -n "solo soporta" skills/story-delivery/SKILL.md` no devuelve resultados y el paso tiene las tres salidas.
- [x] T007 Añadir al SKILL.md el Paso 2b «Afirmación de despliegue (solo continuous)» según D-2: pregunta `¿El incremento de STORY-NNN ya está desplegado en producción? (s/n)`; solo `s`/`si`/`sí` (sin distinguir mayúsculas) registra la afirmación y continúa al Paso 3; cualquier otra respuesta, incluida la vacía, detiene con `❌ En delivery-model: continuous, DELIVER exige que el incremento ya esté desplegado. Despliega el incremento y vuelve a ejecutar /story-delivery STORY-NNN. story.md no cambió.` sin leer el DoD; indicar que el paso no escribe ni crea archivos y que la confirmación final del Paso 5 se mantiene en ambos modelos (C-1, D-2, D-4, AC-1, AC-2, CNF-1). Hecho: en `batch` el Paso 2b no se ejecuta y en `continuous` precede al Paso 3.
- [x] T008 Modificar la regla 1 de la tabla de clasificación de evidencia del Paso 4 según D-3: criterio que exige el paquete publicado o el incremento desplegado → `batch`: `no-aplica-batch` / `no aplica en batch` / `delivery-model: batch (sddf.config.yaml)` (sin cambios); `continuous`: `confirmación` / ✅ o ❌ / `confirmación humana (delivery-model: continuous)`; añadir la regla de que la regla 1 se evalúa siempre antes que la 2, así que los comandos que citan esos criterios (p. ej. `npm install agile-sddf`) nunca se ejecutan; añadir `continuous` al enum `metodo`/`estado` del esquema si el SKILL.md lo reproduce (C-1, D-3, AC-1). Hecho: aplicada mentalmente al DoD actual en `continuous`, la tabla da CI, secrets e instalación → `confirmación`; SemVer, CHANGELOG y `files` → `artefacto`; `npm pack --dry-run` → `comando`.

## 3. Skill story-delivery: secciones descriptivas y README

- [x] T009 Actualizar `## Objetivo`, `## Posicionamiento`, `## Restricciones / Reglas` y `## Salida` del SKILL.md: soporta `batch` y `continuous` (`continuous` = incremento ya desplegado, `docs/domains/domain-story-lifecycle.md`); el skill no ejecuta, dispara ni verifica despliegues; los caminos de modelo inválido y despliegue no afirmado no escriben `story.md` ni crean archivos; `description` del frontmatter y `triggers` mencionan `continuous` si STORY-159 los limitó a `batch` (C-1, D-2, D-4, AC-1, CNF-1). Hecho: ninguna sección del SKILL.md afirma que solo se soporta `batch` ni que `continuous` es una extensión futura.
- [x] T010 [P] Actualizar `skills/story-delivery/README.md`: alcance `batch` y `continuous`, valores válidos de `defaults.delivery-model` y su fallo cerrado, flujo de la afirmación de despliegue; quitar `continuous`/STORY-162 de las extensiones previstas y dejar solo STORY-163 (C-2, AC-1, AC-3). Hecho: el README no describe `--dry-run` ni `--force` como disponibles y no presenta `continuous` como pendiente.

## 4. Verificación

- [x] T011 Verificar por búsqueda los contratos 6 y de no regresión: `grep -n "solo soporta" skills/story-delivery/SKILL.md` vacío; `grep -n "no aplica en batch" skills/story-delivery/SKILL.md` sigue presente para `batch`; `grep -n "Valores válidos: batch, continuous" skills/story-delivery/SKILL.md` presente (AC-3, contratos 5 y 6).
- [x] T012 Ejecutar `npm test` y `npm run verify:repository` y corregir hasta verlos en verde (incluye `verify-eval-inventory` con los TC nuevos y `verify-fixed-layout`) (CNF-2, contrato 7).
- [~] T013 Ejecutar a criterio humano `npm run test:eval -- story-delivery` y revisar TC-005, TC-007, TC-008 y TC-009, más TC-001 como no regresión de `batch` (AC-1, AC-2, AC-3, CNF-1; ejecución manual por cuota, regla de `AGENTS.md`) (contratos 1–5). — pendiente de ejecución humana: los evals se ejecutan manualmente a criterio humano (regla de AGENTS.md)
- [x] T014 Ejecutar `graphify update .` para refrescar el grafo tras los cambios.
