import { mostCapturedPortalDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostCapturedPortal } from "./most-captured-portal"
import { unstable_cache } from "next/cache"

export default async function MostCapturedPortalDayCard() {

  const mostCapturedPortalDayCache = unstable_cache(
    async () => {
      const captured = await mostCapturedPortalDay()
      return captured.map((row) => ({
        ...row,
        captured_count: Number(row.captured_count),
      }))

    },
    ["most_captured_portal"],
    {
      tags: ['most_captured_portal_tags'],
      revalidate: 3600,
    }
  )

  const data = await mostCapturedPortalDayCache()

  if (!data[0]?.captured_count) return null
  if (!data[0].day) return null

  return (
    <BasicInfoCard>
      <MostCapturedPortal
        portalCount={data[0].captured_count}
        date={data[0].day}
      />
    </BasicInfoCard>
  )
}
