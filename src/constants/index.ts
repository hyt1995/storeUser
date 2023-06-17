import { State } from '../types'

export const allowOrigin: { [key in State]: string[] } = {
    local: ['localhost', '127.0.0.1'],
    dev: [
        'localhost',
        '127.0.0.1',
        'dev.admin.gemp.dev',
        'dev.app.gemp.dev',
        'dev.api.gemp.dev',
        'dev.docs.gemp-user-api.gemp.dev',
    ],
    qa: [
        'qa.admin.gemp.dev',
        'qa.app.gemp.dev',
        'qa.api.gemp.dev',
        'qa.docs.gemp-user-api.gemp.dev',
    ],
    hotfix: [
        'hotfix.admin.gemp.dev',
        'hotfix.app.gemp.dev',
        'hotfix.api.gemp.dev',
        'hotfix.docs.gemp-user-api.gemp.dev',
    ],
    prod: ['admin.gemp.io', 'app.gemp.io', 'api.gemp.io'],
}

export const cookieDomain = {
    local: '.localhost',
    dev: '.localhost',
    qa: '.gemp.dev',
    hotfix: '.gemp.dev',
    prod: '.gemp.io',
}
