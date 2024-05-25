import React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import PetitionsGrid from "../components/PetitionsGrid.tsx";
import NavBar from "../components/NavBar.tsx";
import {getAllCategories, getFilteredPetitions} from "../model/api.ts";
import {Category, PetitionOverview} from "../model/responseBodies.ts";


const defaultTheme = createTheme();

export default function MyPetitions(): React.ReactElement {
    const navigate = useNavigate();
    const [ownedPetitions, setOwnedPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [signedPetitions, setSignedPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());

    const userId = parseInt(localStorage.getItem("userId") as string);
    React.useEffect(() => {
        getFilteredPetitions({ownerId: userId})
            .then((response) => setOwnedPetitions(response.data.petitions))
            .catch(() => navigate("/login"));
        getFilteredPetitions({supporterId: userId})
            .then((response) => setSignedPetitions(response.data.petitions))
            .catch(() => navigate("/login"));
        getAllCategories()
            .then((response: AxiosResponse<Array<Category>>) => {
                const map = new Map<number, string>();
                response.data.forEach((category: Category) => {
                    map.set(category.categoryId, category.name);
                });
                setCategoryMap(map);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main" maxWidth="xl">
                <CssBaseline/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                    alignItems: 'center',
                }}>
                    <PetitionsGrid
                        petitions={ownedPetitions}
                        categoryMap={categoryMap}
                        title={<Typography variant="h4">My Petitions</Typography>}
                        children={undefined}
                    />
                    <PetitionsGrid
                        petitions={signedPetitions}
                        categoryMap={categoryMap}
                        title={<Typography variant="h4">Petitions I've supported</Typography>}
                        children={undefined}
                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
}