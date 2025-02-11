import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

import './globals.css';
import type React from 'react';
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
      </head>
      <body className="dark">
        <NavBar />
        <div className="mt-20 px-2 md:px-14 lg:px-20">{children}</div>
      </body>
    </html>
  );
}
