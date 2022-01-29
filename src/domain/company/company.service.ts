import { database } from '../../database'

interface CreateCompanyProps {
    name: string
    cnpj: string
    phone: string
    email: string
    ownerId: string
}

interface UpdateCompanyProps {
    id: string
    name?: string
    phone?: string
    email?: string
    avatar?: string
}

export class CompanyService {
    async find() {
        return database.company.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                owner: true,
            },
        })
    }

    async findById(id: string) {
        return database.company.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        })
    }

    async create(data: CreateCompanyProps) {
        return database.company.create({
            data,
        })
    }
    async delete(id: string) {
        return database.company.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        })
    }

    async update({ id, ...data }: UpdateCompanyProps) {
        return database.company.update({
            where: {
                id,
            },
            data,
        })
    }
}
