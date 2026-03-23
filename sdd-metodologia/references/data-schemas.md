# AAD Data Schemas v1.0

> Canonical JSON schemas for the AAD Sentinel + Insights system.
> All files stored in `.specify/` directory of the target project.

## health-history.json

Time series of health score snapshots. Appended by sentinel and insights engine. Capped at 100 entries.

```json
{
  "snapshots": [
    {
      "timestamp": "2026-03-23T12:00:00Z",
      "featureId": "001-user-auth",
      "score": 82,
      "factors": {
        "specCoverage": 25,
        "testCoverage": 20,
        "taskCompletion": 17,
        "constitutionAlignment": 20
      },
      "phaseStates": {
        "constitution": "complete",
        "spec": "complete",
        "plan": "complete",
        "checklist": "complete",
        "testify": "in_progress",
        "tasks": "not_started",
        "analyze": "not_started",
        "implement": "not_started"
      },
      "risks": ["FR-007 has no tests", "spec.md not modified in 12 days"],
      "staleArtifacts": [],
      "brokenRefs": [],
      "integrityStatus": "valid"
    }
  ]
}
```

## sentinel-state.json

Heartbeat agent state. Written after each perceive-decide cycle.

```json
{
  "enabled": true,
  "lastRun": "2026-03-23T12:00:00Z",
  "runCount": 42,
  "intervalMinutes": 45,
  "lastReport": ".specify/HEARTBEAT-REPORT.md",
  "suppressedUntil": null,
  "findings": [],
  "autoClosedCount": 3
}
```

## phase-velocity.json

Tracks when each phase was first started and completed per feature. Used for velocity computation and bottleneck detection.

```json
{
  "features": {
    "001-user-auth": {
      "constitution": { "started": "2026-03-20T09:00:00Z", "completed": "2026-03-20T09:15:00Z" },
      "spec": { "started": "2026-03-20T09:20:00Z", "completed": "2026-03-20T11:00:00Z" },
      "plan": { "started": "2026-03-20T11:30:00Z", "completed": null }
    }
  }
}
```

## traceability-index.json

Full chain from constitution principles through implementation. Built by insights engine.

```json
{
  "chains": [
    {
      "principle": "VII. Secure by Default",
      "requirements": ["FR-012", "FR-013", "FR-015"],
      "testSpecs": ["TS-032", "TS-033", "TS-037"],
      "tasks": ["T014", "T016", "T020"],
      "coverage": 1.0
    }
  ],
  "orphans": {
    "untestedRequirements": ["FR-018"],
    "untracedPrinciples": [],
    "unlinkedTasks": ["T082"]
  },
  "summary": {
    "principlesCovered": 18,
    "principlesTotal": 22,
    "requirementsTested": 21,
    "requirementsTotal": 23,
    "overallCoverage": 0.87
  }
}
```

## Backward Compatibility

The `health-history.json` loader checks for the `snapshots` key. If absent (old format from score-history.json), it wraps the data as `{ snapshots: oldData }`.
