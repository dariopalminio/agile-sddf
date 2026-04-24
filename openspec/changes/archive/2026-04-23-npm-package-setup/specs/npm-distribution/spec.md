## ADDED Requirements

### Requirement: El paquete tiene un package.json válido para npm
El repositorio SHALL contener un `package.json` con los campos mínimos requeridos para publicar en npm: `name`, `version`, `description`, `keywords`, `license`, `files` y `repository`.

#### Scenario: package.json contiene todos los campos requeridos
- **WHEN** se ejecuta `npm pack --dry-run` en el repositorio
- **THEN** no hay errores de validación de campos requeridos
- **THEN** el output lista exactamente los archivos declarados en `files`

#### Scenario: Campo files incluye .claude/
- **WHEN** se inspecciona el `package.json`
- **THEN** el campo `files` contiene `.claude/`, `README.md` y `LICENSE`

### Requirement: El paquete publicado no contiene archivos de desarrollo
El paquete SHALL excluir archivos de desarrollo y especificación interna: `openspec/`, `docs/`, `.tmp/`, `docker-compose.dev.yml`, `Dockerfile.dev`, `gem/`, `rovo/`, `assets/`, `skills-lock.json`.

#### Scenario: npm pack --dry-run excluye archivos de desarrollo
- **WHEN** se ejecuta `npm pack --dry-run`
- **THEN** el output no lista ningún archivo de `openspec/`, `docs/`, `.tmp/`, `gem/` ni `rovo/`
- **THEN** `skills-lock.json` no aparece en el listado

### Requirement: El paquete es publicable en el registro público de npm
El mantenedor SHALL poder publicar el paquete con `npm publish --access public` y el paquete SHALL ser instalable con `npm install -g <nombre>`.

#### Scenario: Publicación exitosa
- **WHEN** el mantenedor ejecuta `npm publish --access public` con sesión autenticada
- **THEN** el comando retorna exit code 0
- **THEN** el paquete aparece en `https://www.npmjs.com/package/<nombre>`

#### Scenario: El paquete instalado contiene los skills y agentes
- **WHEN** un usuario ejecuta `npm install -g <nombre>`
- **THEN** el directorio instalado contiene `.claude/skills/` con todos los skills del framework
- **THEN** el directorio instalado contiene `.claude/agents/` con todos los agentes
