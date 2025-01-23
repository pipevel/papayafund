"use client"; // Ensure it runs only on the client side

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [stablecoinAddress, setStablecoinAddress] = useState("Fetching...");
  const [userAddress, setUserAddress] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [causeId, setCauseId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Contract Details
  const contractAddress = "0xd31d3e1f60552ba8b35aa3bd17c949404fdd12c4";
  const abi = [ // 🔹 Your ABI here
    {"inputs":[{"internalType":"address","name":"_stablecoin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[],"name":"stablecoin","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_causeId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"donate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  ];

  // 🚀 Fetch Stablecoin Address from Contract
  useEffect(() => {
    async function fetchStablecoin() {
      try {
        console.log("Initializing provider...");
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
        const contract = new ethers.Contract(contractAddress, abi, provider);

        console.log("Fetching stablecoin address...");
        const stablecoin = await contract.stablecoin();
        console.log("Stablecoin Address:", stablecoin);
        setStablecoinAddress(stablecoin);
      } catch (error) {
        console.error("❌ Error fetching stablecoin:", error);
        setStablecoinAddress("Error fetching stablecoin");
      }
    }
    fetchStablecoin();
  }, []);

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
        if (network.chainId !== 80002) {
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
  );
}
