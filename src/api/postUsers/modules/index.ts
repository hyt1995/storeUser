import bcrypt from 'bcryptjs'

export const _hash = async (source: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(source, salt)
}
