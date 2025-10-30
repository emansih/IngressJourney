'use client'

import { FetchDroneOnBoundsChange } from "../components/map/fetch-drone-on-bounds-change";
import { MapContainer } from "../components/map/map-container";


export default function Page() {
   
    return (
        <>
            <MapContainer defaultCenter={[-37.81348295114878, 144.9626692663649]}  
                mapChildren={<FetchDroneOnBoundsChange />} 
            />
        </>
    )
}