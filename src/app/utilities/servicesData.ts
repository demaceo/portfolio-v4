import webappsIcon from "../../assets/icons/WACS.png";
import mobileappIcon from "../../assets/icons/MAD.png";
import frontendIcon from "../../assets/icons/FED.png";
import apiIcon from "../../assets/icons/AM.png";
import clouddevopsIcon from "../../assets/icons/CDO.png";
import databasesIcon from "../../assets/icons/DDD.png";
import automationIcon from "../../assets/icons/AS.png";

const services = [
  {
    id: "sb1",
    title: "Web Apps & Corporate Sites",
    description:
      "I craft websites and web apps that don’t just look good - they serve a function. Merging aesthetic with utility to create experiences that work across browsers, devices, and humans.",
    icon: webappsIcon,
  },
  {
    id: "sb2",
    title: "Mobile App Design",
    description:
      "From napkin sketch to high-fidelity prototype, I design mobile experiences that feel intuitive and intentional. I keep platform guidelines and real-world users in mind, making sure the interface supports the story your app wants to tell (on iOS or Android).",
    icon: mobileappIcon,
  },
  {
    id: "sb3",
    title: "Front End Development",
    description:
      "I convert ideas and interfaces into responsive, accessible, production-ready code. My code is thoughtful, maintainable, and responsive. Think smooth transitions, semantic structure, and a UI that actually feels like it was built for people.",
    icon: frontendIcon,
  },
  {
    id: "sb4",
    title: "API & Microservices",
    description:
      "Good software needs solid structure. I design APIs that act like reliable messengers — fast, secure, and easy to work with. Whether it's building microservices or wiring up third-party integrations — the goal is clean communication between systems, no drama",
    icon: apiIcon,
  },
  {
    id: "sb5",
    title: "Cloud & DevOps",
    description:
      "I set up infrastructure that doesn’t get in the way. I help take projects from “it works on my machine..” to “it works everywhere!” From Docker containers and CI/CD pipelines to AWS and Azure deployments, I automate the tedious stuff so your ideas ship faster and more reliably. Out of sight but not out of mind - infrastructure as it should be.",
    icon: clouddevopsIcon,
  },
  {
    id: "sb6",
    title: "Data & Database Design",
    description:
      "We expect our data to be neatly organized, quickly accessible, and securely protected. Whether it’s MongoDB, PostgreSQL, or something in between, I organize data in a way that makes it easy to find, secure to store, and fast to query — because performance starts at the schema.",
    icon: databasesIcon,
  },
  {
    id: "sb7",
    title: "Automation & Scripting",
    description:
      "If it's repetitive, it likely can/should be automated and if I can automate it, I will. I build lightweight scripts and tools that cut down on repetitive tasks, reduce human error, and free up time for the stuff that actually needs a human.",
    icon: automationIcon,
  },
];

export default services;
