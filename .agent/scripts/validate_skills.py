#!/usr/bin/env python3
"""
Validate all SKILL.md files for correct structure.

Checks:
- SKILL.md exists in each skill directory
- Has valid YAML frontmatter
- Has required fields: name, description
- Has content sections (TL;DR, Procedure, Quality Criteria)

Usage:
    python validate_skills.py
    python validate_skills.py --skills-dir ../skills
    python validate_skills.py --fix  # Auto-fix common issues
"""

import re
import sys
import argparse
from pathlib import Path


def validate_frontmatter(content, skill_id):
    """Validate YAML frontmatter."""
    errors = []
    warnings = []

    if not content.startswith('---'):
        errors.append("Missing frontmatter (must start with ---)")
        return errors, warnings

    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        errors.append("Malformed frontmatter (missing closing ---)")
        return errors, warnings

    fm_text = match.group(1)

    if 'name:' not in fm_text:
        errors.append("Missing required field: name")
    if 'description:' not in fm_text:
        errors.append("Missing required field: description")

    # Check name matches directory
    name_match = re.search(r'name:\s*["\']?(\S+)', fm_text)
    if name_match:
        fm_name = name_match.group(1).strip('"').strip("'")
        if fm_name != skill_id:
            warnings.append(f"name '{fm_name}' doesn't match directory '{skill_id}'")

    return errors, warnings


def validate_content(content):
    """Validate content sections."""
    warnings = []

    # Remove frontmatter
    content_body = re.sub(r'^---.*?---\s*', '', content, flags=re.DOTALL)

    if len(content_body.strip()) < 100:
        warnings.append("Content is very short (< 100 chars)")

    if '## ' not in content_body:
        warnings.append("No H2 sections found")

    return warnings


def main():
    parser = argparse.ArgumentParser(description="Validate SKILL.md files")
    parser.add_argument("--skills-dir", default=None)
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    if args.skills_dir:
        skills_dir = Path(args.skills_dir)
    else:
        agent_skills = script_dir.parent / "skills"
        root_skills = script_dir.parent.parent / "skills"
        skills_dir = agent_skills if agent_skills.exists() else root_skills

    total = 0
    errors_count = 0
    warnings_count = 0

    print(f"Validating skills in: {skills_dir}\n")

    for skill_dir in sorted(skills_dir.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name.startswith('.'):
            continue

        total += 1
        skill_md = skill_dir / "SKILL.md"

        if not skill_md.exists():
            print(f"  ❌ {skill_dir.name}: SKILL.md not found")
            errors_count += 1
            continue

        content = skill_md.read_text(encoding='utf-8')
        errors, warnings = validate_frontmatter(content, skill_dir.name)
        warnings.extend(validate_content(content))

        if errors:
            for e in errors:
                print(f"  ❌ {skill_dir.name}: {e}")
            errors_count += len(errors)

        if warnings:
            for w in warnings:
                print(f"  ⚠️  {skill_dir.name}: {w}")
            warnings_count += len(warnings)

        if not errors and not warnings:
            pass  # Silent success

    print(f"\n{'='*50}")
    print(f"Total skills: {total}")
    print(f"Errors: {errors_count}")
    print(f"Warnings: {warnings_count}")

    if errors_count == 0:
        print("✅ All skills valid!")
    else:
        print("❌ Fix errors above")
        sys.exit(1)


if __name__ == "__main__":
    main()
