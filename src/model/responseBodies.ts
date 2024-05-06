export interface Failure {
    status: number,
    message: string
}

export interface UserLogin {
    userId: number,
    token: string
}

export interface UserRegister {
    userId: number
}

export interface UserDetails {
    email?: string,
    firstName: string,
    lastName: string
}

export interface SupportTier {
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
    ownerId: number
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number
    creationDate: string
}