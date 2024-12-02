import { createBrowserRouter } from 'react-router-dom';
import { userRoute } from './routes/userRoute';
import { adminRoute } from './routes/adminRoute';
import { companyRoute } from './routes/companyRoute';
import { authRoute } from './routes/authRoute';
import { TestRoute } from './routes/test'

const routes = createBrowserRouter([
    userRoute,
    adminRoute,
    authRoute,
    ...companyRoute,
    TestRoute
]);

export { routes };