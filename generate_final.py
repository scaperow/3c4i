#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

# 读取中间数据
with open('/tmp/mbti_complete_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

translations = data['translations']
ai_prompts_db = data['prompts']
question_mbti = {int(k): v for k, v in data['question_mbti'].items()}

# 读取中文原题
with open('public/mbti/full.json', 'r', encoding='utf-8') as f:
    full_zh_cn = json.load(f)['questions']

# 构建最终数据结构
final_output = {
    "zh-CN": [],
    "en": [],
    "zh-TW": []
}

# 处理每个问题
for idx in range(88):
    q_num = idx + 1
    trans = translations[str(q_num)]
    mbti_types = question_mbti[q_num]

    # 中文版本 - 使用原文
    zh_cn_title = full_zh_cn[idx]['title']
    zh_cn_selections = []
    for i, option_idx in enumerate([0, 1]):
        selection_text = full_zh_cn[idx]['selections'][option_idx]
        mbti_type = mbti_types[option_idx]
        ai_prompt = ai_prompts_db[mbti_type]['zh-CN']
        zh_cn_selections.append({
            "text": selection_text,
            "aiPrompt": ai_prompt
        })

    final_output['zh-CN'].append({
        "title": zh_cn_title,
        "selections": zh_cn_selections
    })

    # 英文版本
    en_selections = []
    for i, option_idx in enumerate([0, 1]):
        selection_text = trans['en_s'][option_idx]
        mbti_type = mbti_types[option_idx]
        ai_prompt = ai_prompts_db[mbti_type]['en']
        en_selections.append({
            "text": selection_text,
            "aiPrompt": ai_prompt
        })

    final_output['en'].append({
        "title": trans['en'],
        "selections": en_selections
    })

    # 繁体中文版本
    tw_selections = []
    for i, option_idx in enumerate([0, 1]):
        selection_text = trans['tw_s'][option_idx]
        mbti_type = mbti_types[option_idx]
        ai_prompt = ai_prompts_db[mbti_type]['zh-TW']
        tw_selections.append({
            "text": selection_text,
            "aiPrompt": ai_prompt
        })

    final_output['zh-TW'].append({
        "title": trans['tw'],
        "selections": tw_selections
    })

# 保存最终输出
with open('public/mbti/full-questions.json', 'w', encoding='utf-8') as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print("COMPLETE")
