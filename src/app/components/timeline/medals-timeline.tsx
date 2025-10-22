
import { formatDate } from "@/app/util/dateTimeUtil";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";


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
                    <TimelineContent>{medal.medalName}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}