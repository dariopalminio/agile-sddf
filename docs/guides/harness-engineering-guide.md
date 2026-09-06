# Guía de Harness Engineering

**Harness Engineering** (Ingeniería de Arneses) es la disciplina emergente que está transformando la forma en que construimos software con agentes de IA. No se trata de escribir mejores prompts, sino de **diseñar el entorno en el que los agentes operan** para que produzcan resultados confiables, repetibles y auditables.

---

## 1. ¿Qué es Harness Engineering?

### 1.1 Definición

Harness Engineering es la práctica de diseñar el **entorno de ejecución completo** alrededor de un agente de IA autónomo: las reglas, restricciones, bucles de retroalimentación y compuertas de verificación que gobiernan su comportamiento a lo largo de una tarea completa.

En palabras simples: **Harness Engineering es el arte de construir el "arnés" que mantiene al agente en el camino correcto**. Mientras que el Prompt Engineering optimiza la calidad de un intercambio individual y el Context Engineering gestiona qué información ve el modelo, el Harness Engineering **construye el mundo en el que el agente opera**.

> "Agents aren't hard; the Harness is hard." — **Ryan Lopopolo, OpenAI**

### 1.2 El origen del concepto

El término "harness" fue popularizado por **Mitchell Hashimoto** (fundador de HashiCorp) en febrero de 2026, cuando describió su hábito de, cada vez que un agente cometía un error, **ingeniar una solución permanente en el entorno del agente** para que ese error no volviera a ocurrir. Poco después, OpenAI y Anthropic publicaron artículos expandiendo la idea, y el término Harness Engineering se consolidó.

### 1.3 El experimento que lo demostró

OpenAI realizó un experimento que puso a Harness Engineering en el mapa:

- **Equipo**: 3 a 7 ingenieros
- **Duración**: 5 meses
- **Resultado**: 1 millón de líneas de código, **cero escritas por humanos**
- **Entregables**: 1.500 PRs fusionados, todos generados por Codex

El experimento demostró que **el cuello de botella ya no es escribir código, sino diseñar el entorno** que permite a los agentes escribirlo de forma confiable.

---

## 2. Harness Engineering vs. Agent Harness: una distinción crucial

Es fundamental no confundir dos conceptos relacionados pero distintos:

| Concepto | Definición | Analogía |
|----------|------------|----------|
| **Agent Harness** | El sistema de control técnico que gestiona la ejecución del agente: herramientas, memoria, reintentos, aprobaciones, etc. | El **hardware** o **framework** |
| **Harness Engineering** | La **metodología** para diseñar, construir y mantener ese sistema de control | La **ingeniería** y las **prácticas** detrás del framework |

**Ejemplo**: LangChain, LangGraph o CrewAI son **frameworks** para construir agentes, pero no son un Harness. Un Harness responde a la pregunta: *"Cuando el agente está en ejecución, ¿cómo interactúa el mundo con él?"*

---

## 3. Los tres niveles de la ingeniería de agentes

Harness Engineering no reemplaza a otras disciplinas, sino que las **complementa** en una progresión natural:

| Nivel | Qué optimiza | Pregunta que responde |
|-------|--------------|----------------------|
| **Prompt Engineering** | La calidad de un intercambio individual | ¿Qué le digo al modelo? |
| **Context Engineering** | La información que el modelo ve | ¿Qué información tiene disponible? |
| **Harness Engineering** | El entorno de ejecución completo | ¿Puede el agente operar por horas sin supervisión? |

Un equipo maduro de agentes de IA **avanza a través de los tres niveles**, a menudo dentro de un solo proyecto.

---

## 4. Los componentes de un Harness

### 4.1 Los cinco subsistemas fundamentales

Basado en el marco de **Learn Harness Engineering**, un Harness completo se compone de cinco subsistemas:

| Subsistema | Función |
|------------|---------|
| **Instrucciones** | AGENTS.md, reglas, estándares del proyecto |
| **Herramientas** | Qué puede invocar el agente y bajo qué condiciones |
| **Entorno** | Worktrees, apps aisladas, acceso a navegador |
| **Estado** | Memoria persistente, checkpoints, continuidad entre sesiones |
| **Retroalimentación** | Logs, métricas, traces, validación automática |

### 4.2 Los cinco subsistemas y sus funciones

En este framework (ver `[[harness-engineering]]`), un harness construye un entorno de trabajo completo alrededor del modelo para que produzca resultados fiables. No se trata de escribir mejores prompts, sino de diseñar el sistema dentro del cual opera el modelo.

```text
    ┌────────────────────────────────────────────────────────────────┐
    │                          EL HARNESS                            │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
    │   │ Instrucciones│  │    Estado    │  │   Verificación     │   │
    │   │              │  │              │  │                    │   │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint       │   │
    │   │ CLAUDE.md    │  │ feature_list │  │ type-check         │   │
    │   │ feature_list │  │ git log      │  │ smoke runs         │   │
    │   │ docs/        │  │ traspaso ses.│  │ e2e pipeline       │   │
    │   └──────────────┘  └──────────────┘  └────────────────────┘   │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Alcance    │  │       Ciclo de Vida de Sesión        │   │
    │   │              │  │                                      │   │
    │   │ una feature  │  │ init.sh al inicio                    │   │
    │   │ a la vez     │  │ checklist de estado limpio al final  │   │
    │   │ definición   │  │ nota de traspaso a la próxima sesión │   │
    │   │ de terminado │  │ commit solo si es seguro reanudar    │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

    El MODELO decide qué código escribir.
    El HARNESS gobierna cuándo, dónde y cómo lo escribe.
    El harness no hace al modelo más inteligente.
    Hace que la salida del modelo sea fiable.
```

Cada subsistema tiene una única función:

| Subsistema | Función |
|------------|---------|
| **Instrucciones** | Le dicen al agente qué hacer, en qué orden y qué leer antes de empezar. No es un único archivo gigante, sino una estructura de divulgación progresiva que el agente navega bajo demanda. |
| **Estado** | Registra qué se ha hecho, qué está en curso y qué viene después. Se persiste en disco para que la siguiente sesión retome exactamente donde lo dejó la anterior. |
| **Verificación** | Solo una suite de tests que pasa cuenta como evidencia. El agente no puede cantar victoria sin una prueba ejecutable. |
| **Alcance** | Restringe al agente a una feature a la vez. Sin excederse. Sin dejar tres cosas a medias. Sin reescribir la lista de features para ocultar trabajo sin terminar. |
| **Ciclo de Vida de Sesión** | Inicializar al comienzo. Limpiar al final. Dejar una ruta de reinicio limpia para la siguiente sesión. |

### 4.3 Las cinco "pilares" de OpenAI

OpenAI desglosa su enfoque de Harness Engineering en cinco componentes directamente implementables:

#### 1. Documentación estructurada (`docs/`)
Un directorio `docs/` actúa como la **"única fuente de verdad"** para el agente. Arquitectura, planes de ejecución y especificaciones están ahí. El agente **lee estos documentos antes de escribir código**.

#### 2. AGENTS.md
Archivo que codifica las reglas del proyecto, estándares de código y **errores pasados del agente**. Es el **"libro de errores"** del agente — lo lee antes de cada tarea para evitar repetir fallos.

#### 3. Restricciones mecánicas (Linters + Tests estructurales)
Reglas duras que el agente **no puede eludir**. Por ejemplo, una jerarquía de dependencias que debe respetarse so pena de rechazo en CI. Las restricciones **previenen daños arquitectónicos**.

#### 4. Observabilidad
Logs, métricas y traces que registran **cada decisión del agente**. El agente escribe sus propios logs y genera spans de tracing. Esto permite **reconstruir la cadena de decisiones** cuando algo falla.

#### 5. Integración CI/CD
El agente opera **directamente sobre la cadena de herramientas**: abre PRs, ejecuta tests, itera basado en fallos. Los humanos pasan de *"escribir código"* a *"revisar PRs"*.

---

## 5. El Knowledge Graph como base de contexto

En plataformas complejas (como Harness.io), el **Knowledge Graph** (Grafo de Conocimiento) es la capa fundamental que permite a los agentes acceder a información estructurada de forma **determinista y eficiente**.

### 5.1 ¿Por qué un Knowledge Graph y no APIs crudas?

Cuando un agente consulta APIs directamente vía MCP (Model Context Protocol), el costo en tokens y latencia es enorme:

| Métrica | APIs directas (MCP) | Knowledge Graph |
|---------|---------------------|-----------------|
| **Llamadas a LLM** | 5+ | 2-3 |
| **Tokens de entrada** | ~250,000–350,000 | ~12,000 |
| **Latencia** | Alta | Baja |

**Diferencia: 15-25x menos tokens**

### 5.2 Cómo funciona

El Knowledge Graph representa los datos de entrega de software como **entidades y relaciones**. Un usuario hace una pregunta en lenguaje natural, el sistema:

1. **Interpreta** la pregunta
2. **Traduce** a HQL (Harness Query Language)
3. **Recorre** entidades y relaciones relevantes
4. **Retorna** una respuesta estructurada

### 5.3 Validación del Knowledge Graph

La confianza en un Knowledge Graph no se logra preguntando *"¿Esta respuesta parece correcta?"*, sino preguntando *"**¿Qué tiene que ser cierto para que esta respuesta sea correcta?**"*

La cadena de validación es:
> **Pregunta → HQL → Entidades → Relaciones → Datos → Fuente de verdad → Experiencia del producto**

---

## 6. Principios clave de Harness Engineering

### 6.1 Principios fundamentales

| Principio | Descripción |
|-----------|-------------|
| **Diseña para el agente, no para el humano** | El código, tests, docs, logs y dashboards deben ser **legibles e inspeccionables** por el agente |
| **Convierte juicio tácito en artefactos ejecutables** | El conocimiento humano debe codificarse en documentos, reglas y tests que el agente pueda leer y aplicar |
| **Aísla intentos concurrentes** | Usa **worktrees** para que diferentes ejecuciones del agente no interfieran entre sí |
| **Provee evidencia visual** | El agente debe poder ver la app (via browser/CDP) para validar sus cambios |
| **Registra todo** | Logs, métricas y traces permiten depurar la cadena de decisiones del agente |

### 6.2 El bucle de mejora continua

El enfoque de Harness Engineering no es estático. Cada vez que un agente comete un error, **se ingenia una solución en el harness** para que ese error no vuelva a ocurrir.

El ciclo es:
1. **Ejecución** del agente
2. **Traces** que muestran qué pasó
3. **Evals** que miden la calidad
4. **Feedback** (humano y del modelo)
5. **Cambios en el harness** (instrucciones, reglas, herramientas)
6. El agente **implementa** esos cambios

---

## 7. Implementación práctica

### 7.1 Punto de partida: AGENTS.md

El archivo `AGENTS.md` es el **punto de entrada** del harness. Debe ser:

- **Corto**: dice al agente por dónde empezar
- **Preciso**: codifica reglas y errores pasados
- **Vivo**: se actualiza con cada lección aprendida

### 7.2 Estructura de directorios recomendada

```
proyecto/
├── AGENTS.md                 # Punto de entrada, reglas globales
├── docs/                     # Fuente de verdad para el agente
│   ├── architecture.md
│   ├── api-spec.md
│   └── database-schema.md
├── .github/
│   └── skills/               # Skills reutilizables
├── worktrees/                # Aislamiento de intentos concurrentes
│   ├── feat-xxx/
│   └── hotfix-yyy/
├── scripts/
│   ├── validate.sh           # Validación estructural
│   └── cleanup.sh            # Limpieza de recursos
└── observability/
    ├── logs/
    ├── metrics/
    └── traces/
```

### 7.3 Worktrees: aislamiento de intentos

OpenAI utiliza **worktrees de Git** para aislar intentos concurrentes del agente. Cada worktree tiene su propia instancia de la aplicación, permitiendo que múltiples agentes trabajen en paralelo sin conflictos.

### 7.4 Evidencia visual (Browser/CDP)

El agente debe poder **ver** la aplicación que está construyendo. OpenAI da a Codex acceso a **Chrome DevTools Protocol (CDP)** para que pueda inspeccionar la UI y validar visualmente sus cambios.

### 7.5 El papel del humano: de escritor a "steerer"

En un mundo de Harness Engineering, el rol del ingeniero cambia:

| Antes | Ahora |
|-------|-------|
| Escribir código | **Diseñar el entorno** |
| Implementar features | **Definir la intención** |
| Depurar manualmente | **Construir bucles de retroalimentación** |

El humano se convierte en un **"steerer"** (orientador) que **gobierna** al agente en lugar de **hacer** el trabajo.

---

## 8. De Loop a Graph: la evolución natural

Un principio clave de Harness Engineering es que **un loop es un grafo con un solo nodo**. A medida que los sistemas crecen:

1. **Loop simple**: Un agente ejecuta una tarea secuencial
2. **Maker-Checker**: Un agente escribe, otro revisa
3. **Grafo**: Múltiples agentes en paralelo, con validación, recuperación y aprobación humana

La evolución es:
> **Prompt → Contexto → Loop → Grafo**

Cuando una tarea necesita especialización, paralelismo, estado compartido, verificación y recuperación — **ya no es un loop, es un grafo**.

---

## 9. Recursos para aprender Harness Engineering

| Recurso | Descripción |
|---------|-------------|
| **[Learn Harness Engineering](https://github.com/walkinglabs/learn-harness-engineering)** | Curso basado en proyectos (12+ lecciones) con templates y código |
| **[OpenAI - Harness Engineering](https://openai.com/index/harness-engineering/)** | Publicación original de OpenAI (febrero 2026) |
| **[Anthropic - Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps)** | Guía de Anthropic sobre harness para aplicaciones de larga duración |
| **[Harness Engineering Knowledge Graph](https://harness-engineering.ai/knowledge-graph)** | Mapa interactivo de 883 entidades y 1590 relaciones en infraestructura de agentes |
| **[Symphony (OpenAI)](https://github.com/openai/symphony)** | Código fuente público de la plataforma de orquestación de OpenAI |
| **[Mitchell Hashimoto - AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)** | Artículo original que popularizó el concepto |

---

## 10. Resumen ejecutivo

| Concepto | Takeaway |
|----------|----------|
| **Harness Engineering** | Diseñar el entorno para que los agentes sean confiables |
| **No es Prompt Engineering** | No optimiza lo que le dices, optimiza **dónde y cómo** opera |
| **El agente no es lo difícil** | Lo difícil es el harness que lo rodea |
| **Documentación estructurada** | El agente lee docs antes de escribir código |
| **AGENTS.md** | El "libro de errores" del agente |
| **Restricciones mecánicas** | Linters y tests que el agente no puede eludir |
| **Observabilidad** | Logs, métricas y traces de cada decisión |
| **Knowledge Graph** | Contexto determinista y eficiente en tokens |
| **Loop → Grafo** | La evolución natural de sistemas multiagente |
| **Humano = Steerer** | El humano gobierna, el agente ejecuta |

---


