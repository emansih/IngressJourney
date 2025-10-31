'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomAdvancedMarker } from "./custom-marker";
import { useMap } from "@vis.gl/react-google-maps";
import { getDroneHacks } from "@/app/libs/db";
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { Pois } from "@/app/model/lightshipresponse";
import { login } from "@/app/libs/googleauth";
import { getPoisInRadius } from "@/app/libs/lightship";


export function FetchDroneHacks() {

    const map = useMap();
    const [entities, setEntities] = useState<Portal[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const [lightshipApiToken, setLightshipApiToken] = useState('')
    const [pois, setPois] = useState<Pois[]>([]); 
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const DEBOUNCE_TIME = 2000

    useEffect(() => {
        login().then(value => {
            setLightshipApiToken(value)
        })
    }, [])

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

        const fetchData = async (bounds: google.maps.LatLngBounds) => {
            const center = bounds.getCenter().toJSON();
            if(lightshipApiToken){
                getPoisInRadius(lightshipApiToken, center.lat, center.lng).then(value => {
                    setPois(value.pois)
                })
            }
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
        getDroneHacks(null, null, null, null).then(setEntities);

        return () => {
            google.maps.event.removeListener(listener);
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };

    }, [map, lightshipApiToken]);

    const poiLookup = useMemo(() => {
        const lookup = new Map<string, Pois>();
        pois.forEach(p => {
            const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
            lookup.set(key, p);
        });
        return lookup;
    }, [pois]);

    const getTitleForEntity = useCallback((lat: number, lon: number): string => {
        const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const poi = poiLookup.get(key);
        return poi?.title || 'Drone Visited';
    }, [poiLookup]);

    const poiAttributes = useCallback((lat: number, lon: number): Pois | undefined => {
        const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
        const poi = poiLookup.get(key);
        return poi
    }, [poiLookup]);

    return (
        <>
            {entities.map((portal, idx) => {

                return (
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
                        heading={getTitleForEntity(portal.lat, portal.lon)}
                        poiAtrributes={poiAttributes(portal.lat, portal.lon)}
                    />
                );
            })}
        </>
    );

}