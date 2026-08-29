---
type: guide
slug: best-practices-for-system-prompt
title: "Mejores prácticas para el prompt de sistema"
date: 2026-06-16
status: null
substatus: null
parent: null
related:
  - best-practices-for-agents
---
<!-- Referencias -->
[[best-practices-for-agents]]

# Mejores prácticas para el prompt de sistema

Un prompt de sistema (system prompt) es el mensaje completo y el conjunto de instrucciones iniciales que una herramienta envía a una inteligencia artificial en segundo plano, englobando tu petición individual y el contexto adicional que le has proporcionado. El prompt de sistema es la base sobre la que la IA construye su respuesta, por lo que es crucial que esté bien diseñado para obtener resultados óptimos. Su propósito principal es moldear cómo se comportará la IA durante la conversación y dotarla del contexto que desconoce. Un buen prompt de sistema es claro, conciso y relevante, proporcionando a la IA la información necesaria para entender el contexto de tu solicitud y responder de manera efectiva.
En resumen, es la "constitución" invisible que unifica tus instrucciones, las capacidades de la IA y el contexto de tu sistema para que tus solicitudes se ejecuten sin problemas. Un prompt de sistema bien elaborado es esencial para maximizar la utilidad de las herramientas de IA en tu flujo de trabajo diario.

## AGENTS.md

El archivo AGENTS.md complementa un README.md al contener el contexto adicional, a veces detallado, que necesitan los agentes de codificación: pasos de compilación, pruebas y convenciones que podrían saturar un archivo README o que no son relevantes para los colaboradores humanos. Proporcione a los agentes un lugar claro y predecible para recibir instrucciones.
Un único archivo AGENTS.md funciona en muchos agentes, clientes o sdk como OpenCode y Codex. La mayoría de los agentes de codificación incluso pueden generarlo automáticamente si se lo pides amablemente.

### Ubicación de AGENTS.md

Crea un archivo AGENTS.md en la raíz del repositorio. 
En Monorepositorio grande utilizar archivos AGENTS.md anidados para los subproyectos.

### Cubre lo que importa en AGENTS.md

Agregue secciones que ayuden a un agente a trabajar eficazmente con su proyecto. Opciones populares:

* Resumen del proyecto: Una breve descripción del proyecto, su propósito y su stack tecnológico.
* Herramientas y comandos de compilación y prueba: Un "menú" de comandos que la IA puede utilizar para interactuar con tu entorno.
* Preferencias del usuario: Las reglas persistentes sobre cómo debe actuar la IA, su tono, nivel de detalle, etc.
    - Directrices de estilo de código
    - Instrucciones de prueba
    - Consideraciones de seguridad
    - Instrucciones adicionales

### AGENTS.md en Gemini CLI

Configure Gemini CLI para usar AGENTS.md en .gemini/settings.json:

```json
{ "context": { "fileName": "AGENTS.md" }, }
```

## CLAUDE.md

Los archivos CLAUDE.md proporcionan a Claude contexto e instrucciones persistentes para el proyecto. El SDK lee CLAUDE.md cuando se habilita la fuente de configuración correspondiente: 'project' carga CLAUDE.md desde .claude/CLAUDE.m del directorio de trabajo y 'user' carga ~/.claude/CLAUDE.md.

## Prompt de sistema en Github copilot

### copilot-instructions.md

El manual del equipo se guarda en `copilot-instructions.md` en la raíz del repositorio o en `.github/` y se aplica a todo el proyecto. El documento que todo nuevo empleado lee el primer día. «Usamos .NET 8, Clean Architecture y xUnit para las pruebas dotnet buildy la compilación». Copilot lo abre cada vez que le preguntas algo.

### *.instructions.md (con ámbito de ruta)

Las guías se guardan en `.github/instructions/*.instructions.md`. Los archivos con ámbito de ruta `.github/instructions/` se aplican solo a los archivos que coinciden con un patrón. Cada archivo representa una guía específica del equipo. En una gran empresa, el equipo de backend y el equipo de frontend tienen sus propias directrices. Las reglas del equipo de backend no importan a un desarrollador de frontend que trabaja en un botón. Por lo tanto, se escriben guías separadas para distintas áreas del código . ¿Editando un .csarchivo? Copilot lee la guía de .NET. ¿Editando un .htmlarchivo? Omite la guía de .NET y lee la de Angular.

Un archivo con ámbito de ruta:

```
--- 
applyTo:  "**/*.cs" 
excludeAgent:  "code-review" 
--- 
# Convenciones de .NET

- Sigue la arquitectura limpia: Dominio → Aplicación → Infraestructura → API 
- Usa MediatR para CQRS: un manejador por comando/consulta 
- Valida con FluentValidation, no con anotaciones de datos 
- Los métodos asíncronos terminan con `Async`

```
Un repositorio saludable tiene el siguiente aspecto:

```
.github/ 
├── copilot-instructions.md           # repo-wide
 └── instructions/ 
    ├── dotnet.instructions.md        # applyTo: **/*.cs
    ├── angular.instructions.md       # applyTo: **/*.ts, **/*.html
    ├── testing.instructions.md       # applyTo: **/*Tests.cs, **/*.spec.ts
    └── security.instructions.md      # applyTo: **
```

Solo dotnet.instructions.mdse carga cuando trabajas con .csarchivos. copilot-instructions.mdEn su lugar, guarda todo allí y se enviará en cada solicitud, incluidas las de Angular, donde es información irrelevante.

En lo que respecta específicamente a los archivos con ámbito de ruta, al observar cómo la colección github/awesome-copilot organiza sus guías de lenguaje, emerge un patrón consistente:

Propósito : una o dos frases sobre lo que cubre esta capa.
Convenciones básicas : las reglas
Patrones concretos : haga esto, no aquello , con ejemplos.
Herramientas : analizadores de código, formateadores, comandos de compilación/prueba
Cada archivo debe centrarse en una sola función. Un archivo react.instructions.mdno debería abarcar también el backend de Node; ese es un archivo aparte con su propio patrón de búsqueda.

## Ubicación de los archivos de instrucciones de sistema

Github Copilot --> .github/copilot-instructions.md 
Claude (projecto) --> .claude/CLAUDE.md
Claude (global, user) --> ~/.claude/CLAUDE.md
OpenCode, Codex (proyecto) --> AGENTS.md
OpenCode (global) -->  ~/.config/opencode/AGENTS.md
OpenCode (proyecto) --> CLAUDE.md (en el directorio de tu proyecto, si no existe AGENTS.md)
OpenCode (global) --> ~/.claude/CLAUDE.md (se usa si no existe ~/.config/opencode/AGENTS.md)
Gemini (global) --> ~/.gemini/GEMINI.md En tu directorio de trabajo o cualquier directorio principal hasta la raíz del proyecto (identificado por una carpeta .git) o tu directorio principal

## Recomendaciones para escribir archivos de instrucciones de sistema

1. **Mantener concisión (sé breve)**: Es fundamental que tu archivo sea lo más corto posible, manteniendo un límite ideal que no supere las 200 o 300 líneas y no sobrepase las 150-200 instrucciones.
2. **Define la descripción del proyecto concisamente**: Comienza siempre describiendo el proyecto en una sola frase que detalle el tipo de aplicación y el stack tecnológico principal (por ejemplo: "Esta es una aplicación web creada en Next.js...").
3. **Comandos críticos**: Lista solo los comandos de uso diario más importantes, como aquellos requeridos para hacer testeos o compilaciones (builds) del proyecto.
4. **Advertencias y particularidades (Caveats)**: Define explícitamente los casos especiales de tu proyecto que la IA no podría adivinar con solo leer el código; por ejemplo, "nunca modifiques directamente el schema de Prisma" o "no ejecutes un build tras cada modificación pequeña".
5. **Perfil y comportamiento del usuario**: Especifica cómo quieres que la IA te responda. Puedes pedirle que evite rodeos, que no utilice emojis, o que asuma un nivel de desarrollador técnico (senior) para que sus respuestas sean directas y precisas.
6. **No confíes a ciegas en la auto-generación (comandos init)**: Dejar que la IA cree el archivo de sistema usando comandos como /init suele resultar en un documento demasiado largo, verboso e inundado de información innecesaria.
7. **Evita reglas de estilo y formato**: No desperdicies espacio con instrucciones sobre si usar comillas simples, tabulaciones o espacios. En lugar de eso, delega el formateo a linters y formateadores automáticos (como Biome) empleando comandos CLI o hooks de la herramienta.
8. **Omitir información redundante**: Si la información ya está detallada de forma natural en el proyecto, no la incluyas. Ejemplos de esto son comandos listados en el package.json, variables documentadas en .env.example, o descripciones de arquitectura que cambian constantemente; la IA es capaz de buscar y leer estos archivos en tiempo real de ser necesario.
9. **Mejora la organización mediante referencias y "Habilidades"**
   - **Revelación progresiva de información**: No juntes todo en el archivo principal. Mueve la información detallada, como las guías de arquitectura o modelos de base de datos, a una carpeta como doc/ y simplemente haz una referencia en el prompt principal (ej. "lee docs/schema.md al modificar modelos").
   - **Uso de Skills (habilidades)**: Puedes configurar archivos especializados para tareas concretas (como diseño de UI, compilaciones, tareas de backend o frontend) dentro de carpetas como .claude/skills/. De esta forma, la IA invocará esas instrucciones bajo demanda únicamente cuando requiera realizar esas acciones específicas.
   - **Filtros por ruta o extensión**: Algunas herramientas permiten vincular reglas a extensiones de archivo particulares, lo que te permite cargar reglas de pruebas automáticamente solo al modificar archivos de tipo spec.ts, reduciendo el contexto cargado en tareas ajenas al testing.
10. **Mantenimiento y estrategias de escritura**
   - **Mantenlo como un documento vivo**: Las instrucciones deben actualizarse conforme trabajes. Si observas que la IA usa rutinariamente una librería de testing equivocada o se desvía del objetivo, corrige el archivo de sistema en ese mismo instante.
   - **Priorización posicional**: Los modelos de lenguaje prestan mayor atención al principio y al final de los prompts. Asegúrate de ubicar las instrucciones más cruciales en la parte más alta de tu archivo.
   - **Utiliza señales de énfasis**: Usa palabras en mayúsculas como "IMPORTANTE" o imperativos categóricos para ayudar a la IA a priorizar reglas estrictas.
11. **Estructura y ecosistema Multi-herramienta**
   - **Niveles Globales vs. Proyecto**: Aprovecha un archivo a nivel global (por ejemplo, ~/.claude/CLAUDE.md o ~/.config/opencode/AGENTS.md) para definir preferencias personales que apliquen a todos tus proyectos. En contraste, usa el nivel de carpeta o directorio del proyecto solo para instrucciones únicas de dicho entorno.
   - **Sincroniza tus herramientas**: Ya que diferentes IAs de programación o IDEs buscan distintos nombres de archivos (como CLAUDE.md para Claude Code y AGENTS.md para Codex u OpenCode), se recomienda unificar la fuente creando ambos, o mejor aún, usando un enlace simbólico (symlink: ln -sf CLAUDE.md AGENTS.md) para mantener un solo documento de instrucciones que sirva a todas las herramientas, evitando así la duplicación y el riesgo de desincronización.
