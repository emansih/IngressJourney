import { ReactNode } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';



export function BasicInfoCard({ children }: { children: ReactNode }) {
    return (
        <Card sx={{ width: 600, maxWidth: '100%' }}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
