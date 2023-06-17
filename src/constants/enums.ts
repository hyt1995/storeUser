export const enum UserStateType {
    WAITING = 'waiting',
    DEACTIVATED = 'deactivated',
    NORMAL = 'normal',
    TRANSACTION = 'sanction_abnormal_transaction',
    ACCESS = 'sanction_abnormal_access',
    DORMANCY = 'dormancy',
}

export enum AuthMethodType {
    EMAIL = 'email',
    KAKAO = 'kakao',
    NAVER = 'naver',
    GOOGLE = 'google',
}
