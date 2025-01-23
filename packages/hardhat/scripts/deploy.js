const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  // Dirección de una stablecoin en testnet (por ejemplo, USDC en Goerli)
  const stablecoinAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"; 

  const Funding = await ethers.getContractFactory("Funding");
  const funding = await Funding.deploy(stablecoinAddress);
  await funding.waitForDeployment();

  console.log("Funding contract deployed at:", await funding.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
