

const authDomain = "http://localhost:7000"
const userDomain = "http://localhost:3002"
const jobDomain = "http://localhost:5000"
const companyDomain = "http://localhost:3003"

export const ROUTES = [
    {
        url: '/api/v1/auth/',
        auth: '',
        proxy: {
            target: `${authDomain}/api/v1/auth`,
            changeOrigin: true,
        }
    },

    {
        url: '/api/v1/admin/',
        auth: 'admin',
        proxy: {
            target: `${authDomain}/api/v1/admin`,
            changeOrigin: true,
        }
    },


    {
        url: '/api/v1/profile',
        auth: 'user',
        proxy: {
            target: `${userDomain}/api/v1/profile`,
            changeOrigin: true,
        }
    },

    {
        url: '/api/v1/job',
        auth: 'user',
        proxy: {
            target: `${jobDomain}/api/v1/job`,
            changeOrigin: true,
        }
    },

    {
        url: '/api/v1/company',
        auth: 'user',
        proxy: {
            target: `${companyDomain}/api/v1/company`,
            changeOrigin: true,
        }
    },
]
