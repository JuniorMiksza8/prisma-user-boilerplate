import { genSalt, compare, hash } from 'bcrypt'

const saltRounds = 10

export async function hashPassword(password: string) {
    const salt = await genSalt(saltRounds)
    const hashedPassword = await hash(password, salt)

    return {
        salt,
        hash: hashedPassword,
    }
}

export function comparePassword(hash: string, password: string) {
    return compare(password, hash) // true
}
