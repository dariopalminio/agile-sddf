# Plan: Integrar sddf.config.yaml en el skill sddf-init

## Contexto

sddf.config.yaml es la configuración operacional del framework (comandos de test, skills configurados) que fue movida a la raíz del proyecto. Actualmente sddf-init no la crea al inicializar el entorno — el usuario que haga sddf-init en un proyecto nuevo no tendrá el archivo y los skills que lo leen (story-implement, story-design, story-testcases) emitirán warnings.

La solución: añadir un paso en sddf-init que cree sddf.config.yaml desde un template en assets/, siguiendo el mismo patrón que ya usa el skill para openspec/config.yaml.

## Archivos críticos

Archivo	Acción
.claude/skills/sddf-init/assets/sddf.config.yaml.template	Crear — template para sddf.config.yaml (contenido idéntico al sddf.config.yaml actual)
.claude/skills/sddf-init/SKILL.md	Añadir Paso 3 para crear sddf.config.yaml desde el template; renumerar pasos siguientes (3→4, 4→5, 5→6, 6→7)

## Pasos de implementación

1. Crear assets/sddf.config.yaml.template
El template tiene el mismo contenido que el sddf.config.yaml actual en la raíz. Convenio de nombre igual al existente: config.yaml.template → sddf.config.yaml.template.

Contenido del template:
```
# Valores por defecto para todos los tipos
# este archivo debe diseñarse y reconstruiserse para ser fácilmente extendible y adaptable a diferentes proyectos y tecnologías
defaults:
  unit:
    command: "pnpm run test:unit"
    required: false
  component:
    command_template: "pnpm run test:component -- {{test_file}}"
    required: false
  integration:
    command: "pnpm run test:integration"
    required: false
  contract:
    command: "pnpm run test:contract"
    required: false
  e2e:
    command: "pnpm run test:e2e"
    required: false
  performance:
    command: "pnpm run test:performance"
    required: false
  eval:
    command: "pnpm run test:eval"
    required: true

implementing:
  test_generators:
    - type: unit
      skill: none
      required: false
    - type: e2e
      skill: none
      required: false
    - type: eval
      skill: skill-test-evals
      required: true
  code_generator:
    skill: skill-master
    required: true
```

2. Actualizar sddf-init/SKILL.md
Insertar Paso 3 — Generar sddf.config.yaml después del actual Paso 2 y antes del actual Paso 3 (openspec/config.yaml). Renumerar los pasos siguientes: 3→4, 4→5, 5→6, 6→7.

Nuevo Paso 3 — Generar sddf.config.yaml:
```
Verificar si `sddf.config.yaml` existe en la raíz del proyecto:
- **No existe (o existe vacío):**
  - Crear `sddf.config.yaml` usando exactamente el contenido del template en `.claude/skills/sddf-init/assets/sddf.config.yaml.template`
  - Registrar `[CREADO]  sddf.config.yaml`
- **Ya existe con contenido:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  sddf.config.yaml` y emitir `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`
```
Actualizar también el ejemplo del informe final (Paso 7) añadiendo la línea sddf.config.yaml:

[CREADO]     sddf.config.yaml

## Verificación

Invocar /sddf-init en un directorio limpio → confirmar que crea sddf.config.yaml en la raíz.
Invocar /sddf-init de nuevo → confirmar idempotencia: [YA EXISTÍA] sddf.config.yaml.
assets/sddf.config.yaml.template contiene el mismo YAML que sddf.config.yaml actu