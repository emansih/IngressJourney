import { mostModsDeployedDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostModsDeployed } from "./most-mods-deployed"

export default async function MostModsDeployedCard() {
    const mods = await mostModsDeployedDay()
    if (!mods[0]?.mod_count) return null
    if (!mods[0]?.day) return null

    return (
        <BasicInfoCard>
            <MostModsDeployed
                modsDeployed={mods[0].mod_count}
                date={mods[0].day}
            />
        </BasicInfoCard>
    )
}
