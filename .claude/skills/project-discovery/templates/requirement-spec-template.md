---
alwaysApply: false
---
**Nombre del Sistema**: [Nombre del Proyecto]
**Categoría del Software**: [Librería UI | Aplicación Frontend | Servicio Backend | CLI | Otro]
**Título del Documento**: Especificación de Requisitos
**Versión**: [versión]
**Estado**: [Doing | Ready]
**Fecha**: [Fecha]
**Generado por**: [agente]

# 1. Definición del proyecto

## 1.1. Nombre de Proyecto
<!-- Nombre corto e identificador del proyecto. Debe ser único y descriptivo.
     Pregunta al usuario: "¿Cómo llamarías a este proyecto?" -->

## 1.2. Definición del Problema
<!-- Describe el problema central que este proyecto resuelve.
     Debe ser más preciso que el initial-prompt: quién sufre el problema, en qué contexto, cuál es el impacto.
     Pregunta al usuario: "¿Podemos refinar el problema? ¿Quién lo sufre más directamente y qué consecuencias tiene hoy?" -->

## 1.3. Visión (elevator pitch)
<!-- Síntesis posicionada del producto en formato estructurado.
     Completa cada línea con la información del proyecto. No omitas ninguna línea.
     1. **Para:** "¿Para quién va dirigido el producto o servicio (Personas, Usuarios, Clientes)?"
     2. **Quiénes:** "¿Qué necesidades, problemas o dolores resuelve el producto o servicio?"
     3. **Nuestro producto:** "¿Cuál es el nombre del producto?"
     4. **Es un:** "¿Cuál es la categoría de software según ejecución e interfaz de usuario 
     (Aplicación web, Aplicación móvil, Aplicación PWA, Aplicación de escritorio, API, Script, Bot, Chat-bot, CLI, AI-CLI, ETL, etc.)?
     y ¿qué tipo de modelo de negocio o producto es 
     (Plataforma, Aplicación de mensajería, SaaS, Superapp, Software empresarial -ERP, CRM, BPM-, Software de sistema, Middleware, 
     Streamming, E-learning, E-commerce, Microservicio, Integración, Automatización, WMS, OMS, TMS, etc.)?"
     5. **Que provee:** "¿Beneficio clave o razón para comprarlo?"
     6. **A diferencia de:** "¿Alternativas de la competencia?"
     7. **Nuestro producto:** "¿Cuáles son las diferencias claves, ventaja única y propuesta de valor diferenciadora?"
-->
- **Para:** [¿Para quién va dirigido el producto o servicio (Personas, Usuarios, Clientes)?]
- **Quiénes:** [¿Qué necesidades, problemas o dolores resuelve el producto o servicio?]
- **Nuestro producto:** [¿Cuál es el nombre del producto?]
- **Es un:** software [¿Cuál es el tipo o categoría de software según ejecución e interfaz de usuario (Aplicación web, Aplicación móvil, Aplicación PWA,Aplicación de escritorio, API, Script, Bot, Chat-bot, CLI, AI-CLI, ETL)?]
tipo [¿y qué tipo de modelo de negocio o producto es (Plataforma, Aplicación de mensajería, SaaS, Superapp, Software empresarial -ERP, CRM, BPM-, Software de sistema, Middleware, Streamming, E-learning, E-commerce, Microservicio, Integración, Automatización, WMS, OMS, TMS, etc.)?]
- **Que provee:** [¿Beneficio clave o razón para comprarlo?]
- **A diferencia de:** [¿Alternativas de la competencia?]
- **Nuestro producto:** [¿Cuáles son las diferencias claves, ventaja única y propuesta de valor diferenciadora?]

## 1.4. Beneficios Clave
<!-- Lista de los beneficios más importantes que el producto ofrece a los usuarios.
     Deben ser específicos y centrados en el usuario, no en características técnicas.
     Pregunta al usuario: "¿Cuáles son los beneficios más importantes que tu producto ofrece a los usuarios? Piensa en términos de resultados o mejoras concretas que experimentarán." -->
- [Beneficio clave 1]
- [Beneficio clave 2]
- [Beneficio clave 3]

## 1.5. Criterios de Éxito
<!-- Lista de criterios medibles y verificables que definen el éxito del proyecto.
     Deben ser más específicos que en initial-prompt: incluir métricas, plazos o condiciones concretas.
     Pregunta al usuario: "¿Cómo mediríamos el éxito en los primeros 3 meses?" -->
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]
- [ ] [Criterio medible 3]

## 1.6. Restricciones
<!-- Restricciones confirmadas que limitan el diseño y la implementación.
     Pregunta al usuario: "¿Hay restricciones adicionales que no mencionaste antes, o alguna cambió?" -->
- **Technical**: [Stack, APIs obligatorias, lenguajes, plataformas]
- **Time**: [Deadline o duración esperada]
- **Resources**: [Equipo, herramientas, presupuesto]

## 1.7. Fuera de alcance (Non-Goals)
<!-- Lista explícita de lo que este proyecto NO hará.
     Crítico para evitar scope creep. Derivar de lo que quedó fuera del MVP en initial-prompt.
     Pregunta al usuario: "¿Qué cosas podrían confundirse como parte del proyecto pero definitivamente no lo son?" -->
- [Qué NO hace este proyecto]
- [Qué queda para versiones futuras]


## 1.8. Características de los Usuarios

<!-- Lista los perfiles de usuario que interactuarán con el sistema. Para cada perfil incluye: nombre del perfil, descripción de su rol y contexto, y sus necesidades principales respecto al sistema. Basa esto en los usuarios identificados en el discovery. -->

- **US-001**: [Nombre de usuario]
    - **Descripción**: [Descripción detallada del usuario]

# 2. Requisitos

<!-- Lista los requisitos funcionales del sistema agrupados por categoría de funcionalidad. Cada requisito debe describir qué debe hacer el sistema (no cómo). Usa la forma "El sistema SHALL..." para requisitos normativos. Prioriza según impacto en el usuario y viabilidad. -->

### 2.1 [Categoría de Funcionalidad]

- **FR-001**: [Título del Requisito]
    - **Descripción**: [Descripción detallada del requisito]
    - **Prioridad**: [Alta | Media | Baja]
    - **Usuario**: [Perfil de usuario]

## 2.2. Requisitos No Funcionales

<!-- Lista los requisitos técnicos y de calidad del sistema: stack frontend, stack backend, base de datos, rendimiento, seguridad, escalabilidad, usabilidad, mantenibilidad, etc. Cada requisito debe ser medible o verificable. Incluye el stack tecnológico como NFR si está definido. -->

### 2.2.1 [Categoría de Requisito No Funcional]

- **NFR-001**: [Título del Requisito]
    - **Descripción**: [Descripción detallada del requisito]
    - **Prioridad**: [Alta | Media | Baja]
    - **Criterio de aceptación**: [Cómo se verifica que se cumple]

·## 2.3. Experiencia de usuario (UX) y Diseño de Interfaz (UI)

# 3. Diseño de interfaz gráfica (UI) y experiencia de usuario (UX)

## 3.1. Design Vibe
[1-2 frases describiendo la sensación general]

- **Ejemplos:**
  - "Moderno y minimalista, con sensación profesional"
  - "Amigable y divertido, con colores vibrantes"
  - "Serio y corporativo, transmite confianza"
  - "Fresco y juvenil, con bordes redondeados"

## 3.2. Visual Inspiration

- **Referencias:** [URLs de sitios/apps similares]
- **Estilo:** [Material Design / Apple HIG / Custom / Neumorphism / Glassmorphism]
- **Mood board:** [Descripción de imágenes de referencia]


## 3.3. Mapas de Navegación
Estilo Árbol Jerárquico (Tree)

Ejemplo:

Home
├── Products
│   ├── Software
│   │   ├── Desktop
│   │   └── Mobile
│   └── Hardware
├── Solutions
│   ├── Enterprise
│   └── Small Business
├── Support
│   ├── Documentation
│   ├── FAQ
│   └── Contact
└── About
    ├── Company
    ├── Careers
    └── Blog

## 3.4. Wireframe ASCII (Box Drawing)

Ejemplo:
┌──────────────────────────────────────────────────────────────┐
│  Dashboard                                    🔔 👤 Admin   │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│  📊 Overview  │  ┌─────────────────────────────────────┐    │
│  📁 Projects  │  │  Welcome back, User!               │    │
│  📈 Analytics │  │                                     │    │
│  ⚙️ Settings  │  │  Today's stats:                    │    │
│               │  │  • 12 active projects              │    │
│               │  │  • 34 pending tasks                │    │
│               │  │  • 89% completion rate             │    │
│               │  └─────────────────────────────────────┘    │
│               │                                              │
│               │  ┌─────────────┐ ┌─────────────┐           │
│               │  │  Chart 1    │ │  Chart 2    │           │
│               │  │             │ │             │           │
│               │  │    ██       │ │    ███      │           │
│               │  │   ███       │ │   ████      │           │
│               │  │  ████       │ │  █████      │           │
│               │  └─────────────┘ └─────────────┘           │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘

# 4. Arquitectura Técnica

## 4.1. Stack tecnológico
<!-- Describe el stack tecnológico propuesto para el proyecto, incluyendo frontend, backend, base de datos, servicios en la nube, etc. Si el stack ya está definido como requisito no funcional, puedes referenciarlo aquí. -->

## 11. Referencias

<!-- Enumera los documentos y recursos relacionados con esta especificación: discovery.md, project-intent.md, mockups, ADRs, documentación técnica externa, etc. -->

## 12. Definiciones y Acrónimos

<!-- Define los términos técnicos, acrónimos y conceptos de dominio utilizados en el documento para asegurar una interpretación uniforme. -->
