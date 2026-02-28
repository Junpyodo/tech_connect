export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;

  try {
    // 1. Tavily 검색 (최신 데이터 수집)
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
    
    // 검색 결과 정리 및 출처(URL) 포함
    const results = searchData.results || [];
    const context = results.length > 0 
      ? results.map((r: any) => `[출처: ${r.title}](${r.url})\n내용: ${r.content}`).join("\n\n")
      : "제공된 실시간 데이터 없음";

    // 2. Gemini 호출 (엄격한 페르소나 부여)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 실리콘밸리 기술 전략가입니다. 반드시 아래 규칙을 지키세요:
              
              1. **지어내지 마세요(No Hallucination)**: [실시간 데이터]에 관련 정보가 없다면 "현재 실시간 데이터를 통해 확인된 정보가 없습니다"라고 정직하게 답하고, 일반적인 지식으로 때우지 마세요.
              2. **출처 명시**: 답변 끝에 반드시 참고한 사이트의 제목과 링크를 리스트 형태로 포함하세요.
              3. **추론 과정**: 답변 중간에 "데이터를 통해 분석한 결과, ~라는 이유로 이렇게 판단됩니다"라는 논리적 도출 과정을 짧게 언급하세요.
              
              [실시간 데이터]:
              ${context}
              
              사용자 질문: ${message}`
            }]
          }]
        })
      }
    );

    const aiData = await geminiResponse.json();

    if (aiData.error) {
      console.error("Gemini 상세 에러:", JSON.stringify(aiData.error, null, 2));
      return res.status(500).json({ error: `Gemini API 에러: ${aiData.error.message}` });
    }

    if (!aiData.candidates || aiData.candidates.length === 0) {
      throw new Error("AI 응답 생성 실패");
    }

    const answer = aiData.candidates[0].content.parts[0].text;
    res.status(200).json({ answer });

  } catch (error: any) {
    console.error("RAG 에러 발생:", error.message);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
}
