'use server'

import Papa from "papaparse";
import { insertAnomalyData, insertGameLogsBatch } from "./db";
import { Readable } from "stream";

type TsvRow = {
    eventTime: string;
    latitude: string;
    longitude: string;
    action: string;
    comment: string;
};

function fileToNodeStream(file: File): Readable {
    const reader = file.stream().getReader();

    return new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null);
            } else {
                this.push(Buffer.from(value));
            }
        }
    });
}


export async function parseGameLog(file: File) {
    const convertFileToStream = fileToNodeStream(file)
    const buffer: GamelogNew[] = [];
    let resolveDone: () => void;
    const done = new Promise<void>(res => (resolveDone = res));

    Papa.parse<TsvRow>(convertFileToStream, {
        download: true,
        header: true,
        worker: true, 
        step: async function (result) {
            const row = result.data;
            buffer.push({
                id: null,
                eventTime: new Date(row.eventTime),
                action: row.action,
                comment: row.comment,
                location: {
                    type: "Point",
                    coordinates: [
                        Number(row.longitude) || 0,
                        Number(row.latitude) || 0
                    ]
                }
            });

        },
        complete: async function () {
            if (buffer.length > 0) {
                await insertGameLogsBatch(buffer);
            }
            resolveDone();
        }
    });

    await done;
}

type AnomalyHeaderCsv = {
    lat: number, 
    lon: number, 
    timezone: string, 
    series_name: string, 
    site: string, 
    start_time: Date, 
    end_time: Date, 
    cover_photo: string
}

export async function parseAnomaly(file: File){
    const convertFileToStream = fileToNodeStream(file)

    Papa.parse<AnomalyHeaderCsv>(convertFileToStream, {
        download: true,
        header: true,
        worker: true,
        step: async function (result) {
            const row = result.data;
            await insertAnomalyData(row.timezone, row.series_name, row.site, row.start_time, row.end_time, 
                row.lat, row.lon, row.cover_photo);
        },
    });
}