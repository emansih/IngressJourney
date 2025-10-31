export interface LightshipResponse {
    pois: Pois[];
}

export interface Pois {
    id: string;
    hashedId: string;
    title: string;
    state: State;
    lat: number;
    lng: number;
    lastUpdateTimestampMs?: string;
    description?: string;
    images?: Image[];
    address: string;
    postalCode?: string;
    mainCategory: Category | null;
    qualityScore?: number;
    categories: Category[];
    availability: Availability;
    discoveredTimestampMs?: string;
    vpsActivated?: boolean;
    vpsLocalizability?: VpsLocalizability;
    vpsActivatedTimestampMs?: string;
    meshMetadata?: MeshMetadatum[];
}

export interface Availability {
    lat: null;
    lng: null;
}


export interface Category {
    id: string;
    name: string;
    score?: number;
}

export interface Image {
    id: string;
    url: string;
}

export interface MeshMetadatum {
    semanticLabels?: SemanticLabel[];
    maxSquareSideLength?: number;
    totalMeshCoverageArea?: number;
}

export interface SemanticLabel {
    label: Label;
    total_area_in_square_meters: number;
}

export enum Label {
    BuildingLabel = "building_label",
    WaterLabel = "water_label",
}

export enum State {
    GameRejected = "GAME_REJECTED",
    Live = "LIVE",
    Retired = "RETIRED",
}

export enum VpsLocalizability {
    Experimental = "EXPERIMENTAL",
    Production = "PRODUCTION",
}