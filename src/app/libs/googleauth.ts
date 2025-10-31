'use server'

import { unstable_cache } from "next/cache";
import { LightshipAuthResponse } from "../model/lightshipauthresponse";

const LOGIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBp_fkYcJSbI3qyk5mPa6K53ZIi6UEjWdA"

export async function login() {
    const email = process.env.EMAIL
    const password = process.env.PASSWORD
    if(!email || !password){
        return ""
    }
    
    const headers = {
        "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,la;q=0.6",
        "content-type": "application/json",
        "referer": "https://lightship.dev/"
    };

    const body = {
        "returnSecureToken": true,
        "email": email,
        "password": password,
        "clientType": "CLIENT_TYPE_WEB"
    }

    try {
        const lightshipAuthCache = unstable_cache(async () => {
            const request = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            })

            const requestBody = await request.json() as LightshipAuthResponse
            return requestBody.idToken
        },
        ["lightship_token"],
        {
            tags: ['lightship_token_tags'],
            revalidate: 3600,
        })
        const cached = await lightshipAuthCache()
        return cached
    } catch (error) {
        console.error('Error trying to login to Lightship:', error);
        return ""
    }
}