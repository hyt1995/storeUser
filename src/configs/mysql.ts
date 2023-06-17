const defaultConfig = {
    timezone: 'Z',
    database: 'User',
}

const config = {
    writer: {
        host: process.env.DB_ENDPOINT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ...defaultConfig,
    },
    reader: {
        host: process.env.READ_DB_ENDPOINT,
        user: process.env.READ_DB_USER,
        password: process.env.READ_DB_PASSWORD,
        ...defaultConfig,
    },
}

export default config
