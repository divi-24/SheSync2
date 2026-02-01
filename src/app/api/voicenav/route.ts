import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function POST(req: Request) {
  try {
    if (!GEMINI_KEY) {
      console.error('Missing Gemini key on server');
      return NextResponse.json({ error: 'server_missing_gemini_key' }, { status: 500 });
    }

    const { command } = await req.json();
    if (!command) return NextResponse.json({ error: 'No command' }, { status: 400 });

  const prompt = `You are the navigation parser for SheSync, a women's health and wellness web app. Use the exact canonical routes listed below.

Available canonical routes (choose ONLY one exact path or respond NO_ROUTE):
- /                    (Home)
- /blogs               (Education & articles)
- /wellnessproducts    (Wellness product storefront)
- /periodproducts      (Period products: pads, tampons, cups)
- /tracker             (Track your cycles and health)
- /ovulationcalc       (Ovulation & fertile day calculator)
- /pcos                (PCOS information & screening)
- /consultation        (Book expert consultations)
- /symptomsanalyzer    (AI symptoms analyzer / HealthLens)
- /chatbot             (Eve — AI health assistant / chat)
- /voice-agent         (Voice-based assistant)
- /parent              (Parent's dashboard)
- /partner             (Partner's dashboard)
- /forums              (Community forums)
- /bliss               (Wellness games and activities)
- /login               (Log in)
- /signup              (Sign up)

Instructions (strict):
1) You MUST respond with EXACTLY ONE token and NOTHING ELSE: either one of the canonical routes above (for example: "/blogs") OR the exact token "NO_ROUTE" (uppercase, without quotes) if there is no clear, specific match.
2) Do NOT return any extra text, explanation, punctuation, or JSON—only the single route string or NO_ROUTE.
3) Mapping hints: product mentions (pad, cup, tampon, buy pads/tampons/cup) -> /periodproducts. Mentions of "wellness product" or "shop" -> /wellnessproducts. Mentions of Eve, assistant, "talk to Eve" -> /chatbot. Mentions of voice assistant or "voice agent" -> /voice-agent. Mentions of games, mood map, quizzes, memory, hangman -> /bliss. Mentions of ovulation, fertile, period prediction -> /ovulationcalc. Mentions of tracking cycles, period, cycle -> /tracker. Mentions of PCOS or pcos screening -> /pcos. Mentions of booking a doctor or consultation -> /consultation. Mentions of parent/child dashboard -> /parent. Mentions of partner dashboard -> /partner. Mentions of community, forum, discussions -> /forums.
4) If user input is ambiguous, generic, or doesn't clearly map to one canonical page, respond with NO_ROUTE.

Examples:
- "open blogs" -> /blogs
- "show me the shop" -> /wellnessproducts
- "buy pads" -> /periodproducts
- "open my tracker" -> /tracker
- "calculate my ovulation" -> /ovulationcalc
- "i want to read about pcos" -> /pcos
- "book a consultation" -> /consultation
- "talk to eve" -> /chatbot
- "open voice agent" -> /voice-agent
- "open parent's dashboard" -> /parent
- "open forums" -> /forums

User command: "${command}"
`;

    // Use the project's installed GoogleGenerativeAI SDK for a reliable call
    try {
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  // Use a newer flash model as requested
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
      const responseText = result?.response?.text ? result.response.text() : '';

      const raw = (responseText || '').trim();
      // Remove surrounding quotes or punctuation
      const cleaned = raw.replace(/^\s*["'`]*\s*/, '').replace(/\s*["'`.,!;:?]*\s*$/, '');

      const validRoutes = ['/', '/tracker', '/dashboard', '/bliss', '/blogs', '/consultation', '/contact', '/signup', '/login', '/periodproducts', '/pcos', '/chatbot', '/voice-agent'];

      // If model explicitly returned NO_ROUTE, honor it
      if (/\bNO_ROUTE\b/i.test(cleaned)) {
        return NextResponse.json({ route: null, notFound: true });
      }

      // If the model returned an exact valid route, use it
      if (validRoutes.includes(cleaned)) {
        return NextResponse.json({ route: cleaned });
      }

      // Otherwise try to find one of the valid routes inside the response text
      const lower = cleaned.toLowerCase();
      for (const r of validRoutes) {
        if (r !== '/' && lower.includes(r.replace('/', ''))) {
          return NextResponse.json({ route: r });
        }
      }

      // No clear match -> follow the requested behavior and return NO_ROUTE
      return NextResponse.json({ route: null, notFound: true });
    } catch (sdkErr) {
      console.error('Gemini SDK error', sdkErr);
      return NextResponse.json({ error: 'gemini_sdk_error', detail: String(sdkErr).slice(0, 200) }, { status: 502 });
    }
  } catch (err) {
    console.error('voicenav error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
