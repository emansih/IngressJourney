'use client'

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { CSSProperties, ReactNode } from "react";


interface MapContainerProps {
    defaultCenter: [number, number];
    mapChildren?: ReactNode;
    mapOverlay?: ReactNode;
    mapStyle: CSSProperties | undefined;
}


export function MapContainer({
    defaultCenter,
    mapChildren,
    mapOverlay,
    mapStyle
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
                style={mapStyle}
                defaultCenter={{ lat: defaultCenter[0], lng: defaultCenter[1] }}
                defaultZoom={14}
                mapId={mapId}>
                {mapChildren}
            </Map>
        </APIProvider>

    );
}