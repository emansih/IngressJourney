import { mostXmRechargedInADay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostXmRecharge } from "./most-xm-recharge"

export default async function MostXmRechargeCard() {
    const maxXmRecharge = await mostXmRechargedInADay()
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
