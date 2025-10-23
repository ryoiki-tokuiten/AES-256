#!/usr/bin/env python3
"""
Token Verification Script
Checks if the generated CleanedData JSON files are within the 150,000 token limit.
"""

import json
import os
import sys

# Simple token estimation: ~4 characters per token on average
CHARS_PER_TOKEN = 4
MAX_TOKENS = 150000
MAX_CHARS = MAX_TOKENS * CHARS_PER_TOKEN


def count_tokens(text: str) -> int:
    """Estimate token count from character count."""
    return len(text) // CHARS_PER_TOKEN


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def _resolve_path(path: str) -> str:
    """Resolve a possibly-relative path to an absolute path next to this script.
    If the provided path is absolute, return as-is. Otherwise, resolve relative to
    the directory containing this script.
    """
    if os.path.isabs(path):
        return path
    return os.path.join(SCRIPT_DIR, path)


def check_file(filepath: str) -> tuple[bool, int, int]:
    """
    Check if a JSON file is within token limits.
    Returns: (is_valid, char_count, estimated_tokens)
    """
    filepath = _resolve_path(filepath)
    if not os.path.exists(filepath):
        print(f"ERROR: File '{filepath}' not found.")
        return False, 0, 0
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Validate JSON
        json.loads(content)
        
        char_count = len(content)
        estimated_tokens = count_tokens(content)
        
        return estimated_tokens <= MAX_TOKENS, char_count, estimated_tokens
    
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in '{filepath}': {e}")
        return False, 0, 0
    except Exception as e:
        print(f"ERROR reading '{filepath}': {e}")
        return False, 0, 0


def main():
    print("=" * 60)
    print("Token Verification for CleanedData Files")
    print("=" * 60)
    print()
    
    # Check for both visualization and forecasting cleaned data files
    files_to_check = [
        "CleanedData_Viz.json",
        "CleanedData_Forecast.json",
    ]
    
    all_valid = True
    results = {}
    
    for filename in files_to_check:
        print(f"Checking {filename}...")
        is_valid, char_count, tokens = check_file(filename)
        results[filename] = (is_valid, char_count, tokens)
        
        abs_path = _resolve_path(filename)
        if os.path.exists(abs_path):
            if is_valid:
                print(f"[VALID] {tokens:,} tokens (estimated) / {MAX_TOKENS:,} max")
                print(f"   Character count: {char_count:,}")
            else:
                print(f"[EXCEEDED] {tokens:,} tokens (estimated) / {MAX_TOKENS:,} max")
                print(f"   Character count: {char_count:,}")
                print(f"   Need to reduce by ~{tokens - MAX_TOKENS:,} tokens")
                all_valid = False
        else:
            print(f"[NOT FOUND] File not found (may not be generated yet)")
        
        print()
    
    print("=" * 60)
    
    if all_valid and any(os.path.exists(_resolve_path(f)) for f in files_to_check):
        print("[SUCCESS]")
        print("Good. All generated files are within the supported context window")
        print("for the agents in next stages. You may submit your changes now.")
        sys.exit(0)
    elif not any(os.path.exists(_resolve_path(f)) for f in files_to_check):
        print("[WARNING] No CleanedData files found yet.")
        print("Please generate CleanedData_Viz.json and/or CleanedData_Forecast.json first.")
        sys.exit(1)
    else:
        print("[FAILED] TOKEN LIMIT EXCEEDED")
        print("Please reduce the output size and regenerate the files.")
        print()
        print("Suggestions:")
        print("- Remove less critical features or redundant columns")
        print("- Aggregate granular data to reduce row count")
        print("- Sample data intelligently while preserving patterns")
        print("- Reduce verbose descriptions or metadata")
        sys.exit(1)


if __name__ == "__main__":
    main()
