'use client'

import React, { useEffect, useState } from 'react';
import { getActionsRange, getUserInteractionBattleBeacon } from '../../libs/db';
import { formatTime } from '../../util/dateTimeUtil';
import { MapContainer } from '../../components/map/map-container';
import { ActionCard } from '../../components/card/action-card';
import { useDeckLayers } from '../../hooks/useDeckLayers';
import { DeckMap } from '../../components/map/deck-map';
import { TripDataType } from '../../model/tripdata';

// This code assumes that the user went to the +Delta in Bali
// https://ingress.com/en/news/2025-plusdelta
// https://web.archive.org/web/20250000000000*/https://ingress.com/en/news/2025-plusdelta

export default function Page() {

    const [currentTime, setCurrentTime] = useState(0);
    const [tripData, setTripData] = useState<TripDataType[]>([]);
    const [totalDuration, setTotalDuration] = useState(1000);
    const [currentInfo, setCurrentInfo] = useState<{ action: string; timestamp: string } | null>(null);
    const [pulseTime, setPulseTime] = useState(0);
    const [battleBeacons, setBattleBeacons] = useState<LatLng[]>([]);

    // Pulse timer
    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = () => {
            const elapsed = (performance.now() - start) / 1000;
            setPulseTime(elapsed);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Trip timer
    useEffect(() => {
        if (!tripData.length) return;
        let raf = 0;
        const start = performance.now();
        const pauseDuration = 800;

        function tick() {
            const elapsedSeconds = (performance.now() - start) / 100;
            const t = (elapsedSeconds * 3) % totalDuration;

            if (t >= totalDuration - 1 / 60) {
                setTimeout(() => setCurrentTime(0), pauseDuration);
            } else {
                setCurrentTime(t);
            }

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [tripData, totalDuration]);

    useEffect(() => {
        if (!tripData.length) return;
        const waypoints = tripData[0].waypoints;
        const index = waypoints.findIndex((p) => p.timestamp > currentTime);
        const current = index > 0 ? waypoints[index - 1] : waypoints[0];

        if (current && current.action) {
            setCurrentInfo({ action: current.action, timestamp: formatTime(current.time, 'Asia/Makassar') });
        }
    }, [currentTime, tripData]);

    // Fetch data
    useEffect(() => {
        const startDateTime = "2025-09-20T14:00:00+08:00"
        const endDateTime = "2025-09-20T17:00:00+08:00"
        getUserInteractionBattleBeacon(
            new Date(startDateTime),
            new Date(endDateTime)
        ).then(setBattleBeacons);

        getActionsRange(startDateTime, endDateTime).then((value) => {
            if (!value.length) return;
            const formatted: TripDataType[] = [
                {
                    waypoints: value.map(item => ({
                        coordinates: [item.longitude, item.latitude],
                        timestamp: item.event_number,
                        action: item.action,
                        time: item.event_time,
                    })),
                },
            ];
            const lastTimestamp = formatted[0].waypoints[formatted[0].waypoints.length - 1].timestamp;
            setTotalDuration(lastTimestamp + 1);
            setTripData(formatted);
        });
    }, []);

    const layers = useDeckLayers(tripData, battleBeacons, pulseTime, currentTime, totalDuration);

    return (
        <MapContainer
            defaultCenter={[-8.710340838, 115.17494434764978]}
            mapChildren={currentInfo && <ActionCard action={currentInfo.action} timestamp={currentInfo.timestamp} />}
            mapOverlay={<DeckMap layers={layers} />}
        />
    );
}