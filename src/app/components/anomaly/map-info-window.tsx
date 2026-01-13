import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { PickingInfo } from 'deck.gl';

type Props = {
    open: boolean;
    data?: PickingInfo;
};

export function MapInfoWindow({ open, data }: Props) {
    const map = useMap();
    const ref = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        if (!open || !data || !map) return;

        if (!ref.current) {
            ref.current = new google.maps.InfoWindow();
        }
        const lat = data.coordinate?.[1]
        const lng = data.coordinate?.[0]
        ref.current.setOptions({
            maxWidth: 300
        })
        if (lat && lng) {
            const reducedLat = lat.toFixed(6)
            const reducedLng = lng.toFixed(6)
            ref.current.setContent(`
                <div style="font-weight: 600; margin-bottom: 4px;">
                    Battle Beacon Battle
                </div>
                <img src="/Battle_Beacon_Rare.webp" />
                <div>
                    Interacted with battle beacon around the vicinity of ${reducedLat}, ${reducedLng}
                </div>
            `);
            ref.current.setPosition({
                lat: data.coordinate![1],
                lng: data.coordinate![0],
            });

            ref.current.open(map);
        }

        return () => {
            ref.current?.close();
        };
    }, [open, data, map]);

    return null;
}
