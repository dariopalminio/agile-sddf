# skill-preflight

> **Type:** skill · **Category:** utility  
> **Location:** `skills/skill-preflight/SKILL.md`  
> **Status:** stable

---

## What it does

Diagnostica en modo de solo lectura la resolución efectiva de `REPO_ROOT`, `SPECS_BASE` y `ROOT_SOURCE`, además de la estructura, los templates y el runtime de un entorno SDDF. Expone errores y advertencias sin realizar escrituras.

**Produces:**

- Un informe de diagnóstico en la conversación con las raíces y comprobaciones efectuadas.
- Avisos sobre configuración, directorios, templates o runtime faltantes.

**Does not do:**

- No crea directorios, no corrige configuración y no modifica artefactos.

---

## When to use

**Use it when:**

- Necesites investigar cómo se resuelve la raíz de artefactos antes de ejecutar un workflow.
- Quieras comprobar la estructura o los templates SDDF sin alterar el repositorio.
- The user mentions: `"skill-preflight"`, `"diagnosticar entorno SDDF"`, `"SDDF_ROOT"`.

**Do NOT use it when:**

- Debas inicializar o reparar el entorno creando archivos → use `[[sddf-init]]` instead.
- Quieras iniciar la especificación de un proyecto → use `[[project-begin]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/skill-preflight`; es un diagnóstico explícito, no un paso automático de los workflows.
