// Agent 基类
import { AgentConfig, Agent } from '../types';

export class AgentBase implements Agent {
  config: AgentConfig;
  constructor(config: AgentConfig) {
    this.config = config;
  }
  async plan(task: string): Promise<string[]> {
    // 任务规划逻辑（示例）
    return [`Plan for: ${task}`];
  }
  async execute(plan: string[]): Promise<any> {
    // 执行逻辑（示例）
    return { result: `Executed: ${plan.join(', ')}` };
  }
}
