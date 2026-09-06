# Guía de Agent Harness

## 1. ¿Qué es un Agent Harness?

Un **Agent Harness** es la infraestructura de software que envuelve a un modelo de lenguaje (LLM) y lo transforma de un simple generador de texto en un **agente capaz de actuar** sobre tareas del mundo real.

La fórmula fundamental es:

> **Agente = Modelo + Harness**

| Componente | Función |
|------------|---------|
| **Modelo** | El "cerebro" que razona, genera decisiones y planifica |
| **Harness** | Todo lo demás: herramientas, memoria, entornos de ejecución y guardarraíles que permiten al modelo actuar |

Sin un harness, un modelo puede responder preguntas, pero **no puede** ejecutar código, llamar a APIs, acceder a archivos, recordar trabajos previos ni completar flujos de trabajo multi-paso de forma autónoma.

---

## 2. ¿Por qué los agentes necesitan un Harness?

Un modelo de lenguaje, por sí mismo, solo procesa entradas (texto, imágenes, audio, vídeo) y produce texto. No puede:

- Mantener estado duradero entre interacciones
- Ejecutar código
- Acceder a conocimiento en tiempo real
- Configurar entornos e instalar paquetes
- Llamar a APIs o interactuar con bases de datos

Todas estas capacidades son **funcionalidades del harness**.

### 2.1 El bucle Reason → Act → Observe

En el corazón de muchos agentes se encuentra el **bucle ReAct** (Reasoning and Acting):

1. **Reason (Razonar)**: El modelo lee el contexto (tarea, memoria, resultados previos) y decide qué acción tomar
2. **Act (Actuar)**: El harness ejecuta la acción: invoca una herramienta, ejecuta código en un sandbox, llama a una API o escribe en almacenamiento
3. **Observe (Observar)**: El harness captura el resultado y lo devuelve al modelo como nuevo contexto
4. **Repeat (Repetir)**: El bucle continúa hasta que la tarea se completa

> **Ejemplo**: Un agente de coding encargado de arreglar un bug. El modelo propone un cambio de código. El harness ejecuta el código en un sandbox aislado, captura los resultados de las pruebas y los devuelve al modelo. Si las pruebas fallan, el modelo razona sobre el fallo y propone una nueva solución.

---

## 3. Componentes fundamentales de un Agent Harness

### 3.1 Herramientas (Tools)

APIs, ejecución de código, búsqueda, bases de datos y aplicaciones de negocio que el agente puede invocar. El harness es responsable de:

- **Registrar** las herramientas disponibles
- **Ejecutar** las herramientas de forma segura
- **Capturar** y devolver los resultados al modelo

### 3.2 Memoria (Memory)

Contexto previo, preferencias del usuario e historial del flujo de trabajo. El harness gestiona:

- **Memoria a corto plazo**: Contexto dentro de la sesión actual
- **Memoria a largo plazo**: Persistencia entre sesiones
- **Compresión/Compactación**: Resumir el historial cuando se acerca al límite de tokens

### 3.3 Espacio de trabajo (Workspace)

Archivos, datos, entornos y sistemas a los que el agente puede acceder. El harness proporciona:

- **Sistema de archivos** para lectura/escritura de datos y código
- **Sandboxes** para ejecución aislada de código
- **Entornos** configurados con las dependencias necesarias

### 3.4 Guardarraíles (Guardrails)

Permisos, políticas, aprobaciones y monitorización. El harness implementa:

- **Políticas de aprobación**: Herramientas que requieren confirmación humana
- **Límites de iteración**: Prevenir bucles infinitos
- **Observabilidad**: Logs, métricas y traces de cada decisión

### 3.5 Orquestación (Orchestration)

Lógica que coordina la ejecución del agente:

- **Planificación**: Descomposición de tareas complejas en pasos
- **Subagentes**: Delegación de subtareas a agentes especializados con contexto aislado
- **Enrutamiento de modelos**: Selección del modelo adecuado para cada tarea
- **Hooks/Middleware**: Ejecución determinista de validaciones y verificaciones

---

## 4. Arquitectura de un Agent Harness

Basado en el enfoque de **Agent Framework** de Microsoft, la arquitectura de un harness se compone de los siguientes bloques:

### 4.1 Componentes arquitectónicos

| Componente | Función |
|------------|---------|
| **Chat Client** | Conecta el agente al modelo |
| **Chat Pipeline** | Añade invocación de funciones, inyección de mensajes, persistencia de historial y compactación opcional |
| **Agent Providers** | Añaden instrucciones, herramientas, memoria, estado de tareas y capacidades opcionales |
| **Context Providers** | Gestionan el alcance de la sesión y el contexto |
| **Middleware** | Añaden manejo de aprobaciones, observabilidad y control de bucles |
| **Application UX** | Stream de respuestas, visualización de progreso y recogida de aprobaciones |

### 4.2 Capabilities Matrix (Matriz de capacidades)

Un harness típico incluye las siguientes capacidades por defecto:

| Capacidad | Comportamiento del Harness |
|-----------|---------------------------|
| **Invocación de funciones** | Habilitada con límite de iteraciones configurable |
| **Persistencia de historial** | Persiste el historial tras cada llamada al modelo |
| **Compactación** | Activada cuando se alcanzan límites de tokens |
| **Seguimiento de tareas (Todos)** | Habilitado por defecto |
| **Modos de agente** | Modos "plan" y "ejecutar" habilitados por defecto |
| **Memoria de archivos** | Habilitada por defecto; acceso compartido opt-in |
| **Aprobación de herramientas** | Aprobaciones y reglas automáticas habilitadas |
| **Observabilidad** | OpenTelemetry habilitado por defecto |
| **Búsqueda web** | Añadida por defecto donde está disponible |

---

## 5. Tipos de Harness

### 5.1 Según el nivel de abstracción

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Framework Harness** | Harness incluido en un framework de agentes | LangChain, CrewAI, Microsoft Agent Framework |
| **Custom Harness** | Harness construido desde cero para necesidades específicas | Implementación propia |
| **Platform Harness** | Harness como servicio en una plataforma | Databricks, OpenAI, Azure AI |

### 5.2 Según el alcance

| Tipo | Descripción |
|------|-------------|
| **Harness de agente individual** | Gestiona un solo agente |
| **Harness multi-agente** | Orquesta múltiples agentes, gestiona handoffs y comunicación |

---

## 6. Implementación práctica: ¿Cómo construir un Agent Harness?

### 6.1 Enfoque paso a paso

1. **Define el comportamiento deseado**: ¿Qué quieres que el agente haga? 
2. **Elige un framework** o construye desde cero
3. **Configura las herramientas** que el agente necesitará
4. **Implementa la memoria** (sesiones, persistencia)
5. **Añade guardarraíles** (aprobaciones, límites, observabilidad)
6. **Prueba y itera**: Usa los logs y traces para mejorar el harness

### 6.2 Ejemplo conceptual en código

```python
# Pseudocódigo de un harness básico
class AgentHarness:
    def __init__(self, model, tools, memory, max_iterations=10):
        self.model = model
        self.tools = tools
        self.memory = memory
        self.max_iterations = max_iterations
    
    def run(self, task):
        context = self.memory.load()
        context["task"] = task
        
        for i in range(self.max_iterations):
            # 1. REASON: El modelo decide qué hacer
            action = self.model.reason(context)
            
            # 2. ACT: El harness ejecuta la acción
            result = self.execute(action)
            
            # 3. OBSERVE: El harness captura el resultado
            context["last_result"] = result
            self.memory.save(context)
            
            # 4. CHECK: ¿Tarea completada?
            if self.is_complete(result):
                return result
        
        raise Exception("Max iterations exceeded")
    
    def execute(self, action):
        # Validar permisos
        if not self.is_allowed(action):
            return "Action not allowed"
        # Ejecutar herramienta
        return self.tools[action.tool].run(action.params)
```

---

## 7. Harness vs. Framework vs. Runtime: ¿Cuál es la diferencia?

| Concepto | Definición | Analogía |
|----------|------------|----------|
| **Framework** | Biblioteca de código que proporciona estructuras y patrones para construir aplicaciones | El **plano** de una casa |
| **Runtime** | Entorno de ejecución donde se ejecuta el código | Los **cimientos y servicios** de la casa |
| **Harness** | La infraestructura específica que envuelve a un modelo para convertirlo en agente | La **instalación eléctrica y fontanería** que hace la casa habitable |

Un harness **usa** frameworks y runtimes, pero es un concepto más específico: es la capa que **conecta el modelo con el mundo**.

---

## 8. Buenas prácticas para diseñar un Agent Harness

### 8.1 Principios de diseño

| Principio | Descripción |
|-----------|-------------|
| **Separación modelo-harness** | Mantén la lógica del modelo separada de la lógica de ejecución |
| **Aislamiento** | Ejecuta código en sandboxes para evitar daños |
| **Observabilidad por defecto** | Registra cada decisión y acción del agente |
| **Control de costes** | Establece límites de iteraciones y tokens |
| **Aprobaciones humanas** | Requiere confirmación para acciones críticas |
| **Persistencia** | Mantén estado entre sesiones |
| **Evolución incremental** | Empieza simple, añade complejidad según sea necesario |

### 8.2 Errores comunes a evitar

| Error | Solución |
|-------|----------|
| **Permitir acceso ilimitado a herramientas** | Implementa políticas de aprobación |
| **No gestionar el contexto** | Usa compactación y memoria persistente |
| **Ignorar la observabilidad** | Añade logging, métricas y tracing desde el día 1 |
| **Sin límites de iteración** | Establece `max_iterations` para prevenir bucles infinitos |
| **Mezclar lógica de modelo y harness** | Mantén separación clara |

---

## 9. El ecosistema de herramientas

| Herramienta/Framework | Descripción | Tipo |
|----------------------|-------------|------|
| **LangChain** | Framework para construir aplicaciones con LLMs | Framework |
| **Microsoft Agent Framework** | Framework con harness "batteries-included" | Framework + Harness |
| **CrewAI** | Framework multi-agente | Framework |
| **OpenAI Harness** | Harness interno de OpenAI (no público) | Platform Harness |
| **Databricks AI Harness** | Harness empresarial de Databricks | Platform Harness |
| **DeepSeek Harness** | Harness open-source para codificación | Open-source Harness |

---

## 10. Resumen ejecutivo

| Concepto | Takeaway |
|----------|----------|
| **Agent Harness** | La infraestructura que convierte un modelo en un agente capaz de actuar |
| **Fórmula** | Agente = Modelo + Harness |
| **Bucle central** | Reason → Act → Observe → Repeat |
| **Componentes clave** | Herramientas, memoria, workspace, guardarraíles, orquestación |
| **Propósito** | Permitir que el modelo ejecute código, llame a APIs, acceda a archivos y complete flujos multi-paso |
| **Diferenciador** | El harness es lo que hace que un agente sea **confiable** y **escalable** en producción |

---
