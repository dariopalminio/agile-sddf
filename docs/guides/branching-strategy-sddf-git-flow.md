---
type: guide
slug: branching-strategy-sddf-git-flow
title: "Modelo de Branching SDDF git flow"
date: 2026-03-26
status: BACKLOG
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - flight-leves-model
---

# Modelo de Branching SDDF git flow

El framework intenta ser flexible y adaptarse a la estrategia de branching que utilices, sin embargo, proponemos usar trunk based development y una convención de ramas básica y simple que refleja la jerarquía de elementos de trabajo para facilitar la trazabilidad y el control de versiones; y que también sirve de forma didáctica para entender los niveles y flujo de trabajo.

## Estrategias de delivery

El modelo SDDF (‘deliveryModel‘) es compatible con diferentes estrategias de delivery, como: ‘continuous’ y  ‘batch’. La estrategia de delivery se refiere a la frecuencia y el tamaño de las entregas de software a producción. En una estrategia de delivery continuo, las entregas son frecuentes y de menor tamaño, mientras que en una estrategia de delivery por lotes, las entregas son menos frecuentes pero de mayor tamaño. La elección de la estrategia de delivery dependerá de las necesidades del proyecto, el equipo y la organización, así como de la naturaleza del software que se está desarrollando. En general, el modelo SDDF es flexible y puede adaptarse a ambas estrategias, siempre y cuando se mantenga una buena organización y gestión de las ramas en el repositorio de código.

### Batch Delivery (release‑based)

En el modelo de entrega por lotes (‘batch’), las historias de usuario o features se agrupan en releases más grandes que se entregan a producción en intervalos regulares, por ejemplo para: librerìas de npm, release programado, plugins, SDKs, pruebas end-to-end lentas, cumplimiento normativo que requiere revisiones de release formales, migración de datos o enrutamiento complejo. Esto es ideal para proyectos que requieren una planificación más estructurada y un control más riguroso sobre las entregas. Se puede usar para: proyectos con requisitos bien definidos y estables, aplicaciones empresariales donde se requiere una planificación detallada, o proyectos con ciclos de desarrollo más largos.

### Continuous Delivery (continuous)

En este modelo, cada historia de usuario o feature se desarrolla y se entrega de forma independiente, lo que permite una entrega continua y rápida a producción. Esto es ideal para proyectos que requieren una rápida iteración y feedback constante. Se puede usar para: proyectos con un alto grado de incertidumbre o que están en una fase temprana de desarrollo, sitios web donde se puede entregar contenido de forma incremental, o aplicaciones requieren actualizaciones frecuentes.

## Estrategias de branching

Segun el modelo de delivery se puede adoptar estrategias específicas de branching, como el modelo de branching SDDF git flow, que se adapta bien a ambos modelos de delivery.

### Batch Delivery Branching

En este esquema las historias se agrupan en releases (liberación por lote) en un flujo que se basa en una jerarquía de ramas de tres niveles: `main` → `epic/` → (`feat/`/`fix`/`chore`).

```
main  o----------------------------------o (tag v1.0.2)
      |                                  |
      | git checkout -b                  | PR (de release a main)
      |                                  |
      v                                  |
     epic/<release-id> o----------------o
            |                             |
            | git checkout -b             | PR (de feat a release)
            |                             |
            v                             |
         feat/<story-id> o---------------o
```

* **main:** La rama main representa y el nivel de proyecto siendo la acumulación de releases de proyectos. La rama main termina en ambiente producción.
* **epic:** Cada rama epic representa un entregable específico dentro del proyecto, que puede ser liberado de un tirón o de manera incremental. La rama epic generalmente es probada en ambientes de staging (eso dependerá de tu diseño de CI/CD). Se crea al inicio del release y se mantiene hasta su publicación (es como una gran feat que agrupa feat).
* **feat:** Cada rama feat representa una historia de usuario o feature específica dentro de un release, que se puede dividir en subtareas o tareas técnicas o specs partes del desarrollo (operativo y táctico). Las feats acumulan los commits del desarrollo. La rama feat generalmente es probada en ambientes de desarrollo y/o testing (también dependerá de tu diseño de CI/CD). Se bifurca desde la rama `epic/` activa y se mantiene hasta su integración a la rama release.

### Continuous Delivery Branching

En el esquema de branching Continuous Delivery (‘continuous’), se usa trunk based development (desarrollo basado en la rama principal). Cada historia de usuario se desarrolla en una rama `feat/`, se fusiona mediante Pull Request (PR) a `main`, y se despliega a producción de forma independiente, siguiendo los principios de **Continuous Delivery (CD) por historia**.

```
main  o----------------------------------o (tag v1.0.2)
      |                                  |
      | git checkout -b                  | PR (de feat a main)
      |                                  |
      v                                  |
    feat/<story-id> o--------------------o
```

- **Nombres de ramas**: `feat/<story-id>`, `fix/<story-id>`, `chore/<story-id>`.
- **Rama principal**: `main` – representa producción. Todo commit en `main` debe ser desplegable.  
- **Ramas de historia**: `feat/<story-id>` – se crean desde `main`, contienen toda la especificación, diseño, tareas y código de la historia.  
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- **Pull Requests**: obligatorios para fusionar cualquier cambio a `main`.

Este modelo es una variante de TBD adaptada a Pull Requests. Se diferencia del TBD puro en que los desarrolladores no commitear directamente a main, sino que utilizan ramas feat/ efímeras y PRs. Esto añade capas de control (revisión por pares, CI formal) manteniendo los beneficios de integración continua y despliegue frecuente.

## Buenas prácticas

* **Convención de branches:** Esto respeta la "Convención de branches" recomendado [Conventional Branch](https://conventional-branch.github.io/).
* **Convención de Commits:** Se recomienda usar "Convensión de Commits" [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para mantener un historial de commits claro y estructurado, lo que facilita la generación de changelogs y la trazabilidad de cambios.
* **Protección de ramas**: Configurar reglas en GitHub/GitLab para exigir PRs y CI exitosos en `main` y `epic/*`.
* **Commits atómicos**: Cada commit debe tener un propósito claro y pasar todas las pruebas localmente.
* **Pull Requests pequeños**: Una historia debe ser atómica (menos de 200 líneas de cambio).
* **Versionado Semántico**: Usa "Versionado Semántico 2.0.0" [Semantic Versioning 2.0.0](https://semver.org/) y actualizar la versión (en `package.json`) antes del merge a `main` (puede automatizarse con `npm version`).
* **Limpieza de ramas efímeras**: Eliminar ramas `feat/` después de fusionarlas y ramas `epic/` después de publicar.
* **Trunk based development**: Se recomienda mantener la rama `main` siempre en un estado desplegable, integrando cambios frecuentemente desde ramas efímeras (`feat/`) mediante Pull Requests. Esto asegura integración continua y despliegue frecuente, minimizando la divergencia entre ramas y facilitando la detección temprana de conflictos. En casos de entregables de experimentación o prototipos o épicas en batch, se pueden usar ramas `epic/` temporales que luego se fusionan a `main` mediante PRs.
