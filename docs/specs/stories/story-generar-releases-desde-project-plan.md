## 📖 Historia

**Como** desarrollador que ha completado la planificación de un proyecto SDDF con releases definidos en `project-plan.md`
**Quiero** ejecutar el skill `releases-from-project-plan` para que genere automáticamente un archivo `release-[ID]-[Nombre].md` por cada release planificado
**Para** disponer de especificaciones de release ya estructuradas en formato `release-spec-template.md` sin tener que completarlas manualmente desde cero

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de archivos de release
```gherkin
Dado que existe "docs/specs/project/project-plan.md" con al menos una sección "### Release" que contiene ID, nombre, objetivo y features asignadas
  Y el directorio "docs/specs/releases/" existe o puede ser creado por el skill
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill genera un archivo "release-[ID]-[Nombre].md" por cada release encontrado en el plan
  Y cada archivo sigue exactamente la estructura de "docs/specs/templates/release-spec-template.md"
  Y cada archivo incluye las secciones obligatorias: frontmatter (Título, Versión, Estado, Fecha), Descripción, Features y Flujos Críticos / Smoke Tests
```

### Escenario alternativo / error – `project-plan.md` no existe
```gherkin
Dado que el archivo "docs/specs/project/project-plan.md" no existe en el directorio del proyecto
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra el mensaje "No se encontró docs/specs/project/project-plan.md"
  Y no genera ningún archivo de release
```

### Escenario alternativo / error – El plan no contiene releases planificados
```gherkin
Dado que existe "docs/specs/project/project-plan.md"
  Y el archivo no contiene ninguna sección con estructura "### Release"
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra el mensaje "No se encontraron releases planificados en project-plan.md"
  Y no genera ningún archivo de release
```

## ⚙️ Criterios no funcionales

* Nombrado: el slug del archivo se construye como `release-[ID]-[Nombre-kebab-case].md` usando el ID y el nombre del release tal como aparecen en el plan
* Contenido generado: el skill usa el objetivo, features y criterios de éxito del release para poblar las secciones del template; las secciones opcionales se dejan con placeholder cuando no hay datos disponibles en el plan

## 📎 Notas / contexto adicional

El skill lee la sección "## Propuesta de Releases" de `project-plan.md` para extraer cada release (ID, nombre, objetivo, features asignadas, criterios de éxito) y genera un archivo por release en `docs/specs/releases/`. La validación del formato de los archivos generados queda cubierta por FEAT-027 y está fuera del scope de esta historia.
