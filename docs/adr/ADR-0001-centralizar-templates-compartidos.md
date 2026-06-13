---
type: adr
id: ADR-0001
slug: centralizar-templates-compartidos
title: "Centralizar templates compartidos en $SPECS_BASE/specs/templates/"
status: ACCEPTED
date: 2026-06-12
supersedes: null
superseded-by: null
---

# ADR-0001: Centralizar templates compartidos en `$SPECS_BASE/specs/templates/`

## Contexto y problema

Existían 13 acoplamientos cross-skill por rutas relativas: skills que leían templates desde el `assets/` de otro skill (ej. `release-format-validation` leía `../release-creation/assets/release-spec-template.md`; cuatro skills leían `../story-creation/assets/story-template.md`). Una instalación parcial de skills dejaba a los consumidores rotos. EPIC-11/FEAT-055 había decidido centralizar pero nunca se implementó, y tres skills (`story-design`, `story-analyze`, `story-tasking`) ya documentaban la lectura desde un directorio central que no existía. Origen: hallazgo A3 de EPIC-17 (remediating-and-improvement).

## Decisión

**Un template compartido por varios skills pertenece al proyecto, no a un skill.** Los templates compartidos cross-skill (`story-template.md`, `release-spec-template.md`, `project-template.md`, `project-intent-template.md`, `project-plan-template.md`) viven en `$SPECS_BASE/specs/templates/` como fuente de verdad activa del proyecto. El skill dueño conserva el canónico en su `assets/` como **seed** (para distribución npm), y `sddf-init` lo copia al directorio central de forma idempotente (Paso 2b, nunca sobrescribe). Todos los skills — dueños y consumidores — resuelven el template con el orden: **central → seed del dueño (con WARNING sugiriendo `sddf-init`) → error accionable**.

## Rationale

1. **Sin dependencia del harness:** el path activo es un directorio del repo del usuario, legible por cualquier cliente (Claude, Codex, Cursor, opencode); nadie depende de la estructura interna `.claude/skills/`.
2. **Repositorio como sistema** (constitución, principio 1): el template versionado en el repo del usuario es parte del contrato del proyecto.
3. **Template como fuente de verdad dinámica** (constitución, patrón 5): el usuario puede personalizar el template central y generadores + validadores lo honran consistentemente — los dueños también leen del central primero.
4. **DRY sin build step** (KISS): una sola copia activa, sin maquinaria de sincronización.
5. **Instalación parcial deja de romper:** el consumidor no necesita el skill dueño instalado si el proyecto fue inicializado con `sddf-init`.

## Alternativas consideradas

- **Duplicar el template en cada skill consumidor:** descartada — viola DRY y genera divergencia de frontmatter; es exactamente el problema que EPIC-11 quería resolver.
- **Mantener rutas relativas `../` validadas por preflight:** descartada — solo mitiga el síntoma; el acoplamiento y la fragilidad ante instalación parcial persisten.
- **Build step que sincroniza templates:** descartada — agrega maquinaria contraria al minimalismo del framework (KISS, principio 4).
- **Central sin fallback (error explícito si falta):** descartada — rompe el flujo en proyectos no inicializados; el fallback al seed con WARNING degrada el acoplamiento a red de seguridad sin bloquear.

## Consecuencias

**Positivas:**
- Los 13 acoplamientos por ruta relativa quedan eliminados como ruta primaria.
- El template central es personalizable por proyecto y todos los skills lo respetan.
- `skill-preflight` verifica templates centrales (OK central / WARNING fallback / ERROR ninguno).

**Negativas / trade-offs:**
- Existen dos copias del template (seed + central); el seed solo se usa como origen de copia y fallback, pero puede divergir del central si el proyecto lo personaliza — comportamiento deseado, aunque requiere entender la distinción seed/activo.
- Los skills que evolucionen su seed no actualizan automáticamente los proyectos ya inicializados (decisión deliberada: no sobrescribir personalizaciones).

## Referencias

- [[EPIC-17-remediating-and-improvement]] — hallazgo A3
- [[EPIC-11-centralizar-templates]] — FEAT-055, decisión original sin implementar
- `docs/specs/releases/EPIC-17-remediating-and-improvement/plan-06-detach-shared-templates.md`
- `.claude/skills/sddf-init/SKILL.md` — Paso 2b (copia idempotente)
- `.claude/skills/skill-preflight/SKILL.md` — Verificación 3 (templates centrales)
