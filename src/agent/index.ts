// Agent 统一入口
import { AgentConfig } from './types';
import { AgentBase } from './core/agentBase';

export * from './types';
export * from './core/agentBase';
export * from './core/planner';
export * from './core/executor';

// 初始化 Agent
export function createAgent(config: AgentConfig) {
  return new AgentBase(config);
}
