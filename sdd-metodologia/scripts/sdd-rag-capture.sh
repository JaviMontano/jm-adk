#!/usr/bin/env bash
# sdd-rag-capture.sh — Create rag-memory-of-*.md files from session inputs
#
# Usage:
#   bash scripts/sdd-rag-capture.sh <file-or-dir> [project-path]
#   bash scripts/sdd-rag-capture.sh --scan [project-path]    # scan .specify/inputs/
#
# Creates .specify/rag-memory/rag-memory-of-{name}.md with:
#   - Frontmatter (source, type, captured timestamp)
#   - Abstract, Key Takeaways, Relevant Insights (placeholder for LLM fill)
#   - Full Content (verbatim for text, metadata for binary)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT="${1:---help}"
PROJECT_PATH="${2:-.}"

GOLD='\033[38;5;220m'
BLUE='\033[38;5;33m'
CYAN='\033[38;5;51m'
WHITE='\033[1;37m'
MUTED='\033[38;5;245m'
RED='\033[38;5;196m'
RESET='\033[0m'
BOLD='\033[1m'

RAG_DIR="$PROJECT_PATH/.specify/rag-memory"
RAG_INDEX="$PROJECT_PATH/.specify/rag-index.json"
INPUTS_DIR="$PROJECT_PATH/.specify/inputs"

if [[ "$INPUT" == "--help" || "$INPUT" == "-h" ]]; then
  echo "Usage: sdd-rag-capture.sh <file-or-dir> [project-path]"
  echo "       sdd-rag-capture.sh --scan [project-path]"
  exit 0
fi

mkdir -p "$RAG_DIR"

# Initialize rag-index.json if missing
if [[ ! -f "$RAG_INDEX" ]]; then
  echo '[]' > "$RAG_INDEX"
fi

classify_file() {
  local file="$1"
  # Try system MIME detection first
  local mime=""
  if command -v file &>/dev/null; then
    mime=$(file -b --mime-type "$file" 2>/dev/null || echo "")
  fi

  # MIME-based classification (more reliable)
  case "$mime" in
    text/html*) echo "html"; return ;;
    text/plain*|text/csv*|text/markdown*) echo "text"; return ;;
    application/json*|text/yaml*|application/x-yaml*) echo "config"; return ;;
    application/javascript*|text/x-python*|text/x-shellscript*) echo "code"; return ;;
    image/*) echo "image"; return ;;
    audio/*) echo "audio"; return ;;
    application/pdf*) echo "pdf"; return ;;
    application/vnd.openxmlformats-officedocument.presentationml*) echo "slides"; return ;;
    application/vnd.openxmlformats-officedocument.wordprocessingml*) echo "document"; return ;;
    application/vnd.openxmlformats-officedocument.spreadsheetml*) echo "spreadsheet"; return ;;
  esac

  # Fallback to extension
  local ext="${file##*.}"
  case "$ext" in
    md|txt|log|csv|tsv) echo "text" ;;
    html|htm|xml|svg) echo "html" ;;
    json|yaml|yml|toml) echo "config" ;;
    js|ts|py|sh|bash|rb|go|rs|java|c|cpp|h) echo "code" ;;
    png|jpg|jpeg|gif|webp|bmp|ico) echo "image" ;;
    mp3|wav|ogg|m4a|flac) echo "audio" ;;
    pptx|ppt|key) echo "slides" ;;
    pdf) echo "pdf" ;;
    docx|doc) echo "document" ;;
    xlsx|xls) echo "spreadsheet" ;;
    feature|gherkin) echo "test" ;;
    *) echo "other" ;;
  esac
}

# Auto-generate heuristic tags from filename and content
generate_tags() {
  local file="$1"
  local type="$2"
  local tags=""
  local basename_lower
  basename_lower=$(basename "$file" | tr '[:upper:]' '[:lower:]')

  # Filename-based tags
  [[ "$basename_lower" == *brand* ]] && tags="${tags}brand,"
  [[ "$basename_lower" == *design* ]] && tags="${tags}design-system,"
  [[ "$basename_lower" == *api* ]] && tags="${tags}api,"
  [[ "$basename_lower" == *auth* ]] && tags="${tags}authentication,"
  [[ "$basename_lower" == *spec* ]] && tags="${tags}specification,"
  [[ "$basename_lower" == *test* ]] && tags="${tags}testing,"
  [[ "$basename_lower" == *deploy* ]] && tags="${tags}deployment,"
  [[ "$basename_lower" == *config* ]] && tags="${tags}configuration,"

  # Type-based tag
  tags="${tags}${type}"

  echo "$tags"
}

# Extract HTML title if present
extract_html_title() {
  local file="$1"
  grep -o '<title>[^<]*</title>' "$file" 2>/dev/null | head -1 | sed 's/<[^>]*>//g' || echo ""
}

# Update rag-index.json with new entry
update_index() {
  local slug="$1"
  local type="$2"
  local timestamp="$3"
  local abstract="$4"
  local tags_csv="$5"

  # Convert CSV tags to JSON array
  local tags_json=""
  IFS=',' read -ra TAG_ARR <<< "$tags_csv"
  for t in "${TAG_ARR[@]}"; do
    [[ -z "$t" ]] && continue
    tags_json="${tags_json}\"${t}\","
  done
  tags_json="[${tags_json%,}]"

  # Read existing index, append new entry
  python3 -c "
import json, sys
with open('$RAG_INDEX','r') as f: idx=json.load(f)
idx.append({'file':'rag-memory-of-${slug}.md','type':'${type}','captured':'${timestamp}','abstract':$(python3 -c "import json; print(json.dumps('${abstract}'))"),'tags':${tags_json}})
with open('$RAG_INDEX','w') as f: json.dump(idx,f,indent=2)
" 2>/dev/null || true
}

slug_name() {
  local name="$1"
  echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

capture_file() {
  local file="$1"
  local basename_raw
  basename_raw=$(basename "$file")
  local slug
  slug=$(slug_name "${basename_raw%.*}")
  local type
  type=$(classify_file "$file")
  local target="$RAG_DIR/rag-memory-of-${slug}.md"
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  if [[ -f "$target" ]]; then
    echo -e "  ${MUTED}SKIP: $basename_raw (already captured)${RESET}"
    return
  fi

  local size_bytes
  size_bytes=$(wc -c < "$file" | tr -d ' ')
  local size_human
  if [[ $size_bytes -gt 1048576 ]]; then
    size_human="$(( size_bytes / 1048576 ))MB"
  elif [[ $size_bytes -gt 1024 ]]; then
    size_human="$(( size_bytes / 1024 ))KB"
  else
    size_human="${size_bytes}B"
  fi

  # Generate tags and extract metadata
  local tags
  tags=$(generate_tags "$file" "$type")
  local html_title=""
  local abstract_hint="[LLM-generated summary placeholder — run /sdd:capture to fill]"
  local line_count=0

  if [[ "$type" == "html" ]]; then
    html_title=$(extract_html_title "$file")
    [[ -n "$html_title" ]] && abstract_hint="HTML document: ${html_title}"
    line_count=$(wc -l < "$file" | tr -d ' ')
  elif [[ "$type" == "text" || "$type" == "config" || "$type" == "code" || "$type" == "test" ]]; then
    line_count=$(wc -l < "$file" | tr -d ' ')
    # Extract first non-empty, non-comment line as hint
    local first_line
    first_line=$(grep -m1 '^[^#/\-\*]' "$file" 2>/dev/null | head -c 120 || echo "")
    [[ -n "$first_line" ]] && abstract_hint="${type} file (${line_count} lines): ${first_line}"
  fi

  # Build rag-memory file
  cat > "$target" << RAGEOF
---
source: ${basename_raw}
type: ${type}
captured: ${timestamp}
size: ${size_human}
lines: ${line_count}
tags: [${tags}]
${html_title:+title: ${html_title}}
---

# RAG Memory: ${basename_raw}

## Abstract

> ${abstract_hint}

## Key Takeaways

- [Pending LLM analysis — run /sdd:capture]

## Relevant Insights

- [Pending LLM analysis — run /sdd:capture]

## Full Content

RAGEOF

  # Append content based on type
  case "$type" in
    text|config|code|test)
      # Verbatim copy
      local lang=""
      case "${file##*.}" in
        js) lang="javascript" ;; ts) lang="typescript" ;; py) lang="python" ;;
        sh|bash) lang="bash" ;; json) lang="json" ;; yaml|yml) lang="yaml" ;;
        html|htm) lang="html" ;; css) lang="css" ;; md) lang="markdown" ;;
        feature) lang="gherkin" ;; *) lang="" ;;
      esac
      echo "\`\`\`${lang}" >> "$target"
      if [[ $line_count -gt 1000 ]]; then
        head -1000 "$file" >> "$target"
        echo "" >> "$target"
        echo "... [truncated at 1000 lines — full file has ${line_count} lines]" >> "$target"
      else
        cat "$file" >> "$target"
      fi
      echo '```' >> "$target"
      ;;
    html)
      # Extract structure summary first
      echo "### Structure Summary" >> "$target"
      echo "" >> "$target"
      [[ -n "$html_title" ]] && echo "- **Title**: ${html_title}" >> "$target"
      echo "- **Lines**: ${line_count}" >> "$target"
      echo "- **Size**: ${size_human}" >> "$target"
      # Count key elements
      local css_blocks
      css_blocks=$(grep -c '<style' "$file" 2>/dev/null || echo 0)
      local script_blocks
      script_blocks=$(grep -c '<script' "$file" 2>/dev/null || echo 0)
      local h1_count
      h1_count=$(grep -ci '<h[1-3]' "$file" 2>/dev/null || echo 0)
      echo "- **Style blocks**: ${css_blocks}" >> "$target"
      echo "- **Script blocks**: ${script_blocks}" >> "$target"
      echo "- **Headings (h1-h3)**: ${h1_count}" >> "$target"
      # Extract CSS custom properties (design tokens)
      local css_vars
      css_vars=$(grep -o '\-\-[a-z][a-z0-9-]*' "$file" 2>/dev/null | sort -u | head -20 | tr '\n' ', ')
      [[ -n "$css_vars" ]] && echo "- **CSS tokens**: ${css_vars%,}" >> "$target"
      echo "" >> "$target"
      echo "### Source" >> "$target"
      echo "" >> "$target"
      echo '```html' >> "$target"
      if [[ $line_count -gt 500 ]]; then
        head -500 "$file" >> "$target"
        echo "" >> "$target"
        echo "... [truncated at 500 lines — full file: ${basename_raw}]" >> "$target"
      else
        cat "$file" >> "$target"
      fi
      echo '```' >> "$target"
      ;;
    image)
      echo "**Type**: Image (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      echo "**Format**: ${file##*.}" >> "$target"
      echo "" >> "$target"
      echo "> [Image description pending — run /sdd:capture for LLM analysis]" >> "$target"
      ;;
    audio)
      echo "**Type**: Audio (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      echo "**Format**: ${file##*.}" >> "$target"
      echo "" >> "$target"
      echo "> [Transcription pending — run /sdd:capture for LLM analysis]" >> "$target"
      ;;
    slides)
      echo "**Type**: Presentation (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      echo "**Format**: ${file##*.}" >> "$target"
      echo "" >> "$target"
      echo "> [Slide-by-slide recap pending — run /sdd:capture for LLM analysis]" >> "$target"
      ;;
    pdf)
      echo "**Type**: PDF Document (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      # Try to get page count
      local pages=""
      if command -v pdfinfo &>/dev/null; then
        pages=$(pdfinfo "$file" 2>/dev/null | grep -i 'pages' | awk '{print $2}')
      fi
      [[ -n "$pages" ]] && echo "**Pages**: ${pages}" >> "$target"
      echo "" >> "$target"
      echo "> [Content extraction pending — run /sdd:capture for LLM analysis]" >> "$target"
      ;;
    document|spreadsheet)
      echo "**Type**: ${type^} (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      echo "" >> "$target"
      echo "> [Content extraction pending — run /sdd:capture for LLM analysis]" >> "$target"
      ;;
    *)
      echo "**Type**: ${type} (${basename_raw})" >> "$target"
      echo "**Size**: ${size_human}" >> "$target"
      ;;
  esac

  # Update rag-index.json
  update_index "$slug" "$type" "$timestamp" "$abstract_hint" "$tags"

  echo -e "  ${CYAN}✓${RESET} ${basename_raw} → rag-memory-of-${slug}.md (${type}, ${size_human})"
}

# ─── Main ───
echo -e "${GOLD}╔════════════════════════════════════════════╗${RESET}"
echo -e "${GOLD}║${RESET}  ${WHITE}${BOLD}SDD RAG Memory Capture${RESET}                   ${GOLD}║${RESET}"
echo -e "${GOLD}╚════════════════════════════════════════════╝${RESET}"
echo ""

CAPTURED=0

if [[ "$INPUT" == "--scan" ]]; then
  # Scan .specify/inputs/ directory
  if [[ ! -d "$INPUTS_DIR" ]]; then
    echo -e "${MUTED}No .specify/inputs/ directory. Create it and add files to capture.${RESET}"
    mkdir -p "$INPUTS_DIR"
    exit 0
  fi
  echo -e "${WHITE}Scanning:${RESET} $INPUTS_DIR"
  for f in "$INPUTS_DIR"/*; do
    [[ -f "$f" ]] || continue
    capture_file "$f"
    CAPTURED=$((CAPTURED + 1))
  done
elif [[ -d "$INPUT" ]]; then
  # Scan provided directory
  echo -e "${WHITE}Scanning:${RESET} $INPUT"
  for f in "$INPUT"/*; do
    [[ -f "$f" ]] || continue
    capture_file "$f"
    CAPTURED=$((CAPTURED + 1))
  done
elif [[ -f "$INPUT" ]]; then
  # Single file
  capture_file "$INPUT"
  CAPTURED=1
else
  echo -e "${RED}Not found: $INPUT${RESET}"
  exit 1
fi

echo ""
echo -e "${BLUE}Captured:${RESET} $CAPTURED file(s) → .specify/rag-memory/"
echo -e "${MUTED}Run /sdd:capture to fill abstracts and insights with LLM analysis.${RESET}"
