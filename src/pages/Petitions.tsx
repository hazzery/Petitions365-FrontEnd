import React, {ChangeEvent, useCallback} from "react";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import TuneIcon from "@mui/icons-material/Tune";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    useTheme
} from "@mui/material";
import {AxiosResponse} from "axios";


import PetitionsGrid from "../components/PetitionsGrid.tsx";
import {getAllCategories, getFilteredPetitions, GetFilteredPetitionsParams, SortOrder} from "../model/api.ts";
import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";


const petitionSortOrdersMap = new Map<SortOrder, string>([
    ["CREATED_ASC", "Chronological (Oldest first)"],
    ["CREATED_DESC", "Chronological (Newest first)"],
    ["ALPHABETICAL_ASC", "Alphabetical (A-Z)"],
    ["ALPHABETICAL_DESC", "Alphabetical (Z-A)"],
    ["COST_ASC", "Cost (Lowest first)"],
    ["COST_DESC", "Cost (Highest first)"]
]);

const petitionSortOrders = Array.from(petitionSortOrdersMap.keys());

export default function Petitions() {
    const theme = useTheme();
    const [petitions, setPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [supportingCostIsFocused, setSupportingCostIsFocused] = React.useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);
    const [selectedCost, setSelectedCost] = React.useState<number | "">("");
    const [selectedSortOrder, setSelectedSortOrder] = React.useState<SortOrder>("CREATED_ASC");
    const [showFilterBar, setShowFilterBar] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [pageSize] = React.useState<number>(9);
    const [numberSearchResults, setNumberSearchResults] = React.useState<number>(0);

    const submitSearchQuery = useCallback(() => {
        function buildQueryParams(): GetFilteredPetitionsParams {
            const params: GetFilteredPetitionsParams = {};
            if (searchQuery.length > 0) {
                params.q = searchQuery;
            }
            if (selectedCategories.length > 0) {
                params.categoryIds = selectedCategories;
            }
            if (selectedCost !== "") {
                params.supportingCost = selectedCost;
            }
            params.startIndex = (pageNumber - 1) * pageSize;
            params.count = pageSize;
            params.sortBy = selectedSortOrder;
            return params;
        }

        getFilteredPetitions(buildQueryParams())
            .then((response: AxiosResponse<PetitionsList>) => {
                setPetitions(response.data.petitions);
                setNumberSearchResults(response.data.count);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });
    }, [pageNumber, pageSize, searchQuery, selectedCategories, selectedCost, selectedSortOrder]);

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
        const number = Number(event.target.value);
        if (event.target.value === "") {
            setSelectedCost("");
        } else if (!isNaN(number)) {
            setSelectedCost(number);
        }
    }

    function sortOrderOptions(): React.ReactElement[] {
        return petitionSortOrders.map((option: SortOrder) => (
            <MenuItem key={option} value={option}>
                {petitionSortOrdersMap.get(option)}
            </MenuItem>
        ));
    }

    return (
        <Container component="main" maxWidth="xl">
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Typography variant="h2" sx={{marginBottom: '40px'}}>
                    Petitions
                </Typography>
                <Box
                    component="form"
                    onSubmit={() => setSearchQuery(searchInput)}
                    method="dialog"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        width: '100%'
                    }}>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{
                            backgroundColor: theme.palette.mode === "light" ? theme.palette.common.white : undefined,
                            color: theme.palette.primary.main,
                            marginRight: 1
                        }}
                        onClick={() => setShowFilterBar(!showFilterBar)}
                    >
                        <Typography variant="body2">{showFilterBar ? "Hide filters" : "Show filters"}</Typography>
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
                </Box>
                {showFilterBar && <Paper sx={{marginBottom: 3, display: 'inline-flex', flexDirection: 'row'}}>
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
                            shrink: supportingCostIsFocused || selectedCost !== "",
                            style: {paddingLeft: supportingCostIsFocused ? '0px' : '15px'}
                        }}
                        onFocus={() => setSupportingCostIsFocused(true)}
                        onBlur={() => setSupportingCostIsFocused(false)}
                    />
                    <TextField
                        select
                        label="Sort order"
                        sx={{margin: 2}}
                        value={selectedSortOrder}
                        onChange={(event) => setSelectedSortOrder(event.target.value as SortOrder)}
                    >
                        {sortOrderOptions()}
                    </TextField>
                </Paper>}

                <PetitionsGrid petitions={petitions} categoryMap={categoryMap} title={undefined}>
                    <Pagination
                        showFirstButton
                        showLastButton
                        count={Math.ceil(numberSearchResults / pageSize)}
                        color="primary"
                        onChange={(_, page) => setPageNumber(page)}
                        sx={{
                            justifySelf: 'center',
                            marginY: '1rem'
                        }}
                    />
                </PetitionsGrid>
            </Box>
        </Container>
    );
}