import Axios, {AxiosResponse} from "axios";

import {Category, PetitionDetails, PetitionsList, Supporter, UserLogin, UserRegister} from "./responseBodies";


const rootUrl: string = "http://localhost:4941/api/v1";

/**
 * Logs in a user using their email and password.
 *
 * @param email The user's email address to log in with.
 * @param password The user's password to log in with.
 * @returns The user's login details if result was ok, otherwise status code and status message.
 */
export function login(email: string, password: string): Promise<AxiosResponse<UserLogin>> {
    return Axios.post(rootUrl + "/users/login", {email, password});
}

/**
 * Registers a new user with the given details.
 *
 * @param email The user's email address to register with.
 * @param firstName The user's first name to register with.
 * @param lastName The user's last name to register with.
 * @param password The user's password to register with.
 */
export function register(
    email: string, firstName: string, lastName: string, password: string
): Promise<AxiosResponse<UserRegister>> {
    return Axios.post(rootUrl + "/users/register", {email, firstName, lastName, password});
}

/**
 * Fetches all petitions.
 */
export function getAllPetitions(): Promise<AxiosResponse<PetitionsList>> {
    return Axios.get(rootUrl + "/petitions");
}

export type SortOrder =
    "ALPHABETICAL_ASC"
    | "ALPHABETICAL_DESC"
    | "COST_ASC"
    | "COST_DESC"
    | "CREATED_ASC"
    | "CREATED_DESC";

export interface GetFilteredPetitionsParams {
    startIndex?: number,
    count?: number,
    q?: string,
    categoryIds?: number[],
    supportingCost?: number,
    ownerId?: number,
    supporterId?: number,
    sortBy?: SortOrder
}

/**
 * Fetches all petitions that match the given filters.
 * @param startIndex The index of the first petition to fetch.
 * @param count The number of petitions to fetch.
 * @param q The search query to filter petitions by.
 * Results will only include petitions with titles or descriptions that contain this string.
 * @param categoryIds The IDs of categories in which petitions must be part of.
 * Results will only include petitions that are in at least one of these categories.
 * @param supportingCost The highest minimum cost to support a petition.
 * Results will only include petitions with a minimum cost to support that is less than or equal to this value.
 * @param ownerId The ID of a user.
 * Results will only include petitions that are owned by this user.
 * @param supporterId The ID of a user.
 * Results will only include petitions that are supported by this user.
 * @param sortBy Sort the petitions by the given property, according to the following rules:
 * ALPHABETICAL_ASC: alphabetically by title, A-Z
 * ALPHABETICAL_DESC: alphabetically by title, Z-A
 * COST_ASC: by cost of cheapest support tier ascending
 * COST_DESC: by cost of cheapest support tier descending
 * CREATED_ASC: chronologically in order of creation date oldest-newest
 * CREATED_DESC: chronologically in order of creation date newest-oldest
 */
export function getFilteredPetitions(
    {
        startIndex,
        count,
        q,
        categoryIds,
        supportingCost,
        ownerId,
        supporterId,
        sortBy
    }: GetFilteredPetitionsParams
): Promise<AxiosResponse<PetitionsList>> {
    const params = new URLSearchParams();

    if (startIndex !== undefined) {
        params.append("startIndex", startIndex.toString());
    }
    if (count !== undefined) {
        params.append("count", count.toString());
    }
    if (q !== undefined) {
        params.append("q", q);
    }
    if (categoryIds !== undefined && categoryIds.length > 0) {
        params.append("categoryIds", categoryIds.join(","));
    }
    if (supportingCost !== undefined) {
        params.append("supportingCost", supportingCost.toString());
    }
    if (ownerId !== undefined) {
        params.append("ownerId", ownerId.toString());
    }
    if (supporterId !== undefined) {
        params.append("supporterId", supporterId.toString());
    }
    if (sortBy !== undefined) {
        params.append("sortBy", sortBy);
    }
    return Axios.get(rootUrl + "/petitions?" + params.toString());
}

/**
 * Fetches the details of a petition.
 *
 * @param petitionID
 */
export function getPetitionDetails(petitionID: number): Promise<AxiosResponse<PetitionDetails>> {
    return Axios.get(rootUrl + "/petitions/" + petitionID);
}

/**
 * Builds the URL for a petition's image.
 *
 * @param petitionID The ID of the petition to get the image URL for.
 */
export function petitionImageUrl(petitionID: number): string {
    return rootUrl + "/petitions/" + petitionID + "/image";
}

/**
 * Builds the URL for a user's image.
 *
 * @param userID The ID of the user to get the image URL for.
 */
export function userImageUrl(userID: number): string {
    return rootUrl + "/users/" + userID + "/image";
}

/**
 * Fetches all categories.
 */
export function getAllCategories(): Promise<AxiosResponse<Array<Category>>> {
    return Axios.get(rootUrl + "/petitions/categories");
}

/**
 * Fetches all supporters of a petition.
 *
 * @param petitionId
 */
export function getSupportersOfPetition(petitionId: number): Promise<AxiosResponse<Array<Supporter>>> {
    return Axios.get(rootUrl + "/petitions/" + petitionId + "/supporters");
}
