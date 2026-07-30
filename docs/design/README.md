# InterviewHub Public Design Spec (MVP Guest Views)

Status: **Locked design decisions — implement in Phase 4 only.**  
Original mockups (inspiration only): [`references/`](references/).  
Architect decisions below override mockup inconsistencies (TechPath / DevPrep Pro / mixed nav).

---

## Brand

| Item | Decision |
|------|----------|
| Product name | **InterviewHub** (one word in UI copy where possible; logo may show “Interview Hub”) |
| Tagline | Connect. Practice. Succeed. |
| Voice | Clear, practical, confident — not hype-heavy |
| Forbidden | TechPath, DevPrep Pro, fake inflated stats without data |

---

## Design principles (what we keep from mockups)

Keep:

- Clean blue + white education layout (readable for long articles)
- Strong search on home
- Language / technology cards with question counts
- Category focus tiles
- Question pages with code blocks, difficulty, companies, related questions
- Blog with featured post + grid + filters
- Shared header + rich footer pattern

Improve / cut:

- One nav and one footer everywhere
- Guest MVP: no login chrome, progress, comments, sandbox, or profile avatar
- AdSense slots planned into content pages
- One difficulty scale: **Easy · Medium · Hard**
- Hero stays focused: brand signal + one headline + one supporting line + search CTA (no clutter widgets)

---

## Visual system

### Color

| Token | Value | Use |
|-------|--------|-----|
| `--color-primary` | `#1D4ED8` | Buttons, links, active nav |
| `--color-primary-dark` | `#1E3A8A` | Hover / emphasis |
| `--color-accent` | `#F97316` | Logo accent / sparse highlights |
| `--color-ink` | `#0F172A` | Body text |
| `--color-navy` | `#0B1F3A` | Headings aligned to logo |
| `--color-muted` | `#64748B` | Secondary text |
| `--color-surface` | `#FFFFFF` | Page / cards |
| `--color-surface-soft` | `#F1F5F9` | Section backgrounds |
| `--color-surface-tint` | `#EFF6FF` | Soft blue wash (language cards) |
| `--color-border` | `#E2E8F0` | Dividers, card borders |
| `--color-easy` | `#16A34A` | Easy badge |
| `--color-medium` | `#D97706` | Medium badge |
| `--color-hard` | `#DC2626` | Hard badge |
| `--color-code-bg` | `#0F172A` | Code blocks |

Avoid purple-glow themes and dark-mode-first marketing. Light mode is default for AdSense readability.

### Typography

- Display / UI: **Plus Jakarta Sans** (or **DM Sans**) — distinctive, not Inter/Roboto
- Code: **JetBrains Mono** or **IBM Plex Mono**
- Scale: clear H1 > H2 > body; question title is always the page H1

### Layout

- Max content width ~1120–1200px
- Question page: main ~65–70% + sidebar ~30–35% (sidebar collapses under content on mobile)
- Cards allowed for browse grids, blog grid, language tiles (interaction containers)
- No card wrapping the entire question answer body (article flows as article)

### Motion (Phase 4)

2–3 light motions only: header shadow on scroll, fade-in for section blocks, button hover. No decorative animation noise.

---

## Global chrome (every public page)

### Header

```
[Logo InterviewHub]   Home  Languages  Categories  Blog
```

- No Login / Sign up / avatar until Phase 5 (then add right side)
- Active link: primary color + underline or weight
- Mobile: hamburger → same links

### Footer (single component)

| Column | Links |
|--------|--------|
| Brand | InterviewHub blurb + social placeholders |
| Platform | Languages, Categories, Blog |
| Resources | About, Contact, Roadmaps (placeholder), Sitemap |
| Legal row | Privacy · Terms · Cookies · © year InterviewHub |

Newsletter “Join” is optional Phase 4+; omit from first paint or show disabled stub.

---

## URL map (SEO)

| Page | Path |
|------|------|
| Home | `/` |
| Languages index | `/languages` |
| Language detail | `/languages/[slug]` |
| Categories index | `/categories` |
| Category detail | `/categories/[slug]` |
| Question | `/questions/[slug]` |
| Blog index | `/blog` |
| Blog post | `/blog/[slug]` |
| About / Contact / Privacy / Terms | `/about`, `/contact`, `/privacy`, `/terms` |

---

## AdSense placeholders (required)

| Placement | Where | Notes |
|-----------|--------|------|
| `ad-in-article` | Question: after intro, before deep sections | Never above H1 |
| `ad-sidebar` | Question + Blog desktop sidebar | Sticky optional; reserve min-height to avoid CLS |
| `ad-between-list` | Language/category question lists every ~5–8 items | Light touch |
| `ad-blog-feed` | Blog grid mid-feed | Optional |

Rules: no ads in hero; no overlay on answer; reserve space (fixed min-height) for Core Web Vitals.

---

## Page specs (final MVP guest)

### 1. Home `/`

Inspired by `01-home-landing.png`.

1. **Hero** — Eyebrow optional · H1 “Master the technical interview” · one sentence · search (company, topic, question) · trending chips: React, System Design, JavaScript, Python (no Marketing)
2. **Top languages** — 4–8 cards: icon, name, short blurb, question count → `/languages/[slug]`
3. **Company strip** — text names or generic “Asked at top companies” until logo rights exist
4. **Focus categories** — 3 tiles: System Design, Algorithms & DS, Behavioral
5. **Recent questions** — list rows: difficulty chip, title, tags, relative time · “Load more”
6. **Social proof** — testimonials only if real; else omit until you have quotes (do not fake “10,000+ users” at launch)
7. Footer

Cut from mock: profile avatar, inflated user counts without proof.

### 2. Languages `/languages`

Inspired by `02-languages-browse.png`.

1. H1 “Browse languages & technologies”
2. Search filter
3. Grid cards: icon, name, description, total questions, Easy/Medium/Hard counts, “Browse questions”
4. Optional promo row: System Design track → `/categories/system-design` (no Live Coding sandbox)

Cut: Global Progress widget, Live Coding banner, DevPrep branding.

### 3. Question `/questions/[slug]`

Merge best of `03` + `04` into one layout.

**Main column**

1. Breadcrumb: Home › Language › Category › Question
2. Meta row: Easy/Medium/Hard · company chips · tags
3. Share button (native / copy link) — no Save until accounts
4. H1 = question title
5. Short intro / answer lead
6. `ad-in-article`
7. Sections: explanation, code examples (filename chrome), tips, common mistakes
8. Related questions
9. Comments: omit (deferred)

**Sidebar (desktop)**

1. `ad-sidebar` (primary)
2. Related questions (compact)
3. Optional “More in this language” links

Cut: Topic mastery, discussion thread, Open SQL Editor, Save.

### 4. Blog `/blog`

Inspired by `05-blog-listing.png`.

1. Same global header (Blog active)
2. Featured post (image + title + excerpt + read time + author if present)
3. Filter pills: All + blog categories
4. Two-column feed + sidebar: Popular posts, Recommended topics, `ad-sidebar`
5. Load more / pagination
6. Unified InterviewHub footer

### 5. Supporting pages (simple, same chrome)

About, Contact, Privacy, Terms — content pages, no marketing hero clutter.

---

## Component inventory (Phase 4)

| Component | Purpose |
|-----------|---------|
| `SiteHeader` | Global nav |
| `SiteFooter` | Global footer |
| `SearchBar` | Home + languages |
| `LanguageCard` | Browse grid |
| `QuestionListItem` | Home / listing rows |
| `DifficultyBadge` | Easy/Medium/Hard |
| `CompanyChip` / `TagChip` | Meta |
| `CodeBlock` | Dark themed examples |
| `Breadcrumbs` | SEO + UX |
| `AdSlot` | Placeholder with reserved height |
| `BlogCard` / `FeaturedPost` | Blog |
| `RelatedQuestions` | Question sidebar + bottom |

---

## Deferred (do not design into MVP screens)

- Auth, profile, bookmarks, comments, reading history
- Progress / mastery meters
- Live coding sandbox
- Newsletter until email capture is ready
- Roadmaps / mock interviews (footer link can 404 or “Soon” later)

Schema may still reserve tables in Phase 2.

---

## Implementation gate

Build UI only in Phase 4, after Phase 2–3 can feed content. This document is the source of truth over the PNG mockups.
