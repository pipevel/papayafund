"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

// Define the menu items
type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          Papaya_Funding
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {menuLinks.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className={`px-4 py-2 ${isActive ? "font-bold text-blue-600" : "text-gray-700"}`}>
                <Link href={href} className="flex items-center gap-2 hover:text-blue-500">
                  {icon && <span>{icon}</span>}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Wallet Connect + Faucet Button */}
        <div className="hidden md:flex gap-3">
          <FaucetButton />
          <RainbowKitCustomConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg p-4">
          <ul className="space-y-4">
            {menuLinks.map(({ label, href, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href} className={`px-4 py-2 ${isActive ? "font-bold text-blue-600" : "text-gray-700"}`}>
                  <Link href={href} className="flex items-center gap-2 hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>
                    {icon && <span>{icon}</span>}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col items-center gap-3">
            <FaucetButton />
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      )}
    </header>
  );
};
