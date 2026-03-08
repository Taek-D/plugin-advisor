// English descriptions for plugins (desc, longDesc only — name, tag, keywords, install stay the same)
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  omc: {
    desc: "32 specialized agents, multi-agent orchestration. Essential for complex long-term projects.",
    longDesc: "Oh My ClaudeCode (OMC) extends Claude Code into a multi-agent orchestration system. It offers 32 specialized agents and 40+ skills, automatically distributing complex tasks in parallel. Supports autopilot, ralph, ultrawork execution modes, and integrates with external AIs like Codex and Gemini.",
  },
  superpowers: {
    desc: "Quick codebase understanding & modification. Low learning curve, instant impact.",
    longDesc: "Superpowers instantly enhances Claude Code's core capabilities. It helps quickly understand existing codebases and minimizes friction in file navigation, search, and modification. The biggest advantage is the immediate impact with zero complex setup. Especially strong for scripts, data analysis, and automation tasks.",
  },
  "bkit-starter": {
    desc: "Beginner-friendly Claude Code setup guide. First project creation, learning curriculum, and auto-config generation.",
    longDesc: "bkit Starter is an onboarding tool for Claude Code beginners. It guides you step by step through creating your first project, a structured learning curriculum, auto-generating Claude Code configs for existing projects, and upgrading settings. The perfect starting point for vibe coding newcomers.",
  },
  bkit: {
    desc: "PDCA methodology-based structured workflow. Automates PRD → design → implementation → verification.",
    longDesc: "bkit introduces PDCA (Plan-Do-Check-Act) methodology to Claude Code, systematizing the development process. It connects PRD analysis, design documents, implementation, gap analysis, and completion reports into a single flow. It's a framework for designing the development process itself with AI, not just generating code.",
  },
  ralph: {
    desc: "Autonomous coding loop. Repeats until PRD completion with automatic git commits.",
    longDesc: "Ralph Loop autonomously repeats execution until Claude Code completes PRDs or task lists. Each iteration automatically performs implementation → verification → commit, leaving clean git history when done. Especially useful for repetitive tasks like CRUD, migrations, and test coverage improvements.",
  },
  taskmaster: {
    desc: "PRD-based automatic task breakdown & dependency management. Core of AI agent workflows.",
    longDesc: "Taskmaster AI automatically breaks down PRDs or requirement documents into detailed tasks and manages dependency graphs. AI determines each task's priority and complexity to suggest optimal execution order. Integrating with Claude Code enables automatic next-task recommendations and real-time progress tracking.",
  },
  "sequential-thinking": {
    desc: "Step-by-step problem decomposition for complex thinking. Powerful for architecture design and debugging.",
    longDesc: "Sequential Thinking MCP processes complex problems by breaking them into sequential thinking steps. It systematically builds hypotheses, validates, and revises at each step. Greatly improves Claude's reasoning quality for tasks requiring deep thinking like architecture design, complex bug tracking, and algorithm optimization.",
  },
  todoist: {
    desc: "Todoist integration for real-time task management. The standard for todo tracking.",
    longDesc: "Todoist MCP integrates the popular todo app Todoist with Claude Code. Add TODO items discovered during development directly to Todoist, categorize by project, and set deadlines and priorities. Convenient for managing tasks simultaneously while coding.",
  },
  linear: {
    desc: "Linear issue management integration. Automates issue creation, status changes, sprint management.",
    longDesc: "Linear MCP lets you use Linear project management directly from Claude Code. Create issues, update statuses, and manage sprints while coding. Reduces context switching by connecting development and project management into one flow for team projects.",
  },
  repomix: {
    desc: "Packs entire codebase into AI-friendly file. Context management for large projects.",
    longDesc: "Repomix packs your entire codebase into a single AI-friendly file. It enables Claude to understand large projects or legacy code all at once. Essential for tasks requiring full context: monorepos, legacy code analysis, team onboarding, code reviews.",
  },
  context7: {
    desc: "Injects latest library docs in real-time. Dramatically reduces hallucination.",
    longDesc: "Context7 is an MCP server-based plugin that injects the latest official library documentation in real-time when Claude writes code. Enables accurate usage of latest APIs for major libraries like Next.js, Supabase, Prisma, FastAPI, greatly reducing hallucination errors.",
  },
  memory: {
    desc: "Persistent memory for cross-session context. Ensures consistency in long-term projects.",
    longDesc: "Memory MCP provides Claude Code with permanent knowledge graph-based memory. It remembers project context, coding style, and business logic learned from previous conversations even after sessions end. No need to repeat explanations for long-term projects, and can be used for knowledge sharing between team members.",
  },
  playwright: {
    desc: "Browser automation & E2E testing. Powerful tool for web app QA.",
    longDesc: "Playwright MCP integrates Microsoft's Playwright with Claude Code for easy browser automation and E2E testing. Automatically verifies complete user scenarios, supports cross-browser testing, screenshot comparison, and performance measurement.",
  },
  puppeteer: {
    desc: "Chrome-based browser automation. Specialized for screenshots, PDF generation, form testing.",
    longDesc: "Puppeteer MCP integrates Google's Puppeteer with Claude Code for programmatic Chrome browser control. Supports web page screenshot capture, PDF generation, form auto-fill, network request interception. Directly utilizes Chrome DevTools Protocol for deeper Chrome-specific features.",
  },
  notion: {
    desc: "Direct Notion page/DB manipulation. Connect documentation and wiki management with code.",
    longDesc: "Notion MCP lets you directly manipulate Notion workspace from Claude Code. Create/edit pages, query databases, add comments — all within your coding flow. Especially useful for syncing development docs, meeting notes, and technical wikis with code.",
  },
  firecrawl: {
    desc: "Web scraping & data extraction automation. Essential for crawling-based services.",
    longDesc: "Firecrawl automates web data collection and scraping. Handles everything from simple HTML parsing to dynamic pages requiring JavaScript rendering. Essential for building crawling-based services like price monitoring, news collection, data pipelines.",
  },
  "brave-search": {
    desc: "Brave search engine integration. Real-time web search for latest information access.",
    longDesc: "Brave Search MCP lets you use Brave's privacy-focused search engine from Claude Code. Offers web search and local search modes with real-time access to latest information. Useful for API docs, error message searches, and tracking latest tech trends.",
  },
  exa: {
    desc: "AI-specialized semantic search. Finds most relevant info based on meaning, not keywords.",
    longDesc: "Exa MCP integrates an AI-specialized semantic search engine with Claude Code. Unlike keyword matching, meaning-based search returns the most relevant results for natural language queries. Effectively finds tech blogs, papers, code examples, and API docs to speed up development.",
  },
  tavily: {
    desc: "Search API for AI agents. Provides real-time web search and summarization simultaneously.",
    longDesc: "Tavily MCP integrates an AI agent-optimized search API with Claude Code. Unlike regular search, it auto-summarizes results and provides source URLs with confidence scores. Can be used for RAG system building, fact checking, and competitor analysis.",
  },
  perplexity: {
    desc: "AI research engine integration. Source-based answers for accurate tech investigation.",
    longDesc: "Perplexity MCP lets you use the AI research engine Perplexity from Claude Code. Provides answers with cited sources for tech questions, reflecting latest info in real-time. Especially useful for new library research, tech comparison analysis, and best practices exploration.",
  },
  postgres: {
    desc: "Direct PostgreSQL connection. Schema queries, SQL execution, data analysis.",
    longDesc: "PostgreSQL MCP lets you directly interact with PostgreSQL databases from Claude Code. Query schemas, execute SQL, analyze data — all within your coding flow. Especially useful for writing migrations, query optimization, data modeling, with safe read-only mode available.",
  },
  security: {
    desc: "Real-time security vulnerability detection. Auto-warns about SQL injection, XSS, auth issues.",
    longDesc: "Security Guidance is an official plugin that detects security vulnerabilities in real-time when Claude writes code. Automatically warns about OWASP Top 10 vulnerabilities including SQL injection, XSS, CSRF, auth bypass, sensitive data exposure. Essential for services handling auth, payments, and personal data.",
  },
  sentry: {
    desc: "Sentry error tracking integration. Real-time error analysis and automated debugging.",
    longDesc: "Sentry MCP integrates the error tracking platform Sentry with Claude Code. View production errors in real-time, analyze stack traces, and identify root causes. Automatically classifies error patterns, finds related code, and suggests fixes.",
  },
  github: {
    desc: "Full GitHub API integration. Automates PRs, issues, code reviews, repo management.",
    longDesc: "GitHub MCP makes the entire GitHub API available from Claude Code. Create/review PRs, manage issues, search files, manage branches, create releases — handle all GitHub features within your coding flow. Essential for open source project management or team development workflows.",
  },
  slack: {
    desc: "Slack channel/message integration. Automates notifications, channel search, team communication.",
    longDesc: "Slack MCP lets you use Slack workspace directly from Claude Code. Supports reading/writing channel messages, thread management, user search, file sharing. Integrates team communication into the development process with automatic deploy notifications, error reports, and code review requests.",
  },
  filesystem: {
    desc: "Safe filesystem access. Directory navigation, file read/write, search.",
    longDesc: "Filesystem MCP provides safe filesystem access. Uses sandbox mode, operating only within designated directories for security. Supports file read/write, directory creation, file search, metadata queries. Useful for automation tasks with heavy local file processing.",
  },
  git: {
    desc: "Direct Git repo manipulation. Automates commits, branches, diff, log management.",
    longDesc: "Git MCP lets you programmatically manipulate Git repositories from Claude Code. Supports all core Git features: commit creation, branch management, diff viewing, log searching. Unlike GitHub MCP, works with local Git repos so it functions offline and suits complex Git automation.",
  },
  supabase: {
    desc: "Full Supabase BaaS integration. Manages DB, Auth, Storage, Edge Functions.",
    longDesc: "Supabase MCP fully integrates the open-source BaaS platform Supabase with Claude Code. Handle database migrations, auth setup, storage management, Edge Functions deployment — all within your coding flow. Rapidly builds backends for full-stack app development.",
  },
  figma: {
    desc: "Direct Figma design data access. Automates design-to-code conversion.",
    longDesc: "Figma MCP lets you directly access Figma design data from Claude Code. Reads layout, colors, typography, component structure from design files for accurate code conversion. Essential for automating designer-developer handoff and maintaining design system consistency.",
  },
  uiux: {
    desc: "Design systems, components, accessibility. Elevates frontend quality.",
    longDesc: "UI/UX Pro Max is a plugin specialized for frontend development. Supports design system design, component structuring, and accessibility (a11y) review. Provides deep understanding of major frameworks like React, Vue, Svelte and style systems like Tailwind, shadcn/ui. Essential when you need to quickly elevate UI quality and user experience.",
  },
  docker: {
    desc: "Docker container management. Build, run, view logs directly from IDE.",
    longDesc: "Docker MCP lets you manage Docker containers directly from Claude Code. Handle image builds, container start/stop, log viewing, docker-compose management within your coding flow. Especially useful for dev environment setup, microservice testing, and CI/CD pipeline debugging.",
  },
  vercel: {
    desc: "Vercel deployment automation. Project management, env vars, domain settings.",
    longDesc: "Vercel MCP integrates the Vercel deployment platform with Claude Code. Handle project deployments, env var management, domain settings, deployment log viewing within your coding flow. Automates deployment of frameworks like Next.js, SvelteKit, and creates per-PR preview environments.",
  },
  cloudflare: {
    desc: "Cloudflare Workers, KV, R2, D1 management. Essential for edge computing development.",
    longDesc: "Cloudflare MCP lets you manage Cloudflare's edge platform directly from Claude Code. Handle Workers deployment, KV storage, R2 object storage, D1 SQLite database — the full Cloudflare stack. Essential for quickly building high-performance global services running at the edge.",
  },
};

export const reasonsEn: Record<string, string> = {
  omc: "Complex multi-agent tasks detected. 32 specialized agents process in parallel to accelerate development.",
  superpowers: "Script or automation tasks included. Optimized for quickly understanding and modifying existing code.",
  "bkit-starter": "Perfect for Claude Code beginners. Guides you step by step from first project setup to learning.",
  bkit: "Project needs PRD or design-based development. PDCA workflow manages from planning to verification systematically.",
  ralph: "Project has many repetitive implementation tasks. Auto-loops until PRD completion with clean git history.",
  taskmaster: "Project needs task decomposition and management. Auto-breaks PRDs into sub-tasks and tracks dependencies.",
  "sequential-thinking": "Complex reasoning or design needed. Step-by-step thinking improves architecture quality.",
  todoist: "Project includes task management. Todoist integration enables real-time dev task tracking.",
  linear: "Team project management needed. Linear issue tracking connects development and project management.",
  repomix: "Large codebase or legacy analysis needed. Packs entire code into AI-friendly format for better context understanding.",
  context7: "Uses many external libraries/APIs. Injects latest official docs in real-time to reduce hallucination errors.",
  memory: "Long-term project where cross-session context is important. Persistent memory eliminates repeated explanations.",
  playwright: "E2E testing or browser automation needed. Automates web app quality verification.",
  puppeteer: "Chrome browser automation needed. Specialized for screenshots, PDF generation, and form testing.",
  notion: "Documentation and knowledge management are important. Notion integration syncs dev docs with code.",
  firecrawl: "Web data collection is a core feature. Simplifies scraping automation implementation.",
  "brave-search": "Real-time web search needed. Brave search provides fast access to latest information.",
  exa: "AI-based semantic search needed. Finds most relevant tech docs based on meaning.",
  tavily: "Search result auto-summarization needed. Provides AI agent-optimized search API.",
  perplexity: "Tech research and comparison analysis needed. Provides accurate investigation with source-based answers.",
  postgres: "PostgreSQL database work included. Directly query schemas and execute SQL.",
  security: "Auth, payments, or personal data handling included. Real-time vulnerability detection maintains code safety.",
  sentry: "Error tracking and monitoring needed. Sentry integration analyzes production errors in real-time.",
  github: "GitHub-based collaboration is key. Handle PRs, issues, code reviews within coding flow.",
  slack: "Team communication is important. Slack integration automates deploy notifications and collaboration.",
  filesystem: "Heavy local file processing. Safely handle filesystem within sandbox.",
  git: "Git version control is core. Programmatically manipulate local repositories.",
  supabase: "BaaS-based full-stack development. Quickly build DB, auth, storage with Supabase.",
  figma: "Design-to-code conversion needed. Reads Figma design data directly for accurate implementation.",
  uiux: "Frontend UI development is core. Elevates component quality and design consistency.",
  docker: "Container-based development needed. Docker manages dev environments and deployments consistently.",
  vercel: "Vercel deployment needed. One-click deploy and manage frontend apps.",
  cloudflare: "Edge computing or global deployment needed. Build high-performance services with Cloudflare Workers.",
};
