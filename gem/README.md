

#  ProjectSpecFactory Gem para Spec Driven Development Framework (SDDF)

Solución Gemini Gems como ProjectSpecFactory experto personalizado para construir especificación de proyectos (o iniciativas) de software. Las ProjectSpecFactory Gems son expertos de IA personalizados que brindan ayuda sobre especificación de proyectos de software. 

Aprovechar el ecosistema de Google (Workspace, AI Studio)
Orientado a usuarios no técnicos (product managers, diseñadores, stakeholders) que quieren participar activamente en la definición de sus proyectos sin necesidad de usar herramientas de desarrollo o documentación tradicionales. La gem actúa como un asistente interactivo que guía al usuario a través de una serie de preguntas y respuestas para capturar la intención del proyecto, los requisitos y la planificación, generando automáticamente documentos estructurados y visuales que pueden compartirse fácilmente dentro del ecosistema de Google (Docs, Sheets, Slides). El enfoque está en la usabilidad, la colaboración y la generación de outputs visuales y fáciles de entender para todos los stakeholders.

#  Instrucción para crear las Gemas

1. Ir a: https://gemini.google.com/

2. Para crear tus propios Gems de Gemini, tienes que abrir el menú lateral de la web o la aplicación móvil. Una vez dentro, pulsa en la opción Descubrir Gems que te aparecerá.

3. Esto te llevará a una pantalla donde puedes ver una lista de Gems creados por la propia Google, y debajo el apartado donde aparecen los que hayas creado tú. Aquí, pulsa en el botón +Nuevo Gen que te aparecerá para iniciar el proceso de creación de uno nuevo desde cero.

4. Esto te va a llevar a la pantalla donde tendrás que rellenar los tres campos necesarios para crear tu Gem. Tendrás que darle un nombre, unas instrucciones y una base de conocimientos en el caso de que esta última sea necesaria. 

**Nombre de la Gem:** [ prompt-ps-begin-intention, prompt-ps-discovery o prompt-ps-planning]

**Descripción:** [ descripción que corresponda ]

**Instrucciones:** Copia las instrucciones del archivo `gem\[nombre_del_prompt].md` y pégalas aquí. Estas instrucciones guiarán el comportamiento de la Gem y definirán cómo debe interactuar con los usuarios para ayudarles a especificar sus proyectos de software.

**Conocimiento:** Debes adjuntar los archivos plantillas localizados en `shared\reference-templates` como parte de tu conocimiento. Estos templates son la base para generar los documentos de especificación del proyecto y guiar tus interacciones con el usuario.

5. Pulsa en el botón Guardar.

6. Prueba el Gem antes de guardarlo.

#  Gema ps-begin-intention

**Nombre de la Gem:** ps-begin-intention

**Descripción:** Gema experta en Product Management para la fase de descubrimiento y definición de la intención del proyecto. Su función es guiar a los usuarios a través de un proceso estructurado para capturar la visión, objetivos, usuarios y contexto del proyecto, generando un documento de intención del proyecto que servirá como base para las siguientes fases de especificación.

**Instrucciones:** Copia las instrucciones del archivo `gem\prompt-ps-begin-intention.md` y pégalas aquí. Estas instrucciones guiarán el comportamiento de la Gem y definirán cómo debe interactuar con los usuarios para ayudarles a especificar sus proyectos de software.

**Conocimiento:** Debes adjuntar el archivo plantilla localizado en `shared\reference-templates\project-intent-template.md` como parte de tu conocimiento. Este template es la base para generar los documentos de especificación del proyecto y guiar tus interacciones con el usuario.

#  Gema ps-discovery

**Nombre de la Gem:** ps-discovery

**Descripción:** Gema experta en Product Management, Arquitectura de Software y UX Design para la fase de descubrimiento y análisis de requisitos del proyecto. Su función es guiar a los usuarios a través de un proceso estructurado para capturar los requisitos, identificar las necesidades del usuario y definir el alcance del proyecto, generando un documento de especificación de requisitos que servirá como base para las siguientes fases de planificación.

**Instrucciones:** Copia las instrucciones del archivo `gem\prompt-ps-discovery.md` y pégalas aquí. Estas instrucciones guiarán el comportamiento de la Gem y definirán cómo debe interactuar con los usuarios para ayudarles a especificar sus proyectos de software.

**Conocimiento:** Debes adjuntar el archivo plantilla localizado en `shared\reference-templates\requirements-spec-template.md` como parte de tu conocimiento. Este template es la base para generar los documentos de especificación del proyecto y guiar tus interacciones con el usuario.

#  Gema ps-planning

**Nombre de la Gem:** ps-planning

**Descripción:** Gema experta en Arquitectura de Software para la fase de planificación del proyecto. Su función es guiar a los usuarios a través de un proceso estructurado para definir la planificación del proyecto, incluyendo la asignación de recursos, la definición de hitos y la gestión de riesgos, generando un documento de planificación que servirá como base para la ejecución del proyecto.

**Instrucciones:** Copia las instrucciones del archivo `gem\prompt-ps-planning.md` y pégalas aquí. Estas instrucciones guiarán el comportamiento de la Gem y definirán cómo debe interactuar con los usuarios para ayudarles a especificar sus proyectos de software.

**Conocimiento:** Debes adjuntar el archivo plantilla localizado en `shared\reference-templates\project-plan-template.md` como parte de tu conocimiento. Este template es la base para generar los documentos de especificación del proyecto y guiar tus interacciones con el usuario.



