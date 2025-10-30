

import { formatDateWithoutTime } from "@/app/util/dateTimeUtil";
import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";


export function MostDeplyedDestroyedReso({ resosDeployed, resosDeployedDate, resosDestroyed, resosDestroyedDate }: 
    { resosDeployed: number, resosDeployedDate: Date, resosDestroyed: number, resosDestroyedDate: Date }) {

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Resonators Deployed In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Resonators Deployed: {resosDeployed}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(resosDeployedDate)}
            </Typography>

            <Divider style={{ marginTop: 10, marginBottom: 10 }} />

            <Typography gutterBottom variant="h5" component="div" >
                Most Resonators Destroyed In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Resonators Destroyed: {resosDestroyed}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(resosDestroyedDate)}
            </Typography>

        </>
    )
}