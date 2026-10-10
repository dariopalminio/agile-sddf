---
alwaysApply: false
type: story
id: STORY-079
kind: feat
slug: STORY-079-story-testcases
title: "story-testcases â€” generaciÃ³n de testcases.md desde story.md y design.md"
status: COMPLETED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-29
updated: 2026-05-29
related:
  - EPIC-14-fabrica-de-skills
---
[[fabrica-de-skills]]

# ðŸ“– Historia: story-testcases â€” generaciÃ³n de testcases.md desde story.md y design.md

**Como** practitioner de SDDF que tiene una historia (story.md) y un diseÃ±o tÃ©cnico (design.md) aprobados y quiere especificar las pruebas antes de implementar sin depender de tasks.md,  
**Quiero** invocar el skill `story-testcases` para generar `testcases.md` con una tabla de casos de prueba tipificados (UT-*, IT-*, API-*, E2E-*) derivada de story.md y design.md y usando las referencias de un skill complementario configurado en el archivo de configuraciÃ³n, 
**Para** obtener un artefacto de pruebas Ãºnico, parseable y trazable a los criterios de aceptaciÃ³n, que los skills de testing usen como fuente de verdad para generar y ejecutar pruebas mediante delegaciÃ³n automÃ¡tica por tipo

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GeneraciÃ³n exitosa de testcases.md desde story.md y design.md
```gherkin
Dado que existen story.md y design.md vÃ¡lidos en el directorio de la historia
  Y el entorno SDDF supera el preflight (SPECS_BASE resuelto)
Cuando el usuario invoca `story-testcases` con el ID de la historia
Entonces se genera testcases.md en el directorio de la historia
  Y testcases.md contiene una tabla con columnas: ID, Tipo, Escenario, Dado, Cuando, Entonces, Ref
  Y cada ID tiene un prefijo que define el tipo de prueba: UT-NNN, IT-NNN, API-NNN o E2E-NNN
  Y cada caso de prueba es trazable a un criterio de aceptaciÃ³n de story.md o a una decisiÃ³n tÃ©cnica de design.md
  Y tasks.md no es requerido para la generaciÃ³n
```

### Escenario alternativo â€“ tasks.md ausente (no bloquea la generaciÃ³n)
```gherkin
Dado que existen story.md y design.md en el directorio de la historia
  Pero tasks.md no existe
Cuando el usuario invoca `story-testcases`
Entonces `story-testcases` genera testcases.md correctamente usando solo story.md y design.md
  Y no emite error ni advertencia por la ausencia de tasks.md
```

### Escenario alternativo â€“ tasks.md presente (enriquece la cobertura)
```gherkin
Dado que existen story.md, design.md Y tasks.md en el directorio de la historia
Cuando el usuario invoca `story-testcases`
Entonces `story-testcases` genera testcases.md usando story.md y design.md como fuentes primarias
  Y usa tasks.md para afinar la cobertura: tareas con tipo "code" o "test" pueden derivar casos UT o IT adicionales
  Y los casos derivados de tasks.md son marcados con Ref "T-NNN" en la columna Ref de testcases.md
  Y la ausencia de tasks.md no cambia el comportamiento ni emite advertencia
```

### Escenario alternativo â€“ story.md sin criterios de aceptaciÃ³n suficientes
```gherkin
Dado que story.md no contiene criterios de aceptaciÃ³n (no hay secciones de escenarios)
  O design.md estÃ¡ vacÃ­o
Cuando el usuario invoca `story-testcases`
Entonces el skill emite âš ï¸ "story.md o design.md no tienen contenido suficiente para derivar casos de prueba"
  Y no genera testcases.md parcial
  Y sugiere completar los criterios de aceptaciÃ³n o el diseÃ±o antes de continuar
```

### Escenario con datos â€“ Tipos de casos de prueba soportados
```gherkin
Escenario: `story-testcases` asigna el prefijo correcto segÃºn el tipo de criterio
  Dado que story.md o design.md describe un criterio del tipo "<tipo-criterio>"
  Cuando `story-testcases` genera testcases.md
  Entonces el caso de prueba correspondiente tiene el prefijo "<prefijo>"
Ejemplos:
  | tipo-criterio                    | prefijo | tipo |
  | validaciÃ³n de lÃ³gica interna     | UT      | Unit |
  | validaciÃ³n de componentes        | CT      | Component |
  | integraciÃ³n entre componentes    | IT      | Integration |
  | contrato de endpoint REST        | API     | API |
  | flujo completo de usuario (UI)   | E2E     | End-to-End |
  | evalua skill (skill test)        | EV      | Eval |
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-preflight

### Paso 0 â€” Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operaciÃ³n.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estÃ¡ndar.

Si retorna `âœ— Entorno invÃ¡lido`, detener la ejecuciÃ³n inmediatamente. No generar ningÃºn archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

## Requerimiento: checklist de progreso en testcases.md
El archivo testcases.md debe incluir una secciÃ³n de progreso con checkboxes. Cada caso de prueba listado en la tabla debe tener un checkbox asociado que indique su estado:
- [ ] Pendiente: el caso de prueba ha sido generado pero no implementado ni ejecutado.
- [x] Completado: el caso de prueba ha sido implementado y ha pasado exitosamente.
- [!] Fallido: el caso de prueba ha sido implementado pero ha fallado en su ejecuciÃ³n.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## Requerimiento: PolÃ­ticas de proyecto y Definition of Done
El skill debe adherirse a las polÃ­ticas de proyecto definidas en `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/dod-story.md`. Estas polÃ­ticas establecen los principios tÃ©cnicos, estÃ¡ndares de calidad y criterios de aceptaciÃ³n que guÃ­an el proceso de diseÃ±o e implementaciÃ³n. El skill debe generar cÃ³digo que cumpla con estos estÃ¡ndares y criterios, asegurando que la implementaciÃ³n no solo funcione, sino que tambiÃ©n sea mantenible, escalable y alineada con las mejores prÃ¡cticas del proyecto. Cualquier desviaciÃ³n de estas polÃ­ticas debe ser documentada en el reporte final generado por el skill al concluir la implementaciÃ³n. Las polÃ­ticas de proyecto y la Definition of Done son fundamentales para garantizar que el cÃ³digo generado por el skill cumpla con los requisitos de calidad y las expectativas del proyecto, proporcionando un marco claro para la implementaciÃ³n autÃ³noma asistida por IA.

### Requerimiento: formato de testcases.md

testcases.md es la fuente de verdad Ãºnica para la especificaciÃ³n de pruebas. Su formato es una tabla Markdown con las siguientes columnas:

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | DescripciÃ³n en lenguaje natural | PrecondiciÃ³n | AcciÃ³n | Resultado esperado | AC-1 |
| E2E-001 | E2E | DescripciÃ³n en lenguaje natural | PrecondiciÃ³n | AcciÃ³n | Resultado esperado | AC-2 |

**Reglas de IDs:**
- `UT-NNN`: prueba unitaria (lÃ³gica interna, funciones, mÃ³dulos)
- `CT-NNN`: prueba de componente (comportamiento de un componente aislado)
- `IT-NNN`: prueba de integraciÃ³n (comunicaciÃ³n entre componentes o servicios)
- `API-NNN`: prueba de contrato de API (endpoints, request/response)
- `E2E-NNN`: prueba de flujo completo de usuario (UI, workflows end-to-end)
- `EV-NNN`: prueba de evaluaciÃ³n de skill (validaciÃ³n de un skill especÃ­fico, no necesariamente tÃ©cnica)
- `ST-NNN`: prueba de store/estado global (Redux, Zustand, Pinia, etc.) â€” solo si el proyecto incluye capa de store
- Los nÃºmeros son secuenciales dentro de cada prefijo, empezando en 001
- La columna `Tipo` es redundante con el prefijo del ID pero se incluye para facilitar la lectura humana y el routing automÃ¡tico por tipo
- La columna `Ref` vincula cada caso al criterio de aceptaciÃ³n de story.md (`AC-N`) o a la secciÃ³n de design.md (`D-N`, `secciÃ³n X.Y`) de la que se deriva

**Lenguaje:** los escenarios se escriben en lenguaje natural estructurado â€” no se fuerza sintaxis Gherkin estricta; el equipo puede escribir Dado/Cuando/Entonces en prosa si lo prefiere.

### Requerimiento: referencias usadas por story-testcases

story-testcases lee testcases.md y lee las referencias de conocimiento para contexto y para la generaciÃ³n de pruebas al skill configurado para la fase plan. La configuraciÃ³n vive en sddf-config.yaml bajo `plan.skills`:

```yaml
  plan:
    skills:
      - name: design-skill-architecture
        type: reference
        references_path: ".claude/skills/skill-master/references"
        description: "GuÃ­as de buenas prÃ¡cticas para diseÃ±ar skills SDDF"
        required: false
```

Si un prefijo no tiene skill configurado:
1. Emitir `[WARN] Sin skill configurado para prefijo {PREFIX} â€” generando tests directamente`
2. Generar los tests internamente sin delegar (comportamiento degradado, no error fatal)

DespuÃ©s de que todos los skills de test generaron sus pruebas:
- Ejecutar ciclo RED â†’ GREEN â†’ REFACTOR
- Delegar la escritura del cÃ³digo de producciÃ³n a story-testcases segÃºn los fallos (retroalimentaciÃ³n estructurada por tipo de test)

### Escenario alternativo â€“ flag --force (sobreescribe sin confirmaciÃ³n)
```gherkin
Dado que testcases.md ya existe en el directorio de la historia
Cuando el usuario invoca `story-testcases --force`
Entonces el skill sobreescribe testcases.md sin pedir confirmaciÃ³n
  Y emite [INFO] "testcases.md sobreescrito con --force"
  Y no hay diferencia en el contenido generado respecto a una generaciÃ³n sin --force
```

### Escenario con datos â€“ DerivaciÃ³n estructural desde design.md y story.md
```gherkin
Escenario: `story-testcases` aplica reglas estructurales para derivar el tipo de caso
  Dado que design.md describe un elemento estructural del tipo "<elemento>"
  Cuando `story-testcases` procesa ese elemento
  Entonces genera al menos un caso de prueba con prefijo "<prefijo>" y cubre "<cobertura-mÃ­nima>"
Ejemplos:
  | elemento                                      | prefijo | cobertura-mÃ­nima                                   |
  | mÃ©todo pÃºblico de servicio/mÃ³dulo             | UT      | happy path + al menos un caso de error             |
  | componente UI (props, eventos, renderizado)   | CT      | renderizado correcto + un caso de prop/evento edge |
  | interacciÃ³n entre dos componentes             | IT      | flujo positivo de integraciÃ³n                      |
  | endpoint REST (ruta + verbo HTTP)             | API     | request vÃ¡lido + respuesta esperada                |
  | escenario Gherkin en story.md                 | E2E     | trazable 1-a-1 al escenario de origen              |
  | skill SDDF como sujeto de validaciÃ³n          | EV      | happy-path del skill + caso fail-fast              |
  | store/gestor de estado (si aplica al proyecto)| ST      | mutaciÃ³n correcta + estado inicial                 |
```

## âš™ï¸ Criterios no funcionales

* **Rendimiento:** story-testcases completa la generaciÃ³n de testcases.md en menos de 15 segundos para una story.md estÃ¡ndar (â‰¤ 5 criterios de aceptaciÃ³n)
* **Trazabilidad:** cada caso en testcases.md referencia explÃ­citamente el ID del criterio de aceptaciÃ³n en story.md o la secciÃ³n de design.md de la que se deriva
* **Idempotencia:** si testcases.md ya existe, el skill pregunta antes de sobreescribir; no sobreescribe silenciosamente. Con `--force` la confirmaciÃ³n se omite y el archivo se sobreescribe directamente (Ãºtil para CI o invocaciÃ³n desde `sdd-run`)
* **AgnÃ³stico al framework:** testcases.md no contiene cÃ³digo de test ni imports â€” es solo la especificaciÃ³n; los skills de testing son quienes producen el cÃ³digo
* **Lenguaje flexible:** los escenarios en testcases.md pueden estar en espaÃ±ol o inglÃ©s y en prosa libre o Gherkin estructurado â€” story-testcases no valida sintaxis estricta de BDD

## ðŸ“Ž Notas / contexto adicional

- **PosiciÃ³n en el pipeline:** story-testcases se invoca en la fase PLAN **despuÃ©s de story-tasking** (no inmediatamente despuÃ©s de story-design). El orden completo es: `story-design â†’ story-tasking â†’ story-testcases â†’ story-analyze â†’ story-implement`. Esto garantiza que tasks.md ya estÃ© disponible para el afinamiento opcional de cobertura (D-7) y que story-analyze pueda validar la coherencia de los cuatro artefactos en un solo paso.
- **RelaciÃ³n con STORY-078:** design-skill-architecture genera design.md con la arquitectura del skill; story-testcases lo lee para derivar los casos de prueba tÃ©cnicos (UT, IT) a partir de las decisiones de diseÃ±o.


