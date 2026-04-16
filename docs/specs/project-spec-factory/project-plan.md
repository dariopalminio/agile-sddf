**Nombre del Sistema**: ProjectSpecFactory
**Título del Documento**: Project Plan
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-04
**Generado por**: architect-agent

---

## Objetivo

Construir un sistema multiagente minimalista que convierta la intención inicial de un proyecto software en un backlog planificado por releases, mediante un workflow secuencial y revisión humana en cada etapa, sin dependencias externas al ecosistema de Claude Code.

---

## Backlog de Features

- [ ] **FEAT-001: Extracción dinámica de templates** — El agente extrae en runtime los headers `##` y comentarios `<!-- -->` de cada template para derivar secciones y preguntas sin lógica hardcodeada. _(deps: —)_
- [ ] **FEAT-002: Estructura autónoma de skills** — Cada skill es autónomo con su `SKILL.md` y subdirectorio `templates/`, permitiendo identificar el template de cada fase sin documentación adicional. _(deps: —)_
- [ ] **FEAT-003: Generación de project-intent.md** — El agente `product-manager-agent` conduce la fase `begin-intention` y genera `docs/specs/project/project-intent.md` con todas las secciones del template completadas. _(deps: FEAT-001, FEAT-002)_
- [ ] **FEAT-004: Generación de requirement-spec.md** — El agente `architect-agent` conduce la fase `ps-discovery` y genera `docs/specs/project/requirement-spec.md` a partir del project-intent y la entrevista de especificación. _(deps: FEAT-001, FEAT-002, FEAT-003)_
- [ ] **FEAT-005: Generación de project-plan.md** — El agente `architect-agent` conduce la fase `ps-planning` y genera `docs/specs/project/project-plan.md` con backlog priorizado y releases incrementales. _(deps: FEAT-001, FEAT-002, FEAT-004)_
- [ ] **FEAT-006: Metadatos de trazabilidad** — Cada documento generado incluye nombre del sistema, versión, estado (`Doing`), fecha de generación y agente generador, actualizables al transicionar a `Ready`. _(deps: FEAT-003, FEAT-004, FEAT-005)_
- [ ] **FEAT-007: Detección automática de estado de fase** — El sistema lee el campo `Estado` del documento de cada fase para determinar si está pendiente, en progreso o completa, sin configuración manual del usuario. _(deps: FEAT-006)_
- [ ] **FEAT-008: Retoma de proyecto en curso** — El usuario puede retomar cualquier fase ejecutando su comando; el agente lee los documentos existentes y continúa desde el estado detectado. _(deps: FEAT-007)_
- [ ] **FEAT-009: Entrevista con pre-relleno desde contexto** — El agente pre-rellena cada sección del documento de output con información ya capturada en fases anteriores, evitando preguntar al usuario datos ya disponibles. _(deps: FEAT-004)_
- [ ] **FEAT-010: Agrupación de preguntas en rondas** — Las preguntas al usuario se agrupan en rondas de máximo 3-4, en el orden de secciones del template, reduciendo la fricción de la entrevista. _(deps: FEAT-009)_
- [ ] **FEAT-011: Inferencia y marcado de contenido faltante** — El agente infiere el contenido de secciones sin suficiente detalle usando el contexto del proyecto y marca todo contenido inferido con la etiqueta `[inferido]`. _(deps: FEAT-009)_
- [ ] **FEAT-012: Feedback de transición y próximo paso** — Al finalizar cualquier fase, el agente informa el path absoluto del documento generado y el comando a ejecutar para continuar el workflow. _(deps: FEAT-007)_
- [ ] **FEAT-013: Idempotencia de re-ejecución** — Re-ejecutar un comando sobre una fase ya en estado `Ready` genera un aviso al usuario antes de cualquier modificación, sin duplicar ni sobrescribir contenido silenciosamente. _(deps: FEAT-007)_
- [ ] **FEAT-014: Validación de completitud del documento** — El sistema verifica que no existan placeholders `[...]` sin completar antes de marcar un documento como `Ready`, notificando al usuario la lista de campos pendientes si los hay. _(deps: FEAT-006)_
- [ ] **FEAT-015: Control de WIP con decisión del usuario** — Al intentar iniciar un nuevo proyecto con uno activo detectado, el sistema avisa del conflicto y presenta al usuario la opción de sobrescribir o retomar, sin forzar ninguna acción. _(deps: FEAT-007)_

---

## Propuesta de Releases

### Release 1: MVP — Workflow completo extremo a extremo

**Objetivo:** Proveer el workflow mínimo funcional que permita a un usuario recorrer las tres fases (begin-intention → ps-discovery → ps-planning) y obtener un project-plan.md listo para ser entregado a un equipo o a la IA para su implementación, con trazabilidad básica en cada documento.

- [ ] FEAT-001: Extracción dinámica de templates
- [ ] FEAT-002: Estructura autónoma de skills
- [ ] FEAT-003: Generación de project-intent.md
- [ ] FEAT-004: Generación de requirement-spec.md
- [ ] FEAT-005: Generación de project-plan.md
- [ ] FEAT-006: Metadatos de trazabilidad
- [ ] FEAT-009: Entrevista con pre-relleno desde contexto
- [ ] FEAT-011: Inferencia y marcado de contenido faltante

**Criterios de éxito:**
- [ ] Un usuario puede ejecutar `/ps-begin-intention`, `/ps-discovery` y `/ps-planning` en secuencia y obtener los tres documentos de output sin errores de ejecución ni secciones vacías.
- [ ] Los documentos generados no requieren reescritura estructural: menos del 30% del contenido generado necesita ser modificado por el usuario para avanzar a la siguiente fase.
- [ ] Todo contenido no capturado explícitamente del usuario está marcado con `[inferido]`, permitiendo distinguir origen del contenido en revisión.

---

### Release 2: Robustez y Continuidad

**Objetivo:** Agregar las capacidades de navegación resiliente y feedback explícito que permiten al usuario trabajar con confianza sobre proyectos en curso, retomar sesiones interrumpidas y evitar sobrescrituras accidentales.

- [ ] FEAT-007: Detección automática de estado de fase
- [ ] FEAT-008: Retoma de proyecto en curso
- [ ] FEAT-012: Feedback de transición y próximo paso
- [ ] FEAT-013: Idempotencia de re-ejecución
- [ ] FEAT-015: Control de WIP con decisión del usuario

**Criterios de éxito:**
- [ ] Un usuario puede interrumpir el workflow en cualquier fase y retomarlo ejecutando el comando correspondiente sin pérdida de progreso.
- [ ] Re-ejecutar cualquier comando sobre una fase en estado `Ready` nunca modifica el documento sin confirmación previa del usuario.
- [ ] Al completar cada fase, el agente informa el path del documento generado y el siguiente comando del workflow.

---

### Release 3: Calidad y Experiencia Refinada

**Objetivo:** Incorporar las capacidades de validación automática y UX de entrevista optimizada que elevan la calidad de los outputs y reducen la fricción del proceso de especificación.

- [ ] FEAT-010: Agrupación de preguntas en rondas
- [ ] FEAT-014: Validación de completitud del documento

**Criterios de éxito:**
- [ ] Ningún documento en estado `Ready` contiene campos con formato `[...]` sin reemplazar.
- [ ] La entrevista de especificación no presenta más de 4 preguntas por ronda en ninguna fase del workflow.

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total Features | 15 |
| Features en MVP (Release 1) | 8 |
| Releases planificados | 3 |
