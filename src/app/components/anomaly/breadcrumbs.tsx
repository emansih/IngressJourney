import { Breadcrumbs, Typography } from "@mui/material"


interface BreadCrumbsProps {
    breadCrumbs: {
        breadCrumbText: string,
        currentlyActive: boolean,
        actions: () => void
    }[]
}

export function BreadCrumbs({ breadCrumbs }: BreadCrumbsProps) {
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: 12, marginTop: 8 }}>
                {breadCrumbs.map((value, index) => (
                    <Typography
                        key={index}
                        sx={{
                            color: 'text.primary',
                            textDecorationLine: value.currentlyActive ? 'none' : 'underline',
                            cursor: value.currentlyActive ? 'default' : 'pointer',
                        }}
                        onClick={!value.currentlyActive ? value.actions : undefined}
                    >
                        {value.breadCrumbText}
                    </Typography>
                ))}
            </Breadcrumbs>
        </div>
    )
}
