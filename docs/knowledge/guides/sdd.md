# Spec Driven Development (SDD)

## Qué es Spec Driven Development
Spec Driven Development propone, en esencia que la especificación preceda y guíe al código. No es un marco de trabajo ni una metodología prescriptiva como scrum. Es más bien un enfoque de trabajo que propone:

Escribir primero una especificación clara de lo que se quiere construir: objetivos, reglas de negocio, criterios de aceptación, restricciones técnicas.

Usar esa especificación como fuente tanto para humanos como para agentes de IA.

Generar código a partir de la spec, no de prompts improvisados.

Como lo resume GitHub en su documentación de Spec Kit: "En este nuevo mundo, mantener software significa evolucionar especificaciones. [...] El código es el enfoque de última milla."[1]

SDD no propone documentación extensiva estilo waterfall. Propone especificaciones vivas, ejecutables y versionadas que evolucionan con el código. Como GitHub lo describe: "Spec-Driven Development no se trata de escribir documentos de requisitos exhaustivos que nadie lee. Tampoco se trata de planificación waterfall."[1]

## Herramientas del ecosistema SDD

El ecosistema de herramientas SDD está creciendo rápidamente:

- **OpenSpec:** OpenSpec es un framework de SDD ("capa de definición de requisitos") creado por Fission AI, publicado bajo licencia MIT. Su flujo principal es: /opsx:propose ──► /opsx:apply ──► /opsx:archive [2].

- **GitHub Spec Kit:** Toolkit open source que proporciona un flujo estructurado: Constitution → Specify → Plan → Tasks → Implement. Funciona con Copilot, Claude Code y otros [3].

- **Kiro (AWS):** IDE basado en VS Code con flujo integrado de Requirements → Design → Tasks.

- **Tessl Framework:** Explora el nivel spec-as-source con mapeo 1:1 entre specs y archivos de código.

- **BMAD Method:** Usa agentes virtuales (Analyst, Product Manager, Architect) para generar PRDs y specs de arquitectura.

- **Open SPDD:** Enfoque Structured-Prompt-Driven Development (SPDD) enfatiza prompts estructurados para generar código a partir de specs. El departamento de TI interno de Thoughtworks utiliza LLMs para sus equipos y ha desarrollado un método y flujo de trabajo denominado Desarrollo Estructurado Guiado por Indicaciones (SPDD). El flujo de trabajo SPDD consta de los siguientes pasos: create initial requirements → clarify analysis → generate analysis context → generate structured prompt → generate code → generate unit test → integrate-build-and-deploy [4][5].

- **Superpowers:** Es un Claude Plugin de desarrollo low-code que se integra con OpenSpec para ejecutar el flujo SDD. Superpowers la de "capa de ingeniería de software" [6]. Es una metodología completa de desarrollo de software para tus agentes de codificación, construida sobre un conjunto de skills combinables y algunas instrucciones iniciales que garantizan que tu agente las utilice.


Referencias:
[1]: GitHub Blog - Spec-driven development with AI: github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai 
[2]: https://openspec.dev/
[3]: https://speckit.org/
[4]: https://martinfowler.com/articles/structured-prompt-driven/?shem=rimspwouoe
[5]: https://github.com/gszhangwei/open-spdd/tree/main
[6]: https://github.com/obra/superpowers


