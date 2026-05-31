---
alwaysApply: false
type: story
id: FEAT-079
slug: FEAT-079-story-testcases
title: "story-testcases — generación de testcases.md desde story.md y design.md"
status: COMPLETED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-29
updated: 2026-05-29
related:
  - EPIC-14-fabrica-de-skills
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: story-testcases — generación de testcases.md desde story.md y design.md

**Como** practitioner de SDDF que tiene una historia (story.md) y un diseño técnico (design.md) aprobados y quiere especificar las pruebas antes de implementar sin depender de tasks.md,  
**Quiero** invocar el skill `story-testcases` para generar `testcases.md` con una tabla de casos de prueba tipificados (UT-*, IT-*, API-*, E2E-*) derivada de story.md y design.md y usando las referencias de un skill complementario configurado en el archivo de configuración, 
**Para** obtener un artefacto de pruebas único, parseable y trazable a los criterios de aceptación, que los skills de testing usen como fuente de verdad para generar y ejecutar pruebas mediante delegación automática por tipo

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de testcases.md desde story.md y design.md
```gherkin
Dado que existen story.md y design.md válidos en el directorio de la historia
  Y el entorno SDDF supera el preflight (SPECS_BASE resuelto)
Cuando el usuario invoca `story-testcases` con el ID de la historia
Entonces se genera testcases.md en el directorio de la historia
  Y testcases.md contiene una tabla con columnas: ID, Tipo, Escenario, Dado, Cuando, Entonces, Ref
  Y cada ID tiene un prefijo que define el tipo de prueba: UT-NNN, IT-NNN, API-NNN o E2E-NNN
  Y cada caso de prueba es trazable a un criterio de aceptación de story.md o a una decisión técnica de design.md
  Y tasks.md no es requerido para la generación
```

### Escenario alternativo – tasks.md ausente (no bloquea la generación)
```gherkin
Dado que existen story.md y design.md en el directorio de la historia
  Pero tasks.md no existe
Cuando el usuario invoca `story-testcases`
Entonces `story-testcases` genera testcases.md correctamente usando solo story.md y design.md
  Y no emite error ni advertencia por la ausencia de tasks.md
```

### Escenario alternativo – tasks.md presente (enriquece la cobertura)
```gherkin
Dado que existen story.md, design.md Y tasks.md en el directorio de la historia
Cuando el usuario invoca `story-testcases`
Entonces `story-testcases` genera testcases.md usando story.md y design.md como fuentes primarias
  Y usa tasks.md para afinar la cobertura: tareas con tipo "code" o "test" pueden derivar casos UT o IT adicionales
  Y los casos derivados de tasks.md son marcados con Ref "T-NNN" en la columna Ref de testcases.md
  Y la ausencia de tasks.md no cambia el comportamiento ni emite advertencia
```

### Escenario alternativo – story.md sin criterios de aceptación suficientes
```gherkin
Dado que story.md no contiene criterios de aceptación (no hay secciones de escenarios)
  O design.md está vacío
Cuando el usuario invoca `story-testcases`
Entonces el skill emite ⚠️ "story.md o design.md no tienen contenido suficiente para derivar casos de prueba"
  Y no genera testcases.md parcial
  Y sugiere completar los criterios de aceptación o el diseño antes de continuar
```

### Escenario con datos – Tipos de casos de prueba soportados
```gherkin
Escenario: `story-testcases` asigna el prefijo correcto según el tipo de criterio
  Dado que story.md o design.md describe un criterio del tipo "<tipo-criterio>"
  Cuando `story-testcases` genera testcases.md
  Entonces el caso de prueba correspondiente tiene el prefijo "<prefijo>"
Ejemplos:
  | tipo-criterio                    | prefijo | tipo |
  | validación de lógica interna     | UT      | Unit |
  | validación de componentes        | CT      | Component |
  | integración entre componentes    | IT      | Integration |
  | contrato de endpoint REST        | API     | API |
  | flujo completo de usuario (UI)   | E2E     | End-to-End |
  | evalua skill (skill test)        | EV      | Eval |
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-preflight

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## Requerimiento: Políticas de proyecto y Definition of Done
El skill debe adherirse a las políticas de proyecto definidas en `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md`. Estas políticas establecen los principios técnicos, estándares de calidad y criterios de aceptación que guían el proceso de diseño e implementación. El skill debe generar código que cumpla con estos estándares y criterios, asegurando que la implementación no solo funcione, sino que también sea mantenible, escalable y alineada con las mejores prácticas del proyecto. Cualquier desviación de estas políticas debe ser documentada en el reporte final generado por el skill al concluir la implementación. Las políticas de proyecto y la Definition of Done son fundamentales para garantizar que el código generado por el skill cumpla con los requisitos de calidad y las expectativas del proyecto, proporcionando un marco claro para la implementación autónoma asistida por IA.

### Requerimiento: formato de testcases.md

testcases.md es la fuente de verdad única para la especificación de pruebas. Su formato es una tabla Markdown con las siguientes columnas:

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Descripción en lenguaje natural | Precondición | Acción | Resultado esperado | AC-1 |
| E2E-001 | E2E | Descripción en lenguaje natural | Precondición | Acción | Resultado esperado | AC-2 |

**Reglas de IDs:**
- `UT-NNN`: prueba unitaria (lógica interna, funciones, módulos)
- `CT-NNN`: prueba de componente (comportamiento de un componente aislado)
- `IT-NNN`: prueba de integración (comunicación entre componentes o servicios)
- `API-NNN`: prueba de contrato de API (endpoints, request/response)
- `E2E-NNN`: prueba de flujo completo de usuario (UI, workflows end-to-end)
- `EV-NNN`: prueba de evaluación de skill (validación de un skill específico, no necesariamente técnica)
- `ST-NNN`: prueba de store/estado global (Redux, Zustand, Pinia, etc.) — solo si el proyecto incluye capa de store
- Los números son secuenciales dentro de cada prefijo, empezando en 001
- La columna `Tipo` es redundante con el prefijo del ID pero se incluye para facilitar la lectura humana y el routing automático por tipo
- La columna `Ref` vincula cada caso al criterio de aceptación de story.md (`AC-N`) o a la sección de design.md (`D-N`, `sección X.Y`) de la que se deriva

**Lenguaje:** los escenarios se escriben en lenguaje natural estructurado — no se fuerza sintaxis Gherkin estricta; el equipo puede escribir Dado/Cuando/Entonces en prosa si lo prefiere.

### Requerimiento: referencias usadas por story-testcases

story-testcases lee testcases.md y lee las referencias de conocimiento para contexto y para la generación de pruebas al skill configurado para la fase plan. La configuración vive en sddf-config.yaml bajo `plan.skills`:

```yaml
  plan:
    skills:
      - name: design-skill-architecture
        type: reference
        references_path: ".claude/skills/skill-master/references"
        description: "Guías de buenas prácticas para diseñar skills SDDF"
        required: false
```

Si un prefijo no tiene skill configurado:
1. Emitir `[WARN] Sin skill configurado para prefijo {PREFIX} — generando tests directamente`
2. Generar los tests internamente sin delegar (comportamiento degradado, no error fatal)

Después de que todos los skills de test generaron sus pruebas:
- Ejecutar ciclo RED → GREEN → REFACTOR
- Delegar la escritura del código de producción a story-testcases según los fallos (retroalimentación estructurada por tipo de test)

### Escenario alternativo – flag --force (sobreescribe sin confirmación)
```gherkin
Dado que testcases.md ya existe en el directorio de la historia
Cuando el usuario invoca `story-testcases --force`
Entonces el skill sobreescribe testcases.md sin pedir confirmación
  Y emite [INFO] "testcases.md sobreescrito con --force"
  Y no hay diferencia en el contenido generado respecto a una generación sin --force
```

### Escenario con datos – Derivación estructural desde design.md y story.md
```gherkin
Escenario: `story-testcases` aplica reglas estructurales para derivar el tipo de caso
  Dado que design.md describe un elemento estructural del tipo "<elemento>"
  Cuando `story-testcases` procesa ese elemento
  Entonces genera al menos un caso de prueba con prefijo "<prefijo>" y cubre "<cobertura-mínima>"
Ejemplos:
  | elemento                                      | prefijo | cobertura-mínima                                   |
  | método público de servicio/módulo             | UT      | happy path + al menos un caso de error             |
  | componente UI (props, eventos, renderizado)   | CT      | renderizado correcto + un caso de prop/evento edge |
  | interacción entre dos componentes             | IT      | flujo positivo de integración                      |
  | endpoint REST (ruta + verbo HTTP)             | API     | request válido + respuesta esperada                |
  | escenario Gherkin en story.md                 | E2E     | trazable 1-a-1 al escenario de origen              |
  | skill SDDF como sujeto de validación          | EV      | happy-path del skill + caso fail-fast              |
  | store/gestor de estado (si aplica al proyecto)| ST      | mutación correcta + estado inicial                 |
```

## ⚙️ Criterios no funcionales

* **Rendimiento:** story-testcases completa la generación de testcases.md en menos de 15 segundos para una story.md estándar (≤ 5 criterios de aceptación)
* **Trazabilidad:** cada caso en testcases.md referencia explícitamente el ID del criterio de aceptación en story.md o la sección de design.md de la que se deriva
* **Idempotencia:** si testcases.md ya existe, el skill pregunta antes de sobreescribir; no sobreescribe silenciosamente. Con `--force` la confirmación se omite y el archivo se sobreescribe directamente (útil para CI o invocación desde `sdd-run`)
* **Agnóstico al framework:** testcases.md no contiene código de test ni imports — es solo la especificación; los skills de testing son quienes producen el código
* **Lenguaje flexible:** los escenarios en testcases.md pueden estar en español o inglés y en prosa libre o Gherkin estructurado — story-testcases no valida sintaxis estricta de BDD

## 📎 Notas / contexto adicional

- **Posición en el pipeline:** story-testcases se invoca en la fase PLAN **después de story-tasking** (no inmediatamente después de story-design). El orden completo es: `story-design → story-tasking → story-testcases → story-analyze → story-implement`. Esto garantiza que tasks.md ya esté disponible para el afinamiento opcional de cobertura (D-7) y que story-analyze pueda validar la coherencia de los cuatro artefactos en un solo paso.
- **Relación con FEAT-078:** design-skill-architecture genera design.md con la arquitectura del skill; story-testcases lo lee para derivar los casos de prueba técnicos (UT, IT) a partir de las decisiones de diseño.


