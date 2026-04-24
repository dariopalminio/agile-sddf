## 1. Verificar disponibilidad del nombre de paquete

- [x] 1.1 Ejecutar `npm show agile-sddf` y confirmar que el nombre está disponible (o elegir alternativa)
- [x] 1.2 Si `agile-sddf` está ocupado, evaluar `agile-sddf-framework` o `@sddf/core` (requiere org npm)

## 2. Crear package.json

- [x] 2.1 Crear `package.json` en la raíz del repositorio con `name`, `version: "1.0.0"`, `description`, `keywords`, `license: "MIT"`, `repository` y `engines`
- [x] 2.2 Agregar campo `files` con: `".claude/"`, `"README.md"`, `"LICENSE"`
- [x] 2.3 Agregar campo `homepage` apuntando al repositorio de GitHub

## 3. Verificar contenido del paquete

- [x] 3.1 Ejecutar `npm pack --dry-run` y revisar el listado de archivos incluidos
- [x] 3.2 Confirmar que `.claude/skills/` y `.claude/agents/` aparecen en el listado
- [x] 3.3 Confirmar que `openspec/`, `docs/`, `.tmp/`, `gem/`, `rovo/`, `assets/`, `docker-compose.dev.yml`, `Dockerfile.dev` y `skills-lock.json` **no** aparecen

## 4. Verificar README.md para página npm

- [x] 4.1 Revisar que `README.md` tiene una sección de instalación (`npm install -g <nombre>`) visible al inicio
- [x] 4.2 Agregar o actualizar la sección si no existe o está desactualizada

## 5. Publicación

- [ ] 5.1 Autenticarse en npm con `npm login` (o verificar sesión activa con `npm whoami`)
- [ ] 5.2 Ejecutar `npm publish --access public` y confirmar exit code 0
- [ ] 5.3 Verificar que el paquete aparece en `https://www.npmjs.com/package/<nombre>`
- [ ] 5.4 Verificar instalación en entorno limpio con `npm install -g <nombre>` y confirmar que `.claude/` está presente
