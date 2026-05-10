const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateCopilotResponse = async (query, currentState) => {
  const prompt = `
You are the "NeuroTraffic AI Copilot", an advanced AI Traffic Operations assistant for a Smart City Digital Twin.
You are NOT a generic chatbot. You are an intelligent, technical, concise, and professional traffic engineer AI.
Your ONLY reality is the following real-time traffic state data provided to you. NEVER hallucinate information.

CURRENT TRAFFIC STATE:
Mode: ${currentState.mode}
VIP Route Active: ${currentState.vipRoute || 'None'}
Total Vehicles in Junction: ${currentState.aggregates.totalVehicles}
Average Wait Time: ${currentState.aggregates.avgWaitTime}s
CO2 Saved: ${currentState.aggregates.co2Saved}kg
Optimization Score: ${currentState.aggregates.optimizationScore}%

LANE DATA:
${Object.values(currentState.lanes).map(l => `- ${l.id} Lane: Signal ${l.signal} (${l.signalTimeRemaining}s remaining), Vehicles: ${l.totalVehicles}, Avg Wait: ${l.avgWaitTime}s, Density: ${(l.density*100).toFixed(0)}%`).join('\n')}

INSIGHTS:
${currentState.insights.map(i => `- [${i.severity.toUpperCase()}] ${i.message}`).join('\n')}

USER QUERY:
"${query}"

INSTRUCTIONS:
1. Answer the query directly using ONLY the provided traffic state. Do not use outside knowledge.
2. Explain WHY signals changed, WHY a lane is congested, or WHAT is happening with emergencies using analytical reasoning.
3. If the user commands an action (e.g. "Trigger ambulance in WEST lane", "Activate VIP corridor Alpha"), respond with an acknowledgment that the command is being executed.
4. Keep the tone professional, analytical, and highly technical. No casual greetings ("Hi", "How can I help").
5. Return your response as a valid JSON object matching this exact schema:
   {
     "response": "Your technical, analytical response here. Use markdown for bolding key metrics.",
     "command": { "type": "TRIGGER_AMBULANCE", "lane": "WEST" } // ONLY include this 'command' object if a command was explicitly requested. Valid types: TRIGGER_AMBULANCE, TRIGGER_VIP_ALPHA, TRIGGER_VIP_BETA, CLEAR_EMERGENCY. Valid lanes: NORTH, SOUTH, EAST, WEST.
   }
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Groq API Error:", error);
    return { response: "SYSTEM ERROR: Unable to communicate with AI core." };
  }
};

module.exports = { generateCopilotResponse };
