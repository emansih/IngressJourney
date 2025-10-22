"use client"

import { formatDate } from "@/app/util/dateTimeUtil";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import Link from 'next/link'


export function MedalsTimeline({ medalList }: { medalList: MedalData[] }) {
    

    return (
        <Timeline>
            {medalList.map((medal) => (
                <TimelineItem key={medal.medalName}>
                    <TimelineOppositeContent>
                        {formatDate(medal.timeAttained)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Link href={`/medal/${medal.medalName.split(' ').slice(1).join(' ')}`}
                            style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}>
                            {medal.medalName}
                        </Link>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}