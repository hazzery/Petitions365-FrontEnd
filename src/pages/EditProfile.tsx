import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Divider, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import useFieldValidation from "../hooks/useFieldValidation.ts";
import PasswordInput from "../components/PasswordInput.tsx";
import NavBar from "../components/NavBar.tsx";
import {
    checkUserImage,
    getUser,
    removeUserProfileImage,
    updateUserDetails,
    uploadUserImage,
    userImageUrl
} from "../model/api.ts";
import {UserDetails} from "../model/responseBodies.ts";
import {formatServerResponse} from "../model/util.ts";


const defaultTheme = createTheme();

export default function EditProfile(): React.ReactElement {
    const navigate = useNavigate();

    const [userFirstName, setUserFirstName] = useFieldValidation({maxLength: 64});
    const [userLastName, setUserLastName] = useFieldValidation({maxLength: 64});
    const [userEmail, setUserEmail] = useFieldValidation({maxLength: 256, email: true});
    const [password, setPassword] = useFieldValidation({minLength: 6, maxLength: 64});
    const [currentPassword, setCurrentPassword] = useFieldValidation({minLength: 6, maxLength: 64});

    const [userAvatarUrl, setUserAvatarUrl] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [userImage, setUserImage] = React.useState<File | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

    const userId = parseInt(localStorage.getItem("userId") as string);

    React.useEffect(() => {
        getUser(userId)
            .then((response: AxiosResponse<UserDetails>) => {
                setUserFirstName(response.data.firstName);
                setUserLastName(response.data.lastName);
                setUserEmail(response.data.email);
            })
            .catch(() => navigate("/login"));

        checkUserImage(userId)
            .then(() => setUserAvatarUrl(userImageUrl(userId)))
            .catch(() => setUserAvatarUrl(""));
    }, [navigate, setUserEmail, setUserFirstName, setUserLastName, userId]);

    function handleSubmit() {
        setFormSubmitted(true);
        updateUserDetails(
            userId,
            userEmail.value,
            userFirstName.value,
            userLastName.value,
            password.value,
            currentPassword.value
        ).then(() => {
            navigate('/profile');
        }).catch((error) => {
            setErrorMessage(
                formatServerResponse(error.response.statusText)
            );
        });
        if (userImage !== null) {
            uploadUserImage(userId, userImage)
                .catch(() => {});
        } else if (userAvatarUrl === "") {
            removeUserProfileImage(userId)
                .catch(() => {});
        }
    }

    function handleAvatarClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorElUser(event.currentTarget);
    }

    function closeProfileImageMenu() {
        setAnchorElUser(null);
    }

    function handleUploadImageClick() {
        inputRef.current?.click();
        closeProfileImageMenu();
    }

    function handleRemoveImageClick() {
        setUserAvatarUrl("");
        setUserImage(null);
        closeProfileImageMenu();
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const files = event.target.files;
        if (files && files.length > 0) {
            setUserImage(files[0]);
            setUserAvatarUrl(URL.createObjectURL(files[0]));
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main">
                <CssBaseline/>
                <Paper sx={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar onClick={handleAvatarClick} sx={{
                        cursor: 'pointer',
                        marginTop: 2,
                        width: 100,
                        height: 100
                    }}>
                        <input
                            type="file"
                            ref={inputRef}
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                        {
                            userAvatarUrl ?
                                <img src={userAvatarUrl} alt="User"
                                     style={{objectFit: 'cover', width: '100%', height: '100%'}}/> :
                                <AccountCircleIcon sx={{fontSize: 120}} color="action"/>
                        }
                    </Avatar>
                    <Menu
                        sx={{marginTop: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={closeProfileImageMenu}
                    >
                        <MenuItem key="uploadImage" onClick={handleUploadImageClick}>
                            <Typography textAlign="center">Upload new profile image</Typography>
                        </MenuItem>
                        <MenuItem key="removeImage" onClick={handleRemoveImageClick}>
                            <Typography textAlign="center">Remove profile image</Typography>
                        </MenuItem>
                    </Menu>
                    <Box sx={{marginTop: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    label="First Name"
                                    value={userFirstName.value}
                                    onChange={(event) => setUserFirstName(event.target.value)}
                                    error={formSubmitted && Boolean(userFirstName.error)}
                                    helperText={formSubmitted && userFirstName.error}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={userLastName.value}
                                    onChange={(event) => setUserLastName(event.target.value)}
                                    error={formSubmitted && Boolean(userLastName.error)}
                                    helperText={formSubmitted && userLastName.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={userEmail.value}
                                    onChange={(event) => setUserEmail(event.target.value)}
                                    error={formSubmitted && Boolean(userEmail.error)}
                                    helperText={formSubmitted && userEmail.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{marginY: "15px"}}/>
                                <Typography variant="h6" color="textSecondary">
                                    Change Password
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="Current Password"
                                    value={password.value}
                                    onChange={(value) => setPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="New Password"
                                    value={currentPassword.value}
                                    onChange={(value) => setCurrentPassword(value)}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{marginTop: 3, marginBottom: 2}}
                            onClick={handleSubmit}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}