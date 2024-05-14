import React, {ChangeEvent, useCallback} from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import TuneIcon from "@mui/icons-material/Tune";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {AxiosResponse} from "axios";


import PetitionsGrid from "./PetitionsGrid.tsx";
import {getAllCategories, getAllPetitions, getFilteredPetitions} from "../model/api.ts";
import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";


export default function Petitions() {
    const [petitions, setPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);
    const [selectedCost, setSelectedCost] = React.useState<number | "">("");
    const [supportingCostIsFocused, setSupportingCostIsFocused] = React.useState<boolean>(false);

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
                setCategories(response.data);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });
        submitSearchQuery();
    }, [submitSearchQuery]);

    function handleCategoryFilterChange(event: SelectChangeEvent<number[]>): void {
        setSelectedCategories(event.target.value as number[]);
    }

    function renderSelectedCategories(selected: number[]): string {
        return selected.map(
            (categoryId: number) => categoryMap.get(categoryId)
        ).join(', ');
    }

    function checkCategory(category: Category): boolean {
        return selectedCategories.indexOf(category.categoryId) > -1;
    }

    function categoryCheckboxes(): React.ReactElement[] {
        return categories.map((category: Category) => {
            return (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                    <Checkbox checked={checkCategory(category)}/>
                    <ListItemText primary={category.name}/>
                </MenuItem>
            );
        });
    }

    function handleCostFilterChange(event: ChangeEvent<HTMLInputElement>): void {
        const number = parseInt(event.target.value);
        if (event.target.value === "") {
            setSelectedCost("");
        } else if (!isNaN(number)) {
            setSelectedCost(number);
        }
    }

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
            <Paper sx={{marginY: 3, display: 'inline-flex', flexDirection: 'row'}}>
                <FormControl sx={{margin: 2, width: 300}}>
                    <InputLabel id="demo-multiple-checkbox-label">Categories</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        multiple
                        value={selectedCategories}
                        onChange={handleCategoryFilterChange}
                        input={<OutlinedInput label="Categories"/>}
                        renderValue={renderSelectedCategories}
                    >
                        {categoryCheckboxes()}
                    </Select>
                </FormControl>
                <TextField
                    label="Minimum supporting cost"
                    value={selectedCost}
                    onChange={handleCostFilterChange}
                    sx={{margin: 2}}
                    InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                    InputLabelProps={{
                        shrink: supportingCostIsFocused,
                        style: {paddingLeft: supportingCostIsFocused ? '0px' : '15px'}
                    }}
                    onFocus={() => setSupportingCostIsFocused(true)}
                    onBlur={() => setSupportingCostIsFocused(false)}
                />
                <TextField
                    label="Owned by"
                    sx={{margin: 2}}
                />
                <TextField
                    label="Supported by"
                    sx={{margin: 2}}
                />
            </Paper>
            <PetitionsGrid petitions={petitions} categoryMap={categoryMap}/>
        </div>
    );
}