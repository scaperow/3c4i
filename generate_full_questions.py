#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

# 完整的英文和繁体中文翻译（8-88题）
# 格式: {题号: {"en": 英文标题, "tw": 繁体标题, "en_s": [英文选项1, 英文选项2], "tw_s": [繁体选项1, 繁体选项2]}}

translations = {
    1: {"en": "1. My best ideas at work come from", "tw": "1. 我在工作中最好的想法來自", "en_s": ["Sharing and discussing ideas with others.", "Thinking quietly by myself."], "tw_s": ["與他人交流想法並共同分享。", "自己安靜地思考。"]},
    2: {"en": "2. When I lead meetings, I usually", "tw": "2. 當我主持會議時，我通常", "en_s": ["Strictly follow my prepared agenda.", "Stay flexible and open to any developments."], "tw_s": ["會嚴格按照我事先準備好的議程來進行。", "比較靈活，對出現的任何情況都持開放態度。"]},
    3: {"en": "3. When addressing a subordinate's development issues, I'm most likely to", "tw": "3. 在處理下屬的發展問題時，我最有可能", "en_s": ["Discuss the behavioral issues I observe.", "Avoid telling them something unpleasant."], "tw_s": ["討論我對他/她行為方面存在的問題。", "不喜歡告訴他/她一些不愉快的事。"]},
    4: {"en": "4. I prefer a workplace that is", "tw": "4. 我更喜歡我工作的地方是", "en_s": ["Clear with explicit rules and well-organized.", "More open, relaxed and free."], "tw_s": ["有著明確規章制度、條理清晰的。", "更加開放式、寬鬆自由的。"]},
    5: {"en": "5. I would prefer a boss with whom I", "tw": "5. 我更希望有一個與我", "en_s": ["Have lots of daily interaction.", "Have only occasional interaction."], "tw_s": ["每天都有大量互動的上級。", "只有偶爾互動的上級。"]},
    6: {"en": "6. I prefer to spend most of my time on", "tw": "6. 我更喜歡把大部分時間花在", "en_s": ["Applying the ideas we discuss.", "The ideas themselves."], "tw_s": ["所討論想法的應用上。", "想法本身上面。"]},
    7: {"en": "7. I prefer a work environment where", "tw": "7. 我更喜歡這樣一種工作環境：", "en_s": ["Frequent disagreements spark interesting discussions and ideas.", "Conflict is reduced by avoiding disagreement discussions."], "tw_s": ["頻繁的意見分歧能催生出有趣的討論和想法。", "通過避免討論意見分歧來減少衝突。"]},
    8: {"en": "8. I prefer projects that are", "tw": "8. 我更喜歡工作中的項目", "en_s": ["Clearly defined and well-planned.", "Open to flexible interpretation."], "tw_s": ["是定義明確且經過規劃的。", "允許靈活解讀的。"]},
    9: {"en": "9. I would prefer to spend my lunch time", "tw": "9. 我更願意這樣度過午餐時間", "en_s": ["Eating with a group of people.", "Eating alone or with one close colleague."], "tw_s": ["和一群人一起用餐。", "獨自用餐或者和一位關係密切的同事一起用餐。"]},
    10: {"en": "10. When my boss assigns me a challenging task, I usually", "tw": "10. 如果老闆交給我一項艱巨的任務，我通常", "en_s": ["Gather as much information as possible before starting.", "Jump in immediately and rely on my problem-solving ability."], "tw_s": ["在開始之前盡可能收集多的信息。", "立刻投入進去，依靠自己解決問題的能力。"]},
    11: {"en": "11. In performance reviews, I prefer my boss to say I'm", "tw": "11. 在績效評估時，我更希望老闆評價我是", "en_s": ["Intelligent and practical.", "Enthusiastic and approachable."], "tw_s": ["聰明且通情達理的。", "熱情且和藹可親的。"]},
    12: {"en": "12. I prefer to", "tw": "12. 我更喜歡", "en_s": ["Plan my work day carefully in advance.", "Go with the flow and see how things develop."], "tw_s": ["提前仔細規劃我的工作日。", "順其自然，看事情如何發展。"]},
    13: {"en": "13. I usually prefer to keep my office door", "tw": "13. 我通常更願意讓我的辦公室門", "en_s": ["Open.", "Closed."], "tw_s": ["開著。", "關著。"]},
    14: {"en": "14. When a new idea flashes into my mind, I usually", "tw": "14. 當一個新想法在我腦海中閃現時，我通常", "en_s": ["Like to carefully verify it before getting excited.", "Get excited and want to follow up quickly."], "tw_s": ["在興奮之前，喜歡先謹慎地驗證一下。", "會很興奮，並且想迅速跟進落實。"]},
    15: {"en": "15. In team meetings, I'm more inclined to emphasize", "tw": "15. 在團隊會議中，我更傾向於強調", "en_s": ["Analytical discussion of facts.", "Discussion of values involved."], "tw_s": ["對事實進行分析性討論。", "對涉及的價值觀進行討論。"]},
    16: {"en": "16. I prefer work with rewards that are", "tw": "16. 我更喜歡這樣一種工作，其回報是", "en_s": ["Visible regularly and clearly defined.", "Gradually realized over a long period."], "tw_s": ["能定期清晰可見的。", "在很長一段時間內逐步兌現的。"]},
    17: {"en": "17. My work attire is", "tw": "17. 我上班時的著裝", "en_s": ["Chosen to get others' attention and appreciation.", "Conventional and appropriate."], "tw_s": ["是為了讓其他人注意並欣賞我的穿著。", "是以一種符合常規的方式穿著。"]},
    18: {"en": "18. When solving problems, I'm more likely to", "tw": "18. 當我解決問題時，我更有可能", "en_s": ["Focus most on the facts in front of me.", "Explore all possibilities."], "tw_s": ["最看重眼前的事實。", "探究所有的可能性。"]},
    19: {"en": "19. If I must confront a colleague or subordinate, I usually", "tw": "19. 如果我不得不與同事或下屬對質，我通常", "en_s": ["Make sure to get the facts straight regardless of other considerations.", "Take care not to hurt their feelings."], "tw_s": ["更在意確保準確地向他們說明事實情況。", "更在意確保不傷害他們的感情。"]},
    20: {"en": "20. I prefer a boss who", "tw": "20. 我更希望有一個", "en_s": ["Provides lots of structure and organizational support.", "Lets me work in my own way."], "tw_s": ["能提供大量條理結構和組織安排的老闆。", "讓我以最適合自己的方式做事的老闆。"]},
    21: {"en": "21. I prefer most of my work tasks to be", "tw": "21. 我更希望我工作中的大部分任務是", "en_s": ["A series of short-term tasks.", "Long-term projects I can concentrate on."], "tw_s": ["一系列連續的短期任務。", "我可以集中精力去做的長期項目。"]},
    22: {"en": "22. When I write a report, my first thought is usually about", "tw": "22. 當我寫報告時，我通常首先想到的是", "en_s": ["Details.", "The overall picture."], "tw_s": ["細節。", "整體概況。"]},
    23: {"en": "23. When making work decisions, I usually", "tw": "23. 當我在工作中需要做決策時，我通常", "en_s": ["Make decisions through rational thinking without regard to my feelings.", "Think my feelings are very important."], "tw_s": ["不顧及自己的感受，通過理性思考來做決策。", "認為自己的感受非常重要。"]},
    24: {"en": "24. I prefer my office to be", "tw": "24. 我更喜歡自己的辦公室是這樣的：", "en_s": ["Orderly, organized and systematic.", "Filled with creative projects, files and books."], "tw_s": ["物品擺放有序、有條理且系統化。", "有各種各樣富有創意的項目、文件和書籍。"]},
    25: {"en": "25. When having lunch with colleagues, I prefer to discuss", "tw": "25. 當我和同事一起吃午飯時，我更願意", "en_s": ["People (matters related to people).", "Ideas (matters related to ideas)."], "tw_s": ["談論人（相關的事）。", "談論想法（相關的事）。"]},
    26: {"en": "26. I prefer my boss to trust me with", "tw": "26. 我更希望老闆信任我去處理", "en_s": ["Practical problems.", "Policy matters."], "tw_s": ["實際的問題。", "政策方面的問題。"]},
    27: {"en": "27. When facing decisions at work, I'm usually more inclined to", "tw": "27. 在工作中面臨決策時，我通常更傾向於", "en_s": ["Think it through carefully.", "Trust my gut feeling."], "tw_s": ["仔細思考清楚。", "相信自己的直覺。"]},
    28: {"en": "28. I prefer daily work that is", "tw": "28. 我更喜歡每天所做的工作", "en_s": ["Continuous and relatively predictable.", "With frequent changes in activities and schedules."], "tw_s": ["是連續且相對可預測的。", "活動和日程安排經常有變化的。"]},
    29: {"en": "29. When I must organize and chair a meeting, I usually", "tw": "29. 當我必須組織並主持一場會議時，我更多時候", "en_s": ["Feel satisfied having the opportunity to lead.", "Prefer that others take this responsibility."], "tw_s": ["會因有機會領導而感到滿足。", "更希望由其他人來承擔這個責任。"]},
    30: {"en": "30. If asked to develop a strategic plan, I'm more likely to", "tw": "30. 如果要求我制定一個戰略計劃，我更有可能", "en_s": ["Emphasize what's practically feasible now.", "Focus the plan on future possibilities."], "tw_s": ["強調當下切實可行的方面。", "將計劃著眼於未來的可能性。"]},
    31: {"en": "31. When making work decisions, I usually", "tw": "31. 當我在工作中需要做決策時，我通常", "en_s": ["Focus first on facts and data.", "Pay careful attention to how people feel."], "tw_s": ["首先關注事實和數據。", "仔細留意人們的感受。"]},
    32: {"en": "32. When my boss gives me a new project, I usually prefer", "tw": "32. 當老闆給我一個新項目時，我通常更希望", "en_s": ["Clear guidance on what's expected of me.", "Freedom to do it my own way."], "tw_s": ["清楚地說明對我的期望是什麼。", "讓我按照自己想要的方式去完成它。"]},
    33: {"en": "33. I prefer to have", "tw": "33. 我更願意有", "en_s": ["A large group of work colleagues.", "A few colleagues I know well."], "tw_s": ["一大群工作上的同事。", "幾個我很熟悉的同事。"]},
    34: {"en": "34. In one-on-one meetings, I'm more likely to", "tw": "34. 在一對一的會議中，我更有可能", "en_s": ["Listen quietly and remember details.", "Anticipate what others will say and interrupt."], "tw_s": ["安靜地傾聽並記住細節。", "預判發言者的話並插話。"]},
    35: {"en": "35. If someone disagrees with my policy or decision, I usually", "tw": "35. 如果有人對我制定的政策或決策提出異議，我通常", "en_s": ["Stand firm.", "Try to avoid unpleasantness, anger and discord."], "tw_s": ["保持堅定。", "設法避免不愉快、生氣和不和諧的情況。"]},
    36: {"en": "36. After making a difficult choice at work, I usually", "tw": "36. 當我在工作中做出了一個艱難的選擇後，我通常", "en_s": ["Feel satisfied having completed it.", "Wish I could still keep other options open."], "tw_s": ["對已經完成這件事感到滿意。", "希望自己還能對其他選擇持開放態度。"]},
    37: {"en": "37. When I attend company events, I usually", "tw": "37. 當我參加公司外出活動時，我通常", "en_s": ["Walk around and meet people I don't know well.", "Hang around with colleagues I know best."], "tw_s": ["四處走走，結識一些我不太熟悉的人。", "和我最熟悉的同事一起閒逛。"]},
    38: {"en": "38. I think colleagues see me more as", "tw": "38. 我認為同事們更多地把我看作", "en_s": ["Someone focused on the present.", "Someone focused on the future."], "tw_s": ["一個著眼當下的人。", "一個著眼未來的人。"]},
    39: {"en": "39. When I need to read a long and complex report, I'm more likely to", "tw": "39. 當我要閱讀一份又長又複雜的報告時，我更有可能", "en_s": ["Be patient and study its details.", "Try to understand the main idea first, then see how I feel about it."], "tw_s": ["有耐心並研究其中的細節。", "試著先了解大致的想法，然後看看自己對它們的感覺如何。"]},
    40: {"en": "40. I prefer my work environment to be", "tw": "40. 我更喜歡我的工作環境是", "en_s": ["Comfortable, predictable and stable.", "Flexible and changeable."], "tw_s": ["舒適、可預測且穩定的。", "靈活且多變的。"]},
    41: {"en": "41. My work colleagues are more likely to describe me as", "tw": "41. 我工作中的同事更有可能把我描述成", "en_s": ["An energetic team member.", "A quiet and thoughtful employee."], "tw_s": ["一個充滿活力的團隊成員。", "一個安靜且善於思考的員工。"]},
    42: {"en": "42. When preparing a presentation, I'm more likely to emphasize", "tw": "42. 當我準備一場演示時，我更傾向於強調", "en_s": ["Real examples from my own experience.", "Discussion of ideas and concepts."], "tw_s": ["運用我自身經驗中的真實事例。", "對想法和概念進行討論。"]},
    43: {"en": "43. I like to work with colleagues who are", "tw": "43. 我更喜歡和這樣的同事一起工作：", "en_s": ["Very reliant on logic.", "More concerned with their own feelings."], "tw_s": ["非常依賴邏輯的。", "更多地考慮自身感受的。"]},
    44: {"en": "44. If someone on my team fails to complete a scheduled task, I usually", "tw": "44. 如果我團隊裡有人未能按時完成預定的任務，我通常", "en_s": ["Become impatient and irritated.", "Try to extend the deadline."], "tw_s": ["變得不耐煩且惱怒。", "想辦法延長截止期限。"]},
    45: {"en": "45. When I attend a training course, I'm more likely to", "tw": "45. 當我參加培訓課程時，我更有可能", "en_s": ["Participate openly and actively.", "Let others take the active roles."], "tw_s": ["公開且積極地參與。", "讓其他人扮演積極的角色。"]},
    46: {"en": "46. When colleagues and subordinates present ideas to me, I'm usually more interested in", "tw": "46. 當同事和下屬向我提出想法時，我通常對", "en_s": ["Ideas that can be immediately applied.", "Ideas with innovative approaches."], "tw_s": ["能立即派上用場的想法更感興趣。", "具有創新方法的想法更感興趣。"]},
    47: {"en": "47. If I must address a colleague's feelings, I prefer to", "tw": "47. 如果我必須處理同事的感受問題，我更願意", "en_s": ["Tell the truth, even if not tactful.", "Be tactful, even if not completely truthful."], "tw_s": ["即便做不到委婉，也要說實話。", "即便不能說實話，也要委婉一些。"]},
    48: {"en": "48. I prefer projects that", "tw": "48. 我更喜歡這樣的項目：", "en_s": ["Have a clear end date and I know when I'll finish.", "Stay open-ended to ensure thorough consideration."], "tw_s": ["有明確的結束日期，我知道什麼時候能完成。", "可以保持開放式的，以確保考慮周全。"]},
    49: {"en": "49. When I need to make decisions at work, I more often", "tw": "49. 當我在工作中需要做決策時，我更多時候", "en_s": ["Discuss with several people before deciding.", "Think through the solution mostly in my head."], "tw_s": ["在做決定之前和多個人商量討論。", "大部分時間自己在腦子裡思考解決辦法。"]},
    50: {"en": "50. I prefer work where I can", "tw": "50. 我更喜歡這樣的工作，在其中我可以", "en_s": ["Use my experience to handle familiar tasks.", "Face new ideas and problems."], "tw_s": ["運用我的經驗來處理熟悉的任務。", "面對對我來說全新的想法和問題。"]},
    51: {"en": "51. When disagreement becomes heated in a meeting, I usually", "tw": "51. 當我在會議上，意見分歧變得激烈時，我通常", "en_s": ["Defend the side I think is most logical.", "Try to create harmony and find a solution."], "tw_s": ["捍衛我認為最符合邏輯的一方。", "試圖營造一種和諧的氛圍並找到解決方案。"]},
    52: {"en": "52. When I get a new project, I usually prefer to", "tw": "52. 當我接到一個新項目時，我通常更願意", "en_s": ["Get started and finish it quickly.", "Take my time and explore different approaches."], "tw_s": ["盡快著手並盡快完成它。", "盡可能慢慢來，探索各種不同的方法。"]},
    53: {"en": "53. I'm more interested in", "tw": "53. 我更感興趣的是", "en_s": ["The actual tasks I'm doing day to day.", "My thoughts and ideas about my work."], "tw_s": ["我日復一日正在做的實際任務。", "我對工作的思考想法。"]},
    54: {"en": "54. When I attend a training course, I usually prefer", "tw": "54. 當我參加培訓課程時，我通常更傾向於", "en_s": ["Experiential learning processes.", "Information and abstract concepts."], "tw_s": ["體驗式的學習過程。", "信息以及抽象概念方面的內容。"]},
    55: {"en": "55. When I meet with colleagues, I usually", "tw": "55. 當我和同事開會時，我通常", "en_s": ["Finish meetings efficiently in a practical way.", "Spend more time on social interaction."], "tw_s": ["以一種務實的方式迅速開完會。", "在社交互動方面多花些時間。"]},
    56: {"en": "56. I prefer work where", "tw": "56. 我更願意從事這樣一種工作：", "en_s": ["Activities require me to reach conclusions.", "Activities allow me to keep an open mind based on my experience."], "tw_s": ["工作中的活動要求我得出結論。", "工作中的活動允許我根據自身經驗保持開放性。"]},
    57: {"en": "57. When I seek advice or help from colleagues, I usually", "tw": "57. 當我向同事尋求建議或幫助時，我通常", "en_s": ["Feel comfortable.", "Feel a bit uncomfortable."], "tw_s": ["感覺自在。", "有點不自在。"]},
    58: {"en": "58. In meetings or when reading reports, I'm more likely to", "tw": "58. 在會議上或者閱讀報告時，我更有可能", "en_s": ["Remember the facts presented.", "Primarily remember the concepts presented."], "tw_s": ["記住所呈現的事實內容。", "主要記住所呈現的概念內容。"]},
    59: {"en": "59. When colleagues ask for my advice on work matters, I more often", "tw": "59. 當同事就工作事務向我徵求建議時，我更多時候", "en_s": ["Guide them to make decisions based on pure logic.", "Help them explore the values and policy factors in their situation."], "tw_s": ["引導他們基於純粹的邏輯做出決策。", "幫助他們探究所處情況中的價值觀和政策因素。"]},
    60: {"en": "60. When I'm in a meeting, I'm usually more interested in", "tw": "60. 當我在會議中時，我通常更感興趣的是", "en_s": ["Finishing the work task quickly.", "Taking time to ensure everyone's opinions are heard."], "tw_s": ["盡快完成工作任務。", "花時間確保每個人的意見都能被聽到。"]},
    61: {"en": "61. When I'm interrupted while working on a tricky task, I usually", "tw": "61. 當我在處理一項棘手工作時被打斷，我通常", "en_s": ["Really enjoy the chance to chat with others.", "Prefer to think independently."], "tw_s": ["很高興有機會和別人聊一聊。", "更希望能獨自思考。"]},
    62: {"en": "62. When I read a report, I usually first look at", "tw": "62. 當我閱讀一份報告時，我通常首先看", "en_s": ["The detailed body section.", "The summary or executive overview section."], "tw_s": ["詳細信息的正文部分。", "摘要或者執行概述部分。"]},
    63: {"en": "63. When I propose a new idea at work, I more often", "tw": "63. 當我在工作中提出一個新想法時，我更多時候", "en_s": ["Feel conviction about its correctness.", "Appeal to people's sense of values to persuade them."], "tw_s": ["對其正確性堅定不移。", "通過喚起他人的價值感來說服他們。"]},
    64: {"en": "64. If my boss insists on scheduling my workday, I will feel", "tw": "64. 如果老闆堅持要求我安排我的工作日程，我會感覺", "en_s": ["Satisfied from being organized.", "Uncomfortable from being constrained."], "tw_s": ["因變得有條理而感到滿意。", "因受到約束而感到不舒服。"]},
    65: {"en": "65. When someone tells a joke in a meeting, I usually", "tw": "65. 當我在會議上，有人講了個笑話時，我通常", "en_s": ["Laugh out loud and want to tell one too.", "Appreciate the joke quietly."], "tw_s": ["笑出聲來，並且想著也講一個。", "靜靜地欣賞這個笑話。"]},
    66: {"en": "66. In performance reviews, it would be more accurate to say I'm", "tw": "66. 在績效評估中，如果老闆說我是，那會更準確", "en_s": ["Practical.", "Imaginative."], "tw_s": ["務實的。", "富有想象力的。"]},
    67: {"en": "67. I'm usually more interested in colleagues'", "tw": "67. 我通常對同事們", "en_s": ["How they think about problems.", "How they feel about problems."], "tw_s": ["如何思考問題更感興趣。", "對問題有什麼感受更感興趣。"]},
    68: {"en": "68. When a new and unusual policy is announced at work, I usually", "tw": "68. 當工作中發佈了一項新的且不同尋常的政策公告時，我通常", "en_s": ["Feel annoyed or upset about the changes.", "Am interested in seeing how I'll adapt to the new situation."], "tw_s": ["會因這些變化而感到惱火或者心煩意亂。", "有興趣看看自己將如何應對新環境。"]},
    69: {"en": "69. In meetings, I usually", "tw": "69. 在會議中，我通常", "en_s": ["Speak whenever I want to.", "Wait until others ask me directly before speaking."], "tw_s": ["想發言的時候就直接說出來。", "等到別人直接問我的時候才發言。"]},
    70: {"en": "70. When I start a new project, I usually", "tw": "70. 當我開始一個新項目時，我通常", "en_s": ["Write out a step-by-step plan early in the project.", "Watch how things develop, then make plans."], "tw_s": ["在項目初期就早早地寫出一個逐步推進的計劃。", "先觀望事情如何發展，然後再做規劃。"]},
    71: {"en": "71. When I listen to a colleague's presentation, I'm more likely to", "tw": "71. 當我聽同事做演示時，我更有可能", "en_s": ["Offer criticism openly and from a rational perspective.", "Be careful in expressing my views, especially when I disagree."], "tw_s": ["公開且從理性角度提出批評意見。", "在表達自己的觀點時會很謹慎，尤其是當我不同意的時候。"]},
    72: {"en": "72. If I can't have both, I prefer colleagues who are more", "tw": "72. 如果二者不能兼得，我更希望同事是", "en_s": ["Organized.", "Spontaneous."], "tw_s": ["有條理的。", "隨性的。"]},
    73: {"en": "73. I prefer to work for a company where", "tw": "73. 我更願意在這樣一家公司工作：", "en_s": ["Everyone works together in an open, active environment.", "People work independently in their own spaces."], "tw_s": ["每個人都在一個開放、活躍的環境中一起工作。", "人們在各自的空間裡獨立工作。"]},
    74: {"en": "74. I more often look for work that allows me to use", "tw": "74. 我更多時候會尋找那些能運用", "en_s": ["My practical skills and qualities.", "My ability to create new ideas and things."], "tw_s": ["我的實用技能和特質的工作。", "我創造新想法和新事物能力的工作。"]},
    75: {"en": "75. When I must make decisions at work, I'm more likely to", "tw": "75. 當我在工作中必須做決策時，我更有可能", "en_s": ["Analyze the situation logically without considering my own values and feelings.", "Apply my own values and feelings to the solution."], "tw_s": ["不考慮自己的價值觀和感受，從邏輯上分析情況。", "著重將自己的價值觀和感受應用到解決方案中。"]},
    76: {"en": "76. When I express my views at a meeting, I usually", "tw": "76. 當我在會議上表達自己的觀點時，我通常", "en_s": ["Am quite decisive.", "Am willing to accept others' suggestions for change and alternative views."], "tw_s": ["很果斷。", "願意接受別人提出的改變和其他觀點。"]},
    77: {"en": "77. When I need to convey an idea or message, I'm more inclined to", "tw": "77. 當我需要傳達一個想法或信息時，我更傾向於", "en_s": ["Discuss it directly with others.", "Write it down and send it."], "tw_s": ["直接和別人口頭交流這件事。", "把它寫下來傳達。"]},
    78: {"en": "78. My leadership style is best described as", "tw": "78. 我的領導風格最好被描述為", "en_s": ["Practical.", "Visionary."], "tw_s": ["務實型的。", "有遠見型的。"]},
    79: {"en": "79. In a performance review meeting, I'm more likely to", "tw": "79. 在績效評估會議上，我通常更有可能", "en_s": ["Be frank and honest regardless of feelings.", "Try to ease any issues and avoid hurting others' feelings."], "tw_s": ["不顧及感受，坦率且誠實地表達。", "試圖化解任何問題，避免傷害他人感情。"]},
    80: {"en": "80. When I discuss an important matter in a meeting, I usually", "tw": "80. 當我在會議上討論一個重要問題時，我通常", "en_s": ["Try to reach a definite conclusion quickly.", "Keep multiple options and don't rush to a conclusion."], "tw_s": ["試圖迅速得出一個明確的結論。", "保留多種選擇，不急於下結論。"]},
    81: {"en": "81. I prefer", "tw": "81. 我更喜歡", "en_s": ["A workday full of changes with lots of interaction with others.", "Working for long periods without interaction with others."], "tw_s": ["充滿變化且有很多與他人互動的工作日。", "長時間不和他人互動的工作狀態。"]},
    82: {"en": "82. I prefer a work situation that is", "tw": "82. 我更喜歡這樣一種工作狀況：", "en_s": ["Stable and without much change.", "Full of changes."], "tw_s": ["穩定且沒什麼變化的。", "充滿變化的。"]},
    83: {"en": "83. Colleagues are more likely to describe my work behavior as", "tw": "83. 同事們更有可能把我在工作中的行為描述為", "en_s": ["Calm, composed and objective.", "Enthusiastic and passionate about people."], "tw_s": ["冷靜、沉著且客觀的。", "熱情且重感情的。"]},
    84: {"en": "84. At work, I prefer projects that", "tw": "84. 在工作中，我更喜歡這樣的項目：", "en_s": ["I can quickly get started on and finish within a shorter timeframe.", "Have longer and more flexible timeframes."], "tw_s": ["我能迅速開展工作以趕在較短期限內完成的項目。", "有著更長且更靈活期限的項目。"]},
    85: {"en": "85. When I'm meeting with colleagues and a senior manager or supervisor comes in, I usually", "tw": "85. 當我和同事一起開會，有一位高級經理或主管進來時，我通常", "en_s": ["Greet them in a comfortable and friendly way.", "Wait first to see how others react to them."], "tw_s": ["以一種自在且友好的方式向對方打招呼。", "先等等，看看其他人對他/她如何反應。"]},
    86: {"en": "86. When I think of my most important work strengths, they are", "tw": "86. 當我想到自己最重要的工作優勢時，它們", "en_s": ["More in the practical area.", "More in the idea and creativity area."], "tw_s": ["更多地處於實用領域。", "更傾向於想法創意領域。"]},
    87: {"en": "87. In training courses, I prefer instructors who rely more on", "tw": "87. 在培訓課程中，我更喜歡更依賴", "en_s": ["Rigor and logic.", "Emotion and experience."], "tw_s": ["嚴謹性和邏輯性的培訓師。", "情感和經驗的培訓師。"]},
    88: {"en": "88. I usually push my colleagues or subordinates to", "tw": "88. 我通常會催促同事或下屬", "en_s": ["Make a quick decision.", "Conduct a thorough review, even at the risk of delaying the decision."], "tw_s": ["迅速做決定。", "進行全面審查，即便有延遲做決定的風險也在所不惜。"]},
}

# MBTI维度映射和aiPrompts
mbti_types = ['E', 'I', 'J', 'P', 'T', 'F', 'S', 'N']

ai_prompts_db = {
    'E': {'zh-CN': '外向型(E)：通过与外界互动获取能量和灵感，善于社交沟通，重视团队协作，喜欢在讨论中激发创意，适合需要人际交往的工作环境。', 'en': 'Extroversion (E): Energize through interacting with others, excel at communication and teamwork, thrive in collaborative brainstorming, and work best in people-oriented environments.', 'zh-TW': '外向型(E)：透過與外界互動獲取能量和靈感，善於社交溝通，重視團隊協作，喜歡在討論中激發創意，適合需요人際交往的工作環境。'},
    'I': {'zh-CN': '内向型(I)：通过内在思考获取能量和灵感，善于独立工作，注重深度思考，喜欢安静专注的环境，更适合需要集中注意力的工作。', 'en': 'Introversion (I): Energize through internal reflection, prefer independent work and deep thinking, thrive in focused, quiet environments, and excel in concentrated work.', 'zh-TW': '內向型(I)：透過內在思考獲取能量和靈感，善於獨立工作，注重深度思考，喜歡安靜專注的環境，更適合需要集中注意力的工作。'},
    'J': {'zh-CN': '判断型(J)：倾向于有计划、有组织地处理事务，重视结果和效率，喜欢按部就班地完成任务，做事条理清晰，目标明确。', 'en': 'Judging (J): Planful, organized approach to tasks, focus on results and efficiency, prefer structured completion of work, clear goals and systematic processes.', 'zh-TW': '判斷型(J)：傾向於有計劃、有組織地處理事務，重視結果和效率，喜歡按部就班地完成任務，做事條理清晰，目標明確。'},
    'P': {'zh-CN': '感知型(P)：倾向于灵活适应变化，重视过程和可能性，喜欢随机应变，对新事物保持开放，更具创造性和适应性。', 'en': 'Perceiving (P): Adaptable, flexible approach to change, focus on process and possibilities, enjoy spontaneity, embrace new things, creative and adaptive.', 'zh-TW': '感知型(P)：傾向於靈活適應變化，重視過程和可能性，喜歡隨機應變，對新事物保持開放，更具創造性和適應性。'},
    'T': {'zh-CN': '思维型(T)：倾向于关注客观事实和逻辑分析，处理问题以理性和原则为基础，重视公正性和一致性，善于找出问题的根本原因。', 'en': 'Thinking (T): Focus on objective facts and logical analysis, base decisions on principles and fairness, maintain consistency, identify root causes of problems.', 'zh-TW': '思維型(T)：傾向於關注客觀事實和邏輯分析，處理問題以理性和原則為基礎，重視公正性和一致性，善於找出問題的根本原因。'},
    'F': {'zh-CN': '情感型(F)：倾向于关注他人感受和人际关系，处理问题以体谅和和谐为重，重视团队成员的感受，善于维护关系融洽。', 'en': 'Feeling (F): Focus on others\' emotions and relationships, base decisions on compassion and harmony, consider team members\' feelings, maintain positive relationships.', 'zh-TW': '情感型(F)：傾向於關注他人感受和人際關係，處理問題以體諒和和諧為重，重視團隊成員的感受，善於維護關係融洽。'},
    'S': {'zh-CN': '感知型(S)：关注具体的事实和实际应用，重视现实和可实现的方案，在处理实际问题时表现最佳，喜欢看到切实的成果。', 'en': 'Sensing (S): Focus on concrete facts and practical applications, value reality and feasible solutions, excel at handling practical problems, appreciate tangible results.', 'zh-TW': '感知型(S)：關注具體的事實和實際應用，重視現實和可實現的方案，在處理實際問題時表現最佳，喜歡看到切實的成果。'},
    'N': {'zh-CN': '直觉型(N)：关注抽象概念和长远可能性，重视创新和理论探讨，喜欢从多个角度思考问题，擅长看到更大的图景。', 'en': 'Intuition (N): Focus on abstract concepts and future possibilities, value innovation and theoretical discussion, view problems from multiple angles, appreciate the bigger picture.', 'zh-TW': '直覺型(N)：關注抽象概念和長遠可能性，重視創新和理論探討，喜歡從多個角度思考問題，擅長看到更大的圖景。'},
}

# 问题对应的MBTI维度
question_mbti = {
    1: ('E', 'I'), 2: ('J', 'P'), 3: ('T', 'F'), 4: ('J', 'P'), 5: ('E', 'I'),
    6: ('S', 'N'), 7: ('T', 'F'), 8: ('J', 'P'), 9: ('E', 'I'), 10: ('S', 'N'),
    11: ('T', 'F'), 12: ('J', 'P'), 13: ('E', 'I'), 14: ('S', 'N'), 15: ('T', 'F'),
    16: ('S', 'N'), 17: ('E', 'I'), 18: ('S', 'N'), 19: ('T', 'F'), 20: ('J', 'P'),
    21: ('J', 'P'), 22: ('S', 'N'), 23: ('T', 'F'), 24: ('J', 'P'), 25: ('E', 'I'),
    26: ('S', 'N'), 27: ('S', 'N'), 28: ('J', 'P'), 29: ('E', 'I'), 30: ('S', 'N'),
    31: ('T', 'F'), 32: ('J', 'P'), 33: ('E', 'I'), 34: ('E', 'I'), 35: ('T', 'F'),
    36: ('J', 'P'), 37: ('E', 'I'), 38: ('S', 'N'), 39: ('S', 'N'), 40: ('J', 'P'),
    41: ('E', 'I'), 42: ('S', 'N'), 43: ('T', 'F'), 44: ('J', 'P'), 45: ('E', 'I'),
    46: ('S', 'N'), 47: ('T', 'F'), 48: ('J', 'P'), 49: ('E', 'I'), 50: ('S', 'N'),
    51: ('T', 'F'), 52: ('J', 'P'), 53: ('S', 'N'), 54: ('S', 'N'), 55: ('E', 'I'),
    56: ('J', 'P'), 57: ('E', 'I'), 58: ('S', 'N'), 59: ('T', 'F'), 60: ('E', 'I'),
    61: ('E', 'I'), 62: ('S', 'N'), 63: ('T', 'F'), 64: ('J', 'P'), 65: ('E', 'I'),
    66: ('S', 'N'), 67: ('T', 'F'), 68: ('J', 'P'), 69: ('E', 'I'), 70: ('J', 'P'),
    71: ('T', 'F'), 72: ('J', 'P'), 73: ('E', 'I'), 74: ('S', 'N'), 75: ('T', 'F'),
    76: ('J', 'P'), 77: ('E', 'I'), 78: ('S', 'N'), 79: ('T', 'F'), 80: ('J', 'P'),
    81: ('E', 'I'), 82: ('J', 'P'), 83: ('T', 'F'), 84: ('J', 'P'), 85: ('E', 'I'),
    86: ('S', 'N'), 87: ('T', 'F'), 88: ('J', 'P'),
}

print(f"✓ Translations loaded: {len(translations)} questions")
print(f"✓ MBTI mappings: {len(question_mbti)} questions")

# Save to JSON file for later use
output = {
    'translations': translations,
    'prompts': ai_prompts_db,
    'question_mbti': question_mbti,
}

with open('/tmp/mbti_complete_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("✓ Complete data saved to /tmp/mbti_complete_data.json")
