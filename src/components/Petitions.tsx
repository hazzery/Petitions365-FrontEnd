import React, {useCallback} from "react";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import {AxiosResponse} from "axios";


import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";
import {getAllCategories, getAllPetitions, getFilteredPetitions} from "../model/api.ts";
import PetitionCard from "./PetitionCard.tsx";
import Button from "@mui/material/Button";


export default function Petitions() {
    const [petitions, setPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [searchInput, setSearchInput] = React.useState<string>("");

    const submitSearchQuery = useCallback(() => {
        (searchQuery.length == 0 ? getAllPetitions() : getFilteredPetitions({q: searchQuery}))
            .then((response: AxiosResponse<PetitionsList>) => {
                setPetitions(response.data.petitions);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });
    }, [searchQuery]);

    React.useEffect(() => {
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
        submitSearchQuery();
    }, [submitSearchQuery]);

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
            <form
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onSubmit={() => setSearchQuery(searchInput)}
                method="dialog"
            >
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    sx={{width: '50%'}}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" sx={{marginLeft: 1}}>
                    <SearchIcon sx={{fontSize: 30}}/>
                </Button>
            </form>
            <div className="petitions-grid">
                {petitionCards()}
            </div>
        </div>
    );
}