---
type: wiki
slug: guardrails-index
title: "Índice de Guardrails"
date: 2026-09-20
parent: null
---

# 🛡️ Guardrails

> Restricciones operativas y técnicas **verificables** que un agente IA (o un humano) no debe violar
> al trabajar sobre este repositorio. Cada guardrail es un checklist con severidades (`error`, `warn`)
> cuyo incumplimiento bloquea. Hay dos clases:
>
> - **Content guardrails** (`gr-*-checklist.md`): protegen el contenido del repositorio; sus reglas
>   deterministas se comprueban con comandos que el propio archivo define (`grep`, `git ls-files`,
>   `git check-ignore`, Python 3) — sin scanner externo ni servicio de CI.
> - **Transition guardrails** (`dod-*-checklist.md`): protegen la transición entre estados de un
>   work item; los verifica el skill del pipeline que ejecuta esa transición.

---

## Guardrail vs Policy

| Aspecto | Guardrail (`docs/guardrails/`) | Policy (`docs/policies/`) |
|---------|--------------------------------|---------------------------|
| Naturaleza | Restricción operativa/técnica | Regla de gobernanza |
| Formato | Checklist con severidades | Documento declarativo (principios, convenciones) |
| Verificación | Determinista + revisión semántica | Humana o semiautomática |
| Incumplimiento | Bloquea (`error`) o advierte (`warn`) | Requiere juicio; puede escalarse |
| Audiencia primaria | Agentes IA y CI | Humanos y equipos |

Ambas capas derivan de la [constitución](../constitution.md), que vive un nivel arriba en `docs/`:
las policies la desarrollan y los guardrails la hacen verificable (`originates-from`). Una policy puede
originar uno o más guardrails. El modelo completo está en
[domain-knowledge-artifacts.md](../domains/domain-knowledge-artifacts.md#6-guardrail-vs-policy); el índice
de policies en [policies/README.md](../policies/README.md).

---

## Regla de incumplimiento

Todos los guardrails comparten el mismo contrato **on breach**:

| Severidad | Efecto |
|-----------|--------|
| `(error)` | Bloquea la entrega — detenerse, nombrar el id de la regla y corregir antes de continuar |
| `(warn)` | No bloquea — aplicarla, o explicar por qué no se aplicó |
| Regla semántica | Si falla, se eleva a juicio humano; nunca se resuelve en silencio |

---

## Convención

- **Nombre de archivo:** `gr-<ámbito>-checklist.md` para content guardrails; `dod-<workitem>-checklist.md` para transition guardrails (kebab-case en ambos casos)
- **Frontmatter:** `type: guardrail`, `kind: content | transition`, `enforcement: error | warn`, `slug` igual al nombre del archivo sin extensión (hoy solo lo lleva el transition guardrail; los `gr-*` aún no tienen frontmatter)
- **Ids de regla:** cada content guardrail usa un prefijo propio (`sec-*`, `ai-*`, `skill-*`, `agent-*`) que los checks imprimen tal cual, de modo que un id que falla identifica al guardrail que lo posee; los transition guardrails se organizan por estado (`SPECIFY`, `PLAN`, `IMPLEMENT`, …) en lugar de por id
- **Sin duplicación:** una regla vive en un solo guardrail; los demás la referencian con una nota (`> … Do not duplicate …`) en lugar de copiarla
- **Estructura mínima de cada content guardrail:**

| Sección | Contenido |
|---------|-----------|
| Encabezado | Ámbito: a qué aplica y a qué **no** aplica (con enlace al guardrail que sí cubre ese caso) |
| `## Mandatory rules` | Contrato on-breach + `### Deterministic rules` (con id y severidad) + `### Semantic rules` |
| `## Minimum expected structure` | Forma mínima que debe tener el artefacto gobernado |
| `## How to run the validation` | Bloque `bash` autocontenido que ejecuta todos los checks deterministas |
| `## Verification` | Cómo interpretar el resultado (y excepciones aceptadas, si las hay) |
| `## Source of truth` | Fuentes autoritativas que el guardrail resume |

---

## Cómo ejecutar un guardrail

Cada content guardrail define sus checks en un bloque `bash` completo. Para extraerlo y ejecutarlo desde la raíz del repositorio:

```bash
sed -n '/^```bash$/,/^```$/p' docs/guardrails/gr-ai-security-checklist.md | sed '1d;$d' > run-guardrail.sh
bash run-guardrail.sh
```

Los guardrails de skill y agente asumen una variable fijada una vez (`SKILL=skills/<skill-name>`,
`AGENT=<ruta al archivo del agente>`). Hoy ningún job de CI los ejecuta: corren en la máquina del
mantenedor (ver [SECURITY.md](../../SECURITY.md#how-this-repository-is-validated)).

El transition guardrail no se ejecuta a mano: cada skill del pipeline de historia (`story-analyze`,
`story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`) lee
la sección del estado que va a cerrar y bloquea la transición si no se cumple.

---

## Índice de guardrails

### Content guardrails

| Archivo | Ámbito | Prefijo de ids |
|---------|--------|----------------|
| [gr-code-security-checklist.md](gr-code-security-checklist.md) | Todo archivo commiteado: secretos y datos personales, scripts ejecutables, artefactos trackeados y comandos documentados | `sec-*` |
| [gr-ai-security-checklist.md](gr-ai-security-checklist.md) | Lo que el repositorio le dice a un agente: instrucciones en `SKILL.md`, entrada no confiable, acciones irreversibles, skills de terceros en `skills-lock.json` | `ai-*` |
| [gr-skill-creation-checklist.md](gr-skill-creation-checklist.md) | Creación y edición de Agent Skills bajo `skills/`: frontmatter, layout, presupuesto de contexto, seguridad, evals | `skill-*` |
| [gr-agent-creation-checklist.md](gr-agent-creation-checklist.md) | Creación y edición de agentes custom (`.claude/agents/` y equivalentes): frontmatter, identidad, permisos y tools | `agent-*` |

Los dos primeros son las mitades complementarias de la política de seguridad del repositorio; los dos
últimos gobiernan los artefactos que el instalador distribuye a los runtimes declarados en
[config/runtimes.json](../../config/runtimes.json).

### Transition guardrails

| Archivo | Ámbito | Verificado por |
|---------|--------|----------------|
| [dod-story-specify.md](dod-story-specify.md) | DoD SPECIFY (`SPECIFY/IN-PROGRESS` → `SPECIFY/DONE`, `enforcement: warn`) | `story-specify` |
| [dod-story-plan.md](dod-story-plan.md) | DoD PLAN (`PLAN/IN-PROGRESS` → `PLAN/DONE`) | `story-analyze` (quality gate), `story-design` (contexto) |
| [dod-story-implement.md](dod-story-implement.md) | DoD IMPLEMENT (`IMPLEMENT/IN-PROGRESS` → `IMPLEMENT/DONE`) | `story-implement`, `story-implement-tasks` |
| [dod-story-code-review.md](dod-story-code-review.md) | DoD CODE-REVIEW (`CODE-REVIEW/IN-PROGRESS` → `CODE-REVIEW/DONE`) | `story-code-review` |
| [dod-story-verify.md](dod-story-verify.md) | DoD VERIFY (`VERIFY/IN-PROGRESS` → `VERIFY/DONE`) | `story-verify` |
| [dod-story-acceptance.md](dod-story-acceptance.md) | DoD ACCEPTANCE (`ACCEPTANCE/IN-PROGRESS` → `ACCEPTANCE/DONE`) | `story-acceptance` |

Cada DoD es la condición para **cerrar** su etapa: protege la transición `<ETAPA>/IN-PROGRESS` → `<ETAPA>/DONE`.
El DoD de historia es un guardrail por etapa: cada skill declara el suyo en su sección `## DoD aplicable`
y carga solo ese archivo. `sddf.config.yaml › guardrails.dod.story.<etapa>` puede apuntar una etapa a
otro slug sin tocar los skills. `memory-system check` verifica la cadena `from`/`to`, el mapeo y las
referencias de los skills (familia `dod-guardrail`).

[dod-story-checklist.md](dod-story-checklist.md) es el **índice deprecado** del antiguo DoD monolítico:
se conserva durante la minor 3.3.x y se elimina en 4.0.0. Un proyecto con el DoD en un solo archivo lo
divide con `/memory-system migrate --from=dod-monolithic`. `/project-policies-generation` genera las
seis etapas desde sus plantillas.

### Content guardrails del DoD

| Archivo | Ámbito | Verificado por |
|---------|--------|----------------|
| [dod-story-deliver.md](dod-story-deliver.md) | Criterios de despliegue en producción (publicación en npm; `kind: content`, `applies-to: deliver`; sin skill por ahora) | Revisión humana antes de publicar; ver [deployment-to-npm.md](../runbooks/deployment-to-npm.md) |
