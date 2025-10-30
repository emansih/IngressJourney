import { List, ListItem } from "@mui/material"
import { Suspense } from "react"
import { BasicInfoCardSkeleton } from "../components/top-statistics/basic-info-card-skeleton"
import LargestFieldCard from "../components/top-statistics/largest-field-card"
import MostXmRechargeCard from "../components/top-statistics/most-xm-recharge-card"
import MostCapturedPortalDayCard from "../components/top-statistics/most-captured-portal-day-card"
import MostCreatedFieldLinkCard from "../components/top-statistics/most-created-field-link-card"
import MostResonatorActivityCard from "../components/top-statistics/most-resonator-activity-card"
import MostModsDeployedCard from "../components/top-statistics/most-mods-deployed-card"
import TopCapturedPortalCard from "../components/top-statistics/top-captured-portal-card"


export default async function Page() {
    return (
        <List
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                width: "100%",
            }}
        >
            {[
                LargestFieldCard,
                MostXmRechargeCard,
                MostCapturedPortalDayCard,
                MostCreatedFieldLinkCard,
                MostResonatorActivityCard,
                MostModsDeployedCard,
                TopCapturedPortalCard,
            ].map((CardComponent, idx) => (
                <ListItem
                    key={idx}
                    sx={{ width: "100%", display: "flex", justifyContent: "center" }}
                >
                    <Suspense fallback={<BasicInfoCardSkeleton />}>
                        <CardComponent />
                    </Suspense>
                </ListItem>
            ))}
        </List>
    )
}
