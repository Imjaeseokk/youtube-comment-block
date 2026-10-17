/* Shared by the isolated content script and the local preview. No network requests. */
(() => {
  "use strict";
  const messages = {
    ko: {
      comments: "댓글", protected: "잠시 멈춤", question: "정말 댓글을 보시겠습니까?",
      introduction: "다른 사람의 생각을 읽기 전에, 내 생각에 잠깐 여유를 주세요.",
      focus: "영상에 집중하기", reveal: "예, 댓글 보기", hide: "다시 숨기기",
      hidden: "댓글은 잠시 접어 두었어요.", hiddenBody: "지금은 영상과 내 생각에 집중해 보세요.",
      reconsider: "댓글 보기 선택", viewing: "댓글을 보고 있습니다", videoOnly: "이 영상에서만 표시됩니다.",
      research: "연구에서 살펴본 이야기", reflection: "잠깐 생각해 보기",
      details: "연구와 출처 보기", source: "논문 원문 / 초록", restore: "다시 생각해 보기"
    },
    en: {
      comments: "Comments", protected: "Take a moment", question: "Do you really want to see the comments?",
      introduction: "Give your own thoughts a little space before reading everyone else’s.",
      focus: "Focus on the video", reveal: "Yes, show comments", hide: "Hide again",
      hidden: "Comments can wait.", hiddenBody: "For now, make room for the video and your own thoughts.",
      reconsider: "Choose to view comments", viewing: "You’re viewing comments", videoOnly: "Shown for this video only.",
      research: "A finding to consider", reflection: "A moment to reflect",
      details: "Study and source", source: "Original paper / abstract", restore: "Think it over again"
    }
  };
  const insights = [
    {
      id: "social-influence", type: "research", citation: "Muchnik, Aral & Taylor · Science (2013)",
      title: "Social Influence Bias: A Randomized Experiment", url: "https://doi.org/10.1126/science.1240466",
      ko: {
        headline: "다른 사람의 평가는, 내 판단의 출발점이 될 수 있어요.",
        body: "소셜 뉴스 사이트의 무작위 실험에서는 먼저 보인 평가가 뒤따르는 이용자의 평가에 영향을 주었습니다.",
        detail: "연구진은 댓글의 초기 추천·비추천 수치를 무작위로 조작했습니다. 먼저 표시된 긍정 평가가 이후 평가에 영향을 주었으며, 부정 평가의 효과는 달랐습니다.",
        limitation: "온라인 평가 행동을 다룬 연구입니다. 모든 유튜브 댓글이 판단을 왜곡한다는 뜻은 아닙니다."
      },
      en: {
        headline: "Other people’s ratings can become a starting point for your own judgment.",
        body: "In a randomized experiment on a social news site, earlier ratings influenced how later users rated comments.",
        detail: "Researchers randomly changed initial positive and negative comment ratings. Early positive ratings influenced later ratings; negative ratings had a different effect.",
        limitation: "This study examined online rating behavior. It does not show that every YouTube comment distorts judgment."
      }
    },
    {
      id: "incivility", type: "research", citation: "Anderson et al. · JCMC (2014)",
      title: "The “Nasty Effect”: Online Incivility and Risk Perceptions of Emerging Technologies",
      url: "https://doi.org/10.1111/jcc4.12009",
      ko: {
        headline: "댓글의 거친 말투가, 내용에 대한 인식까지 흔들 수 있어요.",
        body: "나노기술 기사에 붙은 무례한 댓글을 읽은 실험에서는, 기존 성향에 따라 위험 인식이 더 양극화되는 결과가 나타났습니다.",
        detail: "미국 인구를 대표하도록 구성된 표본을 대상으로 한 실험입니다. 무례한 블로그 댓글에 노출되었을 때, 종교적 성향과 해당 기술에 대한 기존 지지에 따라 나노기술의 위험 인식이 양극화되었습니다.",
        limitation: "특정 과학 기사와 댓글을 다룬 실험입니다. 모든 주제나 이용자에게 같은 결과가 나타난다고 일반화할 수 없습니다."
      },
      en: {
        headline: "A hostile tone in the comments can shape how the subject feels.",
        body: "In an experiment about a nanotechnology article, uncivil comments polarized risk perceptions along readers’ existing predispositions.",
        detail: "An experiment with a sample representative of the US population examined uncivil blog comments. Risk perceptions polarized along religiosity and existing support for the technology.",
        limitation: "This was an experiment about a specific science topic. Its findings cannot be generalized to every topic or viewer."
      }
    },
    {
      id: "own-thoughts", type: "reflection",
      ko: { headline: "이 영상에 대한 내 생각은 무엇인가요?", body: "인상 깊었던 점을 하나 떠올려 보세요. 다른 사람의 해석은 그다음에 만나도 괜찮아요." },
      en: { headline: "What do you think about this video?", body: "Recall one thing that stood out to you. Other people’s interpretations can wait a moment." }
    },
    {
      id: "intentional-choice", type: "reflection",
      ko: { headline: "궁금해서 여는 건가요, 익숙해서 여는 건가요?", body: "댓글을 읽고 싶은 이유가 없다면, 오늘은 여기서 멈춰도 괜찮아요. 내 주의와 기분을 어디에 둘지는 내가 정할 수 있어요." },
      en: { headline: "Are you curious, or is this a familiar habit?", body: "If there’s nothing you want from the comments, you can stop here today. You get to choose where your attention goes." }
    }
  ];
  function videoKey(href) {
    try {
      const url = new URL(href);
      return url.pathname === "/watch" ? url.searchParams.get("v") || null : null;
    } catch { return null; }
  }
  function chooseInsight(key) {
    let hash = 0;
    for (const char of key || "") hash = ((hash * 31) + char.charCodeAt(0)) >>> 0;
    return insights[hash % insights.length];
  }
  globalThis.YCB = Object.freeze({ messages, insights, videoKey, chooseInsight });
})();
