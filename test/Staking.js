const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking dApp", function () {
    let myToken, stakingContract;
    let owner, user1, user2;
    const INITIAL_BALANCE = ethers.parseEther("1000");
    const STAKE_AMOUNT = ethers.parseEther("100");

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy();
        await myToken.waitForDeployment();

        const StakingFactory = await ethers.getContractFactory("Staking");
        stakingContract = await StakingFactory.deploy(await myToken.getAddress());
        await stakingContract.waitForDeployment();

        await myToken.mint(await user1.getAddress(), INITIAL_BALANCE);
        await myToken.mint(await user2.getAddress(), INITIAL_BALANCE);

        await myToken.connect(user1).approve(await stakingContract.getAddress(), ethers.MaxUint256);
        await myToken.connect(user2).approve(await stakingContract.getAddress(), ethers.MaxUint256);
    });

    describe("MyToken", function () {
        it("Should have correct name and symbol", async function () {
            expect(await myToken.name()).to.equal("MyToken");
            expect(await myToken.symbol()).to.equal("MYT");
        });

        it("Should mint initial supply to owner", async function () {
            const initialSupply = ethers.parseEther("1000000");
            expect(await myToken.balanceOf(await owner.getAddress())).to.equal(initialSupply);
        });

        it("Should allow owner to mint tokens", async function () {
            const mintAmount = ethers.parseEther("500");
            const initialUser1Balance = await myToken.balanceOf(await user1.getAddress());
            await myToken.mint(await user1.getAddress(), mintAmount);
            expect(await myToken.balanceOf(await user1.getAddress())).to.equal(initialUser1Balance + mintAmount);
        });

        //As i moved token to work as faucet 
        // it("Should not allow non-owner to mint tokens", async function () {
        //     const mintAmount = ethers.parseEther("500");
        //     await expect(
        //         myToken.connect(user1).mint(await user2.getAddress(), mintAmount)
        //     ).to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount");
        // });
    });

    describe("StakingContract", function () {
        it("Should have correct token address", async function () {
            expect(await stakingContract.stakingToken()).to.equal(await myToken.getAddress());
        });


        it("Should start with zero total staked", async function () {
            expect(await stakingContract.getContractBalance()).to.equal(0);
        });


        describe("Staking", function () {
            it("Should allow users to stake tokens", async function () {
                expect(await myToken.balanceOf(await user1.getAddress())).to.equal(INITIAL_BALANCE);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(0);

                await expect(stakingContract.connect(user1).stake(STAKE_AMOUNT))
                    .to.emit(stakingContract, "Staked")
                    .withArgs(await user1.getAddress(), STAKE_AMOUNT);

                expect(await myToken.balanceOf(await user1.getAddress())).to.equal(INITIAL_BALANCE - STAKE_AMOUNT);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(STAKE_AMOUNT);

            });

            it("Should revert when staking zero amount", async function () {
                await expect(
                    stakingContract.connect(user1).stake(0)
                ).to.be.revertedWithCustomError(stakingContract, "NullAmount");
            });

            it("Should revert when staking more than balance", async function () {
                const excessiveAmount = INITIAL_BALANCE + 1n;
                await expect(
                    stakingContract.connect(user1).stake(excessiveAmount)
                ).to.be.revertedWithCustomError(stakingContract, "InsufficientBalance");
            });

            it("Should revert when staking without approval", async function () {
                const [, , , user3] = await ethers.getSigners();
                await myToken.mint(await user3.getAddress(), INITIAL_BALANCE);

                await expect(
                    stakingContract.connect(user3).stake(STAKE_AMOUNT)
                ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientAllowance");
            });

            it("Should handle multiple users staking", async function () {
                await stakingContract.connect(user1).stake(STAKE_AMOUNT);
                const user2StakeAmount = STAKE_AMOUNT * 2n;
                await stakingContract.connect(user2).stake(user2StakeAmount);

                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(STAKE_AMOUNT);
                expect(await stakingContract.getTokenBalance(await user2.getAddress())).to.equal(user2StakeAmount);
            });
        });

        describe("Unstaking", function () {
            beforeEach(async function () {
                await stakingContract.connect(user1).stake(STAKE_AMOUNT);
            });

            it("Should allow users to unstake tokens", async function () {
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(STAKE_AMOUNT);

                await expect(stakingContract.connect(user1).unstake(STAKE_AMOUNT))
                    .to.emit(stakingContract, "Unstaked")
                    .withArgs(await user1.getAddress(), STAKE_AMOUNT);

                expect(await myToken.balanceOf(await user1.getAddress())).to.equal(INITIAL_BALANCE);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(0);
            });

            it("Should allow partial unstaking", async function () {
                const partialAmount = STAKE_AMOUNT / 2n;
                await stakingContract.connect(user1).unstake(partialAmount);

                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(STAKE_AMOUNT - partialAmount);
                expect(await myToken.balanceOf(await user1.getAddress())).to.equal(INITIAL_BALANCE - STAKE_AMOUNT + partialAmount);
            });

            it("Should revert when unstaking zero amount", async function () {
                await expect(
                    stakingContract.connect(user1).unstake(0)
                ).to.be.revertedWithCustomError(stakingContract, "NullAmount");
            });

            it("Should revert when unstaking more than staked", async function () {
                const excessiveAmount = STAKE_AMOUNT + 1n;
                await expect(
                    stakingContract.connect(user1).unstake(excessiveAmount)
                ).to.be.revertedWithCustomError(stakingContract, "InsufficientBalance");
            });

            it("Should revert when unstaking with no staked balance", async function () {
                await expect(
                    stakingContract.connect(user2).unstake(STAKE_AMOUNT)
                ).to.be.revertedWithCustomError(stakingContract, "InsufficientBalance");
            });
        });

        describe("View Functions", function () {
            it("Should return correct staked balance", async function () {

                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(0);

                await stakingContract.connect(user1).stake(STAKE_AMOUNT);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(STAKE_AMOUNT);
            });
        });

        describe("Edge Cases", function () {
            it("Should handle multiple stake and unstake operations", async function () {
                const amount1 = ethers.parseEther("50");
                const amount2 = ethers.parseEther("30");

                await stakingContract.connect(user1).stake(amount1);
                await stakingContract.connect(user1).stake(amount2);

                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(amount1 + amount2);

                await stakingContract.connect(user1).unstake(amount1);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(amount2);

                await stakingContract.connect(user1).unstake(amount2);
                expect(await stakingContract.getTokenBalance(await user1.getAddress())).to.equal(0);
            });
        });
    });
});