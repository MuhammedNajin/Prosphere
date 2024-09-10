import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './redux/store.tsx'
import { QueryClientProvider , QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
    },
  },
})
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='884141115056-o3pkeqli515ugoohn2qbpqasc723q90p.apps.googleusercontent.com'> 
<StrictMode>
     <QueryClientProvider client={queryClient}>
     <Provider store={store}>
         <App />
        </Provider>
     </QueryClientProvider>
  </StrictMode>
  </GoogleOAuthProvider>
  ,
)
