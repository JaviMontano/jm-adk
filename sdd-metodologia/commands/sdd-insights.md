---
description: "SDD — Generate insights report from health history and traceability analysis"
user-invocable: true
---

# /sdd:insights

Generate an insights report with health trends, risk indicators, and smart recommendations.

## Execution

### Default (report mode)
```bash
node scripts/sdd-insights.js . --report --snapshot
```

Generates:
1. Health snapshot → appended to `.specify/health-history.json`
2. Traceability index → written to `.specify/traceability-index.json`
3. Insights report → written to `.specify/INSIGHTS-REPORT.md`
4. Display report summary to user

### With dashboard regeneration
```bash
node scripts/sdd-insights.js . --report --snapshot
node scripts/generate-dashboard.js .
```

### JSON output (for programmatic use)
```bash
node scripts/sdd-insights.js . --json
```

## Report Contents

- **Health Score**: Current score with trend indicator (↑ improving, ↓ declining, → stable)
- **Phase Velocity**: Average days per phase, bottleneck detection
- **Traceability Coverage**: Constitution → FR → TS → T chain coverage %
- **Top Risks**: Sorted by severity, each with recommended /sdd: command
- **Smart Recommendations**: Actionable next steps based on gaps
