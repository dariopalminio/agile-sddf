---
type: guide
slug: descubrir-features-y-capabilities
title: "Descubrir features y agruparlas en capabilities"
date: 2026-10-29
status: active
related:
  - specs-and-workflows
  - best-practices-for-testing
---
<!-- Referencias -->
[[specs-and-workflows]] · [[best-practices-for-testing]]

# Descubrir features y agruparlas en capabilities

Esta guía describe cómo reconstruir los comportamientos principales de un producto a partir de un repositorio de software y organizarlos como documentación navegable. Es aplicable a aplicaciones, API, bibliotecas y herramientas de línea de comandos. El resultado es una propuesta trazable: su precisión depende de la evidencia disponible y de la revisión de quienes conocen el producto.

Un **dominio** es un área funcional del producto, como compras. Una **capability** es una capacidad reconocible dentro de ese dominio, como gestionar pedidos. Una **feature** describe un comportamiento dentro de esa capacidad, como cancelar un pedido. Sus **escenarios** ilustran reglas, resultados y condiciones concretas. Una misma feature puede haber evolucionado mediante varias historias de usuario.

## 1. Delimitar el producto

Identifica qué repositorio, aplicación o parte del sistema se va a analizar. Describe su propósito y sus actores: personas, sistemas externos o desarrolladores que consumen una biblioteca o una herramienta. En un monorepositorio, distingue los productos y las bibliotecas compartidas antes de agrupar comportamientos.

Consulta la documentación disponible, el README, contratos públicos y la configuración para reconocer el vocabulario y las fronteras del producto. Registra las dudas y el alcance elegido: un repositorio puede contener componentes que no se despliegan o distribuyen juntos.

## 2. Inventariar entradas y fuentes de evidencia

Localiza cómo se utiliza el sistema: pantallas y acciones, rutas de API, comandos, interfaces públicas de bibliotecas, eventos, consumidores y tareas programadas. Usa las que correspondan al producto. Revisa código, pruebas, configuraciones, esquemas y documentación existente.

La documentación y el backlog ayudan a identificar intención y lenguaje, pero pueden estar desactualizados. Una ruta, un nombre de clase o una prueba aislada son pistas que hay que contrastar con el flujo que las utiliza. Excluye del inventario de producto los ejemplos, fixtures y código generado, salvo que formen parte del alcance elegido.

## 3. Reconstruir flujos de comportamiento

Para cada entrada relevante, sigue el recorrido hasta encontrar sus reglas y resultados observables:

```text
Actor → acción o evento → condiciones y reglas → cambio o resultado → respuesta
```

Por ejemplo: el cliente confirma un pedido, el sistema valida disponibilidad, registra el pedido y devuelve una confirmación. Busca también las condiciones de rechazo, los efectos visibles y las restricciones de acceso. Cuando una dependencia, configuración o integración impida seguir el recorrido completo, registra el límite de la evidencia.

## 4. Formular features candidatas

Expresa cada comportamiento con un nombre que el actor reconozca: «confirmar un pedido», «consultar su estado» o «cancelar un pedido». Describe quién lo utiliza, qué resultado obtiene y qué reglas relevantes lo distinguen.

Una feature debe reunir un conjunto coherente de reglas y ejemplos. Los casos exitosos, las variantes y los rechazos de un mismo comportamiento pueden ser escenarios de una sola feature. Una pantalla, endpoint, clase o historia puede contribuir a varias features y una feature puede atravesar varios componentes.

Evita duplicar una regla compartida en varias features: documenta su comportamiento en un lugar identificable y referencia la dependencia cuando haga falta. Los componentes técnicos, actores o requisitos transversales también pueden servir como etiquetas o índices de navegación.

## 5. Registrar la evidencia y el grado de verificación

Mantén una tabla de trabajo que vincule cada candidata con sus fuentes concretas. Distingue la existencia de código de la comprobación del comportamiento completo:

| Estado | Criterio |
|---|---|
| Confirmada | El flujo está presente y una prueba pertinente ejecutada u otra comprobación realizada cubre el comportamiento afirmado. |
| Implementada sin verificar | Hay evidencia en código de la implementación, pero no se ha comprobado suficientemente el comportamiento afirmado. |
| Parcial | La evidencia solo cubre una parte del comportamiento o falta una dependencia necesaria. |
| Propuesta | La idea aparece en documentación o backlog, pero no se ha encontrado implementación que la sustente. |

Registra rutas y, cuando sea útil, líneas de código, pruebas y resultados; anota también la configuración necesaria, las dudas y las diferencias entre fuentes. Una prueba con dependencias simuladas demuestra lo que cubre en ese entorno, no necesariamente el funcionamiento completo en producción. La ausencia de un resultado de prueba no demuestra que el comportamiento falle.

| Feature candidata | Actor y resultado | Evidencia | Estado y límite |
|---|---|---|---|
| Cancelar un pedido | Cliente cancela un pedido pendiente | Ruta, regla de negocio y prueba de cancelación | Confirmada para pedidos pendientes en el entorno de prueba |

## 6. Agrupar por dominios y capabilities

Agrupa las features por el resultado funcional que comparten y usa términos reconocibles para sus usuarios. Una capability debe tener suficiente cohesión para que un lector pueda anticipar qué features encontrará en ella y suficiente amplitud para seguir siendo útil cuando se incorporen nuevos comportamientos.

Agrupa las capabilities relacionadas bajo un dominio funcional. Usa los límites del dominio como ayuda, sin asumir que tienen que coincidir con módulos, equipos, servicios o épicas. Para una biblioteca o herramienta técnica, el resultado del desarrollador consumidor es un objetivo válido: por ejemplo, «configurar un proyecto» o «procesar datos». Si una feature encaja en varias carpetas, elige su ubicación principal según su propósito y referencia los demás usos.

Organiza el árbol con tres niveles: **dominio → capability → feature**. El dominio y la capability son carpetas; cada feature es un archivo `.feature` dentro de su capability. Esta jerarquía admite una agrupación funcional intermedia para sistemas grandes y establece la profundidad máxima: no añadas carpetas entre la capability y la feature.

## 7. Revisar la navegación y los escenarios

Presenta el inventario y el árbol a personas que conozcan el producto. Pídeles que localicen reglas concretas y revisen nombres, límites, duplicados, omisiones y comportamientos parciales. Ajusta las agrupaciones a partir de esa revisión.

Redacta ejemplos `Dado/Cuando/Entonces` para las features prioritarias, basados en la evidencia disponible. Un escenario debe expresar una regla observable y su resultado; si no puede sustentarse, márcalo como duda o comportamiento propuesto. Un archivo Gherkin es documentación; para verificarlo automáticamente necesita definiciones de pasos y un runner configurado en el proyecto.

## Ejemplo de estructura

En una tienda, una organización posible sería:

```text
features/
├── compras/                           # dominio
│   ├── gestionar-pedidos/             # capability
│   │   ├── confirmar-pedido.feature
│   │   ├── consultar-estado.feature
│   │   └── cancelar-pedido.feature
│   └── gestionar-carrito/             # capability
│       └── actualizar-carrito.feature
└── pagos/                             # dominio
    ├── procesar-pagos/                # capability
    │   └── pagar-pedido.feature
    └── gestionar-reembolsos/          # capability
        └── reembolsar-pago.feature
```

Las carpetas de primer nivel representan dominios y las del segundo, capabilities; los archivos representan features cuyos escenarios documentan reglas y ejemplos.

La ubicación real depende de las convenciones del repositorio como ruta base de la especificación de features. En SDDF, por ejemplo, puede ser `specs/living/features/`.

## Referencia

- Seb Rose, [Solving: “How to organise feature files?”](https://cucumber.io/blog/bdd/solving-how-to-organise-feature-files/) — organización de documentación Gherkin por áreas funcionales y capabilities.
