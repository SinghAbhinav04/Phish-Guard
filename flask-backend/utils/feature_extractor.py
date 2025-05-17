# utils/feature_extractor.py
import re
import numpy as np
from urllib.parse import urlparse
import pandas as pd 

def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    query = parsed.query

    features = {
        "url_length": len(url),
        "number_of_dots_in_url": url.count('.'),
        "having_repeated_digits_in_url": 1 if re.search(r'\d.*\d.*\d', url) else 0,
        "number_of_digits_in_url": len(re.findall(r'\d', url)),
        "number_of_special_char_in_url": len(re.findall(r'[^a-zA-Z0-9]', url)),
        "number_of_hyphens_in_url": url.count('-'),
        "number_of_underline_in_url": url.count('_'),
        "number_of_slash_in_url": url.count('/'),
        "number_of_questionmark_in_url": url.count('?'),
        "number_of_equal_in_url": url.count('='),
        "number_of_at_in_url": url.count('@'),
        "number_of_dollar_in_url": url.count('$'),
        "number_of_exclamation_in_url": url.count('!'),
        "number_of_hashtag_in_url": url.count('#'),
        "number_of_percent_in_url": url.count('%'),
        "domain_length": len(domain),
        "number_of_dots_in_domain": domain.count('.'),
        "number_of_hyphens_in_domain": domain.count('-'),
        "having_special_characters_in_domain": 1 if re.search(r'[^a-zA-Z0-9.-]', domain) else 0,
        "number_of_special_characters_in_domain": len(re.findall(r'[^a-zA-Z0-9]', domain)),
        "having_digits_in_domain": 1 if re.search(r'\d', domain) else 0,
        "number_of_digits_in_domain": len(re.findall(r'\d', domain)),
        "having_repeated_digits_in_domain": 1 if re.search(r'\d.*\d.*\d', domain) else 0,
        "number_of_subdomains": domain.count('.') - 1,
        "having_dot_in_subdomain": 1 if domain.count('.') > 1 else 0,
        "having_hyphen_in_subdomain": 1 if '-' in domain.split('.')[0] else 0,
        "average_subdomain_length": np.mean([len(part) for part in domain.split('.')[:-2]]) if domain.count('.') > 1 else 0,
        "average_number_of_dots_in_subdomain": domain.split('.')[0].count('.') if domain.count('.') > 1 else 0,
        "average_number_of_hyphens_in_subdomain": domain.split('.')[0].count('-') if domain.count('.') > 1 else 0,
        "having_special_characters_in_subdomain": 1 if re.search(r'[^a-zA-Z0-9]', domain.split('.')[0]) else 0,
        "number_of_special_characters_in_subdomain": len(re.findall(r'[^a-zA-Z0-9]', domain.split('.')[0])),
        "having_digits_in_subdomain": 1 if re.search(r'\d', domain.split('.')[0]) else 0,
        "number_of_digits_in_subdomain": len(re.findall(r'\d', domain.split('.')[0])),
        "having_repeated_digits_in_subdomain": 1 if re.search(r'\d.*\d.*\d', domain.split('.')[0]) else 0,
        "having_path": 1 if path else 0,
        "path_length": len(path),
        "having_query": 1 if query else 0,
        "having_fragment": 1 if '#' in url else 0,
        "having_anchor": 1 if 'anchor' in url else 0,
        "entropy_of_url": calculate_entropy(url),
        "entropy_of_domain": calculate_entropy(domain),
    }

    feature_df = pd.DataFrame([features])
    return feature_df

def calculate_entropy(s):
    from math import log2
    prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
    entropy = - sum([p * log2(p) for p in prob])
    return entropy
