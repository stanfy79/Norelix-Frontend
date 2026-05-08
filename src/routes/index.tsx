// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Payments from '../pages/Payments';
import ApiKeys from '../pages/ApiKeys';
import Webhooks from '../pages/Webhooks';
import Settings from '../pages/Settings';
import Checkout from '../pages/Checkout';
import Success from '../pages/Success';
import Failed from '../pages/Failed';
import NotFound from '../pages/NotFound';
import Login from '../auth/Login';

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
    element: <Dashboard />,
  },
  {
    path: '/payments',
    element: <Payments />,
  },
  {
    path: '/api-keys',
    element: <ApiKeys />,
  },
  {
    path: '/webhooks',
    element: <Webhooks />,
  },
  {
    path: '/settings',
    element: <Settings />,
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