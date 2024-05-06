import Axios, {AxiosResponse} from "axios";

import {PetitionDetails, UserLogin, UserRegister} from "./responseBodies";


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