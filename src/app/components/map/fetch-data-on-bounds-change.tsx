"use client"

import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { CustomAdvancedMarker } from "./custom-marker";
import { getCapturedPortals } from "@/app/libs/db";

export function FetchDataOnBoundsChange() {
    const map = useMap();
    const [entities, setEntities] = useState<Portal[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const DEBOUNCE_TIME = 2000

    useEffect(() => {
        if (!map) return;

        const fetchData = async (bounds: google.maps.LatLngBounds) => {
            const ne = bounds.getNorthEast().toJSON();
            const sw = bounds.getSouthWest().toJSON();
            getCapturedPortals(sw.lat, sw.lng, ne.lat, ne.lng).then(value => {
                setEntities(value)
            })
        };

        // Run when map moves/zooms
        const listener = map.addListener("bounds_changed", () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                const bounds = map.getBounds();
                if (bounds) {
                    fetchData(bounds);
                }
            }, DEBOUNCE_TIME); // wait for a specific time to load data after user stops moving
        });

        return () => {
            google.maps.event.removeListener(listener);
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };

    }, [map]);

    return (
        <>
            {entities.map((entity, idx) => (
                <CustomAdvancedMarker
                    key={idx}
                    entity={entity}
                    isOpen={openId === idx}
                    onToggle={() => setOpenId(openId === idx ? null : idx)}
                />
            ))}
        </>
    );
}
