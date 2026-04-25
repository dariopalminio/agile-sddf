
---
alwaysApply: false
---
**Título**: Error en instalación local de npm install agile-sddf en Windows 11
**Versión**: 1.0
**Estado**: Completed
**Fecha**: 2026-04-25
**FINVEST Score:** —
**FINVEST Decisión:** —
---

## Bug: Error en instalación local de npm install agile-sddf en Windows 11

## Descripción
No se instalan los skills ni los agentes al ejecutar "npm install agile-sddf" localmente en un proyecto windows 11, aunque el script de postinstalación muestra que se han instalado los skills, no se crean los directorios correspondientes ni se instalan los agentes.

## Pasos para reproducir

Dado que tengo un sistema windows 11
Y estoy dentro de un proyecto
Y existe el directorio .claude ls C:\User\code\project-test\.claude  
Cuando realizo la instalación "npm install agile-sddf"

## Resultado esperado

Entonces se instala agile-sddf en node_modules/agile-sddf
Y se instalan los archivos de agentes en .claude/agents
Y se instalan los archivos de skills en .claude/skills

## Resultado actual

### Caso 1 - Resultado actual:
Dado que tengo un sistema windows 11
Y estoy dentro de un proyecto
Y existe el directorio .claude ls C:\User\code\project-test\.claude  
Cuando realizo la instalación "npm install agile-sddf"
O Cuando  "npm install agile-sddf@latest"
O Cuando ejecuto "npm install agile-sddf --foreground-scripts"
Y se muestra en pantalla "npm install agile-sddf --foreground-scripts
up to date, audited 434 packages in 3s
111 packages are looking for funding
  run `npm fund` for details
5 vulnerabilities (1 moderate, 3 high, 1 critical)
To address all issues, run:
  npm audit fix
Run `npm audit` for details.
"Entonces no veo que se hayan instalado nada en el proyecto.
Y no existe ./claude con subdirectorio agents/
Y no se ven los skills a instalar

### Caso 2 - Resultado actual:
Dado que tengo un sistema windows 11
Y estoy dentro de un proyectoY existe el directorio .claude ls C:\User\code\project-test\.claude  
Cuando realizo la instalación "npm install agile-sddf"
Y ejecuto el script manualmente desde terminal
Entonces el resultado del script es
"C:\User\code\project-test> node node_modules/agile-sddf/scripts/postinstall.jsSDDF postinstall: copying skills and agents to C:\User\code\project-test\.claude
  Skipped (already exists): C:\User\code\project-test\.claude\skills\openspec-apply-change
  Skipped (already exists): C:\User\code\project-test\.claude\skills\openspec-archive-change
  Skipped (already exists): C:\User\code\project-test\.claude\skills\openspec-explore
  Installed: C:\User\code\project-test\.claude\skills\openspec-generate-baseline
  Installed: C:\User\code\project-test\.claude\skills\openspec-init-config
  Skipped (already exists): C:\User\code\project-test\.claude\skills\openspec-propose
  Installed: C:\User\code\project-test\.claude\skills\project-begin
  Installed: C:\User\code\project-test\.claude\skills\project-discovery
  Installed: C:\User\code\project-test\.claude\skills\project-flow
  Installed: C:\User\code\project-test\.claude\skills\project-planning
  Installed: C:\User\code\project-test\.claude\skills\project-story-mapping
  Installed: C:\User\code\project-test\.claude\skills\release-format-validation
  Installed: C:\User\code\project-test\.claude\skills\release-generate-all-stories
  Installed: C:\User\code\project-test\.claude\skills\release-generate-stories
  Installed: C:\User\code\project-test\.claude\skills\releases-from-project-plan
  Installed: C:\User\code\project-test\.claude\skills\reverse-engineering
  Installed: C:\User\code\project-test\.claude\skills\skill-creator
  Installed: C:\User\code\project-test\.claude\skills\story-creation
  Installed: C:\User\code\project-test\.claude\skills\story-evaluation
  Installed: C:\User\code\project-test\.claude\skills\story-refine
  Installed: C:\User\code\project-test\.claude\skills\story-split
SDDF installed (local): 17 skills, 0 agents (4 skipped)"
Entonces si existe ./ claude  con subdirectorio agents/
Y si se instalan los skills
Pero **NO** tiene los agentes instalados (los archivos de agentes no instalados).

## Posible causa

### Causa A — "up to date" significa que npm no reinstala

Cuando agile-sddf ya está instalado en la versión que consideras "latest", npm no hace nada. Sin instalación → sin postinstall. Esto no es un bug, es comportamiento estándar de npm.


up to date, audited 434 packages in 3s
= "ya tengo esta versión, no hay nada que hacer"

### Causa B — npm 7+ suprime el output del postinstall por defecto

Incluso en una instalación limpia, npm no muestra el output de los lifecycle scripts a menos que uses --foreground-scripts. El script SÍ corrió durante tu primera instalación, pero el output estaba oculto. Los skills probablemente SÍ se instalaron — los agents no, por el bug que acabamos de corregir.

### Causa C — Se salta la instalación de archivos sueltos de agentes
Los agents son archivos .agent.md directamente en .claude/agents/, pero la línea 34 del script hace if (!entry.isDirectory()) continue; — descarta todos los archivos y solo copia subdirectorios. Los skills funcionan porque cada skill es una carpeta. Los agents son archivos sueltos, así que todos se saltan silenciosamente.

### Causa D — El problema es process.cwd().

Lo que pasa cuando npm ejecuta el postinstall automáticamente:
npm cambia el cwd al directorio del paquete (node_modules/agile-sddf/) antes de ejecutar el script. Entonces:
SOURCE_DIR = node_modules/agile-sddf/.claude/ ✓
destDir = path.join(process.cwd(), '.claude') = node_modules/agile-sddf/.claude/ ✗ ← ¡mismo que el source!
Todo aparece como "skipped" porque source === destination, npm suprime el output, y el usuario no ve nada. La razón por la que funciona manualmente es que el usuario corre el script desde la raíz del proyecto, donde process.cwd() SÍ es el directorio correcto.

**El fix:** npm inyecta INIT_CWD con el directorio donde el usuario corrió npm (la raíz del proyecto).

## Postsolución

npm version patch         # 1.5.1 → 1.5.4
git tag -a v1.5.4 -m "Release  v1.5.4 - Fix postinstall script"
gh release create v1.5.4 --notes-from-tag
git push origin v1.5.4
npm publish --access public
// la versión subida es agile-sddf@1.5.4

Lo que pasará cuando publiquemos v1.5.4:

En el proyecto del usuario:
npm install agile-sddf@1.5.4 --foreground-scripts
Esto:

Detecta versión nueva → reinstala
Ejecuta el postinstall Y muestra el output
Instala skills Y agents correctamente

Con esto, npm install agile-sddf@latest --foreground-scripts en el proyecto del usuario debería mostrar el output completo con skills y agents instalados correctamente en .claude/ del proyecto.
