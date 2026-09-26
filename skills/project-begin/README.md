# project-begin

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-begin/SKILL.md`  
> **Status:** stable

---

## What it does

Orquesta la captura de la intención inicial de un proyecto mediante el agente `project-pm`. Resuelve el proyecto activo, respeta el límite WIP=1 y utiliza el template vigente para dejar el punto de partida listo para discovery.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-ID-nombre/project-intent.md`.
- El documento de intención con `substatus: DONE` tras la confirmación correspondiente.

**Does not do:**

- No realiza discovery de requisitos ni genera el backlog del proyecto.

---

## When to use

**Use it when:**

- Necesites iniciar un proyecto SDDF o capturar su problema, visión e intención.
- Quieras retomar y completar una intención de proyecto incompleta.
- The user mentions: `"project-begin"`, `"comenzar proyecto"`, `"capturar intención"`.

**Do NOT use it when:**

- La intención ya está lista y necesitas descubrir requisitos → use `[[project-discovery]]` instead.
- Quieras ejecutar el ciclo completo de especificación → use `[[project-flow]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-begin` desde la raíz del proyecto destino.
