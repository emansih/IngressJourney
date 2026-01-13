import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { convertEpochToLocalTime, formatTime } from '@/app/util/dateTimeUtil';
import { Grid } from '@mui/material';
import { useState } from 'react';

interface UserJourneySeekbarParams {
    startDateTime: Date;
    endDateTime: Date;
    timeZone: string;
    currentTime: number;            
    onTimeChange?: (newEpoch: number) => void;
}

export function UserJourneySeekbar({
    startDateTime,
    endDateTime,
    timeZone,
    currentTime, 
    onTimeChange
}: UserJourneySeekbarParams) {

    const startEpoch = startDateTime.getTime();
    const endEpoch = endDateTime.getTime();
    const durationMs = endEpoch - startEpoch;

    const offsetMs = Math.min(Math.max(currentTime * 10000, 0), durationMs);


    const handleChange = (_: Event, newValue: number) => {
        const newSeconds = newValue / 10000;
        onTimeChange?.(newSeconds);
    };

    const valueLabelFormat = (value: number) => {
        const epoch = startEpoch + value;
        const localTime = convertEpochToLocalTime(epoch, timeZone);
        return localTime
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                Timeline
            </Typography>
            <Slider
                min={0}
                max={durationMs}
                step={1000}
                value={offsetMs}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="auto"
                onChange={handleChange}
                sx={{ flexGrow: 1 }}
            />


            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                    {formatTime(startDateTime, timeZone)}
                </Typography>

                <Typography variant="body2">
                    {formatTime(endDateTime, timeZone)}
                </Typography>
            </Box>
        </Box>
    );
}
