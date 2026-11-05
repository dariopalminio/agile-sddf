---
type: plan
id: plan-16
slug: plan-16-agnostic-framework
title: "Desacoplar referencias `.claude/` de los skills SDDF (STORY-056)"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Desacoplar referencias `.claude/` de los skills SDDF

## Contexto

El framework SDDF declara soporte multi-plataforma (Claude Code, OpenCode, GitHub Copilot). Sin embargo, 19 archivos SKILL.md contienen rutas hardcodeadas a `.claude/skills/`, acoplando las instrucciones a la estructura de Claude Code. Si el mismo SKILL.md se ejecuta en OpenCode (`.opencode/skills/`) o GitHub Copilot, las rutas de skills son incorrectas.

El problema fue detectado en `story-implement/SKILL.md` (13 referencias), pero es sistémico.

---

## Solución: variable `$CLI_ROOT` resuelta por `skill-preflight`

Introducir `$CLI_ROOT` como variable canónica del framework, al mismo nivel que `$SPECS_BASE`. Apunta al directorio raíz del CLI activo (`.claude`, `.opencode`, etc.). Cada SKILL.md sustituye `.claude/skills/` → `$CLI_ROOT/skills/`.

### Lógica de resolución (nueva Verificación 5 en skill-preflight)

```
1. Si env var SDDF_CLI_ROOT está definida → CLI_ROOT = $SDDF_CLI_ROOT
2. Si no, detectar por filesystem (en orden de prioridad):
   - .claude/   existe → CLI_ROOT = .claude
   - .opencode/ existe → CLI_ROOT = .opencode
   - .github/copilot/ existe → CLI_ROOT = .github/copilot
3. Si ninguno existe → CLI_ROOT = .claude  [WARNING: directorio no encontrado]
4. Emitir: [OK]  CLI_ROOT = <ruta>
5. Exponer CLI_ROOT al skill invocador (igual que SPECS_BASE)
```

---

## Archivos a modificar

### 1. `skill-preflight/SKILL.md`

Añadir **Verificación 5** antes del bloque "Informe de estado final" con la lógica de resolución descrita arriba. Actualizar el ejemplo de informe del bloque final para incluir `[OK] SKILLS_ROOT = .claude/skills`.

### 2. `story-implement/SKILL.md` — 13 referencias

Reemplazar todas con `$CLI_ROOT/skills/`:

| Antes | Después |
|-------|---------|
| `.claude/skills/{entry.skill}/SKILL.md` | `$CLI_ROOT/skills/{entry.skill}/SKILL.md` |
| `no encontrado en .claude/skills/` | `no encontrado en $CLI_ROOT/skills/` |
| `.claude/skills/{skill}/SKILL.md` | `$CLI_ROOT/skills/{skill}/SKILL.md` |
| `permanecen en .claude/skills/` | `permanecen en $CLI_ROOT/skills/` |

### 3. `skill-test-evals/SKILL.md` — 3 referencias

Misma sustitución: `.claude/skills/{arg}/` → `$CLI_ROOT/skills/{arg}/`

### 4. `story-verify/SKILL.md` — 2 referencias

Misma sustitución: `.claude/skills/{skill}/` → `$CLI_ROOT/skills/{skill}/`

### 5. Skills con fallback de assets de templates — 9 archivos

Patrón: `.claude/skills/{skill}/assets/{template}` → `$CLI_ROOT/skills/{skill}/assets/{template}`

Archivos afectados:
- `project-flow/SKILL.md`
- `reverse-engineering/SKILL.md`
- `release-generate-all-stories/SKILL.md`
- `story-improve/SKILL.md`
- `releases-from-project-plan/SKILL.md`
- `release-format-validation/SKILL.md`
- `story-split/SKILL.md`
- `story-evaluation/SKILL.md`
- `release-generate-stories/SKILL.md`

### 6. `sddf-init/SKILL.md` — 5 referencias (tabla de templates)

Misma sustitución en la tabla de templates compartidos copiados desde la fuente.

### 7. `skill-master/scripts/run_eval.py`

Añadir comentario explicativo: la detección de `.claude/` es específica de Claude Code y debería resolverse vía `SDDF_SKILLS_ROOT` cuando el script se use en otra plataforma. **No requiere cambio funcional ahora** — es deuda técnica documentada.

---

## Archivos NO modificados

- `skill-master/SKILL.md` references — son documentación del estándar, pueden mencionar `.claude/` como ejemplo concreto de la plataforma Claude
- ADR-0002 — no contiene rutas hardcodeadas
- `sddf.config.yaml` — los skills se referencian por nombre, no por ruta

---

## Verificación

```bash
# Tras aplicar los cambios: 0 resultados esperados en SKILL.md (excepto skill-preflight que tiene la lógica de detección)
grep -r "\.claude/skills/" .claude/skills --include="SKILL.md" | grep -v skill-preflight
```

Resultado esperado: sin output (0 referencias en skills que no sean skill-preflight).

## Variables del framework tras el cambio

$CLI_ROOT queda como variable canónica del framework junto a $SPECS_BASE, ambas resueltas por skill-preflight.

| Variable | Resuelta por | Valor por defecto | Propósito |
|----------|-------------|-------------------|-----------|
| `$CLI_ROOT` | skill-preflight Verif. 5 | `.claude` | Raíz del CLI activo (skills, agents, commands) |
| `$SPECS_BASE` | skill-preflight Verif. 1 | `docs` | Raíz de artefactos SDDF (specs, releases, stories) |
