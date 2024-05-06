import Axios, {AxiosResponse} from "axios";

import {UserLogin, UserRegister} from "./responseBodies";


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
