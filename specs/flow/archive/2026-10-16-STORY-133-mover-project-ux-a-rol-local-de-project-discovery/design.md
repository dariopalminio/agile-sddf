---
alwaysApply: false
type: design
id: STORY-133
slug: STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design
title: "Design: Mover project-ux a rol local de project-discovery"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-133
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-133-mover-project-ux-a-rol-local-de-project-discovery
  - EPIC-24-agentes-locales-por-skill
  - skills-independientes
  - STORY-131-partir-project-pm-en-roles-locales-design
  - STORY-132-partir-project-architect-en-roles-locales-design
---

<!-- Referencias -->
[[STORY-133-mover-project-ux-a-rol-local-de-project-discovery]] · [[EPIC-24-agentes-locales-por-skill]] · [[skills-independientes]] · [[STORY-131-partir-project-pm-en-roles-locales-design]] · [[STORY-132-partir-project-architect-en-roles-locales-design]]

# Diseño técnico: mover `project-ux` al rol local `discovery-ux` de `project-discovery`

## Context

Tercera y última historia de [[EPIC-24-agentes-locales-por-skill]] que migra un agente de `project-discovery`. ADR-0014 ([[skills-independientes]], l.46 y l.134) clasifica a `project-ux` como **entrevistador** y lo renombra `discovery-ux`. Por la Regla 1, pasa a ser un **archivo de rol** que lee y ejecuta la sesión del skill. Reutiliza sin cambios el formato de rol, el mecanismo de lectura en línea, la comprobación en el Paso 0 y el error de rol ausente que fijaron STORY-131 y STORY-132 ([[STORY-131-partir-project-pm-en-roles-locales-design]] D-2, D-4, D-5, I-1, I-3; [[STORY-132-partir-project-architect-en-roles-locales-design]] D-3.2, D-4).

A diferencia de `project-pm` y `project-architect`, `project-ux` tiene una sola fase y un solo consumidor, así que no se parte: se mueve.

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/project-ux.agent.md` | 29 líneas. Frontmatter de agente registrado (`description`, `alwaysApply`, `name: project-ux`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`; l.1-13). Cuerpo: intro (l.15), `## Entrada y salida` (l.17-19), `## Hallazgos requeridos` (l.21-26) y un párrafo final de conducta (l.28): «Formula preguntas solo para datos nuevos; agrupa hasta cuatro por ronda… márcalo `[inferido]`… sin wireframes ni instrucciones para otros agentes». No nombra `AskUserQuestion` en el cuerpo |
| `skills/project-discovery/SKILL.md` | Único archivo de `skills/` que nombra `project-ux`: Dependencias (l.27) y Paso 5 (l.75), que lo invoca con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH` y `$OUTPUT_PATH = .tmp/project-discovery/ux-findings.md` |
| STORY-131 y STORY-132 | Diseñadas y con `tasks.md`, **sin implementar**. Cuando se implementen, `project-discovery/SKILL.md` tendrá: Paso 0 con la lista de roles locales `discovery-pm.md` y `discovery-architect.md`; Dependencias «Roles locales `assets/agents/discovery-pm.md` y `assets/agents/discovery-architect.md` (los lee esta sesión). Agente `project-ux`, invocado por esta sesión.»; Restricciones «Los roles y el agente reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente»; Paso 5 con `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md`; Paso 6 con «Si el rol o el agente de UX fallan, o falta el manifiesto». Este diseño parte de ese estado |
| `skills/project-discovery/evals/evals.json` | TC-001…TC-006 hoy (ninguno cita `project-ux`); STORY-131 añade TC-007 y TC-008 y STORY-132 añade TC-009 y TC-010. Tras STORY-132, los contextos de TC-007 y TC-009 dicen «el agente de UX devuelve sus hallazgos». TC-001 y TC-004 ya escriben cadenas prohibidas con escapes Unicode (`01-proj\u0065cts`, `PRO\u004a-`) para que no aparezcan en búsquedas de texto |
| `skills/project-discovery/README.md` y `assets/*-template.md` | No nombran `project-ux` ni UX |
| `agents/`, `config/`, `test/`, `scripts/` | Fuera del propio `project-ux.agent.md`, ninguno nombra `project-ux`. Los tests de instalación (`test/install.test.js`, `scripts/smoke-package-install.js`) comparan `agents/` de forma dinámica |
| `docs/guides/harness-eng-agents-orchestration.md:182` | STORY-131 (D-7) lo reescribe sin nombrar a los entrevistadores pendientes. Tras esta historia sigue siendo cierto: `project-story-mapper` y `story-product-owner` siguen en `agents/` |
| Copia de dogfooding | `.claude/agents/project-ux.agent.md` existe (salida de instalación no versionada) |
| Fuera de `skills/` | `FR-009:25` («Fuente», trazabilidad histórica) y `docs/product/roadmap.md:161` nombran `project-ux`. ADR-0013 y ADR-0014 también, pero son ADR aceptados e inmutables |

## Goals / Non-Goals

**Goals:**

- `skills/project-discovery/assets/agents/discovery-ux.md` existe y `agents/project-ux.agent.md` no // satisface: AC-1, AC-2
- En el Paso 5, la sesión de `/project-discovery` lee `discovery-ux.md`, refina con el usuario perfiles, journeys y navegación, y escribe `.tmp/project-discovery/ux-findings.md` // satisface: AC-1
- El Paso 6 (rol `discovery-architect`) recibe esa misma ruta como `$UX_FINDINGS_PATH` // satisface: AC-1
- `git grep "project-ux" -- skills agents config test` no devuelve nada; `project-discovery` ya no invoca ningún agente // satisface: AC-2, CNF-1
- Si falta `discovery-ux.md`, el skill informa el rol ausente y termina sin escribir en `$SPECS_BASE` (ni en `.tmp/`) // satisface: AC-3

**Non-Goals:**

- No se cambia el formato ni el contenido esperado de `ux-findings.md`: `## Hallazgos requeridos` se copia literal.
- No se migran los roles PM y Architect (STORY-131 y STORY-132).
- No se limpian copias de `project-ux` ya instaladas en otros proyectos. La copia local de dogfooding sí se limpia (Risks).
- No se tocan `FR-009`, `docs/product/roadmap.md` ni `docs/index.md`: no son templates ni guías, así que quedan para el chore de documentación del cierre de EPIC-24. Tampoco ADR-0013 ni ADR-0014, que son inmutables.
- No se tocan `docs/guides/harness-eng-agents-orchestration.md`, `skills/project-discovery/README.md`, los templates del skill, `skills/project-flow/`, `package.json` → `files`, `config/runtimes.json` ni los tests de instalación: no nombran `project-ux` o comparan `agents/` de forma dinámica.

## Decisions

### D-1 — Ubicación, nombre y operación: `git mv` íntegro // satisface: AC-1, AC-2

| Origen | Destino | Operación |
|---|---|---|
| `agents/project-ux.agent.md` (archivo completo) | `skills/project-discovery/assets/agents/discovery-ux.md` | `git mv` y luego los ajustes de D-2 y D-3 |

- **Elegida:** nombre y ruta de ADR-0014 (l.134) y de la nota «Nombre del rol» de la historia. El sufijo de origen evita la colisión con `discovery-pm.md` y `discovery-architect.md` en el mismo directorio. El `git mv` conserva el historial completo, porque no hay una segunda parte que repartir.
- **Rechazada — `ux.md` sin sufijo:** rompe la convención registrada en ADR-0014 para los tres roles de `project-discovery`.
- **Rechazada — crear el archivo nuevo y `git rm` del original:** pierde el historial sin ningún beneficio. Con un solo destino no hay razón para no renombrar.

### D-2 — Formato del archivo de rol: el de STORY-131 // satisface: AC-1

Frontmatter: `alwaysApply: false`, `name: discovery-ux`, `description`, `role` (I-1). Se retiran `tools:` y `model:`, por la misma razón que en STORY-131 (D-2): la sesión no aplica esos campos a un archivo que solo lee, y `model: sonnet` solo existe en Claude. No se añade `output:`: la ruta llega como variable (`$OUTPUT_PATH`).

- La `description` dice «Rol entrevistador», como en `begin-intent` y `discovery-pm`. A diferencia de `project-architect` (STORY-132, D-2), el cuerpo de `project-ux` sí pregunta al usuario (l.28: «Formula preguntas solo para datos nuevos»), así que la palabra es veraz.
- **Rechazada — conservar `tools: [..., AskUserQuestion]`:** declara un mecanismo de Claude que Codex no tiene y que la sesión no aplica a un archivo leído.
- **Rechazada — sin frontmatter:** rompe la uniformidad con los otros dos roles de `skills/project-discovery/assets/agents/` y con `skills/story-code-review/agents/*.agent.md`.

### D-3 — Cambios mínimos en el cuerpo // satisface: AC-1, CNF-1

`## Entrada y salida` y `## Hallazgos requeridos` se copian literales, encabezados incluidos. Solo cambian tres frases:

1. **Intro (l.15), fase:** tras «Eres un UX Designer especializado en investigación de usuarios y flujos verificables.» se añade «Actúas en el estado **Discovery** del skill `project-discovery`.». Se conserva «Recibes rutas resueltas y no delegas trabajo».
2. **Intro, alcance de las restricciones:** se añade la frase de STORY-132 (D-3.2): «Las restricciones de escritura de este rol rigen mientras lo ejecutas; después, el flujo del skill retoma el control y materializa solo tras su gate.». Sin ella, «escribes únicamente el último» (l.19) contradiría el Paso 6 y el Paso 8, que la misma sesión ejecuta después.
3. **Párrafo final (l.28):** «sin wireframes ni instrucciones para otros agentes» pasa a «sin wireframes ni instrucciones para otros roles». El consumidor de los hallazgos es ahora el rol `discovery-architect`, y `project-discovery` ya no tiene agentes (regla de veracidad de `AGENTS.md`). El resto del párrafo, incluida la regla de hasta cuatro preguntas por ronda y la marca `[inferido]`, no cambia.

Tamaño previsto: unas 24 líneas (29 − 6 de `tools`/`model` + 1 de `role`). La regla de cuatro preguntas por ronda no depende de `AskUserQuestion`, así que funciona inline en Codex sin más ajustes.

- **Rechazada — añadir el `## Protocolo de Resiliencia para Entrevistas Multivuelta` de `discovery-pm`:** el párrafo l.28 ya cubre la falta de respuesta («deduce un resultado razonable y márcalo `[inferido]`»). Añadirlo cambia la conducta del rol sin que lo pida ningún AC.
- **Rechazada — dejar «otros agentes»:** describiría un consumidor que ya no existe.
- **Rechazada — no añadir la frase de alcance (ajuste 2):** el Paso 6 escribe en `$STAGING_DIR` justo después en la misma sesión, y la restricción del rol lo prohibiría literalmente.

### D-4 — Mecanismo: la sesión lee el rol y lo ejecuta en línea // satisface: AC-1, CNF-1

`project-discovery`, Paso 5, pasa a «Paso 5 — Hallazgos UX con el rol `discovery-ux`». Su texto queda así: la sesión lee `assets/agents/discovery-ux.md` (relativo al directorio del skill) y sigue sus instrucciones con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH` y `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md` (I-2), refinando con el usuario perfiles, journeys y navegación. Se añade «Esta sesión conduce el refinamiento UX con el usuario; no lances un subagente para este paso».

- La definición `$OUTPUT_PATH = $UX_FINDINGS_PATH = …` que deja STORY-132 se conserva literal. Así el Paso 6 recibe la misma ruta (AC-1, tercera línea del `Entonces`).
- El Paso 5 dice «sigue sus instrucciones», no «sigue su `## Estado …`»: el rol tiene una sola fase y no tiene sección de estado (D-3).
- **Rechazada — lanzar el rol como subagente genérico (patrón de STORY-129):** Codex no tiene subagentes registrados (`agentsDirectory: null`) y un subagente puede no poder preguntar al usuario. Es justo el `Para` de la historia.
- **Rechazada — integrar el contenido del rol en el `SKILL.md`:** contradice la ubicación de ADR-0014 y rompe la uniformidad con los pasos 4 y 6.

### D-5 — Verificación de presencia en el Paso 0, sin fallback // satisface: AC-3, AC-1

Se añade `assets/agents/discovery-ux.md` a la lista de roles locales del Paso 0 que dejan STORY-131 y STORY-132, con el mismo error I-3. Si faltan varios roles, emite una línea I-3 por rol ausente y termina. Se conserva la frase «no se buscan roles fuera del directorio de este skill», que no nombra la carpeta global.

- **Lectura de AC-3:** el `Cuando` dice «el flujo llega al refinamiento UX». El Paso 0 comprueba el rol que ese refinamiento necesita antes de que empiece el flujo. El resultado observable de AC-3 se cumple: informa que falta `discovery-ux` y termina sin escribir en `$SPECS_BASE`. Además, no hace la entrevista de PM ni escribe en `.tmp/`, que es más estricto que lo que pide el AC.
- **Rechazada — comprobar al entrar al Paso 5:** el usuario ya habría respondido la entrevista de PM (Paso 4), y el skill habría limpiado `.tmp/project-discovery/proposal/` y escrito `discovery-summary.md` para nada. Además rompería la regla común de STORY-131 y STORY-132 («un solo punto de comprobación, al final del Paso 0»).
- **Rechazada — comprobar en los dos sitios:** duplica la regla sin cubrir ningún caso nuevo, porque el skill no borra roles durante su propia ejecución.
- **Rechazada — recurrir al agente global si falta el rol:** reintroduce la dependencia que la historia elimina y, en Codex, no existe.

### D-6 — Textos de `project-discovery/SKILL.md` que dejan de nombrar agentes // satisface: AC-2, CNF-1

La tabla fija el **texto final** de cada pieza. La columna central solo sirve para localizarla: la implementación reemplaza la frase o la línea completa por el texto final, aunque STORY-131 o STORY-132 la hayan redactado con otras palabras. Así el resultado no depende de la redacción intermedia, solo de la estructura que comprueba D-8.

| Sección | Texto previsto tras STORY-132 (para localizarlo) | Texto final tras esta historia |
|---|---|---|
| Dependencias | «Roles locales `assets/agents/discovery-pm.md` y `assets/agents/discovery-architect.md` (los lee esta sesión). Agente `project-ux`, invocado por esta sesión.» | «Roles locales `assets/agents/discovery-pm.md`, `assets/agents/discovery-architect.md` y `assets/agents/discovery-ux.md` (los lee esta sesión).» |
| Restricciones | «Los roles y el agente reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente.» | «Los roles reciben rutas ya resueltas; ninguno resuelve la raíz ni lanza subagentes.» |
| Paso 6, cláusula de fallo | «Si el rol o el agente de UX fallan, o falta el manifiesto, …» | «Si algún rol falla o falta el manifiesto, …». El resto de la frase no cambia |
| Paso 4, si conserva la frase de hoy | «… no invoca otros agentes.» | «… no lanza subagentes.» |

La línea de `references/layer-materialization.md` de Dependencias no cambia. Tras estos cambios, `SKILL.md` no nombra ni invoca ningún agente. Así cumple, para `project-discovery`, el criterio de salida «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"» con margen: tampoco lo hace dentro de Dependencias.

- **Rechazada — Restricciones «… ni delega en otro agente»:** ya no queda ningún agente en el flujo. «Lanza subagentes» describe lo que prohíben ADR-0002 y CNF-1.
- **Rechazada — dejar el Paso 6 como está:** nombraría un «agente de UX» que no existe.

### D-7 — Evals: dos casos nuevos y dos contextos corregidos // satisface: AC-1, AC-2, AC-3

TC-001…TC-006 no cambian. En TC-007 y TC-009 (contextos que deja STORY-132) solo cambia `input.context`: «el agente de UX devuelve sus hallazgos» pasa a «existe `discovery-ux.md` y el usuario responde el refinamiento UX». `expected` no cambia. Así el contexto no describe un agente que ya no existe.

En la tabla, los valores se muestran tal como se escriben en `evals.json`, con los escapes incluidos:

| ID | Tipo | Contexto | `contains` | `not_contains` |
|---|---|---|---|---|
| TC-011 | `happy-path` | `vision.md` tiene `substatus: DONE`; requisitos vacíos; existen los dos templates y los roles `discovery-pm.md`, `discovery-architect.md` y `discovery-ux.md` en `skills/project-discovery/assets/agents/`; no existe `agents/project-u\u0078.agent.md`; el usuario responde el refinamiento UX y elige `Confirmar`. | `discovery-ux.md`, `.tmp/project-discovery/ux-findings.md` | `agents/project-u\u0078`, `project-u\u0078.agent.md` |
| TC-012 | `fail-fast` | `vision.md` tiene `substatus: DONE`; existen los templates y los roles `discovery-pm.md` y `discovery-architect.md`; no existe `skills/project-discovery/assets/agents/discovery-ux.md`. | `❌ Rol local no encontrado`, `assets/agents/discovery-ux.md` | `agents/project-u\u0078`, `discovery-summary.md`, `Confirmar` |

- **Regla de escape:** en `evals.json`, cualquier aparición del nombre de un agente global retirado se escribe con un escape Unicode en una de sus letras, tanto en `input.context` como en `contains` y `not_contains`. Para `project-ux` se usa `project-u\u0078` (`\u0078` = `x`). Es la misma convención que TC-001 (`01-proj\u0065cts`). `JSON.parse` devuelve el texto real (`agents/project-ux`), así que ni el contexto ni la aserción cambian para el runner. Gracias al escape, `git grep "project-ux" -- skills` queda vacío, que es lo que mide AC-2 (contrato 3). STORY-131 y STORY-132 aplican la misma regla (CR-001).
- La numeración TC-011 y TC-012 está garantizada por la precondición P-6 (D-8).
- TC-012 prohíbe `discovery-summary.md` y `Confirmar`, igual que TC-010 de STORY-132: con la comprobación en el Paso 0 no hay entrevista de PM ni gate.
- Los evals se corren a mano (`npm run test:eval -- project-discovery`), según `AGENTS.md`.
- **Rechazada — escribir `agents/project-ux` literal en el contexto o en `not_contains`:** el contrato 3 de AC-2 daría un falso positivo dentro de `skills/`.
- **Rechazada — excluir `evals.json` del contrato 3:** dejaría sin vigilar un archivo de `skills/` que AC-2 incluye en la búsqueda.
- **Rechazada — fixture de filesystem sin el rol:** el runner simula el mundo desde `input.context` (`scripts/run-evals.js`), igual que en STORY-131 (D-8) y STORY-132 (D-7).

### D-8 — Precondición de implementación: STORY-131 y STORY-132 integradas // satisface: AC-1, AC-2, AC-3

Antes de editar nada, la implementación comprueba que el punto de partida es el que asume este diseño. Si alguna comprobación falla, la historia se detiene, informa qué pieza falta y no edita ningún archivo (WIP = 1; orden 131 → 132 → 133 de la épica).

| # | Pieza | Comprobación | Esperado |
|---|---|---|---|
| P-1 | Roles de STORY-131 y STORY-132 | `git ls-files skills/project-discovery/assets/agents` | lista exactamente `discovery-architect.md` y `discovery-pm.md` |
| P-2 | Agentes globales ya retirados | `git ls-files agents/project-pm.agent.md agents/project-architect.agent.md` | sin salida |
| P-3 | Agente a mover | `git ls-files agents/project-ux.agent.md` y `wc -l` | lista el archivo; 29 líneas |
| P-4 | Lista de roles del Paso 0 | `grep -n "assets/agents/discovery-pm.md\|assets/agents/discovery-architect.md" skills/project-discovery/SKILL.md` | las dos rutas aparecen dentro del Paso 0 |
| P-5 | Variable del Paso 5 | `grep -c "UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md" skills/project-discovery/SKILL.md` | 1 |
| P-6 | Evals previos | IDs de `skills/project-discovery/evals/evals.json`, leídos con `node -e` | exactamente TC-001…TC-010 |
| P-7 | Regla de escape en los evals de STORY-131 y STORY-132 (CR-001) | `git grep -n "project-pm\|project-architect" -- skills/project-begin/evals skills/project-discovery/evals skills/project-planning/evals` | sin salida |

- P-1…P-5 son estructurales: no exigen una redacción concreta. La redacción la absorbe D-6, que reemplaza frases completas.
- P-6 fija la numeración de D-7. Si los IDs no coinciden, la historia se detiene en lugar de elegir otros IDs: un hueco o un ID inesperado indica que STORY-131 o STORY-132 no se integraron como se diseñaron.
- P-7 confirma que STORY-131 y STORY-132 aplicaron la regla de escape. Si no la aplicaron, sus propios contratos `git grep` ya habrían fallado; detenerse aquí evita heredar un falso positivo.
- **Rechazada — adaptar el diseño a lo que encuentre la implementación:** convertiría decisiones de diseño en decisiones de implementación, contra la regla de suficiencia.
- **Rechazada — implementar STORY-133 en paralelo y fusionar después:** las tres historias editan el mismo `SKILL.md` y el mismo `evals.json`. Va contra WIP = 1 y garantiza conflictos.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Rol `discovery-ux` | crear (vía `git mv` + ajustes, D-1…D-3) | `skills/project-discovery/assets/agents/discovery-ux.md` | AC-1, AC-2, CNF-1 |
| Agente global `project-ux` | eliminar (consecuencia del `git mv`) | `agents/project-ux.agent.md` | AC-1, AC-2 |
| Orquestador `project-discovery` | modificar Dependencias, Restricciones (D-6), lista de roles del Paso 0 (D-5), Paso 5 (D-4) y cláusula de fallo del Paso 6 (D-6) | `skills/project-discovery/SKILL.md` | AC-1, AC-2, AC-3, CNF-1 |
| Evals | añadir TC-011 y TC-012; corregir el contexto de TC-007 y TC-009 (D-7) | `skills/project-discovery/evals/evals.json` | AC-1, AC-2, AC-3 |
| README y templates de `project-discovery`, guía de orquestación, `skills/project-flow/`, `package.json`, `config/runtimes.json`, tests de instalación | sin cambio: no nombran `project-ux` o comparan `agents/` de forma dinámica | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de rol `discovery-ux` (formato de STORY-131) | Frontmatter: `alwaysApply: false`, `name: discovery-ux`, `description` («Rol entrevistador del skill `project-discovery`: refina perfiles, journeys, usabilidad y navegación con el usuario. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.»), `role: UX Designer — Discovery`. Cuerpo: intro (D-3.1 y D-3.2), `## Entrada y salida`, `## Hallazgos requeridos` y el párrafo de conducta (D-3.3) | AC-1 |
| I-2 — Variables que recibe el rol (sin cambios respecto de hoy) | `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md` | AC-1 |
| I-3 — Error de rol ausente (formato de STORY-131) | `❌ Rol local no encontrado: assets/agents/discovery-ux.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.` El skill termina sin validar la visión, preguntar, escribir ni crear `.tmp/` | AC-3 |
| I-4 — Salida del rol (sin cambios) | `.tmp/project-discovery/ux-findings.md`, UTF-8 sin BOM, con los cuatro bloques de `## Hallazgos requeridos`. La consume el Paso 6 como `$UX_FINDINGS_PATH` | AC-1 |

## Esquema de datos

Frontmatter de `discovery-ux.md` (valores de I-1):

| Clave | Tipo | Valor |
|---|---|---|
| `alwaysApply` | booleano | `false` |
| `name` | string kebab | `discovery-ux` |
| `description` | string | `Rol entrevistador del skill project-discovery: refina perfiles, journeys, usabilidad y navegación con el usuario. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` |
| `role` | string | `UX Designer — Discovery` |

Sin cambios en el esquema de `ux-findings.md` (Non-Goals).

## Flujos clave

### F-1 — `/project-discovery` con los tres roles presentes (AC-1, AC-2)

1. Paso 0 resuelve `$SPECS_BASE` y comprueba `discovery-pm.md`, `discovery-architect.md` y `discovery-ux.md`.
2. Pasos 1-4 sin cambios: valida la visión, resuelve templates, hace el inventario, limpia staging y el rol `discovery-pm` escribe `$DISCOVERY_SUMMARY_PATH`.
3. Paso 5: la sesión lee `discovery-ux.md`, pregunta al usuario solo por datos nuevos (hasta cuatro por ronda) y escribe `$UX_FINDINGS_PATH`. No lanza subagentes.
4. Paso 6: el rol `discovery-architect` recibe `$UX_FINDINGS_PATH` entre sus once variables y deja `manifest.md` en `$STAGING_DIR`.
5. Pasos 7-8 sin cambios: gate global y materialización.

### F-2 — `/project-discovery` sin `discovery-ux.md` (AC-3)

1. Paso 0 resuelve `$SPECS_BASE` y no encuentra `assets/agents/discovery-ux.md`.
2. Emite I-3 (una línea por cada rol ausente, si falta más de uno) y termina: no valida la visión, no limpia ni crea `.tmp/project-discovery/`, no pregunta, no escribe en `$SPECS_BASE` ni busca el rol fuera del directorio del skill.

### F-3 — Sin respuesta del usuario durante el refinamiento UX (P7)

1. El rol pregunta inline (en Codex) o con el mecanismo de preguntas del runtime.
2. Si falta información, deduce un resultado razonable y lo marca `[inferido]` (párrafo l.28 del rol, sin cambios), y escribe igualmente `$UX_FINDINGS_PATH`.

### F-4 — El rol no deja `ux-findings.md` (P7)

1. El Paso 6 recibe un `$UX_FINDINGS_PATH` sin archivo. El rol `discovery-architect` no puede leer su entrada obligatoria, así que no deja `manifest.md`.
2. Se aplica la cláusula de fallo del Paso 6 (D-6): informa el fallo, recomienda reejecutar y termina sin tocar `$SPECS_BASE`. Es el mismo comportamiento que hoy, cuando falla el agente.

## Decisiones de complejidad justificada

- **Sin mecanismo nuevo.** Se reutilizan el formato, la comprobación, el error y la redacción de los pasos que fijaron STORY-131 y STORY-132. No hay loader, registro de roles ni script.
- **Mover sin partir.** `project-ux` tiene una sola fase y un solo consumidor. Partirlo, o extraer una parte común, no tiene ninguna justificación.
- **Tres frases cambiadas en el cuerpo (D-3).** Dos son de identificación y alcance, comunes a los otros roles. La tercera corrige una palabra que dejaría de ser cierta.
- **Escape Unicode en los evals (D-7).** Es una convención que el archivo ya usa. Evita tener que excluir `evals.json` de la comprobación de AC-2.
- **Autoevaluación estructural (P9/P11).** Las dependencias van de skill a rol local y de rol a archivo en `.tmp/`. `discovery-ux` consume la salida de `discovery-pm` y `discovery-architect` consume la de `discovery-ux`, siempre a través de archivos y nunca por llamada. No hay ciclos. El rol tiene una responsabilidad (refinar la experiencia de usuario de una fase) y escribe un único destino. I-2 no cambia.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 0 | Punto de partida (antes de editar) | P-1…P-7 de D-8 dan el resultado esperado; si no, la historia se detiene sin cambios | AC-1, AC-2, AC-3 |
| 1 | Existe el rol y no el agente global | `git ls-files skills/project-discovery/assets/agents/discovery-ux.md` lista el archivo; `git ls-files agents/project-ux.agent.md` sin salida | AC-1, AC-2 |
| 2 | Los tres roles de `project-discovery` | `git ls-files skills/project-discovery/assets/agents` lista exactamente `discovery-architect.md`, `discovery-pm.md` y `discovery-ux.md` | AC-1 |
| 3 | Ninguna mención ni invocación del agente global | `git grep -n "project-ux" -- skills agents config test` sin salida | AC-2 |
| 4 | `project-discovery` no nombra agentes ni la carpeta global | `grep -n "agents/" skills/project-discovery/SKILL.md \| grep -v "assets/agents/"` sin salida; `grep -niE "(^\|[^b])agentes?\b" skills/project-discovery/SKILL.md` sin salida (excluye «subagente», que aparece en «no lances un subagente») | AC-2, CNF-1 |
| 5 | El Paso 5 lee el rol y define la ruta | `grep -n "assets/agents/discovery-ux.md" skills/project-discovery/SKILL.md` aparece en Dependencias, Paso 0 y Paso 5; `grep -c "UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md"` da 1 | AC-1 |
| 6 | Contenido sin pérdida | `git diff -M main -- agents/project-ux.agent.md skills/project-discovery/assets/agents/discovery-ux.md` muestra el renombrado con cambios limitados al frontmatter (D-2) y a las tres frases de D-3; `## Entrada y salida` y `## Hallazgos requeridos` no cambian | AC-1 |
| 7 | Sin `tools:` ni `model:` | `grep -E "^(tools\|model):" skills/project-discovery/assets/agents/discovery-ux.md` sin salida | AC-1 |
| 8 | UTF-8 sin BOM | los tres primeros bytes de `discovery-ux.md`, `SKILL.md` y `evals.json` no son `EF BB BF`, y `grep -lE "Ã\|ðŸ"` sobre ellos sin salida | AC-1 |
| 9 | El JSON de evals parsea y conserva la aserción | `node -e "JSON.parse(require('fs').readFileSync('skills/project-discovery/evals/evals.json','utf8'))"` termina sin error y el `not_contains` de TC-011 contiene `agents/project-ux` una vez parseado | AC-2 |
| 10 | Comportamiento de AC-1, AC-2 y AC-3 | `npm run test:eval -- project-discovery` (manual): TC-001…TC-012 en verde | AC-1, AC-2, AC-3 |
| 11 | Gate determinista | `npm run verify:repository` termina con exit 0 | AC-1, AC-2 |

## Risks / Trade-offs

- **[Orden] STORY-131 y STORY-132 sin implementar** → este diseño edita textos que crean esas historias en `project-discovery/SKILL.md` (lista de roles del Paso 0, Dependencias, Restricciones, `$UX_FINDINGS_PATH`, cláusula de fallo del Paso 6) y numera evals después de los suyos. Mitigación en dos capas: (1) la precondición D-8 (P-1…P-7) bloquea la implementación si falta alguna pieza estructural, sin editar nada; (2) D-6 fija el texto final de cada frase y la reemplaza completa, así que una redacción intermedia distinta no rompe el diseño. Lo único que obliga a rediseñar es un cambio de estructura (otro nombre de rol, otra variable u otra numeración de evals), y P-1, P-5 y P-6 lo detectan.
- **[Falsos positivos de `git grep` en los evals]** → los evals de STORY-131 y STORY-132 escribían `agents/project-pm` y `agents/project-architect` literales, y sus contratos `git grep -- skills` los habrían encontrado. Mitigación: aplicada en sus diseños y tareas con la regla de escape de D-7 (CR-001). P-7 lo comprueba antes de implementar esta historia.
- **[Contexto] El refinamiento UX corre en la sesión principal** → la sesión de `project-discovery` acumula el resumen de PM, los hallazgos UX y la propuesta de requisitos. Se acepta: es el trade-off de ADR-0014 para entrevistadores, y el rol añade unas 24 líneas.
- **[Lectura de AC-3]** → la comprobación ocurre antes de llegar al Paso 5 (D-5), no al entrar en él. El resultado observable que exige el AC se cumple y TC-012 lo mide. Si se quisiera la lectura literal, habría que mover la comprobación y aceptar una entrevista de PM desperdiciada. Se descarta para mantener una regla común con STORY-131 y STORY-132.
- **[Entorno local] Copia instalada del agente global** → `.claude/agents/project-ux.agent.md` es salida no versionada que `install` no borra. Mitigación: reinstalar con `npx agile-sddf install --target claude-code --force`, borrar esa copia a mano y comprobar que existe `.claude/skills/project-discovery/assets/agents/discovery-ux.md`. D-5 no admite fallback, así que la copia residual no cambia el flujo.
- **[Evals existentes] TC-001…TC-006 no mencionan los roles** → el runner podría asumir que falta `discovery-ux.md` y emitir I-3. Mitigación: igual que en STORY-131 y STORY-132, si un caso falla por esto se añade «existen los roles locales» a su `input.context`, sin tocar `expected`.
- **[Documentación desfasada fuera de alcance]** → `FR-009:25` (línea «Fuente», trazabilidad histórica) y `docs/product/roadmap.md:161` nombran `project-ux`. Mitigación: chore de documentación del cierre de EPIC-24 (Non-Goals). No son templates ni guías, así que no entran en la excepción de la épica.

## Open Questions

Ninguna. Las dos ambigüedades técnicas (el momento de la comprobación de AC-3 y la búsqueda literal de AC-2 frente a las aserciones de los evals) quedan resueltas en D-5 y D-7. La dependencia de STORY-131 y STORY-132 queda acotada por D-8.

## Registro de Cambios (CR)

### CR-001

- **Tipo**: dependencia
- **Descripción**: al diseñar D-7 se detectó que los evals que diseñan STORY-131 (D-8) y STORY-132 (D-7) escriben `agents/project-pm`, `project-pm.agent.md`, `agents/project-architect` y `project-architect.agent.md` literales en `input.context` y `not_contains`. Sus contratos de verificación 3 (`git grep -n "project-pm" -- skills …` y `git grep -n "project-architect" -- skills/project-discovery skills/project-planning`) encontrarían esas líneas y fallarían.
- **Documento afectado**: design.md y tasks.md de STORY-131 y STORY-132
- **Acción requerida**: aplicar la regla de escape de D-7 en esas tablas de evals y en las tareas que las implementan (`project-p\u006d`, `project-architec\u0074`).
- **Estado**: aplicado el 2026-10-15 a petición del usuario. Se registra como CR-003 en STORY-131 y como CR-001 en STORY-132. Sus `analyze.md` no se regeneraron: conviene reejecutar `/story-analyze` en las dos historias.
