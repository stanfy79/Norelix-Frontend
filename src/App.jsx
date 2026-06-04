import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePrivy } from '@privy-io/react-auth';
import { router } from './routes';
import ProviderContext from './context/ProviderContext';
import { FullScreenLoader } from './components/ui/fullscreen-loader';

const queryClient = new QueryClient();

function App() {
  const { ready } = usePrivy();

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ProviderContext>
          <RouterProvider router={router} />
        </ProviderContext>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;