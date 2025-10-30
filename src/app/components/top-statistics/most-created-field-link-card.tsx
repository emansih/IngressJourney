

import { mostCreatedFieldDay, mostCreatedLinkDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostCreatedFieldLink } from "./most-created-field-link"
import { unstable_cache } from "next/cache"

export default async function MostCreatedFieldLinkCard() {

    const CACHE_TIME = 3600

    const mostCreatedFieldDayCache = unstable_cache(
        async () => {
            const fieldCreated = await mostCreatedFieldDay()
            return fieldCreated.map((row) => ({
                ...row,
                field_count: Number(row.field_count),
            }))
        },
        ["most_created_field_day"],
        { tags: ["most_created_field_day_tag"], revalidate: CACHE_TIME }
    )

    const mostCreatedLinkDayCache = unstable_cache(
        async () => {
            const linkCreated = await mostCreatedLinkDay()
            return linkCreated.map((row) => ({
                ...row,
                link_count: Number(row.link_count),
            }))

        },
        ["most_created_link_day"],
        { tags: ["most_created_link_day_tag"], revalidate: CACHE_TIME }
    )


    const [fields, links] = await Promise.all([
        mostCreatedFieldDayCache(),
        mostCreatedLinkDayCache(),
    ])

    if (!fields[0]?.field_count || !links[0]?.link_count) return null
    if(!fields[0].day || !links[0].day) return null
    
    return (
        <BasicInfoCard>
            <MostCreatedFieldLink
                linkCreated={links[0].link_count}
                linkCreatedDate={links[0].day}
                fieldsCreated={fields[0].field_count}
                fieldCreatedDate={fields[0].day}
            />
        </BasicInfoCard>
    )
}
