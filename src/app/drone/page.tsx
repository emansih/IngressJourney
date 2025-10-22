import { FetchDrone } from "../components/map/fetch-drone";
import { MapContainer } from "../components/map/map-container";
import { getDroneHacks } from "../libs/db";


export default async function Page() {
    const droneHacks = await getDroneHacks()
    const portalList: Portal[] = droneHacks.map(value => ({
        lat: Number(value.latitude),
        lon: Number(value.longitude),
        first_seen_time: value.event_time
    }));


    return (
        <>
            <MapContainer defaultCenter={[-37.81348295114878, 144.9626692663649]}  
                mapChildren={<FetchDrone portalList={portalList}/>} 
            />
        </>
    )
}