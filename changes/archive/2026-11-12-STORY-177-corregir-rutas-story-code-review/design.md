---
alwaysApply: false
type: design
id: STORY-177
slug: STORY-177-corregir-rutas-story-code-review-design
title: "Design: Corregir rutas de story-code-review"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-177
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-177-corregir-rutas-story-code-review
  - EPIC-28-calibrar-story-code-review-con-review-md
---

<!-- Referencias -->
[[STORY-177-corregir-rutas-story-code-review]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[gr-code-security-checklist]] · [[gr-ai-security-checklist]]

# Diseño técnico: Corregir rutas de story-code-review

## Context

`/story-code-review` lanza cuatro revisores en paralelo y consolida sus informes parciales. El contrato entre el orquestador y los revisores tiene dos defectos, verificados en el filesystem (2026-11-08):

- **Ruta del informe parcial.** `skills/story-code-review/SKILL.md` limpia y lee `.tmp/story-code-review/{story_id}/` (Paso 3a, línea 322; Paso 4a, línea 374; `## Salida`, líneas 690-693), y anuncia esa ruta por agente en el Paso 3b (líneas 343, 347, 351 y 355). Los cuatro agentes declaran otra: `.tmp/story-code-review/<rol>-report.md`, sin el directorio de la historia, en tres lugares cada uno: `description` y `output:` del frontmatter, la sección `## Output requerido` y la regla «No escribir nada fuera de…» (`tech-lead-reviewer.agent.md:6,10,73,100`; `product-owner-reviewer.agent.md:7,11,78,127`; `integration-reviewer.agent.md:7,11,83,135`; `security-reviewer.agent.md:7,11,32,138,184`). El bloque de contexto del Paso 3b (líneas 330-337) no pasa el ID de la historia, así que un revisor no puede construir la ruta correcta aunque quiera.
- **Checklists de seguridad.** `security-reviewer.agent.md:54` (Paso 2a) y `SKILL.md:354` buscan `docs/policies/*security-checklist*.md`, que no existe. Los checklists reales son `docs/guardrails/gr-code-security-checklist.md` (24 reglas) y `docs/guardrails/gr-ai-security-checklist.md` (25 reglas). Hoy solo se encuentran a través de los enlaces de `docs/constitution.md:64-65`, que el Paso 2a acepta como fuente secundaria.
- **Formato real de esos checklists.** El Paso 2a espera `- [ ] <regla> — grep: \`<rule-id>\` (error|warn)`. Los guardrails usan además `— git ls-files:`, `— git check-ignore:` y `— python:` como método, y `gr-ai-security-checklist.md:63-69` tiene reglas semánticas sin `rule-id` ni peso. Con el formato actual, un revisor estricto descartaría parte de las reglas.
- **Skill de seguridad instalado.** En este repo, `.claude/skills/security-audit/assets/security-checklist.md` existe (salida de `agile-sddf install`), así que el Paso 2b lo encuentra. `skills/security-audit/` no existe en la fuente.
- **Nada parsea `output:`.** Ningún script de `scripts/` ni prueba de `test/` lee el `output:` de un `*.agent.md` (`scripts/run-skill-shielder-audit.js:45` solo filtra por extensión). La ruta es contrato de prosa entre el orquestador y el subagente (`docs/guides/best-practices-for-skills.md:224`).
- **Evals.** `skills/story-code-review/evals/evals.json` tiene 23 casos de simulación (TC-001 a TC-023) que califican la salida con `contains` / `not_contains` (`scripts/run-evals.js:1031-1055`). TC-008 cubre el baseline, pero su descripción habla de «checklists de seguridad en docs/policies/».
- **Fuera de este diseño.** Los agentes viven en `skills/story-code-review/agents/` y no en `assets/agents/` (ADR-0014). Moverlos no es parte de la historia. `docs/` no menciona ninguna de las rutas afectadas. `skills/story-code-review/README.md:60` ya usa `.tmp/story-code-review/STORY-NNN/`.

Stack: skills en Markdown + scripts Node.js (CommonJS, `node:test`). Las pruebas de skill son evals (`npm run test:eval`, ejecución a criterio humano) y las propiedades estáticas se fijan con pruebas unitarias en `test/`.

## Goals / Non-Goals

**Goals:**

- Los cuatro revisores escriben su informe en `.tmp/story-code-review/{story_id}/<rol>-report.md`, la misma ruta que limpia y lee el orquestador, y nunca en `.tmp/story-code-review/` directamente. // satisface: AC-1, CNF-1
- El Security-Reviewer descubre `docs/guardrails/gr-*security*.md` por glob, sin depender de los enlaces de `constitution.md`, y cita cada checklist usado en `checklist-sources`. // satisface: AC-2, CNF-1
- Sin checklists del proyecto ni skill de seguridad instalado, el revisor declara el baseline embebido y la revisión termina con su veredicto. // satisface: AC-3
- Evals primero y una prueba unitaria que fija la ruta única y la ausencia de `docs/policies/*security-checklist*`. // satisface: CNF-1, CNF-2

**Non-Goals:**

- Mantener `docs/policies/` como ruta heredada de checklists (el layout legado lo diagnostica `/skill-preflight`, ADR-0019).
- `REVIEW.md`, PREEXISTENTE, deduplicación, tope de LOW y retirada de reglas propias de agile-sddf (otras historias de EPIC-28).
- Cambiar el contrato de `code-review-report.md` (frontmatter, secciones, veredicto) o el formato de los informes parciales.
- Mover los agentes a `assets/agents/` (ADR-0014).
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes: es salida de `agile-sddf install`.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Orquestador `story-code-review` | modificar | `skills/story-code-review/SKILL.md`: Paso 3b (bloque de contexto, descripción del Agente 4 y mensaje de progreso) | AC-1, AC-2, CNF-1 |
| C-2 | Tech-Lead-Reviewer | modificar | `skills/story-code-review/agents/tech-lead-reviewer.agent.md`: `description`, `output:`, contexto recibido, `## Output requerido`, regla de escritura | AC-1, CNF-1 |
| C-3 | Product-Owner-Reviewer | modificar | `skills/story-code-review/agents/product-owner-reviewer.agent.md`: los mismos cinco puntos | AC-1, CNF-1 |
| C-4 | Integration-Reviewer | modificar | `skills/story-code-review/agents/integration-reviewer.agent.md`: los mismos cinco puntos | AC-1, CNF-1 |
| C-5 | Security-Reviewer | modificar | `skills/story-code-review/agents/security-reviewer.agent.md`: los cinco puntos de ruta, la misión (línea 32) y el Paso 2a (descubrimiento y formato de reglas) | AC-1, AC-2, AC-3, CNF-1 |
| C-6 | Evals del skill | modificar | `skills/story-code-review/evals/evals.json`: TC-024 y TC-025 nuevos; TC-008 reescrito como caso de AC-3 | AC-1, AC-2, AC-3, CNF-2 |
| C-7 | Prueba de contrato de rutas | crear | `test/story-code-review-paths.test.js` | CNF-1, CNF-2 |

Sin cambios: `assets/code-review-report-template.md` (ya muestra `**Fuentes de checklist:**`, `SKILL.md:564`), los Pasos 3a, 4a y `## Salida` de `SKILL.md` (ya usan la ruta correcta), `README.md` del skill, `examples/` (sus informes no declaran rutas; `example-missing-artifacts/expected-output.md:27` sigue siendo cierto), `docs/guardrails/`, `docs/constitution.md` (conserva sus enlaces), `package.json` (`files` ya publica `skills/story-code-review`) y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — Bloque de contexto del Paso 3b (orquestador → revisor) | Se añade `$STORY_ID`: el `id` del frontmatter de `story.md` (ej. `STORY-177`). El resto de variables no cambia. Los cuatro revisores lo reciben. | AC-1 |
| I-2 — Ruta del informe parcial (revisor → árbitro) | `.tmp/story-code-review/{story_id}/<rol>-report.md`, relativa a `$REPO_PATH`, con `{story_id}` = `$STORY_ID` y `<rol>` ∈ {`tech-lead`, `product-owner`, `integration`, `security`}. La misma cadena literal aparece en el `output:` del frontmatter, en `## Output requerido` y en la regla «No escribir nada fuera de…» de cada agente. El revisor no crea el directorio: lo crea el Paso 3a. | AC-1, CNF-1 |
| I-3 — Fuentes de reglas del Security-Reviewer | 2a (proyecto): glob `docs/guardrails/gr-*security*.md` bajo `$REPO_PATH`, unido a las rutas de checklist de seguridad enlazadas desde `$CONSTITUTION_PATH` o `$DOD_PATH` que existan. Se deduplica por ruta relativa a `$REPO_PATH`. 2b (skill instalado) y 2c (baseline) no cambian. | AC-2, AC-3 |
| I-4 — Línea de regla de un checklist del proyecto | `- [ ] <regla> — <método>: \`<rule-id>\` (error|warn)`, con `<método>` cualquiera (`grep`, `git ls-files`, `git check-ignore`, `python`…). Una línea `- [ ] <regla>` sin método, id ni peso es una regla semántica: id `<archivo>:<línea>`, severidad `LOW`. | AC-2 |
| I-5 — `checklist-sources` del frontmatter de `security-report.md` | Formato sin cambio: lista de rutas relativas a `$REPO_PATH`, o `baseline-embebido`. El orquestador ya la copia a `**Fuentes de checklist:**` del informe final. | AC-2, AC-3 |
| I-6 — Mensaje de progreso del Paso 3b | Tras las cuatro líneas de agentes, una línea `   📁 Informes parciales → .tmp/story-code-review/{story_id}/`. Solo consola, no forma parte del contrato de `code-review-report.md`. | AC-1 |

## Decisions

### D-1 — El orquestador pasa `$STORY_ID` y los agentes declaran la ruta con `{story_id}` // satisface: AC-1, CNF-1

El revisor necesita el ID para escribir en el directorio de la historia, y hoy no lo recibe (I-1). Se pasa `$STORY_ID` en el bloque de contexto. Cada agente declara en su `output:` `.tmp/story-code-review/{story_id}/<rol>-report.md`, con la notación `{story_id}` que ya usa `SKILL.md`, y aclara en «Contexto recibido» que `{story_id}` es `$STORY_ID`.

| Alternativa | Motivo del rechazo |
|---|---|
| Pasar `$REPORT_DIR` ya resuelto y que el agente escriba en `$REPORT_DIR/<rol>-report.md` | El `output:` del frontmatter dejaría de nombrar la ruta real y CNF-1 pide que el `SKILL.md` y los agentes **declaren** la misma ruta. Una variable con una ruta entera es además una interfaz más ancha que un ID. |
| Que el agente derive el ID del nombre de `$STORY_DIR` | Depende del formato del nombre del directorio (`STORY-NNN-<slug>`) y obliga a cada agente a parsearlo. Es un contrato implícito (P5). |
| Que el orquestador mueva los informes de `.tmp/story-code-review/` a `{story_id}/` tras la ejecución | Añade un paso y deja la contradicción en los agentes. Dos revisiones seguidas pisarían los mismos archivos raíz, justo lo que el directorio por historia evita (NF-2 de `SKILL.md:324`). |

### D-2 — Glob de proyecto en `docs/guardrails/`, enlaces como fuente complementaria // satisface: AC-2, AC-3, CNF-1

El Paso 2a busca `docs/guardrails/gr-*security*.md` por glob y deja de nombrar `docs/policies/`. Los enlaces desde `$CONSTITUTION_PATH` o `$DOD_PATH` se conservan como fuente adicional, porque un proyecto consumidor puede enlazar un checklist con otro nombre, pero el descubrimiento ya no depende de ellos. Las fuentes se deduplican por ruta: en este repo, glob y enlaces dan los mismos dos archivos, y `checklist-sources` los lista una vez cada uno. El patrón `gr-*security*` es el de AC-3 y el prefijo `gr-` de ADR-0019 (`docs/guardrails/`). Recoge los dos checklists actuales y excluye `gr-agent-creation-checklist.md` y `gr-skill-creation-checklist.md`.

| Alternativa | Motivo del rechazo |
|---|---|
| Buscar en `docs/guardrails/` y además en `docs/policies/` como ruta heredada | Fuera de alcance según la historia: el layout legado lo diagnostica `/skill-preflight` (ADR-0019), y CNF-1 prohíbe mencionar `docs/policies/*security-checklist*.md`. |
| Glob `docs/guardrails/*security*.md` sin el prefijo `gr-` | Recogería un DoD u otro documento cuyo nombre contenga `security` y no sea un checklist. El prefijo `gr-` identifica los content guardrails. |
| Quitar los enlaces de `constitution.md` como fuente | No lo pide la historia, y un consumidor con un checklist fuera del patrón perdería sus reglas. Al deduplicar, mantenerlos no cuesta nada. |

### D-3 — El formato de regla admite cualquier método y las reglas semánticas // satisface: AC-2

Si el Paso 2a solo aceptara `— grep:`, ignoraría las reglas `git ls-files`, `git check-ignore` y `python` y las siete semánticas de `gr-ai-security-checklist.md:63-69`. El revisor podría concluir entonces que el checklist «no tiene reglas» y caer al baseline, que es justo lo que AC-2 prohíbe. El formato se generaliza según I-4. Las reglas semánticas se reportan como `LOW`: el guardrail pide que una regla semántica incumplida se eleve a juicio humano y nunca se resuelva en silencio, y `LOW` la hace visible sin bloquear (Estándar de aprobación de `security-reviewer.agent.md:124`). La tabla de normalización de severidad del Paso 4 no cambia. Para los patrones, el revisor usa la definición del check de ese `rule-id` en la sección de validación del checklist, si existe; si no, la prosa de la regla.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener solo `— grep:` | Pierde reglas reales y puede provocar una caída al baseline con un checklist presente (contradice AC-2). |
| Reglas semánticas como `MEDIUM` | Bloquearían por juicio sin evidencia determinista en `Archivo:Línea`. Contradice el Principio de cautela del agente y el objetivo de EPIC-28 de no bloquear por ruido. |
| Excluir las reglas semánticas | Ocultaría reglas que el guardrail declara obligatorias. |

### D-4 — Evals: dos casos nuevos y TC-008 reescrito para AC-3 // satisface: AC-1, AC-2, AC-3, CNF-2

Se escriben antes de modificar el skill (principio 11). Tienen el mismo formato de simulación que TC-001 a TC-023:

- **TC-024 `informes-parciales-en-directorio-de-historia`** (AC-1): historia `STORY-194` en `IMPLEMENT/DONE`, con cuatro resultados sin hallazgos. `contains`: `.tmp/story-code-review/STORY-194/`, `Agentes lanzados en paralelo`, `(verdict: APPROVED)`. `not_contains`: `.tmp/story-code-review/tech-lead-report.md`, `.tmp/story-code-review/product-owner-report.md`, `.tmp/story-code-review/integration-report.md`, `.tmp/story-code-review/security-report.md`.
- **TC-025 `checklist-de-guardrails-sin-enlace-en-constitucion`** (AC-2): `security_checklists_present: ["docs/guardrails/gr-code-security-checklist.md"]`, `constitution_links_security_checklists: false`, `security_skill_installed: false`. `agent_results` omite `security_checklist_sources` a propósito, para que la fuente se derive de la regla de descubrimiento y no del input. `contains`: `gr-code-security-checklist.md`, `Fuentes de checklist`, `(verdict: APPROVED)`. `not_contains`: `baseline embebido`, `baseline-embebido`, `docs/policies/*security-checklist`.
- **TC-008** (AC-3): la descripción pasa a «un proyecto sin archivos `docs/guardrails/gr-*security*` ni skill de seguridad instalado». El `id`, el `name`, el input y las expectativas actuales (`baseline`, `(verdict: APPROVED)`, `CODE-REVIEW`, `DONE`) se conservan y ya cubren «declara el baseline» y «termina con su veredicto».

| Alternativa | Motivo del rechazo |
|---|---|
| Caso `sandbox` que compruebe en disco la existencia de los cuatro archivos en `.tmp/story-code-review/STORY-NNN/` | Exige un fixture de repositorio con código implementado y cuatro subagentes reales: es caro de mantener y de ejecutar. La propiedad estática (la ruta declarada) la fija C-7 sin cuota, y TC-024 cubre el comportamiento observable. |
| Un TC nuevo para AC-3 | Duplicaría TC-008 (P3, reutilización). |

### D-5 — Prueba unitaria del contrato de rutas // satisface: CNF-1, CNF-2

`test/story-code-review-paths.test.js` (con `node:test`, leyendo archivos como hacen `test/sddf-init-layout.test.js` y `test/verify-fixed-layout.test.js`) fija:

1. El `output:` del frontmatter de cada uno de los cuatro agentes es exactamente `.tmp/story-code-review/{story_id}/<rol>-report.md`.
2. Ni `SKILL.md` ni los cuatro agentes contienen una ruta `.tmp/story-code-review/<nombre>-report.md` sin el segmento `{story_id}/`.
3. Ni `SKILL.md` ni los cuatro agentes contienen `docs/policies/*security-checklist`.
4. `SKILL.md` y `security-reviewer.agent.md` contienen `docs/guardrails/gr-*security*.md`.

Entra en `npm test` y, por tanto, en `npm run verify:repository`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo evals | Se ejecutan a criterio humano. Una regresión de ruta en un agente pasaría el gate determinista sin que nadie la viera, que es como nació este defecto. |
| Una regla nueva en `scripts/verify-*.js` | Generalizar un validador de `output:` para todos los skills no lo pide la historia (P12). Basta una prueba acotada a este skill. |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

Árbol de `.tmp/` tras una revisión de `STORY-NNN`:

```
.tmp/story-code-review/
└── STORY-NNN/                  # creado vacío por el Paso 3a
    ├── tech-lead-report.md
    ├── product-owner-report.md
    ├── integration-report.md
    └── security-report.md      # checklist-sources: [docs/guardrails/gr-code-security-checklist.md, …] | baseline-embebido
```

No queda ningún `*-report.md` directamente bajo `.tmp/story-code-review/`. El frontmatter de los informes parciales no cambia.

## Flujos clave

### F-1 — Revisión con checklists en `docs/guardrails/` // AC-1, AC-2

1. El orquestador resuelve `{story_id}`, limpia y recrea `.tmp/story-code-review/{story_id}/` (Paso 3a, sin cambio).
2. Lanza los cuatro revisores con `$STORY_ID` en el bloque de contexto (I-1) y muestra la línea `📁 Informes parciales → …` (I-6).
3. El Security-Reviewer aplica el glob `docs/guardrails/gr-*security*.md`, une los enlaces de `constitution.md` y del DoD y deduplica (I-3). Interpreta las líneas según I-4.
4. Cada revisor escribe en `.tmp/story-code-review/{story_id}/<rol>-report.md` (I-2).
5. El árbitro lee los cuatro informes (Paso 4a, sin cambio) y copia `checklist-sources` a `**Fuentes de checklist:**`.

### F-2 — Proyecto sin checklists // AC-3

Igual que F-1 hasta el paso 3. El glob y los enlaces no dan ningún archivo y no hay skill de seguridad instalado (2b). El revisor aplica el baseline, emite `checklist-sources: [baseline-embebido]` y la sección «Fuentes de checklist» declara el baseline embebido. El árbitro consolida como con cualquier otro revisor y genera `code-review-report.md` con su veredicto.

### F-3 — Degradación // P7

- **`$STORY_ID` ausente o vacío en el contexto:** el revisor no escribe en `.tmp/story-code-review/` ni en ninguna otra ruta y devuelve el control. El árbitro registra el revisor en `$REVIEWERS_BLOCKED` por informe ausente (Paso 4a, sin cambio) y el veredicto sigue la precedencia G-05 (`BLOCKED`, o `NEEDS-CHANGES` si otro revisor trae un bloqueante). No se inventa una ruta alternativa.
- **Un revisor escribe en la ruta raíz antigua** (por ejemplo, una copia instalada desactualizada): el Paso 4a no encuentra el informe en `{story_id}/` y lo marca bloqueado. Es el comportamiento visible correcto, no una aprobación silenciosa.
- **Un checklist ilegible o sin líneas `- [ ]`:** se descarta esa fuente sin error. Si no queda ninguna regla de 2a ni de 2b, se aplica el baseline (2c, sin cambio).

### F-4 — Puntos de cambio // P6

- La ubicación de los checklists del proyecto es un solo patrón en el Paso 2a del Security-Reviewer, repetido como descripción en `SKILL.md`. Si cambia, se tocan esas dos líneas y la aserción 4 de C-7.
- El ID se pasa como dato (I-1). Si la raíz temporal cambia, se tocan las cadenas literales de I-2, y C-7 detecta cualquier archivo que quede desalineado.

## Decisiones de complejidad justificada

- **`$STORY_ID` como variable nueva (D-1):** es la mínima información que falta. La alternativa más simple, que el agente derive el ID de `$STORY_DIR`, convierte un dato explícito en un parseo implícito.
- **Prueba unitaria nueva (D-5):** el defecto existe precisamente porque nada determinista comprueba la ruta. Una prueba de unas cuatro aserciones es más barata que una ronda de evals.
- **Formato de regla generalizado (D-3):** sin él, AC-2 no se cumple con los checklists reales del repo. No se añade ningún parser: el revisor es un LLM que lee las líneas según I-4.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Los cuatro `output:` declaran `.tmp/story-code-review/{story_id}/<rol>-report.md` | C-7, aserción 1 (`npm test`) | AC-1, CNF-1 |
| 2 | Ningún archivo del skill declara un informe parcial directamente bajo `.tmp/story-code-review/` | C-7, aserción 2 | AC-1, CNF-1 |
| 3 | La salida de una revisión nombra `.tmp/story-code-review/STORY-194/` y ninguna ruta raíz de informe | TC-024 (`npm run test:eval -- story-code-review --only TC-024`) | AC-1 |
| 4 | Con `gr-code-security-checklist.md` y sin enlace en `constitution.md`, el informe cita ese checklist y no el baseline | TC-025 | AC-2 |
| 5 | Sin `gr-*security*` ni skill instalado, el informe declara el baseline y termina con veredicto | TC-008 | AC-3 |
| 6 | Ni `SKILL.md` ni los agentes mencionan `docs/policies/*security-checklist`; ambos nombran `docs/guardrails/gr-*security*.md` | C-7, aserciones 3 y 4; `grep -rn "policies/\*security" skills/story-code-review/` vacío | CNF-1 |
| 7 | Gate en verde | `npm test` y `npm run verify:repository` | CNF-2 |

## Risks / Trade-offs

- [Las copias instaladas (`.claude/skills/story-code-review/` y otros runtimes) conservan las rutas antiguas hasta reinstalar] → F-3 hace visible el desajuste como `BLOCKED`. La reinstalación es la operación normal tras cambiar un skill (`npx agile-sddf install`).
- [En este repo, el Paso 2b encuentra `.claude/skills/security-audit/assets/security-checklist.md`, así que AC-3 no se reproduce aquí sin desinstalar ese skill] → AC-3 se verifica con TC-008, cuyo input declara `security_skill_installed: false`.
- [TC-024 comprueba la salida del modelo, no el disco] → La propiedad de disco depende de la ruta declarada, que fija C-7 de forma determinista (D-4).
- [Las reglas semánticas como `LOW` pueden añadir ruido de nits] → El tope de LOW es STORY-185. Este diseño no añade reglas, solo deja de descartar las que el checklist ya declara.
- [El glob `gr-*security*` dejaría fuera un checklist de un consumidor con otro nombre] → Los enlaces desde `constitution.md` o el DoD siguen siendo fuente (D-2).

## Open Questions

Ninguna. Las decisiones de la historia quedan resueltas en D-1 a D-5.

## Autoevaluación (P9, P10)

- **Omisiones:** los tres ACs y los dos CNF tienen al menos un componente (C-1 a C-7) y un contrato de verificación (1 a 7).
- **Ambigüedad:** «el baseline embebido» de AC-2 y AC-3 se identifica por `checklist-sources: [baseline-embebido]` y la frase de la sección «Fuentes de checklist» que ya define el agente.
- **Nombres:** «informe parcial», «revisor» y «checklist de seguridad» se usan como en `SKILL.md` y en la historia. `{story_id}` es la notación de `SKILL.md`, y `$STORY_ID` sigue el estilo `$STORY_DIR` del bloque de contexto.
- **Estructura:** no hay dependencias cíclicas: el orquestador pasa datos a los revisores, los revisores escriben archivos y el árbitro los lee. Cada agente conserva una sola dimensión. Las interfaces I-1 e I-2 son un ID y una cadena de ruta.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-2 supone que el Security-Reviewer puede usar `gr-code-security-checklist.md` tal como está. Ese archivo y `gr-ai-security-checklist.md` usan métodos distintos de `grep` y reglas semánticas sin id, que el Paso 2a actual no reconoce. La historia no lo menciona.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna sobre `story.md`. Se resuelve en D-3 (I-4) dentro del alcance de C-5.
