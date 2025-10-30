import { getLargestField } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostMuCreated } from "./most-mu-created"
import { unstable_cache } from 'next/cache'

export default async function LargestFieldCard() {

    const CACHE_TIME = 3600

    const largestFieldCache = unstable_cache(
        async () => {
            return getLargestField()
        },
        ["largest_field"],
        {
            tags: ['largest_field_tags'],
            revalidate: CACHE_TIME,
        }
    )

    const largestField = await largestFieldCache()

    return (
        <BasicInfoCard>
            <MostMuCreated
                latitude={largestField.latitude?.toString() ?? ""}
                longitude={largestField.longitude?.toString() ?? ""}
                timestamp={largestField.timestamp?.toString() ?? ""}
                muCreated={largestField.muCreated?.toString() ?? ""}
            />
        </BasicInfoCard>
    )
}
