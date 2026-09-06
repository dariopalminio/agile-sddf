# Guía de Creación de Custom Agents

Los **custom agents** (agentes personalizados) son asistentes de IA especializados que se configuran mediante archivos de definición para realizar tareas específicas dentro de flujos de trabajo de desarrollo. A diferencia de un asistente de propósito general, un agente personalizado tiene:

- **Instrucciones y personalidad enfocadas** en un dominio concreto
- **Acceso restringido a herramientas** específicas
- **Modelos de IA configurables** por agente
- **Contexto optimizado**, evitando la saturación del contexto principal


## 1. Formato de archivo

Los custom agents se definen en **archivos Markdown con frontmatter YAML**. La extensión varía según la plataforma:

| Plataforma | Extensión | Ubicación |
|------------|-----------|-----------|
| **Claude Code** | `.md` con frontmatter YAML | `.claude/agents/` o `~/.claude/agents/` |
| **OpenCode** | `.md` | `.opencode/agents/` o `~/.config/opencode/agents/` |
| **GitHub Copilot** | `.agent.md` | `.github/agents/` |
| **Antigravity** | `.md` con frontmatter YAML | `.agents/agents/` o `~/.gemini/config/agents/` |

### Estructura básica

```markdown
---
description: "Descripción breve del agente"
mode: primary | subagent | all
model: provider/model-id
temperature: 0.2
permission:
  edit: allow | ask | deny
  bash: "*": "ask"
tools:
  websearch: false
---

[Instrucciones del sistema en markdown...]
```


## 2. Campos del frontmatter

### Campos esenciales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `description` | string | Descripción del agente; se muestra en la UI y se usa para que el sistema sepa cuándo delegar |
| `mode` | `primary` / `subagent` / `all` | Cómo se invoca el agente |
| `model` | `provider/model-id` | Modelo de IA específico para este agente |

### Campos de control

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `temperature` / `top_p` | number | Parámetros de muestreo del modelo |
| `permission` | object | Control de permisos por herramienta (allow/ask/deny) |
| `tools` | object | Control booleano de herramientas (deprecated, preferir `permission`) |
| `steps` | number | Iteraciones máximas del agente |
| `disable` | boolean | Deshabilitar el agente |
| `hidden` | boolean | Ocultar en la UI |
| `color` | string | Color de acento en la UI |

### Permisos

El sistema de permisos permite controlar granularmente qué puede hacer cada agente:

```yaml
permission:
  edit: allow           # Permitir ediciones
  bash: "*": "ask"      # Preguntar antes de ejecutar comandos
  "pnpm test*": "allow" # Permitir comandos específicos
  webfetch: deny        # Denegar fetch web
```

### Nombre del agente

El nombre del archivo (sin extensión) se convierte en el identificador del agente:

- `security-auditor.md` → `@security-auditor`
- Reglas: minúsculas, alfanumérico, guiones. Sin espacios ni guiones bajos


## 3. Ámbitos: Proyecto vs. Usuario

Los agentes pueden definirse en dos ámbitos:

| Ámbito | Ubicación | Disponibilidad |
|--------|-----------|----------------|
| **Proyecto** | `.claude/agents/`, `.opencode/agents/`, `.github/agents/`, `.agents/agents/` | Solo para el repositorio actual |
| **Usuario/Global** | `~/.claude/agents/`, `~/.config/opencode/agents/`, `~/.gemini/config/agents/` | Disponible en todos los proyectos |

Los agentes de proyecto se pueden **commitear al repositorio** para que todo el equipo los tenga disponibles automáticamente.


## 4. Invocación de agentes

### Modos de invocación

| Modo | Descripción | Ejemplo |
|------|-------------|---------|
| **Primary** | Agente principal, accesible en el ciclo de tabulación | `Tab` para ciclar |
| **Subagent** | Invocado mediante mención, ejecuta subtareas en contexto aislado | `@security-auditor` |
| **All** | Disponible en ambos modos | - |

### En GitHub Copilot / Visual Studio

```bash
@profiler          # Invocar agente de profiling
@debugger          # Invocar agente de debugging
@test              # Invocar agente de testing
```

Los agentes se acceden mediante el **selector de agentes** o la **sintaxis `@`**.

### En Claude Code

```bash
/agents            # Comando interactivo para gestionar agentes
```

Claude delega automáticamente en subagentes cuando detecta una tarea que coincide con su descripción.


## 5. Herramientas y capacidades

### Herramientas comunes

| Herramienta | Descripción |
|-------------|-------------|
| `read` | Lectura de archivos |
| `write` / `edit` | Escritura y edición |
| `bash` / `shell` | Ejecución de comandos |
| `grep` / `glob` / `list` | Búsqueda en código |
| `webfetch` / `websearch` | Acceso a web |

### Subagentes integrados

**Claude Code** incluye subagentes integrados como **Explore** (agente de solo lectura para búsqueda y análisis de código) y **Plan** (agente de investigación).

**OpenCode** incluye agentes como **build**, **plan**, **general**, **explore** y **scout**.

**GitHub Copilot** incluye agentes integrados como **@debugger**, **@git**, **@profiler**, **@test** y **@modernize**.


## 6. Ejemplo completo

### Agente para revisión de seguridad (Claude Code / OpenCode)

**Archivo:** `.claude/agents/security-auditor.md`

```markdown
---
description: "Experto en seguridad para revisar código en busca de vulnerabilidades"
mode: subagent
model: anthropic/claude-sonnet-5
temperature: 0.1
permission:
  read: allow
  edit: deny
  bash: "*": "ask"
  webfetch: allow
tools:
  websearch: true
---

Eres un experto en seguridad de software. Tu tarea es revisar código en busca de:

1. **Vulnerabilidades de seguridad** comunes (inyección SQL, XSS, CSRF, etc.)
2. **Malas prácticas** de manejo de secrets y credenciales
3. **Dependencias** con vulnerabilidades conocidas
4. **Validación de entrada** insuficiente

Proporciona un informe detallado con:
- Nivel de severidad (Crítico/Alto/Medio/Bajo)
- Ubicación exacta del problema
- Recomendación de corrección con código de ejemplo

Sé exhaustivo pero conciso. Prioriza hallazgos críticos.
```

### Agente para pruebas (GitHub Copilot)

**Archivo:** `.github/agents/test-writer.agent.md`

```markdown
---
description: "Especialista en escribir pruebas unitarias y de integración"
mode: all
model: gpt-4
temperature: 0.3
permission:
  read: allow
  write: ask
  bash: "npm test*": "allow"
---

Eres un experto en testing. Para cualquier código que se te presente:

1. Identifica los casos borde y escenarios críticos
2. Escribe pruebas unitarias usando el framework del proyecto
3. Asegura cobertura de código adecuada
4. Sigue el patrón AAA (Arrange-Act-Assert)

Usa mocking cuando sea apropiado. Prioriza pruebas que capturen la lógica de negocio.
```


## 7. Creación interactiva

Muchas plataformas ofrecen creación asistida:

**Claude Code**: Describe el subagente que quieres y dónde guardarlo, y Claude lo escribe por ti

**OpenCode**: Usa `opencode agent create` para crear agentes interactivamente

**Antigravity**: Plantillas de agentes personalizados disponibles en Google AI Studio Playground


## 8. Buenas prácticas

### 1. Descripciones claras y accionables
La descripción se usa para que el sistema sepa cuándo delegar en tu agente. Sé específico sobre **qué hace** y **cuándo usarlo**.

### 2. Permisos mínimos necesarios
Restringe las herramientas al mínimo indispensable. Usa `ask` para operaciones que requieren supervisión y `deny` para las que no deben realizarse.

### 3. Instrucciones específicas y contextuales
Incluye:
- Convenciones del proyecto
- Frameworks y versiones
- Patrones de código esperados
- Ejemplos de salida

### 4. Mantén los prompts enfocados
Cada agente debe tener un **propósito único y bien definido**. No intentes que un agente haga demasiadas cosas.

### 5. Usa modelos adecuados
Tareas simples pueden usar modelos más económicos como Haiku; tareas complejas pueden requerir modelos más potentes.

### 6. Prueba antes de liberar
En GitHub Copilot, asegúrate de que los agentes sean **performantes y compatibles** antes de liberarlos a tu organización.


## 9. Comparativa de plataformas

| Característica | Claude Code | OpenCode | GitHub Copilot | Antigravity |
|----------------|-------------|----------|----------------|-------------|
| **Formato** | Markdown + YAML | Markdown + YAML | `.agent.md` | Markdown + YAML |
| **Subagentes** | ✅ Integrados | ✅ Integrados | ✅ Mediante skills | ✅ Dinámicos |
| **Modelo por agente** | ✅ | ✅ | ✅ | ✅ |
| **Permisos granulares** | ✅ | ✅ | ✅ | ✅ |
| **Agentes de proyecto** | ✅ | ✅ | ✅ | ✅ |
| **Agentes globales** | ✅ | ✅ | ❌ | ✅ |
| **Creación interactiva** | ✅ (vía Claude) | ✅ (`create`) | ❌ | ✅ (plantillas) |

---

*Esta guía se basa en la documentación oficial de Claude Code, OpenCode, GitHub Copilot y Antigravity. Consulta la documentación específica de cada plataforma para detalles adicionales y actualizaciones.*
