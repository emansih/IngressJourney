'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomAdvancedMarker } from "./custom-marker";
import { useMap } from "@vis.gl/react-google-maps";
import { getAllDrone, getDroneInBoundingBox } from "@/app/libs/db";
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';


export function FetchDroneOnBoundsChange() {

    const map = useMap();
    const [entities, setEntities] = useState<Portal[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

    const clusterer = useMemo(() => {
        if (!map) return null;

        return new MarkerClusterer({ map });
    }, [map]);

    useEffect(() => {
        if (!clusterer) return;

        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markers));
    }, [clusterer, markers]);

    const setMarkerRef = useCallback((marker: Marker | null, key: number) => {
        setMarkers(markers => {
            if ((marker && markers[key]) || (!marker && !markers[key]))
                return markers;

            if (marker) {
                return { ...markers, [key]: marker };
            } else {
                const { [key]: _, ...newMarkers } = markers;

                return newMarkers;
            }
        });
    }, []);

    useEffect(() => {
        if (!map) return;

        getAllDrone().then(value => {
            setEntities(value)
        })
    }, [map]);

    return (
        <>
            {entities.map((portal, idx) => (
                <CustomAdvancedMarker
                    key={idx}
                    entity={{
                        id: portal.id,
                        lat: portal.lat,
                        lon: portal.lon,
                        first_seen_time: portal.first_seen_time
                    }}
                    isOpen={openId === idx}
                    setMarkerRef={setMarkerRef}
                    onToggle={() => setOpenId(openId === idx ? null : idx)}
                    heading={'Drone Visited'}
                />
            ))}

        </>
    )
}