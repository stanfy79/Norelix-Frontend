import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { router } from './routes';
import ProviderContext from './context/ProviderContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProviderContext>
        <RouterProvider router={router} />
        <ToastContainer
          newestOnTop
          limit={4}
          pauseOnFocusLoss={false}
          toastClassName={() => 'bg-transparent shadow-none p-0 m-0 overflow-visible'}
          // bodyClassName={() => 'p-0 m-0'}
          className="w-auto max-w-[calc(100vw-24px)]"
        />
      </ProviderContext>
    </QueryClientProvider>
  );
}

export default App;
