// English descriptions for plugins (desc, longDesc only — name, tag, keywords, install stay the same)
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  omc: {
    desc: "32 specialized agents, team-based multi-agent orchestration. Essential for complex long-term projects.",
    longDesc: "Oh My ClaudeCode (OMC) extends Claude Code into a team-based multi-agent orchestration system. It offers 32 specialized agents and 40+ skills, with Team mode (team-plan → team-prd → team-exec → team-verify → team-fix pipeline) as the canonical orchestration surface. Supports autopilot, ralph, and ultrawork execution modes. Integrates with Codex and Gemini via tmux CLI workers for parallel multi-AI collaboration. Smart model routing reduces token costs by 30–50%.",
  },
  superpowers: {
    desc: "Quick codebase understanding & modification. Low learning curve, instant impact.",
    longDesc: "Superpowers instantly enhances Claude Code's core capabilities. It helps quickly understand existing codebases and minimizes friction in file navigation, search, and modification. The biggest advantage is the immediate impact with zero complex setup. Especially strong for scripts, data analysis, and automation tasks.",
  },
  "agency-agents": {
    desc: "90+ specialist AI agents across engineering, design, marketing, PM, testing, support, and more. Great when you want to split work by role like a real team.",
    longDesc: "The Agency is a curated collection of 90+ specialist AI agents you can copy directly into Claude Code's agents directory. It spans 10+ departments: engineering (frontend, backend, mobile, AI, DevOps), design, paid media, marketing, product, project management, testing, support, spatial computing, and more. Each agent has a unique persona and domain expertise, enabling far deeper role specialization than a generic prompt. The recommended Claude Code install is to copy agent files into ~/.claude/agents/.",
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
    longDesc: "Ralph Loop autonomously repeats execution until Claude Code completes PRDs or task lists. Each iteration automatically performs implementation → verification → commit, leaving clean git history when done. Especially useful for repetitive tasks like CRUD, migrations, and test coverage improvements. Note: the GitHub repository (haizelabs/ralph-wiggum) could not be verified as of 2026-03-11 — confirm availability before installing.",
  },
  taskmaster: {
    desc: "PRD-based automatic task breakdown & dependency management. Core of AI agent workflows.",
    longDesc: "Taskmaster AI automatically breaks down PRDs or requirement documents into detailed tasks and manages dependency graphs. AI determines each task's priority and complexity to suggest optimal execution order. Integrating with Claude Code enables automatic next-task recommendations and real-time progress tracking.",
  },
  gsd: {
    desc: "A spec-driven workflow system focused on roadmap execution and context quality over long builds.",
    longDesc: "Get Shit Done (GSD) is a workflow system for Claude Code, Codex, and similar runtimes that pushes spec-driven development from project questions to execution and verification. It helps reduce context drift by organizing requirements, roadmap phases, and execution checkpoints into a repeatable flow. It fits especially well when you are building against PRDs, milestones, and longer-term delivery plans.",
  },
  fireauto: {
    desc: "A command-driven Claude Code automation pack for SEO, security, PRD writing, UI upgrades, and launch prep.",
    longDesc: "fireauto bundles repeated Claude Code workflows into ready-made commands. It can help with first-time setup, planning, Reddit-style market research, SEO checks, security reviews, design improvements, and looped execution. It is especially useful for solo builders who want a more practical command layer around service launch work.",
  },
  "sequential-thinking": {
    desc: "Step-by-step problem decomposition with dynamic revision and branching. Powerful for architecture design and complex reasoning.",
    longDesc: "Sequential Thinking MCP is an official MCP server that breaks complex problems into sequential thinking steps. It supports dynamic thought flows including revision of previous steps, branching into alternative reasoning paths, and adjusting the total thought count as understanding deepens. Even when the full problem scope isn't clear upfront, it can adapt step by step. Especially strong for architecture design, complex bug tracking, and planning tasks that require deep thinking and mid-course corrections.",
  },
  todoist: {
    desc: "Todoist integration for natural language task management. Create, search, update, complete, and delete.",
    longDesc: "Todoist MCP integrates the popular todo app Todoist with Claude Code. It provides 5 tools: create tasks (with title, description, due date, priority), search/filter tasks (by date, priority, project), update tasks (find by name then modify attributes), complete tasks, and delete tasks — all via natural language. Requires a TODOIST_API_TOKEN environment variable.",
  },
  linear: {
    desc: "Linear issue management integration. 5 tools for creating, searching, updating issues and adding comments.",
    longDesc: "Linear MCP lets you use Linear project management directly from Claude Code. It provides 5 tools: create_issue, update_issue, search_issues, get_user_issues, and add_comment, plus MCP resources for viewing issues, teams, and users. Requires a LINEAR_API_KEY environment variable. Note: this npm package (jerhadf) is deprecated — the official Linear remote MCP (mcp.linear.app/sse) is recommended for new setups.",
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
    desc: "Persistent knowledge graph memory for cross-session context. Ensures consistency in long-term projects.",
    longDesc: "Memory MCP provides Claude Code with permanent knowledge graph-based memory. You can create entities (people, organizations, events), define typed relations between them, and attach discrete observations to each entity. Tools include create_entities, create_relations, add_observations, delete_entities, delete_relations, read_graph, search_nodes, and open_nodes. No need to repeat explanations for long-term projects — Claude remembers project context, coding style, and business logic across sessions.",
  },
  playwright: {
    desc: "Browser automation & E2E testing. Powerful tool for web app QA.",
    longDesc: "Playwright MCP integrates Microsoft's Playwright with Claude Code for easy browser automation and E2E testing. Automatically verifies complete user scenarios, supports cross-browser testing, screenshot comparison, and performance measurement.",
  },
  puppeteer: {
    desc: "Chrome-based browser automation. Navigate pages, capture screenshots, fill forms, and execute JavaScript.",
    longDesc: "Puppeteer MCP integrates Google's Puppeteer with Claude Code for programmatic Chrome browser control. Provides tools for navigation, screenshot capture, element interaction (click, hover, fill, select), and JavaScript execution. Console logs and screenshots are exposed as MCP resources so Claude can directly inspect them. Choose Puppeteer for Chrome-specific automation, or Playwright for cross-browser E2E testing.",
  },
  notion: {
    desc: "Direct Notion page/data source manipulation. Connect documentation and wiki management with code.",
    longDesc: "Notion MCP lets you directly manipulate Notion workspace from Claude Code via 22 tools. Create/edit pages, query and create data sources (databases), add comments, edit blocks — all within your coding flow. Requires a NOTION_TOKEN environment variable. Especially useful for syncing development docs, meeting notes, and technical wikis with code.",
  },
  firecrawl: {
    desc: "Web scraping & data extraction automation. Essential for crawling-based services.",
    longDesc: "Firecrawl MCP automates web data collection and scraping via 14 tools: single-page scrape, batch scrape, site crawl, URL mapping, web search, AI-powered structured extraction, autonomous research agent, and cloud browser sessions. Requires a FIRECRAWL_API_KEY environment variable. Essential for price monitoring, news collection, and data pipelines.",
  },
  "brave-search": {
    desc: "Brave Search API integration. Supports both web search and local business search.",
    longDesc: "Brave Search MCP lets you use Brave's privacy-focused search engine from Claude Code. Provides two tools: web search (brave_web_search) with pagination and freshness filtering, and local business search (brave_local_search) that automatically falls back to web search when no local results are found. Requires a Brave Search API key (free tier: 2,000 queries/month). Useful for API docs, error message searches, and tracking latest tech trends.",
  },
  exa: {
    desc: "AI-specialized semantic search. Web, code, and company research via meaning-based search.",
    longDesc: "Exa MCP connects Claude Code to a remote semantic search server (mcp.exa.ai). It provides three default tools: web_search_exa (general web search), get_code_context_exa (code examples, GitHub, Stack Overflow, docs), and company_research_exa (business info and news). Advanced tools like deep search and people search are also available. Basic usage requires no API key.",
  },
  tavily: {
    desc: "Search API for AI agents. Web search, extraction, mapping, and crawling in one.",
    longDesc: "Tavily MCP connects Claude Code to a remote AI agent-optimized search server (mcp.tavily.com). It provides four tools: tavily-search (web search with auto-summarization), tavily-extract (structured content extraction from web pages), tavily-map (site URL mapping), and tavily-crawl (systematic site crawling). Requires a TAVILY_API_KEY. Useful for RAG systems, fact checking, and competitor analysis.",
  },
  perplexity: {
    desc: "AI research engine integration. Web search, deep research, and reasoning via 4 dedicated tools.",
    longDesc: "Perplexity MCP connects Claude Code to the Perplexity AI research platform. It provides 4 tools: perplexity_search (ranked web search results), perplexity_ask (conversational AI with real-time web search via sonar-pro), perplexity_research (deep comprehensive research via sonar-deep-research), and perplexity_reason (advanced reasoning via sonar-reasoning-pro). Requires a PERPLEXITY_API_KEY environment variable. Especially useful for new library research, tech comparison analysis, and complex analytical tasks.",
  },
  postgres: {
    desc: "Read-only PostgreSQL access. Schema inspection and safe SQL query execution.",
    longDesc: "PostgreSQL MCP provides read-only access to PostgreSQL databases from Claude Code. All queries run inside a READ ONLY transaction for safety — write operations are not supported. The query tool executes any SQL statement, and each table's schema (column names and types) is automatically exposed as an MCP resource at postgres://<host>/<table>/schema. Useful for pre-migration schema review, query optimization, and data analysis. Requires a PostgreSQL connection string as an argument.",
  },
  security: {
    desc: "Real-time security vulnerability detection. Auto-warns about SQL injection, XSS, auth issues.",
    longDesc: "Security Guidance is an official plugin that detects security vulnerabilities in real-time when Claude writes code. Automatically warns about OWASP Top 10 vulnerabilities including SQL injection, XSS, CSRF, auth bypass, sensitive data exposure. Essential for services handling auth, payments, and personal data.",
  },
  sentry: {
    desc: "Sentry error tracking integration. Issue search, event analysis, release management, and AI-powered error diagnosis.",
    longDesc: "Sentry MCP integrates the error tracking platform Sentry with Claude Code. It provides tools for issue search and detail retrieval, event and stack trace analysis, attachment viewing, and management of releases, teams, projects, and DSNs. The AI-powered Seer analysis can automatically diagnose error root causes (requires LLM provider config). The recommended install is via the Claude Code plugin marketplace. For stdio mode, a SENTRY_ACCESS_TOKEN is required.",
  },
  github: {
    desc: "Full GitHub API integration. 26 tools for files, repos, issues, PRs, branches, and search.",
    longDesc: "GitHub MCP makes the GitHub API available directly from Claude Code. It provides 26 tools: create/update/read files, create/fork repositories, create/update/comment on issues, create/review/merge pull requests, manage branches, and search code, issues, and users. Requires a GITHUB_PERSONAL_ACCESS_TOKEN environment variable. Note: this server now lives in modelcontextprotocol/servers-archived; active development has moved to github/github-mcp-server.",
  },
  slack: {
    desc: "Slack channel/message integration. 8 tools for messaging, threads, reactions, and user profiles.",
    longDesc: "Slack MCP lets you use your Slack workspace directly from Claude Code. It provides 8 tools: list channels, post messages, reply to threads, add emoji reactions, get channel history, get thread replies, list users, and get user profiles. Requires two environment variables: SLACK_BOT_TOKEN (starts with xoxb-) and SLACK_TEAM_ID. Well suited for automating deploy notifications, error reports, and code review requests to Slack.",
  },
  filesystem: {
    desc: "Sandboxed filesystem access within allowed directories. Read, write, edit, search, and move files.",
    longDesc: "Filesystem MCP provides safe filesystem access by operating exclusively within designated allowed directories. It supports reading files (text, multi-file), writing and editing files (pattern-based partial edits), creating and navigating directories, viewing directory trees, moving files, and searching by name or content. Supports the MCP Roots protocol so allowed directories can be updated dynamically at runtime. At least one allowed directory path must be provided as an argument.",
  },
  git: {
    desc: "Local Git repo manipulation via Python/uvx. Automates commits, branches, diff, staging, and log.",
    longDesc: "Git MCP is a Python-based server that lets you programmatically manipulate local Git repositories from Claude Code. It provides 12 tools: git_status, git_diff (staged/unstaged), git_commit, git_add, git_reset, git_log (with date filtering), git_create_branch, git_checkout, git_show, git_branch, and more. Unlike GitHub MCP, it works directly with local repos so it functions offline. Requires Python or uvx (uv) to be installed. Install via: claude mcp add git -- uvx mcp-server-git --repository /path/to/repo",
  },
  supabase: {
    desc: "Full Supabase BaaS integration. Manages DB, Auth, Storage, Edge Functions.",
    longDesc: "Supabase MCP fully integrates the open-source BaaS platform Supabase with Claude Code. Handle database migrations, auth setup, storage management, Edge Functions deployment — all within your coding flow. Rapidly builds backends for full-stack app development.",
  },
  figma: {
    desc: "Official Figma remote MCP. Design-to-code conversion, variable/style token extraction, and layer metadata.",
    longDesc: "Figma MCP is an official remote MCP server hosted by Figma at mcp.figma.com. Install via the Claude Code plugin marketplace (recommended) or connect manually via HTTP transport. Provides tools: get_design_context (design → React+Tailwind code), get_variable_defs (color/spacing token extraction), get_metadata (layer structure), get_screenshot (visual reference), get_figjam and generate_diagram (FigJam diagrams from Mermaid syntax). Free plan users are limited to 6 tool calls/month. Dev/Full seat holders on Professional, Organization, or Enterprise plans have higher rate limits. No API key required — authentication is via Figma OAuth through mcp.figma.com.",
  },
  uiux: {
    desc: "Design systems, components, accessibility. Elevates frontend quality.",
    longDesc: "UI/UX Pro Max is a prompt-based AI skill specialized for frontend development. It provides design system generation (161 reasoning rules), 67 UI styles, component structuring, and accessibility (a11y) review. Supports major frameworks like React, Vue, Svelte and style systems like Tailwind, shadcn/ui. Note: this is a PromptX/Codex skill, not an MCP server — no official MCP repository exists.",
  },
  docker: {
    desc: "Docker MCP Gateway. Manage containerized MCP servers by profile and connect them to Claude Code.",
    longDesc: "Docker MCP Gateway is a Docker CLI plugin that runs MCP servers as isolated Docker containers via Docker Desktop's MCP Toolkit. You can group multiple MCP servers into profiles and connect them all to Claude Code at once. It supports OAuth flows, secrets management, dynamic tool discovery, and built-in monitoring and call tracing. Requires Docker Desktop 4.40+ with the MCP Toolkit feature enabled. Connect to Claude Code with: docker mcp client connect claude-code --profile <profile-id> --global.",
  },
  vercel: {
    desc: "Official Vercel remote MCP. Project management, deployment logs, and docs search via OAuth.",
    longDesc: "Vercel MCP is an official remote MCP server hosted by Vercel at mcp.vercel.com. It uses OAuth authentication — no API key required. Add it to Claude Code with: claude mcp add --transport http vercel https://mcp.vercel.com, then authenticate via /mcp. Provides tools for searching Vercel documentation, listing and managing projects, managing deployments, and analyzing deployment logs. No public GitHub repo — see vercel.com/docs/agent-resources/vercel-mcp for the official reference.",
  },
  cloudflare: {
    desc: "Cloudflare's suite of remote MCP servers. 15+ specialized servers for Workers, KV, R2, D1, observability, and Radar.",
    longDesc: "Cloudflare MCP is a collection of official remote MCP servers hosted by Cloudflare, using OAuth authentication with no API key required. The Workers Bindings server manages KV namespaces, R2 buckets, D1 databases, Workers, and Hyperdrive configs. Other servers cover Workers Builds, Observability (logs and analytics), Radar (global internet traffic insights), Documentation, Browser Rendering, Logpush, AI Gateway, AutoRAG, Audit Logs, DNS Analytics, DEX, CASB, and GraphQL. Connect individual servers via HTTP transport using their respective remote URLs.",
  },
  aws: {
    desc: "Official AWS MCP server collection. Supports 13+ services including S3, Lambda, CDK, EKS, and CloudFormation.",
    longDesc: "AWS MCP is a monorepo of official MCP servers managed by Amazon Labs. It includes 13+ specialized servers: AWS CDK (infrastructure as code), AWS Documentation (doc search), Lambda, ECS, EKS, CloudFormation, S3, Bedrock, Cost Explorer, CloudWatch, and more. Each server can be installed independently as needed. Especially useful for managing AWS infrastructure as code or searching AWS documentation.",
  },
  atlassian: {
    desc: "Jira + Confluence integration MCP. JQL search, issue/sprint management, and wiki page editing.",
    longDesc: "Atlassian MCP lets you use Jira and Confluence directly from Claude Code. It provides 72+ tools: JQL search, issue creation/editing, sprint management in Jira, and page search/creation/editing in Confluence. Supports both Cloud and Server/Data Center deployments. Useful for handling team project management and documentation in one place within Claude Code.",
  },
  browserbase: {
    desc: "Cloud browser automation. Web navigation, screenshots, and data extraction powered by Stagehand AI.",
    longDesc: "Browserbase MCP provides web automation through cloud-hosted browsers. Built on the Stagehand AI framework, it supports page navigation, screenshot capture, data extraction, and form input. Unlike Playwright/Puppeteer, it uses managed cloud browsers so no local browser installation is needed. Especially useful in CI/CD environments and server-side automation. Requires a BROWSERBASE_API_KEY.",
  },
  stripe: {
    desc: "Official Stripe MCP. Payment processing, subscriptions, customer management, refunds, and docs search.",
    longDesc: "Stripe MCP is an official MCP server provided by Stripe. It lets you handle payment processing, customer management, subscription creation/management, refund processing, invoice management, and Stripe documentation search directly from Claude Code. Supports both remote MCP via OAuth (mcp.stripe.com, no API key required) and local installation. Essential for implementing payment features in SaaS or e-commerce projects.",
  },
  neon: {
    desc: "Neon serverless Postgres MCP. Branch management, migration execution, and SQL queries.",
    longDesc: "Neon MCP is the official MCP server for Neon, a serverless Postgres platform. It lets you create/manage database branches, run SQL migrations, inspect schemas, and execute queries directly from Claude Code. Using Neon's core branching feature (manage databases like Git branches), you can quickly spin up dev/staging environments. Pairs especially well with Next.js + Vercel stacks. Requires a NEON_API_KEY.",
  },
  "desktop-commander": {
    desc: "Desktop MCP for terminal control, diff editing, file search, and in-memory code execution.",
    longDesc: "Desktop Commander is an MCP server that gives Claude full control over the terminal and filesystem. It supports long-running process management, diff-based file editing, file/directory search, and in-memory Python/Node.js code execution. Particularly useful for Claude Desktop users and powerful for directly managing build/test/deploy processes in local development environments.",
  },
  fetch: {
    desc: "Fetches URLs and converts content to Markdown. Essential for HTTP requests, web scraping, and API response inspection.",
    longDesc: "Fetch MCP is an official MCP server that retrieves web pages and API responses, converting them to Markdown for Claude Code. It supports pagination (start_index), raw mode (no Markdown conversion), custom headers, and local/internal IP access. Unlike Firecrawl which focuses on full-site crawling, Fetch specializes in single URL retrieval with no API key required.",
  },
  time: {
    desc: "Current time lookup and timezone conversion. Useful for global team coordination and timestamp analysis.",
    longDesc: "Time MCP is an official MCP server providing current time queries and timezone conversion. get_current_time returns the current time for any IANA timezone, and convert_time converts between timezones. Supports LOCAL_TIMEZONE environment variable for default timezone configuration. Useful for global team scheduling and log timestamp analysis.",
  },
  markitdown: {
    desc: "Converts various files (PDF, DOCX, XLSX, images, audio) to Markdown. Official Microsoft project.",
    longDesc: "MarkItDown MCP is a Microsoft-developed file-to-Markdown conversion server. It converts PDF, Word, Excel, PowerPoint, HTML, images, audio, and more into Markdown via a single convert_to_markdown tool supporting http/https/file/data URIs. Requires pip install and manual MCP configuration (no one-line claude mcp add command available).",
  },
  "magic-mcp": {
    desc: "AI-powered UI component generation via natural language. Leverages the 21st.dev component library for instant, production-ready components.",
    longDesc: "Magic MCP is an AI UI component generation server by 21st.dev. Use the /ui command with natural language to generate or discover UI components from the 21st.dev library. Great for quickly building buttons, cards, modals, and more in React/Next.js projects. Requires TWENTY_FIRST_API_KEY from the 21st.dev Magic Console. Complements shadcn-mcp — magic generates via AI, shadcn accesses existing component libraries.",
  },
  "shadcn-mcp": {
    desc: "Official shadcn/ui MCP server. Search, install, and browse shadcn/ui components directly from Claude Code.",
    longDesc: "shadcn/ui MCP is the official MCP server provided by the shadcn/ui team (Vercel). It enables searching, installing, and browsing the shadcn/ui component registry directly from Claude Code. One-line install via pnpm dlx shadcn@latest mcp init --client claude. No API key needed — uses the public registry. Complements magic-mcp — shadcn provides library access, magic provides AI generation.",
  },
  "n8n-mcp": {
    desc: "n8n workflow automation integration. Works without n8n instance in documentation/verification mode with 7 core tools.",
    longDesc: "n8n MCP integrates the n8n workflow automation platform with Claude Code. It works without an n8n instance using 7 core tools for documentation and workflow design verification. Connecting an n8n API Key unlocks 13 additional tools for workflow creation, execution, and monitoring. Configured with MCP_MODE=stdio for optimal Claude Code integration.",
  },
};

export const reasonsEn: Record<string, string> = {
  omc: "Complex multi-agent tasks detected. 32 specialized agents in a team pipeline (plan → exec → verify → fix) process in parallel to accelerate development.",
  superpowers: "Script or automation tasks included. Optimized for quickly understanding and modifying existing code.",
  "agency-agents": "Role-based specialist collaboration is important here. The Agency provides 90+ expert personas across engineering, design, marketing, PM, and testing — useful when you want structured role separation instead of a single generic assistant.",
  "bkit-starter": "Perfect for Claude Code beginners. Guides you step by step from first project setup to learning.",
  bkit: "Project needs PRD or design-based development. PDCA workflow manages from planning to verification systematically.",
  ralph: "Project has many repetitive implementation tasks. Auto-loops until PRD completion with clean git history.",
  taskmaster: "Project needs task decomposition and management. Auto-breaks PRDs into sub-tasks and tracks dependencies.",
  gsd: "A roadmap and spec-driven workflow is important here. GSD helps stabilize long-running builds with structured planning, execution, and verification.",
  fireauto: "This looks like a launch-oriented workflow with SEO, security, research, or UI polish. fireauto bundles those practical commands into one plugin set.",
  "sequential-thinking": "Complex reasoning or design work detected. Sequential Thinking breaks problems into revisable steps with branching support — improving architecture quality and reducing costly reasoning mistakes.",
  todoist: "Project includes task management. Todoist MCP provides natural language task creation, search, update, complete, and delete via TODOIST_API_TOKEN.",
  linear: "Team project management needed. Linear MCP provides 5 issue management tools (create, update, search, get, comment) via LINEAR_API_KEY. Note: npm package is deprecated — official remote MCP at mcp.linear.app/sse is recommended.",
  repomix: "Large codebase or legacy analysis needed. Packs entire code into AI-friendly format for better context understanding.",
  context7: "Uses many external libraries/APIs. Injects latest official docs in real-time to reduce hallucination errors.",
  memory: "Long-term project where cross-session context is important. Persistent memory eliminates repeated explanations.",
  playwright: "E2E testing or browser automation needed. Automates web app quality verification.",
  puppeteer: "Chrome browser automation needed. Puppeteer handles navigation, screenshots, form interaction, and JavaScript execution — best for Chrome-specific automation tasks.",
  notion: "Documentation and knowledge management are important. Notion MCP syncs dev docs, meeting notes, and wikis with code using 22 tools via NOTION_TOKEN.",
  firecrawl: "Web data collection is a core feature. Firecrawl MCP provides 14 tools — scrape, crawl, map, search, extract, agent, and browser automation — requiring FIRECRAWL_API_KEY.",
  "brave-search": "Real-time web search needed. Brave Search provides privacy-focused web and local business search with a free API tier (2,000 queries/month).",
  exa: "AI-based semantic search needed. Exa provides web, code, and company research via meaning-based search — no API key required for basic use.",
  tavily: "AI agent-optimized search needed. Tavily provides web search with auto-summarization, plus extraction, mapping, and crawling tools via TAVILY_API_KEY.",
  perplexity: "Tech research, deep analysis, or reasoning tasks detected. Perplexity MCP provides 4 tools (search, ask, research, reason) with real-time web data via PERPLEXITY_API_KEY.",
  postgres: "PostgreSQL database work included. Directly query schemas and execute SQL.",
  security: "Auth, payments, or personal data handling included. Real-time vulnerability detection maintains code safety.",
  sentry: "Error tracking and monitoring needed. Sentry MCP searches issues, analyzes stack traces, and runs AI-powered Seer diagnosis — install via claude plugin marketplace add getsentry/sentry-mcp.",
  github: "GitHub-based collaboration is key. 26 tools let you manage PRs, issues, branches, file ops, and search — all within your coding flow.",
  slack: "Team communication is important. Slack integration enables deploy notifications, error reports, and channel messaging automation via 8 dedicated tools.",
  filesystem: "Heavy local file processing. Safely handle filesystem within sandbox.",
  git: "Git version control is core. Programmatically manipulate local repositories.",
  supabase: "BaaS-based full-stack development. Quickly build DB, auth, storage with Supabase.",
  figma: "Design-to-code conversion needed. Figma's official remote MCP (mcp.figma.com) provides design context, variable tokens, and layer metadata — requires Dev/Full seat on a paid Figma plan.",
  uiux: "Frontend UI development is core. UI/UX Pro Max elevates component quality and design consistency via 161 reasoning rules and 67 UI styles. Note: prompt-based skill, not an MCP server.",
  docker: "Docker-based MCP server management needed. Docker MCP Gateway runs MCP servers as isolated containers via Docker Desktop's MCP Toolkit, with profile-based multi-server management for Claude Code.",
  vercel: "Vercel project management or deployment automation needed. Vercel's official remote MCP (mcp.vercel.com) connects via OAuth — no API key required.",
  cloudflare: "Edge computing or Cloudflare infrastructure management needed. Cloudflare's 15+ remote MCP servers cover Workers, KV/R2/D1, observability, Radar, and more — all via OAuth.",
  aws: "AWS infrastructure management detected. AWS MCP provides 13+ specialized servers for CDK, Lambda, S3, CloudFormation, and more — manage your AWS stack directly from Claude Code.",
  atlassian: "Team project management with Jira/Confluence needed. Atlassian MCP provides 72+ tools for JQL search, issue/sprint management, and wiki page editing — all within your coding flow.",
  browserbase: "Cloud-based browser automation needed. Browserbase provides managed cloud browsers with Stagehand AI for web navigation, screenshots, and data extraction — no local browser required.",
  stripe: "Payment integration needed. Stripe's official MCP handles payments, subscriptions, refunds, and documentation search — supports both remote OAuth and local API key modes.",
  neon: "Serverless Postgres database needed. Neon MCP provides Git-like database branching, migration execution, and SQL queries — pairs well with Next.js + Vercel stacks.",
  "desktop-commander": "Terminal automation and process management needed. Desktop Commander provides full terminal control, diff-based editing, file search, and in-memory code execution for local development.",
  fetch: "HTTP data retrieval or web content inspection needed. Fetch MCP converts any URL to Markdown — ideal for API responses, web pages, and simple scraping without API keys.",
  time: "Timezone handling or time conversion needed. Time MCP provides current time queries and timezone conversion using IANA identifiers — useful for global teams and log analysis.",
  markitdown: "Document file analysis needed. MarkItDown converts PDF, DOCX, XLSX, PPTX, images, and audio to Markdown — official Microsoft tool for multi-format document processing.",
  "magic-mcp": "AI-powered UI component generation needed. Magic MCP creates production-ready React/Next.js components from natural language via 21st.dev's library — requires TWENTY_FIRST_API_KEY.",
  "shadcn-mcp": "shadcn/ui component library access needed. Official shadcn/ui MCP enables component search, installation, and registry browsing directly from Claude Code — no API key required.",
  "n8n-mcp": "Workflow automation design or n8n integration needed. n8n MCP provides 7 core tools without an n8n instance, plus 13 additional tools when connected to n8n's API.",
};
