import { type Episode } from "@/data";

export interface EpisodeContent {
    description: string;
    extendedDescription: string;
    production: string;
    series: string;
    topics: string;
}

// Episode-specific content data
export const episodeContentMap: Record<string, EpisodeContent> = {
    "episode-1": {
        description: "I was featured in this documentary exploring the intersection of technology, innovation, and career development in the modern digital landscape. This episode highlights breaking barriers and personal stories of professionals navigating challenges in tech.",
        extendedDescription: "In this compelling episode, I share my journey through the tech industry, discussing the challenges and triumphs that have shaped my career. This documentary captures the real human stories behind the technology that impact us every day. The episode features candid conversations about imposter syndrome, the importance of diversity in tech, and how personal experiences can drive innovation.",
        production: "Roadtrip Nation",
        series: "Tech For Us",
        topics: "Career Development, Public Interest Technology, Innovation"
    },
    "episode-2": {
        description: "The second episode continues the journey, focusing on building sustainable futures in technology and how professionals are creating lasting impact through innovation and community engagement.",
        extendedDescription: "This episode delves deeper into the practical aspects of building sustainable careers in technology. Featuring insights on leadership, team building, and the responsibility that comes with technological advancement. The documentary explores how professionals are leveraging their skills to create positive social impact, build inclusive communities, and mentor the next generation of tech innovators.",
        production: "Roadtrip Nation",
        series: "Tech For Us",
        topics: "Sustainability, Community Impact, Leadership"
    }
};

// Get content for a specific episode
export const getEpisodeContent = (episodeId: string): EpisodeContent => {
    return episodeContentMap[episodeId] || episodeContentMap["episode-1"];
};

// Get episode number from episodes array
export const getEpisodeNumber = (episodes: Episode[], episodeId: string): number => {
    return episodes.findIndex((ep: Episode) => ep.id === episodeId) + 1;
};
