import { getDroneInBoundingBox } from "@/app/libs/db";


export async function POST(request: Request) {
    const body = await request.json();
    const { topLeftLat, topLeftLon, bottomRightLat, bottomRightLon } = body;
    const droneHacks = await getDroneInBoundingBox(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon)
    return new Response(JSON.stringify(droneHacks), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}
