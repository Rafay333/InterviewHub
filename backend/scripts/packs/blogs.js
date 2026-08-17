module.exports = [
  {
    featured: true,
    category: "AI",
    title: "How AI Changes Our Future",
    excerpt:
      "AI will not replace programmers who can think. It will replace the busywork — and raise the bar for judgment, review, and system design.",
    readMinutes: 9,
    featuredImageUrl: "/blog-covers/how-ai-changes-our-future.svg",
    body: `Artificial intelligence is already sitting in the editor with you. Autocomplete writes a function. A chat window explains a stack trace. A reviewer bot comments on your pull request. The question is no longer whether AI will change programming. It is how you stay valuable when the first draft of code is cheap.

## What actually changed

For decades, typing was a bottleneck. You had to remember APIs, hunt through docs, and hold a lot of boilerplate in your head. Copilots collapse that cost. The new bottleneck is deciding what to build, whether the generated code is correct, and how it fits a real system with users, data, and failure modes.

That shift is bigger than a new tool. It changes what “being good at programming” looks like. Speed of syntax still helps. Speed of judgment matters more.

## Jobs will change shape, not vanish

Some tasks will shrink: writing CRUD from a spec, converting formats, drafting tests, summarizing logs. Other tasks grow: designing boundaries, reviewing security, naming the domain, and saying no to a plausible-looking bug.

Teams will expect fewer people to ship more. That can feel scary. It is also how compilers, open source, and cloud already worked. Each wave removed toil and increased leverage for people who understand the problem.

The programmers who thrive will treat AI as a junior pair: fast, tireless, and sometimes confidently wrong.

## Skills that compound with AI

Read generated code like you would a stranger’s PR. Ask: does this handle empty input, retries, and auth? Can I test it? Will this leak secrets?

Learn to specify. A vague prompt produces vague code. A precise prompt — types, constraints, examples, failure cases — produces something you can trust or reject quickly.

Keep fundamentals. Data structures, SQL, HTTP, concurrency, and security do not disappear because a model can recite them. Interviews and production incidents still punish people who cannot reason without a chatbot.

## How this shows up in interviews

Interviewers will still ask you to think out loud. They want to see if you can decompose a problem, pick a structure, and debug. Using AI at work is expected. Using it as a substitute for understanding is obvious.

A strong answer sounds like: here is the tradeoff, here is the risk, here is how I would verify the AI’s suggestion. Weak answers paste a solution they cannot explain.

## A practical stance for the next five years

Use AI daily for drafts, tests, and exploration. Never ship what you cannot explain. Invest in system design, debugging, and communication — those get more valuable as generation gets cheaper.

The future of programming is not “humans or machines.” It is humans who can direct machines, catch their mistakes, and own the outcome. That is still a craft. It just moved up a level.`,
  },
  {
    featured: false,
    category: "Data Structures",
    title: "How to Think in Data Structures",
    excerpt:
      "Stop memorizing cheat sheets. Learn to ask what the data needs to do — then the structure almost picks itself.",
    readMinutes: 8,
    featuredImageUrl: "/blog-covers/think-in-data-structures.svg",
    body: `Most people study data structures backwards. They memorize “hash map is O(1)” and hope the interview question matches a flashcard. Real problems start with operations, not names.

## Start with the verbs

What must be fast: lookup by key, insert at the front, scan in order, find the min, check membership? Write those verbs down. Arrays are great at index and scan. Hash maps are great at “have I seen this key?” Stacks are great at “undo the last thing.” Queues are great at “fair order.” Trees and heaps shine when you need ordered access or priority.

If you need both order and fast lookup, you are probably combining structures — and that is a normal senior answer, not a trick.

## Cost is a story, not a number

Big-O hides constants and memory. An O(n) scan of a small array can beat a hash map. A linked list insert is cheap at a cursor and expensive if you keep walking from the head. Interviews want the story: contiguous memory vs pointer chasing, extra space vs extra time.

Say the tradeoff out loud. “I would use a map from id to index so I can update in O(1) while keeping an array for order.” That sentence is worth more than a textbook definition.

## Practice with tiny constraints

Take a problem and change one constraint. Need the kth largest live? A heap appears. Need range sums? A prefix array or a tree. Need to detect a cycle? Fast and slow pointers, or a set of seen nodes.

The structure is a response to the constraint. When you train that reflex, new questions feel familiar even if you have not seen the exact prompt.

## What to do this week

Pick five problems. For each, write the operations first, then pick a structure, then code. If you cannot name the operations, you are not ready to type.

That is how data structures become a tool instead of a vocabulary test.`,
  },
  {
    featured: false,
    category: "Backend Engineering",
    title: "SQL Joins Without the Panic",
    excerpt:
      "Inner, left, and the rest are not trivia. They are how you describe which rows survive when two tables meet.",
    readMinutes: 8,
    featuredImageUrl: "/blog-covers/sql-joins.svg",
    body: `Joins scare people because the names sound like jargon. They are just rules for combining rows. If you can draw two tables on paper, you can learn joins.

## Inner join: only matches

INNER JOIN keeps rows where the key exists on both sides. Customers with orders. Orders without a customer disappear. Customers with no orders disappear. Use it when you truly need the pair.

## Left join: keep the left side

LEFT JOIN keeps every row from the left table. If there is no match, the right columns are NULL. That is how you list all users and still show “no orders yet.” Interviews love asking what NULL means here: it means no match, not a database crash.

RIGHT JOIN is the same idea flipped. FULL OUTER JOIN keeps both leftovers. You will use left far more than the others.

## Filters after a left join

WHERE right.id IS NULL finds left rows with no match — unmatched customers. WHERE right.id IS NOT NULL turns a left join back into an inner join. Putting a right-table filter in WHERE by accident is a classic bug.

## Indexes and nested loops

The database still has to find matching keys. An index on the join column turns a scan into a seek. Without it, large joins get slow and interviews will ask why.

Draw the tables. Name the key. Say which rows you refuse to drop. Then pick the join. That sequence beats memorizing a Venn diagram the night before.`,
  },
  {
    featured: false,
    category: "Interview Prep",
    title: "Write Code Other People Can Read",
    excerpt:
      "Clean code is not style points. It is how you prove you can work on a team — and how you survive your own code in six months.",
    readMinutes: 7,
    featuredImageUrl: "/blog-covers/readable-code.svg",
    body: `Interviewers do not only watch whether your algorithm works. They watch whether a teammate could change it on Monday. Readable code is a signal of professional judgment.

## Names do most of the work

totalPrice is better than tp. isExpired is better than flag. If you need a comment to explain a variable, the name is probably wrong. Functions should be verbs: parseToken, not tokenStuff.

## One job per function

A 80-line function that validates input, talks to the database, and formats HTML is hard to test and hard to describe. Split at the seams. Small functions also give you a natural place to explain the design out loud in an interview.

## Make illegal states hard

Use types and enums instead of magic strings. Avoid boolean parameters that mean three different things. Prefer a result object over a thrown string nobody handles.

## Comments that age well

Do not comment what the code already says. Comment the why: the business rule, the weird vendor API, the performance trap. Delete comments that lie.

Readable code is kindness to the next reader. In an interview, the next reader is sitting across from you.`,
  },
  {
    featured: false,
    category: "Interview Prep",
    title: "Debug Like You Mean It",
    excerpt:
      "Guessing wastes the room. A short loop — reproduce, isolate, observe, fix, verify — looks like seniority even on a whiteboard.",
    readMinutes: 7,
    featuredImageUrl: "/blog-covers/debug-like-you-mean-it.svg",
    body: `Debugging is the skill you use after the happy path. Many candidates freeze when a test fails. Strong candidates get curious.

## Reproduce first

If you cannot make it fail on purpose, you cannot know you fixed it. Write the smallest input that breaks. In an interview, say the input out loud before you change code.

## Isolate the layer

Is it the query, the mapper, the cache, or the client? Binary search the stack. Comment out half. Add one log. Change one thing. Scattershot prints look panicked; a targeted probe looks experienced.

## Read the error

Stack traces point at a call chain, not always the root cause. Null reference means something was missing earlier. Off-by-one means a boundary. Timeout means you are waiting on the wrong thing or the work is too big.

## Form a hypothesis

“I think the cache returns a stale user because the key ignores tenant id.” Then prove or kill that idea. Random edits without a hypothesis are how bugs go into hiding.

## Verify and leave a test

The fix is not done until the repro is green and a test guards the case. Interviewers notice when you add the test without being asked.

Debugging is scientific method at a keyboard. Practice it on your own broken code so it feels natural when someone is watching.`,
  },
  {
    featured: false,
    category: "Backend Engineering",
    title: "REST APIs Interviewers Actually Ask About",
    excerpt:
      "Status codes, idempotency, and pagination show up more often than framework trivia. Here is the mental model that holds.",
    readMinutes: 8,
    featuredImageUrl: "/blog-covers/rest-apis.svg",
    body: `You do not need to recite Roy Fielding. You do need to design an HTTP API that is hard to misuse and safe to retry.

## Resources and verbs

URLs name resources: /orders/12. Verbs say what happens: GET reads, POST creates, PUT replaces, PATCH updates a piece, DELETE removes. Mixing “getOrder” into a POST body is a smell.

## Status codes as a contract

200/201 for success. 400 for a bad request you can blame on the client. 401 unauthenticated, 403 forbidden. 404 not found. 409 conflict. 429 rate limit. 500 the server failed. Do not hide every failure behind 200 with a string in the body.

## Idempotency and retries

Networks double-submit. PUT and DELETE should be safe to repeat. POST that charges a card needs an idempotency key. Timeouts are not “maybe it worked” — you must be able to ask again without doubling the side effect.

## Pagination and filtering

Never return unbounded lists. Cursor pagination beats huge offsets on hot tables. Put filters in query strings for GET. Keep payloads boring: JSON, stable field names, documented nulls.

If you can explain those four ideas with an example, you will survive most API rounds — with or without a specific framework.`,
  },
  {
    featured: false,
    category: "Interview Prep",
    title: "A Calm Plan for Coding Interview Prep",
    excerpt:
      "You do not need 400 problems. You need a loop you can keep: patterns, timed practice, and honest review.",
    readMinutes: 8,
    featuredImageUrl: "/blog-covers/coding-interview-prep.svg",
    body: `Cramming fifty random LeetCode problems the week before a loop is how people burn out. A calmer plan beats a heroic one.

## Pick a small set of patterns

Arrays and hashing. Two pointers. Sliding window. Stack. BFS/DFS. Heaps. Binary search. Basic DP if the company asks for it. For each pattern, do a few problems until you can name the pattern from the prompt.

## Time-box like the real room

Twenty to thirty minutes. Talk out loud. If you are stuck at minute ten, state the brute force, then the bottleneck, then one improvement. Silence is more damaging than an incomplete optimal solution.

## Review like a coach

After each problem, write three lines: the pattern, the bug you hit, the invariant you missed. That log is more valuable than a green checkbox.

## Mix in the rest of the loop

Languages and SQL still show up. System design is a conversation about tradeoffs, not a logo dump. Behavioral stories need a situation, your action, and a measurable result.

## Protect your energy

Four focused days a week beat seven exhausted ones. Sleep is part of prep. So is one mock with a human who will interrupt you.

InterviewHub is built for that loop: pick a language or a category, work a level, and come back tomorrow. Consistency looks like talent from the other side of the table.`,
  },
];
