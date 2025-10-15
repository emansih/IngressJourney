import { formatDateWithoutTime } from "@/app/util/dateTimeUtil";
import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";


export function MostCreatedFieldLink({ linkCreated, linkCreatedDate, fieldsCreated, fieldCreatedDate }: { linkCreated: bigint, linkCreatedDate: Date, fieldsCreated: bigint, fieldCreatedDate: Date }) {

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                Most Links Created In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Links Created: {linkCreated}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(linkCreatedDate)}
            </Typography>

            <Divider style={{ marginTop: 10, marginBottom: 10 }} />

            <Typography gutterBottom variant="h5" component="div" >
                Most Fields Created In A Day
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Fields Created: {fieldsCreated}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date: {formatDateWithoutTime(fieldCreatedDate)}
            </Typography>

        </>
    )
}