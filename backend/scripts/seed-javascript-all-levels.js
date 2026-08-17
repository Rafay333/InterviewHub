/**
 * Seed JavaScript — Beginner / Intermediate / Expert (15 each).
 * Pictures use varied Full HD layouts (steps, cycle, layers, code, timeline, hub, compare).
 */
const { getPool, query } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { renderJsVisual } = require("../src/utils/jsDiagrams");

const beginner = [
  {
    q: "What is JavaScript and where does it run?",
    a: "JavaScript is a high-level, multi-paradigm language for the web. It runs in browsers and on servers (Node.js), and can also target mobile/desktop via frameworks.",
    e: "Browsers expose a DOM/BOM host environment. Node adds filesystem and networking. Same language core (ECMAScript) with different global APIs.",
    visual: {
      title: "Where JavaScript runs",
      kind: "hub",
      hub: "JavaScript",
      nodes: [
        { h: "Browser", lines: ["DOM · UI events"] },
        { h: "Node.js", lines: ["Servers · CLI tools"] },
        { h: "Mobile", lines: ["React Native etc."] },
        { h: "Desktop", lines: ["Electron apps"] },
        { h: "Edge", lines: ["Workers · CDN"] },
        { h: "Embedded", lines: ["IoT · extensions"] },
      ],
      footer: "One language core · many host environments",
    },
  },
  {
    q: "What are the basic data types in JavaScript?",
    a: "Primitives: string, number, boolean, null, undefined, symbol, bigint. Everything else is an object (including arrays and functions).",
    e: "typeof null is a historical quirk (\"object\"). Prefer Number.isNaN for NaN checks. Objects are reference types.",
    visual: {
      title: "JS type map",
      kind: "hub",
      hub: "Types",
      nodes: [
        { h: "string", lines: ["Text values"] },
        { h: "number", lines: ["IEEE floats"] },
        { h: "boolean", lines: ["true / false"] },
        { h: "null", lines: ["Intentional empty"] },
        { h: "undefined", lines: ["Not assigned"] },
        { h: "object", lines: ["Arrays · funcs"] },
      ],
      footer: "Primitives by value · objects by reference",
    },
  },
  {
    q: "What is the difference between let, const, and var?",
    a: "var is function-scoped and hoisted. let/const are block-scoped. const cannot be reassigned (object contents can still mutate).",
    e: "Prefer const by default, let when reassignment is needed. Avoid var in modern code to reduce scope bugs.",
    visual: {
      title: "let · const · var",
      kind: "compare",
      left: {
        h: "Modern: let / const",
        lines: [
          "Block scoped { }",
          "Temporal dead zone",
          "const = no rebind",
          "Clear intent",
        ],
      },
      right: {
        h: "Legacy: var",
        lines: [
          "Function scoped",
          "Hoisted as undefined",
          "Can redeclare",
          "Easier scope bugs",
        ],
      },
      footer: "Default to const — then let — avoid var",
    },
  },
  {
    q: "What is the difference between == and ===?",
    a: "== allows type coercion; === requires same type and value (strict equality).",
    e: "Use === almost always. == can surprise you (\"0\" == false). Object.is handles NaN edge cases specially.",
    visual: {
      title: "Equality operators",
      kind: "compare",
      left: {
        h: "== loose",
        lines: [
          "Coerces types first",
          '"5" == 5 → true',
          "Hard to reason about",
          "Avoid in app logic",
        ],
      },
      right: {
        h: "=== strict",
        lines: [
          "No type conversion",
          '"5" === 5 → false',
          "Predictable",
          "Use by default",
        ],
      },
      footer: "Strict equality keeps comparisons honest",
    },
  },
  {
    q: "How do arrays work in JavaScript?",
    a: "Arrays are ordered lists (objects with numeric keys) with methods like push, map, filter, and length.",
    e: "They are dynamic. Prefer methods that return new arrays (map/filter) for clearer transforms. Sparse arrays exist—avoid holes.",
    visual: {
      title: "Array as a pipeline",
      kind: "steps",
      steps: [
        { h: "Create", lines: ["[1, 2, 3]", "Array.of"] },
        { h: "Transform", lines: ["map", "filter"] },
        { h: "Reduce", lines: ["reduce", "to value"] },
        { h: "Use", lines: ["UI list", "API payload"] },
      ],
      footer: "Think of data flowing through pure steps",
    },
  },
  {
    q: "What is a function declaration vs expression?",
    a: "Declarations are hoisted fully: function foo(){}. Expressions assign a function value: const foo = function(){} or arrow forms.",
    e: "Arrow functions inherit this lexically and are not constructors. Declarations are convenient at top-level helpers.",
    visual: {
      title: "Function styles",
      kind: "code",
      code: {
        file: "fns.js",
        code: [
          "function add(a, b) {",
          "  return a + b; // declaration",
          "}",
          "",
          "const mul = (a, b) => a * b;",
          "// expression / arrow",
          "",
          "console.log(add(2, 3));",
        ],
        notes: [
          { h: "Declaration", text: "Hoisted — callable earlier in scope" },
          { h: "Arrow", text: "Lexical this · no arguments object" },
          { h: "Tip", text: "Pick one style per team and stick to it" },
        ],
      },
      footer: "Same results · different rules for this and hoisting",
    },
  },
  {
    q: "What is an object in JavaScript?",
    a: "An object is a collection of key-value properties. Keys are strings/symbols; values can be any type including functions (methods).",
    e: "Access with dot or bracket notation. Prefer Object.keys/values/entries for enumeration. Prototypes provide shared behavior.",
    visual: {
      title: "Object shape",
      kind: "code",
      code: {
        file: "user.js",
        code: [
          "const user = {",
          "  id: 1,",
          "  name: 'Ada',",
          "  greet() {",
          "    return `Hi ${this.name}`;",
          "  },",
          "};",
          "user.greet();",
        ],
        notes: [
          { h: "Properties", text: "Data fields on the object" },
          { h: "Methods", text: "Functions using this" },
          { h: "Reference", text: "Assignment copies the reference" },
        ],
      },
      footer: "Objects are the universal bag of properties",
    },
  },
  {
    q: "How does a for loop differ from for...of?",
    a: "Classic for uses an index counter. for...of iterates values of iterables (arrays, strings, maps) without manual indexes.",
    e: "for...in enumerates keys (including inherited)—usually avoid for arrays. Prefer for...of or array methods for collections.",
    visual: {
      title: "Looping styles",
      kind: "steps",
      steps: [
        { h: "for i", lines: ["Index control", "length - 1", "Full control"] },
        { h: "for...of", lines: ["Values only", "Readable", "Iterables"] },
        { h: "forEach", lines: ["Callback", "No break", "Array helper"] },
      ],
      footer: "Pick the loop that matches how you read the data",
    },
  },
  {
    q: "What is JSON?",
    a: "JSON is a text data format. JSON.stringify converts values to text; JSON.parse converts text back to values.",
    e: "JSON supports objects, arrays, strings, numbers, booleans, null—not functions or undefined. Always validate external JSON.",
    visual: {
      title: "JSON round trip",
      kind: "timeline",
      events: [
        { h: "JS value", lines: ["Object / array in memory"] },
        { h: "stringify", lines: ["To text for network / storage"] },
        { h: "Transport", lines: ["HTTP · localStorage · file"] },
        { h: "parse", lines: ["Back to a JS value"] },
      ],
      footer: "Language-independent data exchange format",
    },
  },
  {
    q: "What is the DOM?",
    a: "The Document Object Model is the browser’s tree representation of HTML that JavaScript can query and update.",
    e: "document.querySelector finds nodes. Changes to the DOM update what the user sees. Over-updating can hurt performance—batch when possible.",
    visual: {
      title: "DOM tree idea",
      kind: "layers",
      layers: [
        { h: "document", lines: ["Root of the page tree"] },
        { h: "html", lines: ["html element"] },
        { h: "body", lines: ["Visible content container"] },
        { h: "elements", lines: ["div · p · button — script can read and change these"] },
      ],
      footer: "JS talks to the page through the DOM API",
    },
  },
  {
    q: "How do you listen for events?",
    a: "element.addEventListener(type, handler) registers a callback for clicks, input, submit, etc.",
    e: "Remove with removeEventListener using the same function reference. Prefer event delegation on parents for many items.",
    visual: {
      title: "Event flow",
      kind: "timeline",
      events: [
        { h: "User action", lines: ["Click · type · submit"] },
        { h: "Browser event", lines: ["Creates Event object"] },
        { h: "Listener runs", lines: ["Your handler function"] },
        { h: "Update UI", lines: ["Change DOM / state"] },
      ],
      footer: "Events bridge user input to your code",
    },
  },
  {
    q: "What is template literal syntax?",
    a: "Backtick strings support ${expression} interpolation and multi-line text.",
    e: "Cleaner than string concatenation. Tagged templates enable advanced parsing (e.g. styled components).",
    visual: {
      title: "Template literals",
      kind: "code",
      code: {
        file: "greet.js",
        code: [
          "const name = 'Ada';",
          "const msg = `Hello, ${name}!`;",
          "",
          "const multi = `",
          "  line 1",
          "  line 2",
          "`;",
        ],
        notes: [
          { h: "Interpolation", text: "${...} inserts expressions" },
          { h: "Multi-line", text: "No awkward \\n glue" },
          { h: "Readable", text: "Prefer over string +" },
        ],
      },
      footer: "Modern string building default",
    },
  },
  {
    q: "What is truthy and falsy?",
    a: "Falsy values: false, 0, -0, 0n, '', null, undefined, NaN. Everything else is truthy in boolean context.",
    e: "if (value) uses ToBoolean. Be careful with 0 and empty string if they are valid data.",
    visual: {
      title: "Truthy vs falsy",
      kind: "compare",
      left: {
        h: "Falsy (8 values)",
        lines: ["false", "0 · -0 · 0n", "'' empty string", "null · undefined · NaN"],
      },
      right: {
        h: "Truthy examples",
        lines: ["'0' string", "[] empty array", "{} empty object", "functions · numbers ≠ 0"],
      },
      footer: "Know the short list of falsy values by heart",
    },
  },
  {
    q: "What is a module (ESM) in JavaScript?",
    a: "ES modules use import/export for explicit dependencies. Each module has its own scope.",
    e: "Browsers and Node support ESM (type: module). Prefer named exports for refactorable APIs. Avoid circular imports.",
    visual: {
      title: "ES modules flow",
      kind: "steps",
      steps: [
        { h: "export", lines: ["utils.js", "export function"] },
        { h: "import", lines: ["app.js", "import { fn }"] },
        { h: "bundle", lines: ["Vite · webpack", "or native ESM"] },
        { h: "run", lines: ["Browser / Node"] },
      ],
      footer: "Explicit imports scale better than globals",
    },
  },
  {
    q: "What is console debugging?",
    a: "console.log, .table, .error help inspect values during development. DevTools breakpoints step through code.",
    e: "Remove noisy logs before production. Prefer structured logging libraries in real apps. Learn Network and Sources panels.",
    visual: {
      title: "Debug path",
      kind: "timeline",
      events: [
        { h: "Reproduce", lines: ["Trigger the bug reliably"] },
        { h: "Inspect", lines: ["log / breakpoints"] },
        { h: "Hypothesis", lines: ["What should be true?"] },
        { h: "Fix · verify", lines: ["Regression test if possible"] },
      ],
      footer: "Tools + thinking beat random code changes",
    },
  },
];

const intermediate = [
  {
    q: "Explain closures in JavaScript.",
    a: "A closure is a function that remembers variables from its outer lexical scope even after that outer function returned.",
    e: "Enables private state and factory functions. Be mindful of loops with var vs let when creating closures in iterations.",
    visual: {
      title: "Closure mental model",
      kind: "layers",
      layers: [
        { h: "Outer function scope", lines: ["const count = 0 — lives on even after return"] },
        { h: "Inner function", lines: ["function inc() { count++ } — closes over count"] },
        { h: "Caller later", lines: ["Returned inc still sees the same count binding"] },
      ],
      footer: "Functions carry their birth environment with them",
    },
  },
  {
    q: "How does the JavaScript event loop work?",
    a: "The event loop coordinates the call stack, microtask queue (promises), and macrotask queue (timers, I/O) so async callbacks run when the stack is clear.",
    e: "Microtasks run before the next macrotask. Long sync work blocks rendering. Prefer async for I/O and split heavy CPU.",
    visual: {
      title: "Event loop cycle",
      kind: "cycle",
      items: [
        { h: "Stack", lines: ["Run sync JS"] },
        { h: "Microtasks", lines: ["Promises · queueMicrotask"] },
        { h: "Render", lines: ["Browser may paint"] },
        { h: "Macrotasks", lines: ["setTimeout · I/O"] },
      ],
      footer: "Never block the stack with long CPU loops",
    },
  },
  {
    q: "What is this binding in JavaScript?",
    a: "this depends on call site: method calls, constructors, apply/call/bind, arrows (lexical), or strict-mode globals.",
    e: "Arrow functions do not have their own this. Class methods need care when passed as bare callbacks—bind or wrap them.",
    visual: {
      title: "How this is decided",
      kind: "steps",
      steps: [
        { h: "new Fn()", lines: ["this → new object"] },
        { h: "obj.fn()", lines: ["this → obj"] },
        { h: "fn()", lines: ["undefined (strict)"] },
        { h: "arrow", lines: ["Lexical this"] },
      ],
      footer: "this is not the enclosing function — it's how you call it",
    },
  },
  {
    q: "Promises: resolve, reject, and chaining",
    a: "A Promise represents a future value. then handles fulfillment; catch handles rejection; finally runs cleanup.",
    e: "Always return promises in chains. Avoid floating promises without catch. async/await is syntactic sugar over promises.",
    visual: {
      title: "Promise states",
      kind: "timeline",
      events: [
        { h: "Pending", lines: ["Work in progress"] },
        { h: "Fulfilled", lines: ["resolve(value) → then"] },
        { h: "Rejected", lines: ["reject(err) → catch"] },
        { h: "Settled", lines: ["finally for cleanup"] },
      ],
      footer: "One settle — then chain continues with a new promise",
    },
  },
  {
    q: "async/await best practices",
    a: "async functions return promises. await pauses the function until the promise settles—without blocking the whole thread.",
    e: "Use try/catch around await. Parallelize independent work with Promise.all. Don't await in series when concurrency is safe.",
    visual: {
      title: "async / await flow",
      kind: "code",
      code: {
        file: "api.js",
        code: [
          "async function load() {",
          "  try {",
          "    const res = await fetch(url);",
          "    const data = await res.json();",
          "    return data;",
          "  } catch (err) {",
          "    console.error(err);",
          "  }",
          "}",
        ],
        notes: [
          { h: "await", text: "Pause this function until ready" },
          { h: "try/catch", text: "Handle rejections nearby" },
          { h: "Parallel", text: "Promise.all for multi-fetch" },
        ],
      },
      footer: "Readable async · still promise-based under the hood",
    },
  },
  {
    q: "Destructuring objects and arrays",
    a: "Destructuring unpacks values into variables: const {a, b} = obj; const [x, y] = arr;",
    e: "Supports defaults and renaming: { name: n = 'Anon' }. Rest (...rest) gathers remaining keys/items.",
    visual: {
      title: "Destructuring",
      kind: "code",
      code: {
        file: "destructure.js",
        code: [
          "const user = { id: 1, name: 'Ada' };",
          "const { id, name } = user;",
          "",
          "const pair = [10, 20];",
          "const [a, b] = pair;",
          "",
          "function f({ name = 'x' }) {}",
        ],
        notes: [
          { h: "Objects", text: "Pull named fields" },
          { h: "Arrays", text: "Pull by position" },
          { h: "Defaults", text: "Fill missing values safely" },
        ],
      },
      footer: "Less boilerplate · clearer intent",
    },
  },
  {
    q: "Prototype and inheritance basics",
    a: "Objects inherit via [[Prototype]] chain. Classes are syntactic sugar over prototype constructors.",
    e: "obj.__proto__ is legacy; prefer Object.getPrototypeOf. Shared methods live on the prototype for memory efficiency.",
    visual: {
      title: "Prototype chain",
      kind: "layers",
      layers: [
        { h: "Instance", lines: ["Own properties: name, id"] },
        { h: "Constructor.prototype", lines: ["Shared methods: greet()"] },
        { h: "Object.prototype", lines: ["toString · hasOwnProperty"] },
        { h: "null", lines: ["End of the chain"] },
      ],
      footer: "Lookup walks upward until a property is found",
    },
  },
  {
    q: "Array methods: map, filter, reduce",
    a: "map transforms each item; filter keeps items that match; reduce folds a list into one value.",
    e: "These are pure when callbacks are pure. Avoid side effects inside for easier reasoning. reduce is powerful but can be less readable—balance clarity.",
    visual: {
      title: "map · filter · reduce",
      kind: "steps",
      steps: [
        { h: "Input", lines: ["[1, 2, 3, 4]"] },
        { h: "filter", lines: ["keep even → [2, 4]"] },
        { h: "map", lines: ["n * 10 → [20, 40]"] },
        { h: "reduce", lines: ["sum → 60"] },
      ],
      footer: "Compose small transforms instead of nested for-loops",
    },
  },
  {
    q: "What is debouncing vs throttling?",
    a: "Debounce waits until events pause; throttle limits calls to at most once per interval.",
    e: "Search inputs often debounce. Scroll/resize handlers often throttle. Prevents wasting work on chatty events.",
    visual: {
      title: "Debounce vs throttle",
      kind: "compare",
      left: {
        h: "Debounce",
        lines: [
          "Fire after quiet period",
          "Great for search box",
          "Collapses a burst",
          "Trailing call common",
        ],
      },
      right: {
        h: "Throttle",
        lines: [
          "Fire at most every N ms",
          "Great for scroll",
          "Steady sampling",
          "Leading/trailing opts",
        ],
      },
      footer: "Both rate-limit expensive UI reactions",
    },
  },
  {
    q: "fetch API and error handling",
    a: "fetch returns a Promise for a Response. HTTP error statuses (404/500) do not reject—check response.ok before parsing.",
    e: "Network failures reject. Combine AbortController for timeouts/cancel. Always parse JSON carefully.",
    visual: {
      title: "fetch lifecycle",
      kind: "timeline",
      events: [
        { h: "Request", lines: ["fetch(url, options)"] },
        { h: "Response", lines: ["status · headers"] },
        { h: "Validate", lines: ["if (!res.ok) throw"] },
        { h: "Body", lines: ["await res.json()"] },
      ],
      footer: "ok check is the most forgotten fetch detail",
    },
  },
  {
    q: "modules: named vs default export",
    a: "Named exports export many bindings; default export is a single main value. Import syntax differs for each.",
    e: "Prefer named exports for tree-shaking and rename-safe refactors. Default exports can make renames harder across files.",
    visual: {
      title: "Export styles",
      kind: "compare",
      left: {
        h: "Named exports",
        lines: [
          "export function load()",
          "import { load }",
          "Many per module",
          "Easier refactors",
        ],
      },
      right: {
        h: "Default export",
        lines: [
          "export default class",
          "import App from ...",
          "One primary value",
          "Name is local",
        ],
      },
      footer: "Teams often standardize on named exports",
    },
  },
  {
    q: "What is optional chaining and nullish coalescing?",
    a: "?. safely accesses nested properties if the base is nullish. ?? uses a default only for null/undefined (not for 0 or '').",
    e: "user?.profile?.email avoids TypeError. value ?? fallback is safer than || when 0 is valid.",
    visual: {
      title: "?. and ??",
      kind: "code",
      code: {
        file: "safe.js",
        code: [
          "const email = user?.profile?.email;",
          "",
          "const page = input ?? 1;",
          "// 0 stays 0 (unlike ||)",
          "",
          "ops?.(); // call if exists",
        ],
        notes: [
          { h: "?. access", text: "Stops if left side is nullish" },
          { h: "?? default", text: "Only null/undefined trigger" },
          { h: "Vs ||", text: "|| also replaces 0 and ''" },
        ],
      },
      footer: "Modern null-safe operators reduce boilerplate guards",
    },
  },
  {
    q: "Event delegation pattern",
    a: "Attach one listener on a parent; use event.target to handle child interactions.",
    e: "Scales for large lists. Works for dynamically added children. Check selectors carefully to avoid wrong targets.",
    visual: {
      title: "Event delegation",
      kind: "layers",
      layers: [
        { h: "Parent listener", lines: ["ul.addEventListener('click', handler)"] },
        { h: "Bubble path", lines: ["Event travels from child up to parent"] },
        { h: "Handler filter", lines: ["if (event.target.matches('button.delete')) …"] },
      ],
      footer: "One listener · many items · fewer memory leaks",
    },
  },
  {
    q: "shallow vs deep copy in JS",
    a: "Shallow copies share nested references. Deep copies duplicate nested structures (structuredClone or careful libs).",
    e: "spread {...obj} is shallow. JSON tricks drop functions/dates. Prefer structuredClone when available for data-only trees.",
    visual: {
      title: "Copy depth",
      kind: "compare",
      left: {
        h: "Shallow",
        lines: [
          "{ ...obj } / slice",
          "Nested objects shared",
          "Fast",
          "Mutation can surprise",
        ],
      },
      right: {
        h: "Deep",
        lines: [
          "structuredClone",
          "Independent tree",
          "Heavier",
          "Safer for nested state",
        ],
      },
      footer: "Know your depth before you mutate",
    },
  },
  {
    q: "What are pure functions and immutability benefits?",
    a: "Pure functions return the same output for the same inputs without side effects. Immutable updates create new objects/arrays instead of editing in place.",
    e: "Easier tests, time-travel debugging, and predictable React rendering. Cost is more allocations—usually worth it in UI code.",
    visual: {
      title: "Pure transform",
      kind: "steps",
      steps: [
        { h: "Input", lines: ["state in"] },
        { h: "Pure fn", lines: ["no mutates", "no I/O"] },
        { h: "Output", lines: ["new state"] },
        { h: "UI", lines: ["render trust"] },
      ],
      footer: "Predictable functions scale better in teams",
    },
  },
];

const expert = [
  {
    q: "Microtasks vs macrotasks in depth",
    a: "Promise reactions and queueMicrotask are microtasks; setTimeout, setInterval, I/O, UI events are typically macrotasks. The loop drains microtasks completely between macrotasks.",
    e: "Flooding microtasks can starve rendering. Knowledge of queue order explains UI jank and “promise then runs before timeout” puzzles.",
    visual: {
      title: "Task queues priority",
      kind: "layers",
      layers: [
        { h: "Call stack", lines: ["Run until empty"] },
        { h: "Microtask queue", lines: ["Promises · MutationObserver · queueMicrotask — fully drain"] },
        { h: "Rendering opportunity", lines: ["Browser may style/layout/paint"] },
        { h: "Macrotask queue", lines: ["timers · message events — one, then loop"] },
      ],
      footer: "Microtasks jump the line before the next timer",
    },
  },
  {
    q: "How engines optimize hot code (hidden classes / inline caches)",
    a: "Engines like V8 create hidden classes for object shapes and use inline caches for property access. Stable shapes run faster.",
    e: "Avoid polymorphic megamorphic object shapes in hot paths. Don't delete properties wildly or mix types in the same field.",
    visual: {
      title: "Shape stability",
      kind: "steps",
      steps: [
        { h: "Create", lines: ["Consistent fields"] },
        { h: "Initialize", lines: ["Same order"] },
        { h: "Hot path", lines: ["Inline caches hit"] },
        { h: "Optimize", lines: ["JIT faster code"] },
      ],
      footer: "Predictable object shapes help the JIT help you",
    },
  },
  {
    q: "Memory leaks in long-lived JS apps",
    a: "Leaks often come from lingering listeners, detached DOM refs, unbounded caches, and global registries retaining large graphs.",
    e: "Use heap snapshots, performance monitors, and WeakMap/WeakRef where appropriate. Always remove listeners on tear-down.",
    visual: {
      title: "Leak hunt process",
      kind: "timeline",
      events: [
        { h: "Reproduce", lines: ["Repeat navigation / open-close"] },
        { h: "Snapshot", lines: ["Heap before vs after"] },
        { h: "Diff", lines: ["Retained objects rising"] },
        { h: "Fix", lines: ["Detach listeners · bound caches"] },
      ],
      footer: "If memory only goes up, something still holds a reference",
    },
  },
  {
    q: "Designing concurrent UI with AbortController",
    a: "AbortController signals cancellation to fetch and custom async work so outdated responses don't overwrite newer state.",
    e: "Essential for search-as-you-type and tab switching. Pair with sequence numbers if needed. Clean up in finally.",
    visual: {
      title: "Cancel stale work",
      kind: "code",
      code: {
        file: "search.js",
        code: [
          "let controller;",
          "function search(q) {",
          "  controller?.abort();",
          "  controller = new AbortController();",
          "  return fetch(`/api?q=${q}`, {",
          "    signal: controller.signal,",
          "  });",
          "}",
        ],
        notes: [
          { h: "abort()", text: "Cancels in-flight fetch" },
          { h: "signal", text: "Passed into async APIs" },
          { h: "Why", text: "Ignore outdated results" },
        ],
      },
      footer: "Newest user intent wins — cancel the rest",
    },
  },
  {
    q: "Proxy and Reflect use cases",
    a: "Proxy intercepts operations (get/set/has) on a target object. Reflect provides default operation helpers that match language semantics.",
    e: "Useful for reactivity systems, validation, and virtualization. Overuse hurts clarity and performance—keep traps small.",
    visual: {
      title: "Proxy intercept",
      kind: "hub",
      hub: "Proxy",
      nodes: [
        { h: "get", lines: ["Read trap"] },
        { h: "set", lines: ["Write trap"] },
        { h: "has", lines: ["in operator"] },
        { h: "apply", lines: ["Function call"] },
        { h: "Reflect", lines: ["Default ops"] },
        { h: "Target", lines: ["Real object"] },
      ],
      footer: "Meta-programming with a cost — use deliberately",
    },
  },
  {
    q: "Worker threads / Web Workers isolation",
    a: "Workers run JS off the main thread via message passing. They can't touch the DOM, which protects UI responsiveness.",
    e: "Post structured-cloneable data or transfer buffers. Great for heavy parsing and crypto. Coordinate lifecycle carefully.",
    visual: {
      title: "Main thread vs worker",
      kind: "compare",
      left: {
        h: "Main thread",
        lines: [
          "DOM + UI",
          "Event loop for UX",
          "Keep light",
          "Avoid heavy CPU",
        ],
      },
      right: {
        h: "Worker",
        lines: [
          "No DOM",
          "postMessage bridge",
          "CPU-heavy work",
          "Transferable buffers",
        ],
      },
      footer: "Protect frame rate by isolating expensive compute",
    },
  },
  {
    q: "Module systems interop (ESM vs CJS)",
    a: "CommonJS uses require/module.exports; ESM uses import/export. Dual packages and default import interop can be subtle in Node tooling.",
    e: "Prefer pure ESM for new libraries when possible. Understand \"type\": \"module\", .mjs/.cjs, and named export bridging.",
    visual: {
      title: "Module systems",
      kind: "compare",
      left: {
        h: "CommonJS",
        lines: [
          "require()",
          "module.exports",
          "Sync load (Node)",
          "Legacy ecosystem",
        ],
      },
      right: {
        h: "ES modules",
        lines: [
          "import / export",
          "Static analysis",
          "Browser native",
          "Modern default",
        ],
      },
      footer: "Interop issues are mostly packaging/config — design for ESM long-term",
    },
  },
  {
    q: "Security: XSS and sanitization in JS apps",
    a: "Cross-site scripting injects attacker script into your page. Never assign untrusted HTML with innerHTML; sanitize or use safe text APIs.",
    e: "Prefer textContent, framework auto-escaping, CSP headers, and careful URL handling. Treat all user content as hostile.",
    visual: {
      title: "XSS defense layers",
      kind: "layers",
      layers: [
        { h: "Input handling", lines: ["Validate · encode on the way out"] },
        { h: "Render safely", lines: ["textContent · escaped templates — not raw HTML"] },
        { h: "CSP", lines: ["Restrict script sources"] },
        { h: "Cookies", lines: ["HttpOnly · Secure · SameSite"] },
      ],
      footer: "Defense in depth — never trust the client alone",
    },
  },
  {
    q: "Observability for front-end JS",
    a: "Collect errors, performance marks, Web Vitals, and user session traces. Correlate with releases.",
    e: "window.onerror / unhandledrejection, RUM agents, and source maps in production (carefully). Measure LCP/INP/CLS.",
    visual: {
      title: "Front-end telemetry",
      kind: "hub",
      hub: "Observe",
      nodes: [
        { h: "Errors", lines: ["stack + context"] },
        { h: "Vitals", lines: ["LCP INP CLS"] },
        { h: "Traces", lines: ["route timing"] },
        { h: "Releases", lines: ["version tags"] },
        { h: "Logs", lines: ["structured"] },
        { h: "Alerts", lines: ["burn rates"] },
      ],
      footer: "You can't improve what you never measure",
    },
  },
  {
    q: "Structured concurrency patterns with promises",
    a: "Manage groups of tasks with Promise.all, allSettled, race, and AbortSignal so failures and cancellation stay consistent.",
    e: "all fails fast; allSettled waits for all; race settles with the first. Choose based on product semantics.",
    visual: {
      title: "Promise combinators",
      kind: "steps",
      steps: [
        { h: "all", lines: ["Fail fast group"] },
        { h: "allSettled", lines: ["Wait every task"] },
        { h: "race", lines: ["First settle wins"] },
        { h: "any", lines: ["First success"] },
      ],
      footer: "Pick the combinator that matches failure policy",
    },
  },
  {
    q: "TC39 stages and keeping up with JS safely",
    a: "Language features graduate through TC39 stages 0–4. Stage 4 is shipped standard; earlier stages need care in production.",
    e: "Rely on engines + Babel/TypeScript targets intentionally. Polyfills and core-js choices affect bundle weight.",
    visual: {
      title: "TC39 stage path",
      kind: "timeline",
      events: [
        { h: "Stage 0–1", lines: ["Idea · proposal"] },
        { h: "Stage 2–3", lines: ["Draft · candidate"] },
        { h: "Stage 4", lines: ["Finished standard"] },
        { h: "Engines", lines: ["Ship · baselines"] },
      ],
      footer: "Ship what is baseline-stable for your browser matrix",
    },
  },
  {
    q: "Designing a tiny reactive state core",
    a: "A minimal store holds state, notifies subscribers on immutable updates, and integrates with UI frameworks or vanilla DOM.",
    e: "Selectors reduce re-renders. Middleware helps logging/persistence. Keep updates pure and serializable when possible.",
    visual: {
      title: "Store data flow",
      kind: "cycle",
      items: [
        { h: "State", lines: ["Single source"] },
        { h: "Action", lines: ["Intent message"] },
        { h: "Update", lines: ["Pure reducer"] },
        { h: "Notify", lines: ["Subscribers"] },
      ],
      footer: "Unidirectional flow keeps UI reasoning local",
    },
  },
  {
    q: "Binary data: ArrayBuffer, TypedArrays, DataView",
    a: "ArrayBuffer is raw bytes; TypedArrays view numbers of fixed width; DataView reads mixed endianness fields.",
    e: "Essential for files, WebGL, WASM, and network protocols. Prefer transfer lists when posting large buffers to workers.",
    visual: {
      title: "Binary layers",
      kind: "layers",
      layers: [
        { h: "ArrayBuffer", lines: ["Raw byte storage"] },
        { h: "TypedArray", lines: ["Uint8Array · Float32Array views"] },
        { h: "DataView", lines: ["Mixed field access / endian control"] },
        { h: "App decode", lines: ["Parse into higher-level structures"] },
      ],
      footer: "Views don't copy — they window the same buffer",
    },
  },
  {
    q: "When should you use WebAssembly from JS?",
    a: "WASM accelerates portable CPU-heavy code (codecs, physics, crypto) while JS orchestrates I/O and UI.",
    e: "Not a free speedup for tiny functions—crossing the JS/WASM boundary costs. Profile first. Share memory carefully.",
    visual: {
      title: "JS + WASM split",
      kind: "compare",
      left: {
        h: "JavaScript",
        lines: [
          "UI orchestration",
          "DOM / events",
          "Networking",
          "Glue code",
        ],
      },
      right: {
        h: "WebAssembly",
        lines: [
          "Hot CPU loops",
          "Codecs · physics",
          "Ported C/Rust",
          "Predictable speed",
        ],
      },
      footer: "WASM is a tool for hotspots — not a rewrite-everything plan",
    },
  },
  {
    q: "Architecture: feature-sliced front-end JS",
    a: "Organize by features (auth, cart, search) with shared UI/kernel layers instead of dumping by file type only.",
    e: "Reduces coupling, eases code ownership, and aligns with domain language. Enforce import boundaries in lint/CI.",
    visual: {
      title: "Feature-sliced layout",
      kind: "layers",
      layers: [
        { h: "App shell", lines: ["routing · providers"] },
        { h: "Features", lines: ["auth · cart · search — vertical slices"] },
        { h: "Entities / shared", lines: ["user model · ui kit · api client"] },
        { h: "Infrastructure", lines: ["http · analytics · storage adapters"] },
      ],
      footer: "Structure for change — not only for demo folders",
    },
  },
];

async function ensureJsLanguage(adminId) {
  const langs = await languageService.listLanguages();
  const existing = langs.find(
    (l) =>
      /^javascript$/i.test(l.name) ||
      /^js$/i.test(l.name) ||
      /java\s*script/i.test(l.name),
  );
  if (existing) {
    console.log("Using language:", existing.name, existing.id);
    return existing;
  }
  const created = await languageService.createLanguage({
    name: "JavaScript",
    description:
      "JavaScript interview questions — language fundamentals, async, browser APIs, and advanced runtime topics.",
    status: "published",
    pictureUrl: null,
    categoryId: null,
    adminId,
  });
  console.log("Created language JavaScript:", created.id);
  return created;
}

async function countQuestions(languageId) {
  const { query, sql } = require("../src/config/db");
  const r = await query(
    `SELECT COUNT_BIG(1) AS n FROM dbo.questions WHERE language_id = @id`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return Number(r.recordset[0].n);
}

async function insertAll(items, difficulty, lang, adminId) {
  let n = 0;
  for (const item of items) {
    const descriptionImageUrl = renderJsVisual(item.visual);
    if (!descriptionImageUrl) throw new Error("JS visual render failed");
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty,
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    n += 1;
    process.stdout.write(`${difficulty[0].toUpperCase()}${n} `);
  }
  return n;
}

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;
  const lang = await ensureJsLanguage(adminId);

  const existing = await countQuestions(lang.id);
  if (existing > 0) {
    console.log(`JavaScript already has ${existing} questions.`);
    console.log("Rebuilding only images for this language with varied layouts…");
    // rebuild images for existing by text match
    const { query, sql } = require("../src/config/db");
    const all = [...beginner, ...intermediate, ...expert];
    const rows = await query(
      `SELECT id, question_text FROM dbo.questions WHERE language_id = @id`,
      { id: { type: sql.UniqueIdentifier, value: lang.id } },
    );
    let u = 0;
    for (const row of rows.recordset) {
      const hit = all.find((it) =>
        String(row.question_text || "").startsWith(it.q.slice(0, 40)),
      );
      if (!hit) continue;
      const url = renderJsVisual(hit.visual);
      await query(
        `UPDATE dbo.questions SET description_image_url=@url, updated_at=SYSUTCDATETIME() WHERE id=@id`,
        {
          id: { type: sql.UniqueIdentifier, value: row.id },
          url: { type: sql.NVarChar(500), value: url },
        },
      );
      u += 1;
      process.stdout.write(".");
    }
    console.log(`\nUpdated ${u} JavaScript diagrams.`);
    process.exit(0);
  }

  const b = await insertAll(beginner, "beginner", lang, adminId);
  const i = await insertAll(intermediate, "intermediate", lang, adminId);
  const e = await insertAll(expert, "expert", lang, adminId);
  console.log(`\nDone JavaScript: B${b} I${i} E${e} with varied Full HD visuals.`);
  process.exit(0);
}

module.exports = { beginner, intermediate, expert };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
