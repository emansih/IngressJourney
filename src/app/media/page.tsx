import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material"
import { getAttainedMedia } from "../libs/db"
import { formatDate } from "../util/dateTimeUtil"

type MediaItems = {
    mediaUrl: string,
    mediaAttainedAt: Date
}

export default async function Page() {

    const media = await getAttainedMedia()
    const mediaItem: MediaItems[] = []
    media.map((value) => {
        mediaItem.push({
            mediaUrl: value.comment?.replace('Dropped Media Item: ', '') ?? '',
            mediaAttainedAt: value.event_time
        })
    })
    const getYouTubeEmbedUrl = (url: string): string | null => {
        try {
            const parsed = new URL(url);

            if (!parsed.hostname.includes('youtube.com') && parsed.hostname !== 'youtu.be') {
                return null;
            }

            // Short form: https://youtu.be/{id}
            if (parsed.hostname === 'youtu.be') {
                const videoId = parsed.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }

            // Standard form: https://www.youtube.com/watch?v={id}
            const vParam = parsed.searchParams.get('v');
            if (vParam) {
                return `https://www.youtube.com/embed/${vParam}`;
            }

            // Non-standard form: https://www.youtube.com/watch/{id}
            const watchMatch = parsed.pathname.match(/^\/watch\/([^/?#]+)/);
            if (watchMatch) {
                return `https://www.youtube.com/embed/${watchMatch[1]}`;
            }

            // Shorts: https://www.youtube.com/shorts/{id}
            const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?#]+)/);
            if (shortsMatch) {
                return `https://www.youtube.com/embed/${shortsMatch[1]}`;
            }

            // Already an embed link
            const embedMatch = parsed.pathname.match(/^\/embed\/([^/?#]+)/);
            if (embedMatch) {
                return url;
            }

        } catch (e) {
            // invalid URL, ignore
        }
        return null;
    };


    return (
        <ImageList cols={3}>
            {mediaItem.map((item, index) => {
                const embedUrl = getYouTubeEmbedUrl(item.mediaUrl);
                return (
                    <ImageListItem key={index}>
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                height="400px"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '8px', border: 'none' }}
                            />
                        ) : (
                            <img
                                src={item.mediaUrl}
                                loading="lazy"
                            />
                        )}
                        <ImageListItemBar
                            title={`Obtained on ${formatDate(item.mediaAttainedAt) }`}
                            position="below"
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>

    )
}