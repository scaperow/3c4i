// 任务规划器
export function planTask(task: string): string[] {
  // Check for product task with specifications
  // Format expectation: "Product task with specs: [A, B]" or "商品任务 规格: [A, B]"
  if (task.includes('product') || task.includes('商品')) {
    const specsMatch = task.match(/\[(.*?)\]/);
    if (specsMatch) {
      const specs = specsMatch[1].split(/,|，/).map(s => s.trim()).filter(s => s);
      if (specs.length > 0) {
        const steps = ['Step 1: Generate AI Prompt with Placeholder'];
        specs.forEach(spec => {
          steps.push(`Step 2: Generate Content for Spec "${spec}" using Placeholder`);
        });
        return steps;
      }
    }
  }

  // Default simple planning
  return [`Step 1 for ${task}`, `Step 2 for ${task}`];
}
