---
type: plan
id: plan-03
slug: plan-03-clean
title: "Limpieza de assets muertos y configuración legacy — Feature del EPIC-17"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Limpieza de assets muertos y configuración legacy — Feature del EPIC-17

## Context

El repositorio `agile-sddf` acumula residuos de iteraciones anteriores: un template duplicado que confunde al skill de políticas, un lock file con 8 skills obsoletos (el repositorio tiene 47), un `sddf.config.yaml` con comandos `pnpm` de una UI library React que nunca existió aquí, un carácter Unicode oculto en `docs/index.md`, un `pnpm-lock.yaml` huérfano (el proyecto migró a npm), y ningún criterio declarado para los idiomas mezclados en skills/agentes. Esta limpieza corresponde al ítem de EPIC-17.

---

## Cambios a realizar

### 1. Eliminar `constitution-template.md` (template muerto)

**Archivo:** `.claude/skills/project-policies-generation/assets/constitution-template.md`

El skill `project-policies-generation` ya usa explícitamente `assets/project-constitution-template.md` (línea 46 de su SKILL.md). El archivo `constitution-template.md` es una versión anterior concreta (sin frontmatter YAML, con ejemplos Next.js/Prisma hardcodeados) que ningún skill referencia. Eliminarlo.

### 2. Eliminar `skills-lock.json` (lock file obsoleto)

**Archivo:** `skills-lock.json` (raíz)

Registra 8 skills de los cuales 5 eran de fuentes GitHub externas que ya no se usan. Los 47 skills actuales son todos locales en `.claude/skills/`. El concepto de "lock" para skills remotos ya no aplica. Eliminar el archivo.

### 3. Neutralizar `sddf.config.yaml` (config de otro proyecto)

**Archivo:** `sddf.config.yaml` (raíz)

El archivo usa `pnpm run test:*` en todos los comandos y tiene un comentario en la línea 11 que referencia `packages\ui\src\components\Alert\Alert.test.tsx` — ruta de una UI library React que nunca existió en este repositorio.

**Cambios:**
- Reemplazar todos los comandos `pnpm run test:*` por `npm run test:*` (el proyecto usa npm desde junio 2026)
- Eliminar el comentario `# pnpm test:component:file packages\ui\src\components\Alert\Alert.test.tsx` de la línea 11
- Eliminar el comentario similar de la línea 32 (`# pnpm run test:e2e -- apps\demo\tests\e2e\...`)
- Agregar un comentario al inicio indicando que es un ejemplo a personalizar por proyecto

### 4. Corregir carácter U+2011 en `docs/index.md`

**Archivo:** `docs/index.md`, línea 7

`substatus: IN‑PROGRESS` contiene un guion no-rompible U+2011 en lugar del ASCII `-`.  
Reemplazar `IN‑PROGRESS` por `IN-PROGRESS` (ASCII U+002D).

### 5. Eliminar `pnpm-lock.yaml` (lock file huérfano)

**Archivo:** `pnpm-lock.yaml` (raíz)

El proyecto migró a npm (evidencia: `package-lock.json` actualizado el 2026-06-07, más reciente que `pnpm-lock.yaml` del 2026-05-22). El archivo está desactualizado y es confuso. Eliminar.

### 6. Declarar criterio de idioma en `CLAUDE.md`

**Archivo:** `CLAUDE.md` (raíz)

Los skills/agentes mezclan español e inglés sin criterio documentado. La mayoría (≈90%) están en español; los outliers son `changelog-generator`, `openspec-explore`, y los agentes `reverse-engineer-*` (en inglés).

**Cambio:** Agregar en la sección `## Vision` o al inicio de `CLAUDE.md` una nota de convención:
```
> **Idioma de trabajo:** Los skills, agentes y documentos de este repositorio se redactan en **español**. 
> Los skills heredados de fuentes externas o integrados de ecosistemas en inglés pueden mantener su idioma original.
```

No se traducen archivos existentes en esta tarea — solo se declara el criterio.

---

## Archivos críticos afectados

| Archivo | Acción |
|---------|--------|
| `.claude/skills/project-policies-generation/assets/constitution-template.md` | Eliminar |
| `skills-lock.json` | Eliminar |
| `sddf.config.yaml` | Editar (neutralizar comandos pnpm, eliminar comentarios React) |
| `docs/index.md` | Editar (fix U+2011 → `-` en línea 7) |
| `pnpm-lock.yaml` | Eliminar |
| `CLAUDE.md` | Editar (agregar nota de criterio de idioma) |

---

## Verificación

1. **Confirmar eliminaciones:**
   ```
   ls .claude/skills/project-policies-generation/assets/
   # NO debe aparecer constitution-template.md
   # SÍ debe aparecer project-constitution-template.md
   
   ls skills-lock.json    # debe dar error (no existe)
   ls pnpm-lock.yaml      # debe dar error (no existe)
   ```

2. **Verificar sddf.config.yaml:**
   - No debe contener la cadena `pnpm`
   - No debe contener `packages\ui`
   - No debe contener `apps\demo`

3. **Verificar docs/index.md:**
   - La línea 7 no debe contener caracteres fuera del rango ASCII básico
   - `grep -P '[\x80-\xFF]' docs/index.md` debe devolver vacío

4. **Verificar CLAUDE.md:**
   - Debe contener la nota de criterio de idioma en texto legible

5. **Smoke test del skill:**
   - Invocar `skill-preflight` — debe pasar sin errores (las eliminaciones no afectan assets requeridos por skills activos)

## Reporte de implementación

Todo verificado. Resumen de lo ejecutado:

Acción	Archivo	Estado
Eliminado	.claude/skills/project-policies-generation/assets/constitution-template.md	✓
Eliminado	skills-lock.json	✓
Eliminado	pnpm-lock.yaml	✓
Editado	sddf.config.yaml — reemplazado pnpm por npm, eliminados comentarios React	✓
Editado	docs/index.md línea 7 — U+2011 → ASCII -	✓
Editado	CLAUDE.md — criterio de idioma declarado al inicio	✓
project-constitution-template.md sigue intacto como el template canónico del skill. La advertencia de wikilink en docs/index.md:101 es pre-existente y no tiene relación con esta limpieza.