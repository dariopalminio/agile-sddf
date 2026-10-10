---
alwaysApply: false
type: story
id: STORY-085
kind: feat
slug: STORY-085-integrar-config-sddf-init
title: "Mejora de experiencia de inicializaciÃ³n"
status: COMPLETED
substatus: DONE
parent: 
created: 2026-05-30
updated: 2026-05-30
related:
---
[[]]

# ðŸ“– Historia: Mejora de experiencia de inicializaciÃ³n

## Narrativa

**Como** desarrollador que adopta el framework SDDF en un proyecto nuevo ejecutando `/sddf-init`,  
**Quiero** que el skill `sddf-init` cree automÃ¡ticamente el archivo `sddf.config.yaml` en la raÃ­z del proyecto a partir de un template en `assets/`,  
**Para** que los skills que dependen de esta configuraciÃ³n operacional (`story-implement`, `story-design`, `story-testcases`) funcionen correctamente desde el primer uso, sin emitir warnings por ausencia del archivo ni requerir creaciÃ³n manual por mi parte.

---

## Contexto de negocio

El archivo `sddf.config.yaml` contiene la configuraciÃ³n operacional del framework (comandos de test y skills configurados). Actualmente reside en la raÃ­z del proyecto, pero `sddf-init` no lo genera al inicializar un entorno nuevo. Como consecuencia, cualquier proyecto inicializado con `/sddf-init` queda en un estado incompleto: los skills consumidores emiten warnings y el usuario debe crear el archivo manualmente, lo que rompe la promesa de "inicializaciÃ³n lista para usar".

La soluciÃ³n replica el patrÃ³n ya validado con `openspec/config.yaml`: un template en `assets/` y un paso de generaciÃ³n idempotente dentro del skill.

---

## Alcance

**Incluye:**
- CreaciÃ³n del template `.claude/skills/sddf-init/assets/sddf.config.yaml.template`.
- Nuevo Paso 3 en `sddf-init/SKILL.md` que genera `sddf.config.yaml` en la raÃ­z del proyecto.
- RenumeraciÃ³n de los pasos siguientes (3â†’4, 4â†’5, 5â†’6, 6â†’7).
- ActualizaciÃ³n del informe final (Paso 7) para incluir la lÃ­nea `[CREADO] sddf.config.yaml`.
- Comportamiento idempotente: si el archivo ya existe con contenido, no se sobrescribe.

**No incluye:**
- Modificar la estructura o el esquema del `sddf.config.yaml` en sÃ­.
- Alterar el comportamiento de los skills consumidores (`story-implement`, `story-design`, `story-testcases`).
- MigraciÃ³n de proyectos existentes que ya tengan el archivo.

---

## Criterios de AceptaciÃ³n

### CA-1 â€” CreaciÃ³n en proyecto limpio
**Dado** un directorio de proyecto sin `sddf.config.yaml`,  
**Cuando** ejecuto `/sddf-init`,  
**Entonces** el skill crea `sddf.config.yaml` en la raÃ­z del proyecto con exactamente el contenido definido en `.claude/skills/sddf-init/assets/sddf.config.yaml.template`,  
**Y** registra en el informe la lÃ­nea `[CREADO]  sddf.config.yaml`.

### CA-2 â€” Manejo de archivo vacÃ­o
**Dado** un proyecto donde `sddf.config.yaml` existe pero estÃ¡ vacÃ­o,  
**Cuando** ejecuto `/sddf-init`,  
**Entonces** el skill lo crea/popula con el contenido del template,  
**Y** registra `[CREADO]  sddf.config.yaml`.

### CA-3 â€” Idempotencia (archivo existente con contenido)
**Dado** un proyecto donde `sddf.config.yaml` ya existe con contenido,  
**Cuando** ejecuto `/sddf-init` nuevamente,  
**Entonces** el skill **no** sobrescribe el archivo,  
**Y** registra `[YA EXISTÃA]  sddf.config.yaml`,  
**Y** emite `[INFO] sddf.config.yaml ya existe â€” se mantiene sin cambios`.

### CA-4 â€” Informe final actualizado
**Dado** cualquier ejecuciÃ³n de `/sddf-init`,  
**Cuando** el skill llega al Paso 7 (informe final),  
**Entonces** el informe incluye la lÃ­nea correspondiente a `sddf.config.yaml` (`[CREADO]` o `[YA EXISTÃA]` segÃºn corresponda),  
**Y** la numeraciÃ³n de los pasos del SKILL.md es coherente y secuencial (1 a 7).

### CA-5 â€” Paridad con el template
**Dado** el template `assets/sddf.config.yaml.template`,  
**Cuando** comparo su contenido con el `sddf.config.yaml` de referencia en la raÃ­z,  
**Entonces** ambos son idÃ©nticos en estructura y valores,  
**Y** el convenio de nombres sigue el patrÃ³n existente (`config.yaml.template` â†’ `sddf.config.yaml.template`).

### CA-6 â€” Consumidores sin warnings
**Dado** un proyecto reciÃ©n inicializado con `/sddf-init`,  
**Cuando** invoco `story-implement`, `story-design` o `story-testcases`,  
**Entonces** ninguno de ellos emite warnings por ausencia de `sddf.config.yaml`.

---

## DefiniciÃ³n de Terminado (DoD)

- [ ] Template `assets/sddf.config.yaml.template` creado con contenido idÃ©ntico al `sddf.config.yaml` de referencia.
- [ ] `SKILL.md` actualizado: nuevo Paso 3 insertado y pasos 3â€“6 renumerados a 4â€“7.
- [ ] Ejemplo del informe final (Paso 7) actualizado con la lÃ­nea de `sddf.config.yaml`.
- [ ] VerificaciÃ³n manual: `/sddf-init` en directorio limpio crea el archivo.
- [ ] VerificaciÃ³n manual: `/sddf-init` repetido es idempotente (`[YA EXISTÃA]`).
- [ ] Sin regresiones en la creaciÃ³n de `openspec/config.yaml`.

---

## Valor entregado

- **Para el usuario:** inicializaciÃ³n completa y funcional en un solo comando, sin pasos manuales ni warnings.
- **Para el framework:** cierra una brecha de onboarding que hoy degrada la primera impresiÃ³n del producto y genera soporte innecesario.
- **Para el equipo:** refuerza el patrÃ³n ya probado de `assets/*.template`, reduciendo deuda de consistencia entre skills.

---

## Riesgos y mitigaciones

| Riesgo | MitigaciÃ³n |
|---|---|
| Sobrescribir configuraciÃ³n personalizada del usuario | CA-3 garantiza comportamiento idempotente no destructivo |
| DesincronizaciÃ³n futura entre template y `sddf.config.yaml` de referencia | CA-5 exige paridad; documentar en el skill que el template es la fuente canÃ³nica |
| Errores en la renumeraciÃ³n de pasos del SKILL.md | CA-4 valida coherencia secuencial 1â€“7 |

---

## Notas para el equipo

- El template debe tratarse como **fuente canÃ³nica** del `sddf.config.yaml` inicial; cualquier cambio al esquema debe reflejarse primero en el template.
- Seguir estrictamente el patrÃ³n de `openspec/config.yaml` para mantener consistencia interna del skill.

