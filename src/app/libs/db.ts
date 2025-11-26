"use server"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../model/generated/prisma/client"
import { TimelineBlock } from "../model/recursion"
import { drone_hack, drone_hack_bounding_box, maxed_xm_recharge, most_captured_portal, most_captured_portal_day, most_created_field_day, most_deployed_resonator_day, most_destroyed_resonator_day, most_link_created_day, most_mods_deployed_day } from "../model/generated/prisma/sql"


function getClient() {
    const connectionString = `${process.env.DATABASE_URL}`
    const pool = new PrismaPg({ connectionString })
    const prisma = new PrismaClient({ adapter: pool })
    return prisma
}

export async function insertGameLogsBatch(logs: GamelogNew[]) {
    const eventTimes = [];
    const actions = [];
    const comments = [];
    const lons = [];
    const lats = [];

    for (const log of logs) {
        const [lon, lat] = log.location.coordinates;
        eventTimes.push(log.eventTime);
        actions.push(log.action);
        comments.push(log.comment);
        lons.push(lon);
        lats.push(lat);
    }

    
    await getClient().$executeRaw`
        INSERT INTO "gamelog_new"("event_time", "action", "comment", "location")
        SELECT 
            unnest(${eventTimes}::timestamptz[]),
            unnest(${actions}::text[]),
            unnest(${comments}::text[]),
            ST_SetSRID(ST_MakePoint(
                unnest(${lons}::float8[]),
                unnest(${lats}::float8[])
            ), 4326)::geography
    `;
}

export async function getCapturedPortals(minLong: number, minLat: number, maxLong: number, maxLat: number): Promise<Portal[]> {
    const result: Portal[] = await getClient().$queryRaw`
        SELECT DISTINCT ON ("latitude", "longitude")
       "id" as id,
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
        id: r.id,
        lat: Number(r.lat),
        lon: Number(r.lon),
        first_seen_time: r.first_seen_time,
    }))
}



export async function getCapturedTimeRange(startDate: string, endDate: string): Promise<Portal[]> {
    const result: Portal[] = await getClient().$queryRaw`
       SELECT DISTINCT ON (gl."latitude", gl."longitude")
       "id" as id,
       "latitude" AS lat,
       "longitude" AS lon,
       "event_time" AS first_seen_time
FROM gamelog gl
WHERE gl."event_time" BETWEEN ${startDate} AND ${endDate} and "action" = 'captured portal'
ORDER BY gl."latitude", gl."longitude", gl."event_time" ASC;
    `
    return result.map(r => ({
        id: r.id,
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

export async function getLargestField(){
    const largestField = await getClient().mind_units_controlled.findFirst({
        orderBy: {
            value: 'desc',
        },
        select: {
            time: true,
            value: true,
        }
    })
    const largestFieldLocation = await getClient().gamelog.findFirst({
        where: {
            event_time: largestField?.time,
            action: 'created link'
        },
        select: {
            latitude: true,
            longitude: true
        }
    })
    const latitude = largestFieldLocation?.latitude
    const longitude = largestFieldLocation?.longitude
    const timestamp = largestField?.time
    const muCreated = largestField?.value
    return {
        latitude: latitude,
        longitude: longitude,
        timestamp: timestamp,
        muCreated: muCreated
    }
}

export async function xmRechargeRange(startDateTime: Date, endDateTime: Date){
    const xmRecharge = await getClient().xm_recharged.aggregate({
        _sum: {
            value: true,
        },
        where: {
            time: {
                gte: startDateTime,
                lte: endDateTime,
            },
        },
    });
    return Number(xmRecharge._sum.value)
}

export async function mostXmRechargedInADay(){
    const mostXmRecharged = await getClient().$queryRawTyped(maxed_xm_recharge())
    return mostXmRecharged
}

export async function topCapturedPortal(limit: number){
    const topCaptured = await getClient().$queryRawTyped(most_captured_portal(limit))
    return topCaptured
}

export async function mostCapturedPortalDay() {
    const topCapturedInADay = await getClient().$queryRawTyped(most_captured_portal_day())
    return topCapturedInADay
}

export async function mostCreatedFieldDay(){
    const maxFieldInADay = await getClient().$queryRawTyped(most_created_field_day())
    return maxFieldInADay
}

export async function mostDeployedResonatorDay(){
    const maxDeployedInADay = await getClient().$queryRawTyped(most_deployed_resonator_day())
    return maxDeployedInADay
}

export async function mostDestroyedResonatorDay(){
    const maxDestroyedInADay = await getClient().$queryRawTyped(most_destroyed_resonator_day())
    return maxDestroyedInADay
}

export async function mostCreatedLinkDay(){
    const maxLinkCreatedInADay = await getClient().$queryRawTyped(most_link_created_day())
    return maxLinkCreatedInADay
}

export async function mostModsDeployedDay(){
    const maxModsDeployedInADay = await getClient().$queryRawTyped(most_mods_deployed_day())
    return maxModsDeployedInADay
}

export async function getActionsRange(startDateTime: Date, endDateTime: Date){
    const getActions = await getClient().gamelog.findMany({
        where: {
            event_time: {
                gte: startDateTime, 
                lte: endDateTime, 
            },
            // there are some actions such as claiming bounties that result in lat, lon 0,0
            latitude: {
                not: 0
            },
            longitude: {
                not: 0
            }
        },
        orderBy: {
            event_time: 'asc',
        }
    })

    const serialized = getActions.map((a, i) => ({
        id: a.id,
        latitude: Number(a.latitude),
        longitude: Number(a.longitude),
        event_number: i + 1,
        event_time: a.event_time,
        action: a.action,
        comment: a.comment,
    }));
    return serialized
}


export async function getUserInteractionBattleBeacon(start: Date, end: Date){
    const battleBeaconInteraction = await getClient().beacon_battles.findMany({
        where: {
            time: {
                gte: start,
                lte: end,
            },
        },
    });
    const MAX_TIME_RANGE_TO_SEARCH = 210000; // 3.5 minutes
    const battleBeaconLocationArray: LatLng[] = [];
    await Promise.all(
        battleBeaconInteraction.map(async (value) => {
            const maxTime = new Date(value.time.getTime() + MAX_TIME_RANGE_TO_SEARCH);
            const closestLog = await getClient().gamelog.findFirst({
                where: {
                    event_time: {
                        gte: value.time,
                        lte: maxTime,
                    },
                    latitude: { not: 0 },
                    longitude: { not: 0 },
                },
                orderBy: {
                    event_time: 'asc',
                },
            });

            if (closestLog) {
                battleBeaconLocationArray.push([
                    Number(closestLog.latitude),
                    Number(closestLog.longitude),
                ]);
            }
        })
    );
    return battleBeaconLocationArray;
}

export async function getAnomaly(){
    const anomalyData = await getClient().anomaly.findMany({
        orderBy: {
            start_time: 'asc',
        }
    })
    const serialized = anomalyData.map((a) => ({
        id: a.id,
        latitude: Number(a.lat),
        longitude: Number(a.lon),
        timezone: a.timezone,
        series_name: a.series_name,
        site: a.site,
        start_time: a.start_time,
        end_time: a.end_time,
        cover_photo: a.cover_photo
    }));
    return serialized
}


export async function getMedals(){
    const medalData = await getClient().medals.findMany({
        orderBy: {
            attained_at: 'asc'
        }
    })
    return medalData
}

export async function getMedal(medalName: string) {
    const medalData = await getClient().medals.findMany({
        where: {
            medal_name: {
                contains: medalName,
                mode: 'insensitive',
            },
        },
        orderBy: {
            attained_at: 'asc'
        }
    })
    return medalData
}

export async function getDroneHacks(topLeftLat: number | null, topLeftLon: number | null, bottomRightLat: number | null, bottomRightLon: number | null) {
    const client = getClient();

    const query = topLeftLat && topLeftLon && bottomRightLat && bottomRightLon
        ? drone_hack_bounding_box(topLeftLon, topLeftLat, bottomRightLon, bottomRightLat)
        : drone_hack();

    const droneHackQuery = await client.$queryRawTyped(query);

    return droneHackQuery.map((value, index) => ({
        id: index,
        lat: Number(value.lat),
        lon: Number(value.lon),
        first_seen_time: value.first_seen_time
    }));
}


export async function getAttainedMedia(){
    const mediaItems = await getClient().gamelog.findMany({
        where: {
            comment: {
                contains: 'Dropped Media Item:',
                mode: 'insensitive',
            }
        },
        orderBy: {
            event_time: 'asc',
        },
        distinct: ['comment'],
    })
    return mediaItems
}

export async function getDistanceWalked(startDateTime: Date, endDateTime: Date){
    // Used kilometers_walked_new.tsv file 
    const distanceWalked = await getClient().distance_walked.aggregate({
        _sum: {
            value: true,
        },
        where: {
            time: {
                gte: startDateTime,
                lte: endDateTime,
            },
        },
    });
    return Number(distanceWalked._sum.value ?? 0)
}