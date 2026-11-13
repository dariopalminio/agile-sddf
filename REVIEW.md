# REVIEW.md — Guía de revisión de agile-sddf

Esta guía decide qué se reporta y con qué severidad; no cambia el formato del informe.
Vocabulario: 🔴 Important = HIGH/MEDIUM (bloquea en `/story-code-review`) · 🟡 Minor = LOW (no bloquea) · 🟣 Pre-existing = PREEXISTENTE (se informa, no bloquea).

## Qué es «Importante» aquí — 🔴 Important · HIGH/MEDIUM

Reserva 🔴 Important (HIGH/MEDIUM) para hallazgos que rompan el comportamiento, filtren datos o bloqueen un rollback seguro:

- `skills/` (`skills/*/SKILL.md`, `skills/*/agents/*.agent.md`, `skills/*/assets/agents/`):
  - Contrato roto entre un skill y su subagente: variables del bloque de contexto o frontmatter del informe parcial.
  - Un subagente escribe su informe fuera de la ruta de `.tmp/` que lee su skill.
  - Un subagente delega en otro subagente o invoca un skill orquestador: solo la sesión que ejecuta el skill delega, y en un solo nivel.
  - Una transición de `status`/`substatus` que el ciclo de vida del skill no declara.
- `scripts/`:
  - Escribe fuera de `REPO_ROOT` o de los destinos de `config/runtimes.json`.
  - Instala agentes Markdown en `.agents`, que nunca es destino de los agentes de este paquete.
  - Sobrescribe un archivo existente sin `--force`.
- `docs/adr/`:
  - Un ADR aceptado se edita in place en lugar de reemplazarse con un ADR nuevo (`superseded-by`).
- `docs/templates/`:
  - Un cambio de forma (sección, clave de frontmatter, placeholder) que rompe al skill que lee o copia la plantilla.
- `docs/guardrails/`:
  - Un cambio de forma (líneas de criterio `- [ ]`, `enforcement` del frontmatter, identificadores de regla) que rompe a los skills que lo resuelven.
- Cualquier archivo:
  - Un secreto o una credencial real versionados.
  - Documentación que describe algo que no existe en el filesystem.

Un 🔴 Important (HIGH/MEDIUM) exige `archivo:línea` y un escenario de fallo concreto (entrada o estado → resultado incorrecto).
Estilo, nombres y refactors: 🟡 Minor (LOW) como máximo.

## Tope de Minor — 🟡 Minor · LOW

- Máximo **5** 🟡 Minor (LOW) por revisor: elige los más relevantes y resume el resto en una línea.
- No repitas un 🟡 Minor (LOW) de una ronda anterior si el rework no tocó esas líneas.
- Si no hay hallazgos por encima de 🟡 Minor (LOW), dilo en una frase, sin elogios ni resúmenes archivo por archivo.

## No reportar

- Lo que ya comprueba el CI con `npm run verify:repository`: pruebas deterministas (`node --test test`), sintaxis Node, contrato de layout fijo, perfiles y stacks, runtimes documentados, configuración YAML, inventario de evals, contrato de validación, enlaces activos, cadena de suministro, workflow de seguridad de skills, release, contenido publicable (`npm pack --dry-run`) y smoke del tarball.
- Copias de instalación: los destinos que declara `config/runtimes.json` (p. ej. `.claude/`, `.github/skills/`, `.agents/`). No se revisan ni sirven como fuente de reglas: la fuente es `skills/`.
- Artefactos generados e históricos: `.tmp/`, `graphify-out/` y `specs/flow/archive/`. No se revisan ni sirven como fuente de criterio.
- Datos falsos intencionados (secretos, tokens o credenciales de ejemplo) en fixtures y pruebas: `skills/*/examples/` y `skills/*/evals/`.
- Código de terceros: `node_modules/`.
- Líneas que la historia no tocó → 🟣 Pre-existing (PREEXISTENTE): se informa, no bloquea.

## Verificar siempre

Ninguna de estas comprobaciones la ejecuta `npm run verify:repository`. Un incumplimiento es 🔴 Important (HIGH/MEDIUM).

En cada revisión, confirma que:

- [ ] Los archivos del alcance de la historia no contienen caracteres invisibles (`ai-no-hidden-characters`), comprobado por bytes con el comando de `docs/guardrails/gr-ai-security-checklist.md`, no a simple vista.
- [ ] Si cambia el comportamiento de un skill, su `skills/*/evals/evals.json` se actualiza en la misma historia (principio 11 de `docs/constitution.md`). El gate solo exige que cada skill tenga evals o una excepción.
- [ ] La lista de runtimes no se duplica en `skills/` ni en `scripts/`: se deriva de `config/runtimes.json`. El gate solo revisa la documentación.
- [ ] Skills, agentes y documentos están en español, salvo los skills heredados de ecosistemas en inglés.
