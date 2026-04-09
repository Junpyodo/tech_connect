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
  import { supabase } from '../lib/supabase';

  const saveChat = async (question: string, answer: string) => {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([
      { user_question: question, ai_response: answer }
    ]);

  if (error) console.error('저장 실패:', error);
  else console.log('DB 저장 완료:', data);
};
}
