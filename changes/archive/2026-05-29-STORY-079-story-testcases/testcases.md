---
type: testcases
id: STORY-079
slug: STORY-079-story-testcases-testcases
title: "Test Cases: story-testcases — generación de testcases.md desde story.md y design.md"
story: STORY-079
created: 2026-05-30
updated: 2026-05-30
---

# Casos de Prueba: story-testcases — generación de testcases.md desde story.md y design.md

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 10 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 7 |
| EV   | 4 |
| **Total** | **24** |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Generación exitosa de testcases.md desde story.md y design.md | story.md y design.md válidos existen; entorno SDDF supera preflight (SPECS_BASE resuelto) | El usuario invoca `story-testcases` con el ID de la historia | Se genera testcases.md con tabla de columnas ID/Tipo/Escenario/Dado/Cuando/Entonces/Ref; IDs con prefijos correctos; cada caso trazable a AC o decisión técnica de design.md; tasks.md no es requerido | AC-1 |
| E2E-002 | End-to-End | tasks.md ausente no bloquea la generación | story.md y design.md existen en el directorio; tasks.md no existe | El usuario invoca `story-testcases` | testcases.md se genera correctamente usando solo story.md y design.md; no se emite error ni advertencia por la ausencia de tasks.md | AC-2 |
| E2E-003 | End-to-End | tasks.md presente enriquece la cobertura con referencias T-NNN | story.md, design.md y tasks.md existen; tasks.md incluye tareas con keywords "code" o "test" | El usuario invoca `story-testcases` | testcases.md usa story.md y design.md como fuentes primarias; casos adicionales derivados de tasks.md tienen Ref T-NNN en la columna Ref; la ausencia de tasks.md no cambia el comportamiento observable | AC-3 |
| E2E-004 | End-to-End | story.md sin criterios de aceptación no genera testcases.md parcial | story.md no contiene secciones de criterios de aceptación ni bloques Gherkin, o design.md está vacío | El usuario invoca `story-testcases` | El skill emite ⚠️ "story.md o design.md no tienen contenido suficiente para derivar casos de prueba"; no escribe testcases.md parcial; sugiere completar criterios de aceptación o diseño antes de continuar | AC-4 |
| E2E-005 | End-to-End | flag --force sobreescribe testcases.md sin pedir confirmación | testcases.md ya existe en el directorio de la historia | El usuario invoca `story-testcases --force` | El skill sobreescribe testcases.md directamente sin preguntar; emite `[INFO] testcases.md sobreescrito con --force`; el contenido generado es idéntico al de una generación sin --force | AC-11 |
| E2E-006 | End-to-End | Asignación del prefijo correcto según el tipo de criterio de prueba | story.md o design.md describe criterios de todos los tipos soportados: lógica interna, componente, integración, endpoint REST, flujo Gherkin, skill SDDF | story-testcases genera testcases.md | Cada caso tiene el prefijo correcto: validación de lógica→UT; componente UI→CT; integración→IT; endpoint REST→API; flujo Gherkin completo→E2E; skill SDDF→EV | AC-5 |
| E2E-007 | End-to-End | Derivación estructural con cobertura mínima por tipo de elemento en design.md | design.md describe elementos de tipos: método público, componente UI, integración entre componentes, endpoint REST, escenario Gherkin y skill SDDF | story-testcases procesa cada elemento aplicando la tabla de clasificación | Para cada tipo se genera la cobertura mínima: UT (happy+error), CT (render+edge), IT (flujo positivo), API (request válido+respuesta esperada), E2E (1-a-1 al Gherkin de origen), EV (happy-path+fail-fast) | AC-12 |
| UT-001 | Unit | Clasificación de tipo — método público de módulo genera UT con happy path y caso de error | design.md describe una función o método público de un servicio o módulo | El skill aplica la tabla de clasificación D-4 al elemento | Genera al menos 2 casos UT: uno de happy path y al menos uno de error o caso borde; ambos con Ref trazable al elemento de diseño | D-4 |
| UT-002 | Unit | Clasificación de tipo — escenario Gherkin completo genera exactamente un E2E trazable 1-a-1 | story.md contiene N bloques Gherkin completos con Dado/Cuando/Entonces | El skill aplica la tabla de clasificación D-4 a los escenarios de story.md | Genera exactamente N casos E2E, uno por escenario; cada caso tiene Ref al AC de origen; no genera más ni menos E2E que los escenarios presentes en story.md | D-4 |
| UT-003 | Unit | Clasificación de tipo — skill SDDF como sujeto genera EV con happy-path y fail-fast | design.md describe un skill SDDF como elemento a validar | El skill aplica la tabla de clasificación D-4 | Genera al menos 2 casos EV: uno de happy-path (skill genera output correcto) y uno de fail-fast (condición de error bloquea al skill); ambos trazables al elemento de diseño | D-4 |
| UT-004 | Unit | Idempotencia sin --force — pregunta confirmación antes de sobreescribir | testcases.md ya existe en el directorio; el skill se invoca sin el flag --force | El skill ejecuta la verificación de idempotencia (Paso 1d) | Muestra opciones "(r) Regenerar / (n) No modificar"; si el usuario elige (n) termina sin modificar el archivo; si elige (r) continúa con la regeneración | D-6 |
| UT-005 | Unit | Idempotencia con --force — sobreescribe directamente emitiendo [INFO] | testcases.md ya existe en el directorio; el skill se invoca con --force | El skill ejecuta la verificación de idempotencia (Paso 1d) | Sobreescribe testcases.md sin preguntar; emite `[INFO] testcases.md sobreescrito con --force`; no hay diferencia observable en el contenido respecto a una generación sin --force | D-6 |
| UT-006 | Unit | Precondición fail-fast — story.md sin ACs detiene sin generar testcases.md parcial | story.md no tiene secciones de criterios de aceptación ni bloques Gherkin | El skill intenta derivar casos en el Paso 5 | Emite ⚠️ "story.md o design.md no tienen contenido suficiente para derivar casos de prueba"; no escribe ningún testcases.md; detiene la ejecución limpiamente sin crash | D-8 |
| UT-007 | Unit | Precondición fail-fast — design.md vacío detiene sin generar testcases.md parcial | design.md existe pero está vacío o no contiene decisiones técnicas (sin secciones D-N ni elementos estructurales) | El skill lee design.md en el Paso 3 | Emite ⚠️ "story.md o design.md no tienen contenido suficiente"; no escribe testcases.md; detiene sin stack trace ni output parcial | D-8 |
| UT-008 | Unit | Enriquecimiento con tasks.md — tareas con keyword "implementar" generan UT adicionales con Ref T-NNN | tasks.md existe con al menos una tarea cuya descripción incluye keywords como "implementar", "crear función" o "validar lógica" | El skill lee tasks.md en el Paso 3b | Genera casos UT adicionales derivados de esas tareas; la columna Ref de esos casos contiene el T-NNN correspondiente a la tarea de origen | D-7 |
| UT-009 | Unit | Ausencia de tasks.md — el skill continúa sin emitir advertencia | tasks.md no existe en el directorio de la historia | El skill ejecuta el Paso 3b (lectura opcional de tasks.md) | El skill continúa la ejecución sin emitir ningún mensaje sobre la ausencia; el output de testcases.md es equivalente al que se generaría sin tasks.md | D-7 |
| UT-010 | Unit | Resolución del directorio de la historia por story_id mediante glob | Se proporciona story_id (ej. STORY-079) sin ruta explícita | El skill ejecuta la resolución de parámetros en el Paso 1b | El directorio se resuelve mediante glob `$SPECS_BASE/specs/stories/{story_id}-*/`; se usa la primera coincidencia; si no se encuentra ninguna, emite ❌ con sugerencia de `/release-generate-stories` | D-9, T014 |
| IT-001 | Integration | Integración con sddf-config.yaml — carga de referencias de la fase plan | sddf-config.yaml existe con `complementary_skills.plan.skills` configurado (type: reference, references_path apunta a directorio existente) | El skill ejecuta el Paso 0 (carga de config tras preflight) | Lee los archivos .md en references_path y los añade al contexto como guías antes de derivar los casos de prueba; si references_path no existe emite [WARN] y continúa con flujo genérico | D-5 |
| IT-002 | Integration | Integración con assets/testcases-template.md — lectura dinámica como fuente de verdad | assets/testcases-template.md existe en el directorio del skill activo | El skill ejecuta el Paso 4 (resolución del template) | Lee el template en tiempo de ejecución sin hardcodear la estructura del output; emite `✓ Template: <ruta> [local]`; si no existe busca en global y luego usa fallback interno | D-3 |
| IT-003 | Integration | Integración con skill-preflight — entorno inválido detiene la ejecución del skill | SDDF_ROOT apunta a ruta inexistente o preflight retorna `✗ Entorno inválido` | El skill invoca skill-preflight en el Paso 0 | La ejecución del skill se detiene inmediatamente; no se genera ningún archivo; el mensaje de error de preflight es visible para el usuario; no se ejecuta ningún paso posterior | D-8, T013 |
| EV-001 | Eval | Estructura de directorios del skill story-testcases — happy path con todos los artefactos presentes | El skill story-testcases ha sido creado en `.claude/skills/story-testcases/` | Se verifica la estructura del directorio del skill | Contiene: SKILL.md, assets/testcases-template.md, evals/evals.json, examples/input/ (con story.md y design.md de ejemplo) y examples/output/testcases.md de referencia | D-1 |
| EV-002 | Eval | Estructura de directorios del skill — fail-fast cuando SKILL.md está ausente | El directorio `.claude/skills/story-testcases/` existe pero SKILL.md no está presente | Se intenta invocar story-testcases | El skill no es invocable; el sistema reporta que SKILL.md está ausente; no se ejecuta ninguna lógica parcial | D-1 |
| EV-003 | Eval | Frontmatter YAML de SKILL.md contiene todos los campos requeridos según el estándar SDDF | SKILL.md de story-testcases existe con frontmatter YAML | Se valida el frontmatter del SKILL.md | El frontmatter contiene: name, description con triggers descriptivos, triggers (lista incluyendo "story-testcases", "testcases", "generar casos de prueba"), version: "1.0.0", type: delegate, input: "story.md, design.md", output: "testcases.md", invocable: true, alwaysApply: false | D-2 |
| EV-004 | Eval | skill-master aprueba la estructura y estándares SDDF del skill story-testcases sin errores bloqueantes | El skill story-testcases está creado completamente (SKILL.md, assets, evals con TC-001 a TC-005, examples de input/output) | Se ejecuta skill-master sobre el skill story-testcases | skill-master aprueba sin errores bloqueantes: estructura de directorios correcta, frontmatter válido, evals presentes con casos happy-path y fail-fast, examples de referencia coherentes con el SKILL.md | D-11 |

## Notas de cobertura

- **tasks.md presente y usado:** tasks.md existe en el directorio de STORY-079 con todas las tareas marcadas como `[x]`. Se usó como fuente secundaria para derivar UT-010 (T014: lógica de resolución de parámetros) e IT-003 (T013: integración con skill-preflight). Las tareas con keywords de integración (T013) y de implementación de pasos (T014) fueron los candidatos relevantes.
- **CT y API ausentes:** No se generaron casos CT ni API porque story-testcases es un skill Markdown (sin componentes UI) y no expone endpoints REST. El stack tecnológico del proyecto (Markdown + TypeScript/Node.js) no implica interfaz gráfica ni contratos de API en este skill.
- **Cobertura E2E completa:** Todos los bloques Gherkin de story.md tienen un caso E2E trazable 1-a-1. Las secciones de "Requerimiento" (AC-6 a AC-10) no generaron E2E adicionales; sus comportamientos están cubiertos por los casos UT/IT/EV correspondientes.
- **AC-6 (skill-preflight):** Cubierto por IT-003 (integración que detiene el skill ante entorno inválido).
- **AC-7 (skill-master):** Cubierto por EV-004 (skill-master valida estructura y estándares SDDF).
- **AC-8 (políticas y DoD):** Verificación transversal — se valida en EV-001 a EV-004 y en la revisión de código del skill.
- **AC-9 (formato de testcases.md):** Cubierto por E2E-001 (columnas correctas en el output) e IT-002 (template como fuente de verdad dinámica).
- **AC-10 (sddf-config.yaml):** Cubierto por IT-001 (carga de referencias de la fase plan desde config).
- **Template usado:** fallback interno del skill (no se encontró template en `assets/testcases-template.md` ni en `docs/specs/templates/testcases-template.md`).
