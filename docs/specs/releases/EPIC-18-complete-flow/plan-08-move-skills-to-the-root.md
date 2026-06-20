---
type: plan
id: plan-08
slug: plan-08-move-skills-to-the-root
title: "Actualizar rutas de origen tras mover `skills/` y `agents/` a la raíz"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-complete-flow
---

# Plan: actualizar rutas de origen tras mover `skills/` y `agents/` a la raíz

## Contexto

Anteriormente los skills se localizaban, en este proyecto, en: .claude\skillsAhora se localizan en: skillsAntes los agentes se localizaban en:. claude\agentsAhora se localizan en: agentsDebido a este cambio es necesario actualizar las ubicaciones de origen en los scripts de instalación.

Las carpetas fuente de skills y agentes se movieron de `.claude/skills` y `.claude/agents` a `skills/` y `agents/` en la raíz del repo (commit `fbbdb80`, "skills y agents movidos a la raíz sin depender de Claude"). El objetivo es que el framework sea agnóstico de Claude: la fuente de verdad ya no vive bajo `.claude/`.

Sin embargo los scripts de instalación y `package.json` siguen leyendo desde `.claude/...`, por lo que hoy **el instalador no copia nada** (`copyDir` retorna 0 cuando el origen no existe) y el paquete npm publicaría rutas inexistentes. Hay que actualizar las rutas de **origen**.

**Importante — el destino NO cambia:** al instalar en otro proyecto, el destino sigue siendo `.claude/` / `.agents/` / `.github/` según la plataforma. `VALID_FOLDERS`, el menú y los defaults de destino en `install.js` se mantienen tal cual. Solo cambia de dónde se *lee*.

## Cambios

### 1. `scripts/install.js` (línea 9)
Cambiar el directorio fuente de `.claude` a la raíz del repo:

```js
const SOURCE_DIR = path.join(__dirname, '..');
```

Las líneas 82 (`skillsSrc = path.join(SOURCE_DIR, 'skills')`) y 86 (`agentsSrc = path.join(SOURCE_DIR, 'agents')`) quedan correctas automáticamente, resolviendo a `<root>/skills` y `<root>/agents`. No tocar `VALID_FOLDERS`, `resolveDestDir`, el menú ni los defaults `'.claude'` (son destino).

### 2. `scripts/normalize-preflight-paso0.js` (línea 19)
```js
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
```

### 3. `package.json` — arreglo `files` (líneas 23-70)
Reemplazar las ~41 entradas individuales `.claude/agents/` y `.claude/skills/<nombre>` por dos entradas de directorio completo:

```json
"files": [
  "agents/",
  "skills/",
  "scripts/",
  "sddf.config.yaml",
  "README.md",
  "LICENSE"
],
```

Esto además corrige que la lista actual referencia 5 skills inexistentes (`changelog-generator`, `code-frontend-library-react`, `test-react-testing-library`, `test-cypress-cucumber`, `test-playwright-cucumber`) y se mantendrá en sync automáticamente al agregar skills nuevos. Los 36 skills presentes en `skills/` se publicarán completos.

## Verificación

1. `node scripts/cli.js install --target .claude --force` en un directorio de prueba temporal y confirmar que reporta `36 skills, 10 agents` copiados (no `0 skills, 0 agents`).
2. `npm pack --dry-run` y verificar que el tarball incluye `skills/` y `agents/` completos y **no** incluye rutas `.claude/...`.
3. `node scripts/normalize-preflight-paso0.js --dry-run` y confirmar que encuentra los SKILL.md bajo `skills/` (no error de directorio inexistente).

## Notas

- No se modifica `postinstall.js` ni `cli.js`: su uso de `.claude` se refiere al folder destino por defecto, que se mantiene.
- Opcional fuera de alcance: README/CLAUDE.md aún describen `.claude/` como fuente única — se puede actualizar después si se desea, pero no es necesario para que la instalación funcione.
