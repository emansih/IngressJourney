

import { mostCreatedFieldDay, mostCreatedLinkDay } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostCreatedFieldLink } from "./most-created-field-link"

export default async function MostCreatedFieldLinkCard() {
    const [fields, links] = await Promise.all([
        mostCreatedFieldDay(),
        mostCreatedLinkDay(),
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
