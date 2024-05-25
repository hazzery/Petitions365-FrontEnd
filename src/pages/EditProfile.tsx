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

import useStringValidation from "../hooks/useStringValidation.ts";
import PasswordInput from "../components/PasswordInput.tsx";
import NavBar from "../components/NavBar.tsx";
import {
    changeUserPassword,
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

    const [userFirstName, setUserFirstName] = useStringValidation({required: true, maxLength: 64});
    const [userLastName, setUserLastName] = useStringValidation({required: true, maxLength: 64});
    const [userEmail, setUserEmail] = useStringValidation({required: true, maxLength: 256, email: true});
    const [password, setPassword] = useStringValidation({required: true, minLength: 6, maxLength: 64});
    const [currentPassword, setCurrentPassword] = useStringValidation({required: true, minLength: 6, maxLength: 64});

    const [userAvatarUrl, setUserAvatarUrl] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [userImage, setUserImage] = React.useState<File | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [anchorImageMenu, setAnchorImageMenu] = React.useState<null | HTMLElement>(null);
    const [profileFormSubmitted, setProfileFormSubmitted] = React.useState<boolean>(false);
    const [passwordFormSubmitted, setPasswordFormSubmitted] = React.useState<boolean>(false);

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

    function handleEditProfile() {
        setProfileFormSubmitted(true);

        if (userFirstName.error || userLastName.error || userEmail.error) {
            return;
        }

        updateUserDetails(
            userId, userEmail.value, userFirstName.value, userLastName.value,
        )
            .then(() => navigate('/profile'))
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));

        if (userImage !== null) {
            uploadUserImage(userId, userImage)
                .catch(() => null);
        } else if (userAvatarUrl === "") {
            removeUserProfileImage(userId)
                .catch(() => null);
        }
    }

    function handleChangePassword() {
        setPasswordFormSubmitted(true);

        if (password.error || currentPassword.error) {
            return;
        }

        changeUserPassword(userId, password.value, currentPassword.value)
            .then(() => navigate('/profile'))
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function handleNewImage() {
        inputRef.current?.click();
        setAnchorImageMenu(null);
    }

    function handleRemoveImage() {
        setUserAvatarUrl("");
        setUserImage(null);
        setAnchorImageMenu(null);
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
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Paper sx={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar onClick={(event) => setAnchorImageMenu(event.currentTarget)} sx={{
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
                    <Box sx={{marginTop: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    label="First Name"
                                    value={userFirstName.value}
                                    onChange={(event) => setUserFirstName(event.target.value)}
                                    error={profileFormSubmitted && Boolean(userFirstName.error)}
                                    helperText={profileFormSubmitted && userFirstName.error}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={userLastName.value}
                                    onChange={(event) => setUserLastName(event.target.value)}
                                    error={profileFormSubmitted && Boolean(userLastName.error)}
                                    helperText={profileFormSubmitted && userLastName.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={userEmail.value}
                                    onChange={(event) => setUserEmail(event.target.value)}
                                    error={profileFormSubmitted && Boolean(userEmail.error)}
                                    helperText={profileFormSubmitted && userEmail.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{marginTop: 3, marginBottom: 2}}
                                    onClick={handleEditProfile}
                                >
                                    Update Profile
                                </Button>
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
                                    error={passwordFormSubmitted && Boolean(currentPassword.error)}
                                    helperText={passwordFormSubmitted && currentPassword.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="New Password"
                                    value={currentPassword.value}
                                    onChange={(value) => setCurrentPassword(value)}
                                    error={passwordFormSubmitted && Boolean(password.error)}
                                    helperText={passwordFormSubmitted && password.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{marginTop: 3}}
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}