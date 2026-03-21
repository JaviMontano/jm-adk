#!/usr/bin/env python3
"""
Generate skills_index.json from SKILL.md files.
Walks the skills/ directory, extracts frontmatter, and outputs a JSON index.

Usage:
    python generate_index.py
    python generate_index.py --skills-dir ../skills
    python generate_index.py --output ../skills_index.json
"""

import json
import os
import re
import sys
import argparse
from pathlib import Path


def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}

    frontmatter = {}
    for line in match.group(1).split('\n'):
        line = line.strip()
        if ':' in line and not line.startswith('-'):
            key, _, value = line.partition(':')
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if value:
                frontmatter[key] = value

    return frontmatter


def extract_h1(content):
    """Extract first H1 heading as fallback name."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    return match.group(1).strip() if match else None


def extract_first_paragraph(content):
    """Extract first non-empty paragraph after frontmatter as fallback description."""
    # Remove frontmatter
    content = re.sub(r'^---.*?---\s*', '', content, flags=re.DOTALL)
    # Remove headings
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('>'):
            return line[:200]
    return ""


def titlecase_from_slug(slug):
    """Convert kebab-case slug to Title Case."""
    return ' '.join(word.capitalize() for word in slug.split('-'))


def scan_skills(skills_dir):
    """Scan skills directory and build index."""
    skills = []
    skills_path = Path(skills_dir)

    if not skills_path.exists():
        print(f"Error: Skills directory not found: {skills_path}")
        sys.exit(1)

    for skill_dir in sorted(skills_path.iterdir()):
        if not skill_dir.is_dir():
            continue
        if skill_dir.name.startswith('.'):
            continue

        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            print(f"  Warning: No SKILL.md in {skill_dir.name}")
            continue

        content = skill_md.read_text(encoding='utf-8')
        fm = extract_frontmatter(content)

        skill_id = skill_dir.name
        name = fm.get('name', extract_h1(content) or titlecase_from_slug(skill_id))
        description = fm.get('description', extract_first_paragraph(content) or f"Skill for {skill_id}")

        # Clean multiline descriptions
        description = ' '.join(description.split())

        skills.append({
            "id": skill_id,
            "path": f"skills/{skill_id}",
            "name": name if name != skill_id else titlecase_from_slug(skill_id),
            "description": description
        })

    return skills


def main():
    parser = argparse.ArgumentParser(description="Generate skills_index.json")
    parser.add_argument("--skills-dir", default=None, help="Path to skills directory")
    parser.add_argument("--output", default=None, help="Output JSON file path")
    args = parser.parse_args()

    script_dir = Path(__file__).parent

    # Try multiple locations for skills
    if args.skills_dir:
        skills_dir = args.skills_dir
    else:
        # Check .agent/skills/ first, then root skills/
        agent_skills = script_dir.parent / "skills"
        root_skills = script_dir.parent.parent / "skills"
        skills_dir = str(agent_skills if agent_skills.exists() else root_skills)

    output_path = args.output or str(script_dir.parent / "skills_index.json")

    print(f"Scanning: {skills_dir}")
    skills = scan_skills(skills_dir)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, indent=2, ensure_ascii=False)

    print(f"Generated: {output_path}")
    print(f"Total skills: {len(skills)}")


if __name__ == "__main__":
    main()
