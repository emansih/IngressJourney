
import { getApexEvents, getLevelingUpTimeline } from "../libs/db"
import React from "react";
import { RecursionTimeline } from "../components/timeline/recursion-timeline";

export default async function Page() {

    const levelUpTimeLine = await getLevelingUpTimeline();
    const apexEvents = await getApexEvents();

    return (
        <RecursionTimeline events={levelUpTimeLine} apexEvents={apexEvents}/>
    )
}