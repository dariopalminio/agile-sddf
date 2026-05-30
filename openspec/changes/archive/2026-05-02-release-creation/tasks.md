## 1. Preparación y assets

- [x] 1.1 Copiar `release-spec-template.md` desde `.claude/skills/release-format-validation/assets/` a `.claude/skills/release-creation/assets/`
- [x] 1.2 Crear el directorio `.claude/skills/release-creation/examples/` para los casos de prueba

## 2. Construcción del skill con skill-master

- [x] 2.1 Invocar el skill `skill-master` con intent: "crear skill interactivo `release-creation` que complete el template release dinámicamente preguntando al usuario sección por sección"
- [x] 2.2 Redactar el draft inicial de `SKILL.md` incluyendo: descripción, triggers, flujo de fases (Fase 0: resolver input, Fase 1: leer template, Fase 2: preguntas obligatorias, Fase 3: preguntas opcionales, Fase 4: generar archivo, Fase 5: validar)
- [x] 2.3 Documentar el frontmatter YAML del `SKILL.md` con `name`, `description` y triggers correctos

## 3. Implementación del flujo interactivo en SKILL.md

- [x] 3.1 Fase 0 — Resolver modo de ejecución: detectar si se pasó `--quick` o descripción libre; derivar el slug del nombre del release
- [x] 3.2 Fase 1 — Leer template: leer `assets/release-spec-template.md` y extraer secciones obligatorias (`<!-- sección obligatoria`) y opcionales (`<!-- sección opcional`)
- [x] 3.3 Fase 2 — Completar frontmatter: preguntar Título, Versión, Estado (default: BACKLOG), Fecha (default: hoy) con valores sugeridos
- [x] 3.4 Fase 3 — Completar secciones obligatorias: para cada sección obligatoria extraída, formular pregunta clara con contexto, sin permitir skip
- [x] 3.5 Fase 4 — Completar secciones opcionales: para cada sección opcional, preguntar "¿Quieres completar [sección]? (sí / no)" con opción de "saltar todas"
- [x] 3.6 Fase 5 — Generar archivo: consolidar respuestas, construir el `release.md` completo siguiendo la estructura del template, crear directorio si no existe, manejar conflicto si ya existe
- [x] 3.7 Fase 6 — Validación automática: invocar `release-format-validation` sobre el archivo generado y mostrar resultado; si REFINAR, ofrecer completar secciones faltantes en el momento

## 4. Casos de prueba documentados

- [x] 4.1 Crear `examples/test-01-release-minimo.md`: flujo completo con solo secciones obligatorias (modo `--quick`)
- [x] 4.2 Crear `examples/test-02-release-completo.md`: flujo completo con todas las secciones opcionales respondidas
- [x] 4.3 Crear `examples/test-03-directorio-existente.md`: flujo donde el directorio de destino ya existe y el usuario elige sobreescribir

## 5. Registro en skills-lock.json

- [x] 5.1 Añadir entrada del nuevo skill `release-creation` en `skills-lock.json` con su descripción y `file` apuntando a `.claude/skills/release-creation/SKILL.md`
