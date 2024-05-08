import React from "react";

import {Category, PetitionOverview, PetitionsList} from "../model/responseBodies.ts";
import {getAllCategories, getAllPetitions} from "../model/api.ts";
import PetitionCard from "./PetitionCard.tsx";
import {AxiosResponse} from "axios";


export default function Petitions() {
    const [petitions, setPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map<number, string>());

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

    function petitionCards() {
        return petitions.map(
            (petition: PetitionOverview) => <PetitionCard petitionOverview={petition} categoryMap={categoryMap}/>
        );
    }

    return (
        <div>
            <h1>Petitions</h1>
            {petitionCards()}
        </div>
    )
}