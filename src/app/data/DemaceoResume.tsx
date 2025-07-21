export type Role =
  | "Lead Front-End Engineer"
  | "Tech Consultant"
  | "Roadtripper"
  | "Teaching Assistant"
  | "Student Alumni Mentor"
  | "Software Engineer: Integrations Team"
  | "Support Engineer: Product Operations Team";

interface WorkExperience {
  organization: string;
  role: Role;
  startDate: string;
  endDate?: string;
  summary: string;
}

interface Education {
  institution: string;
  program: string;
  years: string;
}

interface DemaceoProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  languages: string[];
  certifications: string[];
  skills: string[];
  interests: string[];
  experiences: WorkExperience[];
  education: Education[];
}

export const DemaceoResume: DemaceoProfile = {
  name: "Demaceo Vincent",
  title: "Developer | Designer",
  location: "Colorado",
  email: "hdemaceo@gmail.com",
  website: "https://www.demaceo.com",
  linkedin: "https://www.linkedin.com/in/demaceo",
  languages: ["English (Native)", "Spanish (Limited)"],
  certifications: [
    "Front-End Engineering, UI/UX",
    "GenAI for Business Leaders",
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "UI/UX Design",
    "Performance Optimization",
    "Mentorship",
    "API Integration",
    "Accessibility",
  ],
  interests: [
    "Public Interest Technology",
    "Sustainable Development",
    "Community-Centered Solutions",
    "Scuba Diving",
    "Coding",
  ],
  experiences: [
    {
      organization: "Engineer My Career",
      role: "Lead Front-End Engineer",
      startDate: "Feb 2025",
      summary:
        "Lead the front-end development of career-oriented web applications using React, TypeScript, and modern UI/UX practices. Collaborate closely with designers and backend engineers to create intuitive, responsive, and accessible user interfaces. Implement best practices for performance optimization, resulting in faster load times and improved user engagement. Mentor junior developers, conduct regular code reviews, and maintain coding standards.",
    },
    {
      organization: "RentHarbor",
      role: "Tech Consultant",
      startDate: "April 2025",
      summary:
        "Provide strategic technical guidance for the implementation and enhancement of RentHarbor’s web platform. Collaborate with stakeholders to identify requirements, design technical solutions, and optimize product functionality. Assist in integrating and managing third-party services, ensuring robust and secure data handling.",
    },
    {
      organization: "Roadtrip Nation",
      role: "Roadtripper",
      startDate: "Aug 2024",
      endDate: "Sept 2024",
      summary:
        "Participated in the filming of a documentary focused on Public Interest Technology (PIT). Conducted interviews with influential leaders and professionals nationwide to highlight impactful technology initiatives. Engaged actively in discussions around technology’s role in fostering equitable and community-centered solutions.",
    },
    {
      organization: "HypercardAI",
      role: "Lead Front-End Engineer",
      startDate: "Oct 2023",
      endDate: "Apr 2024",
      summary:
        "Utilized React and TypeScript to enhance UI/UX, resulting in a streamlined user experience and a 15% increase in user engagement. Led the development of a customizable data export feature, allowing users to download project data in multiple formats (PPT, PDF, CSV, DOCX, XLSX, JSON), which boosted data accessibility by 25%. Implemented various customization options for PDF, DOCX, and PPT exports, enabling users to tailor background color, font style, and font color, leading to an 80% user satisfaction rate for document customization.",
    },
    {
      organization: "Upright Education",
      role: "Teaching Assistant",
      startDate: "Oct 2023",
      summary:
        "Teach full-stack JavaScript software development, including front-end, back-end, and database management. Facilitate learning through practical exercises, code reviews, and comprehensive weekly projects. Mentor students individually, ensuring skill mastery in agile methodologies, version control, and UI/UX principles.",
    },
    {
      organization: "Turing School of Software & Design",
      role: "Student Alumni Mentor",
      startDate: "June 2021",
      endDate: "Dec 2024",
      summary:
        "Led individual mentoring sessions and provided detailed feedback on students’ GitHub projects. Offered professional development support through mock interviews, UI/UX design critiques, and coding exercises.",
    },
    {
      organization: "Human Interest",
      role: "Software Engineer: Integrations Team",
      startDate: "Sep 2021",
      endDate: "Feb 2023",
      summary:
        "Contributed to various aspects of the application (Front-End, Back-End, data ingestion), consistently delivering high-quality results. Tested and integrated over 95% of partner APIs, enhancing partnerships and streamlining processes. Created automation scripts for the CI/CD pipeline, reducing integration time by 30%. Developed external/internal UI tools to eliminate engineering efforts, cutting manual tasks by 50%. Logged, tracked, and debugged production incidents as on-call engineer, ensuring application stability.",
    },
    {
      organization: "Human Interest",
      role: "Support Engineer: Product Operations Team",
      startDate: "May 2021",
      endDate: "Sep 2021",
      summary:
        "Collaborated with a global team to improve processes through documentation and reporting, reducing issue resolution time by 25%. Executed manual and automated test scripts, boosting regression coverage and contributing to a 15% increase in product stability. Utilized data management skills to troubleshoot, optimize performance, and implement enhancements, leading to a 20% performance improvement.",
    },
  ],
  education: [
    {
      institution: "Turing School of Software & Design",
      program: "Front-End Engineering, UI/UX",
      years: "",
    },
    {
      institution: "Cornell College",
      program: "Bachelor of Science in Biology",
      years: "",
    },
  ],
};

export default DemaceoResume;
