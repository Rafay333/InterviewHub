/**
 * Seed .NET Intermediate (15) + Expert (15) with clean explanation diagrams.
 */
const { getPool, query, sql } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { renderCleanDiagram } = require("../src/utils/cleanDiagram");

const intermediate = [
  {
    q: "What is the difference between a class and a struct in C#?",
    a: "A class is a reference type allocated on the heap (with GC). A struct is a value type, usually stack-allocated or inlined, copied by value, and should be small and immutable when possible.",
    e: "Use classes for complex objects with identity and shared mutation. Prefer structs for small data carriers (Point, coordinates). Boxing value types into object/interface allocates on the heap—watch performance in hot paths.",
    diagram: {
      title: "Class vs struct",
      panels: [
        { h: "Class (reference)", lines: ["Heap allocation", "Passed by reference", "Supports inheritance", "GC-managed lifetime"] },
        { h: "Struct (value)", lines: ["Often stack / inlined", "Copied by value", "No inheritance", "Keep small · prefer immutable"] },
      ],
      footer: "Choose based on size, mutability, and identity — not habit alone",
    },
  },
  {
    q: "Explain IEnumerable vs IQueryable in .NET.",
    a: "IEnumerable executes enumeration in memory (typically LINQ-to-Objects). IQueryable builds an expression tree so a provider (e.g. EF Core) can translate queries to SQL.",
    e: "Composing on IQueryable keeps filters on the database. Calling ToList too early or using unsupported methods can force client evaluation. Prefer IQueryable until you intentionally materialize.",
    diagram: {
      title: "IEnumerable vs IQueryable",
      panels: [
        { h: "IEnumerable", lines: ["In-memory sequences", "LINQ-to-Objects", "Delegates · Func"] },
        { h: "IQueryable", lines: ["Expression trees", "EF / remote providers", "SQL can be generated"] },
      ],
      footer: "Materialize with ToList only when you need results in memory",
    },
  },
  {
    q: "What is dependency injection and how does ASP.NET Core use it?",
    a: "DI supplies dependencies from outside a type instead of new-ing them inside. ASP.NET Core has a built-in container via IServiceCollection and constructor injection.",
    e: "Register services as Transient, Scoped, or Singleton. Prefer constructor injection for testability. Avoid service locator patterns and captive dependencies (e.g. singleton holding scoped DbContext).",
    diagram: {
      title: "Dependency injection lifetimes",
      panels: [
        { h: "Lifetimes", lines: ["Transient — new each time", "Scoped — per request", "Singleton — one app-wide"] },
        { h: "ASP.NET Core", lines: ["Program.cs registrations", "Constructor inject", "Avoid captive deps"] },
      ],
      footer: "Right lifetime prevents bugs and resource leaks",
    },
  },
  {
    q: "What is the difference between Task and ValueTask?",
    a: "Task always represents an asynchronous operation as a reference type. ValueTask can avoid allocation when results are often already completed, but has stricter usage rules.",
    e: "Default to Task for most APIs. Consider ValueTask for high-throughput hot paths with frequent sync completion. Never await a ValueTask more than once unless you understand the contract.",
    diagram: {
      title: "Task vs ValueTask",
      panels: [
        { h: "Task", lines: ["Reference type", "Simple mental model", "Best default"] },
        { h: "ValueTask", lines: ["Can skip alloc", "Hot-path optimization", "Use carefully"] },
      ],
      footer: "Readability and safety first · optimize with ValueTask only when measured",
    },
  },
  {
    q: "Explain async and await in C#.",
    a: "async methods can use await to non-blockingly wait for Tasks. The compiler generates a state machine that resumes when the awaited operation completes.",
    e: "Avoid async void except event handlers. Prefer ConfigureAwait(false) in library code. Don't block on async with .Result or .Wait() in ASP.NET — it can deadlock or waste threads.",
    diagram: {
      title: "async / await flow",
      panels: [
        { h: "Call", lines: ["async method starts", "Hits await", "Returns incomplete Task"] },
        { h: "Resume", lines: ["IO finishes", "Continuation runs", "Method completes"] },
      ],
      footer: "Free threads while waiting on IO — never block the thread pool",
    },
  },
  {
    q: "What is Entity Framework Core change tracking?",
    a: "EF Core tracks loaded entities and detects property changes so SaveChanges can generate the right INSERT/UPDATE/DELETE SQL.",
    e: "Tracking costs memory. Use AsNoTracking() for read-only queries. Detached entities need Attach/Update carefully. Prefer explicit updates over blind Update of full graphs when possible.",
    diagram: {
      title: "EF Core tracking",
      panels: [
        { h: "Tracked query", lines: ["Entities watched", "Changes detected", "SaveChanges writes SQL"] },
        { h: "No-tracking", lines: ["AsNoTracking()", "Faster reads", "No auto updates"] },
      ],
      footer: "Track only what you plan to modify",
    },
  },
  {
    q: "What is the difference between authentication and authorization in ASP.NET Core?",
    a: "Authentication answers “who are you?” Authorization answers “what are you allowed to do?” after identity is known.",
    e: "Use authentication middleware + schemes (cookies, JWT). Use [Authorize], policies, and roles for access control. Never rely on hiding UI alone—enforce on the server.",
    diagram: {
      title: "AuthN vs AuthZ",
      panels: [
        { h: "Authentication", lines: ["Login · tokens", "Identity established", "Claims principal"] },
        { h: "Authorization", lines: ["Policies · roles", "Resource checks", "Allow or deny"] },
      ],
      footer: "Identify first · decide permissions second",
    },
  },
  {
    q: "Explain middleware in the ASP.NET Core pipeline.",
    a: "Middleware is a chain of components that can inspect/modify HTTP requests and responses. Order matters because each component can short-circuit or call next.",
    e: "Register with app.UseXxx in Program.cs. Common pieces: exception handling, HTTPS, routing, auth, endpoints. Custom middleware encapsulates cross-cutting concerns cleanly.",
    diagram: {
      title: "Middleware pipeline",
      panels: [
        { h: "Incoming", lines: ["Exception handling", "HTTPS / static files", "Routing · CORS"] },
        { h: "Core", lines: ["Authentication", "Authorization", "Endpoint · MVC / minimal APIs"] },
      ],
      footer: "Order is part of your architecture — place auth and error handling carefully",
    },
  },
  {
    q: "What are records in C# and when should you use them?",
    a: "record (and record struct) provide value-based equality, concise init, and with-expressions for non-destructive mutation. Great for immutable DTOs.",
    e: "Prefer records for data payloads and domain values. Classes still fit entities with identity. record class is reference type with value equality; record struct is a value type.",
    diagram: {
      title: "records for data",
      panels: [
        { h: "Benefits", lines: ["Value equality", "with expressions", "Concise syntax"] },
        { h: "Good uses", lines: ["DTOs · messages", "Config snapshots", "Immutable models"] },
      ],
      footer: "Use for data · use classes when identity and behavior dominate",
    },
  },
  {
    q: "What is the difference between IActionResult and ActionResult<T>?",
    a: "IActionResult is a non-generic result interface (Ok, NotFound, File…). ActionResult<T> types both the success payload T and the possible action results for better OpenAPI/Swagger docs.",
    e: "Prefer ActionResult<T> on modern APIs when you return a body type on success. Minimal APIs often return typed results helpers instead.",
    diagram: {
      title: "Controller return types",
      panels: [
        { h: "IActionResult", lines: ["Flexible statuses", "Less typed body", "Classic controllers"] },
        { h: "ActionResult<T>", lines: ["Typed success T", "Better API metadata", "Still can return NotFound"] },
      ],
      footer: "Typed results improve documentation and client generation",
    },
  },
  {
    q: "Explain nullable reference types in modern C#.",
    a: "With nullable context enabled, reference types are non-null by default; T? means null is allowed. The compiler warns on possible null dereferences.",
    e: "Treat warnings as bugs in new code. Use null-forgiving sparingly. Annotate public APIs clearly so callers know null contracts.",
    diagram: {
      title: "Nullable references",
      panels: [
        { h: "string", lines: ["Non-null by default", "Must assign", "Safer calls"] },
        { h: "string?", lines: ["Null allowed", "Check before use", "Clear API intent"] },
      ],
      footer: "Compiler help reduces NullReferenceException surprises",
    },
  },
  {
    q: "What is the difference between AddScoped and AddSingleton DbContext registration mistakes?",
    a: "DbContext is not thread-safe and is designed for scoped lifetime per request. Registering it as Singleton can corrupt data and cause hard-to-debug concurrency bugs.",
    e: "Always AddDbContext with Scoped (default). Background services should create scopes (IServiceScopeFactory). Don't cache DbContext in singletons.",
    diagram: {
      title: "DbContext lifetime",
      panels: [
        { h: "Correct", lines: ["Scoped per HTTP request", "Dispose after request", "One unit-of-work"] },
        { h: "Wrong", lines: ["Singleton DbContext", "Shared across threads", "Concurrency corruption"] },
      ],
      footer: "One context · one unit of work · never share across requests",
    },
  },
  {
    q: "How do you implement pagination efficiently in EF Core?",
    a: "Use ordered Skip/Take (or keyset pagination) on IQueryable so SQL LIMIT/OFFSET or seek filters run in the database—not in memory.",
    e: "Always OrderBy before Skip. Index sort columns. For deep pages, keyset (WHERE Id > lastId) outperforms large OFFSET. Count carefully—full Count may be expensive.",
    diagram: {
      title: "Pagination patterns",
      panels: [
        { h: "Offset", lines: ["OrderBy + Skip + Take", "Simple page numbers", "Slow for deep pages"] },
        { h: "Keyset", lines: ["WHERE key > last", "Stable infinite scroll", "Better large data"] },
      ],
      footer: "Push filters and paging into SQL with IQueryable",
    },
  },
  {
    q: "What is the options pattern in ASP.NET Core?",
    a: "IOptions<T>, IOptionsSnapshot<T>, and IOptionsMonitor<T> bind strongly typed config sections from appsettings and environment variables.",
    e: "IOptions is singleton snapshot at start. Snapshot is scoped and reloads per request. Monitor supports change callbacks. Validate options at startup with ValidateOnStart.",
    diagram: {
      title: "Options pattern",
      panels: [
        { h: "Bind", lines: ["appsettings.json", "Configure<T>(section)", "Strongly typed class"] },
        { h: "Consume", lines: ["IOptions<T>", "IOptionsSnapshot<T>", "IOptionsMonitor<T>"] },
      ],
      footer: "Typed config beats magic strings scattered in code",
    },
  },
  {
    q: "What are minimal APIs and when would you choose them over controllers?",
    a: "Minimal APIs map routes with app.MapGet/MapPost lambdas or handlers with less ceremony than MVC controllers—ideal for microservices and simple HTTP APIs.",
    e: "Controllers still excel for large feature sets, filters, and conventional structure. Minimal APIs shine for thin backends, prototypes, and performance-sensitive small surfaces. Both are first-class in modern ASP.NET Core.",
    diagram: {
      title: "Minimal APIs vs controllers",
      panels: [
        { h: "Minimal APIs", lines: ["MapGet / MapPost", "Less boilerplate", "Great for small services"] },
        { h: "Controllers", lines: ["[ApiController]", "Conventions · filters", "Large feature modules"] },
      ],
      footer: "Pick for team structure and API shape — not fashion",
    },
  },
];

const expert = [
  {
    q: "How does the .NET garbage collector work at a high level?",
    a: "The GC reclaims unused managed heap memory using generations (0/1/2), mark-and-sweep/compact techniques, and background collections to reduce pause times.",
    e: "Short-lived objects die in gen0 cheaply. Long-lived promotions cost more. Large Object Heap handles big allocations. Spikes often come from LOH pressure, finalizers, or pinning. Profile with dotnet-counters and alloc tools.",
    diagram: {
      title: "GC generations",
      panels: [
        { h: "Gen 0 · 1", lines: ["Short-lived objects", "Frequent cheap collections", "Nursery of allocations"] },
        { h: "Gen 2 · LOH", lines: ["Long-lived objects", "Costlier collections", "Large arrays · care needed"] },
      ],
      footer: "Reduce allocations in hot paths · measure before tuning",
    },
  },
  {
    q: "Explain Span<T> and Memory<T> and why they matter for performance.",
    a: "Span<T> is a stack-only view over contiguous memory without allocations. Memory<T> is a similar concept that can live on the heap and across awaits.",
    e: "They enable slicing arrays and buffers without ToArray copies. Great for parsers and networking. Span cannot be stored in fields of heap objects or used across awaits—use Memory there.",
    diagram: {
      title: "Span and Memory",
      panels: [
        { h: "Span<T>", lines: ["ref struct view", "No heap alloc", "Cannot cross await"] },
        { h: "Memory<T>", lines: ["Heap-friendly", "Can store / await", "Still avoids copies"] },
      ],
      footer: "Zero-copy slices over buffers — huge win in parsers and protocols",
    },
  },
  {
    q: "How do you diagnose and prevent thread-pool starvation in ASP.NET Core?",
    a: "Starvation happens when all worker threads block (sync-over-async, heavy CPU, locks). New work queues and latency explodes even though CPU may look “fine.”",
    e: "Never block on Tasks in request threads. Offload CPU work carefully. Use async all the way down for IO. Watch runtime counters for thread-pool queue length and inject delays.",
    diagram: {
      title: "Thread-pool health",
      panels: [
        { h: "Causes", lines: [".Result / .Wait()", "Long locks", "CPU-bound on pool"] },
        { h: "Fixes", lines: ["async/await end-to-end", "Bounded parallelism", "Monitor queue length"] },
      ],
      footer: "Blocking request threads is the classic ASP.NET scalability killer",
    },
  },
  {
    q: "What is the difference between IAsyncEnumerable and classic buffering?",
    a: "IAsyncEnumerable<T> streams items asynchronously—consumers await foreach and process rows as they arrive instead of buffering entire collections.",
    e: "Perfect for large result sets, signal streams, and EF Core ToAsyncEnumerable in careful scenarios. Prefer cancellation tokens. Don't mix with unbounded channel growth.",
    diagram: {
      title: "Streaming results",
      panels: [
        { h: "Buffered", lines: ["Load everything", "High memory", "Then process"] },
        { h: "IAsyncEnumerable", lines: ["Yield as ready", "Lower peak memory", "await foreach"] },
      ],
      footer: "Stream large data · keep cancellation disciplined",
    },
  },
  {
    q: "How would you design a resilient HttpClient usage strategy in .NET?",
    a: "Use IHttpClientFactory to avoid socket exhaustion, configure named/typed clients, timeouts, and resilience policies (retry, circuit breaker) for transient faults.",
    e: "Don't new HttpClient per call long-lived without care. Prefer Polly or built-in resilience handlers on modern .NET. Make retries idempotent only.",
    diagram: {
      title: "HttpClient best practices",
      panels: [
        { h: "IHttpClientFactory", lines: ["Named / typed clients", "Handler lifetimes fixed", "No socket exhaustion"] },
        { h: "Resilience", lines: ["Timeouts", "Retry transient errors", "Circuit breaker"] },
      ],
      footer: "Factory + policy > ad-hoc new HttpClient everywhere",
    },
  },
  {
    q: "Explain EF Core compiled queries and when they help.",
    a: "Compiled queries cache the expression-to-SQL translation pipeline so repeated queries avoid recompilation overhead.",
    e: "Useful for hot query shapes with stable parameters. Premature use clutters code. Measure first—modern EF already caches many plans. Combine with proper indexes for biggest wins.",
    diagram: {
      title: "Compiled queries",
      panels: [
        { h: "Without", lines: ["Shape analyzed often", "Extra CPU on hot path"] },
        { h: "With compiled query", lines: ["Cache translation", "Stable parameterized SQL", "Micro-opt for heavy traffic"] },
      ],
      footer: "Use after profiling — indexes and fewer round-trips usually win more",
    },
  },
  {
    q: "How do you implement multi-tenancy in ASP.NET Core cleanly?",
    a: "Resolve tenant per request (host, header, token), then scope configuration, connection string, or global query filters to that tenant.",
    e: "Strategies: database-per-tenant, schema-per-tenant, or shared DB with tenant_id column. Prevent cross-tenant leaks with automatic query filters and tests. Cache tenant metadata carefully.",
    diagram: {
      title: "Multi-tenancy patterns",
      panels: [
        { h: "Isolation styles", lines: ["DB per tenant", "Schema per tenant", "Shared + tenant_id"] },
        { h: "Per request", lines: ["Resolve tenant", "Scope services", "Filter all queries"] },
      ],
      footer: "Isolation and leak-proof queries are the hard parts",
    },
  },
  {
    q: "What is the difference between Channels, BlockingCollection, and TPL Dataflow?",
    a: "System.Threading.Channels is a modern high-performance producer/consumer queue for async apps. BlockingCollection is classic blocking. Dataflow offers richer pipeline blocks with linking.",
    e: "Channels are preferred for async streaming inside a process. Dataflow helps complex graphs. Avoid unbounded queues without backpressure.",
    diagram: {
      title: "In-process messaging",
      panels: [
        { h: "Channels", lines: ["Async-friendly", "Bounded options", "High performance"] },
        { h: "Dataflow / classic", lines: ["Blocks · linking", "BlockingCollection", "Heavier or older styles"] },
      ],
      footer: "Always define backpressure for producers",
    },
  },
  {
    q: "How do you secure APIs with JWT bearer authentication correctly?",
    a: "Issue short-lived access tokens (and refresh tokens if needed), validate issuer/audience/signature/lifetime, use HTTPS, and store secrets securely (not in source).",
    e: "Validate clock skew deliberately. Prefer asymmetric keys in distributed systems. Put permissions in claims and enforce policies. Never put secrets in JWT payloads you wouldn't show the user.",
    diagram: {
      title: "JWT API auth",
      panels: [
        { h: "Token", lines: ["Signed claims", "Short expiry", "Audience · issuer"] },
        { h: "API", lines: ["Validate signature", "Check lifetime", "Authorize policies"] },
      ],
      footer: "HTTPS + validation + short lifetime is the baseline",
    },
  },
  {
    q: "Explain source generators and where they excel in modern .NET.",
    a: "Source generators run at compile time to emit additional C# (JSON serializers, logging, DI, mappings), reducing reflection and runtime work.",
    e: "System.Text.Json source generation and LoggerMessage generators are common. Trade-off: more build complexity, excellent steady-state performance and startup.",
    diagram: {
      title: "Source generators",
      panels: [
        { h: "Compile time", lines: ["Analyze code", "Emit C#", "No runtime reflection"] },
        { h: "Wins", lines: ["Faster startup", "AOT friendly", "Less boilerplate"] },
      ],
      footer: "Move work from runtime to build when it pays off",
    },
  },
  {
    q: "How do you design health checks and graceful shutdown for .NET services?",
    a: "Use ASP.NET Core health checks for liveness/readiness against dependencies. On shutdown, stop accepting traffic, drain in-flight requests, then dispose resources.",
    e: "Kubernetes uses readiness to drop pods from balance, liveness for restarts. Hook IHostApplicationLifetime. Avoid long shutdown hangs; set timeouts.",
    diagram: {
      title: "Health and shutdown",
      panels: [
        { h: "Probes", lines: ["Liveness: process OK", "Readiness: can take traffic", "Check DB / queues"] },
        { h: "Shutdown", lines: ["Stop new work", "Drain requests", "Dispose connections"] },
      ],
      footer: "Orchestrators need honest health signals",
    },
  },
  {
    q: "What is AOT compilation in .NET and what are the trade-offs?",
    a: "Native AOT compiles to a native binary ahead of time—faster startup, smaller deploy for some app types, but limited reflection/dynamic features and longer publish times.",
    e: "Great for CLI tools and some cloud natives. Trim + AOT need analyzers for missing code paths. Not every library is AOT-ready—validate dependencies.",
    diagram: {
      title: "Native AOT trade-offs",
      panels: [
        { h: "Benefits", lines: ["Fast startup", "Smaller footprint", "No JIT warm-up"] },
        { h: "Costs", lines: ["Reflection limits", "Publish complexity", "Library compatibility"] },
      ],
      footer: "Choose AOT when startup size matters more than flexibility",
    },
  },
  {
    q: "How do you implement efficient background work in ASP.NET Core?",
    a: "Use IHostedService / BackgroundService for continuous work. Prefer queues (Channels) to hand off HTTP request work instead of running heavy jobs on request threads.",
    e: "Scoped services need create-scope inside the background loop. Add cancellation, retries, and observability. For multi-instance apps, use a real distributed queue to avoid double processing.",
    diagram: {
      title: "Background processing",
      panels: [
        { h: "Inside host", lines: ["BackgroundService", "Channel queue", "Graceful cancel"] },
        { h: "Distributed", lines: ["Azure Queue / Rabbit", "At-least-once handling", "Idempotent consumers"] },
      ],
      footer: "Never run long jobs on the HTTP request thread",
    },
  },
  {
    q: "Explain concurrency tokens and optimistic concurrency in EF Core.",
    a: "Optimistic concurrency detects lost updates using a version/timestamp column. If the token changed since read, SaveChanges throws DbUpdateConcurrencyException.",
    e: "Map a RowVersion property as concurrency token. Decide business rules on conflict (reload, merge, abort). Critical for multi-user edits.",
    diagram: {
      title: "Optimistic concurrency",
      panels: [
        { h: "Read", lines: ["Load entity + token", "User edits data"] },
        { h: "Write", lines: ["UPDATE … WHERE token = old", "0 rows → conflict", "Handle exception"] },
      ],
      footer: "Safer than “last write wins” for concurrent editors",
    },
  },
  {
    q: "How would you structure a clean architecture for a large .NET solution?",
    a: "Separate Domain, Application, Infrastructure, and API layers. Domain stays free of EF/UI. Application orchestrates use cases. Infrastructure implements interfaces. API is a thin delivery mechanism.",
    e: "Depend inward: outer layers reference abstractions defined inward. This enables testing and swapping SQL/cache providers. Avoid anemic “dump all in Controllers” god projects.",
    diagram: {
      title: "Clean architecture layers",
      panels: [
        { h: "Inner", lines: ["Domain entities", "Application use cases", "Interfaces / ports"] },
        { h: "Outer", lines: ["EF · HTTP · email", "API / workers", "Infrastructure adapters"] },
      ],
      footer: "Dependencies point inward — frameworks stay at the edges",
    },
  },
];

async function findDotNetLanguage() {
  const langs = await languageService.listLanguages();
  return langs.find(
    (l) =>
      /\.net/i.test(l.name) ||
      /dotnet/i.test(l.name) ||
      /asp\.?net/i.test(l.name) ||
      /c#/i.test(l.name),
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

  const lang = await findDotNetLanguage();
  if (!lang) {
    console.error(".NET language not found in CMS.");
    process.exit(1);
  }
  console.log("Using language:", lang.name, lang.id);

  if (await hasIntermediate(lang.id)) {
    console.log("Intermediate already exists — skipping to avoid duplicates.");
    process.exit(0);
  }

  let i = 0;
  let e = 0;

  for (const item of intermediate) {
    const descriptionImageUrl = renderCleanDiagram(item.diagram);
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
    const descriptionImageUrl = renderCleanDiagram(item.diagram);
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
  process.exit(0);
}

module.exports = { intermediate, expert };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
