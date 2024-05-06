import Axios, {AxiosResponse} from "axios";
import {Err, Ok, Result} from "ts-results";

import {Failure, UserLogin, UserRegister} from "./responseBodies";


const rootUrl: string = "http://localhost:4941/api/v1";

/**
 * Logs in a user using their email and password.
 *
 * @param email The user's email address to log in with.
 * @param password The user's password to log in with.
 * @returns The user's login details if result was ok, otherwise status code and status message.
 */
export async function login(email: string, password: string): Promise<Result<UserLogin, Failure>> {
    return await Axios.post(rootUrl + "/users/login", {email, password})
        .then((response: AxiosResponse<UserLogin>) => new Ok(response.data))
        .catch((error) => new Err({status: error.response.status, message: error.response.statusText}));
}

export async function register(
    email: string, firstName: string, lastName: string, password: string
): Promise<Result<UserRegister, Failure>> {
    return await Axios.post(rootUrl + "/users/register", {email, firstName, lastName, password})
        .then((response: AxiosResponse<UserRegister>) => new Ok(response.data))
        .catch((error) => new Err({status: error.response.status, message: error.response.statusText}));
}