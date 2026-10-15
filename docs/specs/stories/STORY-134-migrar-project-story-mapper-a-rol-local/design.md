---
alwaysApply: false
type: design
id: STORY-134
slug: STORY-134-migrar-project-story-mapper-a-rol-local-design
title: "Design: Migrar project-story-mapper a rol local"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-134
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-134-migrar-project-story-mapper-a-rol-local
  - EPIC-24-agentes-locales-por-skill
  - skills-independientes
  - STORY-131-partir-project-pm-en-roles-locales-design
  - STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design
---

<!-- Referencias -->
[[STORY-134-migrar-project-story-mapper-a-rol-local]] · [[EPIC-24-agentes-locales-por-skill]] · [[skills-independientes]] · [[STORY-131-partir-project-pm-en-roles-locales-design]] · [[STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design]]

# Diseño técnico: migrar `project-story-mapper` al rol local `story-mapper` de `project-story-mapping`

## Context

ADR-0014 ([[skills-independientes]], l.46 y l.136) clasifica a `project-story-mapper` como **entrevistador**. Por la Regla 1, pasa a ser un **archivo de rol** dentro de `skills/project-story-mapping/assets/agents/` que lee y ejecuta la sesión del skill, porque no está garantizado que un subagente genérico pueda preguntar al usuario (CNF-1). El ADR no le fija nombre, a diferencia de los roles de `project-discovery`.

Esta historia reutiliza el formato de rol, el mecanismo de lectura en línea, la comprobación en el Paso 0 y el error de rol ausente que fijó STORY-131 ([[STORY-131-partir-project-pm-en-roles-locales-design]] D-2, D-4, D-5, I-1, I-3) y que STORY-133 aplicó a un rol de una sola fase ([[STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design]] D-1…D-5). A diferencia de STORY-133, no edita ningún archivo que toquen otras historias de la épica: no depende de que STORY-131…133 estén implementadas.

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/project-story-mapper.agent.md` | 97 líneas. Frontmatter de agente registrado (`description`, `alwaysApply`, `name: project-story-mapper`, `tools: [Read, Write, Glob, AskUserQuestion]`, `model: sonnet`; l.1-14). Cuerpo: intro (l.16), `## Variables inyectadas` (l.18-24), `## Principios` (l.26-32), ocho secciones `## Paso 0 — Carga de contexto` … `## Paso 7 — Escribir staging` (l.34-89) y `## Criterios de calidad` (l.91-97). El cuerpo no nombra `AskUserQuestion`: pregunta «de una en una» (l.44). l.40 dice «continúa al Paso 1»; l.72 dice «Nunca escribas en la memoria del proyecto: el skill decide si materializa el resultado» |
| `skills/project-story-mapping/SKILL.md` | 130 líneas, pasos 0-6. Nombra al agente en Objetivo (l.21), Dependencias (l.39) y Paso 3 (l.94, «Lee las instrucciones de `project-story-mapper` y ejecútalo con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH`»). Dice «el agente» en Precondiciones (l.35), Restricciones (l.43) y Paso 3; «delegar/delegación» en l.73, l.90 y el título del Paso 3. l.59 dice «skills, agentes o comandos del runtime»: es el bloque común `SDDF-ROOT-RESOLUTION: v1`, idéntico en diez skills, y no se toca |
| `skills/project-story-mapping/README.md:9` | «Conduce una sesión de User Story Mapping con el agente especializado.» |
| `skills/project-story-mapping/evals/evals.json` | TC-001…TC-006, una línea por caso. Ninguno nombra `project-story-mapper`; TC-001, TC-002, TC-003 y TC-006 dicen «el agente» en `input.context` |
| `skills/project-story-mapping/assets/` | No existe |
| `agents/`, `config/`, `test/`, `scripts/`, `package.json` | Fuera del propio `project-story-mapper.agent.md`, ninguno nombra `project-story-mapper` ni `project-story-mapping`. `install` copia `skills/` completo (`copyDir`, `scripts/install.js:141`), así que `assets/agents/` se instala sin cambios en el instalador |
| `docs/guides/`, `docs/architecture/` | No nombran `project-story-mapper` |
| Copia de dogfooding | `.claude/agents/project-story-mapper.agent.md` existe (salida de instalación, ignorada por `.gitignore:4`) |
| Fuera de `skills/` | `FR-012:25` («Fuente», trazabilidad histórica), `docs/product/roadmap.md:225` y `CHANGELOG.md:39` nombran `project-story-mapper`. ADR-0014 también, pero es un ADR aceptado e inmutable |

## Goals / Non-Goals

**Goals:**

- `skills/project-story-mapping/assets/agents/story-mapper.md` existe y `agents/project-story-mapper.agent.md` no // satisface: AC-1
- En el Paso 3, la sesión de `/project-story-mapping` lee `story-mapper.md`, conduce la entrevista con el usuario y escribe el cuerpo del mapa en `$STAGING_PATH`; el Paso 5 materializa `product/story-map.md` tras validar el staging // satisface: AC-1, CNF-1
- El rol recibe las mismas entradas que el agente: `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH` // satisface: AC-1
- `git grep "project-story-mapper" -- skills agents config test` no devuelve nada; `project-story-mapping` no nombra ni invoca ningún agente // satisface: AC-1, CNF-1
- Si falta `story-mapper.md`, el skill informa la ruta del rol ausente y termina sin escribir `product/story-map.md` (ni crear `.tmp/`) // satisface: AC-2

**Non-Goals:**

- No se cambia la conducta del entrevistador ni el formato del staging: `## Variables inyectadas`, `## Principios`, el contenido de las ocho fases y `## Criterios de calidad` se conservan.
- No se cambian los pasos 1, 2, 4, 5 y 6 del skill más allá de las palabras de D-6.
- No se migra `story-product-owner` (STORY-135) ni se retira `agents/` (chore de cierre de la épica).
- No se limpian copias ya instaladas en otros proyectos. La copia local de dogfooding sí se limpia (Risks).
- No se tocan `FR-012`, `docs/product/roadmap.md`, `CHANGELOG.md` ni `docs/index.md`: no son templates ni guías, así que quedan para el chore de documentación del cierre de EPIC-24. Tampoco ADR-0014, que es inmutable.
- No se tocan `docs/guides/harness-eng-agents-orchestration.md`, `package.json` → `files`, `config/runtimes.json`, `scripts/install.js` ni los tests de instalación: no nombran `project-story-mapper`, y `skills/` ya se publica e instala completo.

## Decisions

### D-1 — Ubicación, nombre y operación: `git mv` íntegro a `story-mapper.md` // satisface: AC-1, AC-2

| Origen | Destino | Operación |
|---|---|---|
| `agents/project-story-mapper.agent.md` (archivo completo) | `skills/project-story-mapping/assets/agents/story-mapper.md` | `git mv` y luego los ajustes de D-2 y D-3 |

- **Elegida — `story-mapper`:** es el nombre que usan la historia («el rol story-mapper», AC-1 y AC-2) y el criterio de salida de la épica (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`). El skill tiene un solo rol, así que no hace falta el sufijo de origen que ADR-0014 exige en `project-discovery` para evitar colisiones. El `git mv` conserva el historial, como en STORY-133 (D-1).
- **Rechazada — `project-story-mapper.md`:** el prefijo `project-` es el del catálogo global de `agents/`; además, `git grep "project-story-mapper" -- skills` dejaría de servir para comprobar que no queda ninguna referencia al agente global (contrato 3).
- **Rechazada — `mapping-story-mapper.md` (sufijo de origen):** la convención del sufijo existe para evitar colisiones dentro de un mismo `assets/agents/`; aquí no hay otro rol con el que colisionar.
- **Rechazada — crear el archivo nuevo y `git rm` del original:** pierde el historial sin beneficio; hay un solo destino.

### D-2 — Formato del archivo de rol: el de STORY-131 // satisface: AC-1, CNF-1

Frontmatter: `alwaysApply: false`, `name: story-mapper`, `description`, `role` (I-1). Se retiran `tools:` y `model:`, por la misma razón que en STORY-131 (D-2): la sesión no aplica esos campos a un archivo que solo lee, y `model: sonnet` solo existe en Claude. No se añade `output:`: la ruta llega como `$STAGING_PATH`.

- La `description` dice «Rol entrevistador», como `begin-intent`, `discovery-pm` y `discovery-ux`. Es veraz: el cuerpo pregunta al usuario (Principios: «pregunta para construir el mapa con el usuario»; Fase 1: «pregunta de una en una»).
- **Rechazada — conservar `tools: [..., AskUserQuestion]`:** declara un mecanismo de Claude que Codex no tiene y que la sesión no aplica a un archivo leído.
- **Rechazada — sin frontmatter:** rompe la uniformidad con los roles de EPIC-24 y con `skills/story-code-review/agents/*.agent.md`, que tienen `name` y `description`.

### D-3 — Cambios mínimos en el cuerpo // satisface: AC-1, CNF-1

Se conservan literales `## Variables inyectadas`, `## Principios`, el contenido de las ocho secciones de pasos y `## Criterios de calidad`. Solo cambian cuatro cosas:

1. **Intro (l.16), contexto de ejecución:** tras la frase actual se añade «Actúas dentro del Paso 3 del skill `project-story-mapping`. Las rutas llegan resueltas desde el skill: no las derives ni delegues trabajo.».
2. **Intro, alcance de las restricciones:** se añade la frase de STORY-132 (D-3.2), adaptada: «Las restricciones de escritura de este rol rigen mientras lo ejecutas; después, el flujo del skill retoma el control y materializa solo tras validar el staging.». Sin ella, «Nunca escribas en la memoria del proyecto» (l.72) contradiría el Paso 5 del skill, que la misma sesión ejecuta después.
3. **Encabezados de pasos:** `## Paso N — <título>` pasa a `## Fase N — <título>` (N = 0…7; títulos sin cambio), y «continúa al Paso 1» (l.40) pasa a «continúa a la Fase 1». Motivo: el rol ahora se ejecuta en la misma sesión que el skill, que tiene sus propios pasos 0-6. «Continúa al Paso 1» podría leerse como el Paso 1 del skill, que vacía `.tmp/project-story-mapping/` y pregunta `Sobrescribir`/`Cancelar`. Con un subagente aislado la colisión no existía.
4. **Fase 7, última frase:** «el skill decide si materializa el resultado» pasa a «el flujo del skill decide, tras validar el staging, si materializa el resultado». Ya no hay un subagente que devuelve el control; el rol termina y la sesión sigue en el Paso 4.

Tamaño previsto: unas 92 líneas (97 − 6 de `tools`/`model` + 1 de `role`; las frases nuevas de la intro van en el mismo párrafo). «Fase» no colisiona con otro término del skill ni del dominio: «actividad» y «tarea» ya son términos del story map (backbone y user tasks).

- **Rechazada — conservar «Paso N»:** deja la ambigüedad descrita en el ajuste 3, en un punto donde una mala lectura vacía el staging o vuelve a preguntar al usuario.
- **Rechazada — reestructurar las fases en una sección `## Estado …` con `### Proceso`, como `discovery-pm`:** el rol tiene una sola fase de producto y la reestructuración amplía el diff sin que lo pida ningún AC.
- **Rechazada — añadir el `## Protocolo de Resiliencia para Entrevistas Multivuelta` de `discovery-pm`:** cambia la conducta del rol sin que lo pida ningún AC. La falta de respuesta ya tiene salida: el Paso 1 del skill cancela por defecto, y si la sesión no deja staging el Paso 4 termina sin escribir (F-4).
- **Rechazada — dejar la Fase 7 como está:** «el skill decide» sigue siendo cierto, pero no dice que la decisión ocurre tras el gate del Paso 4, que es lo que evita que la sesión materialice el mapa dentro del rol.

### D-4 — Mecanismo: la sesión lee el rol y lo ejecuta en línea // satisface: AC-1, CNF-1

`project-story-mapping`, Paso 3, pasa a «Paso 3 — Sesión de mapeo con el rol `story-mapper`». Su texto: la sesión lee `assets/agents/story-mapper.md` (relativo al directorio del skill) y sigue sus instrucciones con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH` (I-2). Esta sesión conduce la entrevista con el usuario y el rol escribe solo el cuerpo del mapa en staging. Se añaden dos frases: «No lances un subagente para este paso.» y «Las fases del rol son internas a este paso: al terminar la Fase 7, continúa con el Paso 4.».

- Las variables no cambian de nombre ni de valor: la historia exige «las mismas entradas» (Notas) y el rol las documenta en `## Variables inyectadas`.
- **Rechazada — lanzar el rol como subagente genérico (patrón de STORY-129):** Codex no tiene subagentes registrados (`agentsDirectory: null`) y un subagente puede no poder preguntar al usuario. Es justo el `Para` de la historia y CNF-1.
- **Rechazada — integrar el contenido del rol en `SKILL.md`:** contradice la ubicación de ADR-0014 (Regla 1) y llevaría `SKILL.md` a unas 220 líneas mezclando orquestación y técnica de mapeo.

### D-5 — Verificación de presencia al final del Paso 0, sin fallback // satisface: AC-2, AC-1

Al final del Paso 0, después del bloque `SDDF-ROOT-RESOLUTION: v1` y de la frase sobre `/skill-preflight`, y antes del Paso 1, el skill comprueba que existe `assets/agents/story-mapper.md` (relativo al directorio del skill). Si falta, emite I-3 y termina: no informa el destino, no pregunta `Sobrescribir`/`Cancelar`, no vacía ni crea `.tmp/project-story-mapping/` y no escribe `product/story-map.md`. La ausencia de fallback se redacta como en STORY-131: «no se buscan roles fuera del directorio de este skill», sin nombrar la carpeta global.

- El bloque común del Paso 0 no se edita: la comprobación es un párrafo nuevo tras él. `scripts/audit-root-resolution.js` exige el marcador y el bloque, no que sea lo último del paso.
- **Rechazada — comprobar al entrar al Paso 3:** el usuario ya habría respondido `Sobrescribir` y el Paso 1 ya habría vaciado `.tmp/project-story-mapping/`, lo que destruye un staging conservado «para inspección» (Paso 4). AC-2 se cumpliría, pero con efectos y con una regla distinta de la de STORY-131…133.
- **Rechazada — recurrir al agente global si falta el rol:** reintroduce la dependencia que la historia elimina; en Codex no existe.

### D-6 — Textos de `project-story-mapping` que dejan de nombrar agentes // satisface: AC-1, CNF-1

| Archivo y sección | Texto actual | Texto final |
|---|---|---|
| `SKILL.md` Objetivo (l.21) | «delega la conversación al agente `project-story-mapper` y solo escribe…» | «conduce la conversación en esta sesión con el rol local `story-mapper` y solo escribe…» |
| `SKILL.md` Precondiciones (l.35) | «el agente lo recopila de forma interactiva» | «el rol `story-mapper` lo recopila de forma interactiva» |
| `SKILL.md` Dependencias (l.39) | «Agente: `project-story-mapper`.» | «Rol local: `assets/agents/story-mapper.md` (entrevistador, lo lee esta sesión).» |
| `SKILL.md` Restricciones (l.43) | «El agente escribe únicamente en staging; …» | «El rol escribe únicamente en staging; …». Se añade la regla «El rol recibe rutas ya resueltas; no resuelve la raíz ni lanza subagentes.» |
| `SKILL.md` Paso 1 (l.73) | «Vacía `.tmp/project-story-mapping/` antes de delegar.» | «Vacía `.tmp/project-story-mapping/` antes de la sesión de mapeo.» |
| `SKILL.md` Paso 2 (l.90) | «Aunque ambos resultados estén vacíos, continúa con la delegación.» | «Aunque ambos resultados estén vacíos, continúa con la sesión de mapeo.» |
| `SKILL.md` Paso 3 (título y l.94) | «Paso 3 — Delegar la sesión» y su párrafo | Texto de D-4 |
| `README.md:9` | «con el agente especializado» | «con su rol local `story-mapper`, que conduce la propia sesión del skill» |

La l.59 («skills, agentes o comandos del runtime») es parte del bloque común y no cambia. Tras estos cambios, `SKILL.md` no nombra ni invoca ningún agente: cumple, para `project-story-mapping`, el criterio de salida «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"», también dentro de Dependencias.

- **Rechazada — cambiar solo Dependencias y Paso 3:** Objetivo, Precondiciones y Restricciones seguirían diciendo «el agente», contra la regla de veracidad de `AGENTS.md`, y el contrato 4 fallaría.
- **Rechazada — dejar el README:** es la ficha del skill que lee quien lo instala; describiría un agente que ya no existe. La excepción de la épica (Notas) cubre las guías que la propia migración deja falsas.

### D-7 — Evals: dos casos nuevos y cuatro contextos corregidos // satisface: AC-1, AC-2

En TC-001, TC-002, TC-003 y TC-006 solo cambia `input.context`: «el agente deja staging» pasa a «la sesión con el rol story-mapper deja staging», y «el agente recopila contexto interactivamente» (TC-002) pasa a «el rol story-mapper recopila contexto interactivamente». `expected` no cambia. TC-004 y TC-005 no cambian.

Casos nuevos, con el formato de una línea por caso del archivo y `threshold: 1.0`. Los valores se muestran tal como se escriben en `evals.json`, con los escapes incluidos:

| ID | Tipo | Contexto | `contains` | `not_contains` |
|---|---|---|---|---|
| TC-007 | `happy-path` | `vision.md` y `stakeholders.md` están DONE con un perfil US; existen FR-001 y FR-002; existe `skills/project-story-mapping/assets/agents/story-mapper.md`; no existe `agents/project-story-mapper.agent.md`; no existe story map; el usuario responde las preguntas de la sesión y el staging es válido. | `assets/agents/story-mapper.md`, `.tmp/project-story-mapping/story-map.md`, `✅ Story map escrito` | `agents/project-story-mapper`, `project-story-mapper.agent.md` |
| TC-008 | `fail-fast` | `vision.md` está DONE; existen FR-001 y FR-002; no existe `skills/project-story-mapping/assets/agents/story-mapper.md`; no existe story map. | `❌ Rol local no encontrado`, `assets/agents/story-mapper.md` | `agents/project-story-mapper`, `✅ Story map escrito`, `Inventario de requisitos` |

- **Regla de escape (STORY-133, D-7):** en `evals.json`, el nombre del agente global retirado se escribe con un escape Unicode en una letra (`r` = `r`). `JSON.parse` devuelve el texto real, así que la aserción no cambia para el runner, y `git grep "project-story-mapper" -- skills` queda vacío (contrato 3).
- TC-008 prohíbe `Inventario de requisitos` porque, con la comprobación en el Paso 0 (D-5), el skill no llega al Paso 2. Así mide que no hubo efectos previos, no solo que no se escribió el mapa.
- Los evals se corren a mano (`npm run test:eval -- project-story-mapping`), según `AGENTS.md`.
- **Rechazada — escribir `agents/project-story-mapper` literal:** el contrato 3 daría un falso positivo dentro de `skills/`.
- **Rechazada — fixture de filesystem sin el rol:** el runner simula el mundo desde `input.context` (`scripts/run-evals.js`, protocolo E3), igual que en STORY-131 y STORY-133.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Rol `story-mapper` | crear (vía `git mv` + ajustes, D-1…D-3) | `skills/project-story-mapping/assets/agents/story-mapper.md` | AC-1, AC-2, CNF-1 |
| Agente global `project-story-mapper` | eliminar (consecuencia del `git mv`) | `agents/project-story-mapper.agent.md` | AC-1 |
| Orquestador `project-story-mapping` | modificar Objetivo, Precondiciones, Dependencias, Restricciones, pasos 1-2 (D-6), Paso 0 (D-5) y Paso 3 (D-4) | `skills/project-story-mapping/SKILL.md` | AC-1, AC-2, CNF-1 |
| Ficha del skill | modificar l.9 (D-6) | `skills/project-story-mapping/README.md` | AC-1 |
| Evals | añadir TC-007 y TC-008; corregir el contexto de TC-001, TC-002, TC-003 y TC-006 (D-7) | `skills/project-story-mapping/evals/evals.json` | AC-1, AC-2 |
| `package.json`, `config/runtimes.json`, `scripts/install.js`, tests de instalación, guías | sin cambio: no nombran `project-story-mapper` o tratan `skills/` y `agents/` de forma dinámica | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de rol `story-mapper` (formato de STORY-131) | Frontmatter: `alwaysApply: false`, `name: story-mapper`, `description`, `role` (valores en Esquema de datos). Cuerpo: intro (D-3.1 y D-3.2), `## Variables inyectadas`, `## Principios`, `## Fase 0 — Carga de contexto` … `## Fase 7 — Escribir staging` (D-3.3 y D-3.4) y `## Criterios de calidad` | AC-1, CNF-1 |
| I-2 — Variables que recibe el rol (sin cambios respecto de hoy) | `$INPUT_PATHS` (rutas de `product/` con contenido; puede estar vacía), `$REQUIREMENTS_INVENTORY` (líneas `FR-NNN — título — ruta`; puede estar vacío), `$STAGING_PATH = .tmp/project-story-mapping/story-map.md` | AC-1 |
| I-3 — Error de rol ausente (formato de STORY-131) | `❌ Rol local no encontrado: assets/agents/story-mapper.md (skill project-story-mapping). Reinstala el skill; no se modificó ningún archivo.` El skill termina sin informar el destino, preguntar, crear `.tmp/` ni escribir `product/story-map.md` | AC-2 |
| I-4 — Salida del rol (sin cambios) | `$STAGING_PATH`, UTF-8 sin BOM, sin frontmatter, primera línea `# Story Map — …` y las ocho secciones de la Fase 7. La valida el Paso 4 del skill | AC-1 |

## Esquema de datos

Frontmatter de `story-mapper.md`:

| Clave | Tipo | Valor |
|---|---|---|
| `alwaysApply` | booleano | `false` |
| `name` | string kebab | `story-mapper` |
| `description` | string | `Rol entrevistador del skill project-story-mapping: conduce con el usuario la sesión de User Story Mapping (Jeff Patton) desde product/ y requirements/ y escribe el cuerpo del mapa en staging. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` |
| `role` | string | `Product Manager — Story Mapping` |

Sin cambios en el esquema del staging ni en el frontmatter de `product/story-map.md` (Non-Goals).

## Flujos clave

### F-1 — `/project-story-mapping` con el rol presente (AC-1)

1. Paso 0 resuelve `$SPECS_BASE` y comprueba que existe `assets/agents/story-mapper.md`.
2. Pasos 1-2 sin cambios de conducta: informa el destino, resuelve la sobrescritura, vacía `.tmp/project-story-mapping/`, construye `$INPUT_PATHS` y `$REQUIREMENTS_INVENTORY`.
3. Paso 3: la sesión lee `story-mapper.md` y recorre sus fases 0-7. Pregunta al usuario con el mecanismo del runtime o inline (en Codex) y escribe `$STAGING_PATH`. No lanza subagentes.
4. Paso 4 valida el staging; Paso 5 escribe `$SPECS_BASE/product/story-map.md` con frontmatter; Paso 6 confirma.

### F-2 — `/project-story-mapping` sin `story-mapper.md` (AC-2)

1. Paso 0 resuelve `$SPECS_BASE` y no encuentra `assets/agents/story-mapper.md`.
2. Emite I-3 y termina: no informa el destino, no pregunta, no vacía ni crea `.tmp/project-story-mapping/`, no escribe `product/story-map.md` y no busca el rol fuera del directorio del skill.

### F-3 — Sin contexto en las capas (P7)

1. `$INPUT_PATHS` y `$REQUIREMENTS_INVENTORY` llegan vacíos (Paso 2 emite las advertencias de siempre).
2. El rol pasa de la Fase 0 a la Fase 1 y levanta el contexto mínimo con el usuario. Es la conducta actual del agente (TC-002).

### F-4 — La sesión no deja staging válido (P7)

1. Si el usuario abandona la entrevista o el rol no escribe `$STAGING_PATH`, el Paso 4 emite `⚠️ La sesión terminó sin story map…` y termina.
2. Si el staging carece de una sección obligatoria, el Paso 4 emite `❌ … no contiene <sección>` y conserva el staging. En ambos casos `product/story-map.md` no se toca. Es el mismo comportamiento que hoy, cuando el agente falla.

## Decisiones de complejidad justificada

- **Sin mecanismo nuevo.** Se reutilizan el formato, la comprobación, el error y la redacción que fijaron STORY-131 y STORY-133. No hay loader, registro de roles ni script.
- **Mover sin partir.** `project-story-mapper` tiene una sola fase de producto y un solo consumidor.
- **Renombrar «Paso» a «Fase» en el rol (D-3.3).** Es el único cambio del cuerpo que no es de identificación o alcance. Se justifica porque la ejecución en línea pone dos numeraciones de pasos en la misma sesión, y la colisión con el Paso 1 del skill tiene efectos destructivos.
- **Escape Unicode en los evals (D-7).** Es la convención de STORY-131 y STORY-133. Evita excluir `evals.json` del contrato 3.
- **Autoevaluación estructural (P9/P11).** Dependencias: skill → rol local (lectura) y rol → `$STAGING_PATH` (archivo); el Paso 4 del skill consume ese archivo, no al rol. No hay ciclos. El rol tiene una responsabilidad (conducir el mapeo y dejar el cuerpo en staging) y escribe un único destino; la materialización sigue siendo del skill. I-2 e I-4 no cambian.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existe el rol y no el agente global | `git ls-files skills/project-story-mapping/assets/agents` lista exactamente `story-mapper.md`; `git ls-files agents/project-story-mapper.agent.md` sin salida | AC-1 |
| 2 | Contenido sin pérdida | `git diff -M main -- agents/project-story-mapper.agent.md skills/project-story-mapping/assets/agents/story-mapper.md` muestra el renombrado con cambios limitados al frontmatter (D-2) y a los cuatro ajustes de D-3; `## Variables inyectadas`, `## Principios` y `## Criterios de calidad` no cambian | AC-1 |
| 3 | Ninguna mención del agente global | `git grep -n "project-story-mapper" -- skills agents config test scripts` sin salida | AC-1 |
| 4 | `project-story-mapping` no nombra agentes ni la carpeta global | `grep -n "agents/" skills/project-story-mapping/SKILL.md \| grep -v "assets/agents/"` sin salida; `grep -niE "(^\|[^b])agentes?\b" skills/project-story-mapping/SKILL.md \| grep -v "skills, agentes o comandos del runtime"` sin salida (excluye «subagente» y la l.59 del bloque común); `grep -n "agente" skills/project-story-mapping/README.md` sin salida | AC-1, CNF-1 |
| 5 | El Paso 3 lee el rol con las mismas entradas | `grep -n "assets/agents/story-mapper.md" skills/project-story-mapping/SKILL.md` aparece en Dependencias, Paso 0 y Paso 3; el Paso 3 nombra `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH` y la frase «No lances un subagente» | AC-1, CNF-1 |
| 6 | Sin colisión de pasos | `grep -c "^## Paso" skills/project-story-mapping/assets/agents/story-mapper.md` da 0 y `grep -c "^## Fase [0-7] — "` da 8 | AC-1 |
| 7 | Sin `tools:` ni `model:` | `grep -E "^(tools\|model):" skills/project-story-mapping/assets/agents/story-mapper.md` sin salida | AC-1, CNF-1 |
| 8 | UTF-8 sin BOM | los tres primeros bytes de `story-mapper.md`, `SKILL.md`, `README.md` y `evals.json` no son `EF BB BF`, y `grep -lE "Ã\|ðŸ"` sobre ellos sin salida | AC-1 |
| 9 | El JSON de evals parsea y conserva la aserción | `node -e "JSON.parse(require('fs').readFileSync('skills/project-story-mapping/evals/evals.json','utf8'))"` termina sin error; una vez parseado, el `not_contains` de TC-007 contiene `agents/project-story-mapper` | AC-1, AC-2 |
| 10 | Comportamiento de AC-1 y AC-2 | `npm run test:eval -- project-story-mapping` (manual): TC-001…TC-008 en verde | AC-1, AC-2 |
| 11 | Gate determinista | `npm run verify:repository` termina con exit 0 | AC-1, AC-2 |

## Risks / Trade-offs

- **[Contexto] La entrevista corre en la sesión principal** → la sesión acumula el inventario, las respuestas y el mapa. Se acepta: es el trade-off de ADR-0014 para entrevistadores, y el rol añade unas 92 líneas.
- **[Entorno local] Copia instalada del agente global** → `.claude/agents/project-story-mapper.agent.md` es salida ignorada que `install` no borra; el harness seguiría ofreciéndolo como tipo de subagente. Mitigación: reinstalar con `npx agile-sddf install --target claude-code --force`, borrar esa copia a mano y comprobar que existe `.claude/skills/project-story-mapping/assets/agents/story-mapper.md`. El Paso 3 lee el rol por ruta local y D-5 no admite fallback, así que la copia residual no cambia el flujo.
- **[Evals existentes] TC-001…TC-006 no mencionan el rol** → el runner podría asumir que falta y emitir I-3. Mitigación: igual que en STORY-131 y STORY-133, si un caso falla por esto se añade «existe el rol local story-mapper» a su `input.context`, sin tocar `expected`.
- **[Uniformidad] STORY-131…133 sin implementar** → este diseño copia los contratos I-1 e I-3 de STORY-131 en lugar de depender de su implementación, porque no comparte archivos con ellas. Si STORY-131 cambiara esos formatos al implementarse, habría que alinear este rol. Mitigación: el contrato 4 de STORY-131 y el 5 de esta historia buscan las mismas cadenas (`assets/agents/`, `Rol local no encontrado`), así que una divergencia se detecta con `grep`.
- **[Documentación desfasada fuera de alcance]** → `FR-012:25` (línea «Fuente», trazabilidad histórica), `docs/product/roadmap.md:225` y `CHANGELOG.md:39` nombran `project-story-mapper`. Mitigación: chore de documentación del cierre de EPIC-24 (Non-Goals). No son templates ni guías, así que no entran en la excepción de la épica.

## Open Questions

Ninguna. El nombre del rol, que la historia no fijaba como ruta, queda resuelto en D-1, y el momento de la comprobación de AC-2 en D-5.

## Registro de Cambios (CR)

Sin CRs detectados.
