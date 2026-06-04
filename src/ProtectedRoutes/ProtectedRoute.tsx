import { Navigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();

  if(!ready) {
    return null
  }

  if (!authenticated) return <Navigate to="/signin" replace />;

  return children;
};

export default ProtectedRoute;