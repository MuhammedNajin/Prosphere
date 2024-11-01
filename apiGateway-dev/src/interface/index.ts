interface ProxyConfig {
    target: string;
    changeOrigin: boolean;
  }
  
  interface AuthRouteConfig {
    url: string;
    auth: string;
    proxy: ProxyConfig;
  }

  export {
     AuthRouteConfig,
     ProxyConfig,
  }