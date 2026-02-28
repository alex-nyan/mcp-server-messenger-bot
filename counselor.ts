/**
 * Education counselor for Burmese students: scholarships abroad, OSSD, GED,
 * A-Levels, IGCSE, foundation programs, and education pathways in Myanmar.
 */

const KNOWLEDGE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["scholarship", "scholarships", "funding", "financial aid", "abroad", "overseas", "international"],
    answer:
      "There are many scholarship options for Burmese students studying abroad:\n\n" +
      "• **Government & bilateral**: Chevening (UK), Fulbright (USA), Australian Awards, MEXT (Japan), KGSP (Korea).\n" +
      "• **University-specific**: Most universities offer merit and need-based scholarships—check each university’s website.\n" +
      "• **Private/NG Os**: DAAD (Germany), Erasmus+, and organizations like Open Society Foundations sometimes support students from Myanmar.\n\n" +
      "Tip: Start early, meet deadlines, and prepare strong recommendation letters and personal statements. I can help you narrow down by country or level (undergrad/master).",
  },
  {
    keywords: ["ossd", "ontario", "canadian"],
    answer:
      "**OSSD (Ontario Secondary School Diploma)** is the high school diploma from Ontario, Canada. It’s widely accepted for university entry globally.\n\n" +
      "• You can complete OSSD through online/international schools or by studying in Ontario.\n" +
      "• Credits are earned per course; you need 30 credits (18 compulsory + 12 optional), plus community hours and the literacy requirement.\n" +
      "• Good option if you’re aiming for Canadian or international universities and want a flexible, recognized pathway.",
  },
  {
    keywords: ["ged", "general educational development", "high school equivalency"],
    answer:
      "**GED** is a high school equivalency credential accepted by many universities and employers worldwide.\n\n" +
      "• Tests: Reasoning through Language Arts, Mathematical Reasoning, Science, Social Studies.\n" +
      "• You can prepare via online courses or local GED prep centers; exams are often offered at test centers (including in some cities in the region).\n" +
      "• Accepted by many US and international colleges as equivalent to high school graduation. Check each university’s admissions page to confirm.",
  },
  {
    keywords: ["a level", "a-level", "alevel", "advanced level", "cambridge"],
    answer:
      "**A-Levels** (Cambridge or other boards) are two-year, subject-based qualifications widely used for university entry in the UK, Commonwealth, and beyond.\n\n" +
      "• Usually 3–4 subjects. Grades A*–E; universities often ask for specific grades (e.g. AAB).\n" +
      "• In Myanmar, some international schools and centers offer A-Level programs. You can also study via distance learning or overseas.\n" +
      "• Strong choice if you’re targeting UK, Australian, or Hong Kong universities.",
  },
  {
    keywords: ["igcse", "gcse", "cambridge international", "o level"],
    answer:
      "**IGCSE** (International General Certificate of Secondary Education) is typically taken at age 14–16 and is a solid foundation before A-Levels or other pre-university programs.\n\n" +
      "• Offered by Cambridge and other exam boards; many subjects available.\n" +
      "• In Myanmar, several international schools offer IGCSE. You can also study online/distance.\n" +
      "• Good for building a strong base before OSSD, A-Levels, or foundation year.",
  },
  {
    keywords: ["foundation", "foundation year", "pathway", "pre-university", "pre uni"],
    answer:
      "**Foundation programs** are usually one-year courses that prepare you for direct entry into year 1 of a degree, especially if your current qualification isn’t directly equivalent.\n\n" +
      "• Common in UK, Australia, and some Asian universities. Often include academic English and subject modules.\n" +
      "• Good if you’ve done IGCSE/O-Level or local Myanmar education and want a structured bridge to a foreign degree.\n" +
      "• Can be done in-country (e.g. at branch campuses) or abroad. I can help you think about which country or university.",
  },
  {
    keywords: ["myanmar", "burma", "local", "pathway in myanmar", "education in myanmar"],
    answer:
      "In Myanmar, common pathways for studying abroad include:\n\n" +
      "• **Local international schools**: IGCSE, A-Levels, or other curricula that lead to overseas university applications.\n" +
      "• **Foundation/bridge programs**: Some are offered locally or online before you go abroad.\n" +
      "• **Exams**: GED, OSSD (online), or A-Levels (at exam centers or through schools) can be part of your pathway.\n\n" +
      "Tell me your current level (e.g. Grade 10, finished high school) and target country so I can suggest a clearer path.",
  },
  {
    keywords: ["hello", "hi", "hey", "help", "start", "what can you do"],
    answer:
      "Hello! I’m your education counselor for Burmese students. I can help with:\n\n" +
      "📚 **Pathways**: OSSD, GED, A-Levels, IGCSE, foundation programs\n" +
      "🌍 **Scholarships abroad** and how to prepare\n" +
      "🇲🇲 **Education options in Myanmar** and next steps\n\n" +
      "Ask me anything—e.g. “What is OSSD?”, “Scholarships for UK”, or “Foundation program options.”",
  },
  {
    keywords: ["uk", "britain", "united kingdom", "chevening", "british"],
    answer:
      "**UK options** for Burmese students:\n\n" +
      "• **Chevening**: Full scholarship for one-year master's. Opens around Aug–Nov; apply early.\n" +
      "• **University scholarships**: Many UK universities offer partial/full scholarships—check their websites.\n" +
      "• **A-Levels or foundation** can lead to UK degree entry.",
  },
  {
    keywords: ["usa", "america", "us", "united states", "fulbright", "american"],
    answer:
      "**USA options**: **Fulbright** for graduate study (competitive). US universities often offer merit/need-based aid. **GED** is widely accepted for college entry.",
  },
  {
    keywords: ["australia", "australian", "australian awards"],
    answer:
      "**Australia**: **Australia Awards** (government scholarships). Australian universities also offer scholarships. Foundation/pathway programs are common.",
  },
  {
    keywords: ["japan", "japanese", "mext", "japan government"],
    answer:
      "**Japan**: **MEXT** (Japanese Government Scholarship) covers tuition, stipend, sometimes flight. Apply via embassy or university. Japanese language prep often required.",
  },
  {
    keywords: ["korea", "korean", "kgsp", "korean government"],
    answer:
      "**Korea**: **KGSP** = full scholarship for undergrad or graduate study. Check official KGSP website. Korean universities also offer their own scholarships.",
  },
  {
    keywords: ["canada", "canadian", "study in canada"],
    answer:
      "**Canada**: **OSSD** (Ontario diploma) is a strong pathway; can be done online or in Ontario. Canadian universities offer scholarships for international students.",
  },
  {
    keywords: ["ielts", "toefl", "english test", "english requirement", "language requirement"],
    answer:
      "**English**: **IELTS** and **TOEFL** are most common; universities state minimum scores (e.g. IELTS 6.0–6.5). Foundation programs often include English prep.",
  },
  {
    keywords: ["deadline", "when to apply", "application date"],
    answer:
      "**When to apply**: Scholarship deadlines are often 6–12 months before start. Universities have rolling or set deadlines. Prepare transcripts, recommendation letters, and personal statement early.",
  },
  {
    keywords: ["recommendation", "reference", "recommendation letter", "referee"],
    answer:
      "**Recommendation letters**: Choose teachers/supervisors who know your work. Give them time and your CV. Most programs want 2–3 letters.",
  },
  {
    keywords: ["personal statement", "statement of purpose", "sop", "motivation letter", "essay"],
    answer:
      "**Personal statement**: Explain why this subject and level; mention experience and goals. Be specific, stay within word limit, proofread.",
  },
  {
    keywords: ["undergraduate", "bachelor", "bachelor's", "undergrad", "first degree"],
    answer:
      "**Undergraduate** entry: A-Levels, OSSD, GED, or foundation year. Tell me your current level and target country for specific advice.",
  },
  {
    keywords: ["master", "masters", "graduate", "ms", "ma", "mba", "postgraduate"],
    answer:
      "**Master's**: Many scholarships target master's (Chevening, Fulbright, Australia Awards). Need a bachelor's; strong recommendation letters and SOP matter.",
  },
  {
    keywords: ["online", "distance", "remote", "study online"],
    answer:
      "**Online**: OSSD can be done through accredited online schools. GED prep/exams in many locations. Some universities offer online degrees. I can help choose a pathway.",
  },
  {
    keywords: ["cost", "fee", "fees", "expensive", "how much", "tuition"],
    answer:
      "**Costs**: Scholarships can cover tuition and living costs. Without one, tuition varies by country. I can help with scholarship and affordable options.",
  },
  {
    keywords: ["thanks", "thank you", "bye", "goodbye", "ok", "okay"],
    answer:
      "You're welcome! Ask anytime about scholarships, OSSD, GED, A-Levels, IGCSE, or foundation programs. Good luck!",
  },
  {
    keywords: ["who are you", "what are you", "robot", "bot", "ai", "counselor"],
    answer:
      "I'm an education counselor bot for Burmese students. I help with scholarships, OSSD, GED, A-Levels, IGCSE, foundation programs, and pathways in Myanmar. Ask me anything in that area!",
  },
];

const FALLBACK_ANSWER =
  "I’m not sure I have a specific answer for that. I can help with:\n\n" +
  "• Scholarships abroad for Burmese students\n" +
  "• OSSD, GED, A-Levels, IGCSE\n" +
  "• Foundation and pre-university programs\n" +
  "• Education pathways in Myanmar\n\n" +
  "Try asking in a bit more detail (e.g. “What is GED?” or “Scholarships for studying in Australia”) and I’ll do my best to help.";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// When the ONLY match is one of these topic areas, use hardcoded reply (no API). Everything else → OpenAI for specific answers.
const GENERIC_TOPIC_KEYWORDS = new Set([
  "hello", "hi", "hey", "help", "start", "what can you do",
  "thanks", "thank you", "bye", "goodbye", "ok", "okay",
  "who are you", "what are you", "robot", "bot", "counselor",
]);
function isGenericTopic(keywords: string[]): boolean {
  return keywords.length > 0 && keywords.every((k) => GENERIC_TOPIC_KEYWORDS.has(k));
}

/**
 * Returns a reply. Uses hardcoded only for short generic greetings/closings.
 * Otherwise uses OpenAI so the bot can answer the user's specific question;
 * when a topic is detected, we pass that knowledge as context so the answer is specific, not a generic block.
 */
export async function getReply(userMessage: string): Promise<string> {
  if (!userMessage || typeof userMessage !== "string") return FALLBACK_ANSWER;
  const normalized = normalize(userMessage);
  if (normalized.length === 0) return FALLBACK_ANSWER;

  const words = normalized.split(" ").filter((w) => w.length > 1);
  let bestScore = 0;
  let bestAnswer: string | null = null;
  let bestKeywords: string[] = [];
  for (const { keywords, answer } of KNOWLEDGE) {
    let score = 0;
    for (const kw of keywords) {
      if (normalized.includes(kw)) score += 1;
      for (const w of words) if (w === kw || kw.includes(w) || w.includes(kw)) score += 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answer;
      bestKeywords = keywords;
    }
  }

  // 1. Truly generic message (greetings, thanks, who are you) → hardcoded only (fast, no API)
  if (bestScore > 0 && bestAnswer && isGenericTopic(bestKeywords)) return toPlainText(bestAnswer);

  // 2. Specific or open-ended question → OpenAI (with topic context if we have a match)
  const apiKey = process.env.OPENAI_API_KEY;
  // #region agent log
  fetch('http://127.0.0.1:7832/ingest/8a067dd9-fa67-459c-9257-28e916d33083',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ffda8f'},body:JSON.stringify({sessionId:'ffda8f',location:'counselor.ts:getReply',message:'OPENAI_API_KEY check',data:{keyDefined:!!apiKey,keyLength:apiKey?.length??0,keyTrimmedLength:apiKey?.trim?.()?.length??0},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  if (apiKey?.trim()) {
    try {
      const aiReply = await getOpenAIReply(apiKey.trim(), userMessage, bestScore > 0 ? bestAnswer : undefined);
      if (aiReply) return toPlainText(aiReply);
    } catch (e) {
      console.warn("OpenAI counselor error:", (e as Error).message);
    }
  }

  // 3. No API or API failed → use matched knowledge or fallback
  if (bestScore > 0 && bestAnswer) return toPlainText(bestAnswer);
  return FALLBACK_ANSWER;
}

/** Strip Markdown bold for plain-text Messenger */
function toPlainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}

async function getOpenAIReply(
  apiKey: string,
  userMessage: string,
  referenceContext?: string | null
): Promise<string | null> {
  // #region agent log
  fetch('http://127.0.0.1:7832/ingest/8a067dd9-fa67-459c-9257-28e916d33083',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ffda8f'},body:JSON.stringify({sessionId:'ffda8f',location:'counselor.ts:getOpenAIReply',message:'entry',data:{apiKeyLength:apiKey?.length??0,startsWithSk:apiKey?.startsWith?.('sk-')??false},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
  const baseRole =
    "You are a friendly, professional education counselor for Burmese students. " +
    "Keep replies helpful, clear, and concise (suitable for Messenger). Use simple language. " +
    "Answer the user's specific question directly—do not just repeat generic info or redirect. " +
    "If the question is outside education/counseling, politely redirect to education topics.";

  const systemContent = referenceContext
    ? `${baseRole}\n\nUse the following reference information to answer the user's question. If they ask something specific (e.g. deadline, eligibility, how to apply), answer based on this. Do not say "based on the reference"—just answer naturally.\n\nReference:\n${toPlainText(referenceContext)}`
    : baseRole +
      " You help with: scholarships abroad, OSSD, GED, A-Levels, IGCSE, foundation programs, and education pathways in Myanmar.";

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userMessage },
    ],
    max_tokens: 500,
  };
  const authHeader = `Bearer ${apiKey}`;
  // #region agent log
  fetch('http://127.0.0.1:7832/ingest/8a067dd9-fa67-459c-9257-28e916d33083',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ffda8f'},body:JSON.stringify({sessionId:'ffda8f',location:'counselor.ts:beforeFetch',message:'auth header',data:{authHeaderLength:authHeader.length,startsWithBearer:authHeader.startsWith('Bearer ')},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string; code?: string };
  };
  if (!res.ok) {
    const msg = data.error?.message ?? `OpenAI ${res.status}`;
    throw new Error(msg);
  }
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}
