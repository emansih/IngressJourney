'use server'

import Papa from "papaparse";
import { insertGameLogsBatch } from "./db";
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
                eventTime: row.eventTime,
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