import { getLargestField, mostCapturedPortalDay, mostCreatedFieldDay, mostCreatedLinkDay, mostDeployedResonatorDay, mostDestroyedResonatorDay, mostModsDeployedDay, mostXmRechargedInADay, topCapturedPortal } from "../libs/db"
import { MostMuCreated } from "../components/top-statistics/most-mu-created"
import { BasicInfoCard } from "../components/top-statistics/basic-info-card"
import { MostXmRecharge } from "../components/top-statistics/most-xm-recharge"
import { TopCapturedPortal } from "../components/top-statistics/top-captured-portal"
import { List, ListItem } from "@mui/material"
import { MostCapturedPortal } from "../components/top-statistics/most-captured-portal"
import { MostCreatedFieldLink } from "../components/top-statistics/most-created-field-link"
import { MostDeplyedDestroyedReso } from "../components/top-statistics/most-deployed-destroyed-reso"
import { MostModsDeployed } from "../components/top-statistics/most-mods-deployed"


export default async function Page() {
    const [
        largestField,
        maxXmRecharge,
        mostCapturedPortal,
        mostCapturedPortalInADay,
        mostCreatedFieldInADay,
        mostCreatedLinkInADay,
        mostDeployedResonatorInADay,
        mostDestroyedResonatorInADay,
        mostModsDeployedInADay,
    ] = await Promise.all([
        getLargestField(),
        mostXmRechargedInADay(),
        topCapturedPortal(5),
        mostCapturedPortalDay(),
        mostCreatedFieldDay(),
        mostCreatedLinkDay(),
        mostDeployedResonatorDay(),
        mostDestroyedResonatorDay(),
        mostModsDeployedDay(),
    ])

    return (
        <div>
            <List
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <BasicInfoCard>
                        <MostMuCreated
                            latitude={largestField.latitude?.toString() ?? ''}
                            longitude={largestField.longitude?.toString() ?? ''}
                            timestamp={largestField.timestamp?.toString() ?? ''}
                            muCreated={largestField.muCreated?.toString() ?? ''}
                        />
                    </BasicInfoCard>
                </ListItem>

                {maxXmRecharge[0]?.recharge_date && (
                    <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <BasicInfoCard>
                            <MostXmRecharge
                                xmRecharge={maxXmRecharge[0].total_xm?.toString() ?? ''}
                                date={maxXmRecharge[0].recharge_date}
                            />
                        </BasicInfoCard>
                    </ListItem>
                )}

                {mostCapturedPortalInADay[0]?.captured_count && mostCapturedPortalInADay[0]?.day && (
                    <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <BasicInfoCard>
                            <MostCapturedPortal
                                portalCount={mostCapturedPortalInADay[0].captured_count}
                                date={mostCapturedPortalInADay[0].day}
                            />
                        </BasicInfoCard>
                    </ListItem>
                )}

                {mostCreatedFieldInADay[0]?.day &&
                    mostCreatedFieldInADay[0]?.field_count &&
                    mostCreatedLinkInADay[0]?.link_count &&
                    mostCreatedLinkInADay[0]?.day && (
                        <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <BasicInfoCard>
                                <MostCreatedFieldLink
                                    linkCreated={mostCreatedLinkInADay[0].link_count}
                                    linkCreatedDate={mostCreatedLinkInADay[0].day}
                                    fieldsCreated={mostCreatedFieldInADay[0].field_count}
                                    fieldCreatedDate={mostCreatedFieldInADay[0].day}
                                />
                            </BasicInfoCard>
                        </ListItem>
                    )}

                {mostDeployedResonatorInADay[0]?.resonator_count &&
                    mostDeployedResonatorInADay[0]?.day &&
                    mostDestroyedResonatorInADay[0]?.destroyed_count &&
                    mostDestroyedResonatorInADay[0]?.day && (
                        <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <BasicInfoCard>
                                <MostDeplyedDestroyedReso
                                    resosDeployed={mostDeployedResonatorInADay[0].resonator_count}
                                    resosDeployedDate={mostDeployedResonatorInADay[0].day}
                                    resosDestroyed={mostDestroyedResonatorInADay[0].destroyed_count}
                                    resosDestroyedDate={mostDestroyedResonatorInADay[0].day}
                                />
                            </BasicInfoCard>
                        </ListItem>
                    )}

                {mostModsDeployedInADay[0]?.mod_count && mostModsDeployedInADay[0]?.day && (
                    <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <BasicInfoCard>
                            <MostModsDeployed
                                modsDeployed={mostModsDeployedInADay[0].mod_count}
                                date={mostModsDeployedInADay[0].day}
                            />
                        </BasicInfoCard>
                    </ListItem>
                )}

                <ListItem sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <BasicInfoCard>
                        <TopCapturedPortal capturedPortalResult={mostCapturedPortal} />
                    </BasicInfoCard>
                </ListItem>
            </List>
        </div>
    )
}
