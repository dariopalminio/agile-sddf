---
alwaysApply: false
type: story
id: STORY-085
kind: feat
slug: STORY-085-integrar-config-sddf-init
title: "Mejora de experiencia de inicialización"
status: COMPLETED
substatus: DONE
parent: 
created: 2026-05-30
updated: 2026-05-30
related:
---
[[]]

# 📖 Historia: Mejora de experiencia de inicialización

## Narrativa

**Como** desarrollador que adopta el framework SDDF en un proyecto nuevo ejecutando `/sddf-init`,  
**Quiero** que el skill `sddf-init` cree automáticamente el archivo `sddf.config.yaml` en la raíz del proyecto a partir de un template en `assets/`,  
**Para** que los skills que dependen de esta configuración operacional (`story-implement`, `story-design`, `story-testcases`) funcionen correctamente desde el primer uso, sin emitir warnings por ausencia del archivo ni requerir creación manual por mi parte.

---

## Contexto de negocio

El archivo `sddf.config.yaml` contiene la configuración operacional del framework (comandos de test y skills configurados). Actualmente reside en la raíz del proyecto, pero `sddf-init` no lo genera al inicializar un entorno nuevo. Como consecuencia, cualquier proyecto inicializado con `/sddf-init` queda en un estado incompleto: los skills consumidores emiten warnings y el usuario debe crear el archivo manualmente, lo que rompe la promesa de "inicialización lista para usar".

La solución replica el patrón ya validado con `openspec/config.yaml`: un template en `assets/` y un paso de generación idempotente dentro del skill.

---

## Alcance

**Incluye:**
- Creación del template `.claude/skills/sddf-init/assets/sddf.config.yaml.template`.
- Nuevo Paso 3 en `sddf-init/SKILL.md` que genera `sddf.config.yaml` en la raíz del proyecto.
- Renumeración de los pasos siguientes (3→4, 4→5, 5→6, 6→7).
- Actualización del informe final (Paso 7) para incluir la línea `[CREADO] sddf.config.yaml`.
- Comportamiento idempotente: si el archivo ya existe con contenido, no se sobrescribe.

**No incluye:**
- Modificar la estructura o el esquema del `sddf.config.yaml` en sí.
- Alterar el comportamiento de los skills consumidores (`story-implement`, `story-design`, `story-testcases`).
- Migración de proyectos existentes que ya tengan el archivo.

---

## Criterios de Aceptación

### CA-1 — Creación en proyecto limpio
**Dado** un directorio de proyecto sin `sddf.config.yaml`,  
**Cuando** ejecuto `/sddf-init`,  
**Entonces** el skill crea `sddf.config.yaml` en la raíz del proyecto con exactamente el contenido definido en `.claude/skills/sddf-init/assets/sddf.config.yaml.template`,  
**Y** registra en el informe la línea `[CREADO]  sddf.config.yaml`.

### CA-2 — Manejo de archivo vacío
**Dado** un proyecto donde `sddf.config.yaml` existe pero está vacío,  
**Cuando** ejecuto `/sddf-init`,  
**Entonces** el skill lo crea/popula con el contenido del template,  
**Y** registra `[CREADO]  sddf.config.yaml`.

### CA-3 — Idempotencia (archivo existente con contenido)
**Dado** un proyecto donde `sddf.config.yaml` ya existe con contenido,  
**Cuando** ejecuto `/sddf-init` nuevamente,  
**Entonces** el skill **no** sobrescribe el archivo,  
**Y** registra `[YA EXISTÍA]  sddf.config.yaml`,  
**Y** emite `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`.

### CA-4 — Informe final actualizado
**Dado** cualquier ejecución de `/sddf-init`,  
**Cuando** el skill llega al Paso 7 (informe final),  
**Entonces** el informe incluye la línea correspondiente a `sddf.config.yaml` (`[CREADO]` o `[YA EXISTÍA]` según corresponda),  
**Y** la numeración de los pasos del SKILL.md es coherente y secuencial (1 a 7).

### CA-5 — Paridad con el template
**Dado** el template `assets/sddf.config.yaml.template`,  
**Cuando** comparo su contenido con el `sddf.config.yaml` de referencia en la raíz,  
**Entonces** ambos son idénticos en estructura y valores,  
**Y** el convenio de nombres sigue el patrón existente (`config.yaml.template` → `sddf.config.yaml.template`).

### CA-6 — Consumidores sin warnings
**Dado** un proyecto recién inicializado con `/sddf-init`,  
**Cuando** invoco `story-implement`, `story-design` o `story-testcases`,  
**Entonces** ninguno de ellos emite warnings por ausencia de `sddf.config.yaml`.

---

## Definición de Terminado (DoD)

- [ ] Template `assets/sddf.config.yaml.template` creado con contenido idéntico al `sddf.config.yaml` de referencia.
- [ ] `SKILL.md` actualizado: nuevo Paso 3 insertado y pasos 3–6 renumerados a 4–7.
- [ ] Ejemplo del informe final (Paso 7) actualizado con la línea de `sddf.config.yaml`.
- [ ] Verificación manual: `/sddf-init` en directorio limpio crea el archivo.
- [ ] Verificación manual: `/sddf-init` repetido es idempotente (`[YA EXISTÍA]`).
- [ ] Sin regresiones en la creación de `openspec/config.yaml`.

---

## Valor entregado

- **Para el usuario:** inicialización completa y funcional en un solo comando, sin pasos manuales ni warnings.
- **Para el framework:** cierra una brecha de onboarding que hoy degrada la primera impresión del producto y genera soporte innecesario.
- **Para el equipo:** refuerza el patrón ya probado de `assets/*.template`, reduciendo deuda de consistencia entre skills.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sobrescribir configuración personalizada del usuario | CA-3 garantiza comportamiento idempotente no destructivo |
| Desincronización futura entre template y `sddf.config.yaml` de referencia | CA-5 exige paridad; documentar en el skill que el template es la fuente canónica |
| Errores en la renumeración de pasos del SKILL.md | CA-4 valida coherencia secuencial 1–7 |

---

## Notas para el equipo

- El template debe tratarse como **fuente canónica** del `sddf.config.yaml` inicial; cualquier cambio al esquema debe reflejarse primero en el template.
- Seguir estrictamente el patrón de `openspec/config.yaml` para mantener consistencia interna del skill.

