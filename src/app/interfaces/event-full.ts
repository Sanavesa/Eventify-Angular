export interface EventFull {
    id: string;
    name: string;
    info: {
        date: string;
        category: {
            genre: string,
            subGenre: string,
            segment: string,
            type: string,
            subType: string
        },
        priceRange: {
            min: number,
            max: number,
            currency: string
        },
        ticketStatus: string,
        buyURL: string,
        seatmapURL: string,
    },
    artists: Artist[],
    venue: {
        name: string,
        address: string,
        city: string,
        state: string,
        phoneNum: string,
        openHours: string,
        generalRule: string,
        childRule: string
        location: {
            latitude: string,
            longitude: string
        }
    }
};

export interface Artist {
    name: string,
    followers: number,
    popularity: number,
    spotifyURL: string,
    musicRelated: boolean
};