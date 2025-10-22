import { MedalsTimeline } from "../components/timeline/medals-timeline";
import { getMedals } from "../libs/db";

export default async function Page() {

    const medalData = await getMedals()
    const medalList: MedalData[] = medalData.map(value => ({
        medalName: value.medal_name,
        timeAttained: value.attained_at
    }));


    return (
        <MedalsTimeline medalList={medalList} />
    )
}