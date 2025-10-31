

import { formatDate } from '@/app/util/dateTimeUtil';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import Image from 'next/image';
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import type { Marker } from '@googlemaps/markerclusterer';
import { Pois } from '@/app/model/lightshipresponse';

interface Props {
    entity: Portal;
    isOpen: boolean;
    onToggle: () => void;
    heading: string;
    poiAtrributes: Pois | undefined,
    setMarkerRef: (marker: Marker | null, key: number) => void;
}

export const CustomAdvancedMarker: FunctionComponent<Props> = ({
    entity,
    isOpen,
    onToggle,
    heading,
    poiAtrributes,
    setMarkerRef
}) => {
    const [hovered, setHovered] = useState(false);
    const position = useMemo(() => ({
        lat: entity.lat,
        lng: entity.lon
    }), [entity.lat, entity.lon]);
    const ref = useCallback(
        (marker: google.maps.marker.AdvancedMarkerElement) =>
            setMarkerRef(marker, entity.id ?? 0),
        [setMarkerRef, entity.id]
    );

    return (
        <>
            <AdvancedMarker
                position={position}
                ref={ref} 
                onClick={onToggle}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                zIndex={hovered ? 2 : 1}
            >
                <Image
                    src="/marker-blue.png" 
                    alt="Custom Marker"
                    width={25}
                    height={41}                
                />
            </AdvancedMarker>
            {isOpen && (
                <InfoWindow position={position} onCloseClick={onToggle}>
                    <div className="popup">
                        {
                            poiAtrributes && poiAtrributes.images && (
                                <Image
                                    src={poiAtrributes.images[0].url ?? ""}
                                    alt="POI Image"
                                    width={200}
                                    height={250}
                                />
                            )
                        }
                        <div className="heading">{heading}</div>
                        <div>{formatDate(entity.first_seen_time)}</div>
                        <div>{entity.lat}, {entity.lon}</div>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};