# Test 03 — Error: documento indicado no existe → fallback a modo interactivo

**Invocación:** `/project-context-diagram docs/specs/projects/PROJ-99-inexistente/project.md`

---

## Flujo de conversación esperado

**Skill:**
> ⚙️ SPECS_BASE = `docs` (SDDF_ROOT no está definida)  
> ✅ Template `assets/c4-context-template.puml` encontrado.  
> Verificando ruta indicada: `$SPECS_BASE/specs/projects/PROJ-99-inexistente/project.md`...

**Skill:**
> ❌ No se encontró el archivo de especificaciones indicado: `$SPECS_BASE/specs/projects/PROJ-99-inexistente/project.md`
>
> Proyectos disponibles en `$SPECS_BASE/specs/projects/`:
> - `PROJ-01-agile-sddf`
>
> ¿Cómo deseas continuar?
> - **A)** Usar `PROJ-01-agile-sddf/project.md` como base para el diagrama
> - **B)** Continuar en modo interactivo con preguntas guiadas

**Usuario:** B

---

## Continuación en modo interactivo

El skill continúa con el flujo de preguntas guiadas del modo `--interactive` (ver test-01-modo-interactivo.md).

**Skill:** ¿Cómo se llama el sistema que estás documentando?  
**Usuario:** Sistema de Inventario

**Skill:** ¿Qué hace este sistema en una frase?  
**Usuario:** Gestiona el stock de productos y genera alertas de reposición.

_(... flujo interactivo continúa hasta completar actores, sistemas externos y relaciones ...)_

---

## Resultado esperado

**Skill:**
> ✅ Diagrama de contexto C4 generado:  
> `$SPECS_BASE/specs/projects/PROJ-01-agile-sddf/context-diagram.puml`
>
> Para renderizarlo localmente, instala la extensión PlantUML en VS Code (ext: jebbs.plantuml) o visita https://www.plantuml.com/plantuml

---

## Verificaciones del escenario

- [x] El skill **no termina abruptamente** cuando el archivo no existe
- [x] El skill muestra el error de forma clara con la ruta indicada
- [x] El skill lista los proyectos disponibles para orientar al usuario
- [x] El skill ofrece dos opciones recuperables (usar proyecto existente o modo interactivo)
- [x] El skill produce un `context-diagram.puml` válido tras el fallback
