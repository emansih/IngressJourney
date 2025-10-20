import { useMemo } from 'react';
import { TripsLayer } from '@deck.gl/geo-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { TripDataType } from '../model/tripdata';
import type { Layer } from '@deck.gl/core';

export function useDeckLayers(tripData: TripDataType[], battleBeacons: LatLng[], pulseTime: number, currentTime: number, totalDuration: number) {
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
            updateTriggers: { getRadius: pulseTime },
        });
    }, [battleBeacons, pulseTime, tripData, currentTime]);

    const tripsLayer = useMemo(() =>
        new TripsLayer({
            id: 'TripsLayer',
            data: tripData,
            getPath: d => d.waypoints.map((p: { coordinates: LatLng; })  => p.coordinates),
            getTimestamps: d => d.waypoints.map((p: { timestamp: number; }) => p.timestamp),
            getColor: [253, 128, 93],
            currentTime,
            trailLength: totalDuration,
            capRounded: true,
            jointRounded: true,
            widthMinPixels: 8,
        }),
        [tripData, currentTime, totalDuration]);

    return useMemo(() => {
        const layers: Layer[] = [tripsLayer];
        if (waypointLayer) layers.push(waypointLayer);
        return layers;
    }, [tripsLayer, waypointLayer]);
}
