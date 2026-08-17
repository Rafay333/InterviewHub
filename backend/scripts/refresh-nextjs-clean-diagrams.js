/**
 * Re-render Next.js intermediate + expert explanation images with clean diagrams.
 * Updates existing question rows (does not insert duplicates).
 */
const { getPool, query, sql } = require("../src/config/db");
const { renderCleanDiagram } = require("../src/utils/cleanDiagram");

// Same Q stems + diagram specs as seed (matched by question text prefix)
const items = [
  {
    match: "What is the difference between the App Router and the Pages Router",
    diagram: {
      title: "App Router vs Pages Router",
      panels: [
        { h: "App Router (app/)", lines: ["layout.tsx · page.tsx", "loading.tsx · error.tsx", "Server Components by default", "route.ts for HTTP APIs"] },
        { h: "Pages Router (pages/)", lines: ["index.tsx maps to /", "getServerSideProps / SSG", "pages/api/* handlers", "Classic page files"] },
      ],
      footer: "New projects prefer App Router · Pages Router remains fully supported",
    },
  },
  {
    match: "What are React Server Components (RSC)",
    diagram: {
      title: "Server vs Client Components",
      panels: [
        { h: "Server Component", lines: ["Default in app/", "Can access DB and secrets", "No useState or browser APIs", "Less JavaScript to the browser"] },
        { h: "Client Component", lines: ['Starts with "use client"', "Hooks and event handlers", "Runs in the browser", "Add only where needed"] },
      ],
      footer: "Keep parents on the server · push client components to the leaves",
    },
  },
  {
    match: "How does file-based routing work in the App Router",
    diagram: {
      title: "File-based routing",
      panels: [
        { h: "Folders", lines: ["app/about/page.tsx", "app/posts/[id]/page.tsx", "app/blog/[...slug]/page.tsx", "Route groups: (marketing)"] },
        { h: "URLs", lines: ["/about", "/posts/42", "/blog/a/b", "Groups do not appear in the URL"] },
      ],
      footer: "Folders map to URL segments · special files define UI and APIs",
    },
  },
  {
    match: "What is the difference between static and dynamic routing",
    diagram: {
      title: "Static vs dynamic routes",
      panels: [
        { h: "Static", lines: ["app/about/page.tsx", "Fixed path /about", "Easy to cache and prebuild"] },
        { h: "Dynamic", lines: ["app/posts/[id]/page.tsx", "/posts/1 · /posts/2 …", "Optional generateStaticParams"] },
      ],
      footer: "One dynamic template covers many IDs",
    },
  },
  {
    match: "Explain layout.tsx and nested layouts",
    diagram: {
      title: "Nested layouts",
      panels: [
        { h: "Root layout", lines: ["app/layout.tsx", "html · body · site chrome", "Wraps the whole app"] },
        { h: "Nested layout", lines: ["app/dashboard/layout.tsx", "Sidebar + shared shell", "Inner page swaps on navigate"] },
      ],
      footer: "Outer UI stays mounted when only the child segment changes",
    },
  },
  {
    match: "What is loading.tsx and how does streaming work",
    diagram: {
      title: "Streaming with loading.tsx",
      panels: [
        { h: "First paint", lines: ["Navigation starts", "loading.tsx shown", "Shell is instant"] },
        { h: "Then stream", lines: ["Server finishes work", "Page content replaces skeleton", "Progressive HTML"] },
      ],
      footer: "Suspense boundaries let parts of the page arrive independently",
    },
  },
  {
    match: "How do you fetch data in Server Components",
    diagram: {
      title: "Server Component data flow",
      panels: [
        { h: "On the server", lines: ["async Page component", "await fetch or database", "Secrets stay server-side"] },
        { h: "To the client", lines: ["Serialized UI payload", "Hydrate client islands only", "No private keys in JS"] },
      ],
      footer: "Fetch on the server by default · choose cache and revalidate on purpose",
    },
  },
  {
    match: "What is the difference between CSR, SSR, SSG, and ISR",
    diagram: {
      title: "Rendering strategies",
      panels: [
        { h: "Static (SSG / ISR)", lines: ["Built ahead of time", "CDN cache", "ISR refreshes in the background"] },
        { h: "Dynamic (SSR / CSR)", lines: ["SSR: HTML per request", "CSR: render after JS loads", "Best for highly personal data"] },
      ],
      footer: "Pick based on freshness needs versus speed and cost",
    },
  },
  {
    match: "What are Route Handlers (route.ts)",
    diagram: {
      title: "HTTP APIs in Next.js",
      panels: [
        { h: "App Router", lines: ["app/api/hello/route.ts", "export async function GET()", "Web Request / Response"] },
        { h: "Pages Router", lines: ["pages/api/hello.ts", "default (req, res) handler", "Classic Node-style API"] },
      ],
      footer: "Prefer Route Handlers when the project uses App Router",
    },
  },
  {
    match: "What are Server Actions in Next.js",
    diagram: {
      title: "Server Action flow",
      panels: [
        { h: "Browser", lines: ["Form or button", "action={createItem}", "Can work without custom API"] },
        { h: "Server", lines: ['"use server" function', "Validate · auth · write DB", "revalidatePath / redirect"] },
      ],
      footer: "Great for mutations · still validate and authorize every input",
    },
  },
  {
    match: "How does next/image improve performance",
    diagram: {
      title: "next/image pipeline",
      panels: [
        { h: "Input", lines: ["Local /public or remote", "Often a large original"] },
        { h: "Optimized output", lines: ["Resize · modern formats", "Lazy load · priority LCP", "Stable layout sizing"] },
      ],
      footer: "Faster pages · less bandwidth · fewer layout shifts",
    },
  },
  {
    match: "How do you handle environment variables in Next.js",
    diagram: {
      title: "Environment variables",
      panels: [
        { h: "Server only", lines: ["DATABASE_URL", "API secrets", "Never exposed to the browser"] },
        { h: "Public (client)", lines: ["NEXT_PUBLIC_SITE_URL", "Analytics IDs", "Visible in the browser"] },
      ],
      footer: "Never put secrets in variables that start with NEXT_PUBLIC_",
    },
  },
  {
    match: "What is middleware.ts used for",
    diagram: {
      title: "Middleware pipeline",
      panels: [
        { h: "Request hits Edge", lines: ["middleware.ts runs first", "Inspect cookies / path"] },
        { h: "Possible outcomes", lines: ["Continue with next()", "Redirect", "Rewrite or set headers"] },
      ],
      footer: "Keep middleware light · do heavy work on the server later",
    },
  },
  {
    match: "How do you implement dynamic metadata and SEO",
    diagram: {
      title: "App Router SEO",
      panels: [
        { h: "Per page", lines: ["metadata object", "generateMetadata()", "title · description · OG"] },
        { h: "Site-wide files", lines: ["sitemap.ts", "robots.ts", "icons and opengraph-image"] },
      ],
      footer: "Unique titles and descriptions improve search snippets",
    },
  },
  {
    match: "What is the purpose of error.tsx and not-found.tsx",
    diagram: {
      title: "Error and not-found UI",
      panels: [
        { h: "error.tsx", lines: ["Client error boundary", "Shows error + reset()", "Isolates a segment"] },
        { h: "not-found.tsx", lines: ["404 experience", "Triggered by notFound()", "Missing page or record"] },
      ],
      footer: "A failure in one segment should not crash the whole shell",
    },
  },
  // Expert
  {
    match: "How does Next.js caching work",
    diagram: {
      title: "Next.js cache layers",
      panels: [
        { h: "Data Cache", lines: ["Cached fetch results", "Tags and revalidate time", "Server-side store"] },
        { h: "Route · Router Cache", lines: ["Static route payload", "Client navigation cache", "Invalidate path or tag"] },
      ],
      footer: "Stale UI usually means the wrong cache layer still hit",
    },
  },
  {
    match: "What is Partial Prerendering (PPR)",
    diagram: {
      title: "Partial Prerendering",
      panels: [
        { h: "Static shell", lines: ["Chrome and layout", "Marketing content", "Serves instantly"] },
        { h: "Dynamic regions", lines: ["Cart · price · user", "Stream when ready", "Suspense boundaries"] },
      ],
      footer: "Static exterior · dynamic interior on the same page",
    },
  },
  {
    match: "How do you design authentication securely",
    diagram: {
      title: "Auth checkpoints",
      panels: [
        { h: "Edge middleware", lines: ["Cookie present?", "Light redirects", "Cheap gate"] },
        { h: "Server layer", lines: ["Verify real session", "Check roles", "Authorize data and actions"] },
      ],
      footer: "Never trust the client alone for security",
    },
  },
  {
    match: "Explain generateStaticParams and generateMetadata",
    diagram: {
      title: "Dynamic SEO prebuild",
      panels: [
        { h: "generateStaticParams", lines: ["List popular ids", "Prebuild HTML", "Other ids on demand"] },
        { h: "generateMetadata", lines: ["Title per id", "Description · Open Graph", "Share data helpers with page"] },
      ],
      footer: "Prebuild high-traffic dynamic routes for CDN speed",
    },
  },
  {
    match: "How do parallel routes (@folder) and intercepting routes",
    diagram: {
      title: "Parallel and intercepting routes",
      panels: [
        { h: "Parallel slots", lines: ["@analytics + children", "Render several panes", "One shared layout"] },
        { h: "Intercept modal", lines: ["(.)./photo/[id]", "Soft open in context", "Hard URL still shareable"] },
      ],
      footer: "Advanced UI composition without losing real URLs",
    },
  },
  {
    match: "How should you structure data mutations with Server Actions",
    diagram: {
      title: "Mutation and revalidation",
      panels: [
        { h: "Server Action", lines: ["Authenticate", "Validate input", "Write to database"] },
        { h: "After write", lines: ["revalidateTag", "revalidatePath", "redirect or return state"] },
      ],
      footer: "Write first · invalidate caches so lists stay fresh",
    },
  },
  {
    match: "What are common Next.js performance pitfalls",
    diagram: {
      title: "Performance checklist",
      panels: [
        { h: "JavaScript weight", lines: ["Fewer client components", "Code-split heavy UI", "next/font for type"] },
        { h: "Network and render", lines: ["next/image", "Parallel data loading", "Stream with Suspense"] },
      ],
      footer: "Measure · reduce client JS · stream · cache with intent",
    },
  },
  {
    match: "How does next/font improve Core Web Vitals",
    diagram: {
      title: "next/font benefit",
      panels: [
        { h: "Without next/font", lines: ["Extra font CSS request", "Possible layout shift", "Slower text paint"] },
        { h: "With next/font", lines: ["Self-hosted at build", "Stable metrics", "Better CLS and LCP"] },
      ],
      footer: "Faster text · fewer layout jumps",
    },
  },
  {
    match: "How do you stream large responses or AI output",
    diagram: {
      title: "Streaming responses",
      panels: [
        { h: "Route Handler", lines: ["ReadableStream body", "Write chunks over time", "Correct headers"] },
        { h: "UI streaming", lines: ["RSC / Suspense", "Client reader", "Cancel on navigate away"] },
      ],
      footer: "Progressive tokens beat waiting for the full reply",
    },
  },
  {
    match: "Explain multi-zone / monorepo deployment",
    diagram: {
      title: "Zones under one domain",
      panels: [
        { h: "Main app", lines: ["/ and /pricing", "Primary Next deploy"] },
        { h: "Docs zone", lines: ["/docs/* rewrite", "Separate app deploy", "Own release cycle"] },
      ],
      footer: "One domain for users · independent ownership for teams",
    },
  },
  {
    match: "How do you prevent sensitive data leaks",
    diagram: {
      title: "Server · client trust boundary",
      panels: [
        { h: "Server only", lines: ["Database clients", "API secrets", "server-only imports"] },
        { h: "Safe to share", lines: ["Public props only", "Stripped DTOs", "No private fields"] },
      ],
      footer: "Default deny secrets to any client graph",
    },
  },
  {
    match: "How does Next.js handle static export",
    diagram: {
      title: "Hosting modes",
      panels: [
        { h: "Static export", lines: ["output: 'export'", "CDN / object storage", "No Node server features"] },
        { h: "Node or Edge host", lines: ["SSR and ISR", "Server Actions", "Route Handlers"] },
      ],
      footer: "Choose the host for the features you need",
    },
  },
  {
    match: "How do you instrument observability",
    diagram: {
      title: "Observability stack",
      panels: [
        { h: "Client", lines: ["Web Vitals", "Error reporting", "Product analytics"] },
        { h: "Server", lines: ["Structured logs", "Traces", "Uptime checks"] },
      ],
      footer: "You cannot fix what you do not measure",
    },
  },
  {
    match: "What is the difference between Edge Runtime and Node.js Runtime",
    diagram: {
      title: "Runtimes",
      panels: [
        { h: "Edge", lines: ["Fast cold starts", "Limited APIs", "Middleware default"] },
        { h: "Node.js", lines: ["Full Node APIs", "Native modules", "Heavier data work"] },
      ],
      footer: "Match runtime to packages and latency needs",
    },
  },
  {
    match: "How would you migrate a large Pages Router app",
    diagram: {
      title: "Incremental migration",
      panels: [
        { h: "Phase 1", lines: ["Keep pages/ running", "Ship new routes in app/", "Share UI packages"] },
        { h: "Later phases", lines: ["Port key funnels", "Unify auth and data", "Retire pages last"] },
      ],
      footer: "Coexist first · cut over gradually · avoid a big-bang rewrite",
    },
  },
];

async function main() {
  await getPool();

  const langs = await query(
    `SELECT id, name FROM dbo.languages WHERE name LIKE N'%Next%'`,
  );
  const lang = langs.recordset[0];
  if (!lang) {
    console.error("Next.js language not found");
    process.exit(1);
  }
  console.log("Language:", lang.name, lang.id);

  const qs = await query(
    `SELECT id, question_text, difficulty, description_image_url
     FROM dbo.questions
     WHERE language_id = @id
       AND difficulty IN ('intermediate', 'expert')`,
    { id: { type: sql.UniqueIdentifier, value: lang.id } },
  );

  let updated = 0;
  let missed = 0;

  for (const row of qs.recordset) {
    const spec = items.find((it) =>
      String(row.question_text || "").startsWith(it.match),
    );
    if (!spec) {
      console.warn("No diagram map for:", String(row.question_text).slice(0, 70));
      missed += 1;
      continue;
    }
    const url = renderCleanDiagram(spec.diagram);
    if (!url) {
      console.error("render failed for", row.id);
      continue;
    }
    await query(
      `UPDATE dbo.questions
       SET description_image_url = @url, updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: row.id },
        url: { type: sql.NVarChar(500), value: url },
      },
    );
    updated += 1;
    process.stdout.write(".");
  }

  console.log(`\nUpdated images: ${updated}, unmatched: ${missed}`);
  process.exit(0);
}

module.exports = { items };

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
