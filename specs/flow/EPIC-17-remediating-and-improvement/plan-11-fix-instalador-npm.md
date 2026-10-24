---
type: plan
id: plan-11
slug: plan-11-fix-instalador-npm
title: "Fix instalador npm — quitar prompt de postinstall y agregar --force para upgrades"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---


# Plan: Fix instalador npm — quitar prompt de postinstall y agregar --force para upgrades

## Contexto

Dos bugs en el instalador de `agile-sddf` (npm):

**Bug 1 — Prompt stdin en postinstall (anti-patrón):**
`installSDDF()` en `scripts/install.js` (línea 75-77) llama a `promptFolderSelection()` si `process.stdin.isTTY`. El `postinstall` npm no garantiza stdin interactivo — en CI, Docker, piped installs, el prompt no aparece (sale silenciosamente con default `.claude`), pero en terminales TTY puede bloquear o corromperse. El prompt pertenece al CLI, no al postinstall.

**Bug 2 — skip-if-exists rompe upgrades:**
`copyDir()` en `scripts/install.js` (líneas 61-67) salta todos los archivos que ya existen. Esto hace que `npm update agile-sddf` nunca propague skills actualizados al proyecto del usuario.

**Situación actual:** `scripts/cli.js` ya existe como `bin: agile-sddf` con soporte a `--target <folder>` y `--global`, pero llama a `installSDDF()` sin `force`. La función `promptFolderSelection()` vive en `install.js` (la capa de lógica) en vez de en `cli.js` (la capa CLI).

---

## Cambios propuestos

### 1. `scripts/install.js` — 3 cambios

**a) Eliminar el prompt de `installSDDF()`** (líneas 75-77):
```js
// ANTES — prompt vive en la función de lógica:
if (!options.folder && process.stdin.isTTY) {
  options.folder = await promptFolderSelection();
}

// DESPUÉS — installSDDF() es función pura, sin stdin:
// (eliminar el bloque; el default ya lo maneja resolveDestDir con folder: '.claude')
```

**b) Agregar opción `force` a `copyDir()`** (línea 61):
```js
// ANTES:
if (fs.existsSync(destEntry)) {
  console.log(`  Skipped (already exists): ${destEntry}`);
  skipped++;
} else {
  await fse.copy(srcEntry, destEntry);
  console.log(`  Installed: ${destEntry}`);
  installed++;
}

// DESPUÉS (recibe `force` como segundo arg):
async function copyDir(srcDir, destDir, { force = false } = {}) {
  // ...
  if (!force && fs.existsSync(destEntry)) {
    console.log(`  Skipped (already exists): ${destEntry}`);
    skipped++;
  } else {
    await fse.copy(srcEntry, destEntry, { overwrite: true });
    const verb = fs.existsSync(destEntry) ? 'Updated' : 'Installed';  // log antes de copy
    console.log(`  ${verb}: ${destEntry}`);
    installed++;
  }
}
```

**c) Pasar `force` desde `installSDDF()` a `copyDir()`:**
```js
async function installSDDF(options = {}) {
  const { destDir, mode } = resolveDestDir(options);
  // ...
  await copyDir(skillsSrc, skillsDest, { force: options.force });
  await copyDir(agentsSrc, agentsDest, { force: options.force });
}
```

`promptFolderSelection` queda exportada para que `cli.js` la use.

### 2. `scripts/postinstall.js` — sin prompt, con env var opcional

```js
// ANTES:
installSDDF().catch(...)  // triggerea el prompt si isTTY

// DESPUÉS:
installSDDF({ folder: process.env.SDDF_TARGET || '.claude' }).catch(...)
```

Soporta `SDDF_TARGET=.agents npm install agile-sddf` para override no-interactivo en CI.

### 3. `scripts/cli.js` — mover prompt aquí y agregar --force

```js
const isForce = args.includes('--force');

if (command === 'install') {
  let folder = targetFolder;
  // Si no hay --target y es TTY, prompt interactivo (movido desde install.js)
  if (!folder && process.stdin.isTTY) {
    folder = await promptFolderSelection();
  }
  installSDDF({ global: isGlobal, folder, force: isForce }).catch(...)
}
```

Actualizar `USAGE`:
```
Options:
  --global            Install to ~/<folder> instead of the current project
  --target <folder>   Target folder: .claude (default), .agents, .github
  --force             Overwrite existing files (use for upgrades)
```
### 4. `README.md` — documentar el cambio

El README necesitaba dos actualizaciones menores — ya están hechas:

Tabla CLI reference — agregadas dos filas con --force (upgrade local y upgrade a target específico)
Tabla Environment Variables — agregada SDDF_TARGET con descripción de su uso en CI

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `scripts/install.js` | Quitar prompt de `installSDDF()`; agregar `force` a `copyDir()`; pasar `force` desde `installSDDF()` |
| `scripts/postinstall.js` | Pasar `{ folder: process.env.SDDF_TARGET \|\| '.claude' }` a `installSDDF()` |
| `scripts/cli.js` | Mover prompt aquí; agregar `--force` flag; pasar `force` a `installSDDF()`; actualizar USAGE |
| `README.md` | Documentar `--force` en CLI reference y `SDDF_TARGET` en Environment Variables |

---

## Verificación

1. `npm install agile-sddf` en un directorio limpio → instala sin prompt, va a `.claude` por default.
2. `npm install agile-sddf` cuando `.claude/skills/` ya existe → salta archivos (sin `--force`), no bloquea stdin.
3. `SDDF_TARGET=.agents npm install agile-sddf` → instala en `.agents` sin prompt.
4. `npx agile-sddf install` en terminal TTY → muestra el menú de selección de carpeta.
5. `npx agile-sddf install --force` → sobreescribe archivos existentes (modo upgrade).
6. `npx agile-sddf install --target .github --force` → instala en `.github` sobreescribiendo.
