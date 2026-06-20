# Test 01 — Modo interactivo: sistema con 2 actores y 2 sistemas externos

**Invocación:** `/project-context-diagram` (sin argumentos — modo `--interactive` por defecto)

---

## Flujo de conversación esperado

**Skill:**
> ⚙️ SPECS_BASE = `docs` (SDDF_ROOT no está definida)  
> ✅ Template `assets/c4-context-template.puml` encontrado.  
> Modo: `--interactive`

---

**Skill:** ¿Cómo se llama el sistema que estás documentando?  
**Usuario:** Portal de Gestión de Proyectos

**Skill:** ¿Qué hace este sistema en una frase?  
**Usuario:** Plataforma web que permite a equipos crear, gestionar y hacer seguimiento de proyectos y tareas.

---

**Skill:** ¿Cómo se llama el primer actor o rol que interactúa con el sistema?  
**Usuario:** Project Manager

**Skill:** ¿Cuál es su rol o cómo interactúa con el sistema?  
**Usuario:** Crea proyectos, asigna tareas y monitorea el avance del equipo.

**Skill:** ¿Hay otro actor? (Sí / No)  
**Usuario:** Sí

**Skill:** ¿Cómo se llama el siguiente actor?  
**Usuario:** Developer

**Skill:** ¿Cuál es su rol?  
**Usuario:** Actualiza el estado de las tareas asignadas y registra avance diario.

**Skill:** ¿Hay otro actor? (Sí / No)  
**Usuario:** No

---

**Skill:** ¿Cómo se llama el primer sistema externo?  
**Usuario:** Servicio de Email (SendGrid)

**Skill:** ¿Qué hace ese sistema? ¿Qué provee o consume?  
**Usuario:** Envía notificaciones de tareas asignadas y recordatorios de deadlines.

**Skill:** ¿Qué protocolo o tecnología usa la integración?  
**Usuario:** REST API / HTTPS

**Skill:** ¿Hay otro sistema externo? (Sí / No)  
**Usuario:** Sí

**Skill:** ¿Cómo se llama el siguiente sistema externo?  
**Usuario:** GitHub

**Skill:** ¿Qué hace ese sistema?  
**Usuario:** Repositorio de código fuente. Las tareas se vinculan a commits y pull requests.

**Skill:** ¿Qué protocolo usa la integración?  
**Usuario:** GitHub REST API / OAuth 2.0

**Skill:** ¿Hay otro sistema externo? (Sí / No)  
**Usuario:** No

---

**Skill:** ¿Qué hace el `Project Manager` con el `Portal de Gestión de Proyectos`?  
**Usuario:** Crea y gestiona proyectos y asignaciones a través de la interfaz web.

**Skill:** ¿Qué hace el `Developer` con el `Portal de Gestión de Proyectos`?  
**Usuario:** Actualiza el estado de sus tareas asignadas vía la app web.

**Skill:** ¿Qué hace el `Portal de Gestión de Proyectos` con `Servicio de Email (SendGrid)`?  
**Usuario:** Envía notificaciones automáticas a los miembros del equipo.

**Skill:** ¿Qué hace el `Portal de Gestión de Proyectos` con `GitHub`?  
**Usuario:** Sincroniza el estado de las tareas con commits y pull requests.

---

## Vista previa del diagrama generado

```plantuml
@startuml C4Context
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title Portal de Gestión de Proyectos — Diagrama de Contexto (C4 Nivel 1)

Person(pm, "Project Manager", "Crea proyectos, asigna tareas y monitorea el avance del equipo.")
Person(dev, "Developer", "Actualiza el estado de las tareas asignadas y registra avance diario.")

System(portal, "Portal de Gestión de Proyectos", "Plataforma web que permite a equipos crear, gestionar y hacer seguimiento de proyectos y tareas.")

System_Ext(sendgrid, "Servicio de Email (SendGrid)", "Envía notificaciones de tareas asignadas y recordatorios de deadlines.")
System_Ext(github, "GitHub", "Repositorio de código fuente. Las tareas se vinculan a commits y pull requests.")

Rel(pm, portal, "Crea y gestiona proyectos y asignaciones", "HTTPS/Web")
Rel(dev, portal, "Actualiza el estado de sus tareas asignadas", "HTTPS/Web")
Rel(portal, sendgrid, "Envía notificaciones automáticas a los miembros del equipo", "REST API / HTTPS")
Rel(portal, github, "Sincroniza el estado de las tareas con commits y pull requests", "GitHub REST API / OAuth 2.0")

@enduml
```

**Skill:** ¿El diagrama está correcto? (Sí / No / Editar)  
**Usuario:** Sí

---

## Resultado esperado

**Skill:**
> ✅ Diagrama de contexto C4 generado:  
> `$SPECS_BASE/specs/projects/PROJ-01-portal-gestion-proyectos/context-diagram.puml`
>
> Para renderizarlo localmente, instala la extensión PlantUML en VS Code (ext: jebbs.plantuml) o visita https://www.plantuml.com/plantuml
>
> Siguiente paso sugerido: `/project-planning`
