---
type: plan
id: plan-12
slug: plan-12-centralize-preflight-paragraph
title: "Centralizar párrafo de preflight (STORY-053)"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---


# Plan: Enhance - Centralizar párrafo de preflight (STORY-053)

## Contexto

El párrafo "Paso 0 — Verificar entorno (`skill-preflight`)" está copiado literalmente en **~38 SKILL.md** bajo `.claude/skills/`. Existen dos variantes principales (larga y condensada), pero ambas repiten el mismo texto explicativo de _lo que hace_ `skill-preflight` — información que ya vive exclusivamente en `skill-preflight/SKILL.md`. El resultado: cambiar cualquier convención de rutas requiere editar 30+ archivos a mano.

La solución es reducir cada Paso 0 a una invocación mínima de 3 líneas. Los detalles del protocolo quedan como fuente única en `skill-preflight/SKILL.md`.

**Story de referencia:** `docs/specs/stories/STORY-053-centralizar-validacion-entorno-sddf/story.md` (BACKLOG / READY)

---

## Texto canónico resultante

Todo SKILL.md afectado quedará con este bloque exacto:

```markdown
### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.
```

---

## Implementación

### Paso 1 — Script de normalización

Crear `scripts/normalize-preflight-paso0.js` (Node.js, sin dependencias externas):

**Algoritmo:**
1. Enumerar todos los archivos `**/.claude/skills/*/SKILL.md`
2. Para cada archivo, detectar si contiene `### Paso 0 — Verificar entorno`
3. Extraer el bloque completo: desde esa línea hasta (sin incluir) la siguiente línea que empiece con `##` o `###`
4. Si el bloque es idéntico al canónico → skip (idempotente)
5. Si difiere → reemplazar con el texto canónico y reportar `[UPDATED] <ruta>`
6. Al terminar, imprimir resumen: N archivos actualizados, M sin cambios, K con errores

El script excluye `skill-preflight/SKILL.md` (fuente de verdad, no tiene Paso 0).

### Paso 2 — Ejecutar el script

```bash
node scripts/normalize-preflight-paso0.js
```

Revisar el listado de archivos `[UPDATED]` y verificar manualmente 3–5 representativos.

### Paso 3 — Actualizar story

En `docs/specs/stories/STORY-053-centralizar-validacion-entorno-sddf/story.md`:
- Cambiar `status: BACKLOG` → `status: IMPLEMENT`
- Cambiar `substatus: READY` → `substatus: DONE`

### Paso 4 — Marcar ítem en release

En `docs/specs/releases/EPIC-17-remediating-and-improvement/release.md`, línea 51:
- Cambiar `- [ ]` → `- [x]`

---

## Archivos críticos

| Archivo | Rol |
|---|---|
| `scripts/normalize-preflight-paso0.js` | Script a crear |
| `.claude/skills/skill-preflight/SKILL.md` | Fuente de verdad del protocolo — NO modificar |
| `.claude/skills/story-design/SKILL.md` | Representativo — variante larga |
| `.claude/skills/release-creation/SKILL.md` | Representativo — variante condensada |
| `docs/specs/stories/STORY-053-.../story.md` | Actualizar status |
| `docs/specs/releases/EPIC-17-.../release.md` | Marcar ítem completado |

Los ~38 SKILL.md afectados los detecta y actualiza el script automáticamente; no se enumeran aquí.

---

## Verificación

1. `node scripts/normalize-preflight-paso0.js` reporta 0 errores
2. Ejecutar de nuevo → reporta 0 archivos `[UPDATED]` (idempotente)
3. `grep -r "El preflight verifica" .claude/skills/` → 0 resultados (el texto duplicado desapareció)
4. `grep -r "Invocar.*skill-preflight" .claude/skills/` → lista todos los skills con Paso 0 (confirma que la invocación sigue presente)
5. Invocar manualmente un skill (ej. `/story-design`) y confirmar que el Paso 0 sigue ejecutándose correctamente
