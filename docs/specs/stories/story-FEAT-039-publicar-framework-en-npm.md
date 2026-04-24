## 📖 Historia: Publicar framework en npm

**Como** mantenedor del framework SDDF
**Quiero** publicar el framework en el registro público de npm con `npm publish --access public`
**Para** que cualquier desarrollador pueda instalarlo con `npm install -g @sddf/core` y el paquete sea descubrible en npmjs.com

## ✅ Criterios de aceptación

### Escenario principal – Publicación exitosa del paquete
```gherkin
Dado que el repositorio tiene un "package.json" con nombre "@sddf/core", versión y campo "files" que incluye ".claude/"
  Y el usuario está autenticado en npm con "npm login"
Cuando ejecuta "npm publish --access public"
Entonces el paquete aparece en "https://www.npmjs.com/package/@sddf/core"
  Y cualquier usuario puede instalar con "npm install -g @sddf/core"
```

### Escenario alternativo / error – Nombre de paquete ya ocupado
```gherkin
Dado que el nombre "@sddf/core" ya está registrado por otra cuenta en npm
Cuando el mantenedor ejecuta "npm publish --access public"
Entonces recibe el error "403 Forbidden - You do not have permission to publish"
  Pero el repositorio no se modifica
```

### Escenario alternativo / error – Campo "files" mal configurado
```gherkin
Dado que el "package.json" tiene un campo "files" que no incluye ".claude/"
Cuando se instala el paquete publicado con "npm install -g @sddf/core"
Entonces el directorio ".claude/" no está presente en el paquete instalado
  Y los skills y agentes no están disponibles
```

### Requerimiento
El `package.json` debe incluir en `files`: `.claude/`, `README.md`, `LICENSE`. La versión debe seguir semver. El campo `description` debe describir el framework.

## ⚙️ Criterios no funcionales

* El paquete no debe incluir archivos de desarrollo (`.tmp/`, `openspec/`, `docker-compose.dev.yml`) para mantener el tamaño mínimo

## 📎 Notas / contexto adicional

La organización `@sddf` en npm debe estar registrada previamente por el mantenedor. Si no es posible obtener el scope `@sddf`, usar `agile-sddf` (sin scope) como alternativa.

Este es el prerequisito para las historias de instalación automática (postinstall) y CI/CD. Se puede publicar y verificar manualmente sin necesitar las otras dos.
