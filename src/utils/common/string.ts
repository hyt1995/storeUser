export const _camelToSnake = (value: string) =>
    value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const _snakeToCamel = (value: string) =>
    value.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', ''),
    )
