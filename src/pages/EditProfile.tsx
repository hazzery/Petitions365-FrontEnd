import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
    getUser,
    removeUserProfileImage,
    updateUserDetails,
    uploadUserImage,
    userImageUrl
} from "../model/api.ts";
import {UserDetails} from "../model/responseBodies.ts";
import {formatServerResponse} from "../model/util.ts";
import UploadProfileImage from "../components/UploadProfileImage.tsx";


const defaultTheme = createTheme();

export default function EditProfile(): React.ReactElement {
    const navigate = useNavigate();

    const [userFirstName, setUserFirstName] = useStringValidation({required: true, maxLength: 64});
    const [userLastName, setUserLastName] = useStringValidation({required: true, maxLength: 64});
    const [userEmail, setUserEmail] = useStringValidation({required: true, maxLength: 256, email: true});
    const [password, setPassword] = useStringValidation({required: true, minLength: 6, maxLength: 64});
    const [currentPassword, setCurrentPassword] = useStringValidation({required: true, minLength: 6, maxLength: 64});

    const [editProfileErrorMessage, setEditProfileErrorMessage] = React.useState<string>("");
    const [changePasswordErrorMessage, setChangePasswordErrorMessage] = React.useState<string>("");
    const [userImage, setUserImage] = React.useState<File | null>(null);
    const [profileFormSubmitted, setProfileFormSubmitted] = React.useState<boolean>(false);
    const [passwordFormSubmitted, setPasswordFormSubmitted] = React.useState<boolean>(false);
    const [shouldDeleteImage, setShouldDeleteImage] = React.useState<boolean>(false);

    const userId = parseInt(localStorage.getItem("userId") as string);

    React.useEffect(() => {
        getUser(userId)
            .then((response: AxiosResponse<UserDetails>) => {
                setUserFirstName(response.data.firstName);
                setUserLastName(response.data.lastName);
                setUserEmail(response.data.email);
            })
            .catch(() => navigate("/login"));
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
            .catch(() => setEditProfileErrorMessage("Invalid current password"));

        if (userImage !== null) {
            uploadUserImage(userId, userImage)
                .catch(() => null);
        } else if (shouldDeleteImage) {
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
            .catch((error) => setChangePasswordErrorMessage(formatServerResponse(error.response.statusText)));
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

                    <UploadProfileImage
                        imageUrl={userImageUrl(userId)}
                        alt={"User profile image"}
                        setImage={setUserImage}
                        setShouldDeleteImage={setShouldDeleteImage}
                    />
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
                                <Typography variant="body1" color="error">
                                    {editProfileErrorMessage}
                                </Typography>
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
                                    value={currentPassword.value}
                                    onChange={(value) => setCurrentPassword(value)}
                                    error={passwordFormSubmitted && Boolean(currentPassword.error)}
                                    helperText={passwordFormSubmitted && currentPassword.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="New Password"
                                    value={password.value}
                                    onChange={(value) => setPassword(value)}
                                    error={
                                        passwordFormSubmitted && (Boolean(password.error) || password.value === currentPassword.value)
                                    }
                                    helperText={
                                        passwordFormSubmitted && (password.error || (password.value === currentPassword.value && "Passwords should not match"))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="error">
                                    {changePasswordErrorMessage}
                                </Typography>
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
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}