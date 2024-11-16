const authDomain = "http://localhost:7000"
const userDomain = "http://localhost:3002"
const jobDomain = "http://localhost:5000"
const companyDomain = "http://localhost:3003"

export const ROUTES = [
    // Admin routes should come first (more specific routes)
    {
        url: '/api/v1/admin/company/',  // Changed to exact path
        auth: 'admin',
        proxy: {
            target: `${companyDomain}/api/v1/admin/company`,
            changeOrigin: true,
        }
    },
    {
        url: '/api/v1/admin',  // General admin route
        auth: 'admin',
        proxy: {
            target: `${authDomain}/api/v1/admin`,
            changeOrigin: true,
            pathRewrite: {
                '^/api/v1/admin': ''  // Remove prefix if needed
            },
        }
    },
    
    // Authentication route
    {
        url: '/api/v1/auth',  // Removed trailing slash
        auth: '',
        proxy: {
            target: `${authDomain}/api/v1/auth`,
            changeOrigin: true,
        }
    },
    
    // User routes (less specific routes)

    {
        url: '/api/v1/user/my-company',
        auth: 'user',
        proxy: {
            target: `${companyDomain}/api/v1/user/my-company`,
            changeOrigin: true,
        }
    },
    {
        url: '/api/v1/user/company/token',
        auth: 'user',
        proxy: {
            target: `${companyDomain}/api/v1/user/company/token`,
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
        auth: 'company',
        proxy: {
            target: `${companyDomain}/api/v1/company`,
            changeOrigin: true,
        }
    },
]