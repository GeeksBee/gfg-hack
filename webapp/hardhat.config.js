require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey:
            "f934b9ceaf7bd4cb4080e0eb583eb9f818c48496d4df592dfedcfed85bcaa686",
          balance: "1000000",
        },
        {
          privateKey:
            "fec36070a5270a5b0d776526a5ab18b8baee47e05873af200b3798d863cd7c10",
          balance: "1000000",
        },
        {
          privateKey:
            "cb5838b6986cef199176849008fdc057c5c09372776b8460d6b428ea33138c90",
          balance: "1000000",
        },
        {
          privateKey:
            "a1b0b5510f0f4eb90f9822cbcf67c66e9658e89241f272ad1284e2db28de8bcb",
          balance: "1000000",
        },
      ],
    },
  },
};
