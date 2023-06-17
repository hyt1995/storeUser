const redirectDomainByStage: { [key: string]: any } = {
    local: 'https://app.gemp.io',
    dev: 'https://localhost:3000',
    qa: 'https://qa.app.gemp.dev',
    hotfix: 'https://hotfix.app.gemp.dev',
    prod: 'https://app.gemp.io',
}

export const kakao = {
    clientId: process.env.KAKAO_REST_API_KEY,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirectUri: `${
        redirectDomainByStage[process.env.APP_ENV ?? '']
    }/login?platform=kakao`,
}

export const naver = {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
}

export const snsConfig = {
    kakao,
    naver,
}

export default snsConfig
