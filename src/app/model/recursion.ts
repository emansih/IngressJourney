export interface TimelineLevel {
    time: string;
    comment: string | null;
}

export interface TimelineBlock {
    recursion_id: number | null;
    recursion_time: string | null;
    levels: TimelineLevel[];
}

export interface ApexEvent {
    event_time: Date
}