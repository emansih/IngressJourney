import { unstable_cache } from "next/cache";
import { MedalsTimeline } from "../components/timeline/medals-timeline";
import { getMedals } from "../libs/db";

export default async function Page() {

    const CACHE_TIME = 3600
    const medalCache = unstable_cache(
        async () => {
            const medalData = await getMedals()
            const medalList: MedalData[] = medalData.map(value => ({
                medalName: value.medal_name,
                timeAttained: value.attained_at
            }));
            return medalList
        },
        ["cache"],
        { tags: ["cache_tag"], revalidate: CACHE_TIME }
    )

    const medalList = await medalCache()


    return (
        <MedalsTimeline medalList={medalList} />
    )
}