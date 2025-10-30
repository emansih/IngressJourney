import { most_captured_portal } from "@/app/model/generated/prisma/sql";
import { Divider, Stack, Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MapEmbed from "../map/map-embed";

type TopCapturedResults = {
    latitude: number | null
    longitude: number | null
    occurrences: number | null
}

export function TopCapturedPortal({ capturedPortalResult }: { capturedPortalResult: TopCapturedResults[] }){

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Captured Portal(s)
            </Typography>

            <List sx={{ bgcolor: 'background.paper' }}>
                {capturedPortalResult.map((capturedPortal, index) => (
                    <> 
                        <ListItem key={index}>
                            <Stack spacing={1} width="100%">
                                <Typography variant="subtitle1">
                                    {capturedPortal.latitude}, {capturedPortal.longitude}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Captured {capturedPortal.occurrences} times
                                </Typography>

                                {index === 0 && (
                                    <MapEmbed
                                        lat={capturedPortal.latitude?.toString() ?? ''}
                                        lng={capturedPortal.longitude?.toString() ?? ''}
                                        width="500"
                                        height="450"
                                    />
                                )}
                            </Stack>
                        </ListItem>
                        <Divider />
                    </>
                ))}
            </List>
        </>
    );
}