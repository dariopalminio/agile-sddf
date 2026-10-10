---
alwaysApply: false
type: story
id: STORY-052
kind: feat
slug: STORY-052-generar-diagrama-contexto-c4
title: "Generar un diagrama de contexto C4 del proyecto respondiendo preguntas o desde specs"
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-01
updated: 2026-05-01
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# ðŸ“– Historia: Generar un diagrama de contexto C4 del proyecto respondiendo preguntas o desde specs

**Como** developer o arquitecto que documenta un proyecto con SDDF  
**Quiero** generar un diagrama de contexto C4 de mi sistema respondiendo preguntas sobre los actores y sistemas relacionados, o indicando el documento de especificaciones existente  
**Para** visualizar cÃ³mo mi sistema interactÃºa con actores externos y sistemas adyacentes sin necesitar herramientas especializadas de diagramado

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Diagrama generado a partir de preguntas guiadas --interactive
```gherkin
Dado que ejecuto el skill `/project-context-diagram`
  Y no indico ningÃºn documento de especificaciones como input
Cuando respondo las preguntas sobre el nombre del sistema, actores externos y relaciones
Entonces el skill produce un diagrama de contexto C4 en formato Mermaid o PlantUML
  Y el diagrama es guardado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`
```

### Escenario alternativo â€“ Diagrama generado desde documento de especificaciones
```gherkin
Dado que ejecuto el skill `/project-context-diagram` indicando la ruta `$SPECS_BASE/specs/projects/PROJ-01-mi-sistema/project.md`
Cuando el skill lee el documento de especificaciones
Entonces extrae los sistemas involucrados y sus relaciones del documento
  Y genera el diagrama de contexto C4 sin hacer preguntas adicionales al usuario
  Y el diagrama es guardado en `$SPECS_BASE/specs/projects/PROJ-01-mi-sistema/context-diagram.puml`
```

### Escenario alternativo / error â€“ Documento indicado no encontrado
```gherkin
Dado que ejecuto el skill con la ruta `$SPECS_BASE/specs/projects/PROJ-99-inexistente/project.md`
Cuando el skill intenta leer el documento
Entonces el skill muestra el mensaje "âŒ No se encontrÃ³ el archivo de especificaciones indicado y se intentarÃ  leer el directorio de proyectos para generar el diagrama a partir de preguntas guiadas."
  Y el skill lee el directorio de proyectos para generar el diagrama a partir de los archivos md existentes y preguntas guiadas para complementar la informaciÃ³n faltante
  Pero ofrece continuar en modo interactivo con preguntas guiadas
```
### Requirement: Diagramas C4 Nivel 1
El skill crea o actualiza diagramas C4 Nivel 1 (System Context) en PlantUML, con semÃ¡ntica estricta.

### Requirement: Modos de operaciÃ³n

#### `--interactive` (por defecto)
El agente pregunta:
- Nombre y descripciÃ³n del sistema.
- Actores (roles) y su descripciÃ³n.
- Sistemas externos (nombre, descripciÃ³n, protocolo, sincronÃ­a).
- Relaciones entre actores, sistema y sistemas externos.

#### `--from-files`
El agente escanea:
- `README.md`, `package.json`, `pyproject.toml`, etc. para nombre del sistema.
- `$SPECS_BASE/specs/`, `openspec/`, `.specify/`, user stories en busca de actores (p.ej. "Como un ...").
- CÃ³digo fuente en busca de imports de servicios conocidos (Stripe, SendGrid, AWS, etc.) para inferir sistemas externos.
- Stack tecnolÃ³gico para sugerir protocolos.
- Presenta un resumen al usuario para confirmar antes de generar.

#### `--update`
Lee el archivo `.puml` existente (si estÃ¡ en la ruta esperada), extrae los elementos y relaciones actuales, y permite aÃ±adir/eliminar segÃºn nueva informaciÃ³n o respuestas del usuario.

#### `--propose` (combinable con otros modos)
Activa la generaciÃ³n de propuestas `[PROPUESTO]` explicadas en una tabla.

### Requirement: Reglas de compatibilidad para notas y leyendas

Dentro del PlantUML generado, no se escriben nombres de macros C4 (`System()`, `System_Ext()`, `Rel()`) dentro de `note` o `legend`. En su lugar, se usa lenguaje natural: "sistema central", "sistema externo", "relaciÃ³n".

### Requirement: ConfiguraciÃ³n de ruta base (SPECS_BASE)
El skill SHALL determinar el directorio raÃ­z de especificaciones antes de cualquier operaciÃ³n con archivos, leyendo la variable de entorno `SDDF_ROOT` y usando `$SPECS_BASE` en lugar de `docs` para todas las rutas de artefactos.

#### Scenario: SDDF_ROOT definida y ruta existe
- **WHEN** la variable de entorno `SDDF_ROOT` estÃ¡ definida y la ruta referenciada existe
- **THEN** el skill usa ese valor como `SPECS_BASE`

#### Scenario: SDDF_ROOT no definida
- **WHEN** la variable de entorno `SDDF_ROOT` no estÃ¡ definida
- **THEN** el skill usa `SPECS_BASE=docs`

#### Scenario: SDDF_ROOT definida pero ruta inexistente
- **WHEN** la variable de entorno `SDDF_ROOT` estÃ¡ definida pero la ruta no existe
- **THEN** el skill muestra `âš ï¸ La ruta definida en SDDF_ROOT no existe. Se usarÃ¡ el valor por defecto: docs` y usa `SPECS_BASE=docs`

### Requirement: Skill construido con metodologÃ­a skill-master
El skill `release-creation` SHALL ser construido usando el skill `skill-master`, incluyendo la captura de intent, redacciÃ³n del SKILL.md, y definiciÃ³n de casos de prueba documentados.

## âš™ï¸ Criterios no funcionales

* Portabilidad: el output del diagrama usa un formato de texto (Mermaid o PlantUML) renderizable en Markdown sin herramientas adicionales
* AutonomÃ­a: cuando el input es un documento de specs, el skill extrae actores y relaciones sin intervenciÃ³n del usuario

## ðŸ“Ž Notas / contexto adicional

Scope out de esta historia:
- Diagramas de nivel 2 o 3 (contenedores y componentes C4) â€” esta historia cubre Ãºnicamente el nivel 1 (contexto)
- Renderizado visual interactivo o exportaciÃ³n a PNG/SVG â€” el output es texto Mermaid/PlantUML
- SincronizaciÃ³n automÃ¡tica del diagrama al modificar el documento de specs
