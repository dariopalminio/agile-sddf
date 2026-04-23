---
name: openspec-generate-baseline
description: Genera una línea base de especificaciones OpenSpec mediante ingeniería inversa del código fuente. Lee src/, README.md y AGENTS.md para deducir el comportamiento actual, propone los artefactos como un change llamado "baseline" y lo archiva directamente sin fase de apply. Usar cuando un proyecto ya tiene código pero no tiene especificaciones OpenSpec.
license: MIT
compatibility: Requires openspec CLI, openspec/config.yaml, and opsx:propose + opsx:archive skills.
metadata:
  author: sddf
  version: "1.0"
---

Genera una línea base de especificaciones OpenSpec haciendo ingeniería inversa del código existente y la archiva como punto de referencia histórico.

**Flujo:** `/opsx:propose baseline` (reverse engineering) → `/opsx:archive` (sin apply)

---

**Pasos**

1. **Verificar el directorio de código fuente**

   Comprueba si existe el directorio `src/` en la raíz del proyecto:
   - Si existe `src/` → úsalo como directorio fuente principal y continúa
   - Si **no** existe `src/` → lista todos los directorios en la raíz del proyecto y pregunta al usuario: *"No se encontró el directorio `src/`. ¿Cuál de estos directorios contiene el código fuente?"*. Usa el directorio que indique el usuario.

2. **Verificar si ya existe un change `baseline`**

   Comprueba si existe `openspec/changes/baseline/`:
   - Si **no** existe → continúa al paso 3
   - Si **existe** → pregunta al usuario con dos opciones:
     - **Sobreescribir**: elimina el change existente y crea uno nuevo llamado `baseline`
     - **Sufijo de fecha**: crea el nuevo change con nombre `baseline-YYYY-MM-DD` (usando la fecha actual)

   Usa el nombre elegido en todos los pasos siguientes.

3. **Invocar `/opsx:propose` con instrucción de ingeniería inversa**

   Usa el skill `/opsx:propose` pasando como descripción del cambio el siguiente prompt de reverse engineering:

   > **Nombre del change:** `baseline` (o el elegido en el paso 2)
   >
   > **Instrucción para la propuesta:**
   > Por favor, lee exhaustivamente el código fuente en el directorio `<directorio-fuente>/` y el archivo `README.md` y `AGENTS.md` (si existe), y genera a la inversa (haciendo ingeniería inversa del código para retrofitting y deducción de features implementadas) los artefactos de especificación de OpenSpec que describan:
   > - El comportamiento actual del sistema (qué hace hoy, cómo lo hace)
   > - Las reglas de negocio implementadas (validaciones, condiciones, restricciones)
   > - Los flujos principales de usuario o datos (happy paths y casos de error detectados)
   > - Las capabilities existentes, agrupadas por dominio funcional
   >
   > Los artefactos generados son una **aproximación inicial** basada en el código actual. Deben revisarse manualmente para completar lo que no sea inferible del código (intención de negocio, decisiones de diseño no expresadas en código).

   Espera a que `/opsx:propose` complete todos los artefactos (proposal.md, design.md, specs/, tasks.md).

4. **Saltar la fase de apply**

   **No ejecutes `/opsx:apply`.**

   El código ya existe — no hay implementación pendiente. El change de baseline documenta el estado actual del sistema, no planifica trabajo nuevo.

5. **Archivar el change directamente**

   Invoca el skill `/opsx:archive` con el nombre del change (`baseline` o el elegido en el paso 2).

   Cuando `/opsx:archive` solicite confirmación sobre tareas incompletas en `tasks.md`, confirma que se desea archivar de todas formas: en un baseline las tareas no representan trabajo a realizar.

6. **Confirmar el resultado al usuario**

   Muestra un resumen final:
   ```
   ## Baseline generado y archivado

   **Change archivado:** openspec/changes/archive/YYYY-MM-DD-baseline/
   **Specs generados en:** openspec/specs/<capability>/spec.md

   La línea base refleja el estado del sistema al momento de adoptar OpenSpec.
   Revisa los specs generados y completa manualmente cualquier sección marcada
   como inferencia de baja confianza o con placeholders.

   Para el próximo cambio real, usa `/opsx:propose` normalmente.
   ```
