'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Navbar = () => {
  return (
    <header className="py-3 px-6 flex justify-between items-center">
      <Link
        href="/"
        className="flex items-center space-x-2 cursor-pointer text-xl font-bold text-gray-900 dark:text-white"
      >
        Hardyson Arthy
      </Link>

      <nav>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            {/* Works link */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/works"
                className="cursor-pointer hover:text-primary transition"
              >
                Works
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Tools dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col p-2">
                  <li>
                    <NavigationMenuLink
                      href="/tools/json-to-table"
                      className="block px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      JSON to Table
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="/tools/ocr"
                      className="block px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ocr
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
};

export default Navbar;
