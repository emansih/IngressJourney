'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { TripsLayer } from '@deck.gl/geo-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import type { DeckProps } from '@deck.gl/core';
import { getPlusDeltaActions } from '../libs/db';

type DataType = {
    waypoints: {
        coordinates: [number, number]; // [lng, lat]
        timestamp: number;
    }[];
};

function DeckGLOverlay(props: DeckProps) {
    const map = useMap();
    const overlay = useMemo(() => new GoogleMapsOverlay(props), []);
    useEffect(() => {
        overlay.setMap(map);
        return () => overlay.setMap(null);
    }, [map])

    overlay.setProps(props);
    return null;
}


export default function Page() {
    const mapKey = process.env.NEXT_PUBLIC_MAP_KEY ?? '';
    const mapId = process.env.NEXT_PUBLIC_MAP_ID ?? '';

    const [currentTime, setCurrentTime] = useState(0);
    const [tripData, setTripData] = useState<DataType[]>([])
    const [totalDuration, setTotalDuration] = useState(1000); // seconds


    useEffect(() => {
        if (tripData.length === 0) return;

        let raf = 0;
        const start = performance.now();
        const pauseDuration = 800; // ms to pause at the end before restart

        function tick() {
            const elapsedSeconds = (performance.now() - start) / 50;
            const t = (elapsedSeconds * 3) % totalDuration; 

            if (t >= totalDuration - 1 / 60) {
                // when we reach near the end, pause briefly then restart
                setTimeout(() => {
                    setCurrentTime(0);
                }, pauseDuration);
            } else {
                setCurrentTime(t);
            }

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [tripData, totalDuration]);


    useEffect(() => {
        getPlusDeltaActions().then((value) => {
            if (value.length === 0) return;
            const formatted: DataType[] = [
                {
                    waypoints: value.map(item => ({
                        coordinates: [item.longitude, item.latitude],
                        timestamp: item.event_time,
                    })),
                },
            ];
            console.log(formatted)
            const lastTimestamp = formatted[0].waypoints[formatted[0].waypoints.length - 1].timestamp;

            setTotalDuration(lastTimestamp + 1);

            setTripData(formatted);
        });
    }, []);

    const tripsLayer = useMemo(
        () =>
            new TripsLayer<DataType>({
                id: 'TripsLayer',
                data: tripData,
                getPath: (d) => d.waypoints.map((p) => p.coordinates),
                getTimestamps: (d) => d.waypoints.map((p) => p.timestamp),
                getColor: [253, 128, 93],
                currentTime: currentTime,
                trailLength: totalDuration / 10,
                capRounded: true,
                jointRounded: true,
                widthMinPixels: 8,
            }),
        [tripData, currentTime, totalDuration]
    );

    const deckProps = useMemo(() => ({ layers: [tripsLayer] }), [tripsLayer]);

    return (
        <APIProvider apiKey={mapKey}>
            <DeckGLOverlay {...deckProps} />  
            <Map style={{ width: '100vw', height: '100vh' }}
                defaultCenter={{ lat: -8.710340838, lng: 115.17494434764978 }}
                defaultZoom={14}
                mapId={mapId}>
            </Map>
        </APIProvider>
    );
}