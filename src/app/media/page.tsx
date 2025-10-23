import { ImageList, ImageListItem } from "@mui/material"
import { getAttainedMedia } from "../libs/db"



export default async function Page() {

    const media = await getAttainedMedia()
    const mediaItem: string[] = []
    media.map((value) => {
        mediaItem.push(value.comment?.replace('Dropped Media Item: ', '') ?? '')
    })

    const getYouTubeEmbedUrl = (url: string): string | null => {
        try {
            const parsed = new URL(url);
            if (
                parsed.hostname === 'youtu.be' ||
                parsed.hostname.includes('youtube.com')
            ) {
                const videoId =
                    parsed.hostname === 'youtu.be'
                        ? parsed.pathname.slice(1)
                        : parsed.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }
        } catch (e) {
            // invalid URL
        }
        return null;
    };


    return (
        <ImageList cols={3}>
            {mediaItem.map((item, index) => {
                const embedUrl = getYouTubeEmbedUrl(item);
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
                                src={item}
                                loading="lazy"
                            />
                        )}
                    </ImageListItem>
                );
            })}
        </ImageList>

    )
}