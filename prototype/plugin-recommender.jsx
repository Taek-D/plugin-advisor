import { useState, useRef, useCallback } from "react";

// ── Plugin DB ────────────────────────────────────────────────────────────────
const PLUGINS = {
  omc: {
    id: "omc", name: "Oh My ClaudeCode", tag: "OMC", color: "#FF6B35",
    desc: "32개 전문 에이전트, 멀티에이전트 오케스트레이션. 복잡한 장기 프로젝트의 핵심.",
    longDesc: "Oh My ClaudeCode(OMC)는 Claude Code를 멀티에이전트 오케스트레이션 시스템으로 확장하는 플러그인이에요. 32개의 전문 에이전트와 40개 이상의 스킬을 제공하며, 복잡한 작업을 자동으로 병렬 분산 처리해요. autopilot, ralph, ultrawork 등 다양한 실행 모드를 지원하고, Codex · Gemini 같은 외부 AI와도 연동할 수 있어요.",
    url: "https://github.com/Yeachan-Heo/oh-my-claudecode",
    install: [
      "/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode",
      "/plugin install oh-my-claudecode",
      "/oh-my-claudecode:omc-setup",
    ],
    features: ["32개 전문 에이전트", "자율 실행 모드", "Codex/Gemini 연동", "토큰 최적화 라우팅"],
    conflicts: ["superpowers"],
    keywords: ["게임","unity","신규 서비스","새 서비스","멀티에이전트","대규모","팀","complex","multi","백엔드","backend","full stack","풀스택","saas","플랫폼","platform","orchestrat"],
  },
  bkit: {
    id: "bkit", name: "bkit", tag: "BKIT", color: "#00D4AA",
    desc: "PDCA 방법론 기반 구조화 워크플로. PRD → 설계 → 구현 → 검증 자동화.",
    longDesc: "bkit은 Claude Code에 PDCA(Plan-Do-Check-Act) 방법론을 도입해서 개발 프로세스를 체계화해줘요. PRD 분석부터 설계 문서 작성, 구현, 갭 분석, 완료 리포트까지 하나의 흐름으로 연결돼요. 단순히 코드를 생성하는 게 아니라, AI와 함께 개발 프로세스 자체를 설계하는 프레임워크예요.",
    url: "https://github.com/popup-studio-ai/bkit-claude-code",
    install: [
      "/plugin marketplace add popup-studio-ai/bkit-claude-code",
      "/plugin install bkit",
    ],
    features: ["PDCA 워크플로", "자동 문서화", "갭 분석", "완료 리포트 생성"],
    conflicts: [],
    keywords: ["prd","문서","설계","계획","plan","doc","명세","요구사항","requirement","spec","pdca","기획","아키텍처","architecture","반복","iterate"],
  },
  superpowers: {
    id: "superpowers", name: "Superpowers", tag: "SP", color: "#7C3AED",
    desc: "기존 코드 빠른 파악 & 수정. 학습 곡선 낮고 즉시 체감.",
    longDesc: "Superpowers는 Claude Code의 기본 능력을 즉시 강화해주는 플러그인이에요. 기존 코드베이스를 빠르게 파악하고, 파일 탐색, 검색, 수정 작업에서 마찰을 최소화해줘요. 복잡한 설정 없이 설치 즉시 체감할 수 있는 게 가장 큰 장점이에요. 스크립트, 데이터 분석, 자동화 작업에 특히 강해요.",
    url: "https://github.com/superpoweredai/superpowers",
    install: [
      "/plugin marketplace add https://github.com/superpoweredai/superpowers",
      "/plugin install superpowers",
    ],
    features: ["즉시 적용", "파일 탐색 강화", "낮은 학습 곡선", "스크립트 최적화"],
    conflicts: ["omc"],
    keywords: ["스크립트","script","자동화","기존 코드","리팩터","refactor","수정","fix","간단","분석","analysis","데이터","data","python","sql","automation"],
  },
  uiux: {
    id: "uiux", name: "UI/UX Pro Max", tag: "UI", color: "#EC4899",
    desc: "디자인 시스템, 컴포넌트, 접근성. 프론트엔드 퀄리티를 끌어올림.",
    longDesc: "UI/UX Pro Max는 프론트엔드 개발에 특화된 플러그인이에요. 디자인 시스템 설계, 컴포넌트 구조화, 접근성(a11y) 검토까지 지원해요. React, Vue, Svelte 등 주요 프레임워크와 Tailwind, shadcn/ui 같은 스타일 시스템에 대한 깊은 이해를 제공해요. UI 퀄리티와 사용자 경험을 빠르게 끌어올려야 할 때 필수예요.",
    url: "https://github.com/yourusername/ui-ux-pro-max",
    install: [
      "/plugin marketplace add https://github.com/yourusername/ui-ux-pro-max",
      "/plugin install ui-ux-pro-max",
    ],
    features: ["디자인 시스템", "접근성 검토", "컴포넌트 패턴", "Tailwind/shadcn 지원"],
    conflicts: [],
    keywords: ["ui","ux","프론트","frontend","react","vue","svelte","디자인","design","컴포넌트","component","landing","랜딩","웹앱","webapp","tailwind","shadcn","모바일","mobile"],
  },
  context7: {
    id: "context7", name: "Context7", tag: "C7", color: "#F59E0B",
    desc: "최신 라이브러리 공식 문서를 실시간 주입. 환각 현상 대폭 감소.",
    longDesc: "Context7은 Claude가 코드를 작성할 때 최신 라이브러리 공식 문서를 실시간으로 주입해주는 MCP 서버 기반 플러그인이에요. Next.js, Supabase, Prisma, FastAPI 등 주요 라이브러리의 최신 API를 정확하게 사용할 수 있어서 환각(hallucination)으로 인한 오류를 크게 줄여줘요.",
    url: "https://mcp.context7.com",
    install: [
      "/plugin marketplace add https://mcp.context7.com/mcp",
      "/plugin install context7",
    ],
    features: ["실시간 문서 주입", "환각 감소", "최신 API 지원", "MCP 기반"],
    conflicts: [],
    keywords: ["라이브러리","library","api","sdk","next.js","nextjs","react","django","fastapi","supabase","prisma","최신","공식","framework","패키지"],
  },
  ralph: {
    id: "ralph", name: "Ralph Loop", tag: "RALPH", color: "#10B981",
    desc: "자율 코딩 루프. PRD 완료까지 반복 실행 후 git 커밋 자동 처리.",
    longDesc: "Ralph Loop는 Claude Code가 PRD나 태스크 목록을 스스로 처리할 때까지 자율적으로 반복 실행하는 플러그인이에요. 각 반복마다 구현 → 검증 → 커밋을 자동으로 수행하고, 작업이 완료되면 깔끔한 git 히스토리를 남겨줘요. CRUD 구현, 마이그레이션, 테스트 커버리지 향상 같은 반복 작업에 특히 유용해요.",
    url: "https://github.com/haizelabs/ralph-wiggum",
    install: [
      "/plugin marketplace add https://github.com/haizelabs/ralph-wiggum",
      "/plugin install ralph-wiggum",
    ],
    features: ["자율 반복 실행", "자동 git 커밋", "완료 검증", "PRD 기반 루프"],
    conflicts: [],
    keywords: ["자율","autonomous","반복","loop","crud","migration","테스트","test","커버리지","coverage","자동화","batch","대량","overnight"],
  },
  repomix: {
    id: "repomix", name: "Repomix", tag: "REPO", color: "#6366F1",
    desc: "전체 코드베이스를 AI 친화적 파일로 패킹. 대형 프로젝트 컨텍스트 관리.",
    longDesc: "Repomix는 전체 코드베이스를 하나의 AI 친화적 파일로 패킹해주는 도구예요. 대형 프로젝트나 레거시 코드를 Claude가 한 번에 이해할 수 있게 만들어줘요. 모노레포, 레거시 코드 분석, 팀 온보딩, 코드 리뷰 등 전체 컨텍스트가 필요한 작업에 필수예요.",
    url: "https://repomix.com",
    install: [
      "/plugin marketplace add repomix",
      "/plugin install repomix-mcp@repomix",
      "/plugin install repomix-commands@repomix",
    ],
    features: ["코드베이스 패킹", "컨텍스트 최적화", "레거시 분석", "모노레포 지원"],
    conflicts: [],
    keywords: ["코드베이스","codebase","대형","large","레거시","legacy","전체","모노레포","monorepo","온보딩","onboarding","이해","understand","review"],
  },
  firecrawl: {
    id: "firecrawl", name: "Firecrawl", tag: "FIRE", color: "#EF4444",
    desc: "웹 스크래핑 & 데이터 추출 자동화. 크롤링 기반 서비스에 필수.",
    longDesc: "Firecrawl은 웹 데이터 수집과 스크래핑을 자동화해주는 플러그인이에요. 단순 HTML 파싱부터 JavaScript 렌더링이 필요한 동적 페이지까지 처리할 수 있어요. 가격 모니터링, 뉴스 수집, 데이터 파이프라인 구축 같은 크롤링 기반 서비스 개발에 필수예요.",
    url: "https://firecrawl.dev",
    install: [
      "/plugin marketplace add firecrawl",
      "/plugin install firecrawl@firecrawl-plugins",
    ],
    features: ["동적 페이지 크롤링", "데이터 추출", "파이프라인 구축", "스케줄링"],
    conflicts: [],
    keywords: ["크롤링","crawl","스크래핑","scraping","웹 데이터","수집","collect","파싱","parse","뉴스","news","가격","price","모니터링","monitoring"],
  },
  playwright: {
    id: "playwright", name: "Playwright", tag: "PW", color: "#059669",
    desc: "브라우저 자동화 & E2E 테스트. 웹앱 QA에 강력한 도구.",
    longDesc: "Playwright MCP는 Microsoft의 Playwright를 Claude Code와 연동해서 브라우저 자동화와 E2E 테스트를 쉽게 만들어줘요. 웹앱의 전체 사용자 시나리오를 자동으로 검증하고, 크로스 브라우저 테스트, 스크린샷 비교, 성능 측정까지 지원해요.",
    url: "https://github.com/microsoft/playwright-mcp",
    install: [
      "/plugin marketplace add https://github.com/microsoft/playwright-mcp",
      "/plugin install playwright-mcp",
    ],
    features: ["E2E 테스트 자동화", "크로스 브라우저", "스크린샷 비교", "성능 측정"],
    conflicts: [],
    keywords: ["e2e","테스트","test","브라우저","browser","qa","품질","quality","헤드리스","headless","자동화 테스트","검증","verify","selenium"],
  },
  security: {
    id: "security", name: "Security Guidance", tag: "SEC", color: "#DC2626",
    desc: "보안 취약점 실시간 감지. SQL인젝션, XSS, 인증 이슈 자동 경고.",
    longDesc: "Security Guidance는 Claude Code가 코드를 작성할 때 보안 취약점을 실시간으로 감지해주는 공식 플러그인이에요. SQL 인젝션, XSS, CSRF, 인증 우회, 민감 정보 노출 등 OWASP Top 10 기준의 주요 취약점을 자동으로 경고해줘요. 인증, 결제, 개인정보를 다루는 서비스에서 특히 중요해요.",
    url: "https://github.com/anthropics/claude-plugins-official",
    install: [
      "/plugin install security-guidance@claude-plugin-directory",
    ],
    features: ["OWASP Top 10 감지", "실시간 경고", "인증 검토", "공식 Anthropic 플러그인"],
    conflicts: [],
    keywords: ["보안","security","인증","auth","로그인","login","취약점","vulnerability","sql injection","xss","결제","payment","금융","finance","개인정보","privacy","암호화","encrypt"],
  },
};

// ── Conflict map ─────────────────────────────────────────────────────────────
const CONFLICT_REASONS = {
  "omc-superpowers": "OMC와 Superpowers는 기능이 크게 겹쳐요. 둘 다 설치하면 명령어 충돌이 발생할 수 있어요.",
  "superpowers-omc": "OMC와 Superpowers는 기능이 크게 겹쳐요. 둘 다 설치하면 명령어 충돌이 발생할 수 있어요.",
};

function getConflicts(selectedIds) {
  const warnings = [];
  selectedIds.forEach((a) => {
    selectedIds.forEach((b) => {
      if (a >= b) return;
      const key = `${a}-${b}`;
      if (CONFLICT_REASONS[key]) warnings.push({ ids: [a, b], msg: CONFLICT_REASONS[key] });
    });
  });
  return warnings;
}

// ── Keyword highlight ─────────────────────────────────────────────────────────
function HighlightedText({ text, keywords, color }) {
  if (!keywords || !keywords.length) return <span>{text}</span>;
  const pattern = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        pattern.test(part)
          ? <mark key={i} style={{ background: color + "30", color, borderRadius: "2px", padding: "0 2px", fontWeight: 700 }}>{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ── Recommend engine ──────────────────────────────────────────────────────────
const REASONS = {
  omc: "복잡한 멀티에이전트 작업이 감지됐어요. 32개 전문 에이전트가 병렬 처리해서 개발 속도를 높여줘요.",
  bkit: "PRD나 설계 기반 개발이 필요한 프로젝트예요. PDCA 워크플로로 계획부터 검증까지 체계적으로 관리해줘요.",
  superpowers: "스크립트나 자동화 작업이 포함돼 있어요. 기존 코드를 빠르게 파악하고 수정하는 데 최적화돼 있어요.",
  uiux: "프론트엔드 UI 개발이 핵심인 프로젝트예요. 컴포넌트 퀄리티와 디자인 일관성을 높여줘요.",
  context7: "외부 라이브러리나 API를 많이 쓰는 구조예요. 최신 공식 문서를 실시간 주입해서 환각 오류를 줄여줘요.",
  ralph: "반복적인 구현 작업이 많은 프로젝트예요. PRD 완료까지 자동 루프로 처리하고 git 히스토리도 깔끔하게 유지해줘요.",
  repomix: "대형 코드베이스나 레거시 분석이 필요해요. 전체 코드를 AI 친화적으로 패킹해서 컨텍스트 이해를 높여줘요.",
  firecrawl: "웹 데이터 수집이 핵심 기능이에요. 스크래핑 자동화를 간단하게 구현할 수 있어요.",
  playwright: "E2E 테스트나 브라우저 자동화가 필요한 프로젝트예요. 웹앱 품질 검증을 자동화해줘요.",
  security: "인증, 결제, 개인정보 처리가 포함돼 있어요. 보안 취약점을 실시간 감지해서 안전한 코드를 유지해줘요.",
};

function recommend(text) {
  const lower = text.toLowerCase();
  const matchedKeywords = {};
  const scores = {};

  Object.values(PLUGINS).forEach((p) => {
    const matched = p.keywords.filter((kw) => lower.includes(kw.toLowerCase()));
    if (matched.length > 0) {
      scores[p.id] = matched.length;
      matchedKeywords[p.id] = matched;
    }
  });

  if (scores.omc && scores.superpowers) {
    scores.superpowers = Math.max(0, scores.superpowers - 1);
    if (!scores.superpowers) delete scores.superpowers;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4);

  if (!sorted.length) {
    return {
      summary: "특정 키워드가 부족해요. 더 구체적인 설명을 추가하면 정확도가 올라가요.",
      recommendations: [
        { pluginId: "bkit", priority: 1, reason: REASONS.bkit, matchedKeywords: [] },
        { pluginId: "context7", priority: 2, reason: REASONS.context7, matchedKeywords: [] },
      ],
      warning: "더 구체적인 내용(기술 스택, 주요 기능 등)을 입력하면 더 정확한 추천이 가능해요.",
      inputText: text,
    };
  }

  const topPlugin = PLUGINS[sorted[0][0]];
  return {
    summary: `${topPlugin.name} 중심의 프로젝트로 파악됐어요. ${sorted.length}개 플러그인 조합을 추천해요.`,
    recommendations: sorted.map(([id], i) => ({
      pluginId: id, priority: i + 1,
      reason: REASONS[id],
      matchedKeywords: matchedKeywords[id] || [],
    })),
    warning: sorted.length >= 4 ? "플러그인이 많으면 충돌 위험이 있어요. 핵심 1-2개 먼저 써보세요." : null,
    inputText: text,
  };
}

async function fetchGitHubReadme(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) throw new Error("올바른 GitHub URL이 아니에요");
  const [owner, repo] = [match[1], match[2]];
  const rawUrls = [
    `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
  ];
  const proxies = [
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
  ];
  for (const u of rawUrls) { try { const r = await fetch(u); if (r.ok) return r.text(); } catch {} }
  for (const px of proxies) for (const u of rawUrls) {
    try { const r = await fetch(px(u)); if (r.ok) { const t = await r.text(); if (t?.length > 10) return t; } } catch {}
  }
  throw new Error("README를 불러올 수 없어요. 텍스트 탭에 직접 붙여넣기를 써주세요.");
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("input");
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [ghUrl, setGhUrl] = useState("");
  const [fname, setFname] = useState("");
  const [fcontent, setFcontent] = useState("");
  const [result, setResult] = useState(null);
  const [sel, setSel] = useState({});
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [detailPlugin, setDetailPlugin] = useState(null);
  const fileRef = useRef();

  const handleFile = useCallback((e) => {
    const f = e.target.files[0]; if (!f) return;
    setFname(f.name);
    const r = new FileReader(); r.onload = (ev) => setFcontent(ev.target.result); r.readAsText(f);
  }, []);

  const analyze = async () => {
    setErr(null); setStep("analyzing");
    try {
      let content = mode === "text" ? text : mode === "file" ? fcontent : await fetchGitHubReadme(ghUrl);
      if (!content.trim()) throw new Error("내용을 입력해주세요");
      await new Promise((r) => setTimeout(r, 700));
      const res = recommend(content);
      setResult(res);
      const s = {}; res.recommendations.forEach((r) => { s[r.pluginId] = true; }); setSel(s);
      setStep("result");
    } catch (e) { setErr(e.message); setStep("input"); }
  };

  const script = () => {
    const ids = Object.keys(sel).filter((k) => sel[k]);
    if (!ids.length) return "";
    return ["# Claude Code 플러그인 설치 스크립트", "# Claude Code 터미널에서 순서대로 실행하세요", "",
      ...ids.flatMap((id) => { const p = PLUGINS[id]; return p ? [`# ── ${p.name}`, ...p.install, ""] : []; })
    ].join("\n");
  };

  const copy = () => { navigator.clipboard.writeText(script()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setStep("input"); setResult(null); setSel({}); setText(""); setGhUrl(""); setFname(""); setFcontent(""); setErr(null); setDetailPlugin(null); };

  const selectedIds = Object.keys(sel).filter((k) => sel[k]);
  const conflicts = getConflicts(selectedIds);
  const canGo = (mode === "text" && text.trim()) || (mode === "file" && fcontent) || (mode === "github" && ghUrl.trim());

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#DDDDF0", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1E1E3A}
        .tab{background:none;border:1px solid #181830;color:#555;padding:7px 14px;border-radius:5px;cursor:pointer;font-family:inherit;font-size:11px;letter-spacing:.4px;transition:all .15s}
        .tab.on{background:#101028;border-color:#30306A;color:#CCC}
        .tab:hover{border-color:#30306A;color:#CCC}
        .mbtn{background:linear-gradient(135deg,#3030FF,#7C3AED);border:none;color:#FFF;padding:13px;border-radius:7px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:1.5px;width:100%;transition:all .2s}
        .mbtn:hover:not(:disabled){opacity:.85;transform:translateY(-1px)}
        .mbtn:disabled{opacity:.3;cursor:not-allowed}
        .cbtn{background:linear-gradient(135deg,#00C896,#3030FF);border:none;color:#FFF;padding:9px 20px;border-radius:5px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;letter-spacing:1px}
        .cbtn:hover{opacity:.85}
        .card{background:#0B0B1C;border:1px solid #181830;border-radius:9px;padding:16px;transition:border-color .15s}
        .card:hover{border-color:#28285A}
        .card.on{border-color:var(--c)}
        .card.conflict-active{border-color:#FF4444 !important;background:#120808}
        .chk{width:15px;height:15px;border:2px solid #252545;border-radius:3px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;margin-top:2px;cursor:pointer}
        .chk.on{background:var(--c);border-color:var(--c)}
        .detail-btn{background:none;border:1px solid #202038;color:#444;padding:4px 9px;border-radius:4px;cursor:pointer;font-family:inherit;font-size:9px;letter-spacing:.5px;transition:all .15s}
        .detail-btn:hover{border-color:var(--c);color:var(--c)}
        textarea,input[type=text]{background:#0B0B1C;border:1px solid #181830;color:#CCC;padding:12px;border-radius:6px;font-family:inherit;font-size:12px;width:100%;outline:none;resize:vertical;transition:border-color .15s;line-height:1.7}
        textarea:focus,input:focus{border-color:#3030FF}
        textarea::placeholder,input::placeholder{color:#252540}
        .drop{border:2px dashed #181830;border-radius:7px;padding:28px;text-align:center;cursor:pointer;transition:all .15s}
        .drop:hover{border-color:#3030FF;background:#0B0B1C}
        .fade{animation:fd .3s ease}@keyframes fd{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .dot span{animation:bl 1.2s infinite;color:#3030FF;font-size:22px;margin:0 3px}
        .dot span:nth-child(2){animation-delay:.2s}.dot span:nth-child(3){animation-delay:.4s}
        @keyframes bl{0%,80%,100%{opacity:.15}40%{opacity:1}}
        .bdg{font-size:9px;padding:2px 6px;border-radius:3px;font-weight:700;letter-spacing:.6px}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
        .modal{background:#0D0D1E;border:1px solid #252545;border-radius:12px;padding:24px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto}
        .kw-chip{display:inline-block;background:#3030FF20;color:#7070FF;border:1px solid #3030FF30;padding:2px 7px;border-radius:3px;font-size:10px;margin:2px}
      `}</style>

      {/* Detail Modal */}
      {detailPlugin && (
        <div className="modal-overlay" onClick={() => setDetailPlugin(null)}>
          <div className="modal fade" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "16px", fontWeight: 800 }}>{detailPlugin.name}</span>
                <span className="bdg" style={{ color: detailPlugin.color, background: detailPlugin.color + "20" }}>{detailPlugin.tag}</span>
              </div>
              <button onClick={() => setDetailPlugin(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>×</button>
            </div>

            <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.8, marginBottom: "16px" }}>{detailPlugin.longDesc}</p>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px", marginBottom: "8px" }}>주요 기능</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {detailPlugin.features.map((f, i) => (
                  <span key={i} style={{ fontSize: "10px", color: detailPlugin.color, background: detailPlugin.color + "15", border: `1px solid ${detailPlugin.color}30`, padding: "3px 8px", borderRadius: "4px" }}>{f}</span>
                ))}
              </div>
            </div>

            {detailPlugin.conflicts.length > 0 && (
              <div style={{ background: "#120808", border: "1px solid #301010", borderRadius: "6px", padding: "10px 12px", marginBottom: "14px", fontSize: "11px", color: "#FF6060" }}>
                ⚠ <strong>{detailPlugin.conflicts.map((c) => PLUGINS[c]?.name).join(", ")}</strong>와 함께 사용 시 충돌 가능성이 있어요.
              </div>
            )}

            <a href={detailPlugin.url} target="_blank" rel="noreferrer"
              style={{ display: "block", textAlign: "center", padding: "10px", background: detailPlugin.color + "20", border: `1px solid ${detailPlugin.color}40`, borderRadius: "6px", color: detailPlugin.color, fontSize: "11px", textDecoration: "none", letterSpacing: ".5px" }}>
              GitHub / 공식 페이지 →
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #121224", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3030FF", boxShadow: "0 0 8px #3030FF" }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "2.5px" }}>PLUGIN ADVISOR</span>
          <span style={{ fontSize: "9px", color: "#3030FF", background: "#080820", border: "1px solid #181848", padding: "2px 6px", borderRadius: "3px" }}>
            Claude Code · {Object.keys(PLUGINS).length} plugins
          </span>
        </div>
        {step === "result" && (
          <button onClick={reset} style={{ background: "none", border: "1px solid #181830", color: "#555", padding: "5px 11px", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px" }}>
            ← 다시
          </button>
        )}
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 18px" }}>

        {/* INPUT */}
        {step === "input" && (
          <div className="fade">
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 800, marginBottom: "6px" }}>어떤 걸 만들고 있나요?</h1>
            <p style={{ fontSize: "11px", color: "#484860", marginBottom: "24px", lineHeight: 1.8 }}>
              PRD, README, 프로젝트 설명을 넣으면 최적의 플러그인 조합을 찾아드려요. <span style={{ color: "#3030FF" }}>API 호출 없이 즉시</span> 분석해요.
            </p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              {[["text","텍스트"],["file","파일"],["github","GitHub"]].map(([m, l]) => (
                <button key={m} className={`tab ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>{l}</button>
              ))}
            </div>
            {mode === "text" && <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={"프로젝트를 설명해줘요.\n예) React 기반 SaaS 대시보드, Python 크롤러, Unity 모바일 게임,\n     FastAPI 백엔드 + 인증/결제 포함, PRD 기반 개발 등"} />}
            {mode === "file" && (
              <div className="drop" onClick={() => fileRef.current?.click()}>
                <div style={{ fontSize: "18px", marginBottom: "6px" }}>📄</div>
                {fname ? <><span style={{ color: "#00C896", fontSize: "12px" }}>{fname}</span><br/><span style={{ color: "#333", fontSize: "10px" }}>클릭해서 변경</span></>
                       : <><div style={{ fontSize: "12px", marginBottom: "4px" }}>PRD / README 업로드</div><div style={{ color: "#333", fontSize: "10px" }}>.md .txt</div></>}
                <input ref={fileRef} type="file" accept=".md,.txt" style={{ display: "none" }} onChange={handleFile} />
              </div>
            )}
            {mode === "github" && <input type="text" value={ghUrl} onChange={(e) => setGhUrl(e.target.value)} placeholder="https://github.com/owner/repo" />}
            {err && <div style={{ marginTop: "10px", padding: "9px 12px", background: "#120808", border: "1px solid #301010", borderRadius: "5px", color: "#FF6060", fontSize: "11px" }}>⚠ {err}</div>}
            <button className="mbtn" style={{ marginTop: "12px" }} onClick={analyze} disabled={!canGo}>ANALYZE → RECOMMEND</button>
            <div style={{ marginTop: "18px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {Object.values(PLUGINS).map((p) => (
                <span key={p.id} className="bdg" style={{ color: p.color, background: p.color + "14", border: `1px solid ${p.color}28`, cursor: "pointer" }}
                  onClick={() => setDetailPlugin(p)}>{p.tag}</span>
              ))}
            </div>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#303048" }}>↑ 태그 클릭하면 플러그인 상세 볼 수 있어요</div>
          </div>
        )}

        {/* ANALYZING */}
        {step === "analyzing" && (
          <div style={{ textAlign: "center", padding: "70px 0" }}>
            <div className="dot"><span>●</span><span>●</span><span>●</span></div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px", fontWeight: 800, marginTop: "18px", marginBottom: "6px" }}>분석 중...</div>
            <div style={{ color: "#383850", fontSize: "11px" }}>키워드 매칭 & 플러그인 조합 계산 중</div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div className="fade">
            {/* Summary */}
            <div style={{ background: "#0B0B1C", border: "1px solid #181830", borderRadius: "9px", padding: "15px 17px", marginBottom: "16px" }}>
              <div style={{ fontSize: "9px", color: "#3030FF", letterSpacing: "2px", marginBottom: "6px" }}>PROJECT SUMMARY</div>
              <div style={{ fontSize: "13px", lineHeight: 1.7 }}>{result.summary}</div>
            </div>

            {/* Conflict warnings */}
            {conflicts.length > 0 && (
              <div style={{ marginBottom: "14px" }}>
                {conflicts.map((c, i) => (
                  <div key={i} style={{ background: "#130808", border: "1px solid #3A1010", borderRadius: "6px", padding: "10px 13px", marginBottom: "6px", fontSize: "11px", color: "#FF6060", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span>⚡</span>
                    <div>
                      <strong style={{ color: "#FF8080" }}>{c.ids.map((id) => PLUGINS[id]?.name).join(" + ")} 충돌 경고</strong>
                      <div style={{ marginTop: "3px", color: "#CC5050" }}>{c.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.warning && !conflicts.length && (
              <div style={{ background: "#100D00", border: "1px solid #281C00", borderRadius: "5px", padding: "9px 13px", marginBottom: "14px", fontSize: "11px", color: "#FFAA00" }}>
                ⚠ {result.warning}
              </div>
            )}

            <div style={{ fontSize: "9px", color: "#383850", letterSpacing: "2px", marginBottom: "9px" }}>추천 조합 — 원하는 것만 선택</div>

            {/* Plugin cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
              {result.recommendations.map((rec) => {
                const p = PLUGINS[rec.pluginId]; if (!p) return null;
                const on = !!sel[rec.pluginId];
                const inConflict = conflicts.some((c) => c.ids.includes(p.id) && selectedIds.includes(p.id));
                return (
                  <div key={p.id} className={`card ${on ? "on" : ""} ${inConflict ? "conflict-active" : ""}`} style={{ "--c": p.color }}>
                    <div style={{ display: "flex", gap: "11px" }}>
                      <div className={`chk ${on ? "on" : ""}`} style={{ "--c": p.color }} onClick={() => setSel((s) => ({ ...s, [p.id]: !s[p.id] }))}>
                        {on && <span style={{ fontSize: "9px", color: "#FFF", fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}
                            onClick={() => setDetailPlugin(p)}>{p.name}</span>
                          <span className="bdg" style={{ color: p.color, background: p.color + "18" }}>{p.tag}</span>
                          {rec.priority === 1 && <span className="bdg" style={{ color: "#3030FF", background: "#3030FF18" }}>CORE</span>}
                          {inConflict && <span className="bdg" style={{ color: "#FF4444", background: "#FF444418" }}>⚡ 충돌</span>}
                          <button className="detail-btn" style={{ "--c": p.color }} onClick={() => setDetailPlugin(p)}>상세 보기</button>
                        </div>

                        {/* Highlighted reason */}
                        <div style={{ fontSize: "11px", color: "#777", lineHeight: 1.7, marginBottom: "6px" }}>
                          <HighlightedText text={rec.reason} keywords={rec.matchedKeywords} color={p.color} />
                        </div>

                        {/* Matched keywords */}
                        {rec.matchedKeywords.length > 0 && (
                          <div style={{ marginBottom: "4px" }}>
                            {rec.matchedKeywords.slice(0, 5).map((kw, i) => (
                              <span key={i} className="kw-chip">{kw}</span>
                            ))}
                            {rec.matchedKeywords.length > 5 && <span className="kw-chip">+{rec.matchedKeywords.length - 5}</span>}
                          </div>
                        )}

                        <div style={{ fontSize: "10px", color: "#404050" }}>{p.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Install script */}
            {selectedIds.length > 0 && (
              <div style={{ background: "#040408", border: "1px solid #121224", borderRadius: "9px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ fontSize: "9px", color: "#383850", letterSpacing: "2px" }}>INSTALL SCRIPT</div>
                  <button className="cbtn" onClick={copy}>{copied ? "✓ COPIED" : "COPY"}</button>
                </div>
                <pre style={{ fontSize: "11px", color: "#666", lineHeight: 1.9, overflowX: "auto", whiteSpace: "pre-wrap" }}>{script()}</pre>
                <div style={{ marginTop: "10px", padding: "8px 12px", background: "#07070E", borderRadius: "5px", fontSize: "10px", color: "#383850", lineHeight: 1.6 }}>
                  💡 Claude Code 터미널에서 위 명령어를 순서대로 실행하세요. 설치 후 <code style={{ color: "#3030FF" }}>claude</code> 재시작이 필요할 수 있어요.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
