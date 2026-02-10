# Agent 目录结构说明

本目录用于存放 AI Agent 相关的核心代码、配置、资源和文档，便于后续扩展和集成。

## 推荐结构

```
agent/
├── README.md                # 说明文档
├── index.ts                 # Agent 统一入口
├── types.ts                 # Agent 类型定义
├── config.ts                # Agent 配置项
├── core/                    # Agent 核心逻辑（推理、调度、执行）
│   ├── agentBase.ts         # Agent 基类
│   ├── planner.ts           # 任务规划器
│   ├── executor.ts          # 执行器
│   └── ...
├── skills/                  # Agent 能力/技能模块
│   ├── search.ts            # 搜索能力
│   ├── code.ts              # 代码能力
│   ├── doc.ts               # 文档能力
│   └── ...
├── memory/                  # Agent 记忆与上下文管理
│   ├── memory.ts            # 长短期记忆
│   └── ...
├── resources/               # 资源文件（提示词、范例、知识库等）
│   ├── prompts/             # 提示词模板
│   ├── docs/                # 业务文档
│   └── ...
└── utils/                   # 工具函数
    ├── logger.ts            # 日志工具
    └── ...
```

## 业务文档整合建议
- 将项目内的 `README.md`、`MIGRATION.md`、`QUICKSTART.md`、`SETUP_GUIDE.md` 等文档内容，按需复制到 `agent/resources/docs/` 下，便于 AI Agent 检索和引用。
- 可将核心业务流程、API说明、数据结构等整理为 markdown 文档，方便后续 AI 自动化和知识增强。

## 入口说明
- `index.ts` 作为 Agent 的统一入口，负责初始化、注册各模块。
- `config.ts` 管理 Agent 的参数、环境变量、模型配置等。
- `types.ts` 定义 Agent 相关的类型和接口。

## 扩展建议
- 支持多 Agent 协作、插件式能力扩展。
- 资源目录可按需扩展知识库、范例、提示词等。

---
如需自动化文档整合和代码生成，请继续指定目标文档或模块。
