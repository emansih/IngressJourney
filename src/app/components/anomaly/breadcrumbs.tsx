import { Breadcrumbs, Typography } from "@mui/material"


interface BreadCrumbsProps {
    breadCrumbs: {
        breadCrumbText: string,
        currentlyActive: boolean,
        actions: () => void
    }[]
}

export function BreadCrumbs(breadCrumbProps: BreadCrumbsProps){

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: '12px', marginTop: '8px' }}>
                {breadCrumbProps.breadCrumbs.map(((value) => (
                    <>
                        {!value.currentlyActive && (
                            <Typography sx={{ color: 'text.primary', textDecorationLine: 'underline', cursor: 'pointer' }} onClick={() => {
                                value.actions()
                            }}>{value.breadCrumbText}</Typography>
                        )}
                        {value.currentlyActive && (
                            <Typography sx={{ color: 'text.primary' }}>{value.breadCrumbText}</Typography>
                        )}
                    </>
                )))}
            </Breadcrumbs>
        </div>
    )
}