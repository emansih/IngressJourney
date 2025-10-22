

import { formatDate } from '@/app/util/dateTimeUtil';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import Image from 'next/image';
import React, { FunctionComponent, useMemo, useState } from 'react';

interface Props {
    entity: Portal;
    isOpen: boolean;
    onToggle: () => void;
    heading: string
}

export const CustomAdvancedMarker: FunctionComponent<Props> = ({
    entity,
    isOpen,
    onToggle,
    heading
}) => {
    const [hovered, setHovered] = useState(false);
    const position = useMemo(() => ({
        lat: entity.lat,
        lng: entity.lon
    }), [entity.lat, entity.lon]);

    return (
        <>
            <AdvancedMarker
                position={position}
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
                        <div className="heading">{heading}</div>
                        <div>{formatDate(entity.first_seen_time)}</div>
                        <div>{entity.lat}, {entity.lon}</div>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};