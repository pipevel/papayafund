"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

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

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * 🦊 Function to Add & Switch to Polygon Amoy Testnet in Metamask
 */
const switchToPolygonAmoy = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      console.log("Current Network:", network.chainId);

      if (network.chainId !== 80002) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13882",
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-amoy.polygon.technology"],
              blockExplorerUrls: ["https://www.oklink.com/amoy"],
            },
          ],
        });

        console.log("✅ Switched to Polygon Amoy!");
      } else {
        console.log("Already on Polygon Amoy");
      }

      await connectWallet(); // Auto-connect after switching
    } catch (error) {
      console.error("❌ Failed to switch to Polygon Amoy:", error);
    }
  } else {
    alert("❌ Metamask not detected. Please install it.");
  }
};

/**
 * 🔗 Function to Connect Metamask & Fetch Wallet Address
 */
const connectWallet = async (setUserAddress) => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log("✅ Connected Wallet:", userAddress);
      setUserAddress(userAddress);

      alert(`✅ Connected: ${userAddress}`);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
      alert("❌ Failed to connect wallet. Please check Metamask.");
    }
  } else {
    alert("❌ Metamask is not installed. Please install Metamask.");
  }
};

/**
 * 🏗️ Site Header Component
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAddress, setUserAddress] = useState(""); // Store Wallet Address
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <p className="text-sm mr-2">
          Wallet: {userAddress ? userAddress : "Not Connected"}
        </p>
        <button className="btn btn-primary mr-2" onClick={switchToPolygonAmoy}>
          🦊 Connect Polygon Amoy
        </button>
        <button className="btn btn-secondary" onClick={() => connectWallet(setUserAddress)}>
          🔗 Connect Wallet
        </button>
      </div>
    </div>
  );
};
