import json

questions_cn = [
    {
      "title": "1. 我在工作中最好的想法源自",
      "selections": [
        {
          "text": "与他人交流想法并共同分享。",
          "aiPrompt": "外向型(E)：通过与外界互动获取能量和灵感，善于社交沟通，重视团队协作，喜欢在讨论中激发创意，适合需要人际交往的工作环境。"
        },
        {
          "text": "自己安静地思考。",
          "aiPrompt": "内向型(I)：通过内在思考获取能量和灵感，善于独立工作，注重深度思考，喜欢安静专注的环境，更适合需要集中注意力的工作。"
        }
      ]
    },
    {
      "title": "2. 当我主持会议时，我通常",
      "selections": [
        {
          "text": "会严格按照我事先准备好的议程来进行。",
          "aiPrompt": "判断型(J)：倾向于有计划、有组织地处理事务，重视结果和效率，喜欢按部就班地完成任务，做事条理清晰，目标明确。"
        },
        {
          "text": "比较灵活，对出现的任何情况都持开放态度。",
          "aiPrompt": "感知型(P)：倾向于灵活适应变化，重视过程和可能性，喜欢随机应变，对新事物保持开放，更具创造性和适应性。"
        }
      ]
    },
    {
      "title": "3. 在处理下属的发展问题时，我最有可能",
      "selections": [
        {
          "text": "讨论我对他/她行为方面存在的问题。",
          "aiPrompt": "思维型(T)：倾向于关注客观事实和逻辑分析，处理问题以理性和原则为基础，重视公正性和一致性，善于找出问题的根本原因。"
        },
        {
          "text": "不喜欢告诉他/她一些不愉快的事。",
          "aiPrompt": "情感型(F)：倾向于关注他人感受和人际关系，处理问题以体谅和和谐为重，重视团队成员的感受，善于维护关系融洽。"
        }
      ]
    },
    {
      "title": "4. 我更喜欢我工作的地方是",
      "selections": [
        {
          "text": "有着明确规章制度、条理清晰的。",
          "aiPrompt": "判断型(J)：偏好有序和可预测的环境，重视结构和规范，喜欢明确的指导方针，在规则清晰的环境中表现更好。"
        },
        {
          "text": "更加开放式、宽松自由的。",
          "aiPrompt": "感知型(P)：偏好自由和灵活的环境，重视自主性和创造性，喜欢有更多自主发挥的空间，适应能力强。"
        }
      ]
    },
    {
      "title": "5. 我更希望有一个与我",
      "selections": [
        {
          "text": "每天都有大量互动的上级。",
          "aiPrompt": "外向型(E)：需要频繁的社交互动来保持能量，喜欢团队协作和沟通密集的环境，在人际关系丰富的团队中更加活跃。"
        },
        {
          "text": "只有偶尔互动的上级。",
          "aiPrompt": "内向型(I)：偏好较少的打扰和更多的独立工作空间，需要时间来专注思考，喜欢有自主性的工作方式，在安静环境中效率更高。"
        }
      ]
    },
    {
      "title": "6. 当我做决策时，我更倾向于",
      "selections": [
        {
          "text": "基于客观事实和逻辑分析。",
          "aiPrompt": "思维型(T)：决策时重视理性分析，以数据和事实为依据，追求客观公正，善于发现问题的关键和本质。"
        },
        {
          "text": "考虑他人的感受和人际关系。",
          "aiPrompt": "情感型(F)：决策时重视人情因素，考虑对他人的影响，追求和谐共处，善于处理人际关系，重视团队的凝聚力。"
        }
      ]
    },
    {
      "title": "7. 在面对新挑战时，我通常会",
      "selections": [
        {
          "text": "制定详细的计划和步骤。",
          "aiPrompt": "判断型(J)：喜欢有条理地解决问题，重视结构和计划性，倾向于按部就班地推进，在有序环境中更加高效。"
        },
        {
          "text": "随机应变，顺其自然。",
          "aiPrompt": "感知型(P)：喜欢灵活应对，重视适应性和即兴发挥，善于抓住突发机会，在变化环境中表现更出色。"
        }
      ]
    },
    {
      "title": "8. 在社交场合中，我更倾向于",
      "selections": [
        {
          "text": "主动与陌生人交流，扩大社交圈。",
          "aiPrompt": "外向型(E)：在社交中表现积极主动，享受与人互动，善于建立新关系，在人际交往中获得能量和动力。"
        },
        {
          "text": "与熟悉的朋友深入交流。",
          "aiPrompt": "内向型(I)：在社交中偏好深度交流，重视质量而非数量，喜欢与少数人建立深层次的关系，在熟悉的环境中更加舒适。"
        }
      ]
    }
]

questions_en = [
    {
      "title": "1. My best ideas at work come from",
      "selections": [
        {
          "text": "Discussing and sharing ideas with others.",
          "aiPrompt": "Extroverted (E): Gains energy and inspiration through interaction with the outside world, good at social communication, values teamwork, likes to spark creativity in discussions, suitable for work environments requiring interpersonal interaction."
        },
        {
          "text": "Thinking quietly by myself.",
          "aiPrompt": "Introverted (I): Gains energy and inspiration through internal reflection, good at independent work, values deep thinking, likes quiet and focused environments, more suitable for work requiring concentration."
        }
      ]
    },
    {
      "title": "2. When I chair a meeting, I usually",
      "selections": [
        {
          "text": "Stick strictly to the agenda I prepared in advance.",
          "aiPrompt": "Judging (J): Tends to handle matters in a planned and organized way, values results and efficiency, likes to complete tasks step by step, organized and clear goals."
        },
        {
          "text": "Am more flexible and open to whatever comes up.",
          "aiPrompt": "Perceiving (P): Tends to adapt flexibly to changes, values process and possibilities, likes to improvise, open to new things, more creative and adaptable."
        }
      ]
    },
    {
      "title": "3. When dealing with subordinates' development, I am most likely to",
      "selections": [
        {
          "text": "Discuss problems with their behavior.",
          "aiPrompt": "Thinking (T): Tends to focus on objective facts and logical analysis, handles problems based on reason and principles, values fairness and consistency, good at finding the root cause of problems."
        },
        {
          "text": "Dislike telling them unpleasant things.",
          "aiPrompt": "Feeling (F): Tends to focus on others' feelings and relationships, handles problems with consideration and harmony, values team members' feelings, good at maintaining harmonious relationships."
        }
      ]
    },
    {
      "title": "4. I prefer my workplace to be",
      "selections": [
        {
          "text": "Structured with clear rules and regulations.",
          "aiPrompt": "Judging (J): Prefers orderly and predictable environments, values structure and norms, likes clear guidelines, performs better in environments with clear rules."
        },
        {
          "text": "More open, relaxed, and free.",
          "aiPrompt": "Perceiving (P): Prefers free and flexible environments, values autonomy and creativity, likes more space for self-expression, strong adaptability."
        }
      ]
    },
    {
      "title": "5. I would prefer a supervisor who interacts with me",
      "selections": [
        {
          "text": "Frequently every day.",
          "aiPrompt": "Extroverted (E): Needs frequent social interaction to maintain energy, likes teamwork and communication-intensive environments, more active in teams with rich interpersonal relationships."
        },
        {
          "text": "Only occasionally.",
          "aiPrompt": "Introverted (I): Prefers less disturbance and more independent work space, needs time to focus on thinking, likes autonomous working methods, more efficient in quiet environments."
        }
      ]
    },
    {
      "title": "6. When making decisions, I tend to",
      "selections": [
        {
          "text": "Base them on objective facts and logical analysis.",
          "aiPrompt": "Thinking (T): Values rational analysis in decision-making, based on data and facts, pursues objectivity and fairness, good at discovering the key and essence of problems."
        },
        {
          "text": "Consider others' feelings and relationships.",
          "aiPrompt": "Feeling (F): Values human factors in decision-making, considers the impact on others, pursues harmonious coexistence, good at handling interpersonal relationships, values team cohesion."
        }
      ]
    },
    {
      "title": "7. When facing new challenges, I usually",
      "selections": [
        {
          "text": "Create detailed plans and steps.",
          "aiPrompt": "Judging (J): Likes to solve problems in an organized way, values structure and planning, tends to advance step by step, more efficient in orderly environments."
        },
        {
          "text": "Adapt to changes and go with the flow.",
          "aiPrompt": "Perceiving (P): Likes to respond flexibly, values adaptability and improvisation, good at seizing sudden opportunities, performs better in changing environments."
        }
      ]
    },
    {
      "title": "8. In social situations, I tend to",
      "selections": [
        {
          "text": "Initiate conversations with strangers and expand my social circle.",
          "aiPrompt": "Extroverted (E): Active and proactive in social situations, enjoys interacting with people, good at building new relationships, gains energy and motivation in interpersonal interactions."
        },
        {
          "text": "Have deep conversations with familiar friends.",
          "aiPrompt": "Introverted (I): Prefers deep communication in social situations, values quality over quantity, likes to build deep relationships with a few people, more comfortable in familiar environments."
        }
      ]
    }
]

questions_tw = [
    {
      "title": "1. 我在工作中最好的想法源自",
      "selections": [
        {
          "text": "與他人交流想法並共同分享。",
          "aiPrompt": "外向型(E)：通過與外界互動獲取能量和靈感，善於社交溝通，重視團隊協作，喜歡在討論中激發創意，適合需要人際交往的工作環境。"
        },
        {
          "text": "自己安靜地思考。",
          "aiPrompt": "內向型(I)：通過內在思考獲取能量和靈感，善於獨立工作，注重深度思考，喜歡安靜專注的環境，更適合需要集中注意力的工作。"
        }
      ]
    },
    {
      "title": "2. 當我主持會議時，我通常",
      "selections": [
        {
          "text": "會嚴格按照我事先準備好的議程來進行。",
          "aiPrompt": "判斷型(J)：傾向於有計劃、有組織地處理事務，重視結果和效率，喜歡按部就班地完成任務，做事條理清晰，目標明確。"
        },
        {
          "text": "比較靈活，對出現的任何情況都持開放態度。",
          "aiPrompt": "感知型(P)：傾向於靈活適應變化，重視過程和可能性，喜歡隨機應變，對新事物保持開放，更具創造性和適應性。"
        }
      ]
    },
    {
      "title": "3. 在處理下屬的發展問題時，我最有可能",
      "selections": [
        {
          "text": "討論我對他/她行為方面存在的問題。",
          "aiPrompt": "思維型(T)：傾向於關注客觀事實和邏輯分析，處理問題以理性和原則為基礎，重視公正性和一致性，善於找出問題的根本原因。"
        },
        {
          "text": "不喜歡告訴他/她一些不愉快的事。",
          "aiPrompt": "情感型(F)：傾向於關注他人感受和人際關係，處理問題以體諒和和諧為重，重視團隊成員的感受，善於維護關係融洽。"
        }
      ]
    },
    {
      "title": "4. 我更喜歡我工作的地方是",
      "selections": [
        {
          "text": "有著明確規章制度、條理清晰的。",
          "aiPrompt": "判斷型(J)：偏好有序和可預測的環境，重視結構和規範，喜歡明確的指導方針，在規則清晰的環境中表現更好。"
        },
        {
          "text": "更加開放式、寬鬆自由的。",
          "aiPrompt": "感知型(P)：偏好自由和靈活的環境，重視自主性和創造性，喜歡有更多自主發揮的空間，適應能力強。"
        }
      ]
    },
    {
      "title": "5. 我更希望有一個與我",
      "selections": [
        {
          "text": "每天都有大量互動的上級。",
          "aiPrompt": "外向型(E)：需要頻繁的社交互動來保持能量，喜歡團隊協作和溝通密集的環境，在人際關係豐富的團隊中更加活躍。"
        },
        {
          "text": "只有偶爾互動的上級。",
          "aiPrompt": "內向型(I)：偏好較少的打擾和更多的獨立工作空間，需要時間來專注思考，喜歡有自主性的工作方式，在安靜環境中效率更高。"
        }
      ]
    },
    {
      "title": "6. 當我做決策時，我更傾向於",
      "selections": [
        {
          "text": "基於客觀事實和邏輯分析。",
          "aiPrompt": "思維型(T)：決策時重視理性分析，以數據和事實為依據，追求客觀公正，善於發現問題的關鍵和本質。"
        },
        {
          "text": "考慮他人的感受和人際關係。",
          "aiPrompt": "情感型(F)：決策時重視人情因素，考慮對他人的影響，追求和諧共處，善於處理人際關係，重視團隊的凝聚力。"
        }
      ]
    },
    {
      "title": "7. 在面對新挑戰時，我通常會",
      "selections": [
        {
          "text": "制定詳細的計劃和步驟。",
          "aiPrompt": "判斷型(J)：喜歡有調理地解決問題，重視結構和計劃性，傾向於按部就班地推進，在有序環境中更加高效。"
        },
        {
          "text": "隨機應變，順其自然。",
          "aiPrompt": "感知型(P)：喜歡靈活應對，重視適應性和即興發揮，善於抓住突發機會，在變化環境中表現更出色。"
        }
      ]
    },
    {
      "title": "8. 在社交場合中，我更傾向於",
      "selections": [
        {
          "text": "主動與陌生人交流，擴大社交圈。",
          "aiPrompt": "外向型(E)：在社交中表現積極主動，享受與人互動，善於建立新關係，在人際交往中獲得能量和動力。"
        },
        {
          "text": "與熟悉的朋友深入交流。",
          "aiPrompt": "內向型(I)：在社交中偏好深度交流，重視質量而非數量，喜歡與少數人建立深層次的關係，在熟悉的環境中更加舒適。"
        }
      ]
    }
]

print('CN_JSON_START')
print(json.dumps(questions_cn, ensure_ascii=False, indent=2))
print('CN_JSON_END')

print('EN_JSON_START')
print(json.dumps(questions_en, ensure_ascii=False, indent=2))
print('EN_JSON_END')

print('TW_JSON_START')
print(json.dumps(questions_tw, ensure_ascii=False, indent=2))
print('TW_JSON_END')
