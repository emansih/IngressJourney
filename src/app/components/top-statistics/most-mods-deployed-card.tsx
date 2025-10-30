import { mostModsDeployedDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostModsDeployed } from "./most-mods-deployed"
import { unstable_cache } from "next/cache"

export default async function MostModsDeployedCard() {

    const CACHE_TIME = 3600
    const modsCache = unstable_cache(
        async () => {
            const modDeployed = await mostModsDeployedDay()
            return modDeployed.map((row) => ({
                ...row,
                mod_count: Number(row.mod_count),
            })) 
        },
        ["most_mods_day"],
        {
            tags: ['most_mods_day_tags'],
            revalidate: CACHE_TIME,
        }
    )

    const mods = await modsCache()
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
