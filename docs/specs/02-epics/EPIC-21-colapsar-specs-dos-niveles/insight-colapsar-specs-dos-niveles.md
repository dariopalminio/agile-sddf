# 📊 Cambio sugerido: Colapsar specs a dos niveles y eliminar 01-projects

## Solapamiento entre `specs/01-projects/` y `product/` + `requirements/`**

**En general, ** La separación en 13 capas + capa de specs cubre todos los tipos de conocimiento que un framework SDD profesional necesita. La distinción entre "capas de documentación" (persistentes, transversales) y "capa de specs" (efímera, por work item) es correcta y se alinea con DDD.

**Pero hay un problema estructural que conviene resolver antes de considerarla definitiva:**

| # | Problema | Gravedad |
|---|----------|:---:|
| 1 | **Solapamiento real entre `specs/01-projects/` y `product/` + `requirements/`** | 🔴 Alta |

---

## 2) ¿Es redundante `specs/01-projects/`?

**Sí, lo es en la mayoría de casos.** Y es el problema estructural más importante del diseño.

### El diagnóstico

Analicemos los tres archivos de `01-projects/PROJ-NN/`:

| Archivo | Contenido | ¿Solapa con? | Veredicto |
|---------|-----------|--------------|-----------|
| `project-intent.md` | Intención inicial, objetivo y visión del proyecto | `product/vision.md` | 🔴 Solapamiento casi total |
| `project.md` | Stakeholders, FR y NFR del proyecto | `requirements/` + `product/stakeholders.md` | 🔴 Solapamiento casi total |
| `project-plan.md` | Plan de alto nivel con slicing en Epics | (único) | ✅ Contenido único |

**En un repo single-project** o monorepo (99% de los casos de SDDF), hay exactamente **un proyecto**. Ese "proyecto" es el producto. Por tanto:

- `project-intent.md` **es** `product/vision.md`
- `project.md` **es** `requirements/`
- Solo `project-plan.md` aporta algo nuevo: el **plan de slicing en Epics**

Mantener las dos representaciones genera **duplicación con deriva garantizada**: cuando `product/vision.md` cambie, alguien olvidará actualizar `project-intent.md`. Es exactamente el anti-patrón que evitaste con `ADR-0001` (templates centralizados) y `ADR-0007` (templates como capa propia).

### La causa raíz

El problema es que **`specs/01-projects/` no representa un work item**, a diferencia de `02-epics/` y `03-stories/`. Lo demuestra tu propia decisión de que el Project **solo tenga `substatus`, sin `status`**. Es un híbrido: se llama "project" pero se comporta como "documentación fundacional". O si es un workitems puede representar más complejidad que puede ser resuelta con epics. En vez de tener múltiples proyectos secuenciales del mismo producto, podemos tener épicas para dar continuidad a mejoras evolutivas.

### Recomendación: **eliminar `01-projects/`**

Migrar su contenido a las capas existentes:

| Contenido actual | Nuevo hogar |
|------------------|-------------|
| `project-intent.md` | → `product/vision.md` (o `product/charter.md` si prefieres otro nombre) |
| `project.md` | → `requirements/` (FR/NFR) + `product/stakeholders.md` |
| `project-plan.md` | → `product/roadmap.md` (nuevo archivo; el "epic slicing plan") |

La estructura resultante queda:

```
docs/
├── product/
│   ├── vision.md          # antes project-intent.md
│   ├── stakeholders.md    # antes en project.md
│   └── roadmap.md         # antes project-plan.md
├── requirements/
│   ├── functional/FR-NNN-*.md
│   └── non-functional/NFR-NNN-*.md
└── specs/
    ├── 02-epics/          # sin cambios
    └── 03-stories/        # sin cambios
```

Los IDs numéricos `01-`, `02-`, `03-` desaparecen porque ya no hay tres niveles en specs (solo dos: epics, stories) que ya se ordenan alfabéticamente.

### ¿Y si quieres mantener los tres niveles conceptuales?

Entonces la solución no es eliminar `01-projects/`, sino **renombrarlo para que refleje su verdadera naturaleza**. No es un "proyecto" (work item), es el **"charter"** del producto (documentación fundacional). O documentarlo mejor.

Propuesta:

```
docs/
└── specs/
    ├── 00-charter/                    # antes 01-projects/
    │   └── charter.md                 # antes project-intent.md + project-plan.md fusionados
    ├── 01-epics/                      # antes 02-epics/
    └── 02-stories/                    # antes 03-stories/
```

Pero honestamente, esta opción sigue teniendo solapamiento con `product/`. **Mi recomendación firme es la primera: eliminar `01-projects/`.**

### Por qué esta decisión es compatible con Flight Levels

Flight Levels distingue tres **niveles de abstracción para el flujo de valor** (estratégico/coordinación/operativo). No exige que cada nivel sea un work item separado. El nivel estratégico puede representarse en `product/` y `requirements/` (documentación), mientras que Epic y Story son los dos niveles operativos de construcción. La jerarquía conceptual se preserva:

```
Estratégico  →  product/ + requirements/   (documentación)
Coordinación →  specs/02-epics/            (work item)
Operativo    →  specs/03-stories/          (work item)
```

Es más limpio y sigue siendo fiel a Flight Levels.

---

### Verificación contra los tres modos SDD

| Modo | ¿La estructura lo soporta? | Comentario |
|------|:---:|-----------|
| **Intent-First** | ⚠️ Con solapamiento | Si `product/` y `specs/01-projects/` coexisten, el intent está duplicado. Eliminar `01-projects/` lo resuelve. |
| **Spec-Anchored** | ✅ Sí | La capa `specs/` es la ancla; `docs/` es soporte. La estructura funciona. |
| **Spec-as-Source** | ✅ Sí | Las specs son el artefacto principal. La estructura es compatible. |

---

## 🏁 Resumen

| Pregunta | Respuesta |
|----------|-----------|
| **1) ¿Es sólida la estructura?** | ✅ Sí, con un problema estructural importante (`01-projects/`). |
| **2) ¿Es redundante `01-projects/`?** | 🔴 **Sí.** Solapa con `product/` y `requirements/`. **Recomendación: eliminarlo** y migrar su contenido a `product/` (vision, stakeholders, roadmap) y `requirements/` (FR/NFR). Los dos niveles de specs (epics, stories) son suficientes. |
| **3) ¿Sigue siendo sólida?** | ✅ Sí, con los detalles a mejorar. Ninguno es bloqueante salvo el de `01-projects/`. |

**Acción prioritaria:** Refactorizar para eliminar 01-projects/ y migrar su contenido a `product/` y `requirements/`.

## Referencias

[ADR-0013: Eliminar `specs/01-projects/`](../../../adr/ADR-0013-eliminar-specs-01-projects.md)
