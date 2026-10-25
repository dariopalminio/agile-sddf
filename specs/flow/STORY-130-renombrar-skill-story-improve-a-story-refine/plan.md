
---
type: plan
id: plan-07
slug: plan-07-renombrar-skill-story-improve-a-story-refine
title: "Renombrar el skill `story-improve` a `story-refine`"
status: COMPLETED
substatus: DONE
created: 2026-06-13
updated: 2026-06-13
related:
  - STORY-130-renombrar-skill-story-improve-a-story-refine
---
<!-- Referencias -->
[[STORY-130-renombrar-skill-story-improve-a-story-refine]]

# Plan — Renombrar el skill `story-improve` a `story-refine`

## Contexto

Se quiere que el skill que aplica las recomendaciones FINVEST sobre `story.md` se llame `story-refine`, porque lo que hace es refinar la historia (decisión REFINAR). Decisiones del usuario:

- **Compatibilidad:** `story-improve` queda como **alias deprecado** que delega en `/story-refine`, igual que se hizo con `docs-wiki-builder` → `memory-system`. Es un cambio minor (4.2.0) y el alias se elimina en 5.0.0. Hace falta porque `scripts/install.js` (`copyDir`, líneas 103-128) no borra skills retirados.
- **Artefactos:** se renombran a `story-refinement-log.md`, `assets/refinement-log-template.md` y `type: refinement-log`.
- **Proceso:** cambio directo, sin historia, con su entrada en el CHANGELOG.

**Riesgo a documentar:** `story-refine` ya existió como nombre anterior de `story-specify` hasta la 1.12.0 (CHANGELOG, línea 443). En un consumidor que conserve esa instalación vieja, `install` sin `--force` salta el directorio porque ya existe. Con `--force` lo sobrescribe, pero quedan los archivos viejos que no existen en el skill nuevo.

**Qué no se toca:** artefactos históricos de `docs/specs/**` (reportes, planes, historias y épicas cerradas), entradas ya publicadas del CHANGELOG, `docs/index.md` (lo genera `memory-system`) y la fixture de `skills/story-implement/evals/evals.json:1367`. Esa fixture cita rutas como texto de hallazgos y `skills/story-improve/evals/evals.json` sigue existiendo en el alias.

## Cambios

### 1. Mover el skill: `git mv skills/story-improve skills/story-refine`
Se conserva el historial. Dentro de `skills/story-refine/`:
- `SKILL.md`:
  - `name: story-refine` y triggers (`/story-refine`, `story-refine --story-id`); agregar «refinar historia» a la descripción y mantener «mejorar historia».
  - Título `# Skill: /story-refine`.
  - La ruta propia pasa a `$CLI_ROOT/skills/story-refine/assets/refinement-log-template.md`.
  - Todas las menciones de `story-improvement-log.md` pasan a `story-refinement-log.md` (Paso 8, salida, resumen).
  - El encabezado del resumen pasa a `story-refine: <STORY-NNN>`.
- `git mv assets/improvement-log-template.md assets/refinement-log-template.md` y cambiar su frontmatter a `type: refinement-log`.
- `README.md` y `evals/evals.json`: `"skill": "story-refine"`, y en los `expected` cambiar el nombre del log por el nuevo.
- `examples/` no menciona el log, así que no cambia.

### 2. Crear el alias deprecado `skills/story-improve/`
Toma como modelo `skills/docs-wiki-builder/` (SKILL.md de 73 líneas, README.md y evals/evals.json).
- `SKILL.md`:
  - Frontmatter `name: story-improve` y `description: Deprecado desde 4.2.0, se elimina en 5.0.0: alias de story-refine…`.
  - Bloque `<!-- SDDF-ROOT-RESOLUTION: v1 -->` (lo exige `scripts/audit-root-resolution.js`).
  - Paso 1: emitir literalmente `⚠️ story-improve está deprecado. Usa /story-refine.`
  - Paso 2: imprimir `→ delegando en /story-refine <args>`.
  - Paso 3: invocar `story-refine` con los mismos argumentos (`--story-id`), sin lógica propia.
- `README.md`: `Status: stable (deprecado desde 4.2.0; se elimina en 5.0.0)`.
- `evals/evals.json`: TC-001 (aviso y delegación con `--story-id`) y TC-002 (sin `--story-id`: la salida es la de `story-refine`). Así `verify:eval-inventory` pasa sin exenciones.

### 3. Consumidores vivos: cambiar `story-improve` por `story-refine` y `story-improvement-log.md` por `story-refinement-log.md`
- `skills/story-specify/SKILL.md` (descripción, Dependencias, Paso 5A, tabla de errores, Salida), `README.md` y `evals/evals.json`.
- `skills/story-split/README.md:34` y `skills/story-evaluation/README.md:35` (wikilink `[[story-refine]]`).
- Comentarios de escritor en `docs/templates/story-template.md` y `skills/story-creation/assets/story-template.md` (5 en cada uno).
- `README.md:261`, `docs/product/stakeholders.md:28` y `docs/requirements/functional/FR-033-…md`.

### 4. `memory-system`: exclusión de los dos nombres del log
- `skills/memory-system/scripts/memory-system.js:104-107` (`EXCLUDED_FILES`): **agregar** `'story-refinement-log.md'` y **conservar** `'story-improvement-log.md'`, porque hay logs con ese nombre en `docs/specs`.
- La misma lista en `skills/memory-system/references/memory-rules.md:48` y `docs/architecture/memory-system.md:321`.

### 5. CHANGELOG, en `## [Unreleased]`
- **Changed:** `story-improve` pasa a llamarse `story-refine`, el log pasa a `story-refinement-log.md` y la plantilla a `refinement-log-template.md` / `type: refinement-log`. `story-specify` invoca `story-refine`.
- **Deprecated:** `story-improve` queda como alias de `/story-refine` y se elimina en 5.0.0.
- **Nota de actualización:** quien conserve un `story-refine` instalado de la serie 1.x (antiguo nombre de `story-specify`) debe borrar ese directorio del runtime antes de `npx agile-sddf install --force`.

### 6. Repo local
- Reinstalar las copias de runtime, que no se versionan: `node scripts/cli.js install --target claude-code --force`, y `--target codex` si se usa `.agents/skills`.
- `graphify update .`

## Verificación
- `git grep -n "story-improve" -- skills config scripts README.md docs/templates docs/product docs/requirements docs/architecture`: solo debe aparecer en `skills/story-improve/` (alias), en el `EXCLUDED_FILES` heredado / memory-rules y en la fixture de `story-implement`.
- `git grep -n "improvement-log" -- skills`: solo debe aparecer la exclusión heredada de `memory-system`.
- `npm test` y `npm run verify:repository`: cubren el inventario de evals, la resolución de raíz, los enlaces y el smoke del tarball con los dos directorios.
- Manual: `/story-refine --story-id STORY-137` en modo lectura (la historia ya está APROBADA, así que el gate interno termina sin escribir), y `/story-improve --story-id STORY-137`, que debe mostrar el aviso y delegar.
- Opcional, según el criterio del mantenedor: `npm run test:eval -- story-refine` y `npm run test:eval -- story-improve`.

