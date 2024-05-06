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