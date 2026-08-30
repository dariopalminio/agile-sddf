---
type: plan
id: plan-6
slug: plan-6-centralizar-templates-compartidos
title: "Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` — Feature del EPIC-17"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Refactor — Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` (completar EPIC-11/STORY-055)

## Context

13 acoplamientos cross-skill confirmados: skills que leen templates de otros skills por ruta relativa (`../story-creation/assets/story-template.md`, etc.). Una instalación parcial de skills rompe a los consumidores. EPIC-11/STORY-055 ya decidió la solución — centralizar en `$SPECS_BASE/specs/templates/` — pero quedó marcado RELEASED sin implementar. Tres skills (`story-design`, `story-analyze`, `story-tasking`) ya documentan en sus `assets/README.md` que leen del directorio central, y los examples/evals de `release-creation` y `story-evaluation` también lo esperan. **El directorio central no existe**: hay divergencia entre intención documentada y realidad.

### Justificación de la arquitectura elegida (respuesta a la pregunta de mejor práctica)

**Un template compartido por varios skills pertenece al proyecto, no a un skill.** La solución:

- **Canónico (seed):** el skill dueño conserva el template en su `assets/` — fuente para distribución npm, autocontenido.
- **Activo (runtime):** `sddf-init` copia los templates compartidos a `$SPECS_BASE/specs/templates/` del proyecto del usuario. Todos los skills (dueños y consumidores) leen de ahí primero.
- **Fallback:** si el central no existe, caer al `assets/` del skill dueño con WARNING sugiriendo correr `sddf-init`; si tampoco existe, error accionable.

Por qué es la mejor práctica agéntica/clean-code:
1. **Sin dependencia de Claude:** el path activo es `docs/specs/templates/` — un directorio del repo del usuario, legible por cualquier harness (Codex, Cursor, opencode). Nadie depende de la estructura interna `.claude/skills/`.
2. **Repositorio como sistema** (principio 1 constitución): el template versionado en el repo del usuario es parte del contrato del proyecto y evoluciona con él.
3. **Template como fuente de verdad dinámica** (patrón 5): el usuario puede personalizar el template central y generadores + validadores lo honran consistentemente.
4. **DRY sin build step** (KISS): una copia activa, sin maquinaria de sincronización; la copia la hace `sddf-init` de forma idempotente (principio 11).
5. **Instalación parcial deja de romper:** el consumidor no necesita que el skill dueño esté instalado si el proyecto ya fue inicializado.

### Decisiones tomadas con el usuario
- Fallback: central → asset del dueño (WARNING) → error.
- Alcance: los **5 templates compartidos cross-skill**. `skill-master/references/skill-evals-format.md` queda fuera (referencia meta-skill, no template de spec).

---

## Templates a centralizar

| Template | Skill dueño (seed en assets/) | Consumidores externos |
|----------|------------------------------|----------------------|
| `story-template.md` | story-creation | release-generate-stories, release-generate-all-stories, story-split, story-evaluation |
| `release-spec-template.md` | release-creation | release-format-validation, releases-from-project-plan |
| `project-template.md` | project-discovery | project-flow, reverse-engineering |
| `project-intent-template.md` | project-begin | project-flow |
| `project-plan-template.md` | project-planning | project-flow |

---

## Cambios

### 1. `sddf-init/SKILL.md` — nuevo paso de copia de templates
Insertar como **Paso 2b** (después de crear directorios de specs), siguiendo el patrón idempotente CREADO/YA EXISTÍA existente:
- Crear `$SPECS_BASE/specs/templates/` si no existe.
- Para cada uno de los 5 templates: si no existe en el central, copiarlo desde el `assets/` del skill dueño (`[CREADO]`); si ya existe, no tocar (`[YA EXISTÍA]`).
- Si el asset fuente no existe (skill no instalado), emitir `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` sin bloquear.
- Actualizar el informe final del Paso 6 con las líneas nuevas.

### 2. Patrón de resolución de template en los SKILL.md (dueños + consumidores)
Reemplazar toda referencia `../<skill>/assets/<template>.md` (y las referencias locales `assets/<template>.md` en los 5 dueños) por el bloque de resolución estándar:

```
Resolución del template <nombre>:
1. $SPECS_BASE/specs/templates/<nombre>   ← fuente de verdad del proyecto
2. Fallback: .claude/skills/<dueño>/assets/<nombre>
   → emitir [WARNING] usando template del skill; ejecuta sddf-init para centralizarlo
3. Si ninguno existe → [ERROR] accionable: "Template <nombre> no encontrado. Ejecuta sddf-init."
```

**Archivos a editar (10 SKILL.md):**
- Consumidores: `release-format-validation`, `releases-from-project-plan`, `release-generate-stories`, `release-generate-all-stories`, `story-split`, `story-evaluation`, `reverse-engineering`, `project-flow` (3 templates).
- Dueños (leen central primero para honrar personalizaciones del proyecto): `story-creation`, `release-creation`, `project-discovery`, `project-begin`, `project-planning`.

En cada archivo el cambio es puntual: sustituir las líneas que citan la ruta relativa (ej. `release-format-validation/SKILL.md:40,49,55,122`) por la ruta central + nota de fallback. No tocar la lógica del skill.

### 3. `skill-preflight/SKILL.md` — verificación de templates centrales
Extender la "Verificación 3 — Templates requeridos": si el skill invocador declara templates centrales, verificar en orden central → asset del dueño, reportando `[OK]` (central), `[WARNING]` (fallback) o `[ERROR]` (ninguno) con mensaje accionable.

### 4. Dogfooding: crear el directorio central en este repo
Este repositorio es a su vez un proyecto SDDF (`SPECS_BASE = docs`). Crear `docs/specs/templates/` y copiar los 5 templates desde sus skills dueños — deja al repo consistente con lo que sus propios examples/evals ya esperan.

### 5. Cierre de trazabilidad
- `docs/specs/releases/EPIC-11-centralizar-templates/release.md`: marcar STORY-055 como `[x]` con nota de que se implementó vía EPIC-17/A3 (alcance ampliado de 3 a 5 templates).
- `docs/specs/releases/EPIC-17-remediating-and-improvement/release.md`: marcar el ítem A3 como completado.

### Fuera de alcance
- `skill-test-evals` → `skill-master/references/skill-evals-format.md` (referencia meta-skill; ambos skills viajan juntos en el framework).
- Los 22 templates de consumo local (design, tasks, testcases, reportes…) siguen en sus `assets/` — sin consumidores externos no hay acoplamiento que romper.

---

## Verificación

1. **Grep de acoplamientos**: `grep -rn '\.\./.*/assets/' .claude/skills/*/SKILL.md` — las ocurrencias restantes deben aparecer solo como ruta de *fallback* documentada, nunca como ruta primaria de lectura.
2. **Directorio central**: `ls docs/specs/templates/` lista los 5 templates, byte-idénticos a sus seeds en `assets/` (comparar con `git diff --no-index` o hash).
3. **Idempotencia de sddf-init**: el paso 2b descrito declara comportamiento CREADO/YA EXISTÍA — releer el SKILL.md editado y confirmar que no sobrescribe.
4. **Smoke test de un consumidor**: invocar `/release-format-validation` sobre un release existente (ej. EPIC-17) — debe resolver el template desde `docs/specs/templates/release-spec-template.md` y validar sin errores.
5. **Coherencia documental**: los `assets/README.md` de story-design/analyze/tasking ya describen este patrón — verificar que el bloque de resolución estándar usa la misma redacción/orden.

## Reporte de implementación

A3 implementado y verificado. Los 13 acoplamientos de templates por ruta relativa quedaron eliminados — las únicas referencias ../ restantes son las de skill-test-evals → skill-master/references/, que quedaron explícitamente fuera de alcance (referencia meta-skill, ambos viajan juntos en el framework).

Lo que se hizo:

sddf-init — nuevo Paso 2b: crea $SPECS_BASE/specs/templates/ y copia los 5 templates compartidos desde el assets/ de su skill dueño, con el mismo patrón idempotente CREADO/YA EXISTÍA del resto del skill (nunca sobrescribe personalizaciones del proyecto).

13 SKILL.md actualizados con la resolución estándar central → seed del dueño (⚠️ WARNING sugiriendo sddf-init) → error accionable:

8 consumidores: release-format-validation, releases-from-project-plan, release-generate-stories, release-generate-all-stories, story-split, story-evaluation, reverse-engineering y project-flow (sus 3 templates).
5 dueños (story-creation, release-creation, project-discovery, project-begin, project-planning) ahora también leen el central primero, para que generadores y validadores honren las personalizaciones del proyecto consistentemente.
skill-preflight — la Verificación 3 ahora distingue templates centrales (OK central / WARNING fallback / ERROR ninguno) de templates locales del propio skill.

Dogfooding — creado docs/specs/templates/ en este repo con los 5 templates, verificados byte-idénticos a sus seeds por hash. Esto deja al repo consistente con lo que sus propios examples y evals ya esperaban.

Trazabilidad — STORY-055 marcada [x] en EPIC-11 (con nota de alcance ampliado de 3 a 5 templates) y A3 marcado [x] en EPIC-17.

Queda pendiente de tu lado, si quieres validarlo end-to-end: invocar /release-format-validation EPIC-17 y confirmar que resuelve el template desde docs/specs/templates/release-spec-template.md sin warning.

## Reporte de implementación

Verificación completa — todo en su lugar. Resumen:

Creado docs/adr/ con tres archivos:

README.md — convención completa: cuándo escribir un ADR (afecta >1 skill/módulo o restringe decisiones futuras), numeración ADR-NNNN-slug, estados (PROPOSED/ACCEPTED/DEPRECATED/SUPERSEDED), inmutabilidad de los aceptados, y tabla índice.
adr-template.md — template estilo MADR con el frontmatter del repo y las secciones Contexto · Decisión · Rationale · Alternativas consideradas · Consecuencias · Referencias, alineado con el patrón ## Decisions que ya usan los design.md.
ADR-0001-centralizar-templates-compartidos.md — primer ADR real (estado ACCEPTED) documentando la decisión de plan-06: templates compartidos en $SPECS_BASE/specs/templates/, con las 4 alternativas descartadas y los trade-offs del modelo seed/activo.
Convención declarada:

constitution.md — nuevo patrón #16 "Registro de decisiones en tres niveles": historia → design.md, cambio OpenSpec → design.md del change, transversal → docs/adr/.
index.md:90 — sección "Decisiones de arquitectura" con el wikilink a ADR-0001.
Esto materializa la convención que project-constitution-template.md:77 ya prometía a los usuarios del framework sin que existiera en el propio repo.

Una nota: las advertencias de Foam en docs/index.md (líneas 85-87) aparecieron porque los wikilinks [[story-template]], [[release-spec-template]] y [[project-template]] ahora resuelven a dos archivos (seed en .claude/skills/ y copia central en docs/specs/templates/) tras el dogfooding de plan-06. Es cosmético; si quieres eliminarlas, puedo cambiar esos wikilinks por links con ruta explícita al template central.


