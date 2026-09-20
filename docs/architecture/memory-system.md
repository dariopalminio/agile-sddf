# Sistema de Memoria SDDF

> **Tipo:** architecture · **ID:** ARCH-MEMORY · **Estado:** active  
> **Profundidad:** detalle → [[domain-knowledge-artifacts]], [[domain-work-item-hierarchy]]

---

## 1. Tres capas, tres preguntas

| Capa | Pregunta | Vida | Audiencia |
|------|----------|------|-----------|
| `product/` | ¿Por qué existe? | Años | PO, negocio |
| `requirements/` | ¿Qué debe hacer? | Meses | PO, equipo, QA |
| `specs/` | ¿Cómo lo construimos ahora? | Días/semanas | Equipo, IA |

**Regla dura:** un requirement describe **comportamiento del producto**; una story describe **un incremento que lo materializa** y declara `implements: [FR-NNN]`. No duplicar el "qué".

---

## 2. Capas de soporte

| Capa | Contiene | Vida |
|------|----------|------|
| `domains/` | Modelo DDD (entidades, invariantes, lenguaje ubicuo) | Muy larga |
| `architecture/` | C4, stack, vistas de sistema | Larga |
| `adr/` | Decisiones inmutables (`ADR-NNNN`) | Inmutable |
| `guardrails/` | Restricciones verificables (checklists con `error`/`warn`) | Larga |
| `policies/` | Reglas de gobernanza; `constitution.md` en la raíz de `docs/` | Larga |
| `guides/` | Explicaciones didácticas y how-tos | Media |
| `runbooks/` | Procedimientos operativos (deploy, recovery) | Larga |
| `templates/` | Meta-artefactos para generar otros artefactos | Muy larga |

---

## 3. Estructura de la memoria (árbol)

```
agile-sddf/
├── AGENTS.md                          # punto de entrada para agentes IA
├── CLAUDE.md                          # (opcional) punto de entrada para Claude Code
├── sddf.config.yaml                   # configuración: skills activos por fase
│
└── docs/                              # raíz única de la memoria (configurable)
    ├── index.md                       # cursor principal wiki (wikilinks [[slug]])
    ├── constitution.md                # principios supremos (raíz de gobernanza)
    │
    ├── product/                       # capa 1: contexto del negocio
    │   ├── vision.md
    │   ├── stakeholders.md
    │   └── objectives.md
    │
    ├── requirements/                  # capa 2: contrato funcional (persistente)
    │   ├── functional/
    │   │   └── FR-NNN-*.md
    │   └── non-functional/
    │       └── NFR-NNN-*.md
    │
    ├── specs/                         # capa 3: construcción por incremento
    │   ├── 01-projects/               # L3 — documentación fundacional
    │   │   └── PROJ-NNN-*/
    │   │       └── project.md
    │   ├── 02-epics/                  # L2 — entregables
    │   │   └── EPIC-NNN-*/
    │   │       └── epic.md
    │   ├── 03-stories/                # L1 — historias atómicas
    │   │   └── STORY-NNN-*/
    │   │       └── story.md
    │   └── .cache/                    # caché regenerable (NO versionado)
    │       └── index.json
    │
    ├── domains/                       # modelo DDD del sistema
    │   ├── README.md
    │   ├── domain-work-item-hierarchy.md
    │   ├── domain-state-management.md
    │   ├── domain-knowledge-artifacts.md
    │   ├── domain-project-lifecycle.md
    │   ├── domain-epic-lifecycle.md
    │   └── domain-story-lifecycle.md
    │
    ├── architecture/                  # arquitectura técnica
    │   ├── system-overview.md
    │   ├── tech-stack.md
    │   └── c4/
    │       ├── c4-context.md
    │       └── c4-containers.md
    │
    ├── adr/                           # decisiones inmutables
    │   ├── ADR-0003-workflow-canonico.md
    │   ├── ADR-0004-documentacion-en-capas.md
    │   └── ADR-0008-rework-sin-estado-propio.md
    │
    ├── policies/                      # gobernanza (derivan de constitution.md)
    │   ├── security-policy.md
    │   └── quality-policy.md
    │
    ├── guardrails/                    # restricciones verificables
    │   ├── dod-story.md               # transition guardrail
    │   └── security-checklist.md      # content guardrail
    │
    ├── guides/                        # documentación didáctica
    │   ├── sddf-commands-pipeline.md
    │   └── how-to-write-requirements.md
    │
    ├── runbooks/                      # procedimientos operativos
    │   ├── deploy-npm.md
    │   └── docker-recovery.md
    │
    └── templates/                     # meta-artefactos (plantillas)
        ├── story-template.md
        ├── epic-template.md
        ├── project-template.md
        ├── requirement-template.md
        └── adr-template.md
```

### Reglas del árbol

| Regla | Detalle |
|-------|---------|
| **Raíz única** | Todo bajo `docs/`; el nombre es configurable vía `sddf.config.yaml` (`root:`). |
| **Un nivel, una responsabilidad** | Cada carpeta de primer nivel agrupa un tipo de artefacto distinto. |
| **Sin anidamiento profundo** | Máximo 2–3 niveles por debajo de `docs/` (excepto `specs/`, que tiene 3 por su jerarquía L3→L2→L1). |
| **Prefijos numéricos** | Solo en `specs/` (`01-`, `02-`, `03-`) para reflejar el orden L3→L2→L1. |
| **`.cache/` no versionado** | Los índices derivados viven en `.cache/` y se regeneran on-demand. |
| **Templates fuera de specs** | `docs/templates/` es meta-artefacto; no vive dentro de `specs/`. |
| **Constitution fuera de policies** | `docs/constitution.md` está un nivel por encima para reflejar jerarquía. |

---

## 4. Regla de decisión: ¿dónde va esto?

| Si es... | Va en... |
|----------|----------|
| Contexto del negocio (por qué, para quién) | `product/` |
| Comportamiento que el producto debe cumplir siempre | `requirements/` |
| Incremento concreto que se construye ahora | `specs/` |
| Modelo del negocio (entidades, invariantes) | `domains/` |
| Estructura técnica (C4, stack) | `architecture/` |
| Decisión arquitectónica inmutable | `adr/` |
| Restricción verificable que bloquea | `guardrails/` |
| Regla de gobernanza | `policies/` |
| Explicación didáctica | `guides/` |
| Procedimiento operativo | `runbooks/` |
| Plantilla de generación | `templates/` |

---

## 5. Trazabilidad (flujo canónico)

```
product/vision.md
    ↓ informs
requirements/FR-001.md
    ↓ verified-by
specs/03-stories/STORY-042/story.md
    ↓ implements
requirements/FR-001.md
```

**Bidireccionalidad obligatoria:** si A enlaza a B, B debe poder enlazar a A. Relaciones tipadas: `parent`, `implements`, `verified-by`, `traces-to`, `applied-by`, `originates-from`, `enforced-by`, `supersedes`. Ver [[domain-knowledge-artifacts]] §7.

---

## 6. Gobernanza

```
AGENTS.md                     # punto de entrada IA
    ↓
docs/constitution.md          # principios supremos (fuera de policies/)
    ├──► docs/policies/       # reglas derivadas
    └──► docs/guardrails/     # restricciones verificables
```

**Reglas:**
- La constitución no se edita a la ligera; cambio requiere aprobación y versionado.
- Toda policy declara si deriva de la constitución (`derives-from`).
- Todo guardrail declara su policy originadora (`originates-from`) o justifica su ausencia.
- Conflicto policy ↔ constitución: gana la constitución.

---

## 7. Invariantes del sistema

1. **Una raíz única**: todo bajo `docs/` (configurable vía `sddf.config.yaml`).
2. **Frontmatter obligatorio**: `type`, `id`, `title`, `date`, `status`.
3. **IDs únicos globalmente**: `FR-001`, `STORY-042`, `ADR-0003` no se repiten.
4. **Sin duplicación**: una regla vive en un solo lugar; se enlaza, no se copia.
5. **Bidireccionalidad**: todo enlace es navegable en ambas direcciones.
6. **ADRs inmutables**: no se editan; se superseden.
7. **Guardrails verificables**: `enforcement: error` ⇒ verificación determinista.
8. **Wikilinks consistentes**: `[[slug]]` resuelve a un artefacto existente.
9. **Convención de guion**: ASCII U+002D `-` en slugs.

---

## 8. Anti-patrones

- ❌ Duplicar un requirement en la story.
- ❌ Editar un ADR aceptado.
- ❌ Mezclar visión y requisitos bajo el mismo nombre.
- ❌ Poner `dod-story.md` en `policies/` (es un transition guardrail).
- ❌ Indexar todo en un archivo monolítico.
- ❌ Enlazar sin bidireccionalidad.
- ❌ Usar `docs/specs/templates/` en lugar de `docs/templates/`.

---

## 9. Referencias

| Documento | Propósito |
|-----------|-----------|
| [[docs/domains/domain-knowledge-artifacts]] | Modelo completo de artefactos, tipos y TraceLinks |
| [[docs/domains/domain-work-item-hierarchy]] | Estructura Project → Epic → Story |
| [[docs/domains/domain-state-management]] | Estados, subestados, transiciones |
| [[sddf.config.yaml]] | Configuración del framework |



