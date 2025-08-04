import { Project } from "@/lib/types";

const projectData: Project[] = [
  {
    id: 8,
    name: "Engineer My Career",
    image: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHE3ajE3bnBweG83enpxczRlcmVvandvdjN2NTJzbWZmcDl1Z3FveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BY1lBaFvNMFE5gYNP9/giphy.gif",
    description:
      "Engineer My Career helps developers plan, track, and accelerate their growth with personalized road-maps, skill assessments, and job-search tooling.",
    link: "https://engineermycareer.com",
    icon: "fas fa-briefcase icon",
    gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHE3ajE3bnBweG83enpxczRlcmVvandvdjN2NTJzbWZmcDl1Z3FveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BY1lBaFvNMFE5gYNP9/giphy.gif",
  },
  {
    id: 9,
    name: "PBS Documentary Feature",
    image: "https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto",
    description: "Featured in a PBS documentary exploring technology, innovation, and career development in the modern digital landscape.",
    link: "https://player.pbs.org/video/in-our-genes/", // Replace with actual PBS link
    icon: "fas fa-film icon",
    type: "documentary",
    duration: "25:33",
    network: "PBS",
  },
  {
    id: 0,
    name: "Pinpoint",
    description:
      "A tool to help U.S. citizens find and engage with their elected officials using data visualization and AI-powered message drafting.",
    link: "https://pinpoint-flax.vercel.app/",
    icon: "/icons/pp_icon.png",
    image: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BqcHJydDE0OWlyaXBzbzIweTV4bjh2bzNidW1oenprMHdpaTRxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/e9zB7dPkmU7FUBNh8A/giphy.gif"
  },
  {
    id: 1,
    name: "Unmasked Coaching",
    description:
      "Unmasked Coaching helps individuals unlock their true potential through personalized career guidance, professional development, and strategic growth.",
    link: "https://unmasked-coaching.com",
    icon: "/icons/unmasked-logo.png",
    image: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXRhZ3h4aTM5eWgyMjdscWY3bXJwaGQybHRiMnM0YjVhYW5vcHU0OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sizoIiglMpC57qXlaq/giphy.gif",
  },
  {
    id: 2,
    name: "Adopt Don't Shop",
    image: "",
    description:
      "A pet adoption platform that connects users with rescue shelters across the U.S., integrating the Petfinder API for real-time listings.",
    link: "https://demaceo.github.io/adoptdontshop/",
    icon: "fa fa-paw icon",
    archived: true,
  },
  {
    id: 3,
    name: "Moody Tunes",
    image:
      "https://user-images.githubusercontent.com/66697338/104397652-796aac00-550a-11eb-8f64-4b7f7e0c07cc.gif",
    description:
      "Moody Tunes is a music recommendation engine that provides music recommendations based on a user's mood. Users are able to save songs into their 'Favorites' and view the information at a later time, or play the song directly from Spotify.",
    link: "https://demaceo.github.io/moodytoonz/",
    icon: "fas fa-theater-masks icon",
    archived: true,
  },
  // {
  //   id: 4,
  //   name: "Automation Scripts",
  //   image: "",
  //   description:
  //     "A personal collection of scripts and tools designed to automate workflows, speed up development, and eliminate repetitive tasks.",
  //   link: "https://github.com/demaceo/automations",
  //   icon: "fas fa-robot icon",
  //   archived: true,
  // },
  {
    id: 5,
    name: "Cappua",
    image: "https://media.giphy.com/media/VTLAVXMEcDEMuGWDV5/giphy.gif",
    description:
      "One part crowdsourced songwriting; one part rap battle. Cappua is a monthly Hip-Hop music competition app in which users compete to get their verse included in the given month's featured track. Users upload their verse for a month's track and vote on their favorite uploaded verses as they vie for their place on the Cappua Hall of Fame, otherwise known as Olympus.",
    link: "https://github.com/Cappua/cappua-fe",
    icon: "fas fa-music icon",
    archived: true,
  },
  {
    id: 6,
    name: "What's Cookin",
    image: "https://media.giphy.com/media/yHlPATYrKHmIBcgHpM/giphy.gif",
    description:
      "A simple and elegant site to search, share and store your recipes. This site presents the user with the ability to 'log-in' and search the site for recipes.",
    link: "https://demaceo.github.io/whats-cookin/",
    icon: "fas fa-cookie-bite icon",
    archived: true,
  },
  {
    id: 7,
    name: "Rancid Tomatillos",
    image: "https://media.giphy.com/media/0aJoS84OErWv5MlCmw/giphy.gif",
    description:
      "The site presents the user an assortment of movies with their corresponding information and gives the user the ability to sort movies based on their ratings.",
    link: "https://github.com/demaceo/rantom",
    icon: "fas fa-film icon",
    archived: true,
  },

];

export default projectData;
export { projectData };
export { projectData as projectsData };
