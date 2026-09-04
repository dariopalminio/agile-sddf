---
type: runbook
slug: runbook-deployment-to-npm
title: "Runbook para despliegue en NPM"
date: 2026-04-26
status: BACKLOG
substatus: null
parent: null
---

# 📘 Runbook para despliegue en NPM

Elegir el nuevo número de versión según SemVer:

# Hacer Release en GitHub (crear tag con el número de versión):

Incremento automático de versión:

```bash
npm version patch   # 1.0.0 -> 1.0.1 (bugfix)
npm version minor   # 1.0.0 -> 1.1.0 (nueva funcionalidad)
npm version major   # 1.0.0 -> 2.0.0 (cambio incompatible)
```

O modificar manualmente version en package.json y luego:

```bash
git add . 
git commit -m "chore: version 1.5.6 - Fix postinstall script to install agents correctly"
git push origin main
#git tag -a v1.5.6 -m "Release  v1.5.6 - Fix postinstall script"
git push origin v1.5.6
gh release create v1.5.6 --notes-from-tag
#git push origin v1.5.6
```

# Publicación en NPM

> ⚠️ **Paso de confirmación obligatorio — `npm publish` es irreversible.**
> Una versión publicada no se puede reemplazar, y pasadas 72 h tampoco se puede despublicar.
> Todo el que instale `agile-sddf` recibirá lo que se suba aquí, y el `postinstall` lo copiará
> en su directorio de trabajo.
>
> Antes de ejecutar `npm publish`, confirmar las cuatro cosas y **detenerse ante cualquier duda**:
>
> 1. `npm publish --dry-run --access public` lista exactamente los archivos esperados (los del
>    arreglo `files` de `package.json`) y ningún secreto, `.env` ni artefacto local.
> 2. La versión de `package.json` es la nueva y no está ya publicada — comprobar con
>    `npm view agile-sddf versions`.
> 3. El tag y la release de GitHub del paso anterior existen y apuntan a este commit.
> 4. `CHANGELOG.md` tiene la entrada de esta versión.
>
> Si un agente ejecuta este runbook, debe **pedir aprobación explícita al mantenedor** antes de
> `npm publish` y mostrarle la salida del `--dry-run`. Sin respuesta afirmativa, no se publica:
> el paso falla cerrado.

```bash
npm login
npm publish --dry-run --access public   # revisar la lista de archivos antes de continuar
```

Solo tras confirmar los cuatro puntos anteriores:

```bash
npm publish --access public
```

# Verificación post‑despliegue

https://www.npmjs.com/package/agile-sddf

Ejecutar:

```bash
npm view agile-sddf
```

Si la versión subida es 1.5.6 ejecutar:

```bash
npm view agile-sddf@1.5.6
```

Lo que pasará cuando publiquemos v1.5.6:
En el proyecto del usuario:

```bash
npm install agile-sddf@1.5.6 --foreground-scripts
```

Esto:
Detecta versión nueva → reinstala
Ejecuta el postinstall Y muestra el output
Instala skills Y agents correctamente
Con esto, 
```bash
npm install agile-sddf@latest --foreground-scripts
```

en el proyecto del usuario 
debería mostrar el output completo con skills y agents instalados correctamente 
en .claude/ del proyecto.

