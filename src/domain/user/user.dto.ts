export interface CreateUserDTO {
    username: string
    password: string
    email: string
}

export interface UpdateUserDTO {
    email?: string
}
