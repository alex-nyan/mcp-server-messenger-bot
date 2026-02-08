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

/**
 * Returns a reply from the knowledge base based on keyword matching.
 * Optionally uses OpenAI if OPENAI_API_KEY is set (and model is available).
 */
export async function getReply(userMessage: string): Promise<string> {
  if (!userMessage || typeof userMessage !== "string") return FALLBACK_ANSWER;
  const normalized = normalize(userMessage);
  if (normalized.length === 0) return FALLBACK_ANSWER;

  // Optional: use OpenAI for richer answers if key is set
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const aiReply = await getOpenAIReply(apiKey, userMessage);
      if (aiReply) return toPlainText(aiReply);
    } catch (e) {
      console.warn("OpenAI counselor fallback:", (e as Error).message);
    }
  }

  // Score each knowledge entry by keyword matches
  let bestScore = 0;
  let bestAnswer = FALLBACK_ANSWER;
  const words = normalized.split(" ").filter((w) => w.length > 1);
  for (const { keywords, answer } of KNOWLEDGE) {
    let score = 0;
    for (const kw of keywords) {
      if (normalized.includes(kw)) score += 1;
      for (const w of words) if (w === kw || kw.includes(w) || w.includes(kw)) score += 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answer;
    }
  }
  return toPlainText(bestAnswer);
}

/** Strip Markdown bold for plain-text Messenger */
function toPlainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}

async function getOpenAIReply(apiKey: string, userMessage: string): Promise<string | null> {
  const systemPrompt =
    "You are a friendly, professional education counselor for Burmese students. " +
    "You help with: scholarships abroad, OSSD, GED, A-Levels, IGCSE, foundation programs, and education pathways in Myanmar. " +
    "Keep replies helpful, clear, and concise (suitable for Messenger). Use simple language. " +
    "If the question is outside education/counseling, politely redirect to education topics.";
  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 500,
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}
