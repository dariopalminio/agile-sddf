---
type: tasks
id: STORY-129
slug: STORY-129-migrar-analizadores-de-reverse-engineering-tasks
title: "Tasks: Migrar analizadores de reverse-engineering"
status: PLAN
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
story: STORY-129
design: STORY-129
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-129-migrar-analizadores-de-reverse-engineering
  - STORY-129-migrar-analizadores-de-reverse-engineering-design
---

<!-- Referencias -->
[[STORY-129-migrar-analizadores-de-reverse-engineering]] · [[STORY-129-migrar-analizadores-de-reverse-engineering-design]]

> Orden: línea base → `git mv` → adaptación de los cinco subagentes → orquestador → evals y guía → verificación → entorno local.
> T002 mueve los archivos **sin editarlos**, para que git detecte el renombrado; las ediciones van en T003–T007.
> En los cuerpos de los agentes se conservan intactas las secciones de análisis, los niveles de confianza, la estructura
> del informe y el valor de `**Generado por**` (D-4, CNF-1). Todo archivo creado o modificado se guarda en UTF-8 sin BOM.

## 1. Línea base y movimiento de archivos

- [x] T001 Verificar el estado de partida del Context de `design.md`: `git ls-files "agents/reverse-engineer-*"` lista exactamente los cinco archivos de D-1 y `git ls-files skills/reverse-engineering/assets` no devuelve nada; si difiere, detener la historia e informar qué archivo sobra o falta — D-1, AC-1
- [x] T002 Crear `skills/reverse-engineering/assets/agents/` y ejecutar los cinco `git mv` de la tabla de D-1 (`reverse-engineer-architect.agent.md` → `architect.md`, `reverse-engineer-product-discovery.agent.md` → `product-discovery.md`, `reverse-engineer-business-analyst.agent.md` → `business-analyst.md`, `reverse-engineer-ux-flow-mapper.agent.md` → `ux-flow-mapper.md`, `reverse-engineer-synthesizer.agent.md` → `synthesizer.md`), sin modificar su contenido en este paso — D-1, AC-1

## 2. Subagentes analizadores locales

- [x] T003 [P] En `skills/reverse-engineering/assets/agents/architect.md`: sustituir el frontmatter por el de I-1 (`alwaysApply: false`, `name: architect`, `description` que empiece por «Subagente del skill reverse-engineering» y termine con «Invocado exclusivamente por el orquestador reverse-engineering — no invocar directamente», `role: Architecture Reverse Engineer`, `output: .tmp/reverse-engineering/rfc-architecture.md`), retirando `tools:` y `model:`; cambiar la línea `Escribe el resultado en …` (hoy l.128) a `.tmp/reverse-engineering/rfc-architecture.md`; reemplazar la mención a `reverse-engineer-synthesizer` (hoy l.18) por «el synthesizer del skill `reverse-engineering`»; añadir `## Restricciones de ejecución` con las tres reglas de D-4 (herramientas permitidas: Read, Glob, Grep, Write y Bash solo para comandos de lectura; escribir únicamente en su `output:`; no lanzar subagentes ni invocar skills) — D-2, D-3, D-4, I-1, I-5, AC-1, CNF-1, CNF-2
- [x] T004 [P] En `skills/reverse-engineering/assets/agents/product-discovery.md`: aplicar el mismo patrón que T003 con `name: product-discovery`, `role: Product Discovery Specialist`, `output: .tmp/reverse-engineering/rfc-features.md`; cambiar la línea de salida (hoy l.94) a esa ruta; reemplazar la mención a `reverse-engineer-synthesizer` (hoy l.17); `## Restricciones de ejecución` con herramientas Read, Glob, Grep, Write — D-2, D-3, D-4, I-1, I-5, AC-1, CNF-1, CNF-2
- [x] T005 [P] En `skills/reverse-engineering/assets/agents/business-analyst.md`: aplicar el patrón de T003 con `name: business-analyst`, `role: Business Rules Analyst`, `output: .tmp/reverse-engineering/rfc-business-rules.md`; cambiar la línea de salida (hoy l.143) a esa ruta; reemplazar la mención a `reverse-engineer-synthesizer` (hoy l.18); `## Restricciones de ejecución` con herramientas Read, Glob, Grep, Write — D-2, D-3, D-4, I-1, I-5, AC-1, CNF-1, CNF-2
- [x] T006 [P] En `skills/reverse-engineering/assets/agents/ux-flow-mapper.md`: aplicar el patrón de T003 con `name: ux-flow-mapper`, `role: UX Flow Mapper`, `output: .tmp/reverse-engineering/rfc-navigation.md`; cambiar a esa ruta tanto la mención del árbol ASCII (hoy l.130) como la línea de salida (hoy l.134); `## Restricciones de ejecución` con herramientas Read, Glob, Grep, Write — D-2, D-3, D-4, I-1, I-5, AC-1, CNF-1, CNF-2

## 3. Subagente synthesizer local

- [x] T007 En `skills/reverse-engineering/assets/agents/synthesizer.md`: sustituir el frontmatter por el de I-1 con `name: synthesizer`, `role: Requirements Synthesizer`, `output: .tmp/reverse-engineering/proposal/manifest.md`, retirando `tools:` y `model:`; no cambiar la ruta de lectura `.tmp/reverse-engineering/rfc-*.md` (hoy l.17) ni la de escritura (hoy l.25); añadir `## Restricciones de ejecución` (herramientas Read y Write; escribir únicamente en `$STAGING_DIR` y `.tmp/reverse-engineering/gaps.md`; no lanzar subagentes ni invocar skills) — D-2, D-4, I-1, I-5, AC-1, CNF-1, CNF-2

## 4. Orquestador `SKILL.md`

- [x] T008 En `skills/reverse-engineering/SKILL.md`, Fase 0, insertar justo después de la resolución de `$SPECS_BASE` (hoy l.29) y antes de resolver templates el paso de D-5: comprobar que existen los cinco archivos `assets/agents/{architect,product-discovery,business-analyst,ux-flow-mapper,synthesizer}.md`, con rutas relativas al directorio del skill; si falta alguno, emitir una línea I-4 por cada archivo ausente (`❌ Subagente local no encontrado: assets/agents/<rol>.md (skill reverse-engineering).`) seguida de `Reinstala el skill; no se lanzó ningún análisis.` y terminar sin escribir, preguntar ni crear `.tmp/`; expresar la ausencia de fallback con la frase «no se buscan subagentes fuera del directorio de este skill», sin nombrar la carpeta global — D-5, I-4, F-2, AC-2
- [x] T009 En `SKILL.md`, reescribir la Fase 1 (hoy l.52): borrar solo los cuatro `rfc-*.md` de `.tmp/reverse-engineering/`; leer los cuatro archivos de analizador de `assets/agents/` y lanzar, en el mismo turno, un subagente genérico por cada uno (`general-purpose` en Claude Code) cuyo prompt es el contenido íntegro del archivo más el bloque I-2 (`$TARGET_PATH`, `$REQUIREMENT_TEMPLATE_PATH`), sin pasar el contexto de la sesión; al terminar, comprobar que existe el `output:` de cada uno y, si falta, emitir I-6 (`⚠️ <rol> no produjo <ruta>; la síntesis continúa con los intermedios disponibles.`) y continuar; añadir la frase de degradación de F-3 (sin herramienta de subagentes, la sesión ejecuta cada archivo en sí misma, uno tras otro, con el mismo contexto y las mismas rutas) — D-6, I-2, I-5, I-6, F-1, F-3, F-4, AC-1, CNF-2
- [x] T010 En `SKILL.md`, reescribir la invocación de Fase 2 (hoy l.56) para que lea `assets/agents/synthesizer.md` y lo lance del mismo modo con el bloque I-3 (lista de variables actual sin cambios), y añadir en Fase 3 que el informe final repite los avisos I-6 emitidos en Fase 1; el resto de Fase 0, Fase 3, `## Reglas` y `## Salida` no cambia (requiere T009) — D-6, I-3, I-6, F-1, F-4, AC-1, CNF-1

## 5. Evals del skill y guía

- [x] T011 En `skills/reverse-engineering/evals/evals.json`, añadir tras TC-004, con el mismo formato de una línea por caso y `threshold: 1.0`, los casos de D-7: TC-005 (`fail-fast`, contexto «Falta `assets/agents/synthesizer.md`; los otros cuatro subagentes locales y los templates existen.», `contains` `❌ Subagente local no encontrado` y `assets/agents/synthesizer.md`, `not_contains` `agents/reverse-engineer-`, `FR-001` y `Continuar`) y TC-006 (`happy-path`, contexto «Repositorio sin requisitos; existen los cinco subagentes locales y los templates.», `contains` `.tmp/reverse-engineering/rfc-architecture.md` y `assets/agents/architect.md`, `not_contains` `agents/reverse-engineer-architect` y `.tmp/rfc-`); TC-001…TC-004 sin cambios; validar que el JSON parsea con `node -e "JSON.parse(require('fs').readFileSync('skills/reverse-engineering/evals/evals.json','utf8'))"` — D-7, AC-1, AC-2
- [x] T012 En `docs/guides/best-practices-for-skills.md`, sección «Ejemplo: skill `reverse-engineering`» (hoy l.194-204), aplicar D-8 (requiere T002): conservar `.tmp/reverse-engineering/` en la raíz del árbol ASCII (el árbol de trabajo ya trae ese cambio), cambiar los cuatro comentarios `# escrito por reverse-engineer-<rol>` por `# escrito por el subagente local <rol>`, y reescribir el párrafo siguiente como «El subagente local `synthesizer` (`skills/reverse-engineering/assets/agents/synthesizer.md`) lee solo esos cuatro archivos para generar la propuesta, sin acceder al contexto de la sesión principal.»; no tocar el resto de la guía; verificar con `grep -n "reverse-engineer-" docs/guides/best-practices-for-skills.md` sin salida (contrato 9) — D-8, CR-002, AC-1, CNF-1

## 6. Verificación de criterios de aceptación

- [x] T013 [P] Verificar AC-1 (contratos 1 y 2): `git ls-files skills/reverse-engineering/assets/agents` lista exactamente `architect.md`, `business-analyst.md`, `product-discovery.md`, `synthesizer.md`, `ux-flow-mapper.md`, y `git ls-files "agents/reverse-engineer-*"` no devuelve nada — AC-1
- [x] T014 [P] Verificar AC-1 y AC-2 (contrato 3): `grep -n "agents/" skills/reverse-engineering/SKILL.md | grep -v "assets/agents/"` y `grep -n "reverse-engineer-" skills/reverse-engineering/SKILL.md` no devuelven nada — AC-1, AC-2
- [x] T015 [P] Verificar AC-1 y CNF-1 (contrato 4): `grep -rn "\.tmp/rfc-" skills/reverse-engineering/assets/agents` no devuelve nada y `grep -rln "\.tmp/reverse-engineering/rfc-" skills/reverse-engineering/assets/agents` lista los cuatro analizadores (y el synthesizer, que los lee) — AC-1, CNF-1
- [x] T016 [P] Verificar CNF-1 (contrato 5): `git diff -M main -- agents skills/reverse-engineering/assets/agents` (con ambas rutas, para que git empareje los renombrados) muestra cinco renombrados cuyos cambios se limitan al frontmatter, la línea de salida, las menciones al synthesizer y la sección `## Restricciones de ejecución` — CNF-1
- [x] T017 [P] Verificar CNF-2 (contrato 6): los cinco archivos de `assets/agents/` contienen `## Restricciones de ejecución` con la prohibición de lanzar subagentes o invocar skills, y ninguno conserva `tools:` ni `model:` en el frontmatter — CNF-2
- [x] T018 [P] Verificar codificación: los tres primeros bytes de los cinco archivos de `assets/agents/`, `SKILL.md`, `evals.json` y `docs/guides/best-practices-for-skills.md` no son `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre ellos devuelve vacío — CNF-1
- [x] T019 Ejecutar `npm run verify:repository` y confirmar exit 0 (incluye `test/install.test.js`, el smoke del tarball y la auditoría de skills/agentes); si falla, corregir antes de cerrar (requiere T012–T018) — contrato 8, AC-1
- [x] T020 Dejar indicado en `implement-report.md` que el contrato 7 (`npm run test:eval -- reverse-engineering`, TC-001…TC-006 en verde) queda a ejecución manual del humano, según `AGENTS.md`; recordar que TC-006 prohíbe la ruta `agents/reverse-engineer-architect` y no el nombre, porque D-4 conserva `**Generado por**: reverse-engineer-architect` en el intermedio (D-7, Risks) — contrato 7, AC-1, AC-2

## 7. Entorno local de dogfooding

- [x] T021 Reinstalar con `npx agile-sddf install --target claude-code --force` y borrar a mano las cinco copias no versionadas `.claude/agents/reverse-engineer-*.agent.md`; comprobar que `.claude/skills/reverse-engineering/assets/agents/` contiene los cinco subagentes locales — Risks «Entorno local», AC-1
