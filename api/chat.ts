export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Tavily 검색
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
    
    // Tavily 에러 체크
    if (searchData.error) {
      console.error("Tavily API 에러:", searchData.error);
    }

    const context = searchData.results?.map((r: any) => `제목: ${r.title}\n내용: ${r.content}`).join("\n\n") || "검색 결과가 없습니다.";

    // 2. Gemini 호출
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `당신은 실리콘밸리 기술 전략가입니다. 아래 데이터를 참고해 답변하세요.\n\n[데이터]:\n${context}\n\n질문: ${message}`
          }]
        }]
      })
    });

    const aiData = await geminiResponse.json();

    // 🚨 [핵심 수정] Gemini가 에러를 보냈을 때 로그에 상세 사유 출력
    if (aiData.error) {
      console.error("Gemini API 상세 에러:", JSON.stringify(aiData.error, null, 2));
      return res.status(500).json({ error: `Gemini 에러: ${aiData.error.message}` });
    }

    if (!aiData.candidates || aiData.candidates.length === 0) {
      console.error("Gemini 응답 구조 이상:", JSON.stringify(aiData, null, 2));
      throw new Error("Gemini 응답 후보(candidates)가 없습니다.");
    }

    const answer = aiData.candidates[0].content.parts[0].text;
    res.status(200).json({ answer });

  } catch (error: any) {
    console.error("RAG 에러 발생:", error.message);
    res.status(500).json({ error: error.message || '서버 에러 발생' });
  }
}
