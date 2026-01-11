import { Typography } from "@mui/material";

interface ActionContent {
    action: string,
}

export function ActionCard({ action }: ActionContent) {

    return (
        <Typography gutterBottom variant="h5" component="div">
            Action: {action}
        </Typography>
    )
}