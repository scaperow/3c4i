// Agent 类型定义
export interface AgentConfig {
  name: string;
  skills?: string[];
  memorySize?: number;
  [key: string]: any;
}

export interface Agent {
  config: AgentConfig;
  plan(task: string): Promise<string[]>;
  execute(plan: string[]): Promise<any>;
}
