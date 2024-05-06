import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CardMedia} from "@mui/material";

import {getPetitionDetails, petitionImageUrl} from "../model/api.ts";
import {PetitionDetails} from "../model/responseBodies.ts";
import Typography from "@mui/material/Typography";
import {AxiosResponse} from "axios";


// The majority of this code was taken from the Material-UI example at
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

const defaultTheme = createTheme();

interface PetitionProps {
    petitionID: number
}


export default function Petition({petitionID}: PetitionProps) {
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [ownerFirstName, setOwnerFirstName] = React.useState<string>("");
    const [ownerLastName, setOwnerLastName] = React.useState<string>("");
    const [imageURL, setImageURL] = React.useState<string>("");

    React.useEffect(() => {
        async function fetchPetition(): Promise<void> {
            getPetitionDetails(petitionID)
                .then((response: AxiosResponse<PetitionDetails>) => {
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setOwnerFirstName(response.data.ownerFirstName);
                    setOwnerLastName(response.data.ownerLastName);
                    setImageURL(petitionImageUrl(petitionID));
                })
                .catch((error) => {
                    setTitle(error.response.status.toString());
                    setDescription(error.response.statusText);
                });
        }

        fetchPetition();
    }, [petitionID]);


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}
                >
                    <Box component="image" sx={{mt: 1}}>
                        <CardMedia
                            component="img"
                            image={imageURL}
                            alt="petition"
                        />
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {description}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {`By ${ownerFirstName} ${ownerLastName}`}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}