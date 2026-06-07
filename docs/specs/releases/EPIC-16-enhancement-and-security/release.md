---
alwaysApply: false
type: release
id: EPIC-16
slug: EPIC-16-enhancement-and-security
title: "enhancement and security improvements for skills (Safe Enhancement & Fortify Skills)"
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
created: 2026-06-05
updated: 2026-06-05
related: [
    - plan-01-root-folder-selection-to-installer
    - plan-02-integrate-story-testcases-in-story-plan
    - plan-03-integrate-story-improve-in-story-specify
    - plan-04-add-and-improve-skills-readme
    - plan-05-extend-story-code-review-with-testcases
    - plan-06-configure-story-verify-with-config-file
]
---
[[plan-01-root-folder-selection-to-installer]]
[[plan-02-integrate-story-testcases-in-story-plan]]
[[plan-03-integrate-story-improve-in-story-specify]]
[[plan-04-add-and-improve-skills-readme]]
[[plan-05-extend-story-code-review-with-testcases]]
[[plan-06-configure-story-verify-with-config-file]]

# Release/Epic: enhancement and security improvements for skills (Safe Enhancement & Fortify Skills)

## Descripción

Agregar selección de root folder de skills al instalador, ampliar las capacidades del skill de implementación y specify, mejorar seguridad y auditoría de skills.

## Features

- [x] **Integrar Skill Shielder en Dockerfile.dev**: Clonar el repositorio de Skill Shielder durante el build de la imagen de desarrollo, hacer ejecutables los scripts y exponer el comando shield en el PATH del sistema para permitir auditorías de seguridad de skills bajo demanda desde dentro del contenedor. Esto permite auditar la seguridad de los skills en el entorno de desarrollo, facilitando la identificación y corrección de vulnerabilidades antes de la integración.
- [x] **Skill Security Audit en el pipeline de CI**: Agregar un nuevo job en el pipeline de CI que ejecute el comando shield audit en cada push a main y en cada PR. 
- [x] **Checklist for Test Cases Progress**: Add checklist for Test Cases Progress in testcases.md. Modificar testcases-template.md con nueva sección final ## Test Cases Progress for {story_id} con el placeholder {progress_checklist} y comentario explicativo sobre los estados [x] / [ ] / [!]. Modificar story-testcases/SKILL.md — Paso 6 ahora incluye instrucción explícita para generar la sección de progreso: itera cada fila de la tabla y produce - [ ] {ID}: {Escenario}. El fallback template interno también fue actualizado con la nueva sección. Modificar examples/output/testcases.md — Ejemplo de output actualizado con los 13 checkboxes vacíos correspondientes a los casos del ejemplo FEAT-099. Y modificar story-implement/SKILL.md — Paso 9b ahora, tras ejecutar el comando de test, actualiza los checkboxes de testcases.md: [x] si el tipo pasa, [!] si falla. Incluye el mapping completo unit→UT, component→CT, integration→IT, etc. La actualización es silenciosa si testcases.md no existe o no tiene la sección.
- [x] **Generar testcases en skill story-plan**: Modificar el comando story-plan para que, sume generar casos de prueba `testcases.md` por default, es decir que incluya llamada a skill story-testcases. Además debe aceptar un parámetro que indique si genera solo `tasks.md` (que actualmente lo genera por defecto), para no romper los flujos actuales que lo utilizan sin generar testcases, o solo `testcases.md` para los que no quieren trabajar orientados a tareas. Por default genera ambos.
- [x] **Renombrar skill story-refine a story-specify**: Actualizar la descripción para reflejar que ahora se enfoca en la especificación de historias.
- [x] **Integrar skill story-improve en story-specify**: Agregar invocación a skill story-improve en story-specify como parte del ciclo de especificación y refinamiento de la historia.
- [x] **Agregar documentación README**: agregar readme en skill-master, skill-test-evals, story-specify, story-plan.
- [x] **Agregar selección de root folder de skills al instalador**: Agregar en el script de instalación inicial de skills la posibilidad de elegir en qué directorio guardar los skills: .agents, .claude o .github, con un prompt de selección. Esto permitirá a los usuarios organizar sus skills según sus preferencias y necesidades, manteniendo una estructura clara y accesible. Se deben modificar los archivos: scripts/install.js y scripts/cli.js, mientras que el postinstall.js se mantiene sin cambios para asegurar compatibilidad con instalaciones globales y locales sin interacción. 
- [x] **Extender story-code-review con análisis de testcases.md e implement-report.md opcional**: Agregar al skill de quality gate `story-code-review` el análisis de los resultados de `/story-implement` y el archivo `testcases.md` para que sean tenidos en cuenta en el reporte final `code-review-report.md`. 
- [x] **Configurar story-verify según sddf.config.yaml**: El skill skills\story-verify debe leer el archivo de configuración `sddf.config.yaml` para determinar: el delivery-model configurado (`batch` | `continuous`) y comandos apara ejecutar las pruebas correspondiente. Antes de intentar ejecutar comandos genéricos de ejecución de pruebas (como ya lo hace). Si el delivery-model es `batch` debe ejecutar sanity test `e2e-regression` (si está marcado como requerido) además de las pruebas configuradas. Si el delivery-model es `continuous` debe ejecutar regression test `e2e-sanity` (si está marcado como requerido) además de las pruebas configuradas. Los comandos de ejecución de pruebas se configuran en la sección `verify` del archivo de configuración `sddf.config.yaml`. Los comandos de ejecución de pruebas pueden ser: unit | component | integration | contract | e2e | e2e-smoke|e2e-sanity | e2e-regression | e2e-file | performance | eval. Solo si no encuentra configuraciones en `sddf.config.yaml` intentarà deducir las pruebas existentes y comandos necesario a ejecutar pruebas (como lo hace actualmente).
