# Guía para la creación de System Prompts (AGENTS.md, CLAUDE.md, etc.)

Un **system prompt** (prompt de sistema) es el conjunto de instrucciones iniciales y contexto que se envía a una inteligencia artificial en segundo plano. Actúa como la **"constitución" invisible** que unifica tus instrucciones, las capacidades de la IA y el contexto de tu proyecto, permitiendo que la IA entienda el propósito, las reglas y las limitaciones de tu entorno de desarrollo.

Esta guía se centra en los archivos de instrucciones persistentes que diferentes herramientas de IA para programación (Claude Code, OpenCode, GitHub Copilot, Gemini CLI, etc.) utilizan para obtener contexto específico del proyecto. Estos archivos (como `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`) son la forma más efectiva de alinear el comportamiento de la IA con las necesidades de tu equipo y tu código.

---

## 1. Tipos de archivos de instrucciones y su propósito

| Archivo | Herramienta principal | Propósito |
|---------|----------------------|-----------|
| **AGENTS.md** | OpenCode, Codex, Gemini CLI, y muchos otros | Instrucciones estándar para agentes de codificación. Es el archivo más universal. |
| **CLAUDE.md** | Claude Code (proyecto y usuario) | Contexto e instrucciones persistentes para Claude. |
| **copilot-instructions.md** | GitHub Copilot (repositorio) | Manual del equipo que Copilot lee en cada solicitud. Se coloca en la raíz o en `.github/`. |
| **\*.instructions.md** (ámbito de ruta) | GitHub Copilot | Archivos con ámbito de ruta (`.github/instructions/`) que se aplican solo a archivos que coinciden con un patrón (`applyTo`). |
| **GEMINI.md** | Gemini CLI (global) | Instrucciones globales para Gemini. |

### Relación entre archivos

Muchas herramientas son compatibles con varios nombres de archivo para facilitar la interoperabilidad:

- **OpenCode**: busca `AGENTS.md` primero, luego `CLAUDE.md` si no existe.
- **Gemini CLI**: busca `AGENTS.md` en el directorio de trabajo o en padres hasta la raíz del proyecto (`.git`).
- **Claude Code**: lee `.claude/CLAUDE.md` (proyecto) y `~/.claude/CLAUDE.md` (usuario).

**Recomendación**: Para mantener un único punto de verdad, crea un archivo `AGENTS.md` (o `CLAUDE.md`) y crea un enlace simbólico al otro. Por ejemplo:

```bash
ln -sf AGENTS.md CLAUDE.md
```

---

## 2. Ubicación de los archivos según la herramienta

| Herramienta | Archivo (proyecto) | Archivo (global/usuario) |
|-------------|-------------------|---------------------------|
| **GitHub Copilot** | `.github/copilot-instructions.md` y `.github/instructions/*.instructions.md` | No soportado (solo proyecto) |
| **Claude Code** | `.claude/CLAUDE.md` | `~/.claude/CLAUDE.md` |
| **OpenCode / Codex** | `AGENTS.md` (raíz) | `~/.config/opencode/AGENTS.md` |
| **OpenCode (fallback)** | `CLAUDE.md` (si no hay `AGENTS.md`) | `~/.claude/CLAUDE.md` (si no hay `~/.config/opencode/AGENTS.md`) |
| **Gemini CLI** | `AGENTS.md` (raíz o padres) | `~/.gemini/GEMINI.md` |
| **Múltiples herramientas** | `AGENTS.md` + symlink a `CLAUDE.md` | Opcional |

**Importante**:
- Los archivos de proyecto deben estar en la raíz del repositorio o en la carpeta específica de la herramienta (ej. `.claude/`, `.github/`).
- Los archivos globales se aplican a todos tus proyectos, por lo que son ideales para preferencias personales (ej. "responde siempre en español" o "nunca uses emojis").

---

## 3. Contenido recomendado para un archivo de instrucciones

Un buen archivo de instrucciones debe ser **claro, conciso y relevante**. No incluyas información redundante que la IA pueda deducir del código. Sigue esta estructura:

### 3.1 Resumen del proyecto (una o dos frases)

Describe el tipo de aplicación y el stack tecnológico principal.

```markdown
# Proyecto: API de gestión de usuarios

Esta es una API REST construida con .NET 8, Entity Framework Core y PostgreSQL. Sigue Clean Architecture.
```

### 3.2 Comandos críticos (build, test, lint)

Lista solo los comandos de uso diario. No copies todo el `package.json`; solo lo esencial.

```markdown
## Comandos

- `dotnet build` — compila la solución
- `dotnet test` — ejecuta todas las pruebas (xUnit)
- `dotnet run --project src/API` — inicia el servidor de desarrollo
```

### 3.3 Convenciones de código y patrones

Incluye reglas específicas que la IA no podría adivinar solo con leer el código.

```markdown
## Convenciones

- Sigue Clean Architecture: Dominio → Aplicación → Infraestructura → API
- Usa MediatR para CQRS: un handler por comando/consulta
- Valida con FluentValidation, no con Data Annotations
- Los métodos asíncronos terminan con `Async`
```

### 3.4 Advertencias y particularidades (caveats)

Casos especiales o restricciones importantes.

```markdown
## Advertencias

- NUNCA modifiques directamente el schema de Prisma. Usa siempre migraciones.
- No ejecutes `dotnet build` tras cada cambio pequeño; es lento. Confía en el compilador en tiempo real.
- El entorno de producción usa variables de entorno; no hardcodees secretos.
```

### 3.5 Perfil de respuesta del usuario (opcional)

Define cómo quieres que la IA te responda.

```markdown
## Estilo de respuesta

- Sé directo y técnico (asume que soy un desarrollador senior).
- No uses emojis ni rodeos.
- Proporciona ejemplos de código cuando sea relevante.
- Si no estás seguro, pregunta antes de sugerir cambios.
```

---

## 4. Archivos con ámbito de ruta (GitHub Copilot)

En repositorios grandes, es mejor dividir las instrucciones por área. GitHub Copilot permite archivos `*.instructions.md` dentro de `.github/instructions/` con un frontmatter YAML que define el patrón de archivos al que aplican.

### 4.1 Estructura de ejemplo

```
.github/
├── copilot-instructions.md           # Instrucciones globales del repo
└── instructions/
    ├── dotnet.instructions.md        # applyTo: "**/*.cs"
    ├── angular.instructions.md       # applyTo: "**/*.ts, **/*.html"
    ├── testing.instructions.md       # applyTo: "**/*Tests.cs, **/*.spec.ts"
    └── security.instructions.md      # applyTo: "**" (siempre se carga)
```

### 4.2 Frontmatter de un archivo con ámbito

```yaml
---
applyTo: "**/*.cs"          # Patrón glob
excludeAgent: "code-review" # Opcional: excluir para ciertos agentes
---
# Convenciones de .NET

- Usa `IAsyncEnumerable` para flujos de datos grandes.
- Los DTOs van en el proyecto Application.
- Los repositorios se inyectan con `AddScoped`.
```

**Ventajas**:
- Cada archivo se enfoca en una única responsabilidad.
- Se reduce el contexto innecesario (un desarrollador de frontend no necesita reglas de .NET).
- Es más fácil mantener y actualizar.

---

## 5. Mejores prácticas para escribir archivos de instrucciones

Basado en la experiencia de equipos que han optimizado sus prompts, estas son las recomendaciones clave:

### 5.1 Sé breve (concisión es clave)

- **Ideal**: menos de 200-300 líneas.
- **Límite**: no sobrepases las 150-200 instrucciones.
- Si tu archivo es muy largo, la IA perderá el foco y el costo de token aumentará innecesariamente.

### 5.2 Define el proyecto en una frase

Comienza siempre describiendo el proyecto de forma concisa: "Esta es una aplicación web en Next.js con TypeScript y Tailwind". La IA necesita saber el stack principal desde el principio.

### 5.3 Lista solo los comandos esenciales

No copies el `package.json`. La IA puede leerlo si es necesario. Solo incluye los comandos que usas a diario: `npm run dev`, `npm test`, `npm run build`.

### 5.4 Documenta las advertencias (caveats)

La IA no puede adivinar reglas ocultas. Si hay algo que "siempre debes hacer" o "nunca debes hacer", menciónalo explícitamente.

- "Nunca ejecutes migraciones automáticas en producción."
- "Siempre usa `--no-verify` si estás en un hotfix."

### 5.5 Define el perfil de respuesta

Especifica el tono y el nivel de detalle. Si prefieres respuestas técnicas y sin rodeos, dilo.

### 5.6 No confíes ciegamente en la auto-generación (`/init`)

Comandos como `/init` suelen generar archivos largos, verbosos y llenos de información redundante. Es mejor empezar con un archivo mínimo y añadir solo lo que realmente necesitas.

### 5.7 Delega el formateo a herramientas automáticas

No incluyas reglas de estilo (comillas simples vs. dobles, tabs vs. espacios). Usa linters y formateadores (Prettier, Biome) para eso. La IA puede ejecutar `npm run format` si es necesario.

### 5.8 Omite información redundante

Si la información ya está en el código o en archivos obvios (`package.json`, `README.md`, `.env.example`), no la repitas. La IA puede leerlos.

### 5.9 Usa revelación progresiva y habilidades (skills)

- **Referencias**: en lugar de incluir toda la documentación de arquitectura, escribe "Para detalles de la base de datos, consulta `docs/schema.md`" y la IA podrá leer ese archivo bajo demanda.
- **Skills**: algunos sistemas (como Claude Code) permiten skills en `.claude/skills/`. Son instrucciones especializadas que se cargan solo cuando se necesitan (ej. un skill para "escribir pruebas" o "generar migraciones").
- **Filtros por ruta**: como se mencionó en el punto 4, usa archivos con ámbito para cargar reglas solo cuando trabajes en ciertos archivos.

### 5.10 Mantenimiento y priorización

- **Documento vivo**: actualiza las instrucciones cuando notes que la IA se desvía o usa mal una herramienta.
- **Priorización posicional**: los modelos prestan más atención al principio y al final del prompt. Coloca las reglas más importantes al inicio.
- **Énfasis**: usa palabras como **IMPORTANTE** o **NUNCA** en mayúsculas para que la IA priorice esas reglas.

### 5.11 Sincronización multi-herramienta

- Usa un archivo global (`~/.claude/CLAUDE.md` o `~/.config/opencode/AGENTS.md`) para preferencias personales que apliquen a todos los proyectos.
- Usa el archivo de proyecto para instrucciones específicas de ese repositorio.
- Mantén sincronizados los archivos mediante enlaces simbólicos (`ln -sf AGENTS.md CLAUDE.md`) para evitar duplicación y desincronización.

---

## 6. Estrategias avanzadas

### 6.1 Revelación progresiva de información

Divide la documentación en varios archivos y haz referencias cruzadas. La IA solo cargará los archivos que necesite.

**Ejemplo en `AGENTS.md`**:

```markdown
## Arquitectura

Para detalles sobre la estructura de capas, lee `docs/architecture.md`.
Para el modelo de datos, consulta `docs/database-schema.md`.
```

### 6.2 Skills o comandos personalizados

Algunas herramientas permiten definir **skills** (instrucciones reutilizables) que se invocan bajo demanda. Por ejemplo, en Claude Code:

```
.claude/skills/
├── test-generation.md    # Instrucciones para generar pruebas
└── migration.md          # Instrucciones para crear migraciones
```

En el `AGENTS.md` principal, solo haces referencia a ellos cuando sea necesario.

### 6.3 Uso de variables de entorno en prompts

Puedes incluir variables de entorno para personalizar el comportamiento de la IA sin modificar el archivo (ej. `{{PROJECT_NAME}}`).

---

## 7. Ejemplo completo de AGENTS.md

```markdown
# Proyecto: Plataforma de análisis de datos

API REST con FastAPI, SQLAlchemy y PostgreSQL. Sigue el patrón Repository + Service.

## Comandos esenciales

- `uvicorn main:app --reload` — servidor de desarrollo
- `pytest` — ejecuta todas las pruebas
- `black .` — formatea el código
- `mypy .` — verifica tipos

## Convenciones

- Las rutas de API usan el prefijo `/api/v1/`.
- Todas las respuestas incluyen `request_id` en la cabecera.
- Usa Pydantic para validación de entrada/salida.
- Los modelos de SQLAlchemy van en `models.py`.

## Advertencias

- NUNCA hagas `db.drop_all()` en entornos que no sean de pruebas.
- Las migraciones de Alembic deben generarse con `alembic revision --autogenerate`.
- Para consultas pesadas, usa `yield_per()` y `stream_results`.

## Estilo de respuesta

- Responde en español.
- Da ejemplos de código en Python.
- Sé directo y práctico.

## Documentación adicional

- Para la guía de despliegue, consulta `docs/deployment.md`.
- Para el modelo de datos detallado, revisa `docs/schema.md`.
```

---

## 8. Verificación y validación

Antes de commitear tu archivo de instrucciones, asegúrate de:

1. **Que sea legible** por humanos y por la IA.
2. **Que no sea redundante** con información ya presente en el repositorio.
3. **Que las reglas sean accionables** (la IA debe poder seguirlas).
4. **Que esté sincronizado** con otras herramientas si usas enlaces simbólicos.

Puedes probar la efectividad de tu archivo pidiendo a la IA que resuma el proyecto basándose en él y verificando si coincide con lo que esperas.

---

*Esta guía se basa en la documentación oficial de Claude Code, OpenCode y GitHub Copilot. Consulta la documentación específica de cada plataforma para detalles adicionales y actualizaciones.*

