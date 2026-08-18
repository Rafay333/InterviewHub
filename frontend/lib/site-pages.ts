export const siteContact = {
  founderName: "Abdul Rafay",
  email: "rafay9492@gmail.com",
  location: "Rawalpindi, Pakistan",
  githubUrl: "https://github.com/Rafay333",
  githubHandle: "Rafay333",
  responseNote: "Messages go to Abdul Rafay. He reads every one and replies as soon as he can.",
};

export const aboutHighlights = [
  {
    title: "Practice by stack",
    text: "Open a language hub and drill Beginner, Intermediate, and Expert questions the way interviews actually escalate.",
  },
  {
    title: "Study by topic",
    text: "Cover OOP, SQL, system design, web, cloud, testing, and security without jumping between random lists.",
  },
  {
    title: "Answers you can defend",
    text: "Each question has a short answer plus an explanation — often with a diagram — so you can talk through it, not memorize a slogan.",
  },
  {
    title: "Guides between drills",
    text: "The blog covers interview loops, readable code, APIs, and how AI is changing the work — useful when you need context, not another quiz.",
  },
] as const;

/** Learner feedback shown on About. Replace with real quotes when you have them. */
export const learnerFeedback = [
  {
    quote:
      "The Beginner → Expert split is the part I was missing. I stopped grinding random lists and actually knew what to revise the night before.",
    name: "Ayesha K.",
    role: "Frontend engineer",
  },
  {
    quote:
      "SQL and system design finally felt explainable. The diagrams are what I sketched from in the interview, not a wall of text.",
    name: "Daniel M.",
    role: "Backend developer",
  },
  {
    quote:
      "I used the language hubs for JavaScript and the category pages for OOP. Same voice everywhere, so I could switch topics without starting over.",
    name: "Priya S.",
    role: "CS graduate",
  },
  {
    quote:
      "The blog plus the question banks is a better loop than another LeetCode binge. I could practice, then read why the answer is shaped that way.",
    name: "Omar R.",
    role: "Career switcher",
  },
] as const;
