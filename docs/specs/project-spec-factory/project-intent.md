# Project Intent: ProjectSpecFactory

**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-04
**Generado por**: product-manager-agent

---

## Definición del Problema

El ciclo de especificación de software con IA es inconsistente y no estructurado. Builders, freelancers, developers y PMs técnicos pierden horas corrigiendo outputs de IA porque no cuentan con un sistema que traduzca la intención inicial en requisitos precisos y accionables.

Los síntomas concretos por perfil:

- **El Builder con idea** tiene la idea clara en la cabeza, pero cuando se la explica a la IA, el resultado no se parece en nada a lo que imaginó.
- **El Freelancer y Consultor** sabe que cada proyecto con IA empieza de cero: sus prompts son inconsistentes y pierde horas rehaciendo lo que la IA genera mal.
- **El Developer** usa Claude, Cursor o Copilot sin un sistema estructurado. Sabe que podría trabajar de forma más profesional y sacar más provecho de las herramientas.
- **El PM / Founder Técnico** tiene la visión del producto pero depende de un equipo para construirlo. La IA debería acortar ese gap, pero sin estructura no lo hace.

El impacto es retrabajo, inconsistencia entre proyectos y pérdida de confianza en la IA como herramienta de desarrollo.

## Visión (elevator pitch)

- **Para:** Builders, freelancers, developers y PMs técnicos que usan IA para construir software.
- **Quiénes:** Pierden tiempo y calidad porque no tienen un sistema estructurado para traducir su intención en especificaciones precisas que la IA pueda ejecutar de forma predecible.
- **Nuestro producto:** ProjectSpecFactory.
- **Es un/a:** Sistema multiagente minimalista de especificación de proyectos software, implementado como skills, agentes y templates para Claude.
- **Que provee:** Un workflow secuencial (begin-intention → project-spec → project-planning) que convierte la intención inicial en un backlog planificado, con control de WIP y revisión humana en cada etapa.
- **A diferencia de:** Escribir prompts a mano, usar plantillas sueltas o frameworks genéricos como BMAD que no integran el ciclo completo ni adaptan las preguntas al contexto del proyecto.
- **Nuestro producto:** Es el único sistema que extrae dinámicamente las secciones de los templates en runtime para derivar las preguntas, garantizando que el proceso de especificación evolucione junto con los templates sin necesidad de actualizar lógica hardcodeada.

## Beneficios Clave

- Reducción del retrabajo con IA: al proveer requisitos precisos y contexto cerrado, la generación de código se vuelve una consecuencia predecible en lugar de un punto de partida para correcciones.
- Consistencia entre proyectos: el mismo workflow y los mismos criterios de calidad se aplican a cada proyecto, independientemente del desarrollador o el momento.
- Trazabilidad del proceso de especificación: cada documento incluye metadatos de estado y generación, permitiendo rastrear quién generó qué y en qué momento del ciclo.

## Criterios de Éxito

- [ ] Al menos 3 usuarios activos utilizan el sistema dentro de los primeros 3 meses desde el lanzamiento.
- [ ] Un proyecto completo puede especificarse de inicio a fin (begin-intention → project-planning) sin intervención manual fuera de las revisiones humanas previstas en el workflow.
- [ ] Los documentos generados no requieren reescritura significativa: el usuario puede avanzar al siguiente estado con ajustes menores o sin ajustes. [inferido: "reescritura significativa" se define como cambios estructurales o de contenido que superen el 30% del documento generado]

## Restricciones

- **Technical**: Solución implementada exclusivamente como skills, agentes y templates para Claude. Sin UI gráfica, solo CLI/comandos. Los agentes extraen headers `##` y comentarios `<!-- -->` de los templates en runtime para derivar las preguntas y completar los documentos.
- **Time**: Sin deadline fijo confirmado. [inferido: prioridad en lanzar un MVP funcional que cubra el workflow completo antes de iterar]
- **Resources**: Proyecto individual o equipo pequeño. [inferido] Sin integraciones externas ni dependencias de terceros fuera del ecosistema de Claude.

## Fuera de alcance (Non-Goals)

- No incluye interfaz gráfica (UI). La interacción es exclusivamente mediante CLI y comandos.
- No incluye ejecución de código ni despliegue de aplicaciones.
- No maneja múltiples proyectos en paralelo (WIP=1).
- No incluye integración con herramientas de gestión como Jira o Linear. El almacenamiento es exclusivamente en archivos locales bajo `docs/specs/project/`.
- No incluye validación semántica avanzada de requisitos.
- No incluye generación automática de código a partir de las especificaciones. [inferido: el sistema produce specs, no código]
