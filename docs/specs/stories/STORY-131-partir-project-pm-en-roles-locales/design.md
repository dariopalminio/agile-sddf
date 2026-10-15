---
alwaysApply: false
type: design
id: STORY-131
slug: STORY-131-partir-project-pm-en-roles-locales-design
title: "Design: Partir project-pm en roles locales"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-131
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-131-partir-project-pm-en-roles-locales
  - EPIC-24-agentes-locales-por-skill
  - skills-independientes
  - STORY-129-migrar-analizadores-de-reverse-engineering-design
---

<!-- Referencias -->
[[STORY-131-partir-project-pm-en-roles-locales]] · [[EPIC-24-agentes-locales-por-skill]] · [[skills-independientes]] · [[STORY-129-migrar-analizadores-de-reverse-engineering-design]]

# Diseño técnico: partir `project-pm` en los roles locales `begin-intent` y `discovery-pm`

## Context

Es la primera historia de [[EPIC-24-agentes-locales-por-skill]] que migra un agente **entrevistador**. Aplica la Regla 1 de ADR-0014 ([[skills-independientes]]): un entrevistador pasa a ser un **archivo de rol** que lee y ejecuta la sesión del skill, no un subagente. La sesión del skill siempre puede preguntar al usuario; un subagente no siempre (Codex no instala agentes: `agentsDirectory: null`). Esta historia fija el formato de rol que reutilizarán STORY-132…135.

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/project-pm.agent.md` | 57 líneas. Frontmatter de agente registrado (`name`, `description`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`). Cuerpo: intro (l.14), `## Principios de PM` (l.16-21), `## Protocolo de Resiliencia para Entrevistas Multivuelta` (l.23-28), `## Estado Visión — …` (l.30-43), `## Estado Discovery — …` (l.45-57) |
| `skills/project-begin/SKILL.md` | Nombra `project-pm` en `description` (l.4), Objetivo (l.18, l.24), Dependencias (l.41) y Paso 3 «Delegar a `project-pm`» (l.97-105) |
| `skills/project-discovery/SKILL.md` | Nombra `project-pm` en Dependencias (l.27) y Paso 4 (l.71). Pasos 5 y 6 siguen invocando `project-ux` y `project-architect` (STORY-133, STORY-132) |
| `skills/project-begin/README.md:9` | «con el agente `project-pm`» |
| `skills/project-begin/assets/vision-template.md:2-8` y `docs/templates/vision-template.md:2-8` | Comentarios `# escritor: … (project-pm)`. Los dos archivos son idénticos byte a byte |
| `docs/guides/harness-eng-agents-orchestration.md:182` | Presenta `project-pm` como «Excepción documentada — Subagente interactivo» |
| `skills/project-begin/evals/evals.json` | TC-001…TC-006; ninguno cita `project-pm` ni rutas de `agents/` |
| `skills/project-discovery/evals/evals.json` | TC-001…TC-006; ninguno cita `project-pm` ni rutas de `agents/` |
| `skills/*/assets/agents/` | No existe en ningún skill. STORY-129 (aún sin implementar) crea `skills/reverse-engineering/assets/agents/` para subagentes analizadores |
| `scripts/run-evals.js:453` | El runner simula el skill leyendo `SKILL.md` y el bloque `input.context` |
| Tests de instalación | `test/install.test.js` y `scripts/smoke-package-install.js` comparan `agents/` de forma dinámica; aceptan 9 archivos en lugar de 10 |

## Goals / Non-Goals

**Goals:**

- `skills/project-begin/assets/agents/begin-intent.md` y `skills/project-discovery/assets/agents/discovery-pm.md` existen, y `agents/project-pm.agent.md` no // satisface: AC-1
- Cada skill lee su rol y conduce la entrevista en su propia sesión, sin lanzar ningún subagente para el PM // satisface: AC-1
- Si falta el rol, cada skill se detiene antes de cualquier pregunta o escritura, informa la ruta y no busca fuera de su directorio // satisface: AC-2
- Las cuatro secciones de `project-pm` quedan repartidas según la tabla de CNF-1, y cada rol tiene menos de 57 líneas // satisface: CNF-1, CNF-2
- Ningún archivo de `skills/project-begin/`, `skills/project-discovery/`, `docs/templates/vision-template.md` ni la guía de orquestación nombra `project-pm` // satisface: AC-1

**Non-Goals:**

- No se migran `project-ux` ni `project-architect`: los pasos 5 y 6 de `project-discovery` siguen invocándolos (STORY-133 y STORY-132).
- No se reescribe el contenido de PM (preguntas, reglas de escritura, marcas `[inferido]`).
- No se tocan `FR-008`, `FR-009`, `NFR-015`, `docs/product/roadmap.md` ni `docs/index.md`. Sus menciones a `project-pm` son trazabilidad histórica o quedan para el chore de documentación del cierre de EPIC-24 (ver Risks).
- No se toca `package.json` → `files` ni `config/runtimes.json`: `skills/` ya publica `assets/` y `agents/` sigue con 9 archivos.
- No se cambia `skills/project-flow/`: compone `/project-begin` y `/project-discovery` y no nombra `project-pm` (ADR-0014, Regla 3).

## Decisions

### D-1 — Ubicación y nombres de los roles // satisface: AC-1

| Origen | Destino | Operación |
|---|---|---|
| `agents/project-pm.agent.md` (intro + Principios + Protocolo + Estado Visión) | `skills/project-begin/assets/agents/begin-intent.md` | `git mv` y luego se borra la sección Discovery |
| `agents/project-pm.agent.md` (intro + Principios + Protocolo + Estado Discovery) | `skills/project-discovery/assets/agents/discovery-pm.md` | archivo nuevo |

- **Elegida:** nombres y ruta de ADR-0014 y de la historia (`<rol>.md` en `assets/agents/`). El `git mv` hacia `begin-intent.md` conserva el historial de la parte mayor.
- **Rechazada — un solo `pm.md` compartido en un directorio común:** reintroduce el acoplamiento entre skills que ADR-0014 elimina, y obliga a cada skill a cargar la fase que no le toca (contrario a CNF-2).
- **Rechazada — `discovery-pm.md` como copia íntegra y recorte posterior:** dos copias de 57 líneas durante la implementación hacen más difícil revisar CNF-1. Es más claro partir desde el original.

### D-2 — Formato del archivo de rol: frontmatter mínimo, sin `tools`, `model` ni `output` // satisface: AC-1, CNF-2

Frontmatter: `alwaysApply: false`, `name: <rol>`, `description`, `role`. Detalle en I-1.

- Se retiran `tools:` y `model:`. Un archivo que lee la sesión no es un agente registrado, así que el runtime nunca aplica esos campos. `model: sonnet` además solo existe en Claude.
- No se añade `output:`. En STORY-129 `output:` es una ruta literal que el orquestador comprueba después de lanzar un subagente. Aquí la ruta llega como variable resuelta por el skill (`$VISION_PATH` depende de `$SPECS_BASE`), y el cuerpo ya declara `**Output:**`. Añadirlo daría dos fuentes del mismo contrato.
- **Rechazada — mismo frontmatter que los subagentes de STORY-129 (con `output:`):** `begin-intent` no puede declarar una ruta literal sin derivar la raíz, lo que prohíbe la propia intro del rol.
- **Rechazada — sin frontmatter:** se pierde `description`, que deja claro que el archivo es interno del skill (ADR-0014, Regla 2). Además, rompe la uniformidad con los archivos locales que ya existen (`skills/story-code-review/agents/*.agent.md`, `skills/story-verify/agents/*.agent.md`), que tienen `name` y `description`.

### D-3 — Cambios mínimos en el cuerpo de los roles // satisface: AC-1, CNF-1, CNF-2

Las secciones de `project-pm.agent.md` se copian tal cual, salvo estos tres ajustes:

1. **Intro (l.14):** «Actúas en los estados **Visión** y **Discovery**» pasa a «Actúas en el estado **Visión** del skill `project-begin`» o «… **Discovery** del skill `project-discovery`». Se conserva «Las rutas siempre llegan resueltas desde el skill orquestador: no las derives».
2. **Protocolo, paso 1:** «Usa `AskUserQuestion` para preguntas con opciones…» pasa a «Usa `AskUserQuestion`, si el runtime la ofrece, para preguntas con opciones…». El paso 2 ya define la alternativa inline. Así el protocolo vale en Codex sin perder ninguna instrucción.
3. **Estado Visión, paso 6:** «devuelve el control al skill» pasa a «devuelve el control al flujo del skill». Ya no hay un subagente que retorna, pero el rol termina igual y el skill sigue con su gate.

Reparto de secciones (CNF-1):

| Sección | `begin-intent.md` | `discovery-pm.md` |
|---|:---:|:---:|
| `## Principios de PM` | ✓ | ✓ |
| `## Protocolo de Resiliencia para Entrevistas Multivuelta` | ✓ | ✓ |
| `## Estado Visión — Capturar y refinar la visión del producto` | ✓ | — |
| `## Estado Discovery — Discovery de usuarios y refinamiento` | — | ✓ |

Los encabezados se conservan literales para que CNF-1 se compruebe con `grep` (contrato 4). Tamaño previsto: unas 40 líneas para `begin-intent.md` y unas 37 para `discovery-pm.md`, por debajo de 57 (CNF-2).

- **Rechazada — reescribir los roles con el vocabulario de «sesión» en todo el cuerpo:** amplía el diff sin que lo pida ningún AC y dificulta revisar CNF-1.
- **Rechazada — extraer Principios y Protocolo a un archivo común:** ADR-0014 acepta duplicar unas 10-30 líneas compartidas antes que mantener el acoplamiento.

### D-4 — Mecanismo: la sesión lee el rol y lo ejecuta en línea // satisface: AC-1

- `project-begin`, Paso 3, se renombra a «Paso 3 — Entrevista con el rol `begin-intent`». La sesión lee `assets/agents/begin-intent.md` (relativo al directorio del skill) y sigue su `## Estado Visión` con las variables ya resueltas (I-2). El bloque de instrucciones actual del Paso 3 (dos fases, 3-4 preguntas, `full`/`resume`, escritura) se conserva como parametrización. Se añade una frase: «Esta sesión conduce la entrevista; no lances un subagente para este paso».
- `project-discovery`, Paso 4: la sesión lee `assets/agents/discovery-pm.md` y sigue su `## Estado Discovery` con I-2. Se define `$DISCOVERY_SUMMARY_PATH = .tmp/project-discovery/discovery-summary.md` y se pasa como `$OUTPUT_PATH` del rol. Hoy los pasos 5 y 6 usan `$DISCOVERY_SUMMARY_PATH` sin definirlo; con esto el nombre queda explícito para STORY-132 y STORY-133.
- **Rechazada — lanzar el rol local como subagente genérico (patrón de STORY-129):** un subagente puede no poder preguntar al usuario, que es justo el motivo de AC-1 y de ADR-0014.
- **Rechazada — integrar el contenido del rol en el `SKILL.md`:** contradice la ubicación que fijan ADR-0014 y la historia, y dificulta que el rol evolucione por separado.

### D-5 — Verificación de presencia al final del Paso 0, sin fallback // satisface: AC-2, AC-1

Al final del Paso 0, justo después de resolver `$SPECS_BASE`, cada skill comprueba que su rol existe, con la ruta relativa al directorio del skill:

- `project-begin`: `assets/agents/begin-intent.md`. Va antes del Paso 1 (template) y del Paso 2. Así, con una visión `DONE` no llega a preguntar `Actualizar`/`Cancelar`.
- `project-discovery`: `assets/agents/discovery-pm.md`. Va antes del Paso 1 (validar visión) y del Paso 3, que limpia `.tmp/project-discovery/proposal/`.

Si el rol falta, el skill emite I-3 y termina sin preguntar, escribir ni crear `.tmp/`. La ausencia de fallback se redacta sin nombrar la carpeta global: «no se buscan roles fuera del directorio de este skill». Si `SKILL.md` la nombrara, contaría para el criterio de salida «ningún `SKILL.md` referencia `agents/` fuera de "Dependencias"».

- **`project-discovery` también comprueba**, aunque AC-2 solo lo exige para `project-begin`. Sin la comprobación, la sesión podría improvisar el Discovery de PM, o un runtime con copias residuales (ver Risks) podría usar el agente global. AC-1, fila `project-discovery`, exige que lea **su** rol. STORY-132 y STORY-133 añadirán sus roles a la misma lista.
- **Rechazada — comprobar justo antes del paso de entrevista:** en `project-begin` el usuario ya habría respondido `Actualizar` y, en `project-discovery`, ya se habría limpiado el staging. AC-2 pide detenerse sin efectos.
- **Rechazada — recurrir al agente global si el rol local falta:** AC-2 lo prohíbe y reintroduce la dependencia.

### D-6 — Textos que dejan de nombrar `project-pm` // satisface: AC-1

| Archivo | Cambio |
|---|---|
| `skills/project-begin/SKILL.md` `description` | «mediante una entrevista de intención con project-pm» → «mediante una entrevista de intención que conduce la sesión con su rol local begin-intent». El resto de la descripción y los `triggers` no cambian |
| `skills/project-begin/SKILL.md` Objetivo | «con el agente `project-pm`» → «siguiendo el rol local `assets/agents/begin-intent.md`»; «Delega la entrevista y la escritura inicial a `project-pm`» → «Conduce la entrevista y la escritura inicial con el rol `begin-intent`» |
| `skills/project-begin/SKILL.md` Dependencias | «Agente: `project-pm`» → «Rol local: `assets/agents/begin-intent.md` (entrevistador, lo lee esta sesión)» |
| `skills/project-discovery/SKILL.md` Dependencias | «Agentes `project-pm`, `project-ux` y `project-architect`, invocados secuencialmente por esta sesión» → «Rol local `assets/agents/discovery-pm.md` (entrevistador, lo lee esta sesión). Agentes `project-ux` y `project-architect`, invocados secuencialmente por esta sesión» |
| `skills/project-discovery/SKILL.md` Restricciones | «Los agentes reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente» → «El rol y los agentes reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente» |
| `skills/project-begin/README.md:9` | «con el agente `project-pm`» → «con su rol local de entrevista `begin-intent`, que conduce la propia sesión del skill» |
| `skills/project-begin/assets/vision-template.md:2-8` y `docs/templates/vision-template.md:2-8` | `(project-pm)` → `(rol begin-intent)` en las líneas 2-5, 7 y 8; línea 6: `# escritor: project-begin (rol begin-intent: IN-PROGRESS · DONE tras confirmar)`. Los dos archivos se editan igual y siguen idénticos (decisión del usuario del 2026-10-15, CR-001) |

- **Rechazada — conservar `project-pm` en los comentarios `# escritor:`:** nombrarían un agente que ya no existe, en contra de la regla de veracidad de `AGENTS.md`. Esos comentarios no se renderizan (`test/requirements.test.js:100` solo comprueba que no se copien), así que el cambio no afecta a la salida.
- **Rechazada — editar solo el seed:** la copia central divergiría del seed sin motivo funcional.

### D-7 — Corregir la excepción de la guía de orquestación // satisface: AC-1

`docs/guides/harness-eng-agents-orchestration.md:182` se reescribe en la implementación, después del `git rm`:

> **Excepción en retirada — Subagentes interactivos:** algunos entrevistadores se crearon como subagentes, en contra de la condición #1. ADR-0014 los convierte en archivos de rol que lee la sesión del skill, que sí puede preguntar al usuario. `project-pm` ya se partió en `begin-intent` (`project-begin`) y `discovery-pm` (`project-discovery`). Los entrevistadores que siguen en `agents/` violan la condición #1 hasta su migración (EPIC-24) y degradan a inferencia con su **Protocolo de Resiliencia** cuando no hay respuesta.

- **Elegida:** corregir en esta historia (decisión del usuario del 2026-10-15, CR-002). Es el mismo criterio que D-8 de STORY-129. El párrafo no nombra a los entrevistadores pendientes, para que STORY-132…135 no tengan que editarlo cada vez.
- **Rechazada — dejarlo para el chore de cierre:** la guía describiría como vigente un subagente que ya no existe durante el resto de la épica.

### D-8 — Evals: dos casos nuevos por skill, ninguno modificado // satisface: AC-1, AC-2

Los casos TC-001…TC-006 de los dos skills no citan `project-pm`, así que no cambian.

| Skill | ID | Tipo | Contexto | `contains` | `not_contains` |
|---|---|---|---|---|---|
| `project-begin` | TC-007 | `fail-fast` | Existen `docs/templates/vision-template.md` y `docs/product/vision.md` con `substatus: TODO`. No existe `skills/project-begin/assets/agents/begin-intent.md`. | `❌ Rol local no encontrado`, `assets/agents/begin-intent.md` | `agents/project-p\u006d`, `substatus: IN-PROGRESS` |
| `project-begin` | TC-008 | `happy-path` | No existe `docs/product/vision.md`. Existen `docs/templates/vision-template.md` y `skills/project-begin/assets/agents/begin-intent.md`. No existe la carpeta `agents/`. El desarrollador responde la entrevista y elige `Confirmar`. | `begin-intent.md`, `substatus: DONE`, `/project-discovery` | `agents/project-p\u006d`, `project-p\u006d.agent.md` |
| `project-discovery` | TC-007 | `happy-path` | `vision.md` tiene `substatus: DONE`; los requisitos están vacíos; existen los dos templates y `skills/project-discovery/assets/agents/discovery-pm.md`; no existe `agents/project-p\u006d.agent.md`; los agentes de UX y de arquitectura devuelven sus resultados. | `discovery-pm.md`, `.tmp/project-discovery/discovery-summary.md` | `agents/project-p\u006d` |
| `project-discovery` | TC-008 | `fail-fast` | `vision.md` tiene `substatus: DONE`; existen los templates; no existe `skills/project-discovery/assets/agents/discovery-pm.md`. | `❌ Rol local no encontrado`, `assets/agents/discovery-pm.md` | `agents/project-p\u006d`, `discovery-summary.md`, `Confirmar` |

Las aserciones prohíben la **ruta** `agents/project-pm`, no la palabra «subagente», porque `SKILL.md` dice «no lances un subagente» y la salida puede citarlo. Los evals se corren a mano (`npm run test:eval -- project-begin` y `-- project-discovery`), según `AGENTS.md`.

**Regla de escape (CR-003):** en la tabla, los valores se muestran tal como se escriben en `evals.json`. Toda aparición de `project-pm` en `input.context`, `contains` o `not_contains` se escribe `project-p\u006d` (`\u006d` = `m`), con la misma convención que TC-001 de `project-discovery` (`01-proj\u0065cts`). `JSON.parse` devuelve el texto real (`agents/project-pm`), así que el runner ve el mismo contexto y la misma aserción. Sin el escape, el contrato 3 (`git grep -n "project-pm" -- skills …`) encontraría esas líneas de `evals.json` y fallaría.

- **Rechazada — fixture de filesystem sin el rol:** el runner simula el mundo desde `input.context` (`scripts/run-evals.js:453`), así que una fixture no aporta cobertura extra.
- **Rechazada — excluir `evals.json` del contrato 3:** dejaría sin vigilar archivos de `skills/` que AC-1 cubre.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Rol `begin-intent` | crear (vía `git mv` + recorte, D-1…D-3) | `skills/project-begin/assets/agents/begin-intent.md` | AC-1, CNF-1, CNF-2 |
| Rol `discovery-pm` | crear (D-1…D-3) | `skills/project-discovery/assets/agents/discovery-pm.md` | AC-1, CNF-1, CNF-2 |
| Agente global `project-pm` | eliminar (consecuencia del `git mv`) | `agents/project-pm.agent.md` | AC-1, AC-2 |
| Orquestador `project-begin` | modificar `description`, Objetivo, Dependencias, Paso 0 (D-5) y Paso 3 (D-4) | `skills/project-begin/SKILL.md` | AC-1, AC-2 |
| Orquestador `project-discovery` | modificar Dependencias, Restricciones, Paso 0 (D-5) y Paso 4 (D-4) | `skills/project-discovery/SKILL.md` | AC-1 |
| README de `project-begin` | modificar l.9 (D-6) | `skills/project-begin/README.md` | AC-1 |
| Template de visión (seed y central) | modificar comentarios `# escritor:` (D-6) | `skills/project-begin/assets/vision-template.md`, `docs/templates/vision-template.md` | AC-1 |
| Guía de orquestación | modificar solo l.182 (D-7) | `docs/guides/harness-eng-agents-orchestration.md` | AC-1 |
| Evals | añadir TC-007 y TC-008 en cada skill (D-8) | `skills/project-begin/evals/evals.json`, `skills/project-discovery/evals/evals.json` | AC-1, AC-2 |
| `skills/project-discovery/README.md`, `skills/project-flow/`, `package.json`, `config/runtimes.json`, tests de instalación | sin cambio: no nombran `project-pm` o comparan `agents/` de forma dinámica | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de rol entrevistador | Frontmatter: `alwaysApply: false`, `name: <rol>`, `description` («Rol entrevistador del skill `<skill>`: <propósito>. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.»), `role` (`Product Manager — Visión` o `Product Manager — Discovery`). Cuerpo: intro (D-3.1), `## Principios de PM`, `## Protocolo de Resiliencia para Entrevistas Multivuelta` y una sola sección `## Estado …` con `**Input:**`, `**Output:**` y `### Proceso` | AC-1, CNF-1, CNF-2 |
| I-2 — Variables que recibe el rol (sin cambios respecto de hoy) | `begin-intent`: `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE` (`full` o `resume`) y `$PENDING_SECTIONS` (solo en `resume`). `discovery-pm`: `$VISION_PATH`, `$STAKEHOLDERS_PATH`, `$OUTPUT_PATH = $DISCOVERY_SUMMARY_PATH` | AC-1 |
| I-3 — Error de rol ausente | `❌ Rol local no encontrado: assets/agents/<rol>.md (skill <skill>). Reinstala el skill; no se modificó ningún archivo.` El skill termina sin preguntar ni escribir | AC-2 |
| I-4 — Salidas del rol (sin cambios) | `begin-intent` → `$VISION_PATH` con `substatus: IN-PROGRESS`; `discovery-pm` → `.tmp/project-discovery/discovery-summary.md` | AC-1 |

## Esquema de datos

Frontmatter de un archivo de rol (los valores concretos los fija I-1):

| Clave | Tipo | Ejemplo (`begin-intent.md`) |
|---|---|---|
| `alwaysApply` | booleano | `false` |
| `name` | string kebab | `begin-intent` |
| `description` | string | `Rol entrevistador del skill project-begin: captura y refina la visión del producto. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` |
| `role` | string | `Product Manager — Visión` |

## Flujos clave

### F-1 — `/project-begin` con rol presente (AC-1)

1. Paso 0 resuelve `$SPECS_BASE` y comprueba que existe `assets/agents/begin-intent.md`.
2. Pasos 1 y 2 sin cambios: template, estado de la visión y `$MODE`.
3. Paso 3: la sesión lee `begin-intent.md`, entrevista al usuario según `## Estado Visión` y su protocolo, y escribe `$VISION_PATH` en `IN-PROGRESS`. No lanza subagentes.
4. Paso 4 sin cambios: gate `Confirmar` / `Dejar en revisión`.

### F-2 — `/project-begin` sin rol (AC-2)

1. Paso 0 resuelve `$SPECS_BASE` y no encuentra `assets/agents/begin-intent.md`.
2. Emite I-3 y termina: no resuelve el template, no pregunta, no escribe y no busca el rol fuera del directorio del skill.

### F-3 — `/project-discovery` con rol presente (AC-1)

1. Paso 0 comprueba que existe `assets/agents/discovery-pm.md` (si falta, I-3 y fin, como en F-2).
2. Pasos 1-3 sin cambios.
3. Paso 4: la sesión lee `discovery-pm.md`, sigue `## Estado Discovery` y escribe `$DISCOVERY_SUMMARY_PATH`.
4. Pasos 5-8 sin cambios: siguen invocando `project-ux` y `project-architect` con `$DISCOVERY_SUMMARY_PATH`.

### F-4 — Runtime sin `AskUserQuestion` (P7)

1. El rol pregunta inline (protocolo, pasos 1-2).
2. Si no hay respuesta tras dos intentos, infiere y marca `[inferido: sin respuesta del usuario]`, como hoy.

## Decisiones de complejidad justificada

- **Sin mecanismo nuevo de invocación.** «Lee el archivo y sigue su sección» es una frase en cada `SKILL.md`. No se crea loader, registro de roles ni script.
- **Duplicación consciente de Principios y Protocolo** (unas 12 líneas por rol). La alternativa (un archivo común) reintroduce el acoplamiento entre skills que ADR-0014 elimina.
- **Comprobación de presencia en `project-discovery`**, aunque AC-2 no la exige ahí. Cuesta una línea y evita un fallback implícito (D-5).
- **Autoevaluación estructural (P9/P11).** Las dependencias van de skill a rol local, y en `project-discovery` también de rol a archivo en `.tmp/` y de ahí a los agentes de los pasos 5-6. No hay ciclos. Cada rol tiene una responsabilidad (una fase) y escribe un único destino. I-2 no cambia y no expone más contexto que hoy.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existen los dos roles | `git ls-files skills/project-begin/assets/agents skills/project-discovery/assets/agents` lista exactamente `begin-intent.md` y `discovery-pm.md` | AC-1 |
| 2 | El agente global no existe | `git ls-files agents/project-pm.agent.md` sin salida | AC-1, AC-2 |
| 3 | Ningún archivo afectado nombra el agente global | `git grep -n "project-pm" -- skills docs/templates/vision-template.md docs/guides/harness-eng-agents-orchestration.md` sin salida; `grep -n "agents/" skills/project-begin/SKILL.md skills/project-discovery/SKILL.md \| grep -v "assets/agents/"` sin salida | AC-1, AC-2 |
| 4 | Reparto de secciones de CNF-1 | `grep -c "^## Principios de PM$\|^## Protocolo de Resiliencia para Entrevistas Multivuelta$"` da 2 en cada rol; `grep -l "^## Estado Visión"` lista solo `begin-intent.md`; `grep -l "^## Estado Discovery"` lista solo `discovery-pm.md` | CNF-1 |
| 5 | Contenido sin pérdida | `git diff -M main -- agents skills/project-begin/assets/agents skills/project-discovery/assets/agents` muestra solo los cambios de D-2 y D-3 sobre el texto original | CNF-1 |
| 6 | Contexto acotado | `wc -l` de cada rol da menos de 57 | CNF-2 |
| 7 | Seed y copia central siguen idénticos | `cmp docs/templates/vision-template.md skills/project-begin/assets/vision-template.md` sin salida | AC-1 |
| 8 | Comportamiento de AC-1 y AC-2 | `npm run test:eval -- project-begin` y `npm run test:eval -- project-discovery` (manual): TC-001…TC-008 en verde | AC-1, AC-2 |
| 9 | Gate determinista | `npm run verify:repository` termina con exit 0 | AC-1 |

## Risks / Trade-offs

- **[Entorno local] Copia instalada del agente global** → `.claude/agents/project-pm.agent.md` es salida de instalación no versionada, e `install` no borra archivos retirados. Durante el dogfooding, el harness seguiría ofreciendo `project-pm` como tipo de subagente. Mitigación: tras implementar, reinstalar con `npx agile-sddf install --target claude-code --force` y borrar a mano esa copia. Los `SKILL.md` leen el rol por ruta local (D-4) y la comprobación de D-5 no admite fallback, así que la copia residual no cambia el flujo.
- **[Contexto] El rol se carga en la sesión principal** → la sesión de `project-discovery` acumula el resumen de PM antes de invocar a UX y arquitectura. Se acepta: es el trade-off de ADR-0014 para entrevistadores, y CNF-2 reduce lo que se carga.
- **[Evals existentes] TC-001…TC-006 no mencionan el rol** → el runner podría asumir que falta y emitir I-3. Mitigación: el runner trabaja sobre el repositorio real, donde el rol existe tras la implementación, y su regla «no inventes condiciones» favorece el camino por defecto. Si algún caso falla por esto, se añade «existe el rol local» a su `input.context`, sin tocar `expected`.
- **[Documentación desfasada fuera de alcance]** → `FR-008:26`, `FR-009:25` y `NFR-015:25` nombran `project-pm`. Mitigación: queda para el chore de documentación del cierre de EPIC-24 (Non-Goals). Las líneas de `FR-008` y `FR-009` son de trazabilidad («Fuente») y siguen siendo históricamente ciertas.
- **[Edición concurrente de `project-discovery/SKILL.md`]** → STORY-132 y STORY-133 editan el mismo archivo (Dependencias, Paso 0 y pasos 5-6). Mitigación: el orden de la épica es 131 → 132 → 133. D-5 deja la lista de roles de Paso 0 lista para ampliarse.

## Open Questions

Ninguna. Las dos decisiones de alcance (copia central del template y guía de orquestación) las resolvió el usuario el 2026-10-15 (CR-001, CR-002).

## Registro de Cambios (CR)

### CR-001

- **Tipo**: dependencia
- **Descripción**: la nota «Alcance» de `story.md` solo menciona los comentarios `# escritor:` de `skills/project-begin/assets/vision-template.md`. `docs/templates/vision-template.md` es idéntica byte a byte y tiene los mismos comentarios. El diseño edita las dos (D-6).
- **Documento afectado**: story.md
- **Acción requerida**: añadir `docs/templates/vision-template.md` a la nota «Alcance» de `story.md`.
- **Estado**: aplicado el 2026-10-15 (decisión del usuario; nota «Alcance» de `story.md` actualizada).

### CR-002

- **Tipo**: dependencia
- **Descripción**: `docs/guides/harness-eng-agents-orchestration.md:182` presenta `project-pm` como subagente interactivo vigente. Después de esta historia, esa descripción es falsa (regla de veracidad de `AGENTS.md`), y la épica excluye la actualización de docs.
- **Documento afectado**: story.md / design.md
- **Acción requerida**: añadir la guía a la nota «Alcance» de `story.md`. El párrafo se corrige en la implementación, después del `git rm` (D-7).
- **Estado**: aplicado el 2026-10-15 (decisión del usuario; nota «Alcance» de `story.md` actualizada). La corrección del párrafo queda en T013.

### CR-003

- **Tipo**: inconsistencia interna
- **Descripción**: detectado al diseñar STORY-133 (su CR-001). Los evals de D-8 escribían `agents/project-pm` y `project-pm.agent.md` literales en `input.context` y `not_contains`. El contrato 3 (`git grep -n "project-pm" -- skills …`, T017) habría encontrado esas líneas en `skills/project-begin/evals/evals.json` y `skills/project-discovery/evals/evals.json` y habría fallado.
- **Documento afectado**: design.md (D-8) y tasks.md (T014, T015)
- **Acción requerida**: escribir esas cadenas con el escape `project-p\u006d` (regla de escape de D-8). El contexto y las aserciones no cambian para el runner.
- **Estado**: aplicado el 2026-10-15 a petición del usuario. `analyze.md` es anterior a este cambio: conviene reejecutar `/story-analyze STORY-131`.
