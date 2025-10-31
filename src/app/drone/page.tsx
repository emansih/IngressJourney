'use client'

import { useEffect, useState } from "react";
import { FetchDroneHacks } from "../components/map/fetch-drone-hacks";
import { MapContainer } from "../components/map/map-container";
import { login } from "../libs/googleauth";
import { getPoisInRadius } from "../libs/lightship";
import { Pois } from "../model/lightshipresponse";


export default function Page() {
   
    return (
        <>
            <MapContainer defaultCenter={[-37.81348295114878, 144.9626692663649]}  
                mapChildren={<FetchDroneHacks  />} 
            />
        </>
    )
}