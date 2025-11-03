"use client"

import { FetchDataOnBoundsChange } from '../components/map/fetch-data-on-bounds-change';
import { MapContainer } from '../components/map/map-container';


export default function Page() {

    return (
        <MapContainer 
            mapStyle={{ width: '100vw', height: '90vh' }}    
            defaultCenter={[-37.840935, 144.946457]} 
            mapChildren={<FetchDataOnBoundsChange />} 
        />
    )
}