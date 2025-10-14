const authService = process.env.authService || "http://localhost:3002";
const userService = process.env.userService || "http://localhost:3003";
const jobService = process.env.jobService || "http://localhost:5000";
const companyService = process.env.companyService || "http://localhost:3004";
const chatService = process.env.chatService || "http://localhost:8080";
const paymentService = process.env.paymentService || "http://localhost:3005";
const notificationService = process.env.notificationService || "http://localhost:4000";

console.log("dhfddddd", userService, authService, jobService);

export const ROUTES = [

  {
    url: "/api/v1/admin/job",
    auth: "admin",
    proxy: {
      target: `${jobService}/api/v1/admin/job`,
      changeOrigin: true,
    },
  },


  {
    url: "/api/v1/auth",
    auth: "",
    proxy: {
      target: `${authService}/api/v1/auth`,
      changeOrigin: true,
    },
  },

   {
    url: "/api/v1/users/companies",
    auth: "user",
    proxy: {
      target: `${companyService}/api/v1/users/companies`,
      changeOrigin: true,
    },
  },

  
  

  {
    url: "/api/v1/admin/companies/",
    auth: "admin",
    proxy: {
      target: `${companyService}/api/v1/admin/companies`,
      changeOrigin: true,
    },
  },
 
  {
    url: "/api/v1/admin",
    auth: "admin",
    proxy: {
      target: `${authService}/api/v1/admin`,
      changeOrigin: true,
      pathRewrite: {
        "^/api/v1/admin": "",
      },
    },
  },

  


  {
    url: "/api/v1/companies/user",
    auth: "user",
    proxy: {
      target: `${companyService}/api/v1/companies/user`,
      changeOrigin: true,
    },
  },

  // {
  //     url: '/api/v1/user/company/token',
  //     auth: 'user',
  //     proxy: {
  //         target: `${companyService}/api/v1/user/company/token`,
  //         changeOrigin: true,
  //     }
  // },


  {
    url: "/api/v1/users",
    auth: "user",
    proxy: {
      target: `${userService}/api/v1/users`,
      changeOrigin: true,
    },
  },


  {
    url: "/api/v1/job/company",
    auth: "company",
    proxy: {
      target: `${jobService}/api/v1/job/company`,
      changeOrigin: true,
    },
  },
    
  {
    url: "/api/v1/job/company/jobs",
    auth: "subscription",
    proxy: {
      target: `${jobService}/api/v1/job/company`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/job/public",
    auth: "",
    proxy: {
      target: `${jobService}/api/v1/job/public`,
      changeOrigin: true,
    },
  },
  
  

  {
    url: "/api/v1/job",
    auth: "user",
    proxy: {
      target: `${jobService}/api/v1/job`,
      changeOrigin: true,
    },
  },
  

  {
    url: "/api/v1/companies",
    auth: "company",
    proxy: {
      target: `${companyService}/api/v1/companies`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/chat",
    auth: "",
    proxy: {
      target: `${chatService}/api/v1/chat`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/payment",
    auth: "",
    proxy: {
      target: `${paymentService}/api/v1/payment`,
      changeOrigin: true,
    },
  },

  {
    url: "/api/v1/notifications",
    auth: "",
    proxy: {
      target: `${notificationService}/api/v1/notifications`,
      changeOrigin: true,
    },
  },
];
