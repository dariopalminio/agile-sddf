# Spec Driven Development (SDD)

## Qué es Spec Driven Development
Spec Driven Development propone, en esencia que la especificación preceda y guíe al código. No es un marco de trabajo ni una metodología prescriptiva como scrum. Es más bien un enfoque de trabajo que propone:

1. **Specify:** Escribir primero una especificación clara de lo que se quiere construir: objetivos, reglas de negocio, comportamiento, criterios de aceptación y requisitos, restricciones técnicas. Sin prescribir cómo se implementa.
2. **Plan:** Definir cómo se va a construir: arquitectura y diseño (tecnologías, modelos de datos, contratos, interfaces, error handling) y tareas.
3. **Implement:** Escribir el código siguiendo la especificación y el plan (validando mediante TDD y pruebas automáticas).
4. **Validate:** Verificar que la implementación cumple con la especificación sin errores (por ejemplo, mediante pruebas de aceptación automatizadas, revisiones de código y aceptación humana).

```
Human review           Human review           Human review        Automated + Human
       :                      :                      :                      :
       v                      v                      v                      v
+--------------+       +--------------+       +--------------+       +--------------+
|   Specify    | ----> |     Plan     | ----> |  Implement   | ----> |   Validate   |
| What to build|       | How to build |       |   Build it   |       |  Verify it   |
+--------------+       +--------------+       +--------------+       +--------------+
       ^                                                                    |
       |                                                                    |
       + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  +
                              Refine spec if needed
```

Con este enfoque se busca usar las especificaciones vivas como fuente de la verdad, tanto para humanos como para agentes de IA, para generar código robusto a partir de la spec, no de prompts improvisados.

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

- **Gentle AI:** Proyecto open source que explora el uso de agentes de IA para generar código a partir de especificaciones [7]. Es un configurador de ecosistemas que toma cualquier agente de codificación de IA que utilices y lo potencia con memoria persistente, flujos de trabajo de desarrollo guiado por especificaciones (SDD), habilidades de codificación seleccionadas, servidores MCP, un selector de proveedores de IA, un perfil orientado a la enseñanza con permisos que priorizan la seguridad y asignación de modelos por fase para que cada paso de SDD pueda ejecutarse en un modelo diferente.

- **Agent Skills:** Las habilidades codifican los flujos de trabajo, los controles de calidad y las mejores prácticas que utilizan los ingenieros sénior al desarrollar software. Estas se empaquetan para que los agentes de IA las sigan de forma coherente en cada fase del desarrollo [8]. Skills para un flujo de trabajo completo de SDD: Define, Plan, Build, Verify, Review, Ship.

- **Spec-Driven Development Skill:** Skill que implementa un flujo de trabajo completo de SDD basado en especificaciones [9]. Compatible con Claude Code, Cursor, GitHub Copilot, JetBrains Junie, Windsurf y herramientas similares.


Referencias:
[1]: GitHub Blog - Spec-driven development with AI: github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai 
[2]: https://openspec.dev/
[3]: https://speckit.org/
[4]: https://martinfowler.com/articles/structured-prompt-driven/?shem=rimspwouoe
[5]: https://github.com/gszhangwei/open-spdd/tree/main
[6]: https://github.com/obra/superpowers
[7]: https://github.com/Gentleman-Programming/gentle-ai
[8]: https://github.com/addyosmani/agent-skills
[9]: https://github.com/mariano-aguero/spec-driven-development-skill


