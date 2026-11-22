---
slug: usar-madr-para-decisiones
parent: Decisions
nav_order: 0
---
# Usar Markdown Architectural Decision Records

## Contexto y planteamiento del problema

Queremos registrar las decisiones arquitectónicas tomadas en este proyecto, independientemente de si se refieren a la arquitectura ("registro de decisiones arquitectónicas"), al código o a otros ámbitos. ¿Qué formato y estructura deben seguir estos registros?

## Opciones consideradas

* [MADR](https://adr.github.io/madr/) 4.0.0 – The Markdown Architectural Decision Records
* [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) – The first incarnation of the term "ADR"
* [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) – The Y-Statements
* Otros templates listados en <https://github.com/joelparkerhenderson/architecture_decision_record>
* Sin formato: no hay convenciones para el formato y la estructura de los archivos.

## Resultado de la decisión

Opción elegida: "MADR 4.0.0", porque

* Las suposiciones implícitas deben hacerse explícitas.
  La documentación del diseño es importante para permitir que las personas comprendan las decisiones más adelante.
  Véase también ["A rational design process: How and why to fake it"](https://doi.org/10.1109/TSE.1986.6312940).
* MADR permite capturar de manera estructurada cualquier decisión.
* El formato MADR es ligero y se adapta a nuestro estilo de desarrollo.
* La estructura MADR es comprensible y facilita su uso y mantenimiento.
* El proyecto MADR es activo.