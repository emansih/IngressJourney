"use client"

import { ApexEvent, TimelineBlock, TimelineLevel } from "@/app/model/recursion";
import { formatDate } from "@/app/util/dateTimeUtil";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { JSX } from "react";

export function RecursionTimeline({ events, apexEvents }: { events: TimelineBlock[], apexEvents: ApexEvent[] }){


    let recursionCounter = 0;

    function getApexBetween(start: string, end: string) {
        return apexEvents.filter(
            (a) =>
                new Date(a.event_time) > new Date(start) &&
                new Date(a.event_time) <= new Date(end)
        )
    }

    return (
        <Timeline>
            {events.map((block, idx) => {
                const items: JSX.Element[] = []

                if (block.recursion_id !== null) {
                    recursionCounter += 1
                    items.push(
                        <TimelineItem key={`rec-${block.recursion_id}`} position="right">
                            <TimelineOppositeContent>
                                {formatDate(new Date(block.recursion_time ?? ""))}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>{`Recursion ${recursionCounter}`}</TimelineContent>
                        </TimelineItem>
                    )
                }

                // Loop through levels, inserting apex events between them
                for (let i = 0; i < block.levels.length; i++) {
                    const lv = block.levels[i]
                    const nextLv = block.levels[i + 1]
                    const match = lv.comment?.match(/nextLevelToken:\s*(\d+)/)
                    const levelNumber = match ? Number(match[1]) : i + 1

                    // Add the level itself
                    items.push(
                        <TimelineItem key={`lv-${block.recursion_id}-${i}`} position="left">
                            <TimelineOppositeContent>
                                {formatDate(new Date(lv.time ?? ""))}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>{`Level ${levelNumber}`}</TimelineContent>
                        </TimelineItem>
                    )

                    // Add apex uses between this level and next
                    if (nextLv) {
                        const apexBetween = getApexBetween(lv.time, nextLv.time)
                        apexBetween.forEach((apex, apexIdx) => {
                            items.push(
                                <TimelineItem
                                    key={`apx-${block.recursion_id}-${i}-${apexIdx}`}
                                    position="left"
                                >
                                    <TimelineOppositeContent>
                                        {formatDate(new Date(apex.event_time))}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot color="error" />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ color: "red" }}>
                                        Used APEX
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        })
                    }
                }

                return items
            })}
        </Timeline>
    )
}