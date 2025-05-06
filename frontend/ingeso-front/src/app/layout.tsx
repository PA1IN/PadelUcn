import React from 'react';
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'reservas',
  description:'sistema de reservas',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  );
}

