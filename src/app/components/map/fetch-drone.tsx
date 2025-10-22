'use client'

import { useState } from "react";
import { CustomAdvancedMarker } from "./custom-marker";


export function FetchDrone({ portalList }: { portalList: Portal[] }){

    const [openId, setOpenId] = useState<number | null>(null);

    return (
        <>
            {portalList.map((portal, idx) => (
                <CustomAdvancedMarker
                    key={idx}
                    entity={{
                        lat: portal.lat,
                        lon: portal.lon,
                        first_seen_time: portal.first_seen_time
                    }}
                    isOpen={openId === idx}
                    onToggle={() => setOpenId(openId === idx ? null : idx)}
                    heading={'Drone Visited'}
                />
            ))}
           
        </>
    )
}