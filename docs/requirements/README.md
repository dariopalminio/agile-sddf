---
type: wiki
slug: requirements-index
title: "Requisitos"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-09-22
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


