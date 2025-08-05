export interface AboutMePill {
    label: string;
    tooltip: string;
    link?: string;
}

export const aboutMePills: AboutMePill[] = [
    {
        label: "Intuitive Problem Solver",
        tooltip:
            "See patterns, simplify complexity, and generate creative solutions.",
    },
    // Uncomment if you want to show this pill:
    {
        label: "Adaptive Learner",
        tooltip: "Energized by change, challenge, and continuous learning.",
    },
    {
        label: "Empathetic Connector",
        tooltip:
            "Listen deeply, build trust, and foster inclusive collaboration.",
    },
    {
        label: "Analytical & Reliable",
        tooltip:
            "Detail-oriented, organized, and steady - someone you can count on to follow through.",
    },
    {
        label: "Transparent Communicator",
        tooltip:
            "Quick to understand and articulate new concepts; skilled at building rapport with people from all walks of life.",
    },
    {
        label: "Purpose-Driven Innovator",
        tooltip:
            "Driven by curiosity, integrity, and a desire to make a positive impact.",
    },
    {
        label: "& more...",
        tooltip: "click to learn more!",
        link: "https://roadtripnation.com/roadtrip/tech-for-us-documentary",
    },
];
