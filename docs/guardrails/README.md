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
> y sus reglas deterministas se comprueban con comandos que el propio archivo define
> (`grep`, `git ls-files`, `git check-ignore`, Python 3) — sin scanner externo ni servicio de CI.

---

## Guardrail vs Policy

| Aspecto | Guardrail (`docs/guardrails/`) | Policy (`docs/policies/`) |
|---------|--------------------------------|---------------------------|
| Naturaleza | Restricción operativa/técnica | Regla de gobernanza |
| Formato | Checklist con severidades | Documento declarativo (principios, convenciones) |
| Verificación | Determinista + revisión semántica | Humana o semiautomática |
| Incumplimiento | Bloquea (`error`) o advierte (`warn`) | Requiere juicio; puede escalarse |
| Audiencia primaria | Agentes IA y CI | Humanos y equipos |

Una policy puede originar uno o más guardrails que la hagan verificable. El modelo completo está en
[domain-knowledge-artifacts.md](../domains/domain-knowledge-artifacts.md#6-guardrail-vs-policy).

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

- **Nombre de archivo:** `gr-<ámbito>-checklist.md` (kebab-case, prefijo `gr-`)
- **Ids de regla:** cada guardrail usa un prefijo propio (`sec-*`, `ai-*`, `skill-*`, `agent-*`) que los checks imprimen tal cual, de modo que un id que falla identifica al guardrail que lo posee
- **Sin duplicación:** una regla vive en un solo guardrail; los demás la referencian con una nota (`> … Do not duplicate …`) en lugar de copiarla
- **Estructura mínima de cada guardrail:**

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

Cada archivo define sus checks en un bloque `bash` completo. Para extraerlo y ejecutarlo desde la raíz del repositorio:

```bash
sed -n '/^```bash$/,/^```$/p' docs/guardrails/gr-ai-security-checklist.md | sed '1d;$d' > run-guardrail.sh
bash run-guardrail.sh
```

Los guardrails de skill y agente asumen una variable fijada una vez (`SKILL=skills/<skill-name>`,
`AGENT=<ruta al archivo del agente>`). Hoy ningún job de CI los ejecuta: corren en la máquina del
mantenedor (ver [SECURITY.md](../../SECURITY.md#how-this-repository-is-validated)).

---

## Índice de guardrails

| Archivo | Ámbito | Prefijo de ids |
|---------|--------|----------------|
| [gr-code-security-checklist.md](gr-code-security-checklist.md) | Todo archivo commiteado: secretos y datos personales, scripts ejecutables, artefactos trackeados y comandos documentados | `sec-*` |
| [gr-ai-security-checklist.md](gr-ai-security-checklist.md) | Lo que el repositorio le dice a un agente: instrucciones en `SKILL.md`, entrada no confiable, acciones irreversibles, skills de terceros en `skills-lock.json` | `ai-*` |
| [gr-skill-creation-checklist.md](gr-skill-creation-checklist.md) | Creación y edición de Agent Skills bajo `skills/`: frontmatter, layout, presupuesto de contexto, seguridad, evals | `skill-*` |
| [gr-agent-creation-checklist.md](gr-agent-creation-checklist.md) | Creación y edición de agentes custom (`.claude/agents/` y equivalentes): frontmatter, identidad, permisos y tools | `agent-*` |

Los dos primeros son las mitades complementarias de la política de seguridad del repositorio; los dos
últimos gobiernan los artefactos que el instalador distribuye a los runtimes declarados en
[config/runtimes.json](../../config/runtimes.json).
