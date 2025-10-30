
import { topCapturedPortal } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { TopCapturedPortal } from "./top-captured-portal"

export default async function TopCapturedPortalCard() {
    const mostCapturedPortal = await topCapturedPortal(5)

    return (
        <BasicInfoCard>
            <TopCapturedPortal capturedPortalResult={mostCapturedPortal} />
        </BasicInfoCard>
    )
}
