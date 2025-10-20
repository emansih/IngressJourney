import { Card, CardContent, Typography } from "@mui/material";

interface ActionContent {
    action: string,
    timestamp: string
}

export function ActionCard({action, timestamp}: ActionContent){



    return (
        <>
            <Card sx={{position: 'absolute', bottom: '2rem', left: '2rem', padding: '1rem 1.5rem'}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Action: {action}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{timestamp}</Typography>

                </CardContent>
            </Card>
        </>
    )
}