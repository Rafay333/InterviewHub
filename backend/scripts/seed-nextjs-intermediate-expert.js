/**
 * Seed Next.js Intermediate (15) + Expert (15) with full explanation diagrams.
 * Idempotent: skips if intermediate for Next.js already has content.
 */
const fs = require("fs");
const path = require("path");
const { query, sql, getPool } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { uploadRoot } = require("../src/middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";

const intermediate = [
  {
    q: "What is the difference between the App Router and the Pages Router in Next.js?",
    a: "The App Router (app/) uses React Server Components, nested layouts, and route handlers with file conventions like page.tsx and layout.tsx. The Pages Router (pages/) uses file-based pages, getServerSideProps/getStaticProps, and API routes under pages/api.",
    e: "App Router is the recommended default for new projects: better streaming, nested layouts, and server-first data. Pages Router remains fully supported. Migration can be gradual—both can coexist in one project carefully.",
    diagram: {
      title: "App Router vs Pages Router",
      panels: [
        { h: "app/", lines: ["layout.tsx", "page.tsx", "loading.tsx", "error.tsx", "route.ts (API)"] },
        { h: "pages/", lines: ["index.tsx → /", "about.tsx → /about", "api/hello.ts", "getServerSideProps"] },
      ],
      footer: "App Router = RSC + nested layouts · Pages Router = classic page files",
    },
  },
  {
    q: "What are React Server Components (RSC) in Next.js?",
    a: "Server Components render on the server by default in the App Router. They can access server-only resources (DB, secrets, fs) and send a serialized UI payload to the client—without shipping their JS bundle for that component tree.",
    e: "Benefits: smaller client JS, secrets stay server-side, direct data fetching near the source. Limitations: no useState/useEffect/browser APIs in Server Components. Add \"use client\" only where interactivity is needed.",
    diagram: {
      title: "Server vs Client Components",
      panels: [
        { h: "Server Component", lines: ["Default in app/", "Fetch DB / files", "No useState", "No bundle cost"] },
        { h: "Client Component", lines: ['"use client"', "useState / effects", "Event handlers", "Ships JS to browser"] },
      ],
      footer: "Push \"use client\" to the leaves — keep parents as Server Components",
    },
  },
  {
    q: "How does file-based routing work in the App Router?",
    a: "Folders under app/ define URL segments. Special files: page.tsx (UI), layout.tsx (shared UI), loading.tsx, error.tsx, not-found.tsx, route.ts (HTTP handlers).",
    e: "Dynamic segments use [id], catch-all [...slug], optional [[...slug]]. Route groups (folder) organize without affecting the URL. Parallel routes use @slot folders for advanced layouts.",
    diagram: {
      title: "Next.js File-Based Routing",
      panels: [
        {
          h: "Folder Structure",
          lines: ["app/", "  about/page.tsx", "  posts/[id]/page.tsx", "  blog/[...slug]/page.tsx"],
        },
        {
          h: "Generated Routes",
          lines: ["/about", "/posts/42", "/blog/a/b/c", "(route groups don't show in URL)"],
        },
      ],
      footer: "Benefits: automatic routing · no config · clean structure · SEO friendly",
    },
  },
  {
    q: "What is the difference between static and dynamic routing in Next.js?",
    a: "Static routes map 1:1 to files/folders (e.g. app/about/page.tsx → /about). Dynamic routes use brackets like [id] to match variable path segments at runtime.",
    e: "Static: predictable pages, easy to cache/prerender. Dynamic: one template for many resources. Combine with generateStaticParams to prebuild popular dynamic paths at build time.",
    diagram: {
      title: "Static vs Dynamic Routes",
      panels: [
        { h: "Static", lines: ["app/about/page.tsx", "→ /about", "Fixed path", "Often fully static"] },
        { h: "Dynamic", lines: ["app/posts/[id]/page.tsx", "→ /posts/1, /posts/2…", "Variable segment", "Optional generateStaticParams"] },
      ],
      footer: "Dynamic segments let one page cover many content IDs",
    },
  },
  {
    q: "Explain layout.tsx and nested layouts.",
    a: "layout.tsx wraps child routes with shared UI (nav, sidebar) and preserves state across navigations within that segment. Layouts nest automatically with the folder tree.",
    e: "Root app/layout.tsx wraps the whole app (html/body). Nested layouts re-render only the deep segment on navigation, which keeps outer UI stable and enables faster transitions.",
    diagram: {
      title: "Nested layouts",
      panels: [
        { h: "app/layout.tsx", lines: ["<html>", "  Header", "  {children}", "</html>"] },
        { h: "app/dashboard/layout.tsx", lines: ["Sidebar", "{children}", "Only dashboard", "segment remounts inner"] },
      ],
      footer: "Outer layout stays mounted when switching inner pages",
    },
  },
  {
    q: "What is loading.tsx and how does streaming work?",
    a: "loading.tsx defines an instant loading UI (Suspense boundary) for a route segment. Next.js can stream HTML as server work finishes instead of waiting for the whole page.",
    e: "Combine with fetch caching and Suspense-friendly async Server Components. Users see shell + skeleton first, then content streams in—better perceived performance.",
    diagram: {
      title: "Streaming with loading.tsx",
      panels: [
        { h: "Request", lines: ["Browser navigates", "Server starts RSC", "loading.tsx sent first"] },
        { h: "Stream", lines: ["Skeleton UI", "→ data ready", "→ page content", "Progressive HTML"] },
      ],
      footer: "Suspense boundaries stream UI pieces independently",
    },
  },
  {
    q: "How do you fetch data in Server Components?",
    a: "Use async Server Components and await fetch (or a DB client) directly in the component or a helper. Next extends fetch with caching and revalidation options.",
    e: "Example: const res = await fetch(url, { next: { revalidate: 60 } }). Prefer server-side fetch for SEO and secrets. Use cache: 'no-store' for fully dynamic, personalized data.",
    diagram: {
      title: "Server Component data flow",
      panels: [
        { h: "Server", lines: ["async function Page()", "await fetch / DB", "serialize RSC payload"] },
        { h: "Client", lines: ["Receive HTML/RSC", "Hydrate client islands", "No server secrets"] },
      ],
      footer: "Fetch on the server by default · cache/revalidate deliberately",
    },
  },
  {
    q: "What is the difference between CSR, SSR, SSG, and ISR in Next.js?",
    a: "CSR renders in the browser after JS loads. SSR renders HTML per request on the server. SSG prebuilds HTML at build time. ISR regenerates static pages in the background after a revalidate window.",
    e: "App Router expresses these via dynamic APIs, fetch cache, revalidate, and generateStaticParams—not only getServerSideProps. Pick based on freshness needs vs TTFB/CDN cost.",
    diagram: {
      title: "Rendering strategies",
      panels: [
        { h: "SSG / ISR", lines: ["Build or revalidate", "CDN cache", "Fast TTFB"] },
        { h: "SSR / Dynamic", lines: ["Per request", "Fresh data", "Higher server cost"] },
      ],
      footer: "CSR: client-only UI · SSG+ISR: cache-friendly · SSR: always fresh",
    },
  },
  {
    q: "What are Route Handlers (route.ts) vs Pages API routes?",
    a: "In App Router, route.ts/js exports HTTP method functions (GET, POST, …) for a path. In Pages Router, pages/api/* handlers receive req/res Node-style (or Web adapters).",
    e: "Route Handlers use the Web Request/Response API and fit the app/ tree. Use them for JSON APIs, webhooks, and streaming responses. Prefer Server Actions for form mutations from React trees when appropriate.",
    diagram: {
      title: "API styles in Next.js",
      panels: [
        { h: "app/api/hello/route.ts", lines: ["export async function GET()", "return Response.json()", "Web Request/Response"] },
        { h: "pages/api/hello.ts", lines: ["export default handler", "req, res", "Classic API routes"] },
      ],
      footer: "New code → Route Handlers in app/ when using App Router",
    },
  },
  {
    q: "What are Server Actions in Next.js?",
    a: "Server Actions are async server functions (\"use server\") callable from Client or Server Components—often bound to forms for progressive enhancement mutations.",
    e: "They reduce boilerplate API routes for mutations, run on the server with access to secrets, and pair with revalidatePath/revalidateTag. Still design CSRF/auth carefully and validate all inputs.",
    diagram: {
      title: "Server Action flow",
      panels: [
        { h: "Client Form", lines: ["<form action={create}>", "Submit", "Optimistic UI optional"] },
        { h: "Server Action", lines: ['"use server"', "validate + write DB", "revalidatePath", "return / redirect"] },
      ],
      footer: "Mutations without a dedicated API route for simple cases",
    },
  },
  {
    q: "How does next/image improve performance?",
    a: "next/image optimizes images (resize, modern formats, lazy loading, prevent layout shift via sizing) through an image optimization pipeline.",
    e: "Always set width/height or fill + sizes. Configure remotePatterns for external hosts. Use priority for above-the-fold LCP images. Avoid huge unoptimized source assets.",
    diagram: {
      title: "next/image pipeline",
      panels: [
        { h: "Source", lines: ["Remote or /public", "Large original"] },
        { h: "Optimizer", lines: ["Resize", "WebP/AVIF", "Lazy + priority", "Cache headers"] },
      ],
      footer: "Faster LCP · less bandwidth · fewer layout shifts",
    },
  },
  {
    q: "How do you handle environment variables in Next.js?",
    a: "Server-only secrets live in process.env without NEXT_PUBLIC_. Variables prefixed NEXT_PUBLIC_ are inlined into the client bundle—never put secrets there.",
    e: "Use .env.local for local secrets (gitignored). In production set env on the host. Server Components and Route Handlers can safely read non-public env. Restart dev server after env changes.",
    diagram: {
      title: "Environment variables",
      panels: [
        { h: "Server only", lines: ["DATABASE_URL", "API_SECRET", "Never to browser"] },
        { h: "Client (public)", lines: ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_GA_ID", "Visible to users"] },
      ],
      footer: "No secret should start with NEXT_PUBLIC_",
    },
  },
  {
    q: "What is middleware.ts used for?",
    a: "middleware.ts runs on the Edge before a request completes, for rewrites, redirects, headers, auth gates, and A/B routing based on cookies/geo.",
    e: "Keep middleware lightweight—no heavy DB. Match paths with the matcher config. Authentication often checks a session cookie then redirects unauthenticated users. Complex logic belongs in server code for the route.",
    diagram: {
      title: "Middleware request pipeline",
      panels: [
        { h: "Request", lines: ["Browser → Edge", "middleware.ts"] },
        { h: "Outcomes", lines: ["Next() continue", "Redirect", "Rewrite URL", "Set headers/cookies"] },
      ],
      footer: "Runs before rendering the matched route",
    },
  },
  {
    q: "How do you implement dynamic metadata and SEO in the App Router?",
    a: "Export generateMetadata (or a static metadata object) from page/layout files to set title, description, openGraph, and more. Use file-based icons and sitemap generators as needed.",
    e: "Async generateMetadata can fetch data for dynamic titles. Prefer unique titles per page. Combine with robots.ts, sitemap.ts, and proper heading structure for SEO.",
    diagram: {
      title: "App Router SEO pieces",
      panels: [
        { h: "metadata / generateMetadata", lines: ["title", "description", "openGraph", "robots"] },
        { h: "Site files", lines: ["sitemap.ts", "robots.ts", "icon.png", "opengraph-image"] },
      ],
      footer: "Unique metadata per page improves search snippets",
    },
  },
  {
    q: "What is the purpose of error.tsx and not-found.tsx?",
    a: "error.tsx is an error boundary for a segment (must be a Client Component). not-found.tsx renders when notFound() is called or a route is missing.",
    e: "error.tsx receives error and reset to retry. Keep sensitive stack details out of production UI. Global app/global-error.tsx handles root layout failures. Use notFound() inside data loading when a resource is missing.",
    diagram: {
      title: "Error & not-found boundaries",
      panels: [
        { h: "error.tsx", lines: ["Client boundary", "error + reset()", "Segment isolation"] },
        { h: "not-found.tsx", lines: ["404 UI", "notFound()", "Missing entity"] },
      ],
      footer: "Failures in one segment shouldn't crash the whole shell",
    },
  },
];

const expert = [
  {
    q: "How does Next.js caching work (fetch cache, Full Route Cache, Router Cache)?",
    a: "Next layers caches: the Data Cache (fetch/unstable_cache results), Full Route Cache (static RSC/HTML on server), and client Router Cache (visited segments). Revalidation invalidates by time or tag/path.",
    e: "Mind interaction: dynamic functions (cookies, headers, no-store) opt into dynamic rendering. Use revalidateTag/Path after mutations. Debugging wrong data almost always involves unexpected cache hits.",
    diagram: {
      title: "Next.js cache layers",
      panels: [
        { h: "Data Cache", lines: ["fetch results", "tags + revalidate", "Server memory/disk"] },
        { h: "Route + Router Cache", lines: ["Static RSC payload", "Client segment cache", "Navigate soft"] },
      ],
      footer: "Know which layer you invalidates: time · tag · path · no-store",
    },
  },
  {
    q: "What is Partial Prerendering (PPR) and when would you use it?",
    a: "PPR (experimental/rolling out) serves a static shell instantly while streaming dynamic holes that resolve later—combining static speed with dynamic parts on one page.",
    e: "Mark static-friendly shell + Suspense for dynamic regions. Ideal for e-commerce product pages: static layout/marketing + dynamic price/cart. Requires careful cache boundaries.",
    diagram: {
      title: "Partial Prerendering idea",
      panels: [
        { h: "Static shell", lines: ["Header", "Layout chrome", "Marketing blocks", "Instant HTML"] },
        { h: "Dynamic holes", lines: ["User cart", "Personalized price", "Stream when ready"] },
      ],
      footer: "One page · static exterior · dynamic interior streams",
    },
  },
  {
    q: "How do you design authentication securely with App Router + middleware?",
    a: "Store sessions (or JWT cookies) as HttpOnly Secure cookies. Middleware does cheap gatekeeping (cookie presence / edge verify). Heavy session validation on Server Components/Route Handlers after.",
    e: "Prefer established libs (Auth.js/NextAuth, Clerk, custom session tables). Never trust middleware alone for authorization of sensitive data—re-check on server. Protect Server Actions with auth checks too.",
    diagram: {
      title: "Auth checkpoints",
      panels: [
        { h: "Edge middleware", lines: ["Cookie present?", "Redirect /login", "Cheap checks"] },
        { h: "Server layer", lines: ["Verify session", "Load user roles", "Authorize data/actions"] },
      ],
      footer: "Gate at edge · authorize at server · never client-only security",
    },
  },
  {
    q: "Explain generateStaticParams and generateMetadata for dynamic SEO pages.",
    a: "generateStaticParams returns paths to pre-render for dynamic segments at build (or more over time). generateMetadata builds per-path titles/OG from the same params/data.",
    e: "Return the important subset of IDs at build; leave rare ones dynamic or on-demand. Keep metadata fetches efficient and share data helpers with page.tsx to avoid double-fetch where possible.",
    diagram: {
      title: "Dynamic SEO prebuild",
      panels: [
        { h: "generateStaticParams", lines: ["[{ id: '1' }, …]", "Prebuild popular", "Others on demand"] },
        { h: "generateMetadata", lines: ["Title per id", "Description / OG", "Uses same data"] },
      ],
      footer: "Prebuild high-traffic dynamic routes for CDN speed",
    },
  },
  {
    q: "How do parallel routes (@folder) and intercepting routes (.) work?",
    a: "Parallel routes render multiple page slots in one layout (e.g. @modal + children). Intercepting routes soft-show a route in-context (modal) while preserving a shareable hard URL.",
    e: "Classic pattern: photo grid with intercept modal on click, and full page on refresh/share. Naming conventions: (.) same level, (..) parent, etc. Combine carefully with default.tsx slots.",
    diagram: {
      title: "Parallel + intercepting routes",
      panels: [
        { h: "Parallel slots", lines: ["layout: children", "@analytics", "@team", "Simultaneous pages"] },
        { h: "Intercept modal", lines: ["(.)./photo/[id]", "Soft navigation", "Hard URL shareable"] },
      ],
      footer: "Advanced UI composition without losing routing URLs",
    },
  },
  {
    q: "How should you structure data mutations with Server Actions + revalidation?",
    a: "Put validation + auth + DB write in a Server Action, then call revalidatePath/revalidateTag so cached reads refresh. Optionally return state for useFormState UX.",
    e: "Idempotency, rate limits, and zod/yup validation matter. Prefer tag-based revalidation for shared data. Avoid embedding secrets in client. Use redirect() after successful creates when navigating away.",
    diagram: {
      title: "Mutation + cache revalidation",
      panels: [
        { h: "Action", lines: ["auth", "validate input", "write DB"] },
        { h: "After", lines: ["revalidateTag", "revalidatePath", "redirect / return"] },
      ],
      footer: "Write then invalidate — don't leave stale ISR forever",
    },
  },
  {
    q: "What are common Next.js performance pitfalls and fixes?",
    a: "Shipping large client bundles, missing image optimization, waterfall fetches, overusing \"use client\", unbounded dynamic rendering, and blocking the entire page instead of Suspense boundaries.",
    e: "Audit with React/Next bundles, Lighthouse, and server logs. Split client islands, stream with Suspense, cache safely, compress fonts (next/font), and keep third-party scripts under next/script strategy.",
    diagram: {
      title: "Performance checklist",
      panels: [
        { h: "JS weight", lines: ["Minimize client", "Code-split", "next/font", "dynamic import"] },
        { h: "Network", lines: ["next/image", "parallel fetch", "cache / CDN", "stream UI"] },
      ],
      footer: "Measure · reduce client · stream · cache deliberately",
    },
  },
  {
    q: "How does next/font improve Core Web Vitals?",
    a: "next/font self-hosts fonts at build time, eliminates external font CSS round-trips, and applies size-adjust options that reduce layout shift (CLS).",
    e: "Import from next/font/google or local. Apply className on layout body. Subset weights. Avoid multiple competing font stacks on critical UI.",
    diagram: {
      title: "next/font benefit",
      panels: [
        { h: "Without", lines: ["Request Google CSS", "Extra latency", "Possible FOUT/CLS"] },
        { h: "With next/font", lines: ["Self-hosted files", "Build-time optimize", "Stable layout"] },
      ],
      footer: "Faster text rendering · better CLS/LCP profiles",
    },
  },
  {
    q: "How do you stream large responses or AI output with Next.js?",
    a: "Return a streaming Web Response (ReadableStream) from a Route Handler, or use React streaming UI (Suspense / AI SDK) for token-by-token UI updates.",
    e: "Set correct headers; handle abort/cancel. Don't buffer entire LLMs in memory. For UI streaming, keep a Client Component consumer. Secure endpoints—streaming doesn't mean public unlimited.",
    diagram: {
      title: "Streaming responses",
      panels: [
        { h: "Route Handler", lines: ["ReadableStream", "chunk write", "Response body"] },
        { h: "UI path", lines: ["RSC stream", "Suspense", "Client reader"] },
      ],
      footer: "Progressive bytes/tokens beat all-or-nothing waits",
    },
  },
  {
    q: "Explain multi-zone / monorepo deployment patterns with Next.js.",
    a: "Multi-zones compose multiple Next apps under one domain via rewrites (e.g. /docs → docs app). Monorepos share packages (UI, eslint) across apps with turborepo/pnpm workspaces.",
    e: "Zones need careful basePath/assetPrefix. Shared packages should stay framework-agnostic where possible. Deploy independently for team ownership but align cookie domain/auth carefully.",
    diagram: {
      title: "Zones under one domain",
      panels: [
        { h: "marketing.app", lines: ["/", "/pricing", "Main Next app"] },
        { h: "docs.app zone", lines: ["/docs/* rewrite", "Separate deploy", "Own pipeline"] },
      ],
      footer: "One domain UX · independent deploy ownership",
    },
  },
  {
    q: "How do you prevent sensitive data leaks between Server and Client Components?",
    a: "Never import server-only modules into client graphs. Pass only serializable public props. Use the server-only package to fail builds on accidental client imports of secrets.",
    e: "Server Actions and handlers must re-auth; client can spoof nothing trusted. Strip DTO fields. Watch env NEXT_PUBLIC leaks. RSC payloads should not include private fields \"just in case\".",
    diagram: {
      title: "Trust boundary",
      panels: [
        { h: "Server only", lines: ["DB clients", "Secrets", "server-only package"] },
        { h: "Crossable", lines: ["Public props", "Safe DTOs", "No private fields"] },
      ],
      footer: "Default deny secrets to the client graph",
    },
  },
  {
    q: "How does Next.js handle static export (output: 'export') limitations?",
    a: "Static export produces pure HTML/CSS/JS for static hosts—no Node server features: no SSR dynamic server functions, limited Image optimization defaults, no middleware-dependent server routes in the same way.",
    e: "Use when hosting on pure CDNs/S3. If you need SSR/ISR/Server Actions, deploy to Node/Edge platforms that run Next. Know output:'export' trade-offs before choosing.",
    diagram: {
      title: "Hosting modes",
      panels: [
        { h: "Static export", lines: ["out/", "CDN only", "No server features"] },
        { h: "Node / Edge runtime", lines: ["SSR / ISR", "Server Actions", "Route Handlers"] },
      ],
      footer: "Pick host for features — not after the fact",
    },
  },
  {
    q: "How do you instrument observability for a production Next.js app?",
    a: "Collect server logs, OpenTelemetry traces, Web Vitals (useReportWebVitals), error tracking (Sentry), and uptime for critical routes/actions.",
    e: "Tag releases. Sample traces. Capture route/action names. Monitor cache hit rates and TTFB. Client errors + server errors both matter; correlate with deployment version.",
    diagram: {
      title: "Observability stack",
      panels: [
        { h: "Client", lines: ["Web Vitals", "Error boundary", "Analytics"] },
        { h: "Server", lines: ["Logs + traces", "Error tracker", "Uptime checks"] },
      ],
      footer: "You can't fix what you don't measure",
    },
  },
  {
    q: "What is the difference between Edge Runtime and Node.js Runtime in Next.js?",
    a: "Edge Runtime is a lightweight V8 isolate (subset of APIs) great for low latency at the edge. Node.js Runtime has full Node APIs (fs, native modules) suitable for heavy server work.",
    e: "Middleware runs Edge. Route Handlers/Server components can choose runtimes. Don't assume npm packages work on Edge—check compatibility. Prefer Node for traditional ORMs unless edge-ready.",
    diagram: {
      title: "Runtimes",
      panels: [
        { h: "Edge", lines: ["Fast cold start", "Limited APIs", "Middleware default"] },
        { h: "Node.js", lines: ["Full Node", "Native modules", "Heavy DB drivers"] },
      ],
      footer: "Match runtime to dependency APIs + latency needs",
    },
  },
  {
    q: "How would you migrate a large Pages Router app to App Router safely?",
    a: "Migrate incrementally: leave pages/ running, adopt app/ for new routes, port high-value sections first, replace getServerSideProps with RSC/fetch patterns, and retest SEO/auth thoroughly.",
    e: "Watch link behavior, API rewrites, and shared layouts. Avoid big-bang rewrites. Codemod helpers exist but still need human review for data fetching and client boundaries.",
    diagram: {
      title: "Incremental migration",
      panels: [
        { h: "Phase 1", lines: ["Keep pages/", "New routes in app/", "Shared UI packages"] },
        { h: "Phase 2+", lines: ["Port key funnels", "Unify auth/data", "Deprecate pages/*"] },
      ],
      footer: "Coexistence → gradual cutover → delete Pages last",
    },
  },
];

function ensureUploadDir() {
  if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
}

function savePng(buffer, name) {
  ensureUploadDir();
  const filename = `${Date.now()}-${name.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.png`;
  fs.writeFileSync(path.join(uploadRoot, filename), buffer);
  return `${BASE}/uploads/${filename}`;
}

function createDiagramMaker() {
  let createCanvas;
  try {
    ({ createCanvas } = require("@napi-rs/canvas"));
  } catch {
    console.warn("canvas missing — seeding without images");
    return null;
  }

  return function makeFullDiagram({ title, panels, footer }) {
    const w = 960;
    const headerH = 72;
    const footerH = footer ? 52 : 24;
    const panelH = 260;
    const h = headerH + panelH + footerH + 40;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");

    // Background matching site wash
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#eff6ff");
    grad.addColorStop(0.55, "#ffffff");
    grad.addColorStop(1, "#fff7ed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top accent bar
    const bar = ctx.createLinearGradient(0, 0, w, 0);
    bar.addColorStop(0, "#2563eb");
    bar.addColorStop(0.5, "#0d9488");
    bar.addColorStop(1, "#ea580c");
    ctx.fillStyle = bar;
    ctx.fillRect(0, 0, w, 6);

    // Title
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(title, 36, 48);

    const n = Math.max(panels.length, 1);
    const gap = 24;
    const side = 36;
    const usable = w - side * 2 - gap * (n - 1);
    const pw = usable / n;
    const colors = ["#2563eb", "#0d9488", "#ea580c", "#7c3aed"];

    panels.forEach((p, i) => {
      const x = side + i * (pw + gap);
      const y = headerH + 8;
      // Card
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x, y, pw, panelH, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(37,99,235,0.18)";
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, pw, panelH, 18);
      ctx.stroke();

      // Header chip
      ctx.fillStyle = colors[i % colors.length];
      roundRect(ctx, x + 16, y + 16, pw - 32, 44, 12);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(p.h, x + 28, y + 44);

      // Lines
      ctx.fillStyle = "#0f172a";
      ctx.font = "16px sans-serif";
      let ly = y + 90;
      (p.lines || []).forEach((line) => {
        const text = `• ${line}`;
        // simple multi-line wrap
        const words = text.split(" ");
        let cur = "";
        words.forEach((word, wi) => {
          const test = cur ? `${cur} ${word}` : word;
          if (ctx.measureText(test).width > pw - 48 && cur) {
            ctx.fillText(cur, x + 24, ly);
            ly += 24;
            cur = word;
          } else {
            cur = test;
          }
          if (wi === words.length - 1) {
            ctx.fillText(cur, x + 24, ly);
            ly += 28;
          }
        });
      });
    });

    if (footer) {
      ctx.fillStyle = "#334155";
      ctx.font = "15px sans-serif";
      wrapText(ctx, footer, side, h - 28, w - side * 2, 20);
    }

    return savePng(canvas.toBuffer("image/png"), title);
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(" ");
  let line = "";
  let cy = y;
  for (let n = 0; n < words.length; n += 1) {
    const test = `${line}${words[n]} `;
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = `${words[n]} `;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy;
}

async function findNextLang() {
  const langs = await languageService.listLanguages();
  return langs.find(
    (l) =>
      /next\.?js/i.test(l.name) ||
      /nextjs/i.test(l.slug || "") ||
      /next/i.test(l.name),
  );
}

async function hasIntermediate(languageId) {
  const r = await query(
    `SELECT COUNT_BIG(1) AS n FROM dbo.questions
     WHERE language_id = @id AND difficulty = 'intermediate'`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return Number(r.recordset[0].n) > 0;
}

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;

  const lang = await findNextLang();
  if (!lang) {
    console.error("Next.js language not found. Create it in admin first.");
    process.exit(1);
  }
  console.log(`Using language: ${lang.name} (${lang.id})`);

  if (await hasIntermediate(lang.id)) {
    console.log("Intermediate questions already exist — aborting to avoid duplicates.");
    console.log("Delete intermediate/expert Next.js questions in admin if you want a clean re-seed.");
    process.exit(0);
  }

  const makeDiagram = createDiagramMaker();
  let i = 0;
  let e = 0;

  for (const item of intermediate) {
    const descriptionImageUrl = makeDiagram ? makeDiagram(item.diagram) : null;
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty: "intermediate",
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    i += 1;
    process.stdout.write(`I${i} `);
  }

  for (const item of expert) {
    const descriptionImageUrl = makeDiagram ? makeDiagram(item.diagram) : null;
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty: "expert",
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    e += 1;
    process.stdout.write(`E${e} `);
  }

  console.log(`\nDone. Intermediate: ${i}, Expert: ${e}`);
  console.log("Admin counts should show ~15 / 15 / 15 for Next.js.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
