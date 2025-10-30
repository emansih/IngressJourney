import { formatDateWithoutTime } from "@/app/util/dateTimeUtil";
import Typography from "@mui/material/Typography";


export function MostModsDeployed({ modsDeployed, date }: { modsDeployed: number, date: Date }) {


    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Mods Deployed In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Mods Deployed: {modsDeployed}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(date)}
            </Typography>
        </>
    )
}