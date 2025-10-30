import { Skeleton, Card, CardContent } from "@mui/material"

export function BasicInfoCardSkeleton() {
    return (
        <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 3 }}>
            <CardContent>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
            </CardContent>
        </Card>
    )
}