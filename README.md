# EasyShip

EasyShip is a blockchain-based platform for shipment management and monitoring cross-border trade. It is designed for exporters, importers, and trade intermediaries like customs officials, port authorities, and transport vessel companies. The platform uses non-fungible tokens (NFTs) to represent each shipment, with the transfer of the NFT from exporter to importer signifying the transfer of the shipment.
Features

## EasyShip provides the following features:

- Creation of NFTs for each shipment by the exporter
- Transfer of NFTs to an escrow smart contract responsible for getting the NFT signed off by various trade intermediaries and officials
- Transfer of the NFT to the importer after all signing and verification has taken place
- Storage of the SHA256 hash value of the metadata on the NFT for privacy, with authorized parties able to access and verify the data
- Tracking of the shipment with transparency and cross-border consensus established from various authorities, officials, intermediaries, and parties

## Technologies Used

EasyShip is built using the following technologies:

- Ethereum blockchain for smart contracts
- Next.js for the frontend
- Tailwind CSS for styling
- Node.js Express for the backend

## Getting Started

To run EasyShip locally, follow these steps:

1.  Clone this repository
1.  Install the required dependencies by running npm install in both the client and server directories
1.  Start the Hardhat development network by running npx hardhat node
1.  Compile and deploy the smart contracts by running npx hardhat compile followed by npx hardhat deploy --network localhost
1.  Update the contract addresses in client/pages/index.js
1.  Start the server by running npm run dev in the backend directory
1.  Start the client by running npm run dev in the webapp directory
1.  Open http://localhost:3000 in your browser to use the application
