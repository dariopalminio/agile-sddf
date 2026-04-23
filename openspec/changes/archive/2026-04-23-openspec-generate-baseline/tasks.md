## 1. Crear estructura del skill

- [x] 1.1 Crear directorio `.claude/skills/openspec-generate-baseline/`
- [x] 1.2 Crear archivo `.claude/skills/openspec-generate-baseline/SKILL.md` con frontmatter YAML y las instrucciones completas del skill

## 2. Implementar instrucciones del skill

- [x] 2.1 Escribir la instrucción de verificación del directorio `src/`: si no existe, listar directorios raíz y pedir al usuario que indique el código fuente
- [x] 2.2 Escribir la instrucción de detección de change `baseline` existente: si existe, preguntar al usuario si sobreescribir o usar sufijo de fecha
- [x] 2.3 Escribir la instrucción de invocación de `/opsx:propose baseline` con el prompt de ingeniería inversa (leer `src/`, `README.md`, `AGENTS.md` si existe, deducir comportamiento actual, reglas de negocio y flujos principales)
- [x] 2.4 Escribir la instrucción de skip de apply: la fase de implementación se omite porque el código ya existe
- [x] 2.5 Escribir la instrucción de invocación de `/opsx:archive` inmediatamente tras completar los artefactos
- [x] 2.6 Escribir la confirmación final al usuario: ruta del change archivado y specs generados en `openspec/specs/`

## 3. Validación

- [x] 3.1 Verificar que el skill aparece en la lista de skills disponibles al invocar `/openspec-generate-baseline`
- [x] 3.2 Revisar que las instrucciones del SKILL.md cubren todos los escenarios de las specs (src/ existe, src/ no existe, baseline ya existe)
