import { TripDataType } from "@/app/model/tripdata";
import { Card, CardContent, Typography } from "@mui/material";

interface StatsContent {
    tripData: TripDataType[],
    xmRecharged: number,
    modsDestroyed: number,
    distanceWalked: string,
    battleBeacons: number,
    time: string | null
}

export function StatsCards({ tripData, xmRecharged, modsDestroyed, distanceWalked, battleBeacons, time }: StatsContent) {

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    Anomaly Stats{time ? ` as of ${time}` : ""} 
                </Typography>
                Captures: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'captured portal').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Hacks: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action.startsWith('hacked')).length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                XM Recharged: {xmRecharged}
                <p></p>
                Resonators Deployed: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'resonator deployed').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Resonators Destroyed: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'resonator destroyed').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Mods Deployed: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'mod deployed').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Mods Destroyed: {modsDestroyed}
                <p></p>
                Links Created: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'created link').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Hypercubes Used: {
                    tripData.reduce((total, value) => {
                        const count = value.waypoints.filter(waypoint => waypoint.action === 'used Hypercube').length;
                        return total + count;
                    }, 0)
                }
                <p></p>
                Distance Walked: {distanceWalked} km
                <p></p>
                Battle Beacons: {battleBeacons}
            </CardContent>
        </Card>
    )
}