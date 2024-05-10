import React from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import {AxiosResponse} from "axios";


import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";
import {getAllCategories, getAllPetitions} from "../model/api.ts";
import PetitionCard from "./PetitionCard.tsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


export default function Petitions() {
    const [petitions, setPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    React.useEffect(() => {
        getAllPetitions()
            .then((response: AxiosResponse<PetitionsList>) => {
                setPetitions(response.data.petitions);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });

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
    }, []);

    function submitSearchQuery(event: React.FormEvent<HTMLDivElement>) {
        console.log(event);
    }

    function petitionCards() {
        return petitions.map(
            (petition: PetitionOverview) => <PetitionCard
                key={petition.petitionId}
                petitionOverview={petition}
                categoryMap={categoryMap}
            />
        );
    }

    return (
        <div>
            <h1>Petitions</h1>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    sx={{width: '50%'}}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onSubmit={submitSearchQuery}
                />
                <Button variant="contained" color="primary" sx={{marginLeft: 1}}>
                    <SearchIcon sx={{fontSize: 30}}/>
                </Button>
            </Box>
            <div className="petitions-grid">
                {petitionCards()}
            </div>
        </div>
    );
}