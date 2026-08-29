---
type: story
id: FEAT-046
slug: FEAT-046-publicar-npm-con-github-actions
title: "GitHub Actions CI/CD"
date: 2026-04-27
status: COMPLETED
substatus: READY
parent: null
---

<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

## ?? Historia: GitHub Actions CI/CD

**Como** mantenedor del framework SDDF
**Quiero** que al crear un release en GitHub se publique autom�ticamente la nueva versi�n en npm
**Para** distribuir cada versi�n del framework sin pasos manuales de publicaci�n

## ? Criterios de aceptaci�n

### Escenario principal � Release en GitHub dispara publicaci�n en npm
```gherkin
Dado que el repositorio tiene configurado el secreto "NPM_TOKEN" en GitHub Actions
  Y el "package.json" tiene la versi�n "1.0.0"
Cuando el mantenedor crea el release "v1.0.0" en GitHub
Entonces el workflow de GitHub Actions se ejecuta autom�ticamente
  Y publica la versi�n "1.0.0" en el registro npm con "npm publish --access public"
  Y el paquete aparece en "https://www.npmjs.com/package/@sddf/core" con la nueva versi�n
```

### Escenario alternativo / error � Token npm inv�lido o expirado
```gherkin
Dado que el secreto "NPM_TOKEN" en GitHub Actions es inv�lido o ha expirado
Cuando el mantenedor crea un release en GitHub
Entonces el workflow falla con error "403 Forbidden" en el paso de publicaci�n
  Y el mantenedor recibe notificaci�n de fallo en GitHub
  Pero el paquete anterior en npm no se modifica
```

### Escenario alternativo / error � Versi�n ya publicada en npm
```gherkin
Dado que la versi�n "1.0.0" ya existe en npm
Cuando el workflow intenta publicar "npm publish" con la misma versi�n
Entonces el paso falla con error "403 You cannot publish over the previously published versions"
  Y el workflow termina con estado "failure" en GitHub Actions
```

### Requerimiento
El workflow solo debe ejecutarse en eventos `release: [published]`, no en push a main ni en pull requests. El token npm debe almacenarse exclusivamente como secreto de GitHub (`NPM_TOKEN`), nunca en el repositorio.

## ?? Criterios no funcionales

* Seguridad: el `NPM_TOKEN` nunca debe aparecer en logs ni en el c�digo del workflow

## ?? Notas / contexto adicional

El workflow debe leer la versi�n desde el `package.json` del repositorio, no desde el tag del release, para evitar inconsistencias. Se recomienda incluir un paso previo de `npm test` (o lint) antes de publicar.

Puede desarrollarse en paralelo con la historia del script `postinstall`. Solo depende de que el `package.json` base exista (`story-publicar-framework-en-npm.md`).
