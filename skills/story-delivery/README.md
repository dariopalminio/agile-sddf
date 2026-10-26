# story-delivery

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/story-delivery/SKILL.md`  
> **Status:** stable

---

## What it does

Lleva una historia aceptada a `DELIVER/DONE` tras verificar, criterio por criterio, el DoD de entrega (`docs/guardrails/dod-story-deliver.md`). Muestra cada criterio con su estado (✅, ❌ o «no aplica en batch») y la evidencia que lo respalda: un comando, un archivo del repo o la confirmación humana. Solo escribe si nada bloquea y el usuario confirma la entrega.

**Produces:**

- El frontmatter de `story.md` actualizado a `status: DELIVER`, `substatus: DONE` y `updated:` con la fecha de hoy, solo cuando la entrega se confirma.
- `delivery-report.md` en la carpeta de la historia, solo en una entrega forzada con `--force` que omitió algún gate.
- En consola, la tabla `| # | Criterio | Estado | Evidencia |`.

**Does not do:**

- No despliega, no publica en npm, no crea tags ni manifiestos de release.
- No escribe `SHIP` ni `COMPLETED`, ni archiva la historia.
- No crea ningún archivo en la entrega normal ni con `--dry-run`: si la entrega no ocurre, `story.md` queda byte a byte igual.
- No audita, lista ni revierte overrides previos.

## Precondición y bloqueos

| Situación | Resultado |
|---|---|
| `story.md` en `ACCEPTANCE/DONE`, `delivery-model: batch`, DoD cumplido y el usuario confirma | `DELIVER/DONE` |
| `story.md` en `ACCEPTANCE/DONE`, `delivery-model: continuous`, el usuario afirma que el incremento ya está desplegado, DoD cumplido y el usuario confirma | `DELIVER/DONE` |
| Estado distinto de `ACCEPTANCE/DONE` | se detiene nombrando el estado actual |
| `defaults.delivery-model` ausente, vacío o distinto de `batch` y `continuous` (o `sddf.config.yaml` ausente) | se detiene con el valor leído y los valores válidos: `batch`, `continuous` |
| `continuous` y el usuario no afirma el despliegue | se detiene antes de evaluar el DoD: en `continuous`, DELIVER exige el despliegue previo |
| DoD de entrega ausente o sin criterios | se detiene: sin DoD no hay entrega que registrar |
| Algún criterio ❌ con `enforcement: error` | lista los incumplidos y se detiene sin pedir confirmación |
| El usuario responde distinto de `s` a la confirmación final | `Entrega cancelada por el usuario. story.md no cambió.` |

Los bloqueos por estado previo y por DoD incumplido terminan con la sugerencia `→ Para entregar igualmente: /story-delivery STORY-NNN --force …`. El rechazo de la confirmación y los errores de configuración no la muestran, porque `--force` no los supera.

El significado de DELIVER depende de `defaults.delivery-model` en `sddf.config.yaml`. No hay valor por defecto: si falta, el skill falla cerrado.

- **`batch`:** DELIVER significa «listo para el próximo release, todavía sin publicar». Los criterios que exigen el paquete ya publicado o el incremento desplegado figuran como «no aplica en batch» y no bloquean.
- **`continuous`:** DELIVER significa «incremento ya desplegado en producción». Antes de evaluar el DoD, el skill pregunta `¿El incremento de STORY-NNN ya está desplegado en producción? (s/n)`; solo con `s` continúa. Los criterios que exigen el paquete publicado se evalúan por confirmación humana. El skill no ejecuta, dispara ni comprueba el despliegue.

---

## When to use

**Use it when:**

- La historia esté en `ACCEPTANCE/DONE` (veredicto `APPROVED` de `story-acceptance`) y quieras registrar que está lista para producción.
- The user mentions: `"story-delivery"`, `"entregar historia"`, `"DELIVER"`.

**Do NOT use it when:**

- La historia aún no pasó la validación humana final → use `[[story-acceptance]]` instead.
- Quieras publicar el paquete o desplegar: este skill solo verifica y registra la entrega.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-delivery STORY-NNN [--dry-run] [--force]` o `/story-delivery specs/flow/STORY-NNN-<slug>/ [--dry-run] [--force]`; los flags van en cualquier orden. Soporta `delivery-model: batch` y `continuous`. Un flag distinto de `--dry-run` y `--force` detiene el skill sin cambios.

### `--dry-run`: previsualizar

Evalúa el DoD y muestra qué haría, sin crear, modificar ni borrar ningún archivo (tampoco en `.tmp/`). No se detiene en el estado previo: lo registra como bloqueo y sigue, para mostrar también la evaluación del DoD. Hace las preguntas de los criterios de confirmación (responder no escribe nada), pero no la confirmación final. Solo ejecuta los comandos de evidencia que llevan `--dry-run` (p. ej. `npm pack --dry-run`); el resto figura como `⏸ no evaluado (dry-run)`. Termina siempre con `🔍 Dry-run: no se creó, modificó ni borró ningún archivo.`

### `--force`: entrega forzada

Entrega aunque la historia no esté en `ACCEPTANCE/DONE` o el DoD tenga criterios ❌ con `enforcement: error`. Solo omite esos dos gates:

| Gate | Con `--force` |
|---|---|
| Estado distinto de `ACCEPTANCE/DONE` | se omite con aviso (incluidos `CANCELED` y `BLOCKED`) |
| DoD incumplido con `enforcement: error` | se omite con aviso; el DoD se evalúa entero igualmente |
| Confirmación final | obligatoria: `¿Confirmas la entrega FORZADA de STORY-NNN a DELIVER/DONE omitiendo …? (s/n)` |
| Afirmación de despliegue en `continuous` | obligatoria |
| `delivery-model` inválido, DoD ausente, historia archivada | detienen igual |

Si se omitió algún gate y el usuario confirma, el skill escribe primero `delivery-report.md` (desde `assets/delivery-report-template.md`) con la fecha del override, el estado previo, los gates omitidos y los criterios incumplidos, y después `story.md`. Si la historia ya tenía un `delivery-report.md`, añade una sección `## Override <n>` sin reescribir las anteriores. Con `--force` sobre una historia que no estaba bloqueada no hay override: no se crea reporte.

Con `--dry-run --force` manda `--dry-run`: describe la entrega forzada y los gates que omitiría, sin escribir.
