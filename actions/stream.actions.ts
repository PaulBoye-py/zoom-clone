"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser()

    if(!user) throw new Error('User is not logged in')
    if(!apiKey) throw new Error('API key is required')
    if(!apiSecret) throw new Error('API secret is required')

    const client = new StreamClient(apiKey, apiSecret)

    // expiration time for token - 1 hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    // get the time the token was issued
    const issued = Math.floor(Date.now() / 1000) - 60;

    const token = client.createToken(user.id, exp, issued);

    return token;
}