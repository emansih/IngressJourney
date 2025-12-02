type GamelogNew = {
    id: string | null;
    eventTime: Date;
    action: string;
    comment: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
};
