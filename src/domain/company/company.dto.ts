export interface CreateCompanyDTO {
    name: string
    phone: string
    cnpj: string
    email: string
}

export interface UpdateCompanyDTO {
    name?: string
    phone?: string
    email?: string
    avatar?: string
}
