import { getDroneInBoundingBox } from "@/app/libs/db";


export async function POST(request: Request) {
    const body = await request.json();
    const { topLeftLat, topLeftLon, bottomRightLat, bottomRightLon } = body;
    const droneHacks = await getDroneInBoundingBox(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon)
    const portals: Portal[] = []
    droneHacks.map((value) => {
        portals.push({
            lat: Number(value.latitude),
            lon: Number(value.longitude),
            first_seen_time: value.event_time
        })
    })
    return new Response(JSON.stringify(portals), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}
