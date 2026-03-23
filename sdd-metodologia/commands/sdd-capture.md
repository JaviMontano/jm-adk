---
description: "SDD — Capture session inputs into RAG memory files with LLM analysis"
user-invocable: true
---

# /sdd:capture

Process session inputs into structured RAG memory files.

## Execution

### Step 1: Scaffold RAG memory files
```bash
bash scripts/sdd-rag-capture.sh --scan .
```
Or for a specific file:
```bash
bash scripts/sdd-rag-capture.sh /path/to/file .
```

### Step 2: Fill abstracts with LLM analysis
For each `rag-memory-of-*.md` in `.specify/rag-memory/` that has placeholder content:

1. Read the Full Content section
2. Generate:
   - **Abstract**: 2-3 sentence summary of what the file contains and its relevance
   - **Key Takeaways**: 3-5 bullet points of the most important information
   - **Relevant Insights**: Connections to the current project, useful patterns, decisions
3. Replace the placeholder text with the generated analysis
4. For images: describe the visual content and any text/data visible
5. For audio: note that transcription requires external tools
6. For slides/presentations: provide a per-slide recap with key points
7. For HTML: extract the visual design patterns, CSS tokens, component structure

### Step 3: Log the capture event
```bash
bash scripts/sdd-session-log.sh capture "Captured N files to RAG memory" "/sdd:capture" .
```

## RAG Memory Format

Each file follows this structure:
```markdown
---
source: {original filename}
type: {text|image|audio|slides|code|html|...}
captured: {ISO timestamp}
size: {human-readable size}
---
# RAG Memory: {filename}
## Abstract
{LLM-generated summary}
## Key Takeaways
- {bullet points}
## Relevant Insights
- {connections to project}
## Full Content
{verbatim text / description / transcription}
```
