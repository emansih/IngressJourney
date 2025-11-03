'use client'

import { FetchDroneHacks } from "../components/map/fetch-drone-hacks";
import { MapContainer } from "../components/map/map-container";


export default function Page() {
   
    return (
        <>
            <MapContainer
                mapStyle={{ width: '100vw', height: '90vh' }}
                defaultCenter={[-37.81348295114878, 144.9626692663649]}  
                mapChildren={<FetchDroneHacks  />} 
            />
        </>
    )
}