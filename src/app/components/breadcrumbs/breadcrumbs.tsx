import { Breadcrumbs, Link, Typography } from "@mui/material"


interface BreadCrumbsProps {
    breadCrumbs: {
        breadCrumbText: string,
        breadCrumbLink: string
        currentlyActive: boolean
    }[]
}

export function BreadCrumbs(breadCrumbProps: BreadCrumbsProps){

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                {breadCrumbProps.breadCrumbs.map(((value) => (
                    <>
                        {!value.currentlyActive && (
                            <Link underline="hover" color="inherit" href={value.breadCrumbLink}>
                                {value.breadCrumbText}
                            </Link>
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