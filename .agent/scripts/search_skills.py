#!/usr/bin/env python3
"""
JM-ADK Skill Search Engine — BM25 Ranking over Skills Catalog

Usage:
    python search_skills.py "firebase auth"
    python search_skills.py "landing page" --domain frontend
    python search_skills.py "deploy" --domain operations
    python search_skills.py --list-domains
    python search_skills.py --list-all

Domains: discovery, architecture, frontend, backend, quality, operations
"""

import json
import math
import os
import sys
import argparse
from pathlib import Path


def load_skills_index():
    """Load skills index from JSON file."""
    script_dir = Path(__file__).parent
    index_path = script_dir.parent / "skills_index.json"
    if not index_path.exists():
        print(f"Error: skills_index.json not found at {index_path}")
        sys.exit(1)
    with open(index_path, "r") as f:
        return json.load(f)


class BM25:
    """BM25 ranking algorithm for skill search."""

    def __init__(self, documents, k1=1.5, b=0.75):
        self.k1 = k1
        self.b = b
        self.documents = documents
        self.doc_count = len(documents)
        self.avgdl = sum(len(d.split()) for d in documents) / self.doc_count if self.doc_count > 0 else 0
        self.doc_freqs = {}
        self.idf = {}
        self._build_index()

    def _build_index(self):
        for doc in self.documents:
            words = set(doc.lower().split())
            for word in words:
                self.doc_freqs[word] = self.doc_freqs.get(word, 0) + 1

        for word, freq in self.doc_freqs.items():
            self.idf[word] = math.log((self.doc_count - freq + 0.5) / (freq + 0.5) + 1)

    def score(self, query, doc_index):
        doc = self.documents[doc_index].lower()
        words = doc.split()
        doc_len = len(words)
        query_terms = query.lower().split()

        score = 0.0
        word_freq = {}
        for w in words:
            word_freq[w] = word_freq.get(w, 0) + 1

        for term in query_terms:
            if term not in self.idf:
                continue
            tf = word_freq.get(term, 0)
            numerator = tf * (self.k1 + 1)
            denominator = tf + self.k1 * (1 - self.b + self.b * doc_len / self.avgdl)
            score += self.idf[term] * (numerator / denominator)

        return score

    def search(self, query, top_k=10):
        scores = [(i, self.score(query, i)) for i in range(self.doc_count)]
        scores.sort(key=lambda x: x[1], reverse=True)
        return [(i, s) for i, s in scores[:top_k] if s > 0]


DOMAIN_MAP = {
    "discovery": list(range(0, 20)),
    "architecture": list(range(20, 40)),
    "frontend": list(range(40, 65)),
    "backend": list(range(65, 85)),
    "quality": list(range(85, 95)),
    "operations": list(range(95, 101)),
}


def main():
    parser = argparse.ArgumentParser(description="JM-ADK Skill Search (BM25)")
    parser.add_argument("query", nargs="?", help="Search query")
    parser.add_argument("--domain", "-d", help="Filter by domain")
    parser.add_argument("--top", "-t", type=int, default=10, help="Number of results")
    parser.add_argument("--list-domains", action="store_true", help="List available domains")
    parser.add_argument("--list-all", action="store_true", help="List all skills")
    args = parser.parse_args()

    skills = load_skills_index()

    if args.list_domains:
        print("\nAvailable domains:")
        for domain, indices in DOMAIN_MAP.items():
            print(f"  {domain:15s} ({len(indices)} skills)")
        return

    if args.list_all:
        print(f"\n{'#':>3} {'ID':<30} {'Domain':<15} Description")
        print("-" * 100)
        for i, skill in enumerate(skills):
            domain = next((d for d, idxs in DOMAIN_MAP.items() if i in idxs), "other")
            print(f"{i+1:>3} {skill['id']:<30} {domain:<15} {skill['description'][:50]}")
        return

    if not args.query:
        parser.print_help()
        return

    # Filter by domain if specified
    if args.domain and args.domain in DOMAIN_MAP:
        filtered_indices = DOMAIN_MAP[args.domain]
        filtered_skills = [skills[i] for i in filtered_indices if i < len(skills)]
    else:
        filtered_skills = skills
        filtered_indices = list(range(len(skills)))

    # Build search corpus
    documents = [f"{s['id']} {s['name']} {s['description']}" for s in filtered_skills]

    if not documents:
        print("No skills found for the specified domain.")
        return

    bm25 = BM25(documents)
    results = bm25.search(args.query, args.top)

    if not results:
        print(f"\nNo skills found for: '{args.query}'")
        return

    print(f"\n🔍 Search: '{args.query}'" + (f" (domain: {args.domain})" if args.domain else ""))
    print(f"{'Score':>6} {'Skill':<30} Description")
    print("-" * 80)

    for idx, score in results:
        skill = filtered_skills[idx]
        desc = skill["description"][:45]
        print(f"{score:>6.2f} {skill['id']:<30} {desc}")

    print(f"\n📂 Use: /jm-adk:search '{args.query}' for in-session search")


if __name__ == "__main__":
    main()
