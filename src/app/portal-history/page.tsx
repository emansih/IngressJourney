"use client"

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { FetchDataOnBoundsChange } from '../components/map/fetch-data-on-bounds-change';


export default function Page() {

    const mapKey = process.env.NEXT_PUBLIC_MAP_KEY ?? ''
    const mapId = process.env.NEXT_PUBLIC_MAP_ID ?? ''

    return (
        <APIProvider apiKey={mapKey}>
            <Map style={{ width: '100vw', height: '100vh' }}
                defaultZoom={15}
                defaultCenter={{ lat: -37.840935, lng: 144.946457 }}
                mapId={mapId}
                disableDefaultUI={true}>
                <FetchDataOnBoundsChange />
            </Map>
        </APIProvider>
    )
}