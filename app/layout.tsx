import type React from 'react';
import './globals.css';
import NavBar from './components/shared/navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta title="Hardyson Arthy Robin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hardyson Arthy anak Robin</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Cutive+Mono&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Metal+Mania&display=swap');
        </style>
      </head>
      <body className="dark min-h-screen">
        <NavBar />
        <main className="pt-20 md:pt-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
