// 执行器
export async function executePlan(plan: string[]): Promise<any> {
  let context: { promptTemplate?: string } = {};
  const results: any[] = [];

  for (const step of plan) {
    if (step === 'Step 1: Generate AI Prompt with Placeholder') {
      // Simulate generating a prompt with placeholder
      // In a real system, this might come from an LLM call or a database
      context.promptTemplate = "Write a marketing description for the {{spec}} product, highlighting its key features.";
      results.push({ step, output: `Generated Template: ${context.promptTemplate}` });
    } else if (step.startsWith('Step 2: Generate Content for Spec')) {
      const specMatch = step.match(/"(.*?)"/);
      const spec = specMatch ? specMatch[1] : 'unknown';
      
      if (context.promptTemplate) {
        // Replace placeholder with actual specification value
        const prompt = context.promptTemplate.replace(/{{spec}}/g, spec);
        
        // Simulate execution with the concrete prompt
        // Here we would call the LLM with 'prompt'
        results.push({ 
          step, 
          spec,
          promptUsed: prompt,
          output: `Generated content for ${spec} based on prompt: "${prompt}"` 
        });
      } else {
         results.push({ step, error: `No template found for spec ${spec}` });
      }
    } else {
      // Default execution
      results.push(`Executed: ${step}`);
    }
  }
  return results;
}
