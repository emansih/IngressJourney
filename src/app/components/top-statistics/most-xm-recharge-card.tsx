import { mostXmRechargedInADay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostXmRecharge } from "./most-xm-recharge"
import { unstable_cache } from "next/cache"

export default async function MostXmRechargeCard() {
    const CACHE_TIME = 3600

    const maxXmRechargeCache = unstable_cache(
        async () => {
            return mostXmRechargedInADay()
        },
        ["most_xm_recharge_day"],
        {
            tags: ['most_xm_recharge_day_tags'],
            revalidate: CACHE_TIME,
        }
    )

    const maxXmRecharge = await maxXmRechargeCache()
    
    if (!maxXmRecharge[0]?.recharge_date) return null

    return (
        <BasicInfoCard>
            <MostXmRecharge
                xmRecharge={maxXmRecharge[0].total_xm?.toString() ?? ""}
                date={maxXmRecharge[0].recharge_date}
            />
        </BasicInfoCard>
    )
}
