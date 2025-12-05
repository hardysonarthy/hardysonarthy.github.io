'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          {/* Left Section - Title */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold transition-colors cursor-pointer"
              style={{
                fontFamily: "'Metal Mania', cursive",
                letterSpacing: 4,
              }}
            >
              Hardyson Arthy
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                {/* Works link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/works"
                    className="px-4 py-2 text-sm font-medium transition-colors cursor-pointer hover:text-primary"
                  >
                    Works
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Tools dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium transition-colors">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-64 p-3 space-y-1">
                      <li>
                        <NavigationMenuLink
                          href="/tools/json-to-table"
                          className="group block px-4 py-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                        >
                          <div className="font-medium group-hover:text-primary transition-colors">
                            JSON to Type Table
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Convert JSON to typed tables
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/tools/ocr"
                          className="group block px-4 py-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                        >
                          <div className="font-medium group-hover:text-primary transition-colors">
                            OCR Scanner
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Extract text from images
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/tools/qr-code-generator"
                          className="group block px-4 py-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                        >
                          <div className="font-medium group-hover:text-primary transition-colors">
                            QR Code Generator
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Create custom QR codes
                          </div>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button - Visible on mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Visible when open */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              href="/works"
              className="block px-4 py-2 text-base font-medium rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Works
            </Link>

            <div className="px-4 py-2 text-base font-medium text-muted-foreground">
              Tools
            </div>

            <div className="pl-4 space-y-2">
              <Link
                href="/tools/json-to-table"
                className="block px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="font-medium">JSON to Type Table</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Convert JSON to typed tables
                </div>
              </Link>

              <Link
                href="/tools/ocr"
                className="block px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="font-medium">OCR Scanner</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Extract text from images
                </div>
              </Link>

              <Link
                href="/tools/qr-code-generator"
                className="block px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="font-medium">QR Code Generator</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Create custom QR codes
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
