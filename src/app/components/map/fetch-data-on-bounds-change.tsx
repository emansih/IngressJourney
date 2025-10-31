"use client"

import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomAdvancedMarker } from "./custom-marker";
import { getCapturedPortals } from "@/app/libs/db";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { login } from "@/app/libs/googleauth";
import { getPoisInRadius } from "@/app/libs/lightship";
import { Pois } from "@/app/model/lightshipresponse";

export function FetchDataOnBoundsChange() {
    const map = useMap();
    const [entities, setEntities] = useState<Portal[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const [lightshipApiToken, setLightshipApiToken] = useState('')
    const [pois, setPois] = useState<Pois[]>([]); 

    const DEBOUNCE_TIME = 2000

    useEffect(() => {
        login().then(value => {
            setLightshipApiToken(value)
        })
    }, [])

    useEffect(() => {
        if (!map) return;

        const fetchData = async (bounds: google.maps.LatLngBounds) => {
            const ne = bounds.getNorthEast().toJSON();
            const sw = bounds.getSouthWest().toJSON();
            const center = bounds.getCenter().toJSON();
            if (lightshipApiToken) {
                getPoisInRadius(lightshipApiToken, center.lat, center.lng).then(value => {
                    setPois(value.pois)
                })
            }
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

    }, [map, lightshipApiToken]);


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

    const poiLookup = useMemo(() => {
        const lookup = new Map<string, Pois>();
        pois.forEach(p => {
            const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
            lookup.set(key, p);
        });
        return lookup;
    }, [pois]);

    const poiAttributes = useCallback((lat: number, lon: number): Pois | undefined => {
        const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const poi = poiLookup.get(key);
        return poi
    }, [poiLookup]);

    const getTitleForEntity = useCallback((lat: number, lon: number): string => {
        const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const poi = poiLookup.get(key);
        const title = poi?.title ?? ''
        return `Captured ${title}`;
    }, [poiLookup]);

    return (
        <>
            {entities.map((entity, idx) => (
                <CustomAdvancedMarker
                    key={idx}
                    entity={entity}
                    isOpen={openId === idx}
                    setMarkerRef={setMarkerRef}
                    onToggle={() => setOpenId(openId === idx ? null : idx)}
                    heading={getTitleForEntity(entity.lat, entity.lon)}
                    poiAtrributes={poiAttributes(entity.lat, entity.lon)}
                />
            ))}
        </>
    );
}
