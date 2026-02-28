export default async function handler(req, res) {
  // POST 요청이 아니면 차단 (보안)
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Tavily API: 전문 사이트(GitHub, Hacker News 등)만 타겟팅하여 검색
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: message,
        search_depth: "advanced",
        include_domains: [
          "github.com", 
          "news.ycombinator.com", 
          "crunchbase.com", 
          "techcrunch.com", 
          "adzuna.com"
        ],
        max_results: 5
      })
    });

    const searchData = await searchResponse.json();
    
    // 검색 결과에서 텍스트 데이터만 추출하여 컨텍스트 생성
    const context = searchData.results.map((r: any) => `제목: ${r.title}\n내용: ${r.content}`).join("\n\n");

    // 2. Gemini 2.0 Flash: 검색된 데이터를 '뇌'에 주입하여 답변 생성
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `당신은 실리콘밸리 기술 전략가이자 시니어 리크루터입니다. 
            반드시 아래 제공된 [실시간 전문 데이터]만을 근거로 답변하세요.
            
            [실시간 전문 데이터]:
            ${context}
            
            [답변 형식]:
            1. ## 📈 Market Trend: 현재 업계 동향 요약
            2. ## 💻 Required Tech Stack: 필요한 기술 스택 리스트
            3. ## 🚀 Related Jobs: 관련 기업 및 공고 현황
            
            사용자 질문: ${message}`
          }]
        }]
      })
    });

    const aiData = await geminiResponse.json();
    
    // 에러 핸들링: Gemini 응답이 없을 경우 대비
    if (!aiData.candidates || aiData.candidates.length === 0) {
      throw new Error("Gemini API 응답 생성 실패");
    }

    const answer = aiData.candidates[0].content.parts[0].text;

    // 3. 최종 결과 반환
    res.status(200).json({ answer });

  } catch (error) {
    console.error("RAG 에러 발생:", error);
    res.status(500).json({ error: '서버 에러가 발생했습니다. API 키를 확인해주세요.' });
  }
}
