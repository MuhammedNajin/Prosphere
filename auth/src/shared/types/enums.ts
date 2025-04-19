export enum OTP_ERROR_STATE {
     INVALID = 'INVALID',
     EXPIRIED = 'EXPIRED'
}

export enum ROLE {
    USER = 'user',
    ADMIN = 'admin'
}

export enum TOKEN_TYPE {
    USER_ACCESS_TOKEN = 'userAccess',
    USER_REFRESH_TOKEN = 'userRefresh',
    ADMIN_ACCESS_TOKEN = 'adminAccess',
    ADMIN_REFRESH_TOKEN = 'adminRefresh',
    COMPANY_ACCESS_TOKEN = 'companyAccess',
    COMPANY_REFRESH_TOKEN = 'companyRefresh',
} 