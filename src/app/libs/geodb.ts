"use server"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../prisma/model/generated/geodb/prisma/client"
import { geojson } from "../prisma/model/generated/geodb/prisma/sql"


function getClient() {
    const connectionString = `${process.env.GEODB_URL}`
    const pool = new PrismaPg({ connectionString })
    const prisma = new PrismaClient({ adapter: pool })
    return prisma
}


export async function getGeoJson(){
    const query = await getClient().$queryRawTyped(geojson())
    return query
}