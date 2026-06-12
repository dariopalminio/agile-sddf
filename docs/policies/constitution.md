---
alwaysApply: false
type: constitution
slug: constitution
title: "Constitución del Proyecto"
created: 2026-05-06
updated: 2026-05-06
---

# Constitución del Proyecto

> Este documento establece los principios técnicos inamovibles del proyecto. Es la fuente de verdad para todos los agentes IA y miembros del equipo. Todo lo que aquí se define debe respetarse en el diseño e implementación de cualquier historia.

---

## 🧱 Stack Tecnológico

<!-- Define el stack técnico del proyecto. Sé específico: lenguaje, versión, frameworks, runtime. -->

### Lenguaje principal

- **Lenguaje:** Markdown .md / TypeScript/Node.js/Js para scripts ejecutables (instalación, extracción de contexto, generación de diagramas, etc.)
- **Runtime / Entorno:** Node

Los skills y agentes se definen en Markdown, pero las partes ejecutables (scripts de instalación, extractores de contexto, generadores de diagramas, etc.) se implementan en TypeScript/Node.js para garantizar portabilidad y facilidad de empaquetado.

### Frameworks y librerías core

- **fs-extra:** Manejo avanzado de archivos (copia, eliminación, lectura recursiva).
- **yaml:** Parseo de frontmatter en archivos Markdown (si se usa) y configuraciones.
- **json:** Para manipulación de datos estructurados en memoria o configuraciones.

No se incluyen dependencias para los skills como skill-master (los skills son solo Markdown); las librerías son solo para la parte ejecutable del framework

### Infraestructura y despliegue

- **Base de datos:** No se usa, solo directorios y archivos como almacenamiento de datos.
- **Control de versiones:** Git (GitHub)
- **Contenedores:** Docker + docker-compose
- **SemVer:**  Semantic Versioning para gestión de versiones del paquete.
- **Paquete:** npm (`agile-sddf`) para distribuir el framework y herramientas relacionadas.

---

## 📐 Convenciones de Código

<!-- Define las reglas de estilo y formato que todo el código debe seguir. -->

### Estilo y formato

- **Convención de nombres:** kebab-case


---

## 🏗️ Metodologías de Diseño y Desarrollo

<!-- Define el proceso que el equipo sigue para diseñar e implementar. -->

### Proceso de desarrollo

- **Metodología:** SDD (Spec-Driven Development) con tres niveles de workflow: project, release y story.

---

## Estandares de construcción de Skills

### Patrones estructurales

#### 1. Estructura de directorios de skill

Todo skill sigue esta convención:

```
skill-name/
├── SKILL.md          # obligatorio — frontmatter YAML + instrucciones
├── assets/           # templates canónicos (fuente de verdad)
├── examples/         # casos de prueba input/output
├── scripts/          # código ejecutable (Python, Bash)
├── agents/           # subagentes locales que el skill invoca
└── evals/            # benchmarks de evaluación & quality gates (testing)
```

#### 2. Frontmatter YAML en SKILL.md

Todos los skills arrancan con frontmatter YAML estandarizado (campos: name, description, triggers, outputs, etc.).

#### 3. Preflight como Paso 0

Todos los skills invocan skill-preflight como primer paso antes de ejecutar cualquier lógica. Verifica SDDF_ROOT, estructura de directorios y templates disponibles.

### Patrones de arquitectura

#### 4. Composición de skills + un solo salto de delegación

```
skill orquestador (sesión principal)
  ├── skill B (composición inline — misma sesión)
  ├── agent A (subagente — contexto aislado)
  └── agent C (subagente — contexto aislado)
  ```

Componer skills (inline) está permitido pero con cadenas cortas, porque el contexto se acumula. Delegar (subagentes) solo desde la sesión que ejecuta skills, nunca de subagente a subagente. El skill es el punto de entrada; los agentes especializados son subagentes que escriben su output en `.tmp/<skill-name>/` y devuelven el control.

Los subagentes no invocan skills orquestadores. Si un subagente necesita la lógica de un skill, el skill orquestador se la pasa como parte de su prompt (o referencia el archivo para que el subagente lo lea con `Read`). Los skills orquestadores solo se ejecutan en la sesión principal. Un subagente puede seguir un skill **worker** (sin interacción con el usuario, sin lanzar subagentes y sin depender de contexto conversacional no provisto en el prompt).

#### 5. Template como fuente de verdad dinámica

Los skills no hardcodean la estructura del output. En runtime leen el template correspondiente y extraen secciones, campos y preguntas dinámicamente. Si el template evoluciona, el skill se adapta solo.

#### 6. Skills como orquestadores sin lógica de negocio

La lógica de dominio vive en los templates (estructura) y en los agentes (criterios). El skill orquesta: lee contexto → delega → escribe output.

### Patrones de nomenclatura

#### 7. IDs jerárquicos
Nivel	Patrón	Ejemplo
Proyecto	PROJ-NN-kebab	PROJ-01-mi-app
Release/Épica	EPIC-NN-kebab	EPIC-12-story-sdd-workflow
Feature/Historia	FEAT-NNN-kebab	FEAT-042-login

#### 8. Frontmatter YAML en documentos generados

---
type: project | release | story
id: EPIC-NN
slug: nombre-kebab
status: BACKLOG | DISCOVERY | PLANNING | ...
substatus: TODO | IN-PROGRESS | DONE
parent: PROJ-NN
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

### Reglas de comportamiento

#### 9. Control WIP = 1 en el nivel de proyecto
Solo un documento puede tener substatus: IN-PROGRESS a la vez por nivel del pipeline de proyecto. El skill debe verificar esto antes de activar un nuevo ítem.

#### 10. Gates secuenciales con precondiciones
Cada skill verifica que el artefacto del paso anterior existe y está válido antes de ejecutar. Ejemplo: release-generate-stories requiere que release-format-validation haya pasado.

#### 11. Idempotencia declarada
Skills de inicialización (sddf-init, openspec-init-config) declaran explícitamente que no sobrescriben archivos existentes.

#### 12. Flags opcionales para modos alternativos
Los skills exponen flags para variantes de comportamiento: --quick, --update, --dry-run, --interactive, --from-files, --verbose.

### Patrones de output

#### 13. Rutas de output predecibles

$SPECS_BASE/specs/projects/<PROJ-ID>/  → artefactos de proyecto
$SPECS_BASE/specs/releases/<EPIC-NN>/  → releases
$SPECS_BASE/specs/stories/<FEAT-NNN>/ → historias

#### 14. Versionado mediante substatus

El ciclo de vida de un artefacto se traza con status + substatus, no con versiones numéricas.

#### 15. Skills de validación antes de transformación

Existe un skill de validación explícito (release-format-validation) que actúa como gate antes de que los skills de generación consuman el documento.


## ✅ Principios Técnicos Inamovibles

Lista los principios que NO pueden violarse bajo ninguna circunstancia.

1. **El repositorio como sistema:** Las especificaciones, conocimiento necesario para desarrollo, polìticas y memorias de decisiones están dentro del repositorio, versionadas y accesibles para todos los agentes. Todo lo que un agente necesita para entender "cómo trabajamos" debe estar en el repositorio.
2. **Orquestación multiagente:** dividir el trabajo utilizando un patrón donde un agente líder (orquestador) administra las tareas y decide cuándo delegar el trabajo a subagentes especializados.
3. **Verificación y automejora:** se debe tener un sistema de verificación integrado (con mecanismos como "agentes revisadores" y "Quality Gates"), obligando a la IA a demostrar que algo funciona (por ejemplo, ejecutando tests automatizados) en lugar de solo decir que terminó.
4. **Mantenlo simple con las herramientas (KISS):** otorgarle a la IA herramientas muy sencillas del ecosistema y dejar que la IA deduzca cómo resolver los problemas.
5. **Gestión estricta de la memoria y el contexto:** la IA no debe acumular todo en su contexto; debe tener un sistema de memoria externa (ficheros locales o bases de datos) donde lea y escriba solo lo que necesita en cada momento.
6. **Evita el "teléfono descompuesto":** cuando el agente padre crea subagentes, no debe pasarles todo su contexto heredado, en su lugar, los subagentes deben escribir sus resultados de forma independiente en un directorio `.tmp/<skill-name>/` para que otros agentes lean exclusivamente lo que necesiten. Ver patrón detallado en `[[best-practices-for-skills]]`.
7. **Uso estricto de Protocolos de Inicialización:** La IA no puede empezar a trabajar hasta que un protocolo de verificación valide que el entorno es completamente sano. En este proyecto, ese protocolo está implementado como el skill `skill-preflight` (`[[skill-preflight]]`), que verifica la estructura de directorios, la existencia de templates y las dependencias requeridas antes de ejecutar cualquier skill. No se utiliza un script externo (`init.sh`) sino que la verificación está integrada como un skill reutilizable invocable desde cualquier otro skill.
8. **Mantener buenas prácticas y estándares homogéneos:** El código base debe estar bien estructurado y definimos buenas prácticas y reglas claras para que los patrones de resultado esperado sean predecibles.
9. **Spec-first:** Escribes la spec antes de codificar, la usas para la tarea en curso, y luego la descartas. Es el nivel más básico.
10. **Spec-anchored:** La spec se mantiene después de completar la tarea y se usa para evolución y mantenimiento del feature.
11. TDD (Test-Driven Development) para skills: Define primero los casos de prueba (`evals/evals.json`) **antes** del `SKILL.md`.

---

## 📎 Notas adicionales

<!-- Cualquier regla técnica que no encaja en las secciones anteriores. -->

[Por completar]
