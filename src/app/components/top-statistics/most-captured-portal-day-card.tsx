import { mostCapturedPortalDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostCapturedPortal } from "./most-captured-portal"

export default async function MostCapturedPortalDayCard() {
  const data = await mostCapturedPortalDay()
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
