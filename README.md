<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:122562,100:BBA0CC&height=220&section=header&text=JM%20Agentic%20Development%20Kit&fontSize=42&fontColor=FFD700&fontAlignY=35&desc=De%20requisitos%20a%20producci%C3%B3n%20%E2%80%94%203%20plugins%20para%20el%20ciclo%20de%20vida%20completo&descSize=16&descColor=ffffff&descAlignY=55" alt="JM ADK Banner" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-3.0.0-137DC5?style=for-the-badge" alt="Versión" />
  <img src="https://img.shields.io/badge/licencia-MIT-122562?style=for-the-badge" alt="Licencia" />
  <img src="https://img.shields.io/badge/agentes-101-FFD700?style=for-the-badge" alt="Agentes" />
  <img src="https://img.shields.io/badge/skills-142-BBA0CC?style=for-the-badge" alt="Skills" />
  <img src="https://img.shields.io/badge/plugins%20core-3-808080?style=for-the-badge" alt="Plugins Core" />
</p>

---

## Acerca de JM ADK

**JM Agentic Development Kit** es un kit de desarrollo agéntico que integra 3 plugins de Claude Code (MAO, SA, PQA) para cubrir el ciclo completo de software: discovery, arquitectura y calidad. Cada tarea cuenta con trazabilidad y puertas de calidad.

Un solo kit, tres disciplinas, cero brechas entre lo que se descubre y lo que se entrega.

---

## Características principales

- **3 plugins integrados (MAO + SA + PQA)** — Discovery, arquitectura y calidad en un solo paquete
- **142 skills especializados** — Capacidades atómicas para cada fase del desarrollo
- **Discovery → Arquitectura → QA en un solo kit** — Pipeline end-to-end sin cambiar de herramienta
- **Zero-Hallucination Protocol** — Cada afirmación respaldada por evidencia verificable
- **Patrón MOAT** — Defensa estructural contra degradación de calidad
- **Quality Gates** — Puertas de calidad automáticas en cada transición

---

## Instalación

```bash
git clone https://github.com/JaviMontano/jm-adk.git && cd jm-adk
```

---

## Plugins incluidos

| Plugin | Prefijo | Agentes | Skills | Comandos | Enfoque |
|--------|---------|---------|--------|----------|---------|
| **Sovereign Architect** | `/sa:` | 66 | 128 | 120 | Arquitectura, revisión de código, evolución, reparación |
| **Plugin QA** | `/pqa:` | 4 | 20 | 31 | Ciclo de vida de desarrollo de plugins |
| **SDD MetodologIA** | `/sdd:` | -- | 12 | 37 | Spec Driven Development, BDD, inteligencia ambiental |

Todos gobernados por el **Intent Integrity Kit** — de la intención al código sin deriva.

---

## Uso rápido

```bash
# Arquitectura y código
/sa:analyze              # Análisis técnico completo en 5 fases
/sa:run-express          # Diagnóstico rápido 80/20
/sa:create               # Scaffold de nuevos proyectos

# Desarrollo de plugins
/pqa:create              # Crear un nuevo plugin de Claude Code
/pqa:audit               # Auditoría completa de calidad

# Spec Driven Development
/sdd:tour                # Onboarding guiado (8 pasos)
/sdd:demo                # Generar proyecto demo + dashboard
/sdd:menu                # Los 37 comandos disponibles
```

---

## Gobernanza

Cada afirmación etiquetada con evidencia: `[CÓDIGO]` `[CONFIG]` `[DOC]` `[INFERENCIA]` `[SUPUESTO]`

4 puertas de calidad (G0 pre-vuelo, G1 análisis, G2 arquitectura, G3 listo para deploy).

El Intent Integrity Kit asegura que los requisitos se trazan a través de specs, tests y código sin deriva.

---

## Arquitectura

```
jm-agentic-development-kit/
├── sovereign-architect/     # SA — Arquitectura y código
│   ├── agents/   (66)
│   ├── skills/   (128)
│   └── commands/ (120)
├── plugin-qa/               # PQA — Ciclo de vida de plugins
│   ├── agents/   (4)
│   ├── skills/   (20)
│   └── commands/ (31)
├── sdd-metodologia/         # SDD — Spec Driven Development
│   ├── .claude/skills/ (12)
│   ├── commands/ (37)
│   ├── scripts/  (21)
│   └── hooks/    (4 eventos)
├── CONSTITUTION.md
├── FRAMEWORK-PRINCIPLES.md
└── .specify/
```

---

## Parte del Ecosistema MetodologIA / JM Labs

JM ADK orquesta e integra componentes de este ecosistema:

| Repositorio | Descripción |
|-------------|-------------|
| [jm-adk-alfa](https://github.com/JaviMontano/jm-adk-alfa) | Versión alfa con experimentos y extensiones |
| [mao-discovery-framework](https://github.com/JaviMontano/mao-discovery-framework) | Framework de discovery y análisis organizacional |
| [mao-sovereign-architect](https://github.com/JaviMontano/mao-sovereign-architect) | Arquitectura de software con agentes autónomos |
| [mao-plugin-qa](https://github.com/JaviMontano/mao-plugin-qa) | Framework de calidad para plugins de Claude Code |

---

## Licencia

Este proyecto está licenciado bajo **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Creado por <a href="https://github.com/JaviMontano">Javier Montaño</a> · JM Labs · MIT
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:122562,100:BBA0CC&height=120&section=footer" alt="Footer" />
</p>
