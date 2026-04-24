## 1. Agregar dependencia fs-extra

- [x] 1.1 Ejecutar `npm install fs-extra` en la raíz del repositorio para agregar `fs-extra` a `dependencies` en `package.json`
- [x] 1.2 Verificar que `fs-extra` aparece en `package.json` bajo `dependencies` (no `devDependencies`)

## 2. Crear el script postinstall

- [x] 2.1 Crear el archivo `scripts/postinstall.js` (CommonJS)
- [x] 2.2 Implementar la lógica de resolución de destino: `path.join(os.homedir(), '.claude')` compatible con macOS, Linux y Windows
- [x] 2.3 Implementar la copia de `.claude/skills/` a `~/.claude/skills/` iterando sobre subdirectorios, con skip si ya existen
- [x] 2.4 Implementar la copia de `.claude/agents/` a `~/.claude/agents/` con la misma lógica de skip
- [x] 2.5 Agregar mensajes de consola: `Installed: <path>` para nuevos, `Skipped (already exists): <path>` para existentes
- [x] 2.6 Agregar resumen final: `SDDF installed: X skills, Y agents (Z skipped)`

## 3. Registrar el script en package.json

- [x] 3.1 Agregar `"postinstall": "node scripts/postinstall.js"` en la sección `scripts` de `package.json`
- [x] 3.2 Agregar `"scripts/"` al campo `files` de `package.json` para incluirlo en el paquete publicado

## 4. Verificar el paquete

- [x] 4.1 Ejecutar `npm pack --dry-run` y confirmar que `scripts/postinstall.js` aparece en el listado
- [x] 4.2 Confirmar que `node_modules/` y archivos de desarrollo no se incluyeron

## 5. Actualizar README

- [x] 5.1 Verificar que la sección de instalación en `README.md` describe correctamente el comportamiento post-instalación (que los skills se copian a `~/.claude/` automáticamente)
- [x] 5.2 Agregar nota sobre entornos con `--ignore-scripts` si el paso de instalación no corre automáticamente
