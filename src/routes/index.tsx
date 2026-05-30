// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/protectedRoutes/Dashboard';
import Payments from '../pages/protectedRoutes/Payments';
import Webhooks from '../pages/Webhooks';
import Settings from '../pages/protectedRoutes/Settings';
import Checkout from '../pages/Checkout';
import Success from '../pages/Success';
import Failed from '../pages/Failed';
import NotFound from '../pages/NotFound';
import Login from '../pages/auth/Login';
import WidgetSDK from '../pages/protectedRoutes/WidgetSDK';
import ProtectedRoute from '../ProtectedRoutes/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signin',
    element: <Login />,
  },
  {
    path: '/overview',
    element:
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>,
  },
  {
    path: '/payments',
    element: <Payments />,
  },
  {
    path: '/widget-sdk',
    element: 
    <ProtectedRoute>
      <WidgetSDK />
    </ProtectedRoute>,
  },
  {
    path: '/webhooks',
    element: <Webhooks />,
  },
  {
    path: '/settings',
    element:
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/failed',
    element: <Failed />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
