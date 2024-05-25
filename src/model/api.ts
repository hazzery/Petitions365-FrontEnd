import Axios, {AxiosResponse} from "axios";

import {
    Category,
    PetitionCreation,
    PetitionDetails,
    PetitionsList,
    Supporter,
    UserDetails,
    UserLogin,
    UserRegister
} from "./responseBodies";


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
 * Logs out the currently logged-in user.
 */
export function logout(): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.post(rootUrl + "/users/logout", {headers});
}

export type SortOrder =
    "ALPHABETICAL_ASC"
    | "ALPHABETICAL_DESC"
    | "COST_ASC"
    | "COST_DESC"
    | "CREATED_ASC"
    | "CREATED_DESC";

/**
 * Specify petition filters.
 *
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
 *
 * @param params The filters to apply to the petitions.
 */
export function getFilteredPetitions(
    params: GetFilteredPetitionsParams
): Promise<AxiosResponse<PetitionsList>> {
    return Axios.get(rootUrl + "/petitions", {params});
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
 * Fetches the image of a petition. Will succeed if the petition has an image set and fail if it does not.
 *
 * @param petitionID The ID number of the petition to fetch the image for.
 */
export function checkPetitionImage(petitionID: number): Promise<AxiosResponse> {
    return Axios.get(petitionImageUrl(petitionID));
}

/**
 * Uploads an image for a petition.
 *
 * @param petitionID The ID number of the petition to upload the image for.
 * @param image The image file to upload.
 */
export function uploadPetitionImage(petitionID: number, image: File): Promise<AxiosResponse> {
    const headers = {
        "x-authorization": localStorage.getItem("token"),
        "Content-Type": image.type
    };
    return Axios.put(petitionImageUrl(petitionID), image, {headers});
}

/**
 * Builds the URL for a user's image.
 *
 * @param userId The ID of the user to get the image URL for.
 */
export function userImageUrl(userId: number): string {
    return rootUrl + "/users/" + userId + "/image";
}

/**
 * Uploads an image for a user.
 *
 * @param userId The ID number of the user to upload the image for.
 * @param image The image file to upload.
 */
export function uploadUserImage(userId: number, image: File): Promise<AxiosResponse> {
    const headers = {
        "x-authorization": localStorage.getItem("token"),
        "Content-Type": image.type
    };
    return Axios.put(userImageUrl(userId), image, {headers});
}

/**
 * Fetches the image of a user. Will succeed if the user has an image set and fail if they do not.
 *
 * @param userId The ID number of the user to fetch the image for.
 */
export function checkUserImage(userId: number): Promise<AxiosResponse> {
    return Axios.get(userImageUrl(userId));
}

/**
 * Removes the image of a user.
 *
 * @param userId The ID number of the user to remove the image for.
 */
export function removeUserProfileImage(userId: number): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.delete(userImageUrl(userId), {headers});
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

/**
 * Creates a new petition on the server.
 *
 * @param title The title of the petition.
 * @param description A description of the petition.
 * @param categoryId The ID number of the category the petition belongs to.
 * @param supportTiers An array of support tiers for the petition.
 */
export function createPetition(
    title: string,
    description: string,
    categoryId: number,
    supportTiers: Array<{ title: string, description: string, cost: number }>
): Promise<AxiosResponse<PetitionCreation>> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.post(rootUrl + "/petitions", {title, description, categoryId, supportTiers}, {headers});
}

/**
 * Fetches the details of a user.
 *
 * @param userId The ID of the user to fetch.
 */
export function getUser(userId: number): Promise<AxiosResponse<UserDetails>> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.get(rootUrl + "/users/" + userId, {headers});
}

/**
 * Updates the details of a user.
 *
 * @param userId The ID number of the user to update.
 * @param email The user's updated email address.
 * @param firstName The user's updated first name.
 * @param lastName The user's updated last name.
 * @param password The user's updated password.
 * @param currentPassword The user's current password.
 */
export function updateUserDetails(
    userId: number, email: string, firstName: string, lastName: string, password: string, currentPassword: string
): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    const data: {
        email?: string,
        firstName?: string,
        lastName?: string,
        password?: string,
        currentPassword?: string
    } = {};
    if (email) {
        data.email = email;
    }
    if (firstName) {
        data.firstName = firstName;
    }
    if (lastName) {
        data.lastName = lastName;
    }
    if (password || currentPassword) {
        data.password = password;
        data.currentPassword = currentPassword;
    }

    return Axios.patch(rootUrl + "/users/" + userId, data, {headers});
}

/**
 * Edits the details of a petition.
 *
 * @param petitionId The ID number of the petition to edit.
 * @param title The updated title of the petition.
 * @param description The updated description of the petition.
 * @param categoryId The updated category ID of the petition.
 */
export function editPetition(
    petitionId: number,
    title: string,
    description: string,
    categoryId: number,
): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.patch(rootUrl + "/petitions/" + petitionId, {title, description, categoryId}, {headers});
}

/**
 * Create a new support tier for a petition.
 *
 * @param petitionId The ID number of the petition to create the support tier for.
 * @param title The title of the support tier.
 * @param description The description of the support tier.
 * @param cost The cost of the support tier.
 */
export function createSupportTier(
    petitionId: number,
    title: string,
    description: string,
    cost: number
): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.put(rootUrl + "/petitions/" + petitionId + "/supportTiers", {title, description, cost}, {headers});
}

/**
 * Deletes a support tier from a petition.
 *
 * @param petitionId The ID number of the petition to delete the support tier from.
 * @param supportTierId The ID number of the support tier to delete.
 */
export function deleteSupportTier(petitionId: number, supportTierId: number): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.delete(rootUrl + "/petitions/" + petitionId + "/supportTiers/" + supportTierId, {headers});
}

/**
 * Edits a support tier for a petition.
 *
 * @param petitionId The ID number of the petition to edit the support tier for.
 * @param supportTierId The ID number of the support tier to edit.
 * @param title The updated title of the support tier.
 * @param description The updated description of the support tier.
 * @param cost The updated cost of the support tier.
 */
export function editSupportTier(
    petitionId: number,
    supportTierId: number,
    title: string,
    description: string,
    cost: number
): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.patch(rootUrl + "/petitions/" + petitionId + "/supportTiers/" + supportTierId, {
        title,
        description,
        cost
    }, {headers});
}

/**
 * Deletes a petition.
 *
 * @param petitionId The ID number of the petition to delete.
 */
export function deletePetition(petitionId: number): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    return Axios.delete(rootUrl + "/petitions/" + petitionId, {headers});
}

/**
 * Supports a petition.
 *
 * @param petitionId The ID number of the petition to support.
 * @param supportTierId The ID number of the support tier to support with.
 * @param message A message to send to the petition owner.
 */
export function supportPetition(
    petitionId: number, supportTierId: number, message: string
): Promise<AxiosResponse> {
    const headers = {"x-authorization": localStorage.getItem("token")};
    const data = message ? {supportTierId, message} : {supportTierId};
    return Axios.post(rootUrl + "/petitions/" + petitionId + "/supporters", data, {headers});
}
