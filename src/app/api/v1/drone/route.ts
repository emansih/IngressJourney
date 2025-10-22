import { getDroneInBoundingBox } from "@/app/libs/db";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://intel.ingress.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

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
        headers: { 
            'Content-Type': 'application/json',
            ...CORS_HEADERS
         }
    });
}
