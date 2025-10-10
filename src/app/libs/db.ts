"use server"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../model/generated/prisma/client"
import { TimelineBlock } from "../model/recursion"


function getClient() {
    const connectionString = `${process.env.DATABASE_URL}`
    const pool = new PrismaPg({ connectionString })
    const prisma = new PrismaClient({ adapter: pool })
    return prisma
}


export async function getCapturedPortals(minLong: number, minLat: number, maxLong: number, maxLat: number): Promise<Portal[]> {
    const result: Portal[] = await getClient().$queryRaw`
        SELECT DISTINCT ON ("latitude", "longitude")
       "latitude" AS lat,
       "longitude" AS lon,
       "event_time" AS first_seen_time
FROM gamelog
WHERE "action" = 'captured portal'
  AND "geometry" && ST_MakeEnvelope(
        ${minLat},
        ${minLong},
        ${maxLat},
        ${maxLong},
        4326
    )
ORDER BY "latitude", "longitude", "event_time" ASC;
    `
    return result.map(r => ({
        lat: Number(r.lat),
        lon: Number(r.lon),
        first_seen_time: r.first_seen_time,
    }))
}



export async function getCapturedTimeRange(startDate: string, endDate: string): Promise<Portal[]> {
    const result: Portal[] = await getClient().$queryRaw`
       SELECT DISTINCT ON (gl."latitude", gl."longitude")
       "latitude" AS lat,
       "longitude" AS lon,
       "event_time" AS first_seen_time
FROM gamelog gl
WHERE gl."event_time" BETWEEN ${startDate} AND ${endDate} and "action" = 'captured portal'
ORDER BY gl."latitude", gl."longitude", gl."event_time" ASC;
    `
    return result.map(r => ({
        lat: Number(r.lat),
        lon: Number(r.lon),
        first_seen_time: r.first_seen_time,
    }))
}




export async function getLevelingUpTimeline() {
    const result: {
        recursion_id: bigint | null;
        recursion_time: Date | null;
        level_time: Date | null;
        level_comment: string | null;
        event_time: Date;
    }[] = await getClient().$queryRaw`
    SELECT
  NULL AS recursion_id,
  NULL AS recursion_time,
  l."event_time" AS level_time,
  l."comment" AS level_comment,
  l."event_time" AS event_time
FROM gamelog l
WHERE l."action" = 'level up'
  AND l."event_time" < (
    SELECT MIN("event_time")
    FROM gamelog
    WHERE "action" = 'recursion request confirmed'
  )

UNION ALL

-- Recursions and their levels
SELECT
  r.id AS recursion_id,
  r."event_time" AS recursion_time,
  l."event_time" AS level_time,
  l."comment" AS level_comment,
  COALESCE(l."event_time", r."event_time") AS event_time
FROM gamelog r
LEFT JOIN gamelog l
  ON l."action" = 'level up'
  AND l."event_time" >= r."event_time"
  AND l."event_time" < (
    SELECT MIN("event_time")
    FROM gamelog r2
    WHERE r2."action" = 'recursion request confirmed'
      AND r2."event_time" > r."event_time"
  )
WHERE r."action" = 'recursion request confirmed'

ORDER BY event_time;
  `;

    return normalizeTimeline(result)
}


function normalizeTimeline(
    rows: {
        recursion_id: bigint | null;
        recursion_time: Date | null;
        level_time: Date | null;
        level_comment: string | null;
    }[]
): TimelineBlock[] {
    const map = new Map<number | null, TimelineBlock>();

    for (const row of rows) {
        const key = row.recursion_id !== null ? Number(row.recursion_id) : null;

        if (!map.has(key)) {
            map.set(key, {
                recursion_id: key,
                recursion_time: row.recursion_time ? row.recursion_time.toISOString() : null,
                levels: [],
            });
        }

        if (row.level_time) {
            map.get(key)!.levels.push({
                time: row.level_time.toISOString(),
                comment: row.level_comment,
            });
        }
    }

    // Pre-recursion levels first
    const preRecursion = map.get(null);
    // Recursions sorted by time
    const recursions = Array.from(map.entries())
        .filter(([k]) => k !== null)
        .sort((a, b) => {
            const t1 = a[1].recursion_time ? new Date(a[1].recursion_time).getTime() : 0;
            const t2 = b[1].recursion_time ? new Date(b[1].recursion_time).getTime() : 0;
            return t1 - t2;
        })
        .map(([_, block]) => block);

    const timeline: TimelineBlock[] = [];
    if (preRecursion) timeline.push(preRecursion);
    timeline.push(...recursions);

    return timeline;
}

export async function getApexEvents() {
    return getClient().gamelog.findMany({
        where: {
            action: "used apex",
        },
        select: {
            event_time: true,
        },
        orderBy: {
            event_time: "asc",
        },
    })
}