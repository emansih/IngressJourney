'use client'

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { getGeoJson } from '../libs/geodb';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { PolygonLayer } from 'deck.gl';
import type { PickingInfo } from '@deck.gl/core';

// Define the polygon feature type
interface LGAPolygonFeature {
    type: 'Feature';
    coordinates: number[][][][]; // MultiPolygon
    properties: {
        objectid: number;
        lga_name?: string;
        [key: string]: any;
    };
}

interface LGAPolygonOverlayProps {
    polygons: LGAPolygonFeature[];
    onHover?: (info: PickingInfo) => void;
}

function LGAPolygonOverlay({ polygons, onHover }: LGAPolygonOverlayProps) {
    const map = useMap();

    useEffect(() => {
        if (!map || polygons.length === 0) return;

        const overlay = new GoogleMapsOverlay({
            layers: [
                new PolygonLayer<LGAPolygonFeature>({
                    id: 'lga-polygons',
                    data: polygons,
                    pickable: true,
                    extruded: false,
                    getPolygon: d => d.coordinates[0][0], // unwrap MultiPolygon
                    getFillColor: [0, 140, 255, 80],
                    getLineColor: [0, 0, 0, 200],
                    lineWidthMinPixels: 1,
                    onHover: info => {
                        if (onHover) onHover(info);
                    },
                }),
            ],
        });

        overlay.setMap(map);

        return () => overlay.setMap(null);
    }, [map, polygons, onHover]);

    return null;
}

export default function MuTracker() {
    const apiKey = process.env.NEXT_PUBLIC_MAP_KEY ?? '';
    const mapId = process.env.NEXT_PUBLIC_MAP_ID ?? '';

    const [polygons, setPolygons] = useState<LGAPolygonFeature[]>([]);
    const [tooltip, setTooltip] = useState<PickingInfo | null>(null);

    useEffect(() => {
        getGeoJson().then(rows => {
            const polys: LGAPolygonFeature[] = rows.map(r => ({
                ...JSON.parse(r.geojson ?? '{}'),
                properties: {
                    objectid: r.objectid,
                    lga_name: r.lga_name ?? '',
                },
            }));
            setPolygons(polys);
        });
    }, []);

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={{ lat: -37.840935, lng: 144.946457 }}
                style={{ width: '100vw', height: '90vh' }}
                defaultZoom={10}
                mapId={mapId}
            />
            <LGAPolygonOverlay polygons={polygons} onHover={setTooltip} />
            {tooltip?.object && (
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        background: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(10px, 10px)',
                    }}
                >
                    <div><b>{tooltip.object.properties.lga_name}</b></div>
                </div>
            )}
        </APIProvider>
    );
}
