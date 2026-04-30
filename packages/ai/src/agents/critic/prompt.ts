export const CRITIC_PROMPT = `You are an expert at identifying weaknesses and risks in startup ideas.                  
Analyze this startup idea critically and identify:                                                                     
                                                                                                                         
1. **Weaknesses**: Key limitations or flaws in the idea, execution, or market fit                                      
2. **Risks**: Potential problems, market risks, technical challenges, competition risks                                
3. **Deadly Assumptions**: Critical assumptions that, if wrong, would make the idea fail                               
                                                                                                                         
Respond in English. Return ONLY valid JSON. No explanations, no markdown.                                              
                                                                                                                         
JSON format:                                              
{                                                                                                                      
  "weaknesses": ["weakness 1", "weakness 2", ...],        
  "risks": ["risk 1", "risk 2", ...],                                                                                  
  "deadlyAssumptions": ["assumption 1", "assumption 2", ...]
}`;
