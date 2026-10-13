---
type: product
slug: person-user
title: "Persona de usuario"
---

# User Persona

## US-001 — Solo Builder (Cloud)

- **Quién es:** Desarrollador, freelancer o builder técnico que construye software individualmente, sin equipo ni jerarquía.
- **Contexto:** Proyectos propios, side projects o encargos pequeños. Usa un runtime de IA con
  suscripción (Claude, Codex, Copilot). Un proyecto activo a la vez.
- **Objetivos:** Entregar software funcional con proceso estructurado sin adoptar un marco pesado.
  Mantener trazabilidad mínima sin ceremonia.
- **Restricciones:** Cuota de suscripción limitada (tokens). Tiempo fragmentado. Sin equipo de
  soporte. Sin infraestructura propia para correr LLM local.
- **Comportamiento:** Invoca skills directamente desde el CLI del agente. Trabaja una historia a
  la vez. No usa orquestadores porque no los necesita ni quiere pagar su coste en tokens.
- **Dolores:** Pierde tiempo en prompts ad-hoc. Rehace trabajo por falta de especificación.
  Sobrepasa la cuota mensual por sesiones largas.
- **Criterio de éxito:** Termina una historia completa (SPECIFY → DELIVER) usando skills
  individuales, sin superar la cuota, sin abandonar el proceso a mitad de la historia, sin alucinaciones del agente.

## US-007 — Local Builder

- **Quién es:** Desarrollador o investigador con hardware propio (GPU) que prefiere correr LLM
  localmente para tener control total, privacidad o evitar cuotas.
- **Contexto:** Proyectos personales, investigación o entornos air-gapped. Usa llama.cpp como runtime local. Puede tener uno o varios proyectos activos.
- **Objetivos:** Mantener el mismo proceso que un Solo Builder pero con LLM local usando enfoque SDD orientado a Local-first. Aprovechar orquestadores si el runtime lo permite, o invocar skills manualmente si no.
- **Restricciones:** VRAM limitada (no puede cargar contextos enormes). Runtime sin invocación
  anidada nativa (llama.cpp). Sin suscripción, sin cuota mensual, pero con coste de hardware.
- **Comportamiento:** Invoca skills manualmente o usa el orquestador en modo `pipeline`
  (script externo que invoca llama.cpp N veces con contexto aislado).
- **Dolores:** Contextos que se desbordan. Skills que asumen invocación anidada. Falta de
  guías específicas para runtimes locales.
- **Criterio de éxito:** Termina una historia completa usando skills individuales o el
  orquestador `pipeline`, sin desbordar VRAM, logrando trabajar con ventanas de contexto de 32728 tokens (ctx_size máximo objetivo).

## US-005 —  Mantenedor del Harness (dogfood) / Harness Maintainer (dogfood)

- **Quién es:** Desarrollador Mantenedor que evoluciona el propio framework SDDF. Actúa a la
  vez como diseñador del framework, consumidor del mismo (dogfooding) y publicador de versiones.
- **Contexto:** Repositorio `agile-sddf` en GitHub corporativo. Trabaja con un runtime de IA con
  suscripción (Claude Code, Codex y Local con llama.cpp). Puede trabajar solo o con un equipo pequeño de colaboradores. Publica
  versiones en npm con SemVer.
- **Objetivos:** Evolucionar el framework sin romper compatibilidad. Mantener coherencia
  estructural entre capas. Asegurar que cada release es seguro, verificado y documentado. Que
  las mejoras se propaguen a los consumidores sin sorpresas.
- **Restricciones:** Los breaking changes requieren major version y guía de migración. Todo
  cambio debe pasar por el pipeline SDDF completo (dogfooding). Los skills del framework deben
  pasar Skill Shielder. Los test `evals` deben pasar. La documentación (ADR, domains,
  CHANGELOG) debe estar sincronizada antes de publicar.
- **Comportamiento:** Especifica cada mejora como historia usando el harness que construye (dogfooding).
  Usa los diferentes skills y herramientas del propio framework/harness en el ciclo de vida del desarrollo. Ejecuta
 validaciones de seguridad (Skill Shielder) en cada release. Ejecuta pruebas `evals` de los skills
  modificados. Crea y actualiza runbooks de herramientas y desarrollo.
- **Dolores:** Romper compatibilidad sin querer. Deriva entre documentación y código. Evals que
  fallan por cambios colaterales. Publicaciones que rompen consumidores. Security findings en
  skills ya publicados. Cadena de migración que no escala.
- **Criterio de éxito:** Release publicado sin breaking changes inesperados. Todos los evals
  pasan. Security audit sin findings críticos. Documentación sincronizada (ADR, domains,
  CHANGELOG). Guía de migración publicada si aplica. Consumidores actualizan sin fricción.





