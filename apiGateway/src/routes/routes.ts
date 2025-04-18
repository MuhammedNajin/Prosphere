const authDomain = process.env.authDomain || "http://localhost:7000";
const userDomain = process.env.profileDomain || "http://localhost:3002";
const jobDomain = process.env.jobDomain || "http://localhost:5000";
const companyDomain = process.env.companyDomain || "http://localhost:3003";
const chatDomain = process.env.chatDomain || "http://localhost:8080";
const paymentDomain = process.env.paymentDomain || "http://localhost:3005";
const notificationDomain = process.env.notificationDomain || "http://localhost:4000";

console.log("dhfddddd", userDomain, authDomain, jobDomain);

export const ROUTES = [
  {
    url: "/api/v1/admin/company/",
    auth: "admin",
    proxy: {
      target: `${companyDomain}/api/v1/admin/company`,
      changeOrigin: true,
    },
  },
  {
    url: "/api/v1/admin",
    auth: "admin",
    proxy: {
      target: `${authDomain}/api/v1/admin`,
      changeOrigin: true,
      pathRewrite: {
        "^/api/v1/admin": "",
      },
    },
  },

  {
    url: "/api/v1/auth",
    auth: "",
    proxy: {
      target: `${authDomain}/api/v1/auth`,
      changeOrigin: true,
    },
  },


  {
    url: "/api/v1/user/company",
    auth: "user",
    proxy: {
      target: `${companyDomain}/api/v1/user/company`,
      changeOrigin: true,
    },
  },

  // {
  //     url: '/api/v1/user/company/token',
  //     auth: 'user',
  //     proxy: {
  //         target: `${companyDomain}/api/v1/user/company/token`,
  //         changeOrigin: true,
  //     }
  // },

  {
    url: "/api/v1/profile",
    auth: "user",
    proxy: {
      target: `${userDomain}/api/v1/profile`,
      changeOrigin: true,
    },
  },


  {
    url: "/api/v1/job/company",
    auth: "company",
    proxy: {
      target: `${jobDomain}/api/v1/job/company`,
      changeOrigin: true,
    },
  },
    
  {
    url: "/api/v1/job/company/jobs",
    auth: "subscription",
    proxy: {
      target: `${jobDomain}/api/v1/job/company`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/job/public",
    auth: "",
    proxy: {
      target: `${jobDomain}/api/v1/job/public`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/job",
    auth: "user",
    proxy: {
      target: `${jobDomain}/api/v1/job`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/company",
    auth: "company",
    proxy: {
      target: `${companyDomain}/api/v1/company`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/chat",
    auth: "",
    proxy: {
      target: `${chatDomain}/api/v1/chat`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/payment",
    auth: "",
    proxy: {
      target: `${paymentDomain}/api/v1/payment`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/notifications",
    auth: "",
    proxy: {
      target: `${notificationDomain}/api/v1/notifications`,
      changeOrigin: true,
    },
  },
];
