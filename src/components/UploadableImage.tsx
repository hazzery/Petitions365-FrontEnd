import React, {ChangeEvent} from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Box from "@mui/material/Box";


interface ImageProps {
    imageUrl: string,
    alt: string,
    setImage: (image: File | null) => void
}

export default function UploadableImage(
    {imageUrl, alt, setImage}: ImageProps
): React.ReactElement {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [url, setUrl] = React.useState<string | null>(imageUrl);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
            setUrl(URL.createObjectURL(event.target.files[0]));
        } else {
            setImage(null);
            setUrl(null);
        }
    }

    return (
        <Box onClick={() => inputRef.current?.click()} sx={{cursor: 'pointer'}}>
            {
                url
                    ? <img
                        src={url}
                        alt={alt}
                        onError={() => setUrl(null)}
                        style={{objectFit: 'cover', maxWidth: '100%', maxHeight: '100%'}}
                    />
                    : <AddPhotoAlternateIcon sx={{fontSize: 50}} color="action"/>
            }
            <input
                type="file"
                ref={inputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </Box>
    );
}