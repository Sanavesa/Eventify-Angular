export interface EventBrief {
    date: string;
    name: string;
    category: {
        genre: string;
        subGenre: string;
        segment: string;
        type: string;
        subType: string;
    },
    venue: string;
    id: string;
};