import React, {ChangeEvent} from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";


interface ImageProps {
    imageUrl?: string | undefined,
    alt: string,
    setImage: (image: File | null) => void,
    setShouldDeleteImage: (shouldDelete: boolean) => void
}

export default function UploadProfileImage(
    {imageUrl, alt, setImage, setShouldDeleteImage}: ImageProps
): React.ReactElement {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [url, setUrl] = React.useState<string | null>(imageUrl ?? null);
    const [anchorImageMenu, setAnchorImageMenu] = React.useState<null | HTMLElement>(null);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
            setUrl(URL.createObjectURL(event.target.files[0]));
        } else {
            setImage(null);
            setUrl(null);
        }
    }

    function handleNewImage() {
        inputRef.current?.click();
        setAnchorImageMenu(null);
    }

    function handleRemoveImage() {
        setUrl("");
        setImage(null);
        setAnchorImageMenu(null);
        setShouldDeleteImage(true);
    }

    return (
        <>
            <Avatar onClick={(event) => setAnchorImageMenu(event.currentTarget)} sx={{
                cursor: 'pointer',
                marginTop: 2,
                width: 100,
                height: 100
            }}>
                {
                    url
                        ? <img
                            src={url}
                            alt={alt}
                            onError={() => setUrl(null)}
                            style={{maxWidth: '100%', maxHeight: '400px'}}
                        />
                        : <AccountCircleIcon sx={{fontSize: 120}} color="action"/>
                }
                <input
                    type="file"
                    ref={inputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
            </Avatar>
            <Menu
                sx={{marginTop: '45px'}}
                id="menu-appbar"
                anchorEl={anchorImageMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorImageMenu)}
                onClose={() => setAnchorImageMenu(null)}
            >
                <MenuItem key="uploadImage" onClick={handleNewImage}>
                    <Typography textAlign="center">Upload new profile image</Typography>
                </MenuItem>
                <MenuItem key="removeImage" onClick={handleRemoveImage}>
                    <Typography textAlign="center">Remove profile image</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}