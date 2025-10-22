import { MedalsTimeline } from "@/app/components/timeline/medals-timeline"
import { getMedal } from "@/app/libs/db"


export default async function Page({
    params,
}: {
    params: Promise<{ medalName: string }>
}) {

    const { medalName } = await params
    const medalData = await getMedal(medalName)
    const medalList: MedalData[] = medalData.map(value => ({
        medalName: value.medal_name,
        timeAttained: value.attained_at
    }));


    return (
        <MedalsTimeline medalList={medalList} />
    )

}