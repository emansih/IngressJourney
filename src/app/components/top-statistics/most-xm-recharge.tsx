import { formatDateWithoutTime } from "@/app/util/dateTimeUtil";
import Typography from "@mui/material/Typography";


export function MostXmRecharge({ xmRecharge, date }: { xmRecharge: string,  date: Date }){

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most XM Recharge In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                XM Recharged: {xmRecharge}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(date)}
            </Typography>
        </>
    )
}