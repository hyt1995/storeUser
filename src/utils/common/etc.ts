export const _createQuerystring = (params: { [key: string]: any }): string =>
    Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}=${value.map((v) => `${v}`)}`
            }
            return `${key}=${value}`
        })
        .join('&')
