# User Persona

## US-001 — Desarrollador (Cloud) / Developer (Cloud)

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

## US-007 — Desarrollador (Local) / Developer (Local)

- **Quién es:** Desarrollador o investigador con hardware propio (GPU) que prefiere correr LLM
  localmente para tener control total, privacidad o evitar cuotas.
- **Contexto:** Proyectos personales, investigación o entornos air-gapped. Usa llama.cpp como runtime local. Puede tener uno o varios proyectos activos.
- **Objetivos:** Mantener el mismo proceso que un Solo Builder pero con LLM local. Aprovechar
  orquestadores si el runtime lo permite, o invocar skills manualmente si no.
- **Restricciones:** VRAM limitada (no puede cargar contextos enormes). Runtime sin invocación
  anidada nativa (llama.cpp). Sin suscripción, sin cuota mensual, pero con coste de hardware.
- **Comportamiento:** Invoca skills manualmente o usa el orquestador en modo `pipeline`
  (script externo que invoca llama.cpp N veces con contexto aislado).
- **Dolores:** Contextos que se desbordan. Skills que asumen invocación anidada. Falta de
  guías específicas para runtimes locales.
- **Criterio de éxito:** Termina una historia completa usando skills individuales o el
  orquestador `pipeline`, sin desbordar VRAM, logrando trabajar con ventanas de contexto de 32728 tokens (ctx_size máximo objetivo).

  