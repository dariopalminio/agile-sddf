# Guía de Creación de Skills Personalizados

Los **skills** (habilidades) son flujos de trabajo reutilizables y bajo demanda que los asistentes de IA cargan dinámicamente para mejorar su rendimiento en tareas especializadas. A diferencia de los agentes personalizados (que son roles especializados con límites de herramientas), un skill está diseñado para empaquetar un **procedimiento repetible de varios pasos** con sus propios recursos de soporte, como scripts, plantillas y documentación de referencia.

| Aspecto | Skill | Custom Agent |
|---------|-------|--------------|
| **Propósito** | Flujo de trabajo reutilizable | Rol especializado con herramientas |
| **Contenido** | Instrucciones + scripts + recursos | Prompt del sistema + permisos |
| **Carga** | Bajo demanda (progresiva) | Siempre disponible o por mención |
| **Ejemplo** | "Runbook de rollback de Kubernetes" | "Asesor de optimización de costes" |


## 1. Estructura de directorios

Un skill es un **directorio** que contiene, como mínimo, un archivo `SKILL.md`:

```
mi-skill/
├── SKILL.md               # Obligatorio: metadatos + instrucciones
├── scripts/               # Opcional: código ejecutable
├── references/            # Opcional: documentación de referencia
├── assets/                # Opcional: plantillas, recursos
└── ...                    # Cualquier archivo o directorio adicional
```

Cada skill debe ser **autocontenido** en su propia carpeta.


## 2. Formato del archivo SKILL.md

El archivo `SKILL.md` debe contener **frontmatter YAML** seguido de contenido en **Markdown**.

### 2.1 Frontmatter (metadatos)

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `name` | **Sí** | Máx. 64 caracteres. Solo minúsculas, números y guiones. Debe coincidir con el nombre del directorio |
| `description` | **Sí** | Máx. 1024 caracteres. Describe qué hace el skill y cuándo usarlo |
| `license` | No | Nombre de la licencia o referencia a un archivo de licencia |
| `compatibility` | No | Máx. 500 caracteres. Requisitos del entorno (producto, paquetes, acceso a red, etc.) |
| `metadata` | No | Mapa clave-valor para metadatos adicionales |
| `allowed-tools` | No | Lista separada por espacios de herramientas preaprobadas (experimental) |

### 2.2 Reglas de validación del campo `name`

- Longitud: 1–64 caracteres
- Solo caracteres alfanuméricos en minúscula (a-z, 0-9) y guiones (-)
- No empezar ni terminar con guión
- No contener guiones consecutivos (`--`)
- Debe coincidir con el nombre del directorio padre

**Ejemplos válidos:**
```yaml
name: pdf-processing
name: data-analysis
```

**Ejemplos inválidos:**
```yaml
name: PDF-Processing   # Mayúsculas no permitidas
name: -pdf             # No empezar con guión
name: pdf--processing  # Guiones consecutivos no permitidos
```


### 2.3 Buenas prácticas para `description`

Debe describir **qué hace** y **cuándo usarlo**, incluyendo palabras clave específicas que ayuden al agente a identificar tareas relevantes:

**✅ Buen ejemplo:**
> "Extrae texto y tablas de archivos PDF, completa formularios PDF y fusiona múltiples PDFs. Úsalo cuando trabajes con documentos PDF o cuando el usuario mencione PDFs, formularios o extracción de documentos."

**❌ Mal ejemplo:**
> "Ayuda con PDFs."

### 2.4 Ejemplo completo de SKILL.md

```markdown
---
name: git-release
description: Crea y gestiona releases de Git siguiendo el flujo de trabajo estándar del equipo. Úsalo cuando necesites crear una nueva versión, etiquetar un release o preparar notas de lanzamiento.
license: MIT
compatibility: Requiere git, gh (GitHub CLI) y acceso a internet
metadata:
  author: team-engineering
  version: "1.2.0"
---

# Instrucciones para crear un release

1. Verifica que estás en la rama `main` y que está actualizada.
2. Ejecuta el script de validación: `./scripts/validate.sh`
3. Actualiza el archivo `CHANGELOG.md` con los cambios de esta versión.
4. Crea el commit de release y la etiqueta correspondiente.
5. Sube los cambios y la etiqueta al repositorio remoto.
...
```


## 3. Ubicación de los skills

Los skills pueden almacenarse en diferentes ubicaciones, dependiendo del alcance deseado:

### 3.1 Ubicaciones estándar (compatibles con múltiples plataformas)

| Ámbito | Ruta | Disponibilidad |
|--------|------|----------------|
| **Proyecto (GitHub Copilot)** | `.github/skills/*/SKILL.md` | Repositorio actual |
| **Proyecto (Claude/OpenCode)** | `.claude/skills/*/SKILL.md` | Repositorio actual |
| **Proyecto (Agentes)** | `.agents/skills/*/SKILL.md` | Repositorio actual |
| **Proyecto (OpenCode)** | `.opencode/skills/*/SKILL.md` | Repositorio actual |
| **Global (Usuario)** | `~/.copilot/skills/*/SKILL.md` | Todos los proyectos |
| **Global (Claude/OpenCode)** | `~/.claude/skills/*/SKILL.md` | Todos los proyectos |
| **Global (OpenCode)** | `~/.config/opencode/skills/*/SKILL.md` | Todos los proyectos |

### 3.2 Descubrimiento automático

Para proyectos locales, el sistema **sube en el árbol de directorios** desde el directorio de trabajo actual hasta la raíz del árbol de Git, cargando todos los skills encontrados en las rutas compatibles.

Los skills globales se cargan desde los directorios de configuración del usuario.

### 3.3 Configuración adicional en VS Code

VS Code permite agregar ubicaciones de búsqueda adicionales mediante la configuración `chat.agentSkillsLocations`.


## 4. Carga progresiva (Progressive Loading)

Los skills utilizan un mecanismo de **carga progresiva** para mantener la experiencia del asistente ágil:

1. **Descubrimiento:** El asistente solo ve el `name` y `description` del skill.
2. **Selección:** Si la solicitud del usuario coincide, el asistente carga las instrucciones completas.
3. **Carga bajo demanda:** Los recursos adicionales (scripts, referencias) solo se cargan cuando el skill los referencia explícitamente.

Este enfoque es ideal para DevOps porque permite mantener la experiencia base del asistente ligera, cargando un runbook especializado solo cuando se necesita.


## 5. Permisos y control de acceso

### 5.1 Configuración de permisos en OpenCode

En `opencode.json`, se pueden configurar permisos basados en patrones para controlar qué skills pueden cargar los agentes:

| Permiso | Comportamiento |
|---------|----------------|
| `allow` | El skill se carga inmediatamente |
| `deny` | El skill se oculta al agente, denegando el acceso |
| `ask` | Pregunta al usuario antes de cargar |

**Ejemplo:**
```json
{
  "skills": {
    "permissions": {
      "internal-*": "allow",
      "experimental-*": "ask",
      "deprecated-*": "deny"
    }
  }
}
```

Los patrones soportan comodines: `internal-*` coincide con `internal-docs`, `internal-tools`, etc.

### 5.2 Permisos por agente

Se pueden otorgar permisos diferentes a agentes específicos, tanto en el frontmatter del agente como en la configuración global.

### 5.3 Deshabilitación de skills

Para agentes que no necesitan usar skills, se puede deshabilitar completamente la funcionalidad.


## 6. Ejemplos prácticos

### 6.1 Skill para triaje de incidentes (DevOps/SRE)

**Ubicación:** `.github/skills/incident-triage/SKILL.md`

```markdown
---
name: incident-triage
description: Guía para el triaje inicial de incidentes de producción. Úsalo cuando ocurra una interrupción del servicio, se reciba una alerta de monitoring o se necesite documentar un incidente.
compatibility: Requiere acceso a la API de PagerDuty y al dashboard de Datadog
---

# Procedimiento de triaje de incidentes

1. **Confirmar el incidente:** Verifica que la alerta no sea un falso positivo.
2. **Identificar el impacto:** Determina qué servicios están afectados y el porcentaje de usuarios impactados.
3. **Crear canal de comunicación:** Abre un canal en Slack con el equipo de guardia.
4. **Documentar en el runbook:** Registra la hora de inicio, síntomas y acciones iniciales.
5. **Escalar si es necesario:** Si el incidente supera los 15 minutos sin resolución, notifica al líder de guardia.
```

### 6.2 Skill para rollback de Kubernetes

**Estructura:**
```
.github/skills/k8s-rollback/
├── SKILL.md
├── scripts/
│   └── rollback.sh
└── references/
    └── deployment-strategies.md
```

**SKILL.md:**
```markdown
---
name: k8s-rollback
description: Ejecuta un rollback seguro de despliegues en Kubernetes. Úsalo cuando un despliegue haya fallado, se necesite revertir a una versión anterior o cuando se identifiquen problemas en producción.
compatibility: Requiere kubectl, acceso al clúster de Kubernetes y permisos para modificar deployments
allowed-tools: bash read
---

# Procedimiento de rollback en Kubernetes

1. Identifica el deployment problemático y la versión a la que revertir.
2. Ejecuta el script de validación: `./scripts/rollback.sh --dry-run`
3. Revisa el plan de cambios generado.
4. Confirma la ejecución del rollback.
5. Verifica el estado de los pods después del rollback.
6. Actualiza la documentación del incidente.

Para más detalles sobre estrategias de despliegue, consulta `references/deployment-strategies.md`.
```


## 7. Skills vs. otras primitivas de personalización

| Primitiva | Mejor para | Ejemplo DevOps |
|-----------|------------|----------------|
| **Instrucciones de workspace** | Estándares siempre activos | "Etiqueta cada recurso de Azure con owner y env" |
| **Instrucciones por archivo** | Estándares para archivos específicos | Valores por defecto para `**/values.yaml` |
| **Archivos de prompt** | Tareas puntuales reutilizables | "Resume el changelog de despliegue de este sprint" |
| **Skills** | Flujos de trabajo reutilizables con assets | Runbook de rollback de Kubernetes + scripts |
| **Agentes personalizados** | Roles especializados con límites de herramientas | Asesor de optimización de costes (solo lectura) |
| **Hooks** | Aplicación determinista | Rechazar planes de Terraform que eliminen protección |

**Regla práctica:** Usa instrucciones para comportamiento consistente, archivos de prompt para comandos puntuales reutilizables, y **skills para flujos de trabajo repetibles que se sientan como un runbook**.


## 8. Buenas prácticas

### 8.1 Diseño del skill

1. **Descripción rica en keywords:** Incluye términos específicos que ayuden al asistente a identificar cuándo usar el skill.
2. **Mantenlo enfocado:** Cada skill debe tener un propósito único y bien definido.
3. **Incluye ejemplos:** Muestra al asistente cómo usar el skill correctamente.
4. **Versiona tus skills:** Usa el campo `metadata` para almacenar la versión.

### 8.2 Recursos y dependencias

1. **Documenta requisitos:** Usa el campo `compatibility` para indicar dependencias.
2. **Empaqueta scripts:** Incluye scripts ejecutables en el directorio `scripts/`.
3. **Referencias útiles:** Añade documentación de referencia en `references/`.
4. **Plantillas y assets:** Usa `assets/` para plantillas reutilizables.

### 8.3 Para equipos

1. **Comparte skills en el repositorio:** Usa `.github/skills/` para que todo el equipo los tenga disponibles.
2. **Nombres únicos:** Asegúrate de que los nombres de los skills sean únicos en todo el espacio de nombres.
3. **Revisa la carga:** Si un skill no aparece, verifica el nombre del archivo (`SKILL.md` en mayúsculas) y que el frontmatter contenga `name` y `description`.


## 9. Solución de problemas comunes

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| El skill no aparece | Nombre de archivo incorrecto | Asegúrate de que sea `SKILL.md` (mayúsculas) |
| El skill no se carga | Faltan campos obligatorios | Verifica que `name` y `description` estén presentes |
| El skill no se detecta | Nombre duplicado | Asegura que el nombre sea único en todas las ubicaciones |
| El skill está oculto | Permiso `deny` | Revisa la configuración de permisos en `opencode.json` |
| El skill pide confirmación | Permiso `ask` | Confirma manualmente o cambia a `allow` |


*Esta guía se basa en la documentación oficial de Claude Code, OpenCode, GitHub Copilot y agentskills.io. Consulta la documentación específica de cada plataforma para detalles adicionales y actualizaciones.*
