import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { ReactNode } from "react";


interface MapContainerProps {
    defaultCenter: [number, number];
    mapChildren?: ReactNode;
    mapOverlay?: ReactNode;
}


export function MapContainer({
    defaultCenter,
    mapChildren,
    mapOverlay,
}: MapContainerProps) {


    const mapKey = process.env.NEXT_PUBLIC_MAP_KEY;
    const mapId = process.env.NEXT_PUBLIC_MAP_ID ?? '';

    if (!mapKey) {
        throw new Error('NEXT_PUBLIC_MAP_KEY is not defined');
    }

    return (
        <APIProvider apiKey={mapKey}>
            {mapOverlay}
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultCenter={{ lat: defaultCenter[0], lng: defaultCenter[1] }}
                defaultZoom={14}
                mapId={mapId}>
                {mapChildren}
            </Map>
        </APIProvider>

    );
}