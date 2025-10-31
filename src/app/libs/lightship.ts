"use server"

import { LightshipResponse } from "../model/lightshipresponse";

const LIGHTSHIP_URL = "https://lightship.dev/v1/vps"
const APPLICATION_ID = process.env.APPLICATION_ID


export async function getPoisInRadius(apiToken: string, lat: number, lon: number): Promise<LightshipResponse> {
    if (!APPLICATION_ID){
        return {
            pois: []
        }
    }
    const url = `${LIGHTSHIP_URL}/getPoisInRadius/${APPLICATION_ID}/${lat}/${lon}/500`;
    const headers = {
        'accept': '*/*',
        'authorization': apiToken,
        'content-type': 'application/json',
    };
    try {
        const request = await fetch(url, {
            method: 'GET',
            headers: headers
        })

        const requstBody = request.json()

        return requstBody as Promise<LightshipResponse>
    } catch(error){
        console.error('Error trying to get Lightship POI(s):', error);
        return {
            pois: []
        }
    }
}
