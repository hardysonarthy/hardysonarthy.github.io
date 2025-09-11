'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';

export default function NavBar() {
  return (
    <header>
      <nav className="fixed bg-slate-500 inset-x-0 top-0 z-50 bg-transparent">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14 items-center">
            <Link
              href="/"
              className="flex items-center"
              prefetch={false}
              legacyBehavior
            >
              <span className="stext-white">Hardyson Arthy</span>
            </Link>
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[200px] lg:w-[200px] lg:grid-cols-[.75fr_1fr]">
                        <li className="3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex md:w-[100px] lg:w-[100px] lg:grid-cols-[.75fr_1fr]"
                              href="/tools/jsontotable"
                            >
                              <p className="text-sm leading-tight">
                                JSON to Table
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/recipes" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Contact Me
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
