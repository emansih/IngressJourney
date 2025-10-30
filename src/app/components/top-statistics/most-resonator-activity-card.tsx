import { mostDeployedResonatorDay, mostDestroyedResonatorDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostDeplyedDestroyedReso } from "./most-deployed-destroyed-reso"

export default async function MostResonatorActivityCard() {
    const [deployed, destroyed] = await Promise.all([
        mostDeployedResonatorDay(),
        mostDestroyedResonatorDay(),
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
