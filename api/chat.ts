// api/chat.ts 수정본

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Tavily 검색 (이 부분은 이전과 동일)
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: message,
        search_depth: "advanced",
        include_domains: ["github.com", "news.ycombinator.com", "crunchbase.com", "techcrunch.com", "adzuna.com"],
        max_results: 5
      })
    });

    const searchData = await searchResponse.json();
    const results = searchData.results || [];
    const context = results.length > 0 
      ? results.map((r: any) => `[출처: ${r.title}](${r.url})\n내용: ${r.content}`).join("\n\n")
      : "제공된 실시간 데이터 없음";

    // 2. Gemini 호출 (공식 문서 v1 규격 적용)
    // 주소 형식: https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 실리콘밸리 기술 전략가입니다. 아래 데이터를 참고해 답변하세요.\n\n[데이터]:\n${context}\n\n질문: ${message}\n\n반드시 데이터에 기반하여 답변하고, 출처 링크를 포함하세요.`
            }]
          }]
        })
      }
    );

    const aiData = await geminiResponse.json();

    // 에러 발생 시 로그 출력
    if (aiData.error) {
      console.error("Gemini 상세 에러:", JSON.stringify(aiData.error, null, 2));
      return res.status(500).json({ error: aiData.error.message });
    }

    const answer = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성할 수 없습니다.";
    res.status(200).json({ answer });

  } catch (error: any) {
    console.error("RAG 에러 발생:", error.message);
    res.status(500).json({ error: '서버 에러 발생' });
  }
}
