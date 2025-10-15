import { formatDateWithoutTime } from "@/app/util/dateTimeUtil";
import Typography from "@mui/material/Typography";


export function MostCapturedPortal({ portalCount, date }: { portalCount: bigint,  date: Date }){

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Portals Captured In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Portal Captured: {portalCount}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(date)}
            </Typography>
        </>
    )
}