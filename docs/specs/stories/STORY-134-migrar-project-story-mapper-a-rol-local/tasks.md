---
type: tasks
id: STORY-134
slug: STORY-134-migrar-project-story-mapper-a-rol-local-tasks
title: "Tasks: Migrar project-story-mapper a rol local"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-134
design: STORY-134
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-134-migrar-project-story-mapper-a-rol-local
  - STORY-134-migrar-project-story-mapper-a-rol-local-design
---

<!-- Referencias -->
[[STORY-134-migrar-project-story-mapper-a-rol-local]] · [[STORY-134-migrar-project-story-mapper-a-rol-local-design]]

> Orden: línea base → rol local → orquestador `project-story-mapping` → ficha y evals → verificación → entorno local.
> La historia no comparte archivos con STORY-131…133: no depende de que estén implementadas. Copia los contratos I-1 e I-3 de STORY-131.
> T002 mueve el archivo **sin editarlo**, para que git detecte el renombrado. Las ediciones de `story-mapper.md` van en T003 y T004.
> En el rol se conservan literales `## Variables inyectadas`, `## Principios`, el contenido de las ocho fases y `## Criterios de calidad`.
> Solo cambian el frontmatter (D-2) y los cuatro ajustes de D-3. Todo archivo creado o modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [ ] T001 Confirmar el «Estado medido» del diseño sobre la rama actual: `git ls-files agents/project-story-mapper.agent.md` lista el archivo y `wc -l` da 97; `skills/project-story-mapping/assets/` no existe; `skills/project-story-mapping/SKILL.md` tiene 130 líneas y los textos de D-6 están en l.21, l.35, l.39, l.43, l.73, l.90 y l.92-94; los IDs de `skills/project-story-mapping/evals/evals.json` (clave `cases`), leídos con `node -e`, son exactamente TC-001…TC-006. Si alguna pieza no coincide, detener la historia e informar cuál, sin editar nada — Context, AC-1, AC-2

## 2. Rol local `story-mapper`

- [ ] T002 Ejecutar `git mv agents/project-story-mapper.agent.md skills/project-story-mapping/assets/agents/story-mapper.md` (crear `assets/agents/` si falta), sin modificar el contenido en este paso (requiere T001) — D-1, AC-1, AC-2
- [ ] T003 En `skills/project-story-mapping/assets/agents/story-mapper.md`, sustituir el frontmatter (l.1-14) por el de I-1 y el Esquema de datos: `alwaysApply: false`, `name: story-mapper`, `description: Rol entrevistador del skill project-story-mapping: conduce con el usuario la sesión de User Story Mapping (Jeff Patton) desde product/ y requirements/ y escribe el cuerpo del mapa en staging. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.`, `role: Product Manager — Story Mapping`. Retirar `tools:` y `model:` y no añadir `output:` (requiere T002) — D-2, I-1, AC-1, CNF-1
- [ ] T004 En el cuerpo de `story-mapper.md`, aplicar solo los cuatro ajustes de D-3: (1) en la intro (hoy l.16), tras la frase actual, añadir «Actúas dentro del Paso 3 del skill `project-story-mapping`. Las rutas llegan resueltas desde el skill: no las derives ni delegues trabajo.»; (2) en el mismo párrafo, añadir «Las restricciones de escritura de este rol rigen mientras lo ejecutas; después, el flujo del skill retoma el control y materializa solo tras validar el staging.»; (3) renombrar los ocho encabezados `## Paso N — <título>` a `## Fase N — <título>` (N = 0…7, títulos sin cambio) y cambiar «continúa al Paso 1» (hoy l.40) por «continúa a la Fase 1»; (4) en la Fase 7 (hoy l.72), cambiar «el skill decide si materializa el resultado» por «el flujo del skill decide, tras validar el staging, si materializa el resultado». No tocar las secciones `## …` de la plantilla de staging de la Fase 7 ni añadir el protocolo de resiliencia de `discovery-pm`; el archivo debe quedar en unas 92 líneas (requiere T003) — D-3, I-1, I-2, I-4, AC-1, CNF-1

## 3. Orquestador `project-story-mapping`

- [ ] T005 En `skills/project-story-mapping/SKILL.md`, al final del Paso 0, después del bloque `SDDF-ROOT-RESOLUTION: v1` y de la frase sobre `/skill-preflight` y antes del Paso 1, añadir un párrafo nuevo, sin editar el bloque común: comprobar que existe `assets/agents/story-mapper.md` (relativo al directorio del skill); si falta, emitir I-3 `❌ Rol local no encontrado: assets/agents/story-mapper.md (skill project-story-mapping). Reinstala el skill; no se modificó ningún archivo.` y terminar sin informar el destino, preguntar `Sobrescribir`/`Cancelar`, vaciar ni crear `.tmp/project-story-mapping/` ni escribir `product/story-map.md`; incluir la frase «no se buscan roles fuera del directorio de este skill», sin nombrar la carpeta global (requiere T004) — D-5, I-3, F-2, AC-2
- [ ] T006 En `skills/project-story-mapping/SKILL.md`, renombrar el Paso 3 a «Paso 3 — Sesión de mapeo con el rol `story-mapper`» y sustituir su párrafo (hoy l.94) por el texto de D-4: la sesión lee `assets/agents/story-mapper.md` (relativo al directorio del skill) y sigue sus instrucciones con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH`; esta sesión conduce la entrevista con el usuario y el rol escribe solo el cuerpo del mapa en staging; añadir «No lances un subagente para este paso.» y «Las fases del rol son internas a este paso: al terminar la Fase 7, continúa con el Paso 4.». Eliminar toda mención de `project-story-mapper` (requiere T005) — D-4, I-2, I-4, F-1, F-3, AC-1, CNF-1
- [ ] T007 En `skills/project-story-mapping/SKILL.md`, aplicar los textos finales de D-6 fuera del Paso 3: Objetivo (l.21) «delega la conversación al agente `project-story-mapper` y solo escribe…» → «conduce la conversación en esta sesión con el rol local `story-mapper` y solo escribe…»; Precondiciones (l.35) «el agente lo recopila» → «el rol `story-mapper` lo recopila»; Dependencias (l.39) «Agente: `project-story-mapper`.» → «Rol local: `assets/agents/story-mapper.md` (entrevistador, lo lee esta sesión).»; Restricciones (l.43) «El agente escribe únicamente en staging; …» → «El rol escribe únicamente en staging; …» y añadir la regla «El rol recibe rutas ya resueltas; no resuelve la raíz ni lanza subagentes.»; Paso 1 (l.73) «antes de delegar» → «antes de la sesión de mapeo»; Paso 2 (l.90) «continúa con la delegación» → «continúa con la sesión de mapeo». La l.59 del bloque común y los pasos 4-6 no cambian (requiere T006) — D-6, F-4, AC-1, CNF-1

## 4. Ficha del skill y evals

- [ ] T008 [P] En `skills/project-story-mapping/README.md:9`, cambiar «con el agente especializado» por «con su rol local `story-mapper`, que conduce la propia sesión del skill», sin tocar el resto de la línea (requiere T002) — D-6, AC-1
- [ ] T009 [P] En `skills/project-story-mapping/evals/evals.json`, cambiar solo `input.context` de TC-001, TC-002, TC-003 y TC-006: «el agente deja staging» → «la sesión con el rol story-mapper deja staging» y, en TC-002, «el agente recopila contexto interactivamente» → «el rol story-mapper recopila contexto interactivamente»; `expected` sin cambios; TC-004 y TC-005 sin cambios (requiere T001) — D-7, AC-1
- [ ] T010 En `skills/project-story-mapping/evals/evals.json`, añadir tras TC-006, con el formato de una línea por caso y `threshold: 1.0`, TC-007 (`happy-path`, contexto de D-7; `contains` `assets/agents/story-mapper.md`, `.tmp/project-story-mapping/story-map.md` y `✅ Story map escrito`; `not_contains` `agents/project-story-mapper` y `project-story-mapper.agent.md`) y TC-008 (`fail-fast`, contexto de D-7 sin `skills/project-story-mapping/assets/agents/story-mapper.md`; `contains` `❌ Rol local no encontrado` y `assets/agents/story-mapper.md`; `not_contains` `agents/project-story-mapper`, `✅ Story map escrito` e `Inventario de requisitos`). Escribir el nombre del agente retirado con la regla de escape de D-7 (`project-story-mapper`) y confirmar que `git grep -n "project-story-mapper" -- skills/project-story-mapping/evals` no devuelve nada (requiere T009) — D-7, AC-1, AC-2

## 5. Verificación de criterios de aceptación

- [ ] T011 [P] Verificar contrato 1: `git ls-files skills/project-story-mapping/assets/agents` lista exactamente `story-mapper.md` y `git ls-files agents/project-story-mapper.agent.md` no devuelve nada — AC-1
- [ ] T012 [P] Verificar contrato 2 y contrato 7: `git diff -M main -- agents/project-story-mapper.agent.md skills/project-story-mapping/assets/agents/story-mapper.md` muestra el renombrado con cambios limitados al frontmatter (D-2) y a los cuatro ajustes de D-3, con `## Variables inyectadas`, `## Principios` y `## Criterios de calidad` intactos; `grep -E "^(tools|model):" skills/project-story-mapping/assets/agents/story-mapper.md` no devuelve nada — D-2, D-3, AC-1, CNF-1
- [ ] T013 [P] Verificar contrato 3: `git grep -n "project-story-mapper" -- skills agents config test scripts` no devuelve nada — AC-1
- [ ] T014 [P] Verificar contrato 4: `grep -n "agents/" skills/project-story-mapping/SKILL.md | grep -v "assets/agents/"` no devuelve nada; `grep -niE "(^|[^b])agentes?\b" skills/project-story-mapping/SKILL.md | grep -v "skills, agentes o comandos del runtime"` no devuelve nada; `grep -n "agente" skills/project-story-mapping/README.md` no devuelve nada — AC-1, CNF-1
- [ ] T015 [P] Verificar contratos 5 y 6: `grep -n "assets/agents/story-mapper.md" skills/project-story-mapping/SKILL.md` aparece en Dependencias, Paso 0 y Paso 3; el Paso 3 nombra `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY`, `$STAGING_PATH` y «No lances un subagente»; `grep -c "^## Paso" skills/project-story-mapping/assets/agents/story-mapper.md` da 0 y `grep -c "^## Fase [0-7] — " …/story-mapper.md` da 8 — AC-1, AC-2, CNF-1
- [ ] T016 [P] Verificar contrato 8: los tres primeros bytes de `story-mapper.md`, `SKILL.md`, `README.md` y `evals.json` de `skills/project-story-mapping/` no son `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre ellos devuelve vacío — AC-1
- [ ] T017 [P] Verificar contrato 9: `node -e "JSON.parse(require('fs').readFileSync('skills/project-story-mapping/evals/evals.json','utf8'))"` termina sin error, los IDs son exactamente TC-001…TC-008 y el `not_contains` de TC-007, una vez parseado, contiene `agents/project-story-mapper` — D-7, AC-1, AC-2
- [ ] T018 Ejecutar `npm run verify:repository` y confirmar exit 0 (incluye la auditoría de `SDDF-ROOT-RESOLUTION`, los tests de instalación y la auditoría de skills/agentes, que tratan `agents/` de forma dinámica); si falla, corregir antes de cerrar (requiere T011–T017) — contrato 11, AC-1, AC-2
- [ ] T019 Dejar indicado en `implement-report.md` que el contrato 10 (`npm run test:eval -- project-story-mapping`, TC-001…TC-008 en verde) queda a ejecución manual del humano, según `AGENTS.md`; recordar la mitigación de Risks: si un TC-001…TC-006 falla porque el runner asume que falta el rol, añadir «existe el rol local story-mapper» a su `input.context` sin tocar `expected` — contrato 10, AC-1, AC-2

## 6. Entorno local de dogfooding

- [ ] T020 Reinstalar con `npx agile-sddf install --target claude-code --force`, borrar a mano la copia no versionada `.claude/agents/project-story-mapper.agent.md` y comprobar que existe `.claude/skills/project-story-mapping/assets/agents/story-mapper.md` — Risks «Entorno local», AC-1
