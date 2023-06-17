const jwtConfig = {
    /** 공통 구성값 */
    commonOption: {
        /** 토큰 발급자 */
        issuer: 'ironflag',
        /** 토큰 제목 */
        subject: 'ironflag',
    },

    /** 시크릿 소스 */
    commonSecret: process.env.JWT_SECRET_KEY as string,

    /** certificate 토큰 구성값 */
    certificate: {
        expiresIn: '30m',
    },

    /** access 토큰 구성값 */
    access: {
        expiresIn: '1h',
    },

    /** refresh 토큰 구성값 */
    shortRefresh: {
        expiresIn: '14d',
    },
    longRefresh: {
        expiresIn: '28d',
    },
}

export default jwtConfig
