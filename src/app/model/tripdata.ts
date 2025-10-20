export type TripDataType = {
    waypoints: {
        coordinates: LatLng; // [lng, lat]
        timestamp: number;
        action: string;
        time: Date;
    }[];
};
