# AI SEO Audit Report — Plugin Advisor

*Date: 2026-04-05*

---

## 1. AI Bot Access (robots.txt)

| Check | Status | Detail |
|-------|--------|--------|
| Generic crawlers allowed | PASS | `userAgent: "*"` with `allow: "/"` |
| GPTBot (ChatGPT) | PASS | Explicitly allowed |
| ChatGPT-User | PASS | Explicitly allowed |
| Google-Extended (Gemini/AI Overviews) | PASS | Explicitly allowed |
| PerplexityBot | PASS | Explicitly allowed |
| ClaudeBot | PASS | Explicitly allowed |
| anthropic-ai | PASS | Explicitly allowed |
| Applebot-Extended | PASS | Explicitly allowed |
| CCBot (Common Crawl training) | BLOCKED | Training-only crawler blocked — correct strategy |
| Admin pages blocked | PASS | `/admin/`, `/api/admin/` disallowed |

**Verdict:** All AI search bots allowed, training-only crawlers blocked. Optimal configuration.

---

## 2. LLM Context Files

| File | Status | Detail |
|------|--------|--------|
| `llms.txt` | CREATED | Concise site description for LLM crawlers |
| `llms-full.txt` | CREATED | Extended context with FAQ, comparison table, technical details |

---

## 3. Content Extractability

| Check | Status | Detail |
|-------|--------|--------|
| Clear definition in first paragraph (meta) | PASS | All pages now have definition-style meta descriptions |
| Specific statistics in meta | PASS | "51 verified plugins", "100-point scoring", "39 MCP + 12 Plugin" |
| Self-contained answer blocks | PARTIAL | Landing page has feature blocks, but no FAQ section yet |
| FAQ section | MISSING | No FAQ content on any page — high-priority gap |
| Comparison tables | MISSING | No "vs" comparison pages — planned in `competitor-alternatives` task |
| Schema markup (JSON-LD) | MISSING | No structured data — planned in `schema-markup` task |
| Author attribution | MISSING | No author name/credentials on content pages |
| "Last updated" dates | MISSING | No visible update dates on pages |
| Heading structure matches queries | PASS | Guide headings match natural query patterns |

---

## 4. Meta Description Optimization

All pages updated to AI-extractable format (definition + statistics):

| Page | Before | After |
|------|--------|-------|
| Layout (default) | Generic Korean description | Definition-style + "51개 검증 DB" + "충돌 감지, 커버리지 분석" |
| /advisor | Vague description | "51개 검증 DB에서 맞춤 추천" + analysis modes mentioned |
| /plugins | "카탈로그를 둘러보세요" | "39개 MCP 서버와 12개 플러그인을 포함한 51개" |
| /optimizer | English only, vague | "100점 감점 모델로 점수화" + specific features |
| /guides | Generic guide description | "6개 실전 가이드" + specific topics listed |
| /services | Vague service description | "1:1" + specific service types |

**OG descriptions**: All updated to English for better global AI citation.

---

## 5. Key Queries to Monitor

Priority queries where Plugin Advisor should aim for AI citation:

| Query | Expected Platform | Current Citation | Priority |
|-------|------------------|-----------------|----------|
| "Claude Code plugins" | ChatGPT, Perplexity | Unknown | HIGH |
| "best Claude Code MCP servers" | All | Unknown | HIGH |
| "Claude Code plugin setup" | Google AI Overview | Unknown | HIGH |
| "Claude Code MCP server list" | Perplexity, ChatGPT | Unknown | HIGH |
| "Claude Code plugin conflicts" | All | Unknown | MEDIUM |
| "how to set up Claude Code plugins" | Google AI Overview | Unknown | MEDIUM |
| "Claude Code plugin optimizer" | Perplexity | Unknown | MEDIUM |
| "Claude Code starter pack" | ChatGPT | Unknown | MEDIUM |

---

## 6. Recommendations (Priority Order)

### Immediate (this session)
- [x] robots.txt — AI bot explicit rules
- [x] llms.txt + llms-full.txt creation
- [x] Meta description optimization (all pages)

### Next Steps (marketing plan Phase 3 remaining)
1. **schema-markup** — JSON-LD structured data (WebSite, SoftwareApplication, FAQPage, Article, ItemList)
2. **programmatic-seo** — Template-based pages for long-tail queries
3. **competitor-alternatives** — "vs" comparison pages (highest citation format per research)

### Medium-Term Recommendations
4. **Add FAQ sections** to landing page and key pages — FAQ content gets cited 30%+ more
5. **Add "Last updated" dates** to guide pages — freshness signal boosts AI visibility
6. **Add author attribution** — expert credentials improve citation rate by 25-30%
7. **Create YouTube content** for key how-to queries — Google AI Overviews frequently cite YouTube

### External Presence (Pillar 3)
8. **Reddit participation** — Post in r/ClaudeAI, r/ClaudeCoding about plugin setup
9. **awesome-claude-code** — Get Plugin Advisor listed in the repo
10. **Blog guest posts** — Write about Claude Code plugin management on dev blogs

---

## 7. Expected Impact

Based on Princeton GEO research findings:

| Optimization Applied | Expected Boost |
|---------------------|---------------|
| Statistics in meta descriptions | +37% visibility |
| Clear, authoritative content structure | +25% visibility |
| Schema markup (next step) | +30-40% visibility |
| FAQ content (planned) | +20% citation rate |
| llms.txt context files | Emerging — early adopter advantage |

**Combined estimate:** 40-60% improvement in AI search visibility once schema-markup and FAQ sections are also implemented.
