<!-- Referencias -->
[[FEAT-057-skill-para-diseno]]

## ADDED Requirements

### Requirement: Generar design.md desde story.md
El skill `story-design` SHALL leer el archivo `story.md` del directorio de la historia indicado y generar un archivo `design.md` en el mismo directorio, siguiendo la estructura definida en `$SPECS_BASE/specs/templates/design-template.md`.

#### Scenario: Generación exitosa
- **WHEN** el usuario ejecuta `/story-design` con la ruta a un directorio que contiene un `story.md` válido, el template `design-template.md` existe y las políticas del proyecto están en `$SPECS_BASE/policies/`
- **THEN** el skill genera `design.md` en el mismo directorio de la historia con frontmatter válido que referencia el ID de la historia, contenido técnico alineado con `constitution.md`, y la estructura definida por el template

#### Scenario: Template de diseño no encontrado
- **WHEN** el usuario ejecuta `/story-design` y el archivo `$SPECS_BASE/specs/templates/design-template.md` no existe
- **THEN** el skill muestra un mensaje de error con la ruta del template faltante y no genera ningún archivo `design.md`

#### Scenario: story.md no encontrado en el directorio indicado
- **WHEN** el usuario ejecuta `/story-design` apuntando a un directorio que no contiene `story.md`
- **THEN** el skill muestra un mensaje de error indicando que `story.md` no fue encontrado y sugiere verificar la ruta o ejecutar primero `/release-generate-stories`

---

### Requirement: Verificación de entorno con skill-preflight
El skill SHALL invocar `skill-preflight` como Paso 0 antes de ejecutar cualquier lógica de generación. Si el preflight retorna `✗ Entorno inválido`, la ejecución SHALL detenerse sin generar ningún archivo.

#### Scenario: Entorno válido
- **WHEN** el usuario ejecuta `/story-design` y el entorno SDDF está correctamente configurado
- **THEN** el preflight retorna `✓ Entorno OK` y el skill continúa con la generación

#### Scenario: Entorno inválido
- **WHEN** el usuario ejecuta `/story-design` y el preflight detecta un error bloqueante (ej. SDDF_ROOT apunta a ruta inexistente)
- **THEN** el skill muestra el informe de errores del preflight y detiene la ejecución sin crear ningún archivo

---

### Requirement: Fase de investigación de alternativas técnicas
El `design.md` generado SHALL incluir una sección documentando al menos dos alternativas técnicas consideradas y la decisión tomada con su justificación, respetando las políticas y constitución del proyecto.

#### Scenario: Alternativas documentadas en el design
- **WHEN** el skill genera `design.md` exitosamente
- **THEN** el documento incluye una sección de alternativas técnicas con al menos dos opciones evaluadas, la decisión final seleccionada y la razón por la cual se descartaron las alternativas

---

### Requirement: Coherencia con constitution.md
El contenido técnico de `design.md` SHALL alinearse con las restricciones definidas en `$SPECS_BASE/policies/constitution.md` (stack, convenciones, principios técnicos inamovibles).

#### Scenario: constitution.md presente y leído
- **WHEN** el skill genera `design.md` y `$SPECS_BASE/policies/constitution.md` existe
- **THEN** el skill lee `constitution.md` antes de generar el contenido técnico y el design resultante no contradice ningún principio técnico inamovible definido allí

#### Scenario: constitution.md ausente
- **WHEN** el skill ejecuta `/story-design` y `$SPECS_BASE/policies/constitution.md` no existe
- **THEN** el skill emite una advertencia indicando que no se encontraron políticas del proyecto y continúa la generación con el contexto disponible

---

### Requirement: Trazabilidad mediante frontmatter
El archivo `design.md` generado SHALL incluir un frontmatter YAML válido que contenga al menos los campos `type`, `id` (referenciando el ID de la historia origen), `slug`, `created` y `updated`.

#### Scenario: Frontmatter generado correctamente
- **WHEN** el skill genera `design.md` para la historia con ID `FEAT-NNN`
- **THEN** el frontmatter de `design.md` contiene `type: design`, `id: FEAT-NNN` y las fechas de creación y actualización

---

### Requirement: Creación del skill con skill-master
El skill `story-design` SHALL ser construido usando el skill `skill-master`, garantizando que incluya frontmatter YAML estandarizado, estructura de directorios conforme al patrón SDDF (`SKILL.md`, `assets/`, `examples/`) y casos de prueba documentados.

#### Scenario: Estructura del skill generada con skill-master
- **WHEN** se crea el skill `story-design` usando `/skill-master`
- **THEN** el directorio `.claude/skills/story-design/` contiene `SKILL.md` con frontmatter YAML válido, el subdirectorio `assets/` con el template de diseño, y al menos un ejemplo en `examples/`
