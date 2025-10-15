type MapEmbedProps = {
    lat: string;
    lng: string;
    zoom?: number;
    width?: string;
    height?: string;
};

export default function MapEmbed({
    lat,
    lng,
    zoom = 15,
    width = "600",
    height = "450",
}: MapEmbedProps) {
    const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

    return (
        <iframe
            src={src}
            width={width}
            height={height}
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
        ></iframe>
    );
}
