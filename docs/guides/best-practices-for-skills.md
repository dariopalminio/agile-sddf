---
type: guide
slug: best-practices-for-skills
title: "Buenas prácticas para LLM Clients: Skills"
date: 2026-03-26
status: null
substatus: null
parent: null
related:
  - best-practices-for-agents
  - best-practices-for-commands
  - harness-engineering
---
<!-- Referencias -->
[[best-practices-for-agents]]
[[best-practices-for-commands]]

# Buenas prácticas para LLM Clients: Skills

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de skills:

## Skills (Habilidades)

Una habilidad es un procedimiento. Un manual de instrucciones.

### Estructura de un skill

La estructura principal de un skill es la siguiente:
```
my-skill-name/ 
 ├── SKILL.md             # archivo principal del skill, requerido
 ├── references/          # documentación de referencia extensa, opcional
 ├── scripts/             # funciones auxiliares opcionales
 ├── assets/              # plantillas, fragmentos de código
 └── evals/               # pruebas del skill, opcional
```

Solo un nivel de profundidad. No. references/v1/handbook.md Solo references/handbook.md.

### Ubicación de los skills

Claude (Proyecto, Compatible con OpenCode)--> .claude/skills/<name>/SKILL.md

Claude (Global, Compatible con OpenCode) --> ~/.claude/skills/<name>/SKILL.md

OpenCode (Configuración del proyecto) --> .opencode/skills/<name>/SKILL.md

OpenCode (Configuración global) --> ~/.config/opencode/skills/<name>/SKILL.md

OpenCode (Compatible con agente de proyecto) --> .agents/skills/<name>/SKILL.md

OpenCode (Compatible con agentes globales) --> ~/.agents/skills/<name>/SKILL.md

Github Copilot (Proyecto) --> .github/skills/<name>/SKILL.md

Github Copilot (Global) --> ~/.copilot/skills/<name>/SKILL.md


### Skills en Github Copilot (Habilidades del Agente)

Las habilidades describen lo que Copilot sabe hacer. Son el mecanismo más avanzado y reutilizable. A diferencia de los simples comandos /, los Skills son carpetas completas que incluyen no solo instrucciones, sino también scripts, recursos y, crucialmente, lógica interna para interactuar con el sistema de archivos, convirtiéndose en una "mini aplicación" que el agente puede ejecutar. Se almacenan en .github/skills/<skill-name>/SKILL.md a nivel de proyecto o en ~/.copilot/skills/ para uso personal.

Una SKILL.mdcarga en tres niveles:

1. **Metadatos** (siempre cargados) — name y description desde el frontmatter. Coste de contexto insignificante.
2. **Cuerpo** (cargado al activarse): el contenido completo SKILL.md. Se carga solo cuando la descripción coincide con la intención del usuario.
3. **Referencias** (cargadas bajo demanda): archivos en references/, scripts/, assets/. Se cargan solo si el agente las busca.

La implicación es la siguiente: las habilidades son el único elemento de personalización que permite almacenar contenido ilimitado con un coste de inactividad prácticamente nulo. Por eso son el lugar ideal para guardar material de referencia extenso, manuales de migración y cualquier documento procedimental.

#### Metadatos del skill

```yaml
--- 
nombre:  migrating-razor-to-angular 
descripción:  Migra  vistas Razor de ASP.NET  MVC  a componentes independientes de Angular 20. Úselo al convertir archivos .cshtml , reemplazar la representación del lado del servidor con componentes del lado del cliente o modernizar vistas MVC heredadas . No lo use para la creación de nuevos componentes en proyectos desde cero .
---                                
```

Característica del metadato:

1. Descripción en tercera persona. "Migra", no "yo migro" . El punto de vista inconsistente dificulta el descubrimiento.
2. Desencadenantes específicos. "Convertir archivos .cshtml" , "reemplazar la representación del lado del servidor" : las frases exactas que usan los usuarios.
3. Disparadores negativos. “No lo utilice para la creación de nuevos componentes en proyectos desde cero”. Indique al entorno de ejecución cuándo no debe activarse.
4. Reglas estrictas: `name:` debe estar en minúsculas, usar guiones en lugar de espacios y coincidir exactamente con el nombre de la carpeta.
5. Asegúrese de que los nombres de las habilidades sean únicos en todas las ubicaciones
6. El tamaño en caracteres de la descripción debe ser ~255 caracteres y no debe superar los 500 caracteres para evitar un coste de contexto excesivo. Si la descripción es demasiado larga, recorte el texto y mueva detalles al cuerpo.

Característica del cuerpo del skill:

1. Título/Objetivo (Title, Qué hace este skill)— una frase sobre lo que permite la habilidad
2. Cuándo usar el skill (When to Use This Skill)— escenarios desencadenantes concretos como balas
3. Prerrequisitos (Parámetros, entradas, precondiciones) — entrada, herramientas y dependencias necesarias
4. Flujo de ejecución (Step-by-Step, Workflows)— pasos de procedimiento numerados.
5. Advertencias (Gotchas, Problemas comunes)— advertencias proactivas que evitan errores
6. Recomendado (Troubleshooting, Solución de problemas) — tabla de síntomas y soluciones
7. References (opcional) — punteros a archivos en `references/`
8. El cuerpo sigue la siguiente estructura: Descripción → Entradas → Flujo de trabajo → Salida → Validación

Cada línea de una habilidad debería enseñar algo que Copilot podría interpretar erróneamente o pasar por alto por completo.
Mantener un cuerpo conciso. Deshazte del volumen moviendo a references/. Un cuerpo de 2000 líneas SKILL.md anula el propósito.

#### Seguridad en skills

Las habilidades pueden incluir código ejecutable. Este poder hace que las habilidades maliciosas sean peligrosas. GitHub advierte: «Inspeccione siempre el contenido de una habilidad antes de instalarla gh skill preview». Instale solo desde fuentes confiables.

#### Verifica qué es lo que realmente está cargado

Puedes pasar una hora optimizando archivos que ni siquiera se cargan. No adivines:

VS Code: haga clic con el botón derecho en la vista de chat → Diagnóstico . Muestra todos los archivos de instrucciones cargados y cualquier error.
Coloca el cursor sobre cualquier respuesta de Copilot para ver qué modelo la procesó.
Copilot CLI: /context muestra el uso de la ventana; /skills info <name> confirma que se ha cargado una habilidad.

### Skills en Claude

Los skills son las **habilidades personalizadas o herramientas** que construyes para dárselas a tus agentes. Se definen mediante documentos de texto que actúan como instrucciones continuas para dotar al agente de una especialización deseada, indicándole exactamente cómo debe comportarse o ejecutar una acción exclusiva. Gracias a las skills, los agentes pueden realizar tareas de forma autónoma, como redactar una especificación siguiendo una plantilla, conectarse a aplicaciones externas o aplicar técnicas específicas de escritura.

Assets empaquetados por skill: cada skill incluye su propio subdirectorio `assets/` para portabilidad multi-cliente. Los templates y recursos se copian junto con el skill en la instalación, lo que garantiza que cada skill tenga acceso a sus propios assets sin depender de rutas globales o hardcodeadas.

## Modelo de delegación: composición de skills + un solo salto de subagente

Distinguimos dos mecanismos de invocación, según cómo funciona realmente el harness de Claude Code (ver `[[harness-engineering]]`):

- **Composición (skill → skill, inline):** cuando un skill invoca a otro skill, la misma sesión lee el SKILL.md del sub-skill y sigue sus instrucciones dentro de la misma conversación. No se crea un segundo agente ni un contexto aislado. **Está permitido componer skills, pero con cadenas cortas, porque el contexto se acumula** (las instrucciones de todos los skills compuestos quedan activas simultáneamente en la misma ventana de contexto).
- **Delegación (→ subagente):** lanzar un subagente crea un contexto nuevo y aislado. **Solo la sesión que ejecuta skills puede delegar en subagentes; un subagente nunca delega en otro subagente.** El subagente escribe su resultado en `.tmp/<skill-name>/` y devuelve el control.

El skill es el punto de entrada y coordinador: orquesta la ejecución, delega trabajo aislado o paralelo a agentes especialistas y consolida sus resultados en la salida final.

```
skill orquestador (entry point, sesión principal)
    ├── skill B (composición inline — misma sesión, cadena corta)
    ├── agent A (subagente — contexto aislado)
    └── agent C (subagente — contexto aislado)
                  └── ✗ prohibido: agente que delega en otro agente
```

Criterio de elección: **inline** cuando se necesita continuidad de contexto e interacción con el usuario; **subagente** cuando se necesita aislamiento, paralelismo, o proteger la sesión principal de trabajo voluminoso (ej. leer 50 archivos para producir un informe de 20 líneas).

Esto es acorde a la arquitectura de Claude Code, donde la sesión principal actúa como agente primario que ejecuta skills inline y mantiene una estructura plana de delegación (Sesión → Subagente), con agentes en `.claude/agents/` invocados por la sesión principal.

### Subagentes y skills

**Los subagentes no invocan skills orquestadores.** Si un subagente necesita la lógica de un skill, el skill orquestador se la pasa como parte de su prompt (o referencia el archivo para que el subagente lo lea con `Read`). Los skills orquestadores solo se ejecutan en la sesión principal.

Un subagente sí puede seguir un skill **worker**, es decir, un skill que cumple las tres condiciones:

1. **No interactúa con el usuario** — sin pasos que requieran AskUserQuestion ni confirmaciones (o que puedan correr con defaults, sin preguntas).
2. **No lanza subagentes** — si lo hiciera, se produciría subagente → subagente, el caso prohibido.
3. **No depende de contexto conversacional no provisto** — el subagente arranca con contexto vacío; el orquestador debe pasarle en el prompt los valores ya resueltos (ej. `SPECS_BASE`, ruta de la historia) o el subagente debe poder re-ejecutar `skill-preflight` por su cuenta.

Matriz de invocaciones permitidas:

| Invocación | ¿Permitido? |
|---|---|
| skill → skill (inline, sesión principal) | ✅ cadenas cortas |
| skill → subagente | ✅ un solo salto |
| subagente → skill **worker** | ✅ inline dentro del subagente, con contexto provisto en el prompt |
| subagente → skill **orquestador** | ❌ delegación encubierta de segundo nivel |
| subagente → subagente | ❌ prohibido |

Nota: la garantía más fuerte no es esta prosa sino el harness — los agentes de `.claude/agents/` declaran listas de `tools` restringidas que no incluyen `Skill`. Mantener esas listas mínimas es lo que hace la regla verificable; un agente nuevo con `tools: *` la anularía silenciosamente.

## Patrón de comunicación inter-agente: `.tmp/<skill>/`

Cuando un skill orquesta múltiples subagentes en paralelo, cada subagente debe escribir sus resultados de forma **independiente** en un directorio temporal aislado, evitando el "teléfono descompuesto" (ver `[[harness-engineering]]`).

### Convención

```
.tmp/
└── <skill-name>/
    ├── <agent-a-output>.md
    ├── <agent-b-output>.md
    └── <agent-c-output>.md
```

### Reglas

1. **Cada skill tiene su propio subdirectorio** `.tmp/<skill-name>/` — nunca se comparte el directorio `.tmp/` raíz entre skills.
2. **Los subagentes escriben directamente** en `.tmp/<skill-name>/` sin recibir el contexto completo del skill orquestador.
3. **El skill sintetizador** (agente final) lee solo los archivos de `.tmp/<skill-name>/` que necesita, no el contexto de la sesión.
4. **El directorio `.tmp/` no se versiona** — debe estar en `.gitignore`.

### Ejemplo: skill `reverse-engineering`

```
.tmp/
└── rfc-architecture.md       # escrito por reverse-engineer-architect
└── rfc-features.md           # escrito por reverse-engineer-product-discovery
└── rfc-business-rules.md     # escrito por reverse-engineer-business-analyst
└── rfc-navigation.md         # escrito por reverse-engineer-ux-flow-mapper
```

El agente `reverse-engineer-synthesizer` lee solo esos cuatro archivos para generar el artefacto final, sin acceder al contexto de la sesión principal.

## Patrón de invocación de agentes locales (`<skill>/agents/`)

Un skill puede empaquetar **agentes locales** en su directorio `agents/` (ej. `story-code-review/agents/tech-lead-reviewer.agent.md`). Estos agentes **no son tipos registrados por el harness** — solo los de `.claude/agents/` lo son. Son archivos de instrucciones que viajan empaquetados con el skill.

### Cuándo usar agente local vs. agente registrado

| Tipo | Cuándo | Características |
|------|--------|-----------------|
| **Local** (`<skill>/agents/`) | Uso exclusivo de un skill | Viaja con el skill (npm); sin `tools:` ni `model:`; invocado solo por el skill dueño |
| **Registrado** (`.claude/agents/`) | Reutilizable por varios skills o por la sesión | Tipo registrado por el harness; declara `tools:` restringidas y `model:` |

### Contrato de invocación (ver [[ADR-0002-invocacion-agentes-locales-de-skill]])

Para lanzar `agents/<nombre>.agent.md`, el skill orquestador (sesión principal):

1. **Lee** el archivo del agente con `Read`.
2. **Lanza un subagente** vía Agent tool con `subagent_type: general-purpose`, cuyo prompt es: el contenido íntegro del archivo del agente + un **bloque de contexto** con las variables resueltas que el agente necesita (`$STORY_DIR`, `$SPECS_BASE`, rutas de input...). Nunca el contexto completo de la sesión.
3. El subagente **escribe su resultado** en la ruta declarada en el frontmatter `output:` del agente (bajo `.tmp/<skill-name>/`) y devuelve el control.
4. El orquestador **lee solo los outputs** de `.tmp/<skill-name>/` para consolidar.

Este patrón de invocación y el patrón de comunicación `.tmp/<skill>/` (sección anterior) son las dos mitades del mismo contrato.

### Formato del archivo agente local

```yaml
---
name: <nombre-kebab>
description: >-
  Subagente del skill <skill-dueño>. <Qué hace>.
  Invocado exclusivamente por el orquestador <skill-dueño> — no invocar directamente.
role: <Rol interpretativo>
output: .tmp/<skill-name>/<nombre>-report.md
---
```

El body contiene las instrucciones completas del agente (misión, contexto que recibe, criterios, formato del output). Como el subagente es `general-purpose` (sin restricción de `tools:` declarada), cualquier restricción de herramientas debe expresarse en las instrucciones del propio agente.

Nota:
**alwaysApply**: El campo alwaysApply en headers controla si el archivo se inyecta automáticamente en el contexto de cada conversación:
    - alwaysApply: true — Claude Code incluye este archivo en el contexto siempre, sin que el usuario lo pida. Útil para instrucciones globales (ej: CLAUDE.md de un skill).
    - alwaysApply: false — el archivo no se carga automáticamente; solo entra en contexto si el usuario lo referencia explícitamente, o si Claude lo lee con una herramienta.
Es un metadato del runtime para Claude, no del schema SDDF, y borrarlo cambiaría el comportamiento de Claude Code con ese archivo.

https://agentskills.io/home




