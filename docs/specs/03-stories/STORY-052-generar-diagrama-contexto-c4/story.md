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
**FINVEST Score:** pendiente
**FINVEST Decisión:** pendiente
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# 📖 Historia: Generar un diagrama de contexto C4 del proyecto respondiendo preguntas o desde specs

**Como** developer o arquitecto que documenta un proyecto con SDDF  
**Quiero** generar un diagrama de contexto C4 de mi sistema respondiendo preguntas sobre los actores y sistemas relacionados, o indicando el documento de especificaciones existente  
**Para** visualizar cómo mi sistema interactúa con actores externos y sistemas adyacentes sin necesitar herramientas especializadas de diagramado

## ✅ Criterios de aceptación

### Escenario principal – Diagrama generado a partir de preguntas guiadas --interactive
```gherkin
Dado que ejecuto el skill `/project-context-diagram`
  Y no indico ningún documento de especificaciones como input
Cuando respondo las preguntas sobre el nombre del sistema, actores externos y relaciones
Entonces el skill produce un diagrama de contexto C4 en formato Mermaid o PlantUML
  Y el diagrama es guardado en `$SPECS_BASE/specs/projects/<PROJ-slug>/context-diagram.puml`
```

### Escenario alternativo – Diagrama generado desde documento de especificaciones
```gherkin
Dado que ejecuto el skill `/project-context-diagram` indicando la ruta `$SPECS_BASE/specs/projects/PROJ-01-mi-sistema/project.md`
Cuando el skill lee el documento de especificaciones
Entonces extrae los sistemas involucrados y sus relaciones del documento
  Y genera el diagrama de contexto C4 sin hacer preguntas adicionales al usuario
  Y el diagrama es guardado en `$SPECS_BASE/specs/projects/PROJ-01-mi-sistema/context-diagram.puml`
```

### Escenario alternativo / error – Documento indicado no encontrado
```gherkin
Dado que ejecuto el skill con la ruta `$SPECS_BASE/specs/projects/PROJ-99-inexistente/project.md`
Cuando el skill intenta leer el documento
Entonces el skill muestra el mensaje "❌ No se encontró el archivo de especificaciones indicado y se intentarà leer el directorio de proyectos para generar el diagrama a partir de preguntas guiadas."
  Y el skill lee el directorio de proyectos para generar el diagrama a partir de los archivos md existentes y preguntas guiadas para complementar la información faltante
  Pero ofrece continuar en modo interactivo con preguntas guiadas
```
### Requirement: Diagramas C4 Nivel 1
El skill crea o actualiza diagramas C4 Nivel 1 (System Context) en PlantUML, con semántica estricta.

### Requirement: Modos de operación

#### `--interactive` (por defecto)
El agente pregunta:
- Nombre y descripción del sistema.
- Actores (roles) y su descripción.
- Sistemas externos (nombre, descripción, protocolo, sincronía).
- Relaciones entre actores, sistema y sistemas externos.

#### `--from-files`
El agente escanea:
- `README.md`, `package.json`, `pyproject.toml`, etc. para nombre del sistema.
- `$SPECS_BASE/specs/`, `openspec/`, `.specify/`, user stories en busca de actores (p.ej. "Como un ...").
- Código fuente en busca de imports de servicios conocidos (Stripe, SendGrid, AWS, etc.) para inferir sistemas externos.
- Stack tecnológico para sugerir protocolos.
- Presenta un resumen al usuario para confirmar antes de generar.

#### `--update`
Lee el archivo `.puml` existente (si está en la ruta esperada), extrae los elementos y relaciones actuales, y permite añadir/eliminar según nueva información o respuestas del usuario.

#### `--propose` (combinable con otros modos)
Activa la generación de propuestas `[PROPUESTO]` explicadas en una tabla.

### Requirement: Reglas de compatibilidad para notas y leyendas

Dentro del PlantUML generado, no se escriben nombres de macros C4 (`System()`, `System_Ext()`, `Rel()`) dentro de `note` o `legend`. En su lugar, se usa lenguaje natural: "sistema central", "sistema externo", "relación".

### Requirement: Configuración de ruta base (SPECS_BASE)
El skill SHALL determinar el directorio raíz de especificaciones antes de cualquier operación con archivos, leyendo la variable de entorno `SDDF_ROOT` y usando `$SPECS_BASE` en lugar de `docs` para todas las rutas de artefactos.

#### Scenario: SDDF_ROOT definida y ruta existe
- **WHEN** la variable de entorno `SDDF_ROOT` está definida y la ruta referenciada existe
- **THEN** el skill usa ese valor como `SPECS_BASE`

#### Scenario: SDDF_ROOT no definida
- **WHEN** la variable de entorno `SDDF_ROOT` no está definida
- **THEN** el skill usa `SPECS_BASE=docs`

#### Scenario: SDDF_ROOT definida pero ruta inexistente
- **WHEN** la variable de entorno `SDDF_ROOT` está definida pero la ruta no existe
- **THEN** el skill muestra `⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs` y usa `SPECS_BASE=docs`

### Requirement: Skill construido con metodología skill-master
El skill `release-creation` SHALL ser construido usando el skill `skill-master`, incluyendo la captura de intent, redacción del SKILL.md, y definición de casos de prueba documentados.

## ⚙️ Criterios no funcionales

* Portabilidad: el output del diagrama usa un formato de texto (Mermaid o PlantUML) renderizable en Markdown sin herramientas adicionales
* Autonomía: cuando el input es un documento de specs, el skill extrae actores y relaciones sin intervención del usuario

## 📎 Notas / contexto adicional

Scope out de esta historia:
- Diagramas de nivel 2 o 3 (contenedores y componentes C4) — esta historia cubre únicamente el nivel 1 (contexto)
- Renderizado visual interactivo o exportación a PNG/SVG — el output es texto Mermaid/PlantUML
- Sincronización automática del diagrama al modificar el documento de specs
