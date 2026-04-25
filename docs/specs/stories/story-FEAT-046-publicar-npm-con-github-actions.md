## 📖 Historia: GitHub Actions CI/CD

**Como** mantenedor del framework SDDF
**Quiero** que al crear un release en GitHub se publique automáticamente la nueva versión en npm
**Para** distribuir cada versión del framework sin pasos manuales de publicación

## ✅ Criterios de aceptación

### Escenario principal – Release en GitHub dispara publicación en npm
```gherkin
Dado que el repositorio tiene configurado el secreto "NPM_TOKEN" en GitHub Actions
  Y el "package.json" tiene la versión "1.0.0"
Cuando el mantenedor crea el release "v1.0.0" en GitHub
Entonces el workflow de GitHub Actions se ejecuta automáticamente
  Y publica la versión "1.0.0" en el registro npm con "npm publish --access public"
  Y el paquete aparece en "https://www.npmjs.com/package/@sddf/core" con la nueva versión
```

### Escenario alternativo / error – Token npm inválido o expirado
```gherkin
Dado que el secreto "NPM_TOKEN" en GitHub Actions es inválido o ha expirado
Cuando el mantenedor crea un release en GitHub
Entonces el workflow falla con error "403 Forbidden" en el paso de publicación
  Y el mantenedor recibe notificación de fallo en GitHub
  Pero el paquete anterior en npm no se modifica
```

### Escenario alternativo / error – Versión ya publicada en npm
```gherkin
Dado que la versión "1.0.0" ya existe en npm
Cuando el workflow intenta publicar "npm publish" con la misma versión
Entonces el paso falla con error "403 You cannot publish over the previously published versions"
  Y el workflow termina con estado "failure" en GitHub Actions
```

### Requerimiento
El workflow solo debe ejecutarse en eventos `release: [published]`, no en push a main ni en pull requests. El token npm debe almacenarse exclusivamente como secreto de GitHub (`NPM_TOKEN`), nunca en el repositorio.

## ⚙️ Criterios no funcionales

* Seguridad: el `NPM_TOKEN` nunca debe aparecer en logs ni en el código del workflow

## 📎 Notas / contexto adicional

El workflow debe leer la versión desde el `package.json` del repositorio, no desde el tag del release, para evitar inconsistencias. Se recomienda incluir un paso previo de `npm test` (o lint) antes de publicar.

Puede desarrollarse en paralelo con la historia del script `postinstall`. Solo depende de que el `package.json` base exista (`story-publicar-framework-en-npm.md`).
