export enum OTP_ERROR_STATE {
     INVALID = 'INVALID',
     EXPIRIED = 'EXPIRED'
}

export enum ROLE {
    USER = 'user',
    ADMIN = 'admin'
}

export enum TOKEN_TYPE {
    ACCESS_TOKEN = 'accessToken',
    REFRESH_TOKEN = 'refreshToken',
    COMPANY_ACCESS_TOKEN = 'companyAccess',
    COMPANY_REFRESH_TOKEN = 'companyRefresh',
} 