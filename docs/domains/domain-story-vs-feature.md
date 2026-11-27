
# Story vs Feature

Una Story (o User Story) es una unidad de trabajo y planificación de un cambio, que captura una necesidad del usuario y su contexto, generalmente siguiendo el formato `Como / Quiero / Para`. 
Contiene Criterios de Aceptación generalmente escritos como escenarios Gherkin.
Puede contener requerimientos (Requirement) funcionales (FRs) o no funcionales (NFRs).

Una Story se corresponde con Features y Scenarios dentro de la documentación viva.

```mermaid
flowchart TD
    subgraph PlanificacionDelCambio ["Changes - Planificación Ágil (Temporal)"]
        US["User Story<br/>(Como / Quiero / Para)"]
        REQ["Requirement<br/>(Requisitos / Reglas de negocio)"]
        AC["Criterios de Aceptación<br/>(Formato Escenario Gherkin)"]
        US -->|"define (1 a N)"| REQ
        US -->|"define (1 a N)"| AC
        REQ -.->|"se validan mediante"| AC
    end

    subgraph DocumentacionSpecViva ["Specs - Documentación Viva - Archivo .feature (Permanente)"]
        FEAT["Feature<br/>(Capacidad del sistema)"]
        RULE["Rule (Opcional)<br/>(Regla de negocio específica)"]
        SCEN["Scenario / Example<br/>(Gherkin Ejemplo concreto en estilo declarativo)"]
        STEPS["Pasos Gherkin<br/>(Given / When / Then)"]
        FEAT -->|"agrupa (0 a N)"| RULE
        RULE -->|"ilustrada por (1 a N)"| SCEN
        FEAT -.->|"contiene directo si no hay Rule"| SCEN
        SCEN -->|"compuesto por (1 a N)"| STEPS
    end

    subgraph VerificacionAutomatizadaDelSpec ["Código - Ejecución en Cucumber"]
        SDTEST["Step Definitions<br/>(Test Code)"]
        SYS["Sistema bajo prueba (Source Code)"]
        SDTEST -->|"verifica"| SYS
    end

    US -.->|"alimenta o modifica (N a M)"| FEAT
    REQ -->|"se mapean a (1 a N)"| RULE
    AC -->|"se trasladan a (1 a N)"| SCEN
    STEPS -->|"se mapean a (N a 1)"| SDTEST
```