// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProveedorAuth } from '@/context/AuthContext';
import { ReactNode, useState } from 'react';
import { ToastProvider } from "@/components/ui/toast";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ProveedorAuth>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ProveedorAuth>
    </QueryClientProvider>
  );
}
