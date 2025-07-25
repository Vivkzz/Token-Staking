const { ethers } = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy MyToken 
    console.log("\nDeploying MyToken...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    console.log("MyToken deployed to:", await myToken.getAddress());

    // Deploy StakingContract
    console.log("\nDeploying StakingContract...");
    const StakingContract = await ethers.getContractFactory("Staking");
    const stakingContract = await StakingContract.deploy(await myToken.getAddress());
    await stakingContract.waitForDeployment();
    console.log("StakingContract deployed to:", await stakingContract.getAddress());

    console.log("\nMinting tokens for testing...");
    const mintAmount = ethers.parseEther("10000");
    await myToken.mint(deployer.address, mintAmount);
    console.log("Minted 10,000 tokens to deployer");

    console.log("\n=== Deployment Summary ===");
    console.log("MyToken Address:", await myToken.getAddress());
    console.log("StakingContract Address:", await stakingContract.getAddress());
    console.log("Network:", (await (await ethers.provider.getNetwork()).name));
    console.log("Chain ID:", (await (await ethers.provider.getNetwork()).chainId));


    const tokenName = await myToken.name();
    const tokenSymbol = await myToken.symbol();
    const totalSupply = await myToken.totalSupply();

    console.log("\n=== Token Info ===");
    console.log("Name:", tokenName);
    console.log("Symbol:", tokenSymbol);
    console.log("Total Supply:", ethers.formatEther(totalSupply));

    const fs = require('fs');
    const deploymentInfo = {
        networkName: (await (await ethers.provider.getNetwork()).name),
        chainId: (await (await ethers.provider.getNetwork()).chainId).toString(),
        contracts: {
            MyToken: {
                address: await myToken.getAddress(),
                name: tokenName,
                symbol: tokenSymbol
            },
            StakingContract: {
                address: await stakingContract.getAddress()
            }
        },
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
        './deployments.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\nDeployment info saved to deployments.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });