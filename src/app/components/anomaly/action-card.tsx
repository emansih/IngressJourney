import { Card, CardContent, Typography } from "@mui/material";

interface ActionContent {
    action: string,
    timestamp: string
}

export function ActionCard({ action, timestamp }: ActionContent) {



    return (
        <>

            <Typography gutterBottom variant="h5" component="div">
                Action: {action}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{timestamp}</Typography>

        </>
    )
}