export interface UserLogin {
    userId: number,
    token: string
}

export interface UserRegister {
    userId: number
}

export interface UserDetails {
    email: string,
    firstName: string,
    lastName: string
}

export interface PetitionOverview {
    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: string,
    supportingCost: number
}

export interface PetitionsList {
    petitions: Array<PetitionOverview>,
    count: number
}

export interface AbstractSupportTier {
    supportTierId?: number | undefined,
    title: string,
    description: string,
    cost: number | ""
}

export interface SupportTier extends AbstractSupportTier {
    supportTierId: number,
    title: string,
    description: string,
    cost: number
}

export interface PetitionDetails {
    description: string,
    moneyRaised: number,
    supportTiers: Array<SupportTier>,
    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: string
}

export interface Category {
    categoryId: number,
    name: string
}

export interface Supporter {
    supportId: number,
    supportTierId: number,
    message: string,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: string
}

export interface PetitionCreation {
    petitionId: number
}
