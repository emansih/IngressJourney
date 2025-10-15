import { Typography } from "@mui/material";
import MapEmbed from "../map/map-embed";


export function MostMuCreated({ latitude, longitude, timestamp, muCreated }: { latitude: string, longitude: string, timestamp: string, muCreated: string }){


    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Mind Units(MU) Created
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Location: {latitude},{longitude}
            </Typography>
            <MapEmbed lat={latitude} lng={longitude} width="500" height="450" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Created at: {timestamp}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                MU Created: {muCreated} MU
            </Typography>
        </>
    )
}