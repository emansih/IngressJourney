'use client'

import { useEffect, useState } from 'react';
import { getActionsRange, getAnomaly, getUserInteractionBattleBeacon } from '../libs/db';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { TripDataType } from '../model/tripdata';
import { useDeckLayers } from '../hooks/useDeckLayers';
import { formatTime } from '../util/dateTimeUtil';
import { ActionCard } from '../components/card/action-card';
import { DeckMap } from '../components/map/deck-map';
import { MapContainer } from '../components/map/map-container';

type AnomalyData = {
    id: string,
    latitude: number,
    longitude: number,
    timezone: string,
    series_name: string,
    site: string,
    start_time: Date,
    end_time: Date
}

export default function Page() {


    const [anomalyId, setAnomalyId] = useState('');
    const [anomaly, setAnomaly] = useState<AnomalyData[]>([])
    const [currentTime, setCurrentTime] = useState(0);
    const [tripData, setTripData] = useState<TripDataType[]>([]);
    const [totalDuration, setTotalDuration] = useState(1000);
    const [currentInfo, setCurrentInfo] = useState<{ action: string; timestamp: string } | null>(null);
    const [timeZone, setTimeZone] = useState('')
    const [startTime, setStartTime] = useState<Date | null>(null)
    const [endTime, setEndTime] = useState<Date | null>(null)
    const [pulseTime, setPulseTime] = useState(0);
    const [battleBeacons, setBattleBeacons] = useState<LatLng[]>([]);
    const [defaultCenter, setDefaultCenter] = useState<LatLng>()

    const handleChange = (event: SelectChangeEvent) => {
        const anomId = event.target.value
        setAnomalyId(anomId);
        const filteredAnom = anomaly.filter((value) => value.id == anomId)[0]
        setTimeZone(filteredAnom.timezone)
        setStartTime(filteredAnom.start_time)
        setEndTime(filteredAnom.end_time)
        setDefaultCenter([filteredAnom.latitude, filteredAnom.longitude])
    };

    // Pulse timer
    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = () => {
            const elapsed = (performance.now() - start) / 1000;
            setPulseTime(elapsed);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Trip timer
    useEffect(() => {
        if (!tripData.length) return;
        let raf = 0;
        const start = performance.now();
        const pauseDuration = 800;

        function tick() {
            const elapsedSeconds = (performance.now() - start) / 100;
            const t = (elapsedSeconds * 3) % totalDuration;

            if (t >= totalDuration - 1 / 60) {
                setTimeout(() => setCurrentTime(0), pauseDuration);
            } else {
                setCurrentTime(t);
            }

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [tripData, totalDuration]);

    useEffect(() => {
        if (!tripData.length) return;
        const waypoints = tripData[0].waypoints;
        const index = waypoints.findIndex((p) => p.timestamp > currentTime);
        const current = index > 0 ? waypoints[index - 1] : waypoints[0];

        if (current && current.action) {
            setCurrentInfo({ action: current.action, timestamp: formatTime(current.time, timeZone) });
        }
    }, [currentTime, tripData, timeZone]);

    // Fetch data
    useEffect(() => {
        if(startTime != null && endTime != null){
            getUserInteractionBattleBeacon(
                startTime,
                endTime
            ).then(setBattleBeacons);

            getActionsRange(startTime, endTime).then((value) => {
                if (!value.length) return;
                const formatted: TripDataType[] = [
                    {
                        waypoints: value.map(item => ({
                            coordinates: [item.longitude, item.latitude],
                            timestamp: item.event_number,
                            action: item.action,
                            time: item.event_time,
                        })),
                    },
                ];
                const lastTimestamp = formatted[0].waypoints[formatted[0].waypoints.length - 1].timestamp;
                setTotalDuration(lastTimestamp + 1);
                setTripData(formatted);
            });
        }
       
    }, [startTime, endTime]);

    const layers = useDeckLayers(tripData, battleBeacons, pulseTime, currentTime, totalDuration);


    useEffect(() => {
        getAnomaly().then((value) => {
            setAnomaly(value);
        });
    }, []);

    return (
        <div>
            {anomalyId && defaultCenter && (
                <MapContainer
                    defaultCenter={[defaultCenter[0], defaultCenter[1]]}
                    mapChildren={currentInfo && <ActionCard action={currentInfo.action} timestamp={currentInfo.timestamp} />}
                    mapOverlay={<DeckMap layers={layers} />}
                />
            )}
            
            {anomalyId == '' && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}>
                    <FormControl sx={{ m: 1, minWidth: 400 }}>
                        <InputLabel id="select-helper-label">Anomaly</InputLabel>
                        <Select
                            labelId="select-helper-label"
                            id="select-helper"
                            value={anomalyId}
                            label="Site"
                            onChange={handleChange}>
                            {anomaly.map((anomalyValue) => {
                                return (
                                    <MenuItem key={anomalyValue.id} value={anomalyValue.id}>
                                        {anomalyValue.series_name} ({anomalyValue.site})
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <FormHelperText>Select an Anomaly Site</FormHelperText>
                    </FormControl>
                </div>
            )}
        </div>
       
    )
}