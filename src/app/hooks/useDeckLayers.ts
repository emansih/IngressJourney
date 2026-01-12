import { useEffect, useMemo, useState } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { TripDataType } from '../model/tripdata';
import type { Layer, PickingInfo } from '@deck.gl/core';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { TripsLayer } from 'deck.gl';

export function useDeckLayers(tripData: TripDataType[], battleBeacons: LatLng[], pulseTime: number, currentTime: number, totalDuration: number, onWaypointClick: (pickingInfo: PickingInfo) => void) {
    
    const [snappedPath, setSnappedPath] = useState<[number, number][] | null>(null);

    useEffect(() => {
        if (!tripData.length || !tripData[0].waypoints.length) return;
        const coordsList = tripData[0].waypoints.map(w => w.coordinates);
        setSnappedPath(coordsList);
    }, [tripData]);

    const waypointLayer = useMemo(() => {
        if (!tripData.length) return null;
        const pulse = (Math.sin(pulseTime * 2) + 1) / 2;

        const visibleBeacons = battleBeacons.filter(b => {
            const [lat, lon] = b;
            return tripData[0].waypoints.some(wp =>
                wp.timestamp <= currentTime &&
                Math.abs(wp.coordinates[0] - lon) < 0.0002 &&
                Math.abs(wp.coordinates[1] - lat) < 0.0002
            );
        });

        if (!visibleBeacons.length) return null;

        return new ScatterplotLayer({
            id: 'waypoint-layer',
            data: visibleBeacons.map(([lat, lon]) => ({ position: [lon, lat] })),
            getPosition: d => d.position,
            getFillColor: [66, 135, 245, 200],
            getRadius: () => 2 + pulse * 12,
            radiusUnits: 'pixels',
            opacity: 0.9,
            pickable: true,
            onClick: (clickData) => {
                if (onWaypointClick) {
                    onWaypointClick(clickData)
                };
            },
            updateTriggers: { getRadius: pulseTime },
        });
    }, [battleBeacons, pulseTime, tripData, currentTime]);

    const sceneGraphLayer = useMemo(() => {
        if (!snappedPath || snappedPath.length < 2) return null;

        const speed = snappedPath.length / totalDuration;
        const idx = Math.min(
            Math.floor(currentTime * speed),
            snappedPath.length - 2
        );

        const position = snappedPath[idx];
        const next = snappedPath[idx + 1];

        const heading = bearing(position, next);

        return new ScenegraphLayer({
            id: "tripLayer",
            data: [{ position, heading }],
            scenegraph: "/Adventurer.glb",
            getPosition: d => d.position,
            getOrientation: d => [180, d.heading, 270],
            sizeScale: 100,
            _lighting: 'pbr',
            pickable: true
        });
    }, [snappedPath, currentTime, totalDuration]);

    const tripsLayer = useMemo(() =>
        new TripsLayer({
            id: 'TripsLayer',
            data: tripData,
            getPath: d => d.waypoints.map((p: { coordinates: LatLng; }) => p.coordinates),
            getTimestamps: d => d.waypoints.map((p: { timestamp: number; }) => p.timestamp),
            getColor: [255, 0, 0],
            currentTime,
            capRounded: true,
            jointRounded: true,
            opacity: 1,
            widthMinPixels: 2,
            trailLength: totalDuration
        }),
        [tripData, currentTime, totalDuration]);


    function bearing(a: [number, number], b: [number, number]) {
        const toRad = (d: number) => (d * Math.PI) / 180;
        const toDeg = (r: number) => (r * 180) / Math.PI;

        const [lng1, lat1] = a.map(toRad);
        const [lng2, lat2] = b.map(toRad);

        const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

        return (toDeg(Math.atan2(y, x)) + 360) % 360;
    }


    return useMemo(() => {
        const layers: Layer[] = [];

        if (tripsLayer) layers.push(tripsLayer);
        if (waypointLayer) layers.push(waypointLayer);
        if (sceneGraphLayer) layers.push(sceneGraphLayer);

        return layers;
    }, [tripsLayer, waypointLayer, sceneGraphLayer]);
}
