export interface Episode {
    id: string;
    title: string;
    duration: string;
    embedId: string;
    externalUrl: string;
}

export const documentaryEpisodes: Episode[] = [
    {
        id: "episode-1",
        title: "Breaking Barriers",
        duration: "25:33",
        embedId: "3103491061",
        externalUrl:
            "https://www.pbs.org/video/breaking-barriers-tech-for-us-kaq5cy/",
    },
    {
        id: "episode-2",
        title: "Building Futures",
        duration: "26:45",
        embedId: "3103497515",
        externalUrl: "https://www.pbs.org/video/building-futures-tech-for-us-ep2/",
    },
];
