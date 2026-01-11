'use client'

import { useEffect, useState } from 'react';
import { getActionsRange, getAnomaly, getDestroyedMods, getDistanceWalked, getUserInteractionBattleBeacon, xmRechargeRange } from '../libs/db';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Slider, Typography } from '@mui/material';
import { TripDataType } from '../model/tripdata';
import { useDeckLayers } from '../hooks/useDeckLayers';
import { formatDateWithoutTime, formatTime } from '../util/dateTimeUtil';
import { ActionCard } from '../components/anomaly/action-card';
import { DeckMap } from '../components/map/deck-map';
import { MapContainer } from '../components/map/map-container';
import { BreadCrumbs } from '../components/anomaly/breadcrumbs';
import { StatsCards } from '../components/anomaly/stats-cards';

type AnomalyData = {
    id: string,
    latitude: number,
    longitude: number,
    timezone: string,
    series_name: string,
    site: string,
    start_time: Date,
    end_time: Date,
    cover_photo: string | null
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
    const [anomalyTimelineSpeed, setAnomalyTimelineSpeed] = useState(3);
    const [xmRecharge, setXmRecharge] = useState(0)
    const [distanceWalked, setDistanceWalked] = useState('0')
    const [modsDestroyed, setModsDestroyed] = useState(0)

    const handleChange = (anomId: string) => {
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
            const t = (elapsedSeconds * anomalyTimelineSpeed) % totalDuration;

            if (t >= totalDuration - 1 / 60) {
                setTimeout(() => setCurrentTime(0), pauseDuration);
            } else {
                setCurrentTime(t);
            }

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [tripData, totalDuration, anomalyTimelineSpeed]);

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
        if (startTime != null && endTime != null) {
            getUserInteractionBattleBeacon(
                startTime,
                endTime
            ).then(setBattleBeacons);
            getDestroyedMods(startTime, endTime).then(setModsDestroyed)
            getActionsRange(startTime, endTime).then((value) => {
                if (!value.length) return;
                const filtered = value.filter((item, index, arr) => {
                    // Remove 'drone moved' itself
                    if (item.action === 'drone moved') return false;

                    // Remove 'hacked xxx portal' if it directly follows a 'drone moved'
                    const prev = arr[index - 1];
                    if (prev && prev.action === 'drone moved' && item.action.startsWith('hacked')) {
                        return false;
                    }

                    return true;
                });
                const formatted: TripDataType[] = [
                    {
                        waypoints: filtered.map(item => ({
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
                xmRechargeRange(startTime, endTime).then(setXmRecharge)
                getDistanceWalked(startTime, endTime).then(value => {
                    setDistanceWalked(value.toFixed(3))
                })
            });
        }

    }, [startTime, endTime]);


    const handleSliderChange = (event: Event, newValue: number) => {
        setAnomalyTimelineSpeed(newValue);
    };

    const layers = useDeckLayers(tripData, battleBeacons, pulseTime, currentTime, totalDuration);


    useEffect(() => {
        getAnomaly().then((value) => {
            setAnomaly(value);
        });
    }, []);

    return (
        <div>
            {anomalyId && defaultCenter && (
                <>
                    <BreadCrumbs breadCrumbs={[
                        {
                            breadCrumbText: 'Anomaly Sites',
                            currentlyActive: false,
                            actions: () => {
                                setAnomalyId('')
                                setDefaultCenter(undefined)
                                setCurrentInfo(null)
                                setPulseTime(0)
                                setTimeZone('')
                                setTripData([])
                                setBattleBeacons([])
                                setXmRecharge(0)
                                setDistanceWalked('0')
                            }
                        }, {
                            // TODO: To enable clicking in the future
                            breadCrumbText: anomaly.filter((value) => value.id == anomalyId)[0].series_name,
                            currentlyActive: true,
                            actions: () => { }
                        },
                        {
                            breadCrumbText: anomaly.filter((value) => value.id == anomalyId)[0].site,
                            currentlyActive: true,
                            actions: () => { }
                        }]}>
                    </BreadCrumbs>
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <MapContainer
                                mapStyle={{ width: '100%', height: '85vh', position: 'relative' }}
                                defaultCenter={[defaultCenter[0], defaultCenter[1]]}
                                mapOverlay={<DeckMap layers={layers} />}
                            />
                        </Grid>
                        <Grid size={3}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Timeline Speed
                            </Typography>
                            <Slider
                                value={typeof anomalyTimelineSpeed === 'number' ? anomalyTimelineSpeed : 0}
                                onChange={handleSliderChange}
                                aria-labelledby="input-slider"
                                min={1}
                                max={10}
                                shiftStep={1}
                                step={1}
                                valueLabelDisplay="auto"
                                marks
                            />
                            {
                                currentInfo && (
                                    <div>
                                        <ActionCard action={currentInfo.action} />

                                        <StatsCards
                                            tripData={tripData}
                                            xmRecharged={xmRecharge}
                                            modsDestroyed={modsDestroyed}
                                            distanceWalked={distanceWalked}
                                            battleBeacons={battleBeacons.length}
                                            time={currentInfo.timestamp} />
                                    </div>
                                )
                            }
                        </Grid>
                    </Grid>
                </>
            )}
            {anomalyId == '' && (
                <div>
                    <Box sx={{ flexGrow: 1, ml: 4, mr: 4, mt: 4, mb: 4 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {anomaly.map((item, index) => (
                                <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                                    <Card key={index}>
                                        <CardActionArea onClick={() => {
                                            handleChange(item.id)
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={item.cover_photo ?? '/marker-blue.png'}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {item.series_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {item.site} - {formatDateWithoutTime(item.start_time)}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>

                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                </div>

            )}
        </div>

    )
}