type GamelogNew = {
    id: string | null;
    eventTime: string;
    action: string;
    comment: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
};
