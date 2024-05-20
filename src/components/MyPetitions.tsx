import React from 'react';
import {Category, PetitionOverview} from "../model/responseBodies.ts";
import {getAllCategories, getFilteredPetitions} from "../model/api.ts";
import PetitionsGrid from "./PetitionsGrid.tsx";
import {AxiosResponse} from "axios";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import NavBar from "./NavBar.tsx";
import Box from "@mui/material/Box";


const defaultTheme = createTheme();

export default function MyPetitions(): React.ReactElement {
    const [ownedPetitions, setOwnedPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [signedPetitions, setSignedPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());

    const userId = parseInt(localStorage.getItem("userId") as string);
    React.useEffect(() => {
        getFilteredPetitions({ownerId: userId})
            .then((response) => setOwnedPetitions(response.data.petitions));
        getFilteredPetitions({supporterId: userId})
            .then((response) => setSignedPetitions(response.data.petitions));
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
            <Container component="main" maxWidth="xl">
                <CssBaseline/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                    alignItems: 'center',
                }}>
                    <NavBar/>
                    <PetitionsGrid
                        petitions={ownedPetitions}
                        categoryMap={categoryMap}
                        title={<Typography variant="h4">My Petitions</Typography>}
                        children={undefined}
                    />
                    <PetitionsGrid
                        petitions={signedPetitions}
                        categoryMap={categoryMap}
                        title={<Typography variant="h4">My Signed Petitions</Typography>}
                        children={undefined}
                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
}