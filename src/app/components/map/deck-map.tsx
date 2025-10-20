'use client'

import React, { useEffect, useMemo } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import type { Layer } from '@deck.gl/core';

type DeckMapProps = {
    layers: Layer[];
};

export function DeckMap({ layers }: DeckMapProps) {
    const map = useMap();

    const overlay = useMemo(() => new GoogleMapsOverlay({ layers }), []);

    useEffect(() => {
        if (!map) return;
        overlay.setMap(map);

        return () => overlay.setMap(null);
    }, [map, overlay]);

    useEffect(() => {
        overlay.setProps({ layers });
    }, [layers, overlay]);

    return null;
}
