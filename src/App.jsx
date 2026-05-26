import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import ProviderContext from './context/ProviderContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProviderContext>
        <RouterProvider router={router} />
      </ProviderContext>
    </QueryClientProvider>
  );
}

export default App;