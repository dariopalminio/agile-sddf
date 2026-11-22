---
alwaysApply: false
type: design
id: STORY-129
slug: STORY-129-migrar-analizadores-de-reverse-engineering-design
title: "Design: Migrar analizadores de reverse-engineering"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-129
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-129-migrar-analizadores-de-reverse-engineering
  - EPIC-24-agentes-locales-por-skill
  - invocacion-agentes-locales-de-skill
  - skills-independientes
  - best-practices-for-skills
---

<!-- Referencias -->
[[STORY-129-migrar-analizadores-de-reverse-engineering]] · [[EPIC-24-agentes-locales-por-skill]] · [[invocacion-agentes-locales-de-skill]] · [[skills-independientes]] · [[best-practices-for-skills]]

# Diseño técnico: migrar los analizadores de reverse-engineering a subagentes locales

## Context

Esta es la primera historia de [[EPIC-24-agentes-locales-por-skill]] y la de menor riesgo. Aplica la Regla 1 de ADR-0014 ([[skills-independientes]]) al skill `reverse-engineering`. Los cinco agentes globales `reverse-engineer-*` son **analizadores**: trabajan aislados, escriben sus intermedios en `.tmp/` (tras esta historia, en `.tmp/reverse-engineering/`) y devuelven el control. Por eso se convierten en **subagentes locales** del skill, invocados con el contrato de 4 pasos de ADR-0002 ([[invocacion-agentes-locales-de-skill]]).

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/reverse-engineer-{architect,product-discovery,business-analyst,ux-flow-mapper,synthesizer}.agent.md` | 5 archivos versionados con frontmatter de agente registrado (`name`, `tools`, `model: sonnet`), sin `output:` |
| `skills/reverse-engineering/assets/` | Directorio vacío, sin archivos versionados |
| `skills/reverse-engineering/SKILL.md` Fase 1 | Lanza los cuatro analizadores **por nombre global** y declara que escriben en `.tmp/reverse-engineering/rfc-*.md` |
| Cuerpo de los 4 analizadores | Escriben en `.tmp/rfc-*.md`, **en la raíz de `.tmp/`** (`architect.agent.md:128`, `business-analyst.agent.md:143`, `product-discovery.agent.md:94`, `ux-flow-mapper.agent.md:130,134`) |
| `reverse-engineer-synthesizer.agent.md:17` | Lee `.tmp/reverse-engineering/rfc-*.md` |
| `skills/reverse-engineering/evals/evals.json` | TC-001…TC-004; ninguno cita rutas de `agents/` ni nombres `reverse-engineer-*` |
| Otros skills con agentes locales | `story-code-review/agents/*.agent.md` y `story-verify/agents/*.agent.md`, que usan frontmatter `name`/`description`/`role`/`output` y se invocan como `general-purpose` |
| `package.json` → `files` | Incluye `skills/` (y con él `assets/`) y `agents/` |
| `test/install.test.js:126` y `scripts/smoke-package-install.js:226,236` | Comparan `agents/` del paquete con el destino instalado; tras la migración `agents/` conserva 5 archivos (`project-*`, `story-product-owner`) |
| `scripts/run-skill-shielder-audit.js` | Audita cada directorio de skill completo y, aparte, `agents/**/*.agent.md` |

**Inconsistencia previa:** antes de la migración, analizadores y synthesizer usan rutas de `.tmp/` distintas. El usuario eligió como canónica `.tmp/reverse-engineering/rfc-*.md` (ver D-3 y CR-001).

## Goals / Non-Goals

**Goals:**

- Los cinco analizadores viven en `skills/reverse-engineering/assets/agents/` y `agents/` no conserva ningún `reverse-engineer-*` // satisface: AC-1
- `SKILL.md` invoca los cuatro analizadores locales en paralelo y luego el synthesizer local, con el contrato de ADR-0002 // satisface: AC-1, CNF-2
- Los intermedios conservan nombres y formato (`rfc-architecture.md`, `rfc-features.md`, `rfc-business-rules.md`, `rfc-navigation.md`) bajo `.tmp/reverse-engineering/` // satisface: AC-1, CNF-1
- Si falta un subagente local, el skill se detiene antes de cualquier análisis, nombra el archivo que falta y no busca fuera de su directorio // satisface: AC-2
- `evals.json` cubre AC-1 y AC-2 // satisface: AC-1, AC-2

**Non-Goals:**

- No se migran los agentes entrevistadores (`project-*`, `story-product-owner`): son STORY-131…135.
- No se elimina la carpeta `agents/` ni se toca `package.json` → `files`: es el chore de cierre de la épica.
- No se reescribe el contenido analítico de los agentes (heurísticas, niveles de confianza, formato de informe).
- No se corrige la dependencia de `SKILL.md` hacia `skills/project-discovery/` (templates seed y `layer-materialization.md`): es acoplamiento entre skills, no hacia `agents/`, y queda fuera de AC-1 y AC-2.
- No se actualizan `docs/architecture/`, README raíz ni CHANGELOG, ni el resto de `docs/guides/`: la épica los excluye. La única excepción es el ejemplo de `reverse-engineering` de la guía de buenas prácticas (D-8, CR-002).
- No se crea `scripts/verify-skill-independence.js` (fuera de alcance según la épica).

## Decisions

### D-1 — Ubicación y nombres: `skills/reverse-engineering/assets/agents/<rol>.md` // satisface: AC-1

| Origen (`git mv`) | Destino |
|---|---|
| `agents/reverse-engineer-architect.agent.md` | `skills/reverse-engineering/assets/agents/architect.md` |
| `agents/reverse-engineer-product-discovery.agent.md` | `skills/reverse-engineering/assets/agents/product-discovery.md` |
| `agents/reverse-engineer-business-analyst.agent.md` | `skills/reverse-engineering/assets/agents/business-analyst.md` |
| `agents/reverse-engineer-ux-flow-mapper.agent.md` | `skills/reverse-engineering/assets/agents/ux-flow-mapper.md` |
| `agents/reverse-engineer-synthesizer.agent.md` | `skills/reverse-engineering/assets/agents/synthesizer.md` |

- **Elegida:** ruta y extensión `<rol>.md` de ADR-0014 (Regla 1), sin prefijo `reverse-engineer-`. Los nombres son los roles que usa la historia («architect, product-discovery, business-analyst, ux-flow-mapper y synthesizer»). Se usa `git mv` para conservar el historial.
- **Rechazada — `skills/reverse-engineering/agents/<nombre>.agent.md`** (patrón de `story-code-review`): contradice la ruta `assets/agents/` que fijan ADR-0014 y los criterios de salida de la épica.
- **Rechazada — conservar `reverse-engineer-<rol>.agent.md`:** mantendría en `SKILL.md` los mismos nombres que los agentes globales. Una búsqueda estática del criterio CS-1 («ningún SKILL.md referencia a un agente global») no podría distinguir una referencia local de una global. Además, el sufijo `.agent.md` choca con el `<rol>.md` que usan las demás historias de la épica (SMOKE-1: `discovery-pm.md`).

### D-2 — Frontmatter del subagente local: formato de agente local de la guía, sin `tools` ni `model` // satisface: AC-1, CNF-2

Se adopta el formato de «agente local» de [[best-practices-for-skills]] (`name`, `description`, `role`, `output`) y se conserva `alwaysApply: false`. Se retiran `tools:` y `model:`, que son de agentes registrados por el harness. La restricción de herramientas pasa al cuerpo, en una sección nueva `## Restricciones de ejecución`, porque el vehículo `general-purpose` no aplica `tools:` (ADR-0002, trade-off).

- **Rechazada — conservar `tools:`/`model:`:** el runtime ignora esos campos en un subagente genérico, así que darían una falsa garantía. Además, `model: sonnet` es específico de Claude y el skill debe funcionar en otros runtimes.
- **Rechazada — sin frontmatter:** se pierde `output:`, que es la fuente declarativa de la ruta que el orquestador verifica (D-6).

### D-3 — Ruta canónica de los intermedios: `.tmp/reverse-engineering/rfc-*.md` // satisface: AC-1, CNF-1

Los cuatro analizadores pasan a escribir en `.tmp/reverse-engineering/` con los mismos nombres de archivo y el mismo formato. `SKILL.md` (Fase 1 y Reglas) y el synthesizer ya usan esa ruta, así que no cambian. El cambio afecta solo a la línea de destino del cuerpo de cada analizador, más la mención del árbol ASCII en `ux-flow-mapper.md:130`. Lo decidió el usuario el 2026-10-15.

- **Rechazada — conservar `.tmp/rfc-*.md` en la raíz:** obliga a cambiar el synthesizer y `SKILL.md` (lo contrario de CNF-1), y viola la regla 1 de `.tmp/<skill>/` («nunca se comparte el directorio `.tmp/` raíz entre skills»).
- **Rechazada — escribir en ambas rutas:** duplica el contrato y deja dos fuentes de verdad.

### D-4 — Cambios mínimos en el cuerpo de los agentes // satisface: AC-1, CNF-1, CNF-2

Cambios en el cuerpo de cada archivo movido:

1. La línea `Escribe el resultado en …` apunta a la ruta de D-3 (solo los cuatro analizadores).
2. En la prosa, las menciones a `reverse-engineer-synthesizer` pasan a «el synthesizer del skill `reverse-engineering`».
3. Se añade `## Restricciones de ejecución`, con tres reglas: herramientas permitidas (las de su antiguo `tools:`; `architect` conserva `Bash` solo para comandos de lectura); escribir únicamente en su `output:` (el synthesizer, en `$STAGING_DIR` y `gaps.md`); y no lanzar subagentes ni invocar skills (CNF-2).

Se conservan sin cambios las secciones de análisis, los niveles de confianza, la estructura del informe y el valor de `**Generado por**`, que forma parte del formato del intermedio (CNF-1).

- **Rechazada — reescribir los agentes con el vocabulario nuevo en todo el cuerpo:** amplía el diff sin que lo pida ningún AC y pone en riesgo el formato que leen el synthesizer y los evals.

### D-5 — Verificación de presencia en Fase 0, sin fallback // satisface: AC-2

Fase 0 tiene un paso nuevo, justo después de resolver `$SPECS_BASE` y antes de resolver templates, calcular el inventario o hacer cualquier pregunta. El paso comprueba que existen los cinco archivos de D-1, con rutas relativas al directorio de este skill. Si falta alguno, el skill emite el mensaje de I-4 con **todos** los archivos que faltan y termina sin escribir ni lanzar nada.

- La redacción de `SKILL.md` expresa la ausencia de fallback sin nombrar la carpeta global, con la frase «no se buscan subagentes fuera del directorio de este skill». Si la nombrara, el criterio CS-1 contaría una referencia a `agents/` fuera de «Dependencias».
- **Rechazada — comprobar cada archivo justo antes de lanzarlo (Fase 1/2):** AC-2 exige detenerse «antes de lanzar analizadores». Si el synthesizer faltara, el error llegaría después de cuatro análisis, cuando ya se gastó la cuota y quizá el usuario ya respondió `Continuar`.
- **Rechazada — caer en el agente global si el local falta:** AC-2 lo prohíbe expresamente y reintroduce la dependencia que ADR-0014 elimina.

### D-6 — Invocación: contrato ADR-0002 con lanzamiento paralelo y degradación secuencial // satisface: AC-1, CNF-2

En Fase 1, por cada analizador, la sesión orquestadora lee su archivo local y lanza un subagente genérico (`general-purpose` en Claude Code). El prompt del subagente es el contenido íntegro del archivo más el bloque de contexto I-2. Los cuatro se lanzan **en el mismo turno**, para que corran en paralelo. Al terminar, el orquestador comprueba que existe el `output:` de cada uno. En Fase 2, lee `synthesizer.md` y lo lanza igual, con el bloque de contexto I-3. Ningún subagente recibe el contexto de la sesión.

Si el runtime no ofrece una herramienta para lanzar subagentes, la sesión ejecuta cada archivo **en sí misma, uno tras otro**, con el mismo bloque de contexto y las mismas rutas de salida. El contrato de `.tmp/` no cambia. Así se cubre el criterio de salida de la épica «funcionan en el runtime `codex`».

- **Rechazada — registrar los analizadores como tipos de agente del harness:** es justo lo que la historia retira; además, Codex no instala agentes (`agentsDirectory: null`).
- **Rechazada — leer los cinco archivos como roles en la sesión siempre:** se pierde el aislamiento de contexto que justifica que sean analizadores (ADR-0014, alternativa descartada). La lectura en sesión queda solo como degradación.

### D-7 — Evals: dos casos nuevos y ninguno modificado // satisface: AC-1, AC-2

`evals.json` añade dos casos y mantiene TC-001…TC-004 sin cambios (no citan rutas de `agents/`):

| ID | Tipo | Contexto | `contains` | `not_contains` |
|---|---|---|---|---|
| TC-005 | `fail-fast` | Falta `assets/agents/synthesizer.md`; los otros cuatro subagentes locales y los templates existen. | `❌ Subagente local no encontrado`, `assets/agents/synthesizer.md` | `agents/reverse-engineer-`, `FR-001`, `Continuar` |
| TC-006 | `happy-path` | Repositorio sin requisitos; existen los cinco subagentes locales y los templates. | `.tmp/reverse-engineering/rfc-architecture.md`, `assets/agents/architect.md` | `agents/reverse-engineer-architect`, `.tmp/rfc-` |

`.tmp/rfc-` no aparece como subcadena de `.tmp/reverse-engineering/rfc-`, así que la aserción de TC-006 distingue bien las dos rutas. TC-006 prohíbe la **ruta** global `agents/reverse-engineer-architect` y no el nombre suelto `reverse-engineer-architect`, porque D-4 conserva `**Generado por**: reverse-engineer-architect` en el intermedio y la salida del skill puede citarlo sin que eso sea una dependencia de `agents/`. Los evals no se ejecutan automáticamente (constitución, principio 14): se corren a mano con `npm run test:eval -- reverse-engineering`.

- **Rechazada — fixture de filesystem con el archivo borrado:** el runner simula el mundo a partir de la sección `input.context` (`scripts/run-evals.js:460`); una fixture no aporta cobertura extra.

### D-8 — Corregir el ejemplo `reverse-engineering` de la guía en esta historia // satisface: AC-1, CNF-1

`docs/guides/best-practices-for-skills.md`, sección «Ejemplo: skill `reverse-engineering`» (hoy l.194-204), es el ejemplo canónico del patrón `.tmp/<skill-name>/`, y tras AC-1 nombraría agentes que ya no existen. Se reescribe después de la migración, sin tocar el resto de la guía:

```
.tmp/reverse-engineering/
├── rfc-architecture.md       # escrito por el subagente local architect
├── rfc-features.md           # escrito por el subagente local product-discovery
├── rfc-business-rules.md     # escrito por el subagente local business-analyst
└── rfc-navigation.md         # escrito por el subagente local ux-flow-mapper
```

El párrafo siguiente queda así: «El subagente local `synthesizer` (`skills/reverse-engineering/assets/agents/synthesizer.md`) lee solo esos cuatro archivos para generar la propuesta, sin acceder al contexto de la sesión principal.»

- **Elegida:** corregir dentro de esta historia. Son unas 6 líneas, y la regla de veracidad de `AGENTS.md` prevalece sobre la exclusión genérica de docs de la épica: el ejemplo describiría una estructura inexistente desde el merge de esta historia.
- **Rechazada — dejarlo para el chore de cierre de EPIC-24:** el ejemplo quedaría falso durante STORY-131…135.
- **Rechazada — editar la guía durante el planning:** describiría subagentes locales que aún no existen. La edición va en la implementación, después del `git mv` (T002).
- **Fuera de alcance:** la sección «Patrón de invocación de agentes locales (`<skill>/agents/`)» de la misma guía sigue describiendo el patrón de `story-code-review` y `story-verify` (ver Risks, «Divergencia entre skills»).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Subagente local architect | mover + adaptar frontmatter y cuerpo (D-1…D-4) | `skills/reverse-engineering/assets/agents/architect.md` | AC-1, CNF-1, CNF-2 |
| Subagente local product-discovery | mover + adaptar | `skills/reverse-engineering/assets/agents/product-discovery.md` | AC-1, CNF-1, CNF-2 |
| Subagente local business-analyst | mover + adaptar | `skills/reverse-engineering/assets/agents/business-analyst.md` | AC-1, CNF-1, CNF-2 |
| Subagente local ux-flow-mapper | mover + adaptar | `skills/reverse-engineering/assets/agents/ux-flow-mapper.md` | AC-1, CNF-1, CNF-2 |
| Subagente local synthesizer | mover + adaptar frontmatter y referencias (su ruta de lectura no cambia) | `skills/reverse-engineering/assets/agents/synthesizer.md` | AC-1, CNF-1, CNF-2 |
| Agentes globales `reverse-engineer-*` | eliminar (consecuencia del `git mv`) | `agents/reverse-engineer-*.agent.md` | AC-1 |
| Orquestador | modificar Fase 0 (D-5), Fase 1 y Fase 2 (D-6) | `skills/reverse-engineering/SKILL.md` | AC-1, AC-2, CNF-2 |
| Evals del skill | añadir TC-005 y TC-006 (D-7) | `skills/reverse-engineering/evals/evals.json` | AC-1, AC-2 |
| Guía de buenas prácticas | modificar solo la sección «Ejemplo: skill `reverse-engineering`» (D-8) | `docs/guides/best-practices-for-skills.md` | AC-1, CNF-1 |
| `package.json`, `config/runtimes.json`, `test/install.test.js`, `scripts/smoke-package-install.js` | sin cambio: `skills/` ya publica `assets/` y `agents/` sigue con 5 archivos | — | — |
| `skills/reverse-engineering/README.md` | sin cambio: no nombra agentes | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de subagente local | Frontmatter: `alwaysApply: false`, `name: <rol>`, `description` (empieza por «Subagente del skill reverse-engineering» y termina con «Invocado exclusivamente por el orquestador reverse-engineering — no invocar directamente»), `role: <rol interpretativo actual>`, `output: <ruta de D-3 o I-5>`. El cuerpo incluye `## Restricciones de ejecución` (D-4). | AC-1, CNF-2 |
| I-2 — Bloque de contexto de un analizador | `$TARGET_PATH` (raíz del repositorio objetivo o valor de `--focus`) y `$REQUIREMENT_TEMPLATE_PATH`. La ruta de salida no se pasa: viaja en el `output:` del propio archivo. | AC-1 |
| I-3 — Bloque de contexto del synthesizer | El mismo que hoy define Fase 2: los cuatro intermedios, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$STAKEHOLDERS_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US`, `$UPDATE_MODE`, `$STAGING_DIR` | AC-1, CNF-1 |
| I-4 — Error de subagente ausente | Una línea por archivo ausente: `❌ Subagente local no encontrado: assets/agents/<rol>.md (skill reverse-engineering).`, seguida de `Reinstala el skill; no se lanzó ningún análisis.` Termina sin escribir. | AC-2 |
| I-5 — Intermedios (sin cambio de nombre ni formato) | `architect` → `.tmp/reverse-engineering/rfc-architecture.md`; `product-discovery` → `rfc-features.md`; `business-analyst` → `rfc-business-rules.md`; `ux-flow-mapper` → `rfc-navigation.md`; `synthesizer` → `output: .tmp/reverse-engineering/proposal/manifest.md` (además escribe la propuesta en `$STAGING_DIR` y `.tmp/reverse-engineering/gaps.md`) | AC-1, CNF-1 |
| I-6 — Aviso de intermedio ausente | `⚠️ <rol> no produjo <ruta>; la síntesis continúa con los intermedios disponibles.`; se repite en el informe final de Fase 3 | AC-1 (P7) |

## Esquema de datos

Frontmatter de un subagente local (abstracto; los valores concretos los fija I-1/I-5):

| Clave | Tipo | Ejemplo (`architect.md`) |
|---|---|---|
| `alwaysApply` | booleano | `false` |
| `name` | string kebab | `architect` |
| `description` | string | `Subagente del skill reverse-engineering. Analiza la estructura técnica… Invocado exclusivamente por el orquestador reverse-engineering — no invocar directamente.` |
| `role` | string | `Architecture Reverse Engineer` |
| `output` | ruta relativa a la raíz del repositorio | `.tmp/reverse-engineering/rfc-architecture.md` |

Árbol resultante de `.tmp/reverse-engineering/` (sin cambios respecto de lo que ya leen el synthesizer y Fase 3):

| Archivo | Escritor |
|---|---|
| `rfc-architecture.md` | architect |
| `rfc-features.md` | product-discovery |
| `rfc-business-rules.md` | business-analyst |
| `rfc-navigation.md` | ux-flow-mapper |
| `proposal/manifest.md`, `proposal/product/…`, `proposal/requirements/…` | synthesizer |
| `gaps.md` | synthesizer |

## Flujos clave

### F-1 — Ejecución normal (AC-1)

1. Fase 0 resuelve `$SPECS_BASE` y comprueba que existen los cinco archivos de `assets/agents/` (D-5): todos presentes.
2. Fase 0 sigue igual que hoy: templates, inventario y aviso o plan inicial.
3. Fase 1 borra solo los cuatro `rfc-*.md` de `.tmp/reverse-engineering/` (ver «Decisiones de complejidad justificada»), lee los cuatro archivos de los analizadores y los lanza en el mismo turno con I-2.
4. Cada subagente escribe su `output:` (I-5) y devuelve el control; no lanza a ningún otro.
5. El orquestador comprueba que existen los cuatro intermedios (I-6 si falta alguno).
6. Fase 2 lee `synthesizer.md` y lo lanza con I-3. El synthesizer escribe la propuesta, `manifest.md` y `gaps.md`.
7. Fase 3 no cambia.

### F-2 — Falta un subagente local (AC-2)

1. Fase 0 resuelve `$SPECS_BASE` y detecta que falta, por ejemplo, `assets/agents/synthesizer.md`.
2. Emite I-4 y termina: no pide templates, no hace preguntas, no crea `.tmp/` ni busca el archivo fuera del directorio del skill.

### F-3 — Runtime sin herramienta de subagentes (P7, D-6)

1. Igual que F-1 hasta el paso 3.
2. La sesión ejecuta cada analizador en sí misma, uno tras otro, con I-2, y escribe los mismos `rfc-*.md`. Después ejecuta el synthesizer con I-3.

### F-4 — Un analizador no produce su intermedio (P7)

1. Tras Fase 1 falta, por ejemplo, `rfc-navigation.md`.
2. El orquestador emite I-6 y continúa. El synthesizer trabaja con los intermedios presentes (lee el patrón `rfc-*.md`) y el informe final repite el aviso.

## Decisiones de complejidad justificada

- **Borrar los cuatro `rfc-*.md` antes de Fase 1.** Sin este paso, un intermedio de una ejecución anterior pasaría la comprobación de F-1 paso 5 y el synthesizer mezclaría datos obsoletos. Solo se borran esos cuatro archivos. `proposal/` y `gaps.md` los regenera el synthesizer. Es una línea de `SKILL.md`; mantener una lista de intermedios con fecha sería más complejo.
- **Degradación secuencial (F-3).** Es una sola frase en `SKILL.md`, sin archivos ni mecanismos nuevos, y permite que el skill funcione en runtimes sin subagentes. No se añade detección de runtime: la sesión sabe si dispone de la herramienta.
- **Sin script de verificación nuevo.** La verificación usa `grep`, `git ls-files` y los gates existentes (tabla siguiente), en línea con la exclusión de `verify-skill-independence.js` en la épica.
- **Autoevaluación estructural (P9/P11).** La única dependencia es orquestador → archivo local (vía `output:`) y analizadores → synthesizer (vía archivos en `.tmp/`); no hay ciclos. Cada subagente tiene una sola responsabilidad y escribe un único destino. Las interfaces I-2 e I-3 son estrechas y no exponen el contexto de la sesión.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existen los cinco subagentes locales | `git ls-files skills/reverse-engineering/assets/agents` lista exactamente `architect.md`, `business-analyst.md`, `product-discovery.md`, `synthesizer.md`, `ux-flow-mapper.md` | AC-1 |
| 2 | `agents/` no contiene ningún `reverse-engineer-*` | `git ls-files "agents/reverse-engineer-*"` sin salida | AC-1 |
| 3 | `SKILL.md` no referencia la carpeta global ni nombres globales | `grep -n "agents/" skills/reverse-engineering/SKILL.md \| grep -v "assets/agents/"` sin salida; `grep -n "reverse-engineer-" skills/reverse-engineering/SKILL.md` sin salida | AC-1, AC-2 |
| 4 | Los analizadores escriben en la ruta canónica | `grep -rn "\.tmp/rfc-" skills/reverse-engineering/assets/agents` sin salida; `grep -rln "\.tmp/reverse-engineering/rfc-" skills/reverse-engineering/assets/agents` lista los cuatro analizadores y el synthesizer (que los lee) | AC-1, CNF-1 |
| 5 | Nombres y formato de los intermedios intactos | `git diff -M main -- agents skills/reverse-engineering/assets/agents` (ambas rutas, para que git empareje los renombrados) muestra cinco renombrados con solo cambios en frontmatter, línea de salida, menciones al synthesizer y la sección `Restricciones de ejecución` | CNF-1 |
| 6 | Ningún subagente local delega | Cada archivo de `assets/agents/` contiene `## Restricciones de ejecución` con la prohibición de lanzar subagentes o skills; revisión en `story-code-review` | CNF-2 |
| 7 | Comportamiento de AC-1 y AC-2 | `npm run test:eval -- reverse-engineering` (manual): TC-001…TC-006 en verde | AC-1, AC-2 |
| 8 | Gate determinista | `npm run verify:repository` termina con exit 0 (incluye las pruebas de `install`, el smoke del tarball y la auditoría de enlaces) | AC-1 |
| 9 | La guía describe la estructura real | `grep -n "reverse-engineer-" docs/guides/best-practices-for-skills.md` sin salida; la sección «Ejemplo: skill `reverse-engineering`» muestra `.tmp/reverse-engineering/` y nombra `skills/reverse-engineering/assets/agents/synthesizer.md` | AC-1, CNF-1 |

## Risks / Trade-offs

- **[Coste] Sin `model: sonnet`, el subagente genérico hereda el modelo de la sesión** → los análisis pueden costar más con un modelo grande. Mitigación: es el mismo trade-off que acepta ADR-0002 para los agentes locales. Un runtime que permita elegir modelo por subagente puede hacerlo sin cambiar los archivos.
- **[Entorno local] Siguen instaladas copias de los agentes globales** → `.claude/agents/reverse-engineer-*.agent.md` (y `.claude/skills/reverse-engineering/` sin `assets/agents/`) son salida de instalación no versionada, y `install` no borra archivos retirados. Durante el dogfooding, el harness seguiría ofreciendo `reverse-engineer-*` como tipos de subagente. Mitigación: tras implementar, reinstalar con `npx agile-sddf install --target claude-code --force` y borrar a mano esas cinco copias. `SKILL.md` invoca por ruta local, no por tipo, así que una copia residual no altera el flujo.
- **[Restricción de herramientas declarativa]** → el subagente genérico no aplica `tools:` de forma técnica; la restricción depende de las instrucciones (D-4). Es el trade-off documentado en ADR-0002.
- **[Eval TC-006 y `Generado por`]** → D-4 conserva `**Generado por**: reverse-engineer-<rol>` en los intermedios (CNF-1), así que la salida del skill puede citar el nombre antiguo. Mitigación: TC-006 prohíbe la ruta `agents/reverse-engineer-architect`, no el nombre (D-7).
- **[Documentación desfasada]** → el ejemplo de `docs/guides/best-practices-for-skills.md:194-204` nombra los agentes globales. Mitigación: D-8 lo corrige en esta historia. Otras menciones fuera de la guía no existen hoy (`grep -rn "reverse-engineer-" docs/guides docs/architecture README.md` solo encuentra ese ejemplo).
- **[Divergencia entre skills]** → `story-code-review` y `story-verify` siguen usando `<skill>/agents/*.agent.md`. Se acepta: su migración a `assets/agents/` no forma parte de EPIC-24.

## Open Questions

Ninguna. La ruta canónica de `.tmp/` (la única ambigüedad que bloqueaba el diseño) la resolvió el usuario el 2026-10-15 (D-3).

## Registro de Cambios (CR)

### CR-001

- **Tipo**: ambigüedad
- **Descripción**: AC-1 exige que «cada analizador escribe su resultado en la misma ruta de `.tmp/` que antes de la migración». Antes de la migración había dos rutas que se contradecían: los analizadores escribían en `.tmp/rfc-*.md`, mientras que `SKILL.md` y el synthesizer usaban `.tmp/reverse-engineering/rfc-*.md`. El diseño adopta `.tmp/reverse-engineering/rfc-*.md` (D-3, decisión del usuario).
- **Documento afectado**: story.md
- **Estado**: aplicado en story.md el 2026-10-15 (AC-1, CNF-1 y notas con CS-5 y CS-9).
- **Acción requerida**: precisar AC-1 como «…escribe su resultado en `.tmp/reverse-engineering/` con el mismo nombre de archivo que antes de la migración», y en CNF-1 cambiar el patrón `.tmp/rfc-*.md` por `.tmp/reverse-engineering/rfc-*.md`. De paso, se puede citar en las notas el criterio de salida CS-5 de la épica («Los agentes analizadores (`reverse-engineer-*`) son subagentes locales que invoca `reverse-engineering`»), como sugiere `epic-analyze-report.md`.

### CR-002

- **Tipo**: dependencia
- **Descripción**: `docs/guides/best-practices-for-skills.md` (sección «Ejemplo: skill `reverse-engineering`») muestra los intermedios en `.tmp/` raíz, escritos por `reverse-engineer-*`. Tras esta historia, el ejemplo describe una estructura que no existe, lo que choca con la regla de veracidad de `AGENTS.md`. La épica deja fuera la actualización de docs.
- **Documento afectado**: design.md (fuera de alcance) / epic.md
- **Acción requerida**: decidir si el ejemplo se corrige dentro de esta historia (cambio de unas 10 líneas) o pasa al chore de documentación del cierre de EPIC-24. Esta decisión no bloquea la implementación.
- **Estado**: resuelto el 2026-10-15. El ejemplo se corrige dentro de esta historia (D-8, componente «Guía de buenas prácticas», contrato 9). La edición se hace en la implementación, después de la migración. El cambio parcial que ya existe en el árbol de trabajo (ruta `.tmp/reverse-engineering/` en el árbol ASCII) se conserva y se completa en esa tarea.
