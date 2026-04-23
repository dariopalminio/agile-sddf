---
alwaysApply: false
---
**Título**: Generar línea base de OpenSpec mediante ingeniería inversa
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-23
**FINVEST Score:** —
**FINVEST Decisión:** —
---

## 📖 Historia: Generar línea base de OpenSpec mediante ingeniería inversa

**Como** tech lead que incorpora OpenSpec a un proyecto con código ya implementado
**Quiero** ejecutar el skill `/openspec-generate-baseline` para que analice el código fuente y genere y archive automáticamente los artefactos de especificación como baseline
**Para** obtener una línea base de especificaciones vivas sin documentar manualmente lo que el código ya hace, dejando el proyecto especificado desde el primer día de adoptar OpenSpec

## ✅ Criterios de aceptación

### Escenario principal – Generación y archivado exitoso con src/ presente
```gherkin
Dado que el proyecto tiene un directorio "src/" en la raíz
  Y existe "openspec/config.yaml" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill analiza "src/", "README.md" y "AGENTS.md" (si existe) mediante ingeniería inversa
  Y genera los artefactos "proposal.md", "design.md", "specs/" y "tasks.md" en "openspec/changes/baseline/"
  Y archiva el change directamente en "openspec/changes/archive/YYYY-MM-DD-baseline/" sin ejecutar apply
  Y confirma el resultado mostrando la ruta del change archivado y los specs generados en "openspec/specs/"
```

### Escenario alternativo / error – Directorio src/ no existe
```gherkin
Dado que el proyecto no tiene un directorio "src/" en la raíz
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill lista todos los directorios disponibles en la raíz del proyecto
  Y solicita al usuario que indique cuál contiene el código fuente antes de continuar
  Pero no genera ningún artefacto hasta recibir la confirmación del directorio
```

### Escenario alternativo / error – Change baseline ya existe
```gherkin
Dado que ya existe "openspec/changes/baseline/" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill detecta el conflicto y pregunta al usuario con dos opciones:
  Y opción 1: sobreescribir el change "baseline" existente
  Y opción 2: crear uno nuevo con sufijo de fecha (ej. "baseline-2026-04-23")
  Pero no procede hasta que el usuario elija una opción
```

### Requerimiento
El flujo del skill es siempre `propose → archive`, sin pasar por `apply`. Las tareas generadas en `tasks.md` del change baseline no representan trabajo pendiente: el código ya existe. Cuando `/opsx:archive` solicite confirmación por tareas incompletas, el skill debe confirmar el archivado de todas formas.

## ⚙️ Criterios no funcionales

* El skill no modifica ni genera código fuente — es solo documentación especificada
* Los artefactos generados son una aproximación inicial; deben revisarse manualmente para completar lo no inferible del código (intención de negocio, decisiones de diseño implícitas)

## 📎 Notas / contexto adicional

El skill soporta solo `src/` como directorio fuente predeterminado en esta versión; si no existe, pide al usuario que lo indique. La generación automática de `openspec/config.yaml` desde cero queda fuera de scope (debe existir previamente). El change archivado sirve como punto de referencia histórico: "así funcionaba el sistema el día que adoptamos OpenSpec".
