---
alwaysApply: false
type: design
id: STORY-135
slug: STORY-135-migrar-story-product-owner-a-rol-local-design
title: "Design: Migrar story-product-owner a rol local"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-135
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-135-migrar-story-product-owner-a-rol-local
  - EPIC-24-agentes-locales-por-skill
  - skills-independientes
  - STORY-131-partir-project-pm-en-roles-locales-design
  - STORY-134-migrar-project-story-mapper-a-rol-local-design
---

<!-- Referencias -->
[[STORY-135-migrar-story-product-owner-a-rol-local]] · [[EPIC-24-agentes-locales-por-skill]] · [[skills-independientes]] · [[STORY-131-partir-project-pm-en-roles-locales-design]] · [[STORY-134-migrar-project-story-mapper-a-rol-local-design]]

# Diseño técnico: migrar `story-product-owner` al rol local `product-owner` de `story-specify` y retirar `agents/`

## Context

ADR-0014 ([[skills-independientes]], l.46 y l.136) clasifica a `story-product-owner` como **entrevistador**. Por la Regla 1, pasa a ser un **archivo de rol** dentro de `skills/story-specify/assets/agents/` que lee y ejecuta la sesión del skill, porque no está garantizado que un subagente genérico pueda preguntar al usuario (CNF-1). La Regla 2 (l.50-57) **no prohíbe** `agents/`: la carpeta se retira porque queda vacía, no por decreto. Esto condiciona cómo se adaptan las pruebas (D-9).

Esta historia tiene dos partes:

1. **Migración (AC-1, AC-2).** Reutiliza el formato de rol, la lectura en línea, la comprobación en el Paso 0 y el error de rol ausente que fijó STORY-131 ([[STORY-131-partir-project-pm-en-roles-locales-design]] D-2, D-4, D-5, I-1, I-3) y que STORY-134 aplicó a un rol de un solo skill ([[STORY-134-migrar-project-story-mapper-a-rol-local-design]] D-1…D-7). No comparte archivos con STORY-129 ni STORY-131…134.
2. **Cierre de la épica (AC-3).** Retira `agents/` del repositorio y del paquete. Depende de que STORY-129 y STORY-131…134 estén implementadas (precondición G-1).

**Estado medido (2026-10-15, rama `epic/EPIC-24-agentes-locales-por-skill`):**

| Pieza | Estado actual |
|---|---|
| `agents/story-product-owner.agent.md` | 91 líneas. Frontmatter de agente registrado (`description` en bloque `>-` de 3 líneas, `alwaysApply`, `name: story-product-owner`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`; l.1-13). Cuerpo: intro (l.14), `## Principios` (l.16-25), `## Cuando intervienes` (l.27-35, cinco casos), `## Proceso de trabajo` con `### Paso 1 - Leer contexto disponible` … `### Paso 5 - Actualizar sin romper el formato` (l.37-81) y `## Criterios de salida` (l.83-91). El texto no lleva tildes («analisis», «redaccion», «pequenas») |
| `skills/story-specify/SKILL.md` | 315 líneas, pasos 0-7 (con 5A y 5B). Nombra al agente en Objetivo (l.25, l.29), Dependencias (l.71), Restricciones (l.107), Paso 1 Caso A (l.138) y Paso 5B (l.240). Dice «El agente debe:» en l.246. l.129 dice «skills, agentes o comandos del runtime»: es el bloque común `SDDF-ROOT-RESOLUTION: v1` y no se toca |
| `skills/story-specify/README.md` | Nombra `story-product-owner` en l.15, l.54 y l.67 |
| `skills/story-specify/evals/evals.json` | JSON con sangría, TC-001…TC-006. TC-005 nombra `story-product-owner` en `description` y en `expected.contains` |
| `skills/story-specify/assets/` | No existe |
| `agents/` (versionado) | Diez `*.agent.md`; solo `story-product-owner.agent.md` es de esta historia. Sin archivos no versionados |
| `package.json` → `files` | Incluye `"agents/"` (l.23) |
| `scripts/install.js` | `copyDir` devuelve `{ installed: 0, skipped: 0 }` sin crear el destino cuando falta la fuente (l.103-104). `installSDDF` copia `agents/` solo si el runtime tiene `agentsDirectory` (l.144-150) |
| `test/install.test.js` | l.126 lee `agents/` del repo con `topLevelEntries` (que lanza si falta) y l.136 lo compara con el destino. l.153 exige que exista el destino de agentes en la instalación global: con la fuente ausente, `copyDir` no lo crea y la prueba falla (CR-001) |
| `scripts/smoke-package-install.js` | l.225-238: `assertSameTree(packageDir/agents, …)` local y global; `assertSameTree` falla si falta la fuente (l.86). `verify:repository` corre este smoke (`scripts/verify-repository.js:29`) |
| Seguridad | `.github/workflows/skill-security-audit.yml` dispara con `agents/**`; `scripts/verify-skill-security-workflow.js:15` exige ese patrón; `scripts/run-skill-shielder-audit.js:43` tiene el perfil `agents`, que devuelve lista vacía si falta la carpeta (l.80) |
| Documentos que describen `agents/` como fuente actual | `AGENTS.md:8`, `README.md:77`, `README.md:312`, `README.md:315`, `SECURITY.md:6`, `docs/architecture/sddf-architecture.md:141`, `docs/architecture/tech-stack.md:138`, `docs/constitution.md:259` (CR-002) |
| Copia de dogfooding | `.claude/agents/story-product-owner.agent.md` (salida de instalación, ignorada) |
| Fuera de `skills/` con mención histórica | `CHANGELOG.md:582`, `docs/product/roadmap.md:225`, `docs/product/story-map.md:168`, `FR-034:18` nombran `story-product-owner`. ADR-0014 también, pero es inmutable |

## Goals / Non-Goals

**Goals:**

- `skills/story-specify/assets/agents/product-owner.md` existe y `agents/story-product-owner.agent.md` no // satisface: AC-1
- En el Paso 1 (Caso A, input incompleto) y en el Paso 5B, la sesión de `/story-specify` lee `product-owner.md`, pregunta al usuario y después sigue con el ciclo `story-creation → story-evaluation → story-split → story-improve` // satisface: AC-1, CNF-1
- `git grep "story-product-owner" -- skills agents config test scripts` no devuelve nada; `story-specify` no nombra ni invoca ningún agente // satisface: AC-1, CNF-1
- Si falta `product-owner.md`, el skill informa la ruta del rol ausente y termina sin crear ni modificar ningún `story.md` // satisface: AC-2
- `agents/` no existe, `package.json` → `files` no la incluye, la instalación termina con código 0 en los cuatro runtimes y `npm run verify:repository` pasa // satisface: AC-3
- Los documentos que describen `agents/` como fuente actual del paquete dejan de hacerlo (regla de veracidad de `AGENTS.md`) // satisface: AC-3

**Non-Goals:**

- No se cambia la conducta del Product Owner: `## Principios`, el contenido de las cinco fases y `## Criterios de salida` se conservan, también sin tildes.
- No se cambian los pasos 2, 3, 4, 5A, 6 y 7 de `story-specify`, ni el modo Automático.
- No se tocan `config/runtimes.json` (`agentsDirectory: "agents"` se conserva, como fija la épica), `scripts/install.js`, `scripts/cli.js` ni sus mensajes.
- No se tocan el workflow de seguridad, `verify-skill-security-workflow.js` ni el perfil `agents` del auditor (D-11).
- No se tocan `CHANGELOG.md`, `docs/product/roadmap.md`, `docs/product/story-map.md`, `FR-034`, `docs/index.md` ni ADR-0014: son registros históricos o de trazabilidad y quedan para el chore de documentación del release major (épica, Notas).
- No se limpian copias ya instaladas en otros proyectos. La copia local de dogfooding sí se limpia (Risks).

## Decisions

### D-1 — Ubicación, nombre y operación: `git mv` íntegro a `product-owner.md` // satisface: AC-1, AC-2

| Origen | Destino | Operación |
|---|---|---|
| `agents/story-product-owner.agent.md` (archivo completo) | `skills/story-specify/assets/agents/product-owner.md` | `git mv` y luego los ajustes de D-2 y D-3 |

- **Elegida — `product-owner`:** es el nombre de la historia («el rol product-owner», AC-1 y AC-2) y del criterio de salida de la épica (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`). El skill tiene un solo rol, así que no hace falta sufijo de origen. El `git mv` conserva el historial, como en STORY-134 (D-1).
- **Rechazada — `story-product-owner.md`:** conserva el prefijo del catálogo global, y `git grep "story-product-owner" -- skills` dejaría de servir para comprobar que no queda ninguna referencia al agente global (contrato 3).
- **Rechazada — crear el archivo nuevo y `git rm` del original:** pierde el historial sin beneficio.

### D-2 — Formato del archivo de rol: el de STORY-131 // satisface: AC-1, CNF-1

Frontmatter: `alwaysApply: false`, `name: product-owner`, `description`, `role` (I-1). Se retiran `tools:` y `model:`: la sesión no aplica esos campos a un archivo que solo lee, y `model: sonnet` solo existe en Claude.

- La `description` dice «Rol entrevistador», como `begin-intent`, `discovery-pm` y `story-mapper`. Es veraz: el cuerpo pregunta al usuario («Refinamiento guiado: pregunta solo lo necesario», Fase 3).
- **Rechazada — conservar `tools: [..., AskUserQuestion]`:** declara un mecanismo de Claude que Codex no tiene.
- **Rechazada — sin frontmatter:** rompe la uniformidad con los demás roles de EPIC-24.

### D-3 — Cambios mínimos en el cuerpo // satisface: AC-1, CNF-1

Se conservan literales `## Principios`, el contenido de las cinco fases y `## Criterios de salida`. Solo cambian tres cosas:

1. **Intro (l.14), contexto de ejecución:** tras la frase actual se añade «Actúas dentro del skill `story-specify`, en el Paso 1 (Caso A) y en el Paso 5B: esta misma sesión pregunta al usuario. No lances subagentes ni delegues trabajo.».
2. **`## Cuando intervienes`, caso 1:** «Aclarar contexto de negocio, usuario, valor o alcance.» pasa a «Aclarar usuario, necesidad, valor, contexto y restricciones cuando el input de una historia nueva es incompleto (Paso 1, Caso A).». Así el rol nombra las cinco dimensiones que exige AC-1, con el mismo vocabulario que `SKILL.md` l.138. Los casos 2-5 no cambian: son los del Paso 5B.
3. **Encabezados de fase:** `### Paso N - <título>` pasa a `### Fase N - <título>` (N = 1…5; títulos sin cambio). Motivo: el rol ahora corre en la misma sesión que el skill, cuyos pasos son 0-7 con 5A y 5B. «Paso 5 - Actualizar» del rol podría leerse como el Paso 5A/5B del skill, y «Paso 1 - Leer contexto» como el Paso 1 del skill, que crea la historia. Con un subagente aislado la colisión no existía. Es la misma corrección que STORY-134 (D-3.3).

Tamaño previsto: unas 84 líneas (91 − 6 de `tools`/`model` − 2 de la `description` en bloque + 1 de `role`; la frase nueva va en el párrafo de la intro).

- **Rechazada — conservar «Paso N»:** deja la ambigüedad del ajuste 3 en un orquestador con dos subpasos 5.
- **Rechazada — añadir tildes al cuerpo:** amplía el diff y ensucia el contrato 2 sin que lo pida ningún AC.
- **Rechazada — añadir una sección `## Variables inyectadas`:** el rol corre en línea y ve el contexto de la sesión; lo que recibe en cada paso ya lo enumeran el Paso 1 (l.138) y el Paso 5B (l.241-245) del skill (I-2).

### D-4 — Mecanismo: la sesión lee el rol y lo ejecuta en línea en dos puntos // satisface: AC-1, CNF-1

| Punto | Texto final |
|---|---|
| Paso 1, Caso A, ítem 1 (l.138) | «Si el input del usuario es incompleto, leer `assets/agents/product-owner.md` (relativo al directorio de este skill) y seguir sus instrucciones en esta sesión para aclarar con el usuario usuario, necesidad, valor, contexto y restricciones. No lances un subagente. Al terminar el rol, continúa con el ítem 2.» |
| Paso 5B, título | «Paso 5B — Refinar historias no aprobadas con el rol `product-owner`» |
| Paso 5B, ítem 1 (l.240) | «Leer `assets/agents/product-owner.md` y seguir sus instrucciones en esta sesión. No lances un subagente.» |
| Paso 5B, ítem 2 (l.241) | «Usar como contexto del rol:» (la lista de cuatro elementos no cambia) |
| Paso 5B, ítem 3 (l.246) | «El rol debe:» (la lista no cambia) |

- **Rechazada — lanzar el rol como subagente genérico:** Codex no tiene subagentes registrados (`agentsDirectory: null`) y un subagente puede no poder preguntar al usuario. Es el `Para` de la historia y CNF-1.
- **Rechazada — integrar el contenido del rol en `SKILL.md`:** contradice la ubicación de ADR-0014 (Regla 1) y mezcla orquestación con técnica de refinamiento en un archivo de 315 líneas.

### D-5 — Verificación de presencia al final del Paso 0, sin fallback // satisface: AC-2, AC-1

Al final del Paso 0, después del bloque `SDDF-ROOT-RESOLUTION: v1` y de la frase sobre `/skill-preflight`, el skill comprueba que existe `assets/agents/product-owner.md` (relativo al directorio del skill). Si falta, emite I-3 y termina: no detecta backlog, no pregunta, no invoca sub-skills y no crea ni modifica ningún `story.md`. La ausencia de fallback se redacta como en STORY-131: «no se buscan roles fuera del directorio de este skill», sin nombrar la carpeta global. Se añade la fila correspondiente a `### Manejo de errores`.

AC-2 dice «cuando el flujo necesita aclarar contexto». La comprobación temprana cumple ese escenario (el skill se detiene antes de llegar a ese punto) y además lo cumple sin efectos parciales.

- El bloque común del Paso 0 no se edita: la comprobación es un párrafo nuevo tras él. `scripts/audit-root-resolution.js` exige el marcador y el bloque, no que sea lo último del paso.
- **Rechazada — comprobar al entrar en el Paso 1 (Caso A) o en el Paso 5B:** en el Paso 5B, `story-improve` (Paso 5A) ya habría reescrito el `story.md` en curso y dejado `story.md.bak`. AC-2 exige que el `story.md` en curso no se modifique. Además, un input completo recorrería la sesión entera hasta descubrir el fallo en el primer `REFINAR`.
- **Rechazada — recurrir al agente global si falta el rol:** reintroduce la dependencia que la historia elimina; en Codex no existe.

### D-6 — Textos de `story-specify` que dejan de nombrar agentes // satisface: AC-1, CNF-1

| Archivo y sección | Texto actual | Texto final |
|---|---|---|
| `SKILL.md` Objetivo (l.25) | «Orquesta `story-creation → story-evaluation → story-split → story-improve → story-product-owner` en ciclo interactivo» | «Orquesta `story-creation → story-evaluation → story-split → story-improve` y el rol local `product-owner` en ciclo interactivo» |
| `SKILL.md` Objetivo (l.29) | «Invoca al agente `story-product-owner` para atender discovery y gaps de contexto…» | «Conduce en esta sesión, con el rol local `product-owner`, el discovery y los gaps de contexto…» |
| `SKILL.md` Dependencias (l.71) | «Agentes: [`story-product-owner`]» | «Rol local: `assets/agents/product-owner.md` (entrevistador, lo lee esta sesión).» |
| `SKILL.md` Restricciones (l.107) | «…usar el agente `story-product-owner`» | «…seguir el rol local `product-owner` en esta sesión, sin lanzar subagentes» |
| `SKILL.md` Paso 0 | — | Párrafo de D-5 |
| `SKILL.md` Paso 1 y Paso 5B | — | Textos de D-4 |
| `SKILL.md` Manejo de errores | — | Fila nueva: «Rol local `product-owner` ausente \| I-3 \| Detener en el Paso 0, sin crear ni modificar historias» |
| `README.md:15` | «└── story-product-owner → Refinamiento conversacional: discovery y gaps de contexto (Paso 5B)» | «└── rol product-owner → Refinamiento conversacional en esta sesión: discovery y gaps de contexto (pasos 1 y 5B)» |
| `README.md:54` | «Paso 5B: story-product-owner (conversacional)» | «Paso 5B: rol product-owner (conversacional)» |
| `README.md:67` | «`story-creation` / `story-product-owner`» | «`story-creation` / rol `product-owner`» |

La l.129 es parte del bloque común y no cambia. Tras estos cambios, `SKILL.md` no nombra ni invoca ningún agente, tampoco en Dependencias.

- **Rechazada — cambiar solo Dependencias y los pasos de invocación:** Objetivo y Restricciones seguirían diciendo «el agente», contra la regla de veracidad, y el contrato 4 fallaría. La historia lo pide expresamente (Notas, primer punto).

### D-7 — Evals: dos casos nuevos y TC-005 corregido // satisface: AC-1, AC-2

TC-005: en `description`, «luego story-product-owner (Paso 5B)» pasa a «luego el rol product-owner (Paso 5B)»; en `expected.contains`, `story-product-owner` pasa a `product-owner`. El resto no cambia. TC-001…TC-004 y TC-006 no cambian.

Casos nuevos, con el formato con sangría del archivo. Los valores se muestran tal como se escriben en `evals.json`, con los escapes incluidos:

| ID | Tipo | Umbral | `input.context` | `contains` | `not_contains` |
|---|---|---|---|---|---|
| TC-007 | `happy-path` | `0.9` | El usuario pide especificar una historia con un input incompleto: «quiero exportar clientes». Existe `skills/story-specify/assets/agents/product-owner.md`; no existe `agents/story-product-owner.agent.md`. El usuario responde las preguntas del rol y `story-evaluation` retorna APROBADA. | `assets/agents/product-owner.md`, `necesidad`, `restricciones`, `story-creation`, `story-evaluation` | `agents/story-product-owner`, `Rol local no encontrado` |
| TC-008 | `fail-fast` | `1` | No existe `skills/story-specify/assets/agents/product-owner.md`. Existe `docs/specs/stories/STORY-040-exportar-clientes/story.md` con `status: SPECIFY` y `substatus: IN-PROGRESS`. El usuario ejecuta `/story-specify` con un input incompleto. | `❌ Rol local no encontrado`, `assets/agents/product-owner.md` | `agents/story-product-owner`, `story-creation`, `story-evaluation`, `Refinamiento finalizado` |

- **Regla de escape (STORY-131 CR-003, STORY-134 D-7):** el nombre del agente retirado se escribe con un escape Unicode en una letra (`r` = `r`). `JSON.parse` devuelve el texto real, así que la aserción no cambia para el runner, y `git grep "story-product-owner" -- skills` queda vacío (contrato 3).
- TC-008 incluye una historia `IN-PROGRESS` y prohíbe `story-creation` y `story-evaluation`: mide que el skill no llegó a la detección de backlog ni a ningún sub-skill, es decir, que el `story.md` en curso no se tocó.
- Los evals se corren a mano (`npm run test:eval -- story-specify`), según `AGENTS.md`.
- **Rechazada — fixture de filesystem sin el rol:** el runner simula el mundo desde `input.context` (`scripts/run-evals.js`), igual que en STORY-131 y STORY-134.

### D-8 — Retiro de `agents/` condicionado a G-1 // satisface: AC-3

Precondición **G-1**, que se comprueba antes del `git mv` de D-1: `git ls-files "agents/*.agent.md"` lista solo `agents/story-product-owner.agent.md` y `git ls-files -o agents` no lista nada. Si lista otros agentes, STORY-129 o STORY-131…134 no están implementadas: se implementan AC-1 y AC-2 y AC-3 queda pendiente, sin forzar el retiro.

Con G-1 cumplida, el `git mv` de D-1 deja `agents/` sin archivos versionados. Después:

1. Se elimina el directorio vacío del árbol de trabajo (git no versiona directorios vacíos).
2. Se quita `"agents/"` de `package.json` → `files` (l.23). Los demás elementos y su orden no cambian.

`config/runtimes.json`, `scripts/install.js` y `scripts/cli.js` no cambian: `copyDir` ya omite la copia cuando falta la fuente, y `agentsDirectory` sigue declarando dónde instalaría agentes cada runtime (Regla 2).

- **Rechazada — poner `agentsDirectory: null` en los cuatro runtimes:** cambia el contrato de runtimes, los textos de la CLI y las pruebas de `verify-runtime-documentation.js` (que tratan a `null` como «solo skills»). La épica fija lo contrario.
- **Rechazada — retirar `agents/` en un chore separado:** la historia lo asume (AC-3) porque es la última migración del orden de la épica.

### D-9 — Pruebas de instalación: derivar lo esperado de la fuente, no exigir la carpeta // satisface: AC-3

La Regla 2 de ADR-0014 permite que `agents/` vuelva con una utilidad global. Por eso las pruebas no fijan «no hay agentes», sino «se instala exactamente lo que trae la fuente, y si no trae nada, no se crea el destino».

| Archivo | Cambio |
|---|---|
| `test/install.test.js` l.126 | `sourceAgents` pasa a ser la lista de `topLevelEntries(agents/)` si la carpeta existe, o la lista vacía si no |
| `test/install.test.js` l.135-140 | Para runtimes con agentes: si `sourceAgents` está vacía, se comprueba `result.agents` = `{ installed: 0, skipped: 0 }` y que `<raíz>/<agentsDirectory>` no existe; si no, la comparación actual. La rama de Codex no cambia |
| `test/install.test.js` l.152-153 (CR-001) | Igual que la fila anterior, en la prueba global |
| `scripts/smoke-package-install.js` l.225-238 | Para runtimes con agentes: si `packageDir/agents` existe, `assertSameTree` como hoy; si no, se comprueba que `<raíz>/<agentsDirectory>` no existe, con un mensaje propio (`<runtime> no debe crear agentes sin fuente`). La rama de Codex no cambia |

- **Rechazada — afirmar siempre «sin agentes» (borrar la rama de copia):** contradice la Regla 2 y deja sin cobertura la copia de `agents/` si la carpeta vuelve.
- **Rechazada — crear un fixture con `agents/` para mantener la prueba de copia:** `installSDDF` lee la fuente de `SOURCE_DIR` fijo; cambiarlo para inyectar una fuente amplía el diff del instalador sin que lo pida ningún AC.
- **Rechazada — una prueba que falle si `agents/` existe:** convertiría la Regla 2 en una prohibición.

### D-10 — Documentos que el retiro deja falsos // satisface: AC-3

Por la regla de veracidad de `AGENTS.md` y la excepción de la épica (Notas: «cada historia corrige … lo que su propia migración deja falso»), se corrigen solo las frases que describen `agents/` como fuente actual del paquete:

| Archivo | Texto actual (extracto) | Texto final |
|---|---|---|
| `AGENTS.md:8` | «…y los subagentes en `agents/<nombre>.agent.md`. … verifica con `ls skills/` / `ls agents/` antes de referenciar algo.» | «…y sus roles y subagentes locales dentro del propio skill (`skills/<skill-name>/assets/agents/`, ADR-0014). … verifica con `ls skills/` antes de referenciar algo.» |
| `README.md:77` | Fila «Agentes declarativos \| `agents/` \| Aportan especialización…» | Fila «Roles y subagentes locales \| dentro de cada skill, en `skills/<skill>/` \| Especializan un paso del skill y se instalan con él.» |
| `README.md:312` | «…reciben skills y agentes que admite su contrato.» | «…reciben skills; su contrato admite también agentes Markdown, pero el paquete no publica agentes globales.» (la frase de aliases sigue igual) |
| `README.md:315` | «El instalador no copia ni convierte los archivos de `agents/` a subagentes de Codex; si los necesitas…» | «Los roles y subagentes locales viajan dentro de cada skill, así que llegan con él; el instalador no los registra como subagentes de Codex.» |
| `SECURITY.md:6` | «the skills under `skills/`, the subagents under `agents/`, the constitution…» | «the skills under `skills/` (including the roles and local subagents they package), the constitution…» |
| `docs/architecture/sddf-architecture.md:141` | `├── agents/  # fuente única: subagentes (*.agent.md)` | Se elimina la línea |
| `docs/architecture/tech-stack.md:138` | `agents/  skills/  config/  …` | `skills/  config/  …` |
| `docs/constitution.md:259` | «…verificar con `ls skills/` y `ls agents/` (la fuente de skills/agentes de este repo vive en la raíz…)» | «…verificar con `ls skills/` (la fuente de skills, con sus roles y subagentes locales, vive en la raíz…)» |

`README.md` conserva las cadenas que exige `scripts/verify-runtime-documentation.js` (`--target codex`, `` `.agents/skills` ``, «solo skills», `` `--target .agents` ``, «no es un target válido»). `SECURITY.md:68` no cambia: describe la validación del instalador, que sigue siendo cierta.

- **Rechazada — dejarlo todo para el chore de documentación:** `AGENTS.md` y la constitución mandan a los agentes ejecutar `ls agents/`, que fallaría desde el commit del retiro. La épica reserva para el chore la revisión general y los registros históricos, que aquí tampoco se tocan.
- **Rechazada — corregir también `CHANGELOG.md`, `roadmap.md`, `story-map.md` y `FR-034`:** son historia o trazabilidad de decisiones pasadas, no descripciones del estado actual.

### D-11 — Auditoría de seguridad: sin cambios // satisface: AC-3

`skill-security-audit.yml` conserva `agents/**`, `verify-skill-security-workflow.js` lo sigue exigiendo y `run-skill-shielder-audit.js` conserva el perfil `agents`, que con la carpeta ausente audita cero archivos sin error. Los roles nuevos viajan dentro de `skills/`, que ya se audita.

- **Rechazada — quitar `agents/**` del workflow y del verificador:** si la carpeta vuelve (Regla 2), su contenido quedaría sin auditar. Un patrón de ruta sin coincidencias no tiene coste.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Rol `product-owner` | crear (vía `git mv` + ajustes, D-1…D-3) | `skills/story-specify/assets/agents/product-owner.md` | AC-1, AC-2, CNF-1 |
| Agente global `story-product-owner` | eliminar (consecuencia del `git mv`) | `agents/story-product-owner.agent.md` | AC-1, AC-3 |
| Orquestador `story-specify` | modificar Objetivo, Dependencias, Restricciones, Paso 0 (D-5), Paso 1 y Paso 5B (D-4) y Manejo de errores (D-6) | `skills/story-specify/SKILL.md` | AC-1, AC-2, CNF-1 |
| Ficha del skill | modificar l.15, l.54 y l.67 (D-6) | `skills/story-specify/README.md` | AC-1 |
| Evals | añadir TC-007 y TC-008; corregir TC-005 (D-7) | `skills/story-specify/evals/evals.json` | AC-1, AC-2 |
| Carpeta global de agentes | eliminar (D-8) | `agents/` | AC-3 |
| Manifiesto del paquete | quitar `"agents/"` de `files` (D-8) | `package.json` | AC-3 |
| Pruebas del instalador | modificar l.126, l.135-140 y l.152-153 (D-9) | `test/install.test.js` | AC-3 |
| Smoke del tarball | modificar l.225-238 (D-9) | `scripts/smoke-package-install.js` | AC-3 |
| Documentos de estado actual | modificar las frases de D-10 | `AGENTS.md`, `README.md`, `SECURITY.md`, `docs/architecture/sddf-architecture.md`, `docs/architecture/tech-stack.md`, `docs/constitution.md` | AC-3 |
| `config/runtimes.json`, `scripts/install.js`, `scripts/cli.js`, workflow y scripts de seguridad | sin cambio (D-8, D-11) | — | — |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| I-1 — Archivo de rol `product-owner` (formato de STORY-131) | Frontmatter: `alwaysApply: false`, `name: product-owner`, `description`, `role` (valores en Esquema de datos). Cuerpo: intro (D-3.1), `## Principios`, `## Cuando intervienes` (D-3.2), `## Proceso de trabajo` con `### Fase 1 - Leer contexto disponible` … `### Fase 5 - Actualizar sin romper el formato` (D-3.3) y `## Criterios de salida` | AC-1, CNF-1 |
| I-2 — Contexto que recibe el rol (sin cambios respecto de hoy) | Paso 1, Caso A: el input del usuario y el foco «usuario, necesidad, valor, contexto y restricciones». Paso 5B: la historia actual, el resultado de `story-evaluation`, el diagnóstico de `story-split` si existió y el `story-improvement-log.md` si existió | AC-1 |
| I-3 — Error de rol ausente (formato de STORY-131) | `❌ Rol local no encontrado: assets/agents/product-owner.md (skill story-specify). Reinstala el skill; no se modificó ningún archivo.` El skill termina sin detectar backlog, preguntar, invocar sub-skills ni escribir | AC-2 |
| I-4 — Salida del rol (sin cambios) | Paso 1: contexto refinado que la sesión pasa a `story-creation`. Paso 5B: mejoras aplicadas al `story.md` activo, que conserva `status: SPECIFY` / `substatus: IN-PROGRESS` | AC-1 |
| I-5 — Contrato de instalación de agentes (sin cambios en el código) | `installSDDF(...).agents` = `{ installed: N, skipped: M }`, con N + M = entradas de `agents/` en la fuente; si la fuente no existe, `{ 0, 0 }` y el destino `<raíz>/<agentsDirectory>` no se crea. D-9 hace que las pruebas verifiquen este contrato | AC-3 |

## Esquema de datos

Frontmatter de `product-owner.md`:

| Clave | Tipo | Valor |
|---|---|---|
| `alwaysApply` | booleano | `false` |
| `name` | string kebab | `product-owner` |
| `description` | string | `Rol entrevistador del skill story-specify: aclara con el usuario usuario, necesidad, valor, contexto y restricciones de una historia y propone mejoras de redacción, criterios de aceptación y split. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.` |
| `role` | string | `Product Owner — Especificación` |

`package.json` → `files` final: `["skills/", "config/", "scripts/", "sddf.config.yaml", "README.md", "LICENSE"]`.

Sin cambios en el esquema de `story.md` ni en el de `evals.json`.

## Flujos clave

### F-1 — `/story-specify` con el rol presente e input incompleto (AC-1)

1. Paso 0 resuelve `$SPECS_BASE` y comprueba que existe `assets/agents/product-owner.md`.
2. Paso 1, Caso A: el input es incompleto; la sesión lee el rol y recorre sus fases 1-4. Pregunta al usuario (en tandas de 3-4) por usuario, necesidad, valor, contexto y restricciones, con el mecanismo del runtime o en línea en Codex. No lanza subagentes.
3. La sesión invoca `story-creation` con el contexto refinado y sigue con `story-evaluation`, `story-split` y `story-improve` según la decisión (pasos 2-5A sin cambios).
4. Si la decisión no es `APROBADA`, el Paso 5B vuelve a leer el rol con el contexto de I-2 y aplica las mejoras; después, el gate del Paso 6.

### F-2 — `/story-specify` sin `product-owner.md` (AC-2)

1. Paso 0 resuelve `$SPECS_BASE` y no encuentra `assets/agents/product-owner.md`.
2. Emite I-3 y termina: no detecta backlog, no pregunta, no invoca sub-skills, no crea ni modifica ningún `story.md` y no busca el rol fuera del directorio del skill.

### F-3 — Retiro de `agents/` (AC-3)

1. Se comprueba G-1. Si falla, AC-3 queda pendiente y el flujo termina aquí.
2. `git mv` de D-1; `git ls-files agents` queda vacío y se elimina el directorio.
3. Se quita `"agents/"` de `package.json` → `files`; se aplican D-9 y D-10.
4. `npm run verify:repository` ejecuta `node --test test` (I-5 con la fuente ausente) y el smoke del tarball, que corre `install --target <runtime>` local y global para los cuatro runtimes y exige código 0.

### F-4 — El usuario no responde al rol (P7)

1. Si el usuario abandona la entrevista en el Paso 1, no se invoca `story-creation`: no se crea ninguna historia.
2. Si la abandona en el Paso 5B, la historia conserva `SPECIFY/IN-PROGRESS` y el gate del Paso 6 ofrece `Dejar en IN-PROGRESS`. Es el comportamiento de hoy cuando el agente no obtiene respuesta.

## Decisiones de complejidad justificada

- **Sin mecanismo nuevo.** Se reutilizan el formato, la comprobación, el error y la redacción de STORY-131 y STORY-134. No hay loader, registro de roles ni script nuevo.
- **Renombrar «Paso» a «Fase» en el rol (D-3.3).** Es el único cambio del cuerpo que no es de identificación o alcance; se justifica por la colisión con los pasos 1 y 5A/5B del skill en la misma sesión.
- **Ampliar el caso 1 de `## Cuando intervienes` (D-3.2).** Una sola línea; alinea el rol con las cinco dimensiones de AC-1, que hoy solo enumera `SKILL.md`.
- **Pruebas condicionadas a la fuente (D-9).** Una rama más por prueba. Una prueba más simple («no hay agentes») contradiría la Regla 2 de ADR-0014.
- **Corregir ocho frases de documentación (D-10).** Es el mínimo que deja verdaderas las instrucciones de agentes y la descripción del paquete; la revisión general sigue en el chore.
- **Autoevaluación estructural (P9/P11).** Dependencias: skill → rol local (lectura); rol → `story.md` (escritura en el Paso 5B, la misma que hoy). Instalador → `agents/` opcional (I-5). Sin ciclos. El rol tiene una responsabilidad (refinar una historia con el usuario) y el skill conserva la orquestación y el estado. I-2 e I-4 no cambian.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existe el rol y no el agente global | `git ls-files skills/story-specify/assets/agents` lista exactamente `product-owner.md`; `git ls-files agents/story-product-owner.agent.md` sin salida | AC-1 |
| 2 | Contenido sin pérdida | `git diff -M main -- agents/story-product-owner.agent.md skills/story-specify/assets/agents/product-owner.md` muestra el renombrado con cambios limitados al frontmatter (D-2) y a los tres ajustes de D-3; `## Principios` y `## Criterios de salida` no cambian | AC-1 |
| 3 | Ninguna mención del agente global | `git grep -n "story-product-owner" -- skills agents config test scripts` sin salida | AC-1 |
| 4 | `story-specify` no nombra agentes ni la carpeta global | `grep -n "agents/" skills/story-specify/SKILL.md \| grep -v "assets/agents/"` sin salida; `grep -niE "(^\|[^b])agentes?\b" skills/story-specify/SKILL.md \| grep -v "skills, agentes o comandos del runtime"` sin salida; `grep -n "agente" skills/story-specify/README.md` sin salida | AC-1, CNF-1 |
| 5 | El rol se lee en los dos puntos y se comprueba en el Paso 0 | `grep -n "assets/agents/product-owner.md" skills/story-specify/SKILL.md` aparece en Dependencias, Paso 0, Paso 1 y Paso 5B; `grep -c "No lances un subagente" skills/story-specify/SKILL.md` da 2 | AC-1, AC-2, CNF-1 |
| 6 | Sin colisión de pasos y con las cinco dimensiones | `grep -c "^### Paso" …/product-owner.md` da 0, `grep -c "^### Fase [1-5] - "` da 5; `grep -n "necesidad, valor, contexto y restricciones" …/product-owner.md` tiene salida | AC-1 |
| 7 | Sin `tools:` ni `model:` | `grep -E "^(tools\|model):" …/product-owner.md` sin salida | AC-1, CNF-1 |
| 8 | UTF-8 sin BOM | los tres primeros bytes de los archivos modificados no son `EF BB BF`, y `grep -lE "Ã\|ðŸ"` sobre ellos sin salida | AC-1, AC-3 |
| 9 | El JSON de evals parsea y conserva la aserción | `node -e "JSON.parse(require('fs').readFileSync('skills/story-specify/evals/evals.json','utf8'))"` sin error; una vez parseado, el `not_contains` de TC-007 contiene `agents/story-product-owner` | AC-1, AC-2 |
| 10 | Comportamiento de AC-1 y AC-2 | `npm run test:eval -- story-specify` (manual): TC-001…TC-008 en verde | AC-1, AC-2 |
| 11 | `agents/` retirada | `git ls-files agents` sin salida; `test -d agents` falla; `node -e "process.exit(require('./package.json').files.includes('agents/')?1:0)"` termina con 0 | AC-3 |
| 12 | Instalación con código 0 por runtime | `node scripts/smoke-package-install.js` termina con 0 (cubre `install --target <runtime>` local y global de cada runtime de `config/runtimes.json`) | AC-3 |
| 13 | Documentación veraz | `git grep -nE "(^\|[^./a-z-])agents/" -- AGENTS.md README.md SECURITY.md docs/architecture docs/constitution.md \| grep -v "assets/agents/"` sin salida, salvo `docs/constitution.md:126` (árbol de un skill) y `SECURITY.md:68` (D-10) | AC-3 |
| 14 | Gate determinista | `npm run verify:repository` termina con exit 0 | AC-1, AC-2, AC-3 |

## Risks / Trade-offs

- **[Orden] AC-3 depende de cinco historias** → si alguna no está implementada, G-1 falla. Mitigación: D-8 separa AC-1/AC-2 de AC-3; la historia no pasa a DONE hasta cumplir G-1 y los contratos 11-14.
- **[Contexto] El refinamiento corre en la sesión principal** → la sesión acumula historia, reporte FINVEST y respuestas. Se acepta: es el trade-off de ADR-0014 para entrevistadores, y el rol añade unas 84 líneas.
- **[Entorno local] Copia instalada del agente global** → `.claude/agents/story-product-owner.agent.md` es salida ignorada que `install` no borra; el harness seguiría ofreciéndolo como subagente. Lo mismo vale para las copias de los otros nueve agentes. Mitigación: tras el retiro, borrar a mano `.claude/agents/*.agent.md` que vinieron de `agents/` (no los de otros orígenes), reinstalar con `npx agile-sddf install --target claude-code --force` y comprobar que existe `.claude/skills/story-specify/assets/agents/product-owner.md`. D-5 no admite fallback, así que una copia residual no cambia el flujo.
- **[Proyectos consumidores] Instalaciones previas conservan agentes globales** → `install` no borra archivos retirados. Mitigación: chore de guía de migración del release major (Non-Goals).
- **[CLI] Mensajes «skills and agents» y «0 agents»** → la CLI sigue anunciando agentes para los runtimes que los admiten. Se acepta: describen el contrato de runtimes, que no cambia (D-8).
- **[Evals existentes] TC-001…TC-006 no mencionan el rol** → el runner podría asumir que falta y emitir I-3. Mitigación: igual que en STORY-131 y STORY-134, si un caso falla por esto se añade «existe el rol local product-owner» a su `input.context`, sin tocar `expected`.
- **[Constitución] D-10 edita `docs/constitution.md:259`** → es el documento de mayor autoridad. Se acepta: el cambio es factual (una ruta que deja de existir) y no altera el principio.

## Open Questions

Ninguna. El nombre y la ruta del rol los fija la historia; el momento de la comprobación de AC-2 queda resuelto en D-5, y el alcance del retiro en D-8…D-11.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: las Notas de la historia listan dos pruebas que exigen `agents/` (`test/install.test.js:126` y `scripts/smoke-package-install.js:226,236`). Hay una tercera: `test/install.test.js:153` exige que exista el destino de agentes en la instalación global, y `copyDir` no lo crea cuando falta la fuente.
- **Documento afectado**: story.md (Notas) / design.md
- **Acción requerida**: D-9 ya la cubre. Opcional: añadir `test/install.test.js:153` a la nota de cierre de `story.md`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: el retiro de `agents/` deja falsas ocho frases que describen la carpeta como fuente actual (`AGENTS.md:8`, `README.md:77,312,315`, `SECURITY.md:6`, `sddf-architecture.md:141`, `tech-stack.md:138`, `constitution.md:259`). La historia no las menciona y la épica deja la documentación para el chore de cierre, salvo lo que la propia migración deja falso.
- **Documento afectado**: story.md (Notas) / design.md
- **Acción requerida**: D-10 las incluye en el alcance por la excepción de la épica. Confirmar con el PO que la corrección de `AGENTS.md` y `docs/constitution.md` entra en esta historia; si no, mover D-10 al chore y aceptar que esas frases queden falsas hasta entonces.
