---
alwaysApply: false
type: design
id: STORY-132
slug: STORY-132-partir-project-architect-en-roles-locales-design
title: "Design: Partir project-architect en roles locales"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-132
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-132-partir-project-architect-en-roles-locales
  - EPIC-24-agentes-locales-por-skill
  - skills-independientes
  - STORY-131-partir-project-pm-en-roles-locales-design
---

<!-- Referencias -->
[[STORY-132-partir-project-architect-en-roles-locales]] · [[EPIC-24-agentes-locales-por-skill]] · [[skills-independientes]] · [[STORY-131-partir-project-pm-en-roles-locales-design]]

# Diseño técnico: partir `project-architect` en los roles locales `discovery-architect` y `planning`

## Context

Segunda historia de [[EPIC-24-agentes-locales-por-skill]] que migra un agente clasificado como **entrevistador** por ADR-0014 ([[skills-independientes]], l.46). Aplica la Regla 1: el agente pasa a ser un **archivo de rol** que lee y ejecuta la sesión del skill. Reutiliza sin cambios el formato de rol, el mecanismo y el error de rol ausente que fijó STORY-131 ([[STORY-131-partir-project-pm-en-roles-locales-design]], D-2, D-4, D-5, I-1, I-3).

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/project-architect.agent.md` | 59 líneas. Frontmatter de agente registrado (`description`, `alwaysApply`, `name`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`). Cuerpo: intro (l.15), `## Principios` (l.17-22), `## Estado Discovery — Propuesta fragmentada` (l.24-45, con `### Entrada obligatoria`, `### Salida`, `### Proceso`), `## Estado Planning — Propuesta de roadmap` (l.47-59, con `### Entrada y salida`, `### Método`). El cuerpo nunca pregunta al usuario: `AskUserQuestion` figura en `tools` pero ninguna instrucción la usa |
| `skills/project-planning/SKILL.md` | Nombra `project-architect` en `description` (l.5), Objetivo (l.17), Dependencias (l.35) y Paso 5 (l.95). Restricciones (l.40) dice «el agente nunca escribe en `$SPECS_BASE`». Paso 3 vacía `.tmp/project-planning/` |
| `skills/project-planning/README.md:7` | «`project-architect` escribe la propuesta en staging» |
| `skills/project-discovery/SKILL.md` | Nombra `project-architect` en Dependencias (l.27) y Paso 6 (l.79). El Paso 6 usa `$UX_FINDINGS_PATH`, que ningún paso define (el Paso 5 escribe en `$OUTPUT_PATH = .tmp/project-discovery/ux-findings.md`) |
| STORY-131 | Diseñada y con `tasks.md`, **sin implementar**. Cuando se implemente, `project-discovery/SKILL.md` tendrá en el Paso 0 una lista de roles locales comprobados, definirá `$DISCOVERY_SUMMARY_PATH` en el Paso 4 y su Dependencias dirá «Rol local `assets/agents/discovery-pm.md` (…). Agentes `project-ux` y `project-architect`, invocados secuencialmente por esta sesión». Este diseño parte de ese estado |
| `skills/project-planning/evals/evals.json` | TC-001…TC-007; ninguno cita `project-architect` ni rutas de `agents/` |
| `skills/project-discovery/evals/evals.json` | TC-001…TC-006 hoy; STORY-131 añade TC-007 y TC-008. El contexto de su TC-007 dice «los agentes de UX y de arquitectura devuelven sus resultados» |
| Otros consumidores | `skills/project-flow/`, `config/`, `test/` y `scripts/` no nombran `project-architect`. Los tests de instalación comparan `agents/` de forma dinámica |
| `docs/guides/harness-eng-agents-orchestration.md:182` | STORY-131 (D-7) lo reescribe sin nombrar a los entrevistadores pendientes, así que sigue siendo cierto tras esta historia |
| Fuera de `skills/` | `FR-009:25`, `FR-010:26`, `NFR-015:25`, `docs/product/stakeholders.md:33` (US-004) y `docs/product/roadmap.md:161` nombran `project-architect` |

## Goals / Non-Goals

**Goals:**

- `skills/project-discovery/assets/agents/discovery-architect.md` y `skills/project-planning/assets/agents/planning.md` existen, y `agents/project-architect.agent.md` no // satisface: AC-1
- `/project-planning` lee su rol `planning`, redacta la propuesta en su propia sesión y la agrega append-only a `product/roadmap.md` tras `Confirmar`, con el mismo contrato de staging y gate que hoy // satisface: AC-1
- `/project-discovery` lee su rol `discovery-architect` y deja la propuesta fragmentada en `$STAGING_DIR` sin invocar un agente de arquitectura // satisface: AC-1
- Si falta el rol, cada skill se detiene antes de cualquier pregunta, escritura o limpieza de `.tmp/`, informa la ruta y no busca fuera de su directorio // satisface: AC-2
- `## Principios`, `## Estado Discovery` y `## Estado Planning` quedan repartidos según la tabla de D-3 // satisface: CNF-1
- Ningún archivo de `skills/project-discovery/` ni de `skills/project-planning/` nombra `project-architect` // satisface: AC-1

**Non-Goals:**

- No se migra `project-ux`: el Paso 5 de `project-discovery` sigue invocándolo (STORY-133).
- No se reescribe el método del arquitecto (numeración, reglas de categorías, contrato del bloque de épica).
- No se tocan `FR-009`, `FR-010`, `NFR-015`, `docs/product/stakeholders.md`, `docs/product/roadmap.md` ni `docs/index.md`: no son templates ni guías, así que quedan para el chore de documentación del cierre de EPIC-24 (ver Risks).
- No se toca `docs/guides/harness-eng-agents-orchestration.md`: tras STORY-131 su texto no nombra a `project-architect`.
- No se tocan `package.json` → `files`, `config/runtimes.json`, `skills/project-flow/` ni los tests de instalación.

## Decisions

### D-1 — Ubicación y nombres de los roles // satisface: AC-1

| Origen | Destino | Operación |
|---|---|---|
| `agents/project-architect.agent.md` (intro + Principios + Estado Planning) | `skills/project-planning/assets/agents/planning.md` | archivo nuevo, creado antes del `git mv` |
| `agents/project-architect.agent.md` (intro + Principios + Estado Discovery) | `skills/project-discovery/assets/agents/discovery-architect.md` | `git mv` y luego se borra la sección Planning |

- **Elegida:** nombres y rutas de ADR-0014 (l.134) y de la historia. El `git mv` va hacia la parte mayor (Discovery, 22 líneas frente a 13), igual que en STORY-131, para conservar el historial.
- **Rechazada — `git mv` hacia `planning.md`:** conserva el historial de la parte menor; git detecta peor el renombrado.
- **Rechazada — un `architect.md` compartido:** reintroduce el acoplamiento que ADR-0014 elimina y hace que cada skill cargue la fase que no le toca, contra el `Para` de la historia.

### D-2 — Formato del archivo de rol: el de STORY-131, sin `tools`, `model` ni `output` // satisface: AC-1

Frontmatter: `alwaysApply: false`, `name: <rol>`, `description`, `role` (I-1). Se retiran `tools:` y `model:` por la misma razón que en STORY-131 (D-2): la sesión no aplica esos campos a un archivo que solo lee. No se añade `output:`: la ruta de salida llega como variable (`$STAGING_DIR`, `$STAGING_PATH`).

- **Diferencia con STORY-131:** la `description` dice «Rol de arquitecto», no «Rol entrevistador». El cuerpo de `project-architect` no pregunta al usuario, y la regla de veracidad de `AGENTS.md` impide describirlo como entrevista. La clasificación de ADR-0014 (archivo de rol leído por la sesión) no cambia.
- **Rechazada — conservar `tools: [..., AskUserQuestion]`:** declara una capacidad que el rol no usa y que la sesión no aplica.
- **Rechazada — sin frontmatter:** rompe la uniformidad con `begin-intent.md`, `discovery-pm.md` y los archivos locales de `skills/story-code-review/agents/`.

### D-3 — Cambios mínimos en el cuerpo y reparto de secciones // satisface: AC-1, CNF-1

Las secciones de `project-architect.agent.md` se copian literales, encabezados `##` y `###` incluidos, salvo dos ajustes en la intro (l.15):

1. **Fase:** tras la primera frase se añade «Actúas en el estado **Discovery** del skill `project-discovery`.» o «Actúas en el estado **Planning** del skill `project-planning`.». Se conserva «Las rutas y valores llegan resueltos desde el skill orquestador: no derives rutas ni delegues trabajo».
2. **Alcance de las restricciones:** se añade «Las restricciones de escritura de este rol rigen mientras lo ejecutas; después, el flujo del skill retoma el control y materializa solo tras su gate.». Antes eran del subagente; ahora las lee la misma sesión que luego escribe el roadmap (`project-planning`, Paso 7) o materializa los requisitos (`project-discovery`, Paso 8). Sin la frase, «Está prohibido escribir en `$SPECS_BASE`» (Planning, paso 5) y «No resuelvas rutas ni escribas fuera de `$STAGING_DIR`» (Discovery) contradirían esos pasos.

Reparto (CNF-1):

| Sección | `discovery-architect.md` | `planning.md` |
|---|:---:|:---:|
| Intro (con los ajustes 1 y 2) | ✓ | ✓ |
| `## Principios` | ✓ | ✓ |
| `## Estado Discovery — Propuesta fragmentada` (`### Entrada obligatoria`, `### Salida`, `### Proceso`) | ✓ | — |
| `## Estado Planning — Propuesta de roadmap` (`### Entrada y salida`, `### Método`) | — | ✓ |

Tamaño previsto: unas 37 líneas para `discovery-architect.md` y unas 28 para `planning.md`.

- **Rechazada — cambiar las restricciones dentro de cada sección de estado:** toca cuatro frases en lugar de una y dificulta comprobar CNF-1 con `git diff`.
- **Rechazada — no ajustar nada:** la sesión recibiría una prohibición que contradice el paso siguiente de su propio skill.
- **Rechazada — extraer `## Principios` a un archivo común:** ADR-0014 acepta duplicar esas 4 líneas antes que mantener el acoplamiento.

### D-4 — Mecanismo: la sesión lee el rol y lo ejecuta en línea // satisface: AC-1

- `project-planning`, Paso 5, pasa a «Paso 5 — Propuesta con el rol `planning` y validación del staging». La sesión lee `assets/agents/planning.md` (relativo al directorio del skill) y sigue su `## Estado Planning` con `$INPUT_PATHS`, `$EPICS_INVENTORY`, `$TEMPLATE_PATH`, `$PROPOSAL_HEADING` y `$STAGING_PATH` ya resueltos (I-2). Se añade «Esta sesión redacta la propuesta; no lances un subagente para este paso». La validación del staging, su mensaje `❌` y los pasos 6 y 7 no cambian.
- `project-discovery`, Paso 6, pasa a «Paso 6 — Propuesta de requisitos con el rol `discovery-architect`». La sesión lee `assets/agents/discovery-architect.md` y sigue su `## Estado Discovery` con las once variables actuales (I-2), más la misma frase de no lanzar subagente. «Si cualquier agente falla o falta el manifiesto» pasa a «Si el rol o el agente de UX fallan, o falta el manifiesto»; el resto de la frase no cambia.
- `project-discovery`, Paso 5: `$OUTPUT_PATH = .tmp/project-discovery/ux-findings.md` pasa a `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md`. Es el mismo patrón que STORY-131 aplicó a `$DISCOVERY_SUMMARY_PATH`: la variable que consume el rol queda definida donde se produce.
- **Rechazada — lanzar el rol como subagente genérico (patrón de STORY-129):** en Codex no hay subagentes registrados (`agentsDirectory: null`) y ADR-0014 clasifica a `project-architect` como rol.
- **Rechazada — integrar el contenido del rol en el `SKILL.md`:** contradice la ubicación de ADR-0014 y engorda el orquestador.

### D-5 — Verificación de presencia al final del Paso 0, sin fallback // satisface: AC-2, AC-1

- `project-planning`: al final del Paso 0, después de resolver `$SPECS_BASE`, comprueba `assets/agents/planning.md`. Va antes del Paso 1 (inventario FR), el Paso 3 (vacía `.tmp/project-planning/`) y el Paso 4 (pregunta por el story map). Si falta, emite I-3 y termina sin preguntar, escribir ni crear `.tmp/`. Con el rol ausente y sin FR, gana el error de rol: es el primero que se evalúa.
- `project-discovery`: se añade `assets/agents/discovery-architect.md` a la lista de roles locales que STORY-131 deja en el Paso 0, con el mismo I-3. Si faltan varios roles, emite una línea I-3 por rol ausente y termina.
- La ausencia de fallback se redacta como en STORY-131: «no se buscan roles fuera del directorio de este skill», sin nombrar la carpeta global.
- **Rechazada — comprobar justo antes del Paso 5:** `.tmp/project-planning/` ya estaría vaciado y el usuario ya habría respondido la pregunta del story map. AC-2 pide detenerse sin efectos.
- **Rechazada — recurrir al agente global si falta el rol:** AC-2 lo prohíbe.

### D-6 — Textos que dejan de nombrar `project-architect` // satisface: AC-1

| Archivo | Cambio |
|---|---|
| `skills/project-planning/SKILL.md` `description` (l.5) | «mediante project-architect.» → «con su rol local planning.». Los `triggers` no cambian |
| `skills/project-planning/SKILL.md` Objetivo (l.17) | «El agente `project-architect` prepara la propuesta en staging y este skill la valida, …» → «La sesión del skill prepara la propuesta en staging siguiendo el rol local `assets/agents/planning.md`; después la valida, …». El resto de la frase no cambia |
| `skills/project-planning/SKILL.md` Dependencias (l.35) | «Agente `project-architect` en estado *Planning*.» → «Rol local `assets/agents/planning.md` (lo lee esta sesión).» |
| `skills/project-planning/SKILL.md` Restricciones (l.40) | «… y el agente nunca escribe en `$SPECS_BASE`.» → «… y el rol `planning` nunca escribe en `$SPECS_BASE`; solo el Paso 7 escribe, tras `Confirmar`.» |
| `skills/project-planning/README.md:7` | «`project-architect` escribe la propuesta en staging» → «La sesión del skill escribe la propuesta en staging con su rol local `planning`» |
| `skills/project-discovery/SKILL.md` Dependencias | Texto de STORY-131 → «Roles locales `assets/agents/discovery-pm.md` y `assets/agents/discovery-architect.md` (los lee esta sesión). Agente `project-ux`, invocado por esta sesión.» |
| `skills/project-discovery/SKILL.md` Restricciones | «El rol y los agentes reciben rutas ya resueltas; …» → «Los roles y el agente reciben rutas ya resueltas; …». El resto no cambia |

- **Rechazada — dejar `README.md` para el chore de cierre:** es parte del skill migrado y quedaría falso desde este merge (regla de veracidad; excepción de la épica para lo que la propia historia deja falso).

### D-7 — Evals: dos casos nuevos por skill y un contexto corregido // satisface: AC-1, AC-2

TC-001…TC-007 de `project-planning` no cambian. Siguen siendo la regresión de «como antes de la migración» en AC-1: misma salida esperada con el rol local en lugar del agente.

| Skill | ID | Tipo | Contexto | `contains` | `not_contains` |
|---|---|---|---|---|---|
| `project-planning` | TC-008 | `fail-fast` | FR-001 a FR-003 disponibles; template central disponible; existe `product/roadmap.md`; no existe `skills/project-planning/assets/agents/planning.md`. | `❌ Rol local no encontrado`, `assets/agents/planning.md` | `agents/project-architec\u0074`, `Se agregará como`, `✅ Propuesta` |
| `project-planning` | TC-009 | `happy-path` | FR-001 a FR-003 disponibles; template central disponible; no existe roadmap; existe `skills/project-planning/assets/agents/planning.md`; no existe la carpeta `agents/`; respuesta Confirmar. | `planning.md`, `## Propuesta (`, `/epic-from-project-plan` | `agents/project-architec\u0074`, `project-architec\u0074.agent.md` |
| `project-discovery` | TC-009 | `happy-path` | `vision.md` tiene `substatus: DONE`; existen los templates y los roles `discovery-pm.md` y `discovery-architect.md`; no existe `agents/project-architec\u0074.agent.md`; el agente de UX devuelve sus hallazgos; respuesta Confirmar. | `discovery-architect.md`, `manifest.md` | `agents/project-architec\u0074` |
| `project-discovery` | TC-010 | `fail-fast` | `vision.md` tiene `substatus: DONE`; existen los templates y `discovery-pm.md`; no existe `skills/project-discovery/assets/agents/discovery-architect.md`. | `❌ Rol local no encontrado`, `assets/agents/discovery-architect.md` | `agents/project-architec\u0074`, `discovery-summary.md`, `Confirmar` |

- Los IDs de `project-discovery` suponen que STORY-131 ya añadió TC-007 y TC-008. Si no coinciden, se usan los dos siguientes libres.
- En el TC-007 de `project-discovery` (STORY-131) solo cambia el `input.context`: «los agentes de UX y de arquitectura devuelven sus resultados» → «el agente de UX devuelve sus hallazgos y existe `discovery-architect.md`». `expected` no cambia. Así el contexto no describe un agente de arquitectura que ya no existe.
- Los evals se corren a mano (`npm run test:eval -- project-planning` y `-- project-discovery`), según `AGENTS.md`.
- **Regla de escape (CR-001):** en la tabla, los valores se muestran tal como se escriben en `evals.json`. Toda aparición de `project-architect` en `input.context`, `contains` o `not_contains` se escribe `project-architec\u0074` (`\u0074` = `t`), con la misma convención que TC-001 de `project-discovery` (`01-proj\u0065cts`) y que STORY-131 (CR-003). `JSON.parse` devuelve el texto real, así que el runner ve el mismo contexto y la misma aserción. Sin el escape, el contrato 3 (`git grep -n "project-architect" -- skills/project-discovery skills/project-planning`) encontraría esas líneas de `evals.json` y fallaría.
- **Rechazada — fixture de filesystem sin el rol:** el runner simula el mundo desde `input.context` (`scripts/run-evals.js`), igual que en STORY-131 (D-8).
- **Rechazada — excluir `evals.json` del contrato 3:** dejaría sin vigilar archivos de los dos skills que AC-1 cubre.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Rol `planning` | crear (D-1…D-3) | `skills/project-planning/assets/agents/planning.md` | AC-1, CNF-1 |
| Rol `discovery-architect` | crear (vía `git mv` + recorte, D-1…D-3) | `skills/project-discovery/assets/agents/discovery-architect.md` | AC-1, CNF-1 |
| Agente global `project-architect` | eliminar (consecuencia del `git mv`) | `agents/project-architect.agent.md` | AC-1, AC-2 |
| Orquestador `project-planning` | modificar `description`, Objetivo, Dependencias, Restricciones (D-6), Paso 0 (D-5) y Paso 5 (D-4) | `skills/project-planning/SKILL.md` | AC-1, AC-2 |
| README de `project-planning` | modificar l.7 (D-6) | `skills/project-planning/README.md` | AC-1 |
| Orquestador `project-discovery` | modificar Dependencias, Restricciones (D-6), lista de roles del Paso 0 (D-5), Paso 5 y Paso 6 (D-4) | `skills/project-discovery/SKILL.md` | AC-1, AC-2 |
| Evals | añadir TC-008 y TC-009 en `project-planning`; añadir TC-009 y TC-010 y corregir el contexto de TC-007 en `project-discovery` (D-7) | `skills/project-planning/evals/evals.json`, `skills/project-discovery/evals/evals.json` | AC-1, AC-2 |
| `skills/project-flow/`, guía de orquestación, `package.json`, `config/runtimes.json`, tests de instalación | sin cambio: no nombran `project-architect` o comparan `agents/` de forma dinámica | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de rol de arquitecto | Frontmatter: `alwaysApply: false`, `name: <rol>`, `description` («Rol de arquitecto del skill `<skill>`: <propósito>. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.»), `role` (`Arquitecto — Discovery` o `Arquitecto — Planning`). Cuerpo: intro (D-3), `## Principios` y una sola sección `## Estado …` con sus subsecciones literales | AC-1, CNF-1 |
| I-2 — Variables que recibe el rol (sin cambios respecto de hoy) | `discovery-architect`: `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$UX_FINDINGS_PATH`, `$STAKEHOLDERS_PATH`, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US`, `$STAGING_DIR`. `planning`: `$INPUT_PATHS`, `$EPICS_INVENTORY`, `$TEMPLATE_PATH`, `$PROPOSAL_HEADING`, `$STAGING_PATH` | AC-1 |
| I-3 — Error de rol ausente (formato de STORY-131) | `❌ Rol local no encontrado: assets/agents/<rol>.md (skill <skill>). Reinstala el skill; no se modificó ningún archivo.` El skill termina sin preguntar, escribir ni crear `.tmp/` | AC-2 |
| I-4 — Salidas del rol (sin cambios) | `discovery-architect` → `$STAGING_DIR/manifest.md`, `$STAGING_DIR/requirements/…` y, opcionalmente, `$STAGING_DIR/product/stakeholders.md`. `planning` → `$STAGING_PATH = .tmp/project-planning/proposal.md` | AC-1 |

## Esquema de datos

Frontmatter de un archivo de rol (valores de I-1):

| Clave | Tipo | `planning.md` | `discovery-architect.md` |
|---|---|---|---|
| `alwaysApply` | booleano | `false` | `false` |
| `name` | string kebab | `planning` | `discovery-architect` |
| `description` | string | `Rol de arquitecto del skill project-planning: propone las épicas del roadmap en staging. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` | `Rol de arquitecto del skill project-discovery: transforma los hallazgos de discovery en una propuesta de stakeholders y requisitos en staging. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` |
| `role` | string | `Arquitecto — Planning` | `Arquitecto — Discovery` |

## Flujos clave

### F-1 — `/project-planning` con rol presente (AC-1)

1. Paso 0 resuelve `$SPECS_BASE` y comprueba que existe `assets/agents/planning.md`.
2. Pasos 1-4 sin cambios: inventario FR, template, contexto y story map opcional.
3. Paso 5: la sesión lee `planning.md`, sigue `## Estado Planning` con I-2 y escribe solo `$STAGING_PATH`. No lanza subagentes. Valida el staging igual que hoy.
4. Pasos 6-7 sin cambios: gate `Confirmar` / `Cancelar` y, con `Confirmar`, inserción append-only en `product/roadmap.md`.

### F-2 — `/project-planning` sin rol (AC-2)

1. Paso 0 resuelve `$SPECS_BASE` y no encuentra `assets/agents/planning.md`.
2. Emite I-3 y termina: no inventaría FR, no vacía `.tmp/project-planning/`, no pregunta, no toca `product/roadmap.md` ni busca el rol fuera del directorio del skill.

### F-3 — `/project-discovery` con roles presentes (AC-1)

1. Paso 0 comprueba `discovery-pm.md` y `discovery-architect.md`.
2. Pasos 1-5 como los deja STORY-131: el Paso 4 escribe `$DISCOVERY_SUMMARY_PATH` y el Paso 5 invoca `project-ux`, que escribe `$UX_FINDINGS_PATH`.
3. Paso 6: la sesión lee `discovery-architect.md`, sigue `## Estado Discovery` con I-2 y deja `manifest.md` y los archivos propuestos en `$STAGING_DIR`.
4. Pasos 7-8 sin cambios: gate global y materialización.

### F-4 — `/project-discovery` sin `discovery-architect.md` (AC-2, extensión a discovery)

1. Paso 0 no encuentra `assets/agents/discovery-architect.md`.
2. Emite I-3 y termina antes de validar la visión o limpiar `.tmp/project-discovery/proposal/`.

### F-5 — Fallo durante la ejecución del rol (P7)

1. En `project-planning`, si el staging falta o incumple el contrato, el Paso 5 emite `❌ La propuesta generada no cumple el contrato del template: <motivo>.`, conserva el staging y no toca el roadmap (como hoy).
2. En `project-discovery`, si falta `manifest.md`, el Paso 6 informa el fallo, recomienda reejecutar y termina sin tocar `$SPECS_BASE` (como hoy).

## Decisiones de complejidad justificada

- **Sin mecanismo nuevo.** Se reutilizan el formato, la comprobación y el error de STORY-131. No hay loader, registro de roles ni script.
- **Duplicación consciente de `## Principios`** (4 líneas por rol), aceptada por ADR-0014.
- **Frase de alcance de restricciones (D-3.2).** Es la única adición al cuerpo que no es de identificación de fase. Hace falta porque, al pasar de subagente a rol, la misma sesión ejecuta la restricción y el paso que escribe.
- **Definir `$UX_FINDINGS_PATH` en el Paso 5.** Es un cambio de una expresión en un paso que STORY-133 reescribirá. Se hace aquí porque el rol `discovery-architect` consume esa variable y hoy nadie la define.
- **Autoevaluación estructural (P9/P11).** Las dependencias van de skill a rol local y de rol a staging en `.tmp/`. En `project-discovery` el rol consume la salida del agente UX a través de un archivo, no de una llamada. No hay ciclos. Cada rol cubre una fase y escribe un único destino de staging. I-2 no cambia.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existen los dos roles | `git ls-files skills/project-discovery/assets/agents/discovery-architect.md skills/project-planning/assets/agents/planning.md` lista los dos | AC-1 |
| 2 | El agente global no existe | `git ls-files agents/project-architect.agent.md` sin salida | AC-1, AC-2 |
| 3 | Ningún archivo de los dos skills nombra el agente global | `git grep -n "project-architect" -- skills/project-discovery skills/project-planning` sin salida; `grep -n "agents/" skills/project-discovery/SKILL.md skills/project-planning/SKILL.md \| grep -v "assets/agents/"` sin salida | AC-1, AC-2 |
| 4 | Reparto de secciones de CNF-1 | `grep -c "^## Principios$"` da 1 en cada rol; `grep -l "^## Estado Discovery — Propuesta fragmentada$"` lista solo `discovery-architect.md`; `grep -l "^## Estado Planning — Propuesta de roadmap$"` lista solo `planning.md`; las cinco subsecciones `###` aparecen en el rol que corresponde | CNF-1 |
| 5 | Contenido sin pérdida | `git diff -M main -- agents skills/project-discovery/assets/agents/discovery-architect.md skills/project-planning/assets/agents/planning.md` muestra solo los cambios de D-2 y D-3 sobre el texto original | CNF-1 |
| 6 | Sin `tools:` ni `model:` | `grep -E "^(tools\|model):"` sobre los dos roles sin salida | AC-1 |
| 7 | UTF-8 sin BOM | los tres primeros bytes de cada archivo creado o modificado no son `EF BB BF`, y `grep -lE "Ã\|ðŸ"` sobre ellos sin salida | AC-1 |
| 8 | Comportamiento de AC-1 y AC-2 | `npm run test:eval -- project-planning` (TC-001…TC-009) y `npm run test:eval -- project-discovery` (TC-001…TC-010) en verde, ejecución manual | AC-1, AC-2 |
| 9 | Gate determinista | `npm run verify:repository` termina con exit 0 | AC-1 |

## Risks / Trade-offs

- **[Orden] STORY-131 sin implementar** → este diseño edita textos que crea STORY-131 en `project-discovery/SKILL.md` (lista de roles del Paso 0, Dependencias, Restricciones, `$DISCOVERY_SUMMARY_PATH`) y numera evals después de los suyos. Mitigación: la primera tarea comprueba que STORY-131 está integrada (`discovery-pm.md` existe y `project-pm.agent.md` no). Si no lo está, la historia se detiene (WIP = 1, orden 131 → 132 → 133 de la épica).
- **[Contexto] El rol de Discovery corre en la sesión principal** → antes, la escritura de muchos archivos de requisitos quedaba aislada en un subagente. Ahora se acumula en la sesión de `project-discovery`, junto con el resumen de PM. Se acepta: es el trade-off de ADR-0014. Además, la sesión ya tenía en contexto todas las entradas que pasaba al agente.
- **[Entorno local] Copia instalada del agente global** → `.claude/agents/project-architect.agent.md` es salida no versionada que `install` no borra. Mitigación: reinstalar con `npx agile-sddf install --target claude-code --force` y borrar esa copia a mano. D-5 no admite fallback, así que la copia residual no cambia el flujo.
- **[Evals existentes] TC-001…TC-007 de `project-planning` no mencionan el rol** → el runner podría asumir que falta y emitir I-3. Mitigación: igual que en STORY-131, si un caso falla por esto se añade «existe el rol local» a su `input.context`, sin tocar `expected`.
- **[Documentación desfasada fuera de alcance]** → `FR-009:25` y `FR-010:26` (líneas «Fuente», trazabilidad histórica), `NFR-015:25`, `docs/product/stakeholders.md:33` (US-004: «Rol representado por el agente `project-architect`») y `docs/product/roadmap.md:161` nombran el agente. Mitigación: chore de documentación del cierre de EPIC-24 (Non-Goals). No son templates ni guías, así que no entran en la excepción de la épica.
- **[Edición concurrente] STORY-133** → reescribe el Paso 5 de `project-discovery` y la línea de Dependencias que este diseño deja con «Agente `project-ux`». Mitigación: orden de la épica. D-4 deja `$UX_FINDINGS_PATH` definido para que STORY-133 lo conserve.

## Open Questions

Ninguna. La frase de alcance de restricciones (D-3.2) y la definición de `$UX_FINDINGS_PATH` (D-4) eran las dos ambigüedades técnicas, y quedan resueltas aquí.

## Registro de Cambios (CR)

El `README.md` de `project-planning`, que la evaluación FINVEST señaló como no nombrado en la historia, es parte del skill migrado. Corregirlo entra en la excepción de veracidad de la épica (D-6) y no requiere CR.

### CR-001

- **Tipo**: inconsistencia interna
- **Descripción**: detectado al diseñar STORY-133 (su CR-001). Los evals de D-7 escribían `agents/project-architect` y `project-architect.agent.md` literales en `input.context` y `not_contains`. El contrato 3 (`git grep -n "project-architect" -- skills/project-discovery skills/project-planning`, T016) habría encontrado esas líneas en los dos `evals.json` y habría fallado.
- **Documento afectado**: design.md (D-7) y tasks.md (T013, T014)
- **Acción requerida**: escribir esas cadenas con el escape `project-architec\u0074` (regla de escape de D-7). El contexto y las aserciones no cambian para el runner.
- **Estado**: aplicado el 2026-10-15 a petición del usuario. `analyze.md` es anterior a este cambio: conviene reejecutar `/story-analyze STORY-132`.
