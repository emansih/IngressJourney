import { getLargestField } from "@/app/libs/db"
import { BasicInfoCard } from "./basic-info-card"
import { MostMuCreated } from "./most-mu-created"



export default async function LargestFieldCard() {
    const largestField = await getLargestField()

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
