import React, {useCallback} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import TuneIcon from "@mui/icons-material/Tune";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {Paper, Select} from "@mui/material";
import {AxiosResponse} from "axios";


import PetitionsGrid from "./PetitionsGrid.tsx";
import {getAllCategories, getAllPetitions, getFilteredPetitions} from "../model/api.ts";
import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";


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

    return (
        <div>
            <h1>Petitions</h1>
            <form
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onSubmit={() => setSearchQuery(searchInput)}
                method="dialog"
            >
                <Button>
                    <TuneIcon sx={{fontSize: 30}}/>
                </Button>
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
            <Paper>
                <Select label={"Hello"}>
                    <FormControlLabel control={<Checkbox/>} label="Show only my petitions"/>
                </Select>
            </Paper>
            <PetitionsGrid petitions={petitions} categoryMap={categoryMap}/>
        </div>
    );
}