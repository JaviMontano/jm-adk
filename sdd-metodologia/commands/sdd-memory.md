---
description: "SDD — Browse and search RAG memory files from session inputs"
user-invocable: true
---

# /sdd:memory

Browse, search, and display RAG memory files.

## Execution

### Default: List all memories
List all files in `.specify/rag-memory/`:
- Show filename, type, capture date, and abstract (first line)
- Sort by capture date (most recent first)

### Search: /sdd:memory <keyword>
Search across all rag-memory files for the keyword:
- Search in abstracts, takeaways, insights, and full content
- Show matching files with relevant excerpt

### View: /sdd:memory <filename>
Display the full content of a specific rag-memory file.

## Notes
- RAG memory files are created by `/sdd:capture`
- They persist across sessions in `.specify/rag-memory/`
- The dashboard Workspace view also shows these files
