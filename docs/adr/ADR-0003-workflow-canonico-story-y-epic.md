---
type: adr
id: ADR-0003
slug: workflow-canonico-story-y-epic
title: "Workflows canónicos de Story y Epic en el pipeline SDDF"
status: ACCEPTED
date: 2026-06-14
supersedes: null
superseded-by: null
---

# ADR-0003: Workflows canónicos de Story y Epic en el pipeline SDDF

## Contexto y problema

El framework SDDF opera con tres niveles. Ademàs del nivel de proyecto, existen dos niveles de work items: **historias** (granularidad de implementación) y **épicas** (contenedores de historias). Hasta EPIC-17 ambos niveles carecían de workflows
explícitamente definidos y versionados como decisión de arquitectura:

- El workflow de story usaba INTEGRATION como penúltimo estado, un término que mezcla el concepto
  técnico de "integrar ramas" con el ágil de "entregar valor", generando ambigüedad para los
  modelos batch (incremento potencialmente entregable) y continuous (ya desplegado).
- El workflow de épica estaba documentado con solo 2 estados (`DEFINITION → RELEASED`) en
  `state-machine.md`, pero los archivos reales usaban valores heterogéneos (`IMPLEMENT`,
  `COMPLETED`, `RELEASED`, `DEFINITION`) sin una máquina de estados formal.

Ambos problemas generaban inconsistencias en los skills que leen o escriben el campo `status`
de los artefactos spec.

## Decisión

Se adoptan los siguientes workflows canónicos para el campo `status` del frontmatter YAML:

**Story:**
```
SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED
```

**Epic/Release:**
```
DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED
```

El estado `COMPLETED` es compartido (terminal pasivo) en ambos niveles.

## Rationale

### Story workflow — sustitución de INTEGRATION por DELIVER

- **SPECIFY** se define el comportamiento de la historia: se escribe en formato Como / Quiero / Para, se detallan criterios de aceptación con escenarios Gherkin (Given‑When‑Then). Es la fase de especificación funcional, sin decisiones técnicas de implementación.
- **PLAN** se planifica la ejecución: se desglosan las tareas necesarias, se asignan a releases, se estima esfuerzo y se identifican dependencias. Se diseña la solución técnica: se crean design.md (arquitectura, APIs, componentes), tasks.md (desglose de tareas) y opcionalmente testcases.md (casos de prueba). Se definen las herramientas y el enfoque (TDD/BDD).
- **READY-FOR-IMPLEMENT** estado buffer. La historia está completamente planificada, priorizada y aprobada. Espera a que el equipo tenga capacidad para comenzar la implementación de sus tareas. Se aplican límites de WIP para controlar el flujo.
- **IMPLEMENT** se codifica (implementa) la historia siguiendo el ciclo TDD/BDD (Rojo‑Verde‑Refactor). Se escriben pruebas unitarias, de integración o E2E, y el código de producción necesario para que todas las pruebas pasen.
- **CODE‑REVIEW** se revisa el código implementado por ia, humano y/o otros miembros del equipo para garantizar calidad, consistencia y cumplimiento de estándares.
- **VERIFY** se ejecutan las pruebas automatizadas en un entorno controlado (unitarias, integración, E2E, regresión). Se generan informes y se identifican defectos. Si todo pasa, la historia es técnicamente correcta.
- **ACCEPTANCE** se valida la historia contra los criterios de aceptación definidos en SPECIFY. Un humano (product owner, QA, stakeholder) revisa los resultados de VERIFY y decide si la historia cumple con los requisitos funcionales y de valor. Si es aceptada, se marca como lista para entrega.
- **DELIVER** es semánticamente neutro respecto al modelo de entrega: abarca tanto el incremento
  potencialmente entregable (Scrum clásico: listo para producción, pendiente de ventana de
  despliegue) como el incremento ya desplegado (continuous delivery).
- Satisface el principio constitucional 1 ("repositorio como sistema"): el nombre del estado
  describe el valor entregado, no el mecanismo técnico de integración de ramas.
- Los estados intermedios (`CODE-REVIEW`, `VERIFY`, `ACCEPTANCE`) materializan los quality gates
  de la Definition of Done, garantizando trazabilidad entre estado y artefacto generado.
- **COMPLETED** como estado terminal pasivo permite medir tiempos de ciclo sin reabrir artefactos ya cerrados. Similar a Done o Closed en otros sistemas, pero con un nombre que enfatiza el cierre administrativo y la ausencia de trabajo pendiente.

### Epic workflow — formalización de 7 estados

- **DEFINE** reemplaza DEFINITION: el verbo en infinitivo es consistente con el patrón del
  workflow de story (SPECIFY, IMPLEMENT, VERIFY...) y con el de epic (DEVELOP, VALIDATE, SHIP). Se define el alcance de la épica: objetivos de alto nivel, features que la componen, criterios de éxito y valor esperado. Se documenta en un epic.md o en el sistema de gestión de trabajo.
- **PLAN** Se planifica la ejecución: se desglosan las historias de usuario necesarias, se asignan a releases, se estima esfuerzo y se identifican dependencias. Se crea o actualiza el plan de entregas.
- **READY-FOR-DEV** estado buffer. La épica está completamente planificada, priorizada y aprobada. Espera a que el equipo tenga capacidad para comenzar el desarrollo de sus historias. Se aplican límites de WIP para controlar el flujo.
- **DEVELOP** abarca todo el ciclo de historias internas; la épica permanece aquí hasta que
  todas sus historias alcancen DELIVER — cohesion entre los dos niveles. El trabajo de desarrollo está en curso: se están implementando las historias de la épica.
- **VALIDATE** separa el testing de integracion de la épica (end-to-end, UAT, NFRs) del
  testing por historia, respetando la separacion de intereses. Se ejecutan pruebas de integración y regresión del conjunto completo de la épica (cuando todas las historias están entregadas). Se validan los criterios de éxito, se realizan pruebas end‑to‑end, UAT y se verifican los requisitos no funcionales.
- **SHIP** nombra el acto de publicar/desplegar el artefacto, distinguiéndolo de COMPLETED
  (cierre administrativo). Satisface KISS (principio 4): un estado = una responsabilidad. La épica se libera, se publica el artefacto (npm, Docker, etc.), se despliega a producción o se marca como disponible para los usuarios finales. Es el último estado activo del flujo.
- **COMPLETED** como estado terminal pasivo en ambos niveles permite medir tiempos de ciclo
  sin reabrir artefactos ya cerrados. Similar a Done o Closed en otros sistemas, pero con un nombre que enfatiza el cierre administrativo y la ausencia de trabajo pendiente. La épica se cierra administrativamente. No quedan acciones pendientes ni responsabilidades activas sobre la épica.

## Justificación del uso de verbos (infinitivo) en los nombres de estado

Elegimos verbos en infinitivo — SPECIFY, PLAN, IMPLEMENT, VERIFY, DELIVER — porque cada estado representa una acción que el equipo debe realizar para avanzar el trabajo, no un concepto estático. Los verbos transmiten claramente que hay una actividad pendiente o en curso, lo cual es más fiel a la naturaleza de un flujo de trabajo (por ejemplo, "estamos en fase de especificar", no "estamos en la especificación").
En resumen, verbos > sustantivos porque los estados son hitos de ejecución, no objetos estáticos. La simplicidad y la orientación a la acción son las razones fundamentales.

## Alternativas consideradas

**Story:**
- **Mantener INTEGRATION:** descartado — ambigüedad documentada; el término era leído como
  "merge a main" o como "despliegue a producción" indistintamente segun el contexto.
- **Usar RELEASE como penúltimo estado:** descartado — colisionaría semánticamente con el
  nivel RELEASE/Epic del framework.
- **Usar DONE directamente (sin DELIVER):** descartado — DONE es un substatus (nivel de avance
  dentro de un estado), no un estado. Mezclar los dos ejes viola el patrón constitución §14.

**Epic:**
- **Mantener DEFINITION → RELEASED (2 estados):** descartado — insuficiente para modelar el
  ciclo real; planificacion, espera de capacidad, desarrollo de historias, validacion de conjunto
  y publicacion son fases distintas con actores y artefactos propios.
- **Copiar el workflow de story para épicas:** descartado — una épica no tiene CODE-REVIEW ni
  ACCEPTANCE propios; sus historias los tienen. Reusar el mismo vocabulario causaría confusion.
- **Un único estado DEVELOP que englobe plan + dev + validate:** descartado — violacion de
  KISS; cada fase tiene substatus distintos y actores distintos.

## Consecuencias

**Positivas:**
- El campo `status` de cualquier artefacto spec tiene un conjunto acotado y semánticamente
  inequívoco de valores válidos por nivel (story / epic).
- Los skills que escriben `status` tienen un contrato claro: `release-creation` usa `DEFINE`,
  `story-acceptance` transiciona a `ACCEPTANCE/DONE` antes de que el humano marque `DELIVER`.
- La documentacion canónica (`state-machine.md`) refleja con exactitud el comportamiento real.
- DELIVER desambigua el modelo de entrega para equipos que usan batch o continuous delivery.

**Negativas / trade-offs:**
- Los artefactos `release.md` históricos en `docs/specs/releases/EPIC-*/` quedan con valores
  del esquema antiguo (`DEFINITION`, `RELEASED`, `IMPLEMENT`). No se migran retroactivamente
  — son artefactos cerrados y la inconsistencia es aceptable.
- `PLAN` aparece en ambos workflows con significados distintos (en story: generar design/tasks;
  en epic: desglosar historias y planificar entregas). El contexto del tipo de artefacto
  (`type: story` vs `type: release`) resuelve la ambigüedad en el frontmatter.

## Referencias

- [[state-machine]] — máquina de estados canónica con diagramas Mermaid por nivel
- [[specs-and-workflows]] — descripcion narrativa de estados y subprocesos
- [[constitution]] — principios 1, 4, 14; regla 9
- `docs/policies/definition-of-done-story.md` — DoD alineada al workflow de story
- EPIC-17 hallazgo A1 — motivacion del renombrado INTEGRATION → DELIVER
- EPIC-18 `plan-01-deliver-status.md` — registro del cambio aplicado
