import { mostDeployedResonatorDay, mostDestroyedResonatorDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostDeplyedDestroyedReso } from "./most-deployed-destroyed-reso"
import { unstable_cache } from "next/cache"

export default async function MostResonatorActivityCard() {

    const CACHE_TIME = 3600

    const mostResoDeployedDayCache = unstable_cache(
        async () => {
            const resoDeployed = await mostDeployedResonatorDay()
            return resoDeployed.map((row) => ({
                ...row,
                resonator_count: Number(row.resonator_count),
            }))
        },
        ["most_deployed_reso_day"],
        { tags: ["most_deployed_reso_day_tag"], revalidate: CACHE_TIME }
    )

    const mostResoDestroyedDayCache = unstable_cache(
        async () => {
            const resoDestroyed = await mostDestroyedResonatorDay()
            return resoDestroyed.map((row) => ({
                ...row,
                destroyed_count: Number(row.destroyed_count),
            }))
        },
        ["most_destroyed_reso_day"],
        { tags: ["most_destroyed_reso_day_tag"], revalidate: CACHE_TIME }
    )



    const [deployed, destroyed] = await Promise.all([
        mostResoDeployedDayCache(),
        mostResoDestroyedDayCache(),
    ])

    if (!deployed[0]?.resonator_count || !destroyed[0]?.destroyed_count) return null
    if (!deployed[0]?.day || !destroyed[0]?.day) return null

    return (
        <BasicInfoCard>
            <MostDeplyedDestroyedReso
                resosDeployed={deployed[0].resonator_count}
                resosDeployedDate={deployed[0].day}
                resosDestroyed={destroyed[0].destroyed_count}
                resosDestroyedDate={destroyed[0].day}
            />
        </BasicInfoCard>
    )
}
