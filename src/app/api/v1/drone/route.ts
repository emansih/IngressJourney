import { getDroneHacks } from "@/app/libs/db";

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
    const droneHacks = await getDroneHacks(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon)
    return new Response(JSON.stringify(droneHacks), {
        status: 201,
        headers: { 
            'Content-Type': 'application/json',
            ...CORS_HEADERS
         }
    });
}
