
import { topCapturedPortal } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { TopCapturedPortal } from "./top-captured-portal"
import { unstable_cache } from "next/cache"

export default async function TopCapturedPortalCard() {

    const CACHE_TIME = 3600
    const mostCapturedPortalCache = unstable_cache(
        async () => {
            const captured = await topCapturedPortal(5)
            return captured.map((row) => ({
                ...row,
                occurrences: Number(row.occurrences),
            }))
        },
        ["top_catured_portal"],
        {
            tags: ['top_catured_portal_tags'],
            revalidate: CACHE_TIME,
        }
    )


    const mostCapturedPortal = await mostCapturedPortalCache()

    return (
        <BasicInfoCard>
            <TopCapturedPortal capturedPortalResult={mostCapturedPortal} />
        </BasicInfoCard>
    )
}
