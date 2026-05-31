### Requirement: Configuración de ruta base (SPECS_BASE)
El skill SHALL determinar el directorio raíz de especificaciones antes de cualquier operación con archivos, leyendo la variable de entorno `SDDF_ROOT` y usando `$SPECS_BASE` en lugar de `docs` para todas las rutas de artefactos.

#### Scenario: SDDF_ROOT definida y ruta existe
- **WHEN** la variable de entorno `SDDF_ROOT` está definida y la ruta referenciada existe
- **THEN** el skill usa ese valor como `SPECS_BASE`

#### Scenario: SDDF_ROOT no definida
- **WHEN** la variable de entorno `SDDF_ROOT` no está definida
- **THEN** el skill usa `SPECS_BASE=docs`

#### Scenario: SDDF_ROOT definida pero ruta inexistente
- **WHEN** la variable de entorno `SDDF_ROOT` está definida pero la ruta no existe
- **THEN** el skill muestra `⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs` y usa `SPECS_BASE=docs`

### Requirement: Template leído dinámicamente en tiempo de ejecución
El skill SHALL leer el archivo `assets/release-spec-template.md` al inicio de la ejecución y extraer las secciones obligatorias y opcionales antes de formular cualquier pregunta al usuario.

#### Scenario: Template encontrado
- **WHEN** el skill inicia y el archivo `assets/release-spec-template.md` existe
- **THEN** el skill extrae las secciones `<!-- sección obligatoria` y `<!-- sección opcional` del template sin hardcodear nombres

#### Scenario: Template no encontrado
- **WHEN** el skill inicia y `assets/release-spec-template.md` no existe
- **THEN** el skill detiene la ejecución con mensaje de error indicando la ruta esperada

### Requirement: Flujo interactivo de preguntas por sección
El skill SHALL formular preguntas al usuario para completar cada campo del frontmatter y cada sección del template, comenzando por las secciones obligatorias antes de pasar a las opcionales.

#### Scenario: Completar secciones obligatorias
- **WHEN** el skill formula preguntas para las secciones marcadas como obligatorias
- **THEN** el usuario debe proveer una respuesta (no se permite saltar una sección obligatoria)

#### Scenario: Saltar secciones opcionales
- **WHEN** el skill formula preguntas para una sección opcional
- **THEN** el usuario puede responder "no" o "saltar" y la sección se omite del archivo final

#### Scenario: Modo rápido
- **WHEN** el usuario solicita el skill con el argumento `--quick` o responde "solo obligatorias" al inicio
- **THEN** el skill omite todas las secciones opcionales sin preguntar por ellas individualmente

### Requirement: Generación del slug y directorio de salida
El skill SHALL derivar automáticamente el slug kebab-case del nombre del release para construir la ruta de salida `$SPECS_BASE/specs/releases/<EPIC-NN-slug>/release.md`.

#### Scenario: Directorio nuevo
- **WHEN** el directorio `$SPECS_BASE/specs/releases/<slug>/` no existe
- **THEN** el skill crea el directorio y escribe `release.md` en él

#### Scenario: Directorio existente
- **WHEN** el directorio `$SPECS_BASE/specs/releases/<slug>/` ya existe
- **THEN** el skill pregunta al usuario si desea sobreescribir el archivo existente o elegir un nombre diferente

### Requirement: Archivo generado supera release-format-validation
El archivo `release.md` producido SHALL contener frontmatter completo (Título, Versión, Estado, Fecha) y todas las secciones obligatorias del template, de modo que supere la validación del skill `release-format-validation` con resultado APROBADO.

#### Scenario: Validación automática al finalizar
- **WHEN** el skill termina de escribir `release.md`
- **THEN** el skill invoca `release-format-validation` sobre el archivo generado y muestra el resultado al usuario

#### Scenario: Validación exitosa
- **WHEN** `release-format-validation` retorna APROBADO
- **THEN** el skill muestra confirmación con la ruta del archivo creado y sugiere el siguiente paso (`release-generate-stories`)

#### Scenario: Validación con observaciones
- **WHEN** `release-format-validation` retorna REFINAR
- **THEN** el skill muestra las secciones faltantes y ofrece completarlas de forma interactiva antes de terminar

### Requirement: Skill construido con metodología skill-master
El skill `release-creation` SHALL ser construido usando el skill `skill-master`, incluyendo la captura de intent, redacción del SKILL.md, y definición de casos de prueba documentados.

#### Scenario: Casos de prueba documentados
- **WHEN** el skill `release-creation` es creado
- **THEN** el directorio `.claude/skills/release-creation/` contiene `SKILL.md` y al menos 3 casos de prueba documentados en `examples/`
