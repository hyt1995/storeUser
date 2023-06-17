import { Severity } from '@ironflag/types'

/** 에러 코드 객체 반환 타입 */
interface IErrorType {
    errorCode: string
    statusCode: number
    severity?: Severity
    message: {
        en?: string
        ko: string
    }
}

export const _createError = (code: IErrorType) => {
    const { errorCode } = code
    const error = new Error(errorCode)

    throw error
}

// E0XXXX: 서버 오류 코드입니다.
// E00XXX: 서버 내 정의되지 않았거나, 운영중 발생하면 안되는 오류들을 정의합니다.
/** E00000: 서버 내 정의되지 않았거나, 운영중 발생하면 안되는 오류입니다. */
export const E00000: IErrorType = {
    errorCode: 'E00000',
    statusCode: 500,
    severity: 'alert',
    message: {
        en: 'INTERNAL_SERVER_ERROR',
        ko: '서버에서 오류가 발생하였습니다.',
    },
}

// E1XXXX: 공통 오류입니다.
export const E10000: IErrorType = {
    errorCode: 'E10000',
    statusCode: 400,
    severity: 'alert',
    message: {
        en: 'BAD_REQUEST',
        ko: '잘못된 요청입니다.',
    },
}
export const E10001: IErrorType = {
    errorCode: 'E10001',
    statusCode: 400,
    severity: 'alert',
    message: {
        en: 'INVALID_PARAMETER',
        ko: '유효하지 않은 파라미터 값입니다.',
    },
}
export const E10002: IErrorType = {
    errorCode: 'E10002',
    statusCode: 400,
    message: {
        en: 'BAD_PARAMETER',
        ko: '잘못된 파라미터 값입니다.',
    },
}
export const E10003: IErrorType = {
    errorCode: 'E10003',
    statusCode: 400,
    message: {
        en: 'BAD_PARAMETER',
        ko: '파라미터 일부가 존재하지 않습니다.',
    },
}
export const E10004: IErrorType = {
    errorCode: 'E10004',
    statusCode: 400,
    message: {
        en: 'NOT_EXIST_COOKIE',
        ko: '쿠키가 존재하지 않습니다.',
    },
}
export const E10005: IErrorType = {
    errorCode: 'E10005',
    statusCode: 400,
    message: {
        en: 'CORS_ERROR',
        ko: 'CORS 에러가 발생하였습니다.',
    },
}
export const E10006: IErrorType = {
    errorCode: 'E10006',
    statusCode: 404,
    message: {
        en: 'BAD_PARAMETER',
        ko: '해당 리소스는 존재하지 않습니다.',
    },
}
// E11XXX: 이메일 관련 오류입니다.
export const E11000: IErrorType = {
    errorCode: 'E11000',
    statusCode: 429,
    message: {
        en: 'TOO_MANY_REQUEST',
        ko: '인증코드 발급 가능 횟수를 초과하였습니다. 잠시 후 다시 요청해 주세요.',
    },
}
export const E11001: IErrorType = {
    errorCode: 'E11001',
    statusCode: 404,
    message: {
        en: 'NOT_EXIST_REQUEST',
        ko: '해당 email로 발송된 코드가 존재하지 않습니다.',
    },
}
export const E11002: IErrorType = {
    errorCode: 'E11002',
    statusCode: 400,
    message: {
        en: 'INVALID_CODE',
        ko: '인증번호가 일치하지 않습니다.',
    },
}

// E12XXX: 권한 관련 오류입니다.
export const E12000: IErrorType = {
    errorCode: 'E12000',
    statusCode: 401,
    message: {
        en: 'INVALID_TOKEN',
        ko: '권한이 유효하지 않습니다.',
    },
}
export const E12001: IErrorType = {
    errorCode: 'E12001',
    statusCode: 401,
    message: {
        en: 'NOT_EXIST_TOKEN',
        ko: '권한이 존재하지 않습니다.',
    },
}

// E2XXXX: 서비스 관련 오류 코드입니다.
export const E20001: IErrorType = {
    errorCode: 'E20001',
    statusCode: 401,
    message: {
        en: 'NOT_LOGIN',
        ko: '회원 권한이 존재하지 않습니다.',
    },
}
export const E20002: IErrorType = {
    errorCode: 'E20002',
    statusCode: 403,
    message: {
        en: 'AUTH_TOKEN_FAIL',
        ko: '인증키가 없거나 유효하지 않습니다.',
    },
}
export const E20004: IErrorType = {
    errorCode: 'E20004',
    statusCode: 400,
    message: {
        en: 'PHONE_ALREADY_EXIST',
        ko: '이미 가입된 휴대전화 번호 입니다.',
    },
}
export const E20005: IErrorType = {
    errorCode: 'E20005',
    statusCode: 400,
    message: {
        en: 'NOT_AVABILY',
        ko: '유효한값이 아닙니다.',
    },
}
export const E20006: IErrorType = {
    errorCode: 'E20006',
    statusCode: 400,
    message: {
        en: 'SMS_CERT_FAIL',
        ko: '인증에 실패하였습니다',
    },
}
export const E20008: IErrorType = {
    errorCode: 'E20008',
    statusCode: 400,
    message: {
        en: 'EMAIL NOT INVALID',
        ko: '아이디(이메일) 형식이 올바르지 않습니다.',
    },
}
export const E20009: IErrorType = {
    errorCode: 'E20009',
    statusCode: 400,
    message: {
        en: 'EMAIL_NOT_EXIST',
        ko: '이메일이 존재하지 않습니다.',
    },
}
export const E20010: IErrorType = {
    errorCode: 'E20010',
    statusCode: 400,
    message: {
        en: 'IS_NOT_VALID_PASSWORD',
        ko: '비밀번호가 맞지 않습니다.',
    },
}
export const E20015: IErrorType = {
    errorCode: 'E20015',
    statusCode: 401,
    message: {
        en: 'TRY_LOGIN_AGAIN',
        ko: '로그인을 다시 시도해주세요.',
    },
}
export const E20016: IErrorType = {
    errorCode: 'E20016',
    statusCode: 401,
    message: {
        en: 'IS_NOT_MEMBERS',
        ko: '로그인 후 이용해주시기 바랍니다.',
    },
}
export const E20017: IErrorType = {
    errorCode: 'E20017',
    statusCode: 400,
    message: {
        en: 'IS_NOT_SignUp',
        ko: '회원가입에 실패하셨습니다.',
    },
}
export const E20018: IErrorType = {
    errorCode: 'E20018',
    statusCode: 400,
    message: {
        en: 'IS_NOT_email_token',
        ko: '이메일 토큰이 일치하지 않습니다.',
    },
}
export const E20019: IErrorType = {
    errorCode: 'E20019',
    statusCode: 400,
    message: {
        en: 'IS_NOT_INVALID_PASSWORD',
        ko: '유효한 비밀번호가 아닙니다.',
    },
}
export const E20020: IErrorType = {
    errorCode: 'E20020',
    statusCode: 400,
    message: {
        en: 'EMAIL_ALREADY_EXIST',
        ko: '이미 가입된 이메일입니다.',
    },
}
export const E20021: IErrorType = {
    errorCode: 'E20021',
    statusCode: 400,
    message: {
        en: 'ESSENTIAL_VOLUNTARY_CUTS_AGREE',
        ko: '자진 삭감에 동의 하셔야합니다.',
    },
}
export const E20022: IErrorType = {
    errorCode: 'E20022',
    statusCode: 400,
    message: {
        en: 'NOT_MATCH_AMOUNT',
        ko: '결제 금액이 일치하지 않습니다.',
    },
}
export const E20023: IErrorType = {
    errorCode: 'E20023',
    statusCode: 400,
    message: {
        en: 'PAYMENT_ERROR',
        ko: '결제 오류입니다.',
    },
}
export const E20024: IErrorType = {
    errorCode: 'E20024',
    statusCode: 400,
    message: {
        en: 'NOT_FOUND_DATA',
        ko: '요청하신 정보를 찾을 수 없습니다.',
    },
}
export const E20025: IErrorType = {
    errorCode: 'E20025',
    statusCode: 400,
    message: {
        en: 'NOT_AGREE_REQUIRED_TERMS',
        ko: '필수 약관에 동의 하셔야합니다.',
    },
}
// E21XXX: 회원가입, 로그인, 비밀번호 찾기 관련 오류 코드입니다.
export const E21000: IErrorType = {
    errorCode: 'E21000',
    statusCode: 400,
    message: {
        en: 'INCORRECT_INFO',
        ko: '이메일 주소나 비밀번호가 일치하지 않습니다.',
    },
}
export const E21001: IErrorType = {
    errorCode: 'E21001',
    statusCode: 400,
    message: {
        en: 'NOT_AVABILTY_REQUEST',
        ko: 'SNS로 가입하신 회원은 GEMP내의 비밀번호 수정이 어렵습니다.',
    },
}
export const E21002: IErrorType = {
    errorCode: 'E21002',
    statusCode: 400,
    message: {
        en: 'REGISTERED_MEMBER',
        ko: '이미 가입된 이메일 입니다.',
    },
}
export const E21003: IErrorType = {
    errorCode: 'E21003',
    statusCode: 400,
    message: {
        en: 'NOT_REGISTERED_MEMBER',
        ko: '가입되어 있지 않은 회원입니다.',
    },
}
export const E21004: IErrorType = {
    errorCode: 'E21004',
    statusCode: 400,
    message: {
        en: 'NOT_MATCH_PASSWORD',
        ko: '기존 비밀번호와 일치하지 않습니다.',
    },
}
export const E21005: IErrorType = {
    errorCode: 'E21005',
    statusCode: 400,
    message: {
        en: 'SAME_PASSWORD',
        ko: '입력된 비밀번호가 기존 비밀번호와 동일합니다. 다시 확인해 주시기 바랍니다.',
    },
}
// E22XXX: 유효성 검사 코드입니다.
export const E22000: IErrorType = {
    errorCode: 'E22000',
    statusCode: 400,
    message: {
        en: 'INVALID_PASSWORD',
        ko: '유효한 비밀번호가 아닙니다.',
    },
}
export const E22001: IErrorType = {
    errorCode: 'E22001',
    statusCode: 400,
    message: {
        en: 'INVALID_EMAIL',
        ko: '아이디(이메일) 형식이 올바르지 않습니다.',
    },
}
export const E22002: IErrorType = {
    errorCode: 'E22002',
    statusCode: 400,
    message: {
        en: 'INVALID_TOKEN',
        ko: '토큰이 유효하지 않습니다.',
    },
}
export const E22003: IErrorType = {
    errorCode: 'E22003',
    statusCode: 400,
    message: {
        en: 'NOT_FOUND_TOKEN',
        ko: '저장된 토큰이 없습니다.',
    },
}
export const E22004: IErrorType = {
    errorCode: 'E22004',
    statusCode: 400,
    message: {
        en: 'TOKEN_CHANGED',
        ko: '토큰이 변조되었습니다.',
    },
}

export const E22005: IErrorType = {
    errorCode: 'E22005',
    statusCode: 400,
    message: {
        en: 'NEED_DELETE_TOKEN',
        ko: '토큰 삭제가 필요합니다.',
    },
}

export const E22006: IErrorType = {
    errorCode: 'E22006',
    statusCode: 400,
    message: {
        en: 'NEED_REFRESH_TOKEN',
        ko: '토큰 갱신이 필요합니다.',
    },
}

// E23XXX: Product 관련 코드입니다.
export const E23001: IErrorType = {
    errorCode: 'E23001',
    statusCode: 400,
    message: {
        en: 'NOT_ENOUGH_REMAINING',
        ko: '구매를 위한 잔여량이 부족합니다.',
    },
}
export const E23002: IErrorType = {
    errorCode: 'E23002',
    statusCode: 400,
    message: {
        en: 'NOT_ENOUGH_BALANCE',
        ko: '구매를 위한 잔액이 부족합니다.',
    },
}
export const errorTable: { [key: string]: IErrorType } = {
    E00000,
    E10000,
    E10001,
    E10002,
    E10003,
    E10004,
    E10005,
    E10006,
    E11000,
    E11001,
    E11002,
    E12000,
    E12001,
    E20001,
    E20002,
    E20004,
    E20006,
    E20009,
    E20010,
    E20015,
    E20016,
    E20017,
    E20018,
    E20019,
    E20020,
    E20021,
    E20022,
    E20023,
    E20024,
    E20025,
    E21000,
    E21001,
    E21002,
    E21003,
    E21004,
    E21005,
    E22000,
    E22001,
    E22002,
    E22003,
    E22004,
    E22005,
    E22006,
    E23001,
    E23002,
}
