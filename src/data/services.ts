import type { Service } from "@/lib/types";

const services: Service[] = [
  {
    id: "sb1",
    title: "Web Apps & Corporate Sites",
    description:
      "I craft websites and web apps that don't just look good — they serve a function. Whether it's a responsive marketing site or a fully-interactive dashboard, I merge aesthetic with utility to create experiences that work across browsers, devices, and humans.",
    icon: "/icons/services/WACS.png",
    outcome: "Conversion-focused web experiences with production analytics.",
    panels: [
      {
        label: "What you get",
        points: [
          "Responsive marketing sites & interactive dashboards",
          "Consistent behavior across browsers and devices",
          "Analytics & conversion tracking wired in from day one",
          "Clean, handoff-ready code you actually own",
        ],
      },
      {
        label: "How I work",
        body: "Design-first and component-driven — I set performance budgets and accessibility checks early, then build in small, reviewable increments.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["React", "Next.js", "TypeScript", "Tailwind", "Vercel"],
      },
      {
        label: "Ideal for",
        body: "Founders and teams who need a site that looks sharp and does real work — not just a pretty brochure.",
      },
    ],
  },
  {
    id: "sb2",
    title: "Mobile App Design",
    description:
      "From napkin sketch to high-fidelity prototype, I design mobile experiences that feel intuitive and intentional. I keep platform guidelines and real-world users in mind, making sure the interface supports the story your app wants to tell (on iOS or Android).",
    icon: "/icons/services/MAD.png",
    outcome: "App flows that feel native, fast, and easy to learn.",
    panels: [
      {
        label: "What you get",
        points: [
          "Wireframes through high-fidelity prototypes",
          "Platform-aware iOS & Android flows",
          "Prototypes you can test with real users",
          "A design system your devs can build from",
        ],
      },
      {
        label: "How I work",
        body: "I start from the user's job-to-be-done, sketch the flow, then raise fidelity only once the structure holds up.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["Figma", "Framer", "Prototyping", "Design Systems"],
      },
      {
        label: "Ideal for",
        body: "Teams turning a concept into something testable before committing engineering time.",
      },
    ],
  },
  {
    id: "sb3",
    title: "Front End Development",
    description:
      "I convert ideas and interfaces into responsive, accessible, production-ready code. My code is thoughtful, maintainable, and responsive. Think smooth transitions, semantic structure, and a UI that actually feels like it was built for people.",
    icon: "/icons/services/FED.png",
    outcome: "Accessible, responsive interfaces that scale in codebase and team size.",
    panels: [
      {
        label: "What you get",
        points: [
          "Production-ready, accessible components",
          "Responsive layouts that hold up anywhere",
          "Smooth, intentional transitions & states",
          "Maintainable, clearly-structured code",
        ],
      },
      {
        label: "How I work",
        body: "Semantic markup first, then styling and motion — I keep components small, typed, and easy for the next dev to read.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["React", "Next.js", "TypeScript", "CSS", "Framer Motion"],
      },
      {
        label: "Ideal for",
        body: "Teams who need designs translated into code that stays clean as the product grows.",
      },
    ],
  },
  {
    id: "sb4",
    title: "API & Microservices",
    description:
      "Good software needs solid structure. I design APIs that act like reliable messengers: fast, secure, and easy to work with. Whether it's building microservices or wiring up third-party integrations, the goal is clean communication between systems, no drama.",
    icon: "/icons/services/AM.png",
    outcome: "Predictable integrations and stable system-to-system communication.",
    panels: [
      {
        label: "What you get",
        points: [
          "REST/GraphQL APIs with clear contracts",
          "Third-party integrations that just work",
          "Auth, validation & error handling built in",
          "Docs your team can actually follow",
        ],
      },
      {
        label: "How I work",
        body: "I model the data and contracts first, keep services focused, and make failure modes explicit instead of surprising.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["Node.js", "Express", "REST", "GraphQL", "PostgreSQL"],
      },
      {
        label: "Ideal for",
        body: "Products that need reliable communication between systems, services, or third parties.",
      },
    ],
  },
  {
    id: "sb5",
    title: "Cloud & DevOps",
    description:
      "I set up infrastructure that doesn't get in your way. I help take projects from 'it works on my machine..' to 'it works everywhere!'. I automate the tedious stuff so your ideas ship faster and more reliably. Out of sight but not out of mind - infrastructure as it should be.",
    icon: "/icons/services/CDO.png",
    outcome: "Repeatable releases with deployment confidence and lower operational drag.",
    panels: [
      {
        label: "What you get",
        points: [
          "CI/CD pipelines for repeatable releases",
          "Infrastructure as code, not tribal knowledge",
          "Environments that match from dev to prod",
          "Monitoring so you hear about issues first",
        ],
      },
      {
        label: "How I work",
        body: "I automate the tedious, error-prone steps so shipping is boring in the best way — predictable and low-drama.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["AWS", "Docker", "GitHub Actions", "Terraform", "CI/CD"],
      },
      {
        label: "Ideal for",
        body: "Teams tired of manual deploys and 'works on my machine' surprises.",
      },
    ],
  },
  {
    id: "sb6",
    title: "Data & Database Design",
    description:
      "We expect our data to be cleanly organized, quickly accessible, and securely protected. Whether it's MongoDB, PostgreSQL, or something in between, I organize data in a way that makes it easy to find, secure to store, and fast to query.",
    icon: "/icons/services/DDD.png",
    outcome: "Clean domain models, faster queries, and durable data governance.",
    panels: [
      {
        label: "What you get",
        points: [
          "Schemas modeled around real access patterns",
          "Indexes & queries tuned for speed",
          "Migrations that won't wake you at 2am",
          "Sensible backups & access controls",
        ],
      },
      {
        label: "How I work",
        body: "I map how the data is actually read and written first, then design a schema that stays fast and sane as it grows.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["PostgreSQL", "MongoDB", "SQL", "Prisma", "Redis"],
      },
      {
        label: "Ideal for",
        body: "Products where data is getting messy, slow, or hard to trust.",
      },
    ],
  },
  {
    id: "sb7",
    title: "Automation & Scripting",
    description:
      "If it's repetitive, it likely can/should be automated and if I can automate it, I will. I build lightweight scripts and tools that cut down on repetitive tasks, reduce human error, and free up time for the stuff that actually needs a human.",
    icon: "/icons/services/AS.png",
    outcome: "Less manual overhead through targeted automation and scripting.",
    panels: [
      {
        label: "What you get",
        points: [
          "Scripts that kill repetitive manual work",
          "Scheduled jobs & one-click tasks",
          "Fewer human errors in routine processes",
          "Time back for work that needs a human",
        ],
      },
      {
        label: "How I work",
        body: "I find the repetitive, error-prone steps, script them, and leave you something small, documented, and easy to rerun.",
      },
      {
        label: "Tech & tools",
        kind: "tags",
        points: ["Python", "Bash", "Node.js", "Cron", "GitHub Actions"],
      },
      {
        label: "Ideal for",
        body: "Anyone doing the same manual task over and over that a machine could handle.",
      },
    ],
  },
];

export default services;
