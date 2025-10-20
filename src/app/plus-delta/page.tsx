'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { TripsLayer } from '@deck.gl/geo-layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import type { DeckProps, Layer } from '@deck.gl/core';
import { getPlusDeltaActions, getUserInteractionBattleBeacon } from '../libs/db';
import { formatTime } from '../util/dateTimeUtil';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapContainer } from '../components/map/map-container';

type DataType = {
    waypoints: {
        coordinates: LatLng; // [lng, lat]
        timestamp: number;
        action: string;
        time: Date;
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

// This code assumes that the user went to the +Delta in Bali
// https://ingress.com/en/news/2025-plusdelta
export default function Page() {

    const [currentTime, setCurrentTime] = useState(0);
    const [tripData, setTripData] = useState<DataType[]>([])
    const [totalDuration, setTotalDuration] = useState(1000); // seconds
    const [currentInfo, setCurrentInfo] = useState<{ action: string; timestamp: string } | null>(null);
    const [pulseTime, setPulseTime] = useState(0);
    const [battleBeacons, setBattleBeacons] = useState<LatLng[]>([]); 


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


    useEffect(() => {
        if (tripData.length === 0) return;

        let raf = 0;
        const start = performance.now();
        const pauseDuration = 800; // ms to pause at the end before restart

        function tick() {
            const elapsedSeconds = (performance.now() - start) / 100;
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
        if (!tripData.length) return;
        const waypoints = tripData[0].waypoints;

        // Find the closest waypoint whose timestamp <= currentTime
        const index = waypoints.findIndex((p) => p.timestamp > currentTime);

        const current = index > 0 ? waypoints[index - 1] : waypoints[0];

        if (current && current.action) {
            setCurrentInfo({ action: current.action, timestamp: formatTime(current.time, 'Asia/Makassar') });
        }
    }, [currentTime, tripData]);

    useEffect(() => {
        getUserInteractionBattleBeacon(new Date('2025-09-20T14:00:00+08:00'), new Date('2025-09-20T17:00:00+08:00')).then((value) => {
            setBattleBeacons(value)
        })
        getPlusDeltaActions().then((value) => {
            if (value.length === 0) return;
            const resoDestroyed = value.filter(plusDeltaActions => 
                plusDeltaActions.action == 'resonator destroyed' && plusDeltaActions.comment == 'success'
            )
            const resoDeployed = value.filter(plusDeltaActions =>
                plusDeltaActions.action == 'resonator deployed' && plusDeltaActions.comment == 'success'
            )
            const modsDeployed = value.filter(plusDeltaActions =>
                plusDeltaActions.action == 'mod deployed' && plusDeltaActions.comment == 'success'
            )
            const hackedFriendlyPortal = value.filter(plusDeltaActions =>
                plusDeltaActions.action == 'hacked friendly portal' && plusDeltaActions.comment == 'success'
            )
            const hackedEnemyPortal = value.filter(plusDeltaActions =>
                plusDeltaActions.action == 'hacked enemy portal' && plusDeltaActions.comment == 'success'
            )
            const hackedNeutralPortal = value.filter(plusDeltaActions =>
                plusDeltaActions.action == 'hacked neutral portal' && plusDeltaActions.comment == 'success'
            )
            const createdLink = value.filter(plusSDeltaAction => 
                plusSDeltaAction.action == 'created link'
            )
            
            const formatted: DataType[] = [
                {
                    waypoints: value.map(item => ({
                        coordinates: [item.longitude, item.latitude],
                        timestamp: item.event_number,
                        action: item.action,
                        time: item.event_time
                    })),
                },
            ];
            const lastTimestamp = formatted[0].waypoints[formatted[0].waypoints.length - 1].timestamp;
            setTotalDuration(lastTimestamp + 1);
            setTripData(formatted);
        });
    }, []);

    function hasTripPassed(lon: number, lat: number, waypoints: DataType[], currentTime: number): boolean {
        const passedPoints = waypoints[0].waypoints.filter(wp => wp.timestamp <= currentTime);
        const threshold = 0.0002; 

        return passedPoints.some(wp => {
            const [wpLon, wpLat] = wp.coordinates;
            return Math.abs(wpLon - lon) < threshold && Math.abs(wpLat - lat) < threshold;
        });
    }


    const waypointLayer = useMemo(() => {
        if (!tripData.length) return null;
        const pulse = (Math.sin(pulseTime * 2) + 1) / 2;

        // Only include beacons where the trip has passed
        const visibleBeacons = battleBeacons.filter(b => {
            const [lat, lon] = b;
            return hasTripPassed(lon, lat, tripData, currentTime);
        });

        if (visibleBeacons.length === 0) return null;

        return new ScatterplotLayer({
            id: 'waypoint-layer',
            data: visibleBeacons.map((b) => ({
                position: [b[1], b[0]], // [lng, lat]
            })),
            getPosition: (d) => d.position,
            getFillColor: [66, 135, 245, 200],
            getRadius: () => 2 + pulse * 12,
            radiusUnits: 'pixels',
            opacity: 0.9,
            pickable: true,
            updateTriggers: { getRadius: pulseTime },
        });
    }, [battleBeacons, pulseTime, tripData, currentTime]);

    const tripsLayer = useMemo(() =>
            new TripsLayer<DataType>({
                id: 'TripsLayer',
                data: tripData,
                getPath: (d) => d.waypoints.map((p) => p.coordinates),
                getTimestamps: (d) => d.waypoints.map((p) => p.timestamp),
                getColor: [253, 128, 93],
                currentTime: currentTime,
                trailLength: totalDuration,
                capRounded: true,
                jointRounded: true,
                widthMinPixels: 8,
            }),
        [tripData, currentTime, totalDuration]
    );

    const deckProps = useMemo(() => {
        const layers: Layer[] = [tripsLayer];
        if (waypointLayer) layers.push(waypointLayer);
        return { layers };
    }, [tripsLayer, waypointLayer]);

    return (
        (currentInfo && (
            <MapContainer defaultCenter={[-8.710340838, 115.17494434764978]}
                mapChildren={
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '2rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '1rem 1.5rem',
                            borderRadius: '1rem',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                            fontFamily: 'sans-serif',
                        }}>
                        <div style={{ fontWeight: 600 }}>Action: {currentInfo.action}</div>
                        <div>Time: {currentInfo.timestamp}</div>
                    </div>

                }
                mapOverlay={<DeckGLOverlay {...deckProps} />}
            />
        ))
    );
}