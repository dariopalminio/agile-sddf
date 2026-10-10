---
type: wiki
slug: requirements-index
title: "Requisitos"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-10-10
---

# Requisitos (`requirements/`)

**Propósito:** contrato funcional persistente — responde *¿qué debe hacer el producto?* Vive
meses y lo leen el Product Owner, el equipo y QA.

**Convención de IDs:** `FR-NNN` para requisitos funcionales y `NFR-NNN` para los no funcionales.
Los IDs son únicos en toda la memoria y **nunca se renumeran**.

**Regla dura:** un requisito describe comportamiento del producto; una historia describe un
incremento que lo materializa y declara `implements: [FR-NNN]`. No duplicar el "qué".

---

## Estrategia: documento único primero, fragmentación cuando duela

`requirements/` soporta **dos disposiciones físicas** para el mismo contenido lógico. La elección
depende del tamaño del proyecto, no de preferencias. Se empieza por la más simple y se migra a la
fragmentada **solo cuando el umbral se supera**.

| Disposición | Cuándo usarla | Estructura |
|-------------|---------------|------------|
| **SRS único** (default) | Proyecto con ≤ 15 requisitos **y** ≤ 500 líneas | `srs-<project-slug>.md` |
| **Fragmentado** | Proyecto con > 15 requisitos **o** > 500 líneas | `functional/FR-NNN-<slug>.md` + `non-functional/NFR-NNN-<slug>.md` |

### Umbral de fragmentación

Se migra del SRS único al fragmentado cuando **cualquiera** de estas condiciones se cumple:

- El SRS contiene **más de 15 requisitos** (FR + NFR combinados).
- El SRS supera las **500 líneas**.

El umbral es orientativo. Si aparecen conflictos de merge frecuentes entre colaboradores que
editan requisitos distintos, también es señal de que conviene fragmentar antes.

---

## Disposición 1 — SRS único (default)

Un solo archivo `srs-<project-slug>.md` con todos los requisitos agrupados por tipo y ordenados
por ID. Cada requisito es una sección `###` con un heading que contiene su ID.

```text
docs/requirements/
└── srs-mi-proyecto.md
```

**Estructura interna del SRS:**

```markdown
---
type: srs
slug: srs-mi-proyecto
title: "SRS — Mi Proyecto"
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# SRS — Mi Proyecto

## Requisitos funcionales

### FR-001 — Eliminar cuenta

El sistema debe permitir al usuario eliminar su propia cuenta con confirmación.

**Criterios de verificación:**
- [ ] El usuario confirma con contraseña.
- [ ] La cuenta queda inactiva tras la confirmación.

### FR-002 — Cambiar email

...

## Requisitos no funcionales

### NFR-001 — Latencia de eliminación

El endpoint `DELETE /account` debe responder en <200ms (p95).

...
```

**Reglas del SRS único:**

- Un requisito por sección `###`, con el ID como prefijo del heading.
- Los IDs se asignan secuencialmente y **no se renumeran**.
- Un requisito transversal puede referenciar otros requisitos con `[[FR-NNN]]` (ver *Resolución de wikilinks*).
- El SRS es el punto de entrada: se lee completo o se navega por heading.

---

## Disposición 2 — Fragmentado

Un archivo por requisito, agrupados por tipo. El SRS deja de existir como documento principal y
se reemplaza por un `index.md` que lista todos los IDs con enlaces.

```text
docs/requirements/
├── index.md
├── functional/
│   ├── FR-001-eliminar-cuenta.md
│   ├── FR-002-cambiar-email.md
│   └── ...
└── non-functional/
    ├── NFR-001-latencia-eliminacion.md
    └── ...
```

**Estructura de cada archivo de requisito:**

```markdown
---
type: requirement
kind: functional
id: FR-001
slug: FR-001-eliminar-cuenta
title: "Eliminar cuenta"
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
related: []
---

# FR-001 — Eliminar cuenta

El sistema debe permitir al usuario eliminar su propia cuenta con confirmación.

## Criterios de verificación

- [ ] El usuario confirma con contraseña.
- [ ] La cuenta queda inactiva tras la confirmación.

## Verificado por

- [[STORY-NNN]]
```

**Reglas del fragmentado:**

- Un archivo por requisito, con nombre `FR-NNN-<slug>.md` o `NFR-NNN-<slug>.md`.
- El `index.md` se regenera con `memory-system index` y lista todos los IDs.
- Los archivos se crean **solo cuando el umbral se supera**, nunca antes.

---

## Resolución de wikilinks

Cuando una historia declara `implements: [FR-001]`, el resolver de `memory-system` busca en este
orden:

1. **Archivo individual** en `functional/FR-001-*.md` o `non-functional/NFR-001-*.md`.
2. **Sección dentro de un SRS** en `requirements/srs-*.md` con heading `### FR-001 ...`.
3. **Error accionable** si no encuentra ninguna de las dos.

Este orden permite que las historias declaren `implements: [FR-001]` en ambos modos sin cambiar
su sintaxis. La diferencia de disposición física es transparente para el resto del framework.

---

## Migración entre disposiciones

| Dirección | Comando | Cuándo |
|-----------|---------|--------|
| SRS único → fragmentado | `/memory-system migrate --from=srs-single` | Al superar el umbral |
| Fragmentado → SRS único | `/memory-system migrate --from=requirements-fragmented` | Solo si el proyecto reduce su alcance drásticamente (raro) |

La migración es **idempotente**: ejecutarla dos veces no duplica ni pierde contenido.

---

## Scaffolding

`memory-system scaffold` crea por defecto la disposición **SRS único**:

```text
docs/requirements/
└── srs-<project-slug>.md
```

**No crea** las carpetas `functional/` y `non-functional/` vacías. Si el proyecto las necesita,
las crea el propio usuario al fragmentar, o la migración `--from=srs-single` las genera.

---
## Índice de requisitos

Migrados desde project.md (§2.1 y §2.2) por [[eliminar-specs-01-projects]]; el hueco FR-049 se conserva.

> **Convención de fuente.** Cada requisito referencia el skill que lo implementa (bajo `skills/` en
> la raíz del repositorio, que es la fuente única de verdad), la historia que lo especificó y la
> épica que lo agrupa.

### Requisitos funcionales

#### 2.1.1 Infraestructura y protocolo de entorno

- [[FR-001-inicializacion-del-entorno-sddf]] — Inicialización del entorno SDDF
- [[FR-002-protocolo-de-verificacion-de-entorno-como-paso-0]] — Protocolo de verificación de entorno como Paso 0
- [[FR-003-raiz-de-artefactos-configurable]] — Raíz de artefactos configurable
- [[FR-004-organizacion-de-artefactos-por-work-item]] — Organización de artefactos por work item
- [[FR-005-templates-centralizados-como-fuente-unica]] — Templates centralizados como fuente única
- [[FR-006-extraccion-dinamica-de-secciones-de-templates-en]] — Extracción dinámica de secciones de templates en runtime
- [[FR-007-configuracion-operacional-por-stack-tecnologico]] — Configuración operacional por stack tecnológico

#### 2.1.2 Pipeline de especificación de proyecto (nivel L3)

- [[FR-008-captura-de-intencion-inicial-del-proyecto]] — Captura de intención inicial del proyecto
- [[FR-009-discovery-de-usuarios-y-especificacion-de]] — Discovery de usuarios y especificación de requisitos
- [[FR-010-planificacion-de-proyecto-con-epicas-y-backlog]] — Planificación de proyecto con épicas y backlog
- [[FR-011-ejecucion-del-pipeline-de-proyecto-en-una-sola]] — Ejecución del pipeline de proyecto en una sola sesión
- [[FR-012-sesion-interactiva-de-user-story-mapping]] — Sesión interactiva de User Story Mapping
- [[FR-013-integracion-del-story-map-como-guia-de]] — Integración del story map como guía de planificación
- [[FR-014-generacion-del-diagrama-de-contexto-c4]] — Generación del diagrama de contexto C4
- [[FR-015-generacion-de-politicas-de-proyecto]] — Generación de políticas de proyecto
- [[FR-016-control-de-work-in-progress-wip-1-por-nivel]] — Control de Work-In-Progress (WIP = 1) por nivel
- [[FR-017-gates-de-revision-humana-entre-fases]] — Gates de revisión humana entre fases

#### 2.1.3 Ingeniería inversa de repositorios

- [[FR-018-generacion-de-la-especificacion-desde-codigo]] — Generación de la especificación desde código existente
- [[FR-019-analisis-de-arquitectura-tecnica-del-repositorio]] — Análisis de arquitectura técnica del repositorio
- [[FR-020-extraccion-de-features-desde-la-perspectiva-del]] — Extracción de features desde la perspectiva del usuario
- [[FR-021-extraccion-de-reglas-de-negocio-desde-el-codigo]] — Extracción de reglas de negocio desde el código
- [[FR-022-reconstruccion-del-mapa-de-navegacion-y-flujos-de]] — Reconstrucción del mapa de navegación y flujos de usuario
- [[FR-023-analisis-con-scope-acotado]] — Análisis con scope acotado
- [[FR-024-modo-incremental-de-actualizacion]] — Modo incremental de actualización

#### 2.1.4 Gestión de épicas (nivel L2)

- [[FR-025-creacion-interactiva-de-una-epica]] — Creación interactiva de una épica
- [[FR-026-generacion-de-epicas-desde-el-plan-de-proyecto]] — Generación de épicas desde el plan de proyecto
- [[FR-027-validacion-de-formato-de-epica-gate]] — Validación de formato de épica (gate)
- [[FR-028-generacion-de-historias-desde-una-epica]] — Generación de historias desde una épica
- [[FR-029-generacion-de-historias-de-todas-las-epicas-en]] — Generación de historias de todas las épicas en batch

#### 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)

- [[FR-030-creacion-de-historias-de-usuario]] — Creación de historias de usuario
- [[FR-031-evaluacion-de-calidad-con-rubrica-finvest]] — Evaluación de calidad con rúbrica FINVEST
- [[FR-032-division-de-historias-grandes-story-splitting]] — División de historias grandes (story splitting)
- [[FR-033-mejora-automatica-de-una-historia-desde-su-reporte]] — Mejora automática de una historia desde su reporte de evaluación
- [[FR-034-orquestacion-del-ciclo-de-especificacion-con-gate]] — Orquestación del ciclo de especificación con gate anti-bucle

#### 2.1.6 Planificación de historia (nivel L1 · fase PLAN)

- [[FR-035-diseno-tecnico-de-la-historia]] — Diseño técnico de la historia
- [[FR-036-descomposicion-en-tareas-atomicas]] — Descomposición en tareas atómicas
- [[FR-037-generacion-de-casos-de-prueba-tipificados]] — Generación de casos de prueba tipificados
- [[FR-038-analisis-transversal-de-coherencia-gate-del-dod]] — Análisis transversal de coherencia (gate del DoD PLAN)
- [[FR-039-orquestacion-de-la-fase-de-planning]] — Orquestación de la fase de planning

#### 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)

- [[FR-040-implementacion-guiada-por-tdd]] — Implementación guiada por TDD
- [[FR-041-modos-de-ejecucion-y-reanudacion-de-la]] — Modos de ejecución y reanudación de la implementación
- [[FR-042-implementacion-tarea-por-tarea]] — Implementación tarea por tarea
- [[FR-043-revision-de-codigo-multi-agente-gate-del-dod-code]] — Revisión de código multi-agente (gate del DoD CODE-REVIEW)
- [[FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify]] — Verificación por ejecución de pruebas (fase VERIFY)
- [[FR-045-aceptacion-humana-final-fase-acceptance]] — Aceptación humana final (fase ACCEPTANCE)
- [[FR-046-gestion-de-estados-a-lo-largo-del-workflow]] — Gestión de estados a lo largo del workflow

#### 2.1.8 Documentación, metadatos y seguridad

- [[FR-047-estandarizacion-de-frontmatter-en-documentos-de]] — Estandarización de frontmatter en documentos de spec
- [[FR-048-generacion-del-indice-wiki-de-documentacion]] — Generación del índice wiki de documentación
- [[FR-050-auditoria-de-seguridad-condicional]] — Auditoría de seguridad condicional

#### 2.1.9 Distribución e instalación multi-runtime

- [[FR-051-distribucion-del-framework-como-paquete-npm]] — Distribución del framework como paquete npm
- [[FR-052-instalacion-automatica-tras-npm-install]] — Instalación automática tras `npm install`
- [[FR-053-instalacion-interactiva-con-seleccion-de-runtime]] — Instalación interactiva con selección de runtime
- [[FR-054-publicacion-automatizada-desde-ci]] — Publicación automatizada desde CI

### Requisitos no funcionales

#### 2.2.1 Plataforma y compatibilidad de runtimes

- [[NFR-001-compatibilidad-multi-runtime-por-instalacion-no]] — Compatibilidad multi-runtime por instalación, no por duplicación
- [[NFR-002-independencia-del-cliente-de-ia-en-el-texto-de-los]] — Independencia del cliente de IA en el texto de los skills

#### 2.2.2 Formato declarativo y superficie ejecutable

- [[NFR-003-markdown-como-lenguaje-de-definicion]] — Markdown como lenguaje de definición
- [[NFR-004-superficie-ejecutable-minima-en-node-js]] — Superficie ejecutable mínima en Node.js

#### 2.2.3 Almacenamiento y persistencia

- [[NFR-005-sistema-de-archivos-como-unica-capa-de]] — Sistema de archivos como única capa de persistencia

#### 2.2.4 Máquina de estados y control de flujo

- [[NFR-006-control-de-ciclo-de-vida-con-status-substatus]] — Control de ciclo de vida con `status` + `substatus`
- [[NFR-007-limite-de-trabajo-en-curso-por-nivel]] — Límite de trabajo en curso por nivel
- [[NFR-008-gates-secuenciales-con-precondiciones-explicitas]] — Gates secuenciales con precondiciones explícitas

#### 2.2.5 Trazabilidad y auditoría

- [[NFR-009-metadatos-de-trazabilidad-en-todos-los-documentos]] — Metadatos de trazabilidad en todos los documentos generados
- [[NFR-010-navegacion-por-indice-y-wikilinks]] — Navegación por índice y wikilinks
- [[NFR-011-niveles-de-confianza-explicitos-en-contenido]] — Niveles de confianza explícitos en contenido inferido
- [[NFR-012-output-parcial-ante-datos-insuficientes]] — Output parcial ante datos insuficientes

#### 2.2.6 Arquitectura de agentes y gestión de contexto

- [[NFR-013-composicion-inline-y-un-solo-salto-de-delegacion]] — Composición inline y un solo salto de delegación
- [[NFR-014-contrato-tmp-skill-name-contra-el-telefono]] — Contrato `.tmp/<skill-name>/` contra el «teléfono descompuesto»
- [[NFR-015-templates-y-assets-como-contrato-de-interfaz]] — Templates y assets como contrato de interfaz

#### 2.2.7 Calidad y verificación

- [[NFR-016-casos-de-prueba-declarados-por-skill]] — Casos de prueba declarados por skill
- [[NFR-017-definition-of-done-como-gate-ejecutable]] — Definition of Done como gate ejecutable
- [[NFR-018-verificacion-demostrada-no-declarada]] — Verificación demostrada, no declarada

#### 2.2.8 Seguridad

- [[NFR-019-escaneo-de-seguridad-de-skills-en-ci]] — Escaneo de seguridad de skills en CI
- [[NFR-020-ausencia-de-secretos-en-el-paquete-distribuido]] — Ausencia de secretos en el paquete distribuido

#### 2.2.9 Usabilidad y experiencia del desarrollador

- [[NFR-021-limite-de-preguntas-por-ronda-de-entrevista]] — Límite de preguntas por ronda de entrevista
- [[NFR-022-flags-para-modos-alternativos-de-ejecucion]] — Flags para modos alternativos de ejecución
- [[NFR-023-idempotencia-declarada-de-los-skills-de]] — Idempotencia declarada de los skills de inicialización

#### 2.2.10 Entorno de desarrollo

- [[NFR-024-entorno-de-desarrollo-reproducible-con-docker]] — Entorno de desarrollo reproducible con Docker
