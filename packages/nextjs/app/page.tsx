
"use client";

import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import type { NextPage } from "next";
import Link from "next/link";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // 🦊 Connect Wallet & Switch to Polygon Amoy
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        console.log("✅ Connected Wallet:", userAddress);
        setUserAddress(userAddress);
        setIsConnected(true);

        // ✅ Ensure Polygon Amoy is Active
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== 80002) {
          console.log("⚡ Switching to Polygon Amoy...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13882",
                chainName: "Polygon Amoy Testnet",
                nativeCurrency: { name: "Polygon Amoy MATIC", symbol: "MATIC", decimals: 18 },
                rpcUrls: ["https://rpc-amoy.polygon.technology"],
                blockExplorerUrls: ["https://www.oklink.com/amoy"],
              },
            ],
          });
          console.log("✅ Switched to Polygon Amoy!");
        }
      } catch (error) {
        console.error("❌ Error connecting wallet:", error);
        alert("Failed to connect wallet. Please check MetaMask.");
      }
    } else {
      alert("🦊 MetaMask not detected. Please install it.");
    }
  }

  // 💰 Donate Function
  async function donateToCause() {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      console.log(`💰 Donating ${donationAmount} to cause ID ${causeId}...`);
      const tx = await contract.donate(causeId, ethers.parseUnits(donationAmount, 18));
      await tx.wait();

      alert("🎉 Donation successful!");
    } catch (error) {
      console.error("❌ Donation failed:", error);
      alert("Error making donation");
    }
  }

  return (
<<<<<<< HEAD
    <div>
      <h1>🌍 Funding Dapp</h1>
      <p>Stablecoin Address: {stablecoinAddress}</p>
      <p>Your Wallet: {userAddress || "Not connected"}</p>

      {/* 🦊 Connect Wallet Button */}
      <button onClick={connectWallet} style={{ padding: "10px", backgroundColor: "#ff9800", color: "white", border: "none", cursor: "pointer" }}>
        🦊 {isConnected ? "Connected" : "Connect Wallet"}
      </button>

      {/* 💰 Donation Form */}
      <div>
        <h2>Make a Donation</h2>
        <input
          type="number"
          placeholder="Cause ID"
          value={causeId}
          onChange={(e) => setCauseId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount in USDC"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
        />
        <button onClick={donateToCause} style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
          💰 Donate
        </button>
      </div>
    </div>
=======
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Papayafund el sitio que te permitirá recibir financiamiento para tus proyectos</span>
            
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          
<p className="text-center text-lg">
  Get started by editing{" "}
  <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
    packages/nextjs/app/page.tsx
  </code>
</p>
<p className="text-center text-lg">
  Edit your smart contract{" "}
  <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
    YourContract.sol
  </code>{" "}
  in{" "}
  <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
    packages/hardhat/contracts
  </code>
</p>

        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
>>>>>>> parent of 83aefce (8. My front end is displaying the stable coin address!)
  );
};

export default Home;
