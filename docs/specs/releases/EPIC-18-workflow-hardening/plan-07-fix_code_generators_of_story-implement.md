---
type: plan
id: plan-07
slug: plan-07-fix_code_generators_of_story-implement
title: "Corregir desincronización en code_generators de story-implement"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-workflow-hardening
---

# Corregir desincronización en code_generators de story-implement

## Contexto

Al verificar el código real de `story-implement` (no la propuesta hipotética) encontré que el verdadero problema no es la falta de un manifest, sino una desincronización entre tres archivos que deberían describir el mismo contrato (`implement.code_generators` en `sddf.config.yaml`):

1. **`sddf.config.yaml` (raíz, ya corregido a mano por el usuario durante esta sesión)** ahora usa el formato de lista correcto:
   ```yaml
   code_generators:
     - layer: monolithic # este repo no tiene capas frontend/backend/database — todo el "código de producción" son skills
       skill: skill-master
       required: true
     - layer: frontend
       skill: code-frontend-library-react
       required: false
     - layer: backend
       skill: none
       required: false
     - layer: database
       skill: none
       required: false
   ```
   Pero la entrada `frontend` tiene un bug real: `story-implement/SKILL.md` Paso 8 (líneas 408-432) solo omite una capa si `skill: none` (regla 1) o si el skill declarado no existe y `required: false` (regla 4). `required: false` **no desactiva una capa cuyo skill sí existe** — y `code-frontend-library-react` existe en `.claude/skills/`. Resultado: cada ciclo GREEN/REFACTOR de cualquier historia en este repo invocaría también el generador de componentes React, sin sentido en un repo que no tiene frontend. Esa entrada parece copiada sin adaptar desde `.claude/skills/sddf-init/assets/sddf.config.yaml.template:64-66` (la plantilla para proyectos que sí construyen una librería React).

2. **`.claude/skills/story-implement/README.md:119`** describe una "forma simplificada de un solo generador" (`code_generators: { skill: skill-master, required: true }`, sin `layer` ni lista) como la convención válida para repos solo-skills como este. Pero **el `SKILL.md` nunca implementó esa forma**: el Paso 8 (línea 396) dice literalmente "Extraer `implement.code_generators` como lista" y itera `{layer, skill, required}` sobre ella — un objeto único nunca habría funcionado. El propio repo ya abandonó esa forma (ver punto 1, ahora es una lista), así que la doc quedó describiendo un comportamiento que ni el código soporta ni el propio repo usa.

3. **`.claude/skills/story-implement/evals/evals.json`**, casos TC-004 a TC-009 (las únicas pruebas de las fases GREEN/REFACTOR), usan **todas** la clave obsoleta singular `code_generator` como objeto (`{"code_generator": {"skill": "story-code-nodejs", "required": true}}`), sin `layer` ni lista — el esquema *anterior* a que el commit `5c31a4c` ("enhance story-implement SKILL.md to accept layers categories") introdujera el formato de lista por capas. Si se ejecutaran hoy contra el `SKILL.md` real, el Paso 8 trataría `implement.code_generators` como ausente y emitiría `❌ implement.code_generators no declarado o vacío en sddf.config.yaml` — exactamente lo opuesto al resultado esperado (`✅`, `Fase GREEN`, etc.) que cada caso declara. Es decir: **las 6 pruebas de GREEN/REFACTOR están actualmente rotas/obsoletas** y nadie lo detectó porque no se han vuelto a correr desde ese commit.

Decisión tomada con el usuario: estandarizar siempre en el formato de lista (ya validado por el propio repo con `monolithic`), en vez de enseñarle a `SKILL.md` a aceptar dos formas distintas. Es la opción más simple (KISS) y evita mantener dos contratos.

## Cambios

### 1. `sddf.config.yaml` (raíz)
- Cambiar la entrada `frontend` de `skill: code-frontend-library-react` a `skill: none`, igual que `backend`/`database`, ya que este repo no genera código frontend.
- Limpiar el comentario redundante de la línea `layer: monolithic # or monolithic if your project doesn't have clear layers` (el valor ya es `monolithic`, el comentario actual se lee como si dijera "monolithic si no es monolithic"). Reemplazar por algo como: `layer: monolithic # este repo no tiene capas frontend/backend/database — todo el "código de producción" son skills`.

### 2. `.claude/skills/story-implement/README.md` (línea ~119)
- Quitar la mención a la "forma simplificada de un solo generador" sin `layer` ni lista.
- Documentar en su lugar que incluso un proyecto de una sola capa debe declarar `code_generators` como lista de un elemento, usando `layer: monolithic` como convención — con el `sddf.config.yaml` raíz de este mismo repo como ejemplo canónico (ya correcto tras el cambio del punto 1).

### 3. `.claude/skills/story-implement/evals/evals.json` (TC-004 a TC-009)
- Reemplazar en cada caso `input.sddf_config.IMPLEMENT.code_generator` (objeto singular) por `input.sddf_config.IMPLEMENT.code_generators` (lista, con un único elemento `{layer: "monolithic", skill: "story-code-nodejs", required: true}` para preservar el escenario de cada caso sin cambiar lo que prueban).
- Revisar si las claves de resultado simulado (`code_generator_green_result`, `code_generator_refactor_result`) deben ajustarse para reflejar que ahora son el resultado de la capa `monolithic` específicamente (p. ej. mantenerlas igual si el runner de `skill-test-evals` las trata como resultado del único generador activo, o anidarlas por layer si el runner itera explícitamente — confirmar leyendo cómo `skill-test-evals` consume estos campos antes de decidir el nombre final).
- No es necesario agregar un caso nuevo para la "forma simplificada de objeto único": esa forma queda deprecada por el punto 2, así que no hace falta darle cobertura.

## Verificación

- Tras editar el `SKILL.md` no se toca (el Paso 8 ya implementa correctamente el formato de lista; el bug estaba en los *datos* de configuración y en la *documentación*, no en la lógica del orquestador).
- Trazar a mano TC-004 a TC-009 contra el `SKILL.md` Paso 8-10 actual tras el fix: confirmar que `code_generators` ya no dispara la rama `❌ ... no declarado o vacío`, que `layer="monolithic"` se resuelve en las rutas `.tmp/story-implement/{story_id}/green|refactor/monolithic/results.json`, y que los mensajes `[GREEN/{layer}]` / `[REFACTOR/{layer}]` quedan coherentes.
- Si existe un comando o flujo para ejecutar `skill-test-evals` sobre `story-implement` (modo `evals`), correrlo después del fix para confirmar pass real en TC-001 a TC-009, no solo la traza manual.
- Revisar que `sddf.config.yaml.example` (mismo directorio que `.template`) no necesite el mismo ajuste de `frontend` — ese archivo es un ejemplo para proyectos React reales (`code-frontend-library-react` sí aplica ahí), así que no debería tocarse.
