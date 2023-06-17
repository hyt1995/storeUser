export const genCode = () => {
    const randNum = Math.floor(Math.random() * 1000000)
    return `${randNum}`.padStart(6, '0')
}
