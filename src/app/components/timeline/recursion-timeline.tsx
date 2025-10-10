"use client"

import { TimelineBlock, TimelineLevel } from "@/app/model/recursion";
import { formatDate } from "@/app/util/dateTimeUtil";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { JSX } from "react";

export function RecursionTimeline({ events }: { events: TimelineBlock[] }){

    
    let recursionCounter = 0;

    return (
        <Timeline>
            {events.map((block, idx) => {
                const items: JSX.Element[] = [];

                // Render recursion dot on the right
                if (block.recursion_id !== null) {
                    recursionCounter += 1;
                    items.push(
                        <TimelineItem key={`rec-${block.recursion_id}`} position="right">
                            <TimelineOppositeContent>
                                {formatDate(new Date(block.recursion_time ?? "")) ?? ""}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>{`Recursion ${recursionCounter}`}</TimelineContent>
                        </TimelineItem>
                    );
                }
                // Render all levels on the left
                block.levels.forEach((lv: TimelineLevel, lvIdx) => {
                    const match = lv.comment?.match(/nextLevelToken:\s*(\d+)/);
                    const levelNumber = match ? Number(match[1]) : lvIdx + 1;

                    items.push(
                        <TimelineItem key={`lv-${block.recursion_id}-${lvIdx}`} position="left">
                            <TimelineOppositeContent>
                                {formatDate(new Date(lv.time ?? "")) ?? ""}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                {(lvIdx < block.levels.length - 1 || idx < events.length - 1) && (
                                    <TimelineConnector />
                                )}
                            </TimelineSeparator>
                            <TimelineContent>{`Level ${levelNumber}`}</TimelineContent>
                        </TimelineItem>
                    );
                });

                return items;
            })}
        </Timeline>
    )
}