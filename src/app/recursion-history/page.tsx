
import { getLevelingUpTimeline } from "../libs/db"
import React from "react";
import { RecursionTimeline } from "../components/timeline/recursion-timeline";

export default async function Page() {

    const levelUpTimeLine = await getLevelingUpTimeline();
    
    return (
        <RecursionTimeline events={levelUpTimeLine}/>
    )
}