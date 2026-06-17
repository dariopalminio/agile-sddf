# Mejores prácticas para el prompt de sistema

## Prompt de sistema en Github copilot

### copilot-instructions.md

El manual del equipo se guarda en `copilot-instructions.md` en la raíz del repositorio o en `.github/` y se aplica a todo el proyecto. El documento que todo nuevo empleado lee el primer día. «Usamos .NET 8, Clean Architecture y xUnit para las pruebas dotnet buildy la compilación». Copilot lo abre cada vez que le preguntas algo.

### *.instructions.md(con ámbito de ruta)

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

