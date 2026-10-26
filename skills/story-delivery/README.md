# story-delivery

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/story-delivery/SKILL.md`  
> **Status:** stable

---

## What it does

Lleva una historia aceptada a `DELIVER/DONE` tras verificar, criterio por criterio, el DoD de entrega (`docs/guardrails/dod-story-deliver.md`). Muestra cada criterio con su estado (✅, ❌ o «no aplica en batch») y la evidencia que lo respalda: un comando, un archivo del repo o la confirmación humana. Solo escribe si nada bloquea y el usuario confirma la entrega.

**Produces:**

- El frontmatter de `story.md` actualizado a `status: DELIVER`, `substatus: DONE` y `updated:` con la fecha de hoy, solo cuando la entrega se confirma.
- En consola, la tabla `| # | Criterio | Estado | Evidencia |`.

**Does not do:**

- No despliega, no publica en npm, no crea tags ni manifiestos de release.
- No escribe `SHIP` ni `COMPLETED`, ni archiva la historia.
- No crea ningún archivo: si la entrega no ocurre, `story.md` queda byte a byte igual.

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

Usa `/story-delivery STORY-NNN` o `/story-delivery specs/flow/STORY-NNN-<slug>/`. Esta versión no acepta flags y soporta `delivery-model: batch` y `continuous`.

## Extensiones previstas

Planificada en EPIC-27, aún no implementada:

- Flags `--dry-run` y `--force`, con registro del override (STORY-163).
