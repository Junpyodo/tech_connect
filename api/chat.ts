export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Search Latest News via Tavily
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: message,
        search_depth: "advanced",
        max_results: 5
      })
    });

    const searchData = await searchResponse.json();
    const results = searchData.results || [];
    
    // Formatting context with Source URLs
    const context = results.length > 0 
      ? results.map((r: any) => `Source: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join("\n\n")
      : "No real-time data found.";

    // 2. Call Groq API (Using Llama 3 for high speed and reliability)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // High-performance model
        messages: [
          {
            role: "system",
            content: `You are a Silicon Valley Tech Strategist. 
            Your goal is to provide expert analysis based ONLY on the provided [Real-time Data].
            
            Strict Rules:
            1. Language:Your basic language is English.
            2. Evidence-Based: If the information is not in the data, state that you don't know. Do not hallucinate.
            3. Reasoning: Explain your logical process ("Based on the surge in X, I conclude Y...").
            4. Citations: List the source titles and URLs at the end of your response.`
          },
          {
            role: "user",
            content: `[Real-time Data]:\n${context}\n\nUser Question: ${message}`
          }
        ],
        temperature: 0.5
      })
    });

    const aiData = await groqResponse.json();
    const answer = aiData.choices[0]?.message?.content || "No response from AI";
    
    res.status(200).json({ 
    answer: answer, 
    text: answer, 
    message: answer 
  });

  } catch (error: any) {
    console.error("System Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
  #asdf
 import { createClient } from '@supabase/supabase-js';

// 1. 서버용 Supabase 클라이언트 설정
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_API_KEY || ''
);

// 간단한 회사명 추출 함수 (추가)
const extractCompany = (title: string) => {
  return title.split(/[|:-]/)[0].trim(); 
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Tavily Search (실시간 검색)
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: message,
        search_depth: "advanced",
        max_results: 5
      })
    });

    const searchData = await searchResponse.json();
    const results = searchData.results || [];

    // ---------------------------------------------------------
    // 2. [자동 데이터 축적 로직] 유의미한 정보 DB 저장
    // 영어 키워드 위주로 필터링하여 글로벌 데이터 수집
    // ---------------------------------------------------------
    if (results.length > 0) {
      const filteredResults = results.filter((r: any) => 
        /hiring|recruitment|job|career|admission|requirement|qualification|candidate/i.test(r.title + r.content)
      );

      if (filteredResults.length > 0) {
        await supabase.from('market_insights').insert(
          filteredResults.map((r: any) => ({
            company_name: extractCompany(r.title),
            role_category: 'Global Tech/Healthcare', // 영어 기반 카테고리
            requirements: r.content.substring(0, 1000), // 더 넉넉하게 저장
            source_url: r.url,
            raw_data: r
          }))
        );
      }
    }

    // 3. Groq AI 답변 생성용 컨텍스트 조립
    const context = results.length > 0 
      ? results.map((r: any) => `Source: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join("\n\n")
      : "No real-time data found.";

    // 4. Groq API 호출 (생략 - 기존 코드 유지)
    // ... (중략) ...

    // 5. 최종 답변 반환 전 대화 기록 저장 (Optional)
    // await supabase.from('chat_history').insert([{ user_question: message, ai_response: finalAiResponse }]);

    res.status(200).json({ /* AI 응답 결과 */ });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
