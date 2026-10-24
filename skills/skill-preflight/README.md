# skill-preflight

> **Type:** skill · **Category:** utility  
> **Location:** `skills/skill-preflight/SKILL.md`  
> **Status:** stable

---

## What it does

Diagnostica en modo de solo lectura el layout fijo de un repositorio SDDF (ADR-0016) —`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` y `docs/templates/`, relativos a `REPO_ROOT`—, las señales del layout legado, los templates centrales y el runtime. Expone advertencias sin realizar escrituras.

**Produces:**

- Un informe de diagnóstico en la conversación con `REPO_ROOT` y las comprobaciones efectuadas.
- Avisos sobre directorios del layout, templates o runtime faltantes, y una línea por cada señal legada presente.

**Señales de layout legado** (solo se informan las presentes, como `[WARNING]`, con remisión a `docs/guides/artifact-directory-migration.md` del repositorio de agile-sddf):

- El directorio `docs/specs/` existe.
- `sddf.config.yaml` declara la clave `root`.
- La variable de entorno `SDDF_ROOT` está definida.

**Does not do:**

- No crea directorios, no corrige configuración y no modifica artefactos.

---

## When to use

**Use it when:**

- Necesites comprobar el layout fijo antes de ejecutar un workflow.
- Quieras saber si un proyecto conserva señales del layout legado sin alterar el repositorio.
- The user mentions: `"skill-preflight"`, `"diagnosticar entorno SDDF"`, `"diagnosticar layout legado"`.

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
