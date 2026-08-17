/**
 * Seed Python Interview Questions — Beginner / Intermediate / Expert (15 each).
 * All explanation images: Full HD 1920×1080 via cleanDiagram.
 */
const { getPool, query, sql } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { renderCleanDiagram } = require("../src/utils/cleanDiagram");

const beginner = [
  {
    q: "What is Python and what are its main features?",
    a: "Python is a high-level, interpreted, dynamically typed language known for readable syntax, a large standard library, and multi-paradigm support (OOP, functional, procedural).",
    e: "It emphasizes clarity (PEP 8), rapid development, and batteries-included modules. Use cases span web, data science, automation, and scripting. Indentation defines blocks instead of braces.",
    diagram: {
      title: "Why Python",
      panels: [
        { h: "Core traits", lines: ["Interpreted runtime", "Dynamic typing", "Readable syntax", "Large ecosystem"] },
        { h: "Common uses", lines: ["Web APIs · backends", "Data · ML", "Automation scripts", "Education"] },
      ],
      footer: "Clarity and speed of development are Python’s main strengths",
    },
  },
  {
    q: "What is the difference between a list and a tuple in Python?",
    a: "Lists are mutable sequences (you can change, append, remove). Tuples are immutable sequences—once created, their length and items (as references) cannot be reassigned.",
    e: "Use lists for changing collections. Use tuples for fixed records, dict keys (if hashable contents), and safer function returns. Both are ordered and can hold mixed types.",
    diagram: {
      title: "List vs tuple",
      panels: [
        { h: "list", lines: ["Mutable", "append / pop / sort", "Growing collections", "[] syntax"] },
        { h: "tuple", lines: ["Immutable", "Fixed structure", "Can be dict keys*", "() syntax"] },
      ],
      footer: "*only if all elements are hashable",
    },
  },
  {
    q: "What are Python’s basic data types?",
    a: "Common built-ins include int, float, bool, str, list, tuple, dict, set, and NoneType (None). Types are objects; values know their type at runtime.",
    e: "Use type() or isinstance() to inspect. Prefer isinstance for inheritance. Python 3 has no separate long type—int is arbitrary precision.",
    diagram: {
      title: "Built-in types",
      panels: [
        { h: "Scalars", lines: ["int · float · bool", "str · None", "bytes"] },
        { h: "Collections", lines: ["list · tuple", "dict · set", "frozenset"] },
      ],
      footer: "Everything is an object — including functions and types",
    },
  },
  {
    q: "How does indentation work in Python?",
    a: "Blocks (function body, loops, ifs) are defined by consistent indentation, typically 4 spaces. Mixing tabs and spaces is an error (TabError).",
    e: "Follow PEP 8: 4 spaces, no tabs. Colons start a new indented block. Detented (outdented) lines end the block.",
    diagram: {
      title: "Indentation defines blocks",
      panels: [
        { h: "Correct", lines: ["if ok:", "····do_work()", "····log()", "next_line()"] },
        { h: "Rules", lines: ["Use 4 spaces", "Be consistent", "Don't mix tabs"] },
      ],
      footer: "Indentation is syntax, not just style",
    },
  },
  {
    q: "What is the difference between == and is?",
    a: "== compares values (equality). is compares object identity (same object in memory).",
    e: "Use is for None: x is None. For numbers/strings caching can make is look like ==—don’t rely on identity for value equality of ints/strings.",
    diagram: {
      title: "== vs is",
      panels: [
        { h: "== equality", lines: ["Compares values", "May call __eq__", "a == b"] },
        { h: "is identity", lines: ["Same object?", "id(a) == id(b)", "x is None"] },
      ],
      footer: "Prefer == for values · is only for identity (and None)",
    },
  },
  {
    q: "How do you write a function in Python?",
    a: "Use def name(params): with an indented body. Optional return expression; otherwise the function returns None.",
    e: "Parameters can have defaults, *args, **kwargs, and type hints. Docstrings document purpose. Pure functions are easier to test.",
    diagram: {
      title: "Function anatomy",
      panels: [
        { h: "Definition", lines: ["def greet(name):", "····return f'Hi {name}'", "Optional type hints"] },
        { h: "Call", lines: ["greet('Ada')", "Positional · keyword args", "Defaults allowed"] },
      ],
      footer: "No return means the function returns None",
    },
  },
  {
    q: "What is a dictionary in Python?",
    a: "A dict maps unique keys to values. Keys must be hashable. Lookup, insert, and delete are average O(1).",
    e: "Created with {} or dict(). Python 3.7+ preserves insertion order. Use .get(key, default) to avoid KeyError. Iterate with .items().",
    diagram: {
      title: "dict map",
      panels: [
        { h: "Shape", lines: ["key → value", "Keys unique · hashable", "Fast lookup"] },
        { h: "Common ops", lines: ["d[k] = v", "d.get(k)", "for k, v in d.items()"] },
      ],
      footer: "Dicts are the workhorse structure for labeled data",
    },
  },
  {
    q: "What is a for loop vs a while loop?",
    a: "for iterates over an iterable (list, range, file). while runs as long as a condition stays true.",
    e: "Prefer for when you know the sequence. Use while for unknown repetition counts or event loops. Avoid infinite while without a break condition.",
    diagram: {
      title: "for vs while",
      panels: [
        { h: "for", lines: ["for x in items:", "Known collection", "Clean & idiomatic"] },
        { h: "while", lines: ["while condition:", "Repeat until false", "Need exit path"] },
      ],
      footer: "Choose the loop that matches the stop condition",
    },
  },
  {
    q: "What are Python modules and packages?",
    a: "A module is a .py file you import. A package is a directory of modules (classically with __init__.py) that forms a namespace.",
    e: "import math, from math import sqrt, import package.submodule. PYTHONPATH and virtualenvs control discovery. Avoid circular imports.",
    diagram: {
      title: "Modules and packages",
      panels: [
        { h: "Module", lines: ["one_file.py", "import one_file", "Functions · classes"] },
        { h: "Package", lines: ["pkg/", "··__init__.py", "··utils.py"] },
      ],
      footer: "Packages organize modules into hierarchical namespaces",
    },
  },
  {
    q: "How do you handle exceptions with try / except?",
    a: "Wrap risky code in try, catch specific errors in except, optionally use else (no error) and finally (always runs).",
    e: "Prefer specific exceptions over bare except:. Use finally for cleanup. Raising with raise propagates or creates errors. EAFP is more Pythonic than excessive pre-checks.",
    diagram: {
      title: "try / except flow",
      panels: [
        { h: "Structure", lines: ["try: risky", "except TypeError:", "else: success path", "finally: cleanup"] },
        { h: "Tips", lines: ["Catch specific types", "Log useful context", "Don't silence errors"] },
      ],
      footer: "Handle failures cleanly — never hide bugs with bare except",
    },
  },
  {
    q: "What is a list comprehension?",
    a: "A compact expression that builds a list from an iterable, optionally filtering: [f(x) for x in items if cond].",
    e: "Readable for simple transforms. Prefer normal loops when logic is complex. There are also set and dict comprehensions: {k: v for ...}.",
    diagram: {
      title: "List comprehension",
      panels: [
        { h: "Pattern", lines: ["[expr for x in it]", "Optional if filter", "Creates a new list"] },
        { h: "Example", lines: ["[n*n for n in range(5)]", "→ [0, 1, 4, 9, 16]", "Clear one-liners"] },
      ],
      footer: "Great for simple maps/filters — keep them short",
    },
  },
  {
    q: "What is the difference between append and extend on a list?",
    a: "append adds one element (even if it's a list) as a single item. extend adds each element of an iterable individually.",
    e: "lst.append([1,2]) nests a list. lst.extend([1,2]) adds 1 and 2. + creates a new list; extend mutates in place.",
    diagram: {
      title: "append vs extend",
      panels: [
        { h: "append", lines: ["Adds one object", "[1].append([2,3])", "→ [1, [2, 3]]"] },
        { h: "extend", lines: ["Adds many items", "[1].extend([2,3])", "→ [1, 2, 3]"] },
      ],
      footer: "Pick based on whether the argument is one item or many",
    },
  },
  {
    q: "What are *args and **kwargs?",
    a: "*args collects extra positional arguments into a tuple. **kwargs collects extra keyword arguments into a dict.",
    e: "Useful for wrappers and flexible APIs. In calls, * unpacks a sequence and ** unpacks a mapping into keywords. Don't overuse—named params are clearer.",
    diagram: {
      title: "*args and **kwargs",
      panels: [
        { h: "Definition", lines: ["def f(*args, **kw):", "args is a tuple", "kw is a dict"] },
        { h: "Unpacking", lines: ["f(*items)", "f(**mapping)", "Flexible call sites"] },
      ],
      footer: "Powerful for wrappers — still document expected inputs",
    },
  },
  {
    q: "What is a virtual environment and why use one?",
    a: "A venv isolates project dependencies so packages (and versions) don't collide with system Python or other projects.",
    e: "Create with python -m venv .venv, activate, then pip install. Commit requirements.txt or lock files, not the whole venv folder.",
    diagram: {
      title: "Virtual environments",
      panels: [
        { h: "Problem", lines: ["Global packages clash", "Version conflicts", "Hard repro"] },
        { h: "Solution", lines: ["per-project venv", "pip install local", "requirements.txt"] },
      ],
      footer: "Always isolate production app dependencies",
    },
  },
  {
    q: "What does if __name__ == '__main__' mean?",
    a: "It checks whether the file is run as the main program. When imported, __name__ is the module name, so the block is skipped.",
    e: "Put CLI entry code under this guard so imports remain side-effect free. Enables both library use and script use of the same file.",
    diagram: {
      title: "Main module guard",
      panels: [
        { h: "Run as script", lines: ["python app.py", "__name__ is '__main__'", "Block runs"] },
        { h: "Imported", lines: ["import app", "__name__ is 'app'", "Block skipped"] },
      ],
      footer: "Keep import side effects minimal with this guard",
    },
  },
];

const intermediate = [
  {
    q: "What are *args packing and unpacking patterns used for in Python APIs?",
    a: "Packing gathers variable arguments; unpacking spreads sequences/mappings into calls. Together they enable flexible, composable function interfaces.",
    e: "Common in decorators and wrappers: def wrapper(*args, **kwargs): return fn(*args, **kwargs). Keep signatures intentional—star-args can hide misuse.",
    diagram: {
      title: "Pack and unpack",
      panels: [
        { h: "Pack", lines: ["def f(*a, **k)", "Variable inputs", "Tuple · dict stores"] },
        { h: "Unpack", lines: ["f(*seq)", "f(**map)", "Forward cleanly"] },
      ],
      footer: "Core pattern for decorators and generic helpers",
    },
  },
  {
    q: "Explain generators and the yield keyword.",
    a: "A generator function uses yield to produce a lazy sequence of values, pausing between delivers. It returns a generator iterator.",
    e: "Saves memory for large streams. Generator expressions (x*x for x in it) are compact. Use send/throw for advanced coroutines; prefer simple yield first.",
    diagram: {
      title: "Generators",
      panels: [
        { h: "Behavior", lines: ["yield pauses", "Resumes on next()", "Lazy values"] },
        { h: "Benefits", lines: ["Low memory", "Infinite streams", "Pipeline stage"] },
      ],
      footer: "Generate items on demand instead of building huge lists",
    },
  },
  {
    q: "What is the difference between @staticmethod, @classmethod, and instance methods?",
    a: "Instance methods take self. classmethod takes cls and can access class state. staticmethod is a namespaced function with no automatic self/cls.",
    e: "Use classmethod for alternate constructors (from_json). staticmethod for pure helpers living on the class. Default to instance methods for object data.",
    diagram: {
      title: "Method types",
      panels: [
        { h: "instance / class", lines: ["def m(self)", "@classmethod", "def c(cls, ...)"] },
        { h: "static", lines: ["@staticmethod", "def s(...)", "No self/cls"] },
      ],
      footer: "Pick the method type that matches the data you need",
    },
  },
  {
    q: "How does Python’s MRO and multiple inheritance work?",
    a: "Method Resolution Order (C3 linearization) decides which parent method is used. super() cooperates along the MRO for cooperative multiple inheritance.",
    e: "Check ClassName.__mro__. Diamond patterns need careful super() design. Prefer composition when inheritance graphs get complex.",
    diagram: {
      title: "MRO overview",
      panels: [
        { h: "Lookup", lines: ["Child first", "Then parents by MRO", "object at the end"] },
        { h: "Practice", lines: ["use super()", "Inspect __mro__", "Prefer composition"] },
      ],
      footer: "MRO makes multi-parent lookup deterministic",
    },
  },
  {
    q: "What are decorators and how do you write one?",
    a: "A decorator is a callable that wraps another function/class to extend behavior. Syntactic sugar: @decorator above a def.",
    e: "Typical pattern returns a wrapper preserving metadata with functools.wraps. Parameterized decorators return a decorator factory. Stack order is bottom-up application.",
    diagram: {
      title: "Decorator pattern",
      panels: [
        { h: "Shape", lines: ["def decor(fn):", "··def wrap(*a,**k):", "····…", "··return wrap"] },
        { h: "Usage", lines: ["@decor", "def f(): ...", "Equivalent f = decor(f)"] },
      ],
      footer: "Use functools.wraps to keep __name__ and help text",
    },
  },
  {
    q: "What is the GIL (Global Interpreter Lock)?",
    a: "CPython’s GIL allows only one thread to execute Python bytecode at a time, simplifying memory management but limiting CPU-bound multi-threading.",
    e: "IO-bound threads still help because locks release on IO. For CPU parallelism use multiprocessing, concurrent.futures.ProcessPoolExecutor, or native extensions that release the GIL.",
    diagram: {
      title: "GIL implications",
      panels: [
        { h: "Threads", lines: ["Good for I/O wait", "Limited CPU scale", "Shared memory easy"] },
        { h: "Process pools", lines: ["True multi-core CPU", "Separate memory", "More overhead"] },
      ],
      footer: "Match concurrency tool to whether work is I/O or CPU bound",
    },
  },
  {
    q: "Explain context managers and the with statement.",
    a: "with manages setup/teardown via context managers (__enter__/__exit__ or contextlib). Resources close reliably even on errors.",
    e: "with open(path) as f: is standard for files. Write custom managers for locks, DB transactions, temporary state. Prefer contextlib.contextmanager for simple cases.",
    diagram: {
      title: "with context managers",
      panels: [
        { h: "Protocol", lines: ["__enter__", "body runs", "__exit__ cleanup"] },
        { h: "Why", lines: ["Always release", "Cleaner than try/finally", "Idiomatic resources"] },
      ],
      footer: "Acquire in enter · release in exit — even if errors raise",
    },
  },
  {
    q: "What is the difference between deepcopy and shallow copy?",
    a: "A shallow copy duplicates the outer container but nested objects are shared. deepcopy recursively clones nested structures.",
    e: "list.copy() / slicing is shallow. Use copy.deepcopy when mutations of nested objects must not affect the original. Deepcopy is slower and may fail on exotic graphs.",
    diagram: {
      title: "Shallow vs deep copy",
      panels: [
        { h: "Shallow", lines: ["New outer object", "Shared children", "Fast"] },
        { h: "Deep", lines: ["Recursive clone", "Independent tree", "Heavier"] },
      ],
      footer: "Shared nested objects are the classic shallow-copy bug",
    },
  },
  {
    q: "How do *args type hints and typing.Protocol improve intermediate APIs?",
    a: "Type hints document and check (with mypy/pyright) expected shapes. Protocol enables structural typing (duck typing with checks) without inheritance.",
    e: "from typing import Protocol, Iterable, Optional. Annotations don't enforce at runtime unless you add validators. They shine in large codebases and editor help.",
    diagram: {
      title: "Typing tools",
      panels: [
        { h: "Hints", lines: ["def f(x: int) -> str", "Optional[T]", "list[str] (3.9+)"] },
        { h: "Protocol", lines: ["Structural interface", "No ABC required", "Static duck typing"] },
      ],
      footer: "Hints guide humans and checkers — not a runtime firewall alone",
    },
  },
  {
    q: "What are dunder methods and why override them?",
    a: "Double-underscore methods like __init__, __str__, __len__, __eq__ hook objects into Python syntax and built-ins.",
    e: "Implementing __repr__ helps debugging. Rich comparisons and __hash__ need consistency for set/dict membership. Don't invent random dunders—follow data model docs.",
    diagram: {
      title: "Common dunders",
      panels: [
        { h: "Lifecycle · display", lines: ["__init__", "__repr__", "__str__"] },
        { h: "Container · compare", lines: ["__len__ · __getitem__", "__eq__ · __hash__", "__iter__"] },
      ],
      footer: "Dunders make your types feel built-in",
    },
  },
  {
    q: "Explain itertools and when to use it.",
    a: "itertools provides efficient building blocks for iterators: chain, islice, groupby, product, combinations, and more—often without building intermediate lists.",
    e: "Ideal for combinatorial generation and streaming transforms. Pair with generators for memory-friendly pipelines. Know when a simple loop is clearer.",
    diagram: {
      title: "itertools ideas",
      panels: [
        { h: "Combine", lines: ["chain", "zip_longest", "product"] },
        { h: "Select · group", lines: ["islice", "groupby", "combinations"] },
      ],
      footer: "Iterator algebra without large temporary lists",
    },
  },
  {
    q: "What is the difference between multiprocessing, threading, and asyncio?",
    a: "threading: concurrent IO with shared memory (GIL limits CPU). multiprocessing: parallel CPU via processes. asyncio: single-threaded cooperative concurrency for many IO tasks.",
    e: "Pick asyncio for high-connection network services. Processes for CPU crunching. Threads for blocking IO libraries lacking async support. Don't mix models without clear boundaries.",
    diagram: {
      title: "Concurrency choices",
      panels: [
        { h: "IO bound", lines: ["asyncio", "or threads", "Many waits"] },
        { h: "CPU bound", lines: ["multiprocessing", "Process pools", "Bypass GIL"] },
      ],
      footer: "Wrong tool for the bound type wastes cores or complexity",
    },
  },
  {
    q: "How do Python packages and virtualenvs fit a project layout?",
    a: "Projects typically use src/ or flat packages, pyproject.toml, a venv, and pinned deps. Imports resolve via installed package or editable installs.",
    e: "Prefer pyproject.toml + pip/poetry/uv. Editable: pip install -e .. Tests live outside package import path carefully. Keep secrets out of the repo.",
    diagram: {
      title: "Project layout",
      panels: [
        { h: "Code", lines: ["src/mypkg/", "tests/", "pyproject.toml"] },
        { h: "Env", lines: [".venv/", "pip install -e .", "Lock dependencies"] },
      ],
      footer: "Reproducible installs beat “it works on my machine”",
    },
  },
  {
    q: "What are dataclasses and when should you use them?",
    a: "dataclasses generate init/repr/eq (and more) for classes that mainly store data, reducing boilerplate.",
    e: "@dataclass with field defaults, frozen=True for immutability, slots=True (3.10+) for memory. Not a full ORM—combine with validation libs if needed.",
    diagram: {
      title: "dataclasses",
      panels: [
        { h: "Gives you", lines: ["__init__", "__repr__", "Optional order/frozen"] },
        { h: "Use for", lines: ["DTOs · configs", "Simple domain data", "Less boilerplate"] },
      ],
      footer: "Data-heavy classes without writing repetitive dunders",
    },
  },
  {
    q: "How do you manage file paths correctly in modern Python?",
    a: "Prefer pathlib.Path for joining, reading, and globbing over os.path string ops. Paths are objects with useful methods.",
    e: "Path('a')/'b'/'c.txt', .read_text(), .exists(), .glob('**/*.py'). Still open with with Path.open() contexts. Be careful with cwd-relative paths.",
    diagram: {
      title: "pathlib essentials",
      panels: [
        { h: "Build paths", lines: ["Path.home()", "p / 'file.txt'", "resolve()"] },
        { h: "Use paths", lines: ["read_text/write_text", "glob patterns", "exists · is_file"] },
      ],
      footer: "Object-oriented paths beat brittle string joins",
    },
  },
];

const expert = [
  {
    q: "How does CPython’s memory model interact with object identity and interning?",
    a: "Small ints and some strings may be interned/cached so identity can coincide with equality. Most objects are unique heap allocations with refcounts plus a cyclic GC.",
    e: "Never rely on is for numeric value equality. Refcount frees objects ASAP; cyclic GC handles reference cycles. Slots and interning are optimizations with trade-offs.",
    diagram: {
      title: "Objects and identity",
      panels: [
        { h: "Allocation", lines: ["PyObject headers", "Refcount (±GIL)", "Cyclic GC for cycles"] },
        { h: "Interning", lines: ["Small int cache", "String intern optional", "Don't assume is"] },
      ],
      footer: "Identity ≠ equality except for carefully known cases like None",
    },
  },
  {
    q: "Explain asyncio event loop architecture and structured concurrency patterns.",
    a: "The loop schedules coroutines, runs callbacks, and multiplexes IO with selectors. Tasks wrap coroutines; structured approaches (TaskGroup) manage lifetime together.",
    e: "Avoid fire-and-forget tasks without tracking. Use timeouts, cancellation, and backpressure. Don't call blocking APIs in async code without to_thread/executors.",
    diagram: {
      title: "asyncio loop",
      panels: [
        { h: "Loop duties", lines: ["Run ready callbacks", "Poll sockets", "Schedule timers"] },
        { h: "Safety", lines: ["TaskGroup lifecycles", "Cancel scopes", "No blocking calls"] },
      ],
      footer: "Cooperative multitasking only works if awaits are honest",
    },
  },
  {
    q: "How would you design a high-performance Python service despite the GIL?",
    a: "Push CPU work to processes, native extensions, or vectorized libs (NumPy). Keep the web layer async/IO-bound. Cache aggressively and avoid chatter across process boundaries.",
    e: "Profile first (py-spy, cProfile). Prefer batching and end-to-end async for network. Use multiproc pools for CPU peaks. Consider PyPy/nogil experiments carefully for ops cost.",
    diagram: {
      title: "Scale past the GIL",
      panels: [
        { h: "IO path", lines: ["asyncio servers", "Connection pools", "Caching tiers"] },
        { h: "CPU path", lines: ["ProcessPool", "Native libs", "Batch work"] },
      ],
      footer: "Architecture matters more than micro-syntax tricks",
    },
  },
  {
    q: "What are metaclasses and when are they justified?",
    a: "A metaclass is the class of a class—it controls class creation. Used for ORMs, plugin registration, API DSLs, and enforcement of class invariants.",
    e: "Most code should use decorators, __init_subclass__, or Protocols instead. Metaclasses are powerful but make stack traces and tooling harder. Prefer simple patterns first.",
    diagram: {
      title: "Metaclass role",
      panels: [
        { h: "Creation", lines: ["type(name, bases, ns)", "Custom metaclass hooks", "class body → namespace"] },
        { h: "Prefer when", lines: ["Framework magic needed", "Else avoid", "Document heavily"] },
      ],
      footer: "Reach for metaclasses last, not first",
    },
  },
  {
    q: "How do descriptors and the attribute lookup chain work?",
    a: "Attribute access follows a defined order involving data descriptors, instance dicts, non-data descriptors, and class attributes. Properties are descriptors.",
    e: "Implement __get__/__set__/__delete__ for reusable attribute behavior (validation, lazy load). Understanding this demystifies @property, classmethod, and ORM fields.",
    diagram: {
      title: "Attribute lookup",
      panels: [
        { h: "Order (simplified)", lines: ["Data descriptor", "Instance __dict__", "Non-data descriptor", "Class / bases"] },
        { h: "Tools", lines: ["@property", "custom descriptors", "slots caution"] },
      ],
      footer: "Descriptors are the mechanism behind many “magic” APIs",
    },
  },
  {
    q: "How do you ship reliable Python with typing, tests, and packaging?",
    a: "Use pyproject builds, strict type checking where valuable, pytest, CI matrices across Python versions, and pinned transitive deps for production images.",
    e: "tox/nox or CI jobs run lint (ruff), types (mypy/pyright), tests, and security scans. Publish wheels when possible. Prefer locked installers in deploy.",
    diagram: {
      title: "Quality pipeline",
      panels: [
        { h: "Local · CI", lines: ["ruff / format", "mypy", "pytest"] },
        { h: "Ship", lines: ["pyproject build", "Pinned deps", "Container smoke tests"] },
      ],
      footer: "Automation keeps large codebases honest",
    },
  },
  {
    q: "Explain pickle risks and safer serialization alternatives.",
    a: "pickle can execute arbitrary code during deserialization—never unpickle untrusted data. Prefer JSON, msgpack, or protobuf for boundaries; use pickle only for trusted internal caches if needed.",
    e: "Sign and encrypt sensitive payloads. Version your schemas. For ML model weights use ecosystem-specific secure loaders carefully.",
    diagram: {
      title: "Serialization safety",
      panels: [
        { h: "Unsafe", lines: ["pickle from network", "Arbitrary code risk", "Avoid untrusted input"] },
        { h: "Safer", lines: ["JSON / msgpack", "protobuf / avro", "Validated schemas"] },
      ],
      footer: "Treat deserialization like running untrusted code",
    },
  },
  {
    q: "How do weakrefs and caches interact with object lifetime?",
    a: "weakref holds references that don't keep objects alive. Useful for caches and observer patterns without memory leaks.",
    e: "WeakValueDictionary drops entries when values are GC'd. Be aware of timing and resurrection edge cases. Not a free pass for unbounded cache growth—bound size too.",
    diagram: {
      title: "Weak references",
      panels: [
        { h: "Idea", lines: ["Non-owning pointer", "Object can die", "Callback optional"] },
        { h: "Uses", lines: ["Memo caches", "Registries", "Avoid cycles"] },
      ],
      footer: "Weakrefs help leaks · still design bounded caches",
    },
  },
  {
    q: "What is the import system and how can you customize it?",
    a: "Imports find loaders via sys.meta_path and path hooks, execute modules into sys.modules, and cache them. Importlib exposes the machinery.",
    e: "Custom finders enable plugins and embedded modules. Circular imports need design (local imports, interfaces). Lazy imports can cut startup at complexity cost.",
    diagram: {
      title: "Import pipeline",
      panels: [
        { h: "Find · load", lines: ["meta_path finders", "Create module", "Exec in namespace"] },
        { h: "Cache", lines: ["sys.modules", "Reimport returns same", "reload is rare"] },
      ],
      footer: "Understand imports to debug circular dependencies faster",
    },
  },
  {
    q: "How would you design clean architecture in a large Python application?",
    a: "Isolate domain logic from frameworks (FastAPI, Django, SQLAlchemy). Depend on interfaces/ports; adapters implement DB and HTTP at the edges.",
    e: "Use packages for domain, application services, and infrastructure. Keep testable pure functions at the core. Avoid god modules and circular package graphs.",
    diagram: {
      title: "Clean architecture",
      panels: [
        { h: "Inner core", lines: ["Domain models", "Use cases", "No FastAPI/SQL imports"] },
        { h: "Outer adapters", lines: ["HTTP controllers", "ORM repositories", "Message brokers"] },
      ],
      footer: "Frameworks are details — business rules stay pure",
    },
  },
  {
    q: "Explain C extensions / Cython / pybind11 trade-offs for speed.",
    a: "Native extensions release hot loops from the interpreter, can free the GIL, and reach C speeds—with cost in build complexity and safety.",
    e: "Try NumPy/vectorization first. Cython eases Python-like native code. pybind11 wraps C++. Always benchmark and keep a pure-Python fallback if feasible.",
    diagram: {
      title: "Native acceleration",
      panels: [
        { h: "Options", lines: ["Cython", "pybind11 / C API", "Numba in niches"] },
        { h: "Costs", lines: ["Build wheels", "Memory safety", "Portability"] },
      ],
      footer: "Optimize after profiling — native only where it pays",
    },
  },
  {
    q: "How do you implement robust retries, timeouts, and circuit breaking in Python clients?",
    a: "Wrap HTTP/gRPC calls with timeouts, bounded exponential backoff with jitter, idempotency keys, and circuit breakers to fail fast when dependencies darken.",
    e: "Libraries: httpx, tenacity, resilience patterns. Never retry non-idempotent POSTs blindly. Observability (metrics/traces) validates policies.",
    diagram: {
      title: "Resilient clients",
      panels: [
        { h: "Per call", lines: ["Timeouts", "Retry + jitter", "Idempotency"] },
        { h: "System", lines: ["Circuit breaker", "Bulkheads", "Metrics · traces"] },
      ],
      footer: "Resilience is product behavior, not a one-line decorator",
    },
  },
  {
    q: "What are key memory profiling techniques in Python?",
    a: "Use tracemalloc, memory_profiler, objgraph, or py-spy for allocation hotspots and leaks. Watch for unbounded caches and lingering references from cycles or globals.",
    e: "Reproduce with controlled inputs. Compare snapshots. Prefer generators and streaming. Fix root holds (caches, lists, closures) rather than calling gc.collect as a “fix.”",
    diagram: {
      title: "Memory debugging",
      panels: [
        { h: "Tools", lines: ["tracemalloc", "objgraph", "py-spy · fil"] },
        { h: "Common leaks", lines: ["Global caches", "Unclosed resources", "Growing lists"] },
      ],
      footer: "Measure snapshots — don't guess",
    },
  },
  {
    q: "How does async context management and cancellation safety work?",
    a: "async with uses __aenter__/__aexit__. Cancellation injects exceptions at await points; critical sections may need shielding to avoid corrupting state.",
    e: "Always clean up in finally/__aexit__. Know asyncio.shield trade-offs. TaskGroup cancels siblings on error—design for partial failure.",
    diagram: {
      title: "Async cleanup",
      panels: [
        { h: "async with", lines: ["Acquire resource", "Await body", "Always release"] },
        { h: "Cancel", lines: ["Exception at await", "Shield carefully", "Idempotent cleanup"] },
      ],
      footer: "Cancellation is normal — write paths that survive it",
    },
  },
  {
    q: "Compare Django, FastAPI, and Flask for large systems (trade-offs).",
    a: "Django: batteries-included monoliths (ORM, admin, auth). Flask: minimal and flexible. FastAPI: modern typing-first APIs with async and OpenAPI auto docs.",
    e: "Choose for team skills, domain, and IO profile. Any can scale with good architecture. Don't pick only by hype—ops complexity and ecosystem matter.",
    diagram: {
      title: "Web framework trade-offs",
      panels: [
        { h: "Django", lines: ["Full stack", "Admin · ORM", "Opinionated"] },
        { h: "FastAPI · Flask", lines: ["FastAPI: typed APIs", "Flask: micro freedom", "Glue your stack"] },
      ],
      footer: "Architecture quality beats framework fashion",
    },
  },
];

async function ensurePythonLanguage(adminId) {
  const langs = await languageService.listLanguages();
  const existing = langs.find((l) => /^python$/i.test(l.name) || /python/i.test(l.name));
  if (existing) {
    console.log("Using language:", existing.name, existing.id);
    return existing;
  }
  const created = await languageService.createLanguage({
    name: "Python",
    description:
      "Python interview questions for Beginner, Intermediate, and Expert levels — syntax, OOP, concurrency, and design.",
    status: "published",
    pictureUrl: null,
    categoryId: null,
    adminId,
  });
  console.log("Created language Python:", created.id);
  return created;
}

async function alreadySeeded(languageId) {
  const r = await query(
    `SELECT COUNT_BIG(1) AS n FROM dbo.questions WHERE language_id = @id`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return Number(r.recordset[0].n) > 0;
}

async function insertLevel(items, difficulty, lang, adminId) {
  let n = 0;
  for (const item of items) {
    const descriptionImageUrl = renderCleanDiagram(item.diagram);
    if (!descriptionImageUrl) {
      throw new Error("Full HD diagram render failed — is @napi-rs/canvas installed?");
    }
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

  const lang = await ensurePythonLanguage(adminId);
  if (await alreadySeeded(lang.id)) {
    console.log("Python already has questions — skipping full re-seed to avoid duplicates.");
    console.log("Delete language questions in admin if you want a clean re-import.");
    process.exit(0);
  }

  const b = await insertLevel(beginner, "beginner", lang, adminId);
  const i = await insertLevel(intermediate, "intermediate", lang, adminId);
  const e = await insertLevel(expert, "expert", lang, adminId);

  console.log(`\nDone. Beginner ${b}, Intermediate ${i}, Expert ${e} (Full HD diagrams).`);
  process.exit(0);
}

module.exports = { beginner, intermediate, expert };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
