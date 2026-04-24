---
alwaysApply: false
---
**Título**: Release 06 — Release & Story Generator
**Versión**: 1.0
**Estado**: Ready
**Fecha**: 2026-04-20
---

# Release 07 — Publicación del Framework SDDF como Paquete NPM

## Descripción
Permite la distribución del framework Agile Spec-Driven-Development (SDDF) como un paquete NPM público, facilitando la instalación global de todos los skills, agentes y templates del framework.

## Features
- [x] **FEAT-038: Copiar los templates a los skills correspondientes** — Reorganizar los templates de `docs/specs/templates/` a los directorios `templates/` de los skills que los utilizan. _(deps: —)_
- [x] **FEAT-039: Publicar framework en npm** — (package structure + npm publish manual) Empaquetar y publicar todos los skills, agentes y templates del framework en NPM para instalación global con npm install -g @sddf/core. _(deps: FEAT-038)_
- [x] **FEAT-040: Instalar skills via postinstall (script)** — Configurar el script `postinstall` para copiar automáticamente los skills y agentes a `~/.claude/` tras la instalación global. Implica crear un script Node.js (scripts/postinstall.js) que npm ejecuta automáticamente al hacer npm install -g.  _(deps: FEAT-039)_

## Notas:

Implementar FEAT-039:
- Reorganizar la estructura del proyecto para que cada skill, agente y template tenga su propio package.json con la configuración adecuada para npm.
- Asegurarse de que cada package.json incluya los campos necesarios como name, version, main, files, etc.
- Verificar que los archivos necesarios para cada skill, agente y template estén incluidos en el campo files de su respectivo package.json.
- Probar la estructura con npm pack --dry-run para asegurarse de que todo esté configurado correctamente antes de publicar.
Implementar FEAT-040:
- Implementar scripts/postinstall.js localmente
- Agregarlo al package.json ("scripts": { "postinstall": "node scripts/postinstall.js" })
- Agregar scripts/postinstall.js al campo files
- Verificar con npm pack --dry-run
- Publicar todo junto en un solo npm publish

Se requieren intervención humana directa:
- 5.1	npm whoami — verificar sesión activa, o npm login si no estás autenticado
- 5.2	npm publish --access public — publicar el paquete
- 5.3	Verificar https://www.npmjs.com/package/agile-sddf en el navegador
- 5.4	npm install -g agile-sddf en un entorno limpio para confirmar que .claude/ queda instalado

Lo mínimo que deberías hacer antes de npm publish:
La convención es que el git tag, el GitHub Release y la versión npm sean la misma cadena (sin la v).
Es una buena práctica crear el release en GitHub antes de publicar en npm, para que el código fuente del release esté disponible públicamente y vinculado al paquete npm. Esto también facilita la gestión de versiones y la documentación del release:
git checkout main
git merge release/07-public-npm-package
git tag v1.5.0
git push origin main --tags
# Luego crear el GitHub Release desde el tag v1.5.0
gh release create v1.5.0 --notes-from-tag
git push origin v1.5.0
# Y finalmente: npm publish --access public
