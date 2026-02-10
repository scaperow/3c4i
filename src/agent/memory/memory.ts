// Agent 记忆模块
export class AgentMemory {
  private memory: string[] = [];
  add(item: string) {
    this.memory.push(item);
  }
  getAll(): string[] {
    return this.memory;
  }
}
