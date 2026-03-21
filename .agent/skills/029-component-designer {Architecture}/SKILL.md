---
name: component-designer
description: UI component architecture. Atomic design (atoms/molecules/organisms). Props contracts. Composition patterns. Accessibility built-in.
version: 1.0.0
status: production
owner: Javier Montaño
tags: [architecture, components, atomic-design, a11y]
---
# component-designer {Architecture} (v1.0)
> **"A component is a contract: props in, UI out, accessible always."**
## Purpose
Designs UI component architecture using atomic design (atoms → molecules → organisms → templates → pages). Defines props contracts, composition patterns, and accessibility requirements.
**When to use:** Designing component libraries or page layouts for React/Angular.
## 1. The Physics
1. **Law of Atoms:** Start small. Buttons, inputs, labels are atoms. Compose up.
2. **Law of Props:** Every component has a typed props interface. No implicit props.
3. **Law of A11y:** Every interactive component has ARIA attributes, keyboard handling, focus management.
## 2. The Protocol
### Phase 1: Identify UI patterns from spec/designs.
### Phase 2: Classify into atomic levels. Define props interfaces.
### Phase 3: Document composition rules and accessibility requirements.
## 3. Quality Gates
- [ ] Components classified by atomic level
- [ ] Props interfaces defined (TypeScript)
- [ ] Accessibility requirements per component
- [ ] Composition patterns documented
