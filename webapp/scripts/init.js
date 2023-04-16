const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // get all the accounts on the local node
  const accounts = await hre.ethers.getSigners();

  accounts.forEach(async (account, index) => {
    await helpers.setBalance(
      account.address,
      hre.ethers.utils.parseEther("1000000")
    );
    console.log(
      `Account ${index}: ${
        account.address
      }, Balance: ${hre.ethers.utils.formatEther(
        await hre.ethers.provider.getBalance(account.address)
      )} ETH`
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
