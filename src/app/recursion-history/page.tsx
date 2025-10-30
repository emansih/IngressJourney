
import { getApexEvents, getLevelingUpTimeline } from "../libs/db"
import React from "react";
import { RecursionTimeline } from "../components/timeline/recursion-timeline";
import { unstable_cache } from "next/cache";

export default async function Page() {

    const CACHE_TIME = 3600

    const levelUpTimelineCache = unstable_cache(
        async () => {
            return getLevelingUpTimeline()
        },
        ["level_up_timeline"],
        { tags: ["level_up_timeline_tag"], revalidate: CACHE_TIME }
    )

    const apexEventsCache = unstable_cache(
        async () => {
            return getApexEvents()
        },
        ["apex_events"],
        { tags: ["apex_events_tag"], revalidate: CACHE_TIME }
    )



    const [levelUpTimeLine, apexEvents] = await Promise.all([levelUpTimelineCache(), apexEventsCache()])

    return (
        <RecursionTimeline events={levelUpTimeLine} apexEvents={apexEvents} />
    )
}