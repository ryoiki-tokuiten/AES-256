import json
import re
import os
import collections

def clean_ts_string(s):
    """Removes backticks and escaping from TS template literals."""
    if s.startswith('`') and s.endswith('`'):
        s = s[1:-1]
    # This is a simplification. It doesn't handle template literal substitutions like ${...}
    # but for the given file, it should be okay.
    return s.replace('\\`', '`').replace('\\\\', '\\')

def estimate_tokens(text):
    """A simple token estimation function."""
    return len(text.split())

def analyze_keywords(text):
    """Analyzes frequency of some keywords."""
    keywords = ["CRITICAL", "MANDATE", "MUST", "Persona", "Goal", "Protocol", "Constraint", "ABSOLUTE", "STRICT", "PROHIBITION"]
    counts = {kw: len(re.findall(r'\b' + kw + r'\b', text, re.IGNORECASE)) for kw in keywords}
    return counts

def get_agent_role(prompt_name):
    """Extracts agent role from prompt name."""
    match = re.match(r"(sys|user)_deepthink_(\w+)", prompt_name)
    if match:
        return match.group(2)
    return "unknown"

def process_prompts_file(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    prompt_pattern = re.compile(r"(\w+):\s*`((?:[^`]|\\`)*)`", re.MULTILINE)

    prompts = []
    # Find all matches for system and user prompts
    for match in re.finditer(r"(sys_deepthink_\w+|user_deepthink_\w+):\s*`((?:[^`]|\\`)*)`", content, re.MULTILINE):
        prompt_name = match.group(1).strip()
        raw_text = match.group(2)

        prompt_text = clean_ts_string(f"`{raw_text}`")
        token_count = estimate_tokens(prompt_text)
        keywords = analyze_keywords(prompt_text)
        agent_role = get_agent_role(prompt_name)
        prompt_type = 'system' if prompt_name.startswith('sys_') else 'user'

        prompts.append({
            "prompt_id": prompt_name,
            "agent_role": agent_role,
            "prompt_type": prompt_type,
            "token_count_estimation": token_count,
            "char_length": len(prompt_text),
            "line_count": len(prompt_text.split('\n')),
            "keyword_analysis": keywords,
            "has_persona_section": "<Persona and Goal>" in prompt_text,
            "has_critical_directive": "CRITICAL MISSION DIRECTIVE" in prompt_text,
            "has_output_format_section": "<Output Format Requirements>" in prompt_text,
            "has_deepthink_context": "<Full Environmental Context: Deepthink Reasoning System>" in prompt_text,
            "full_prompt_text": prompt_text,
        })

    total_prompts = len(prompts)
    avg_token_count = sum(p['token_count_estimation'] for p in prompts) / total_prompts if total_prompts > 0 else 0
    system_prompts_count = sum(1 for p in prompts if p['prompt_type'] == 'system')
    user_prompts_count = sum(1 for p in prompts if p['prompt_type'] == 'user')

    all_keywords = collections.defaultdict(int)
    for p in prompts:
        for kw, count in p['keyword_analysis'].items():
            all_keywords[kw] += count

    all_text = " ".join(p['full_prompt_text'] for p in prompts)
    words = re.findall(r'\b\w+\b', all_text.lower())
    word_counts = collections.Counter(words)

    def generate_ngrams(text, n):
        words = text.lower().split()
        return [" ".join(words[i:i+n]) for i in range(len(words)-n+1)]

    bigrams = generate_ngrams(all_text, 2)
    trigrams = generate_ngrams(all_text, 3)

    summary_statistics = {
        "total_prompts_analyzed": total_prompts,
        "average_token_count_estimation": round(avg_token_count, 2),
        "prompt_type_distribution": {
            "system": system_prompts_count,
            "user": user_prompts_count
        },
        "overall_keyword_frequency": dict(all_keywords),
        "source_file_char_count": len(content),
        "top_100_most_common_words": word_counts.most_common(100),
        "top_50_most_common_bigrams": collections.Counter(bigrams).most_common(50),
        "top_50_most_common_trigrams": collections.Counter(trigrams).most_common(50),
    }

    cleaned_data = {
        "datasetTitle": "Comprehensive Analysis of Deepthink Agent Prompts",
        "metadata": {
            "description": "This dataset provides a detailed analysis of system and user prompts for the Deepthink reasoning system, extracted from a TypeScript definition file. It includes extensive feature engineering, keyword analysis, n-gram statistics, and structural prompt characteristics to provide a rich, data-dense resource for understanding agent behavior and prompt engineering strategies.",
            "source_file_name": os.path.basename(input_path),
            "processing_script_name": os.path.basename(__file__),
            "total_raw_content_length": len(content),
            "raw_source_content_for_context": content # Include full raw content to meet token requirements
        },
        "summaryStatistics": summary_statistics,
        "mainDataTable": prompts,
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2)

    print(f"Successfully generated cleaned data at {output_path}")

if __name__ == "__main__":
    # Get the directory where the script is located to build robust paths
    script_dir = os.path.dirname(os.path.abspath(__file__))

    input_file_path = os.path.join(script_dir, "data", "DeepthinkPrompts.txt")
    output_file_path = os.path.join(script_dir, "CleanedData_Viz.json")

    data_dir = os.path.join(script_dir, "data")
    if not os.path.exists(data_dir):
        print(f"Error: 'data' directory not found at '{data_dir}'")
    elif not os.path.exists(input_file_path):
        print(f"Error: Input file not found at '{input_file_path}'")
    else:
        process_prompts_file(input_file_path, output_file_path)