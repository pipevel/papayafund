"use client"; // Ensure it runs only on the client side

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [stablecoinAddress, setStablecoinAddress] = useState("Fetching...");

  useEffect(() => {
    async function fetchStablecoin() {
      try {
        console.log("Initializing provider...");
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

        console.log("Creating contract instance...");
        const contractAddress = "0xd31d3e1f60552ba8b35aa3bd17c949404fdd12c4";

        const abi =  [{"inputs":[{"internalType":"address","name":"_stablecoin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"donor","type":"address"},{"indexed":false,"internalType":"uint256","name":"causeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DonationReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"causeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"address payable","name":"_recipient","type":"address"}],"name":"addCause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"causeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"causes","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"uint256","name":"totalDonations","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_causeId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"donate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stablecoin","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_causeId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // Debugging: List available functions
        console.log("Contract Functions:", Object.keys(contract));

        console.log("Fetching stablecoin address...");
        const stablecoin = await contract.stablecoin();
        console.log("Stablecoin Address:", stablecoin);
        setStablecoinAddress(stablecoin);
      } catch (error) {
        console.error("Error fetching stablecoin:", error);
        setStablecoinAddress("Error fetching stablecoin");
      }
    }

    fetchStablecoin();
  }, []);

  return (
    <div>
      <h1>Funding Dapp</h1>
      <p>Stablecoin Address: {stablecoinAddress}</p>
    </div>
  );
}
