export interface CreateUserDTO {
    username: string
    password: string
    email: string
    phone: string
}

export interface UpdateUserDTO {
    email?: string
}
