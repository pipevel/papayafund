
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Funding Contract", function () {
  let Funding, funding, stablecoin, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const parseUnits = ethers.parseUnits || ethers.utils.parseUnits;

    // 🔹 Desplegar un contrato ERC-20 Mock (Stablecoin)
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    stablecoin = await ERC20Mock.deploy("Test USDC", "tUSDC", owner.address, parseUnits("10000", 18));
    await stablecoin.waitForDeployment();

    console.log("Stablecoin Mock deployed at:", await stablecoin.getAddress());

    // 🔹 Desplegar el contrato Funding
    const FundingFactory = await ethers.getContractFactory("Funding"); // 🔹 Asegúrate de que el nombre coincide con el contrato
    funding = await FundingFactory.deploy(await stablecoin.getAddress());
    await funding.waitForDeployment();

    console.log("Funding Contract deployed at:", await funding.getAddress());
  });

  it("Debe permitir al owner agregar causas de financiamiento", async function () {
    await funding.addCause("Reforestación Cali", addr1.address);
    const cause = await funding.causes(0);
    expect(cause.name).to.equal("Reforestación Cali");
    expect(cause.recipient).to.equal(addr1.address);
  });
});
