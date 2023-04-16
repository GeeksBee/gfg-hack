const { PrismaClient } = require("@prisma/client");
const { checkout } = require("../app");
const prisma = new PrismaClient();

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function get_random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const ports = require("./data/ports.json");

async function flush() {
  await prisma.port.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  const addresses = [
    "0xe774105aA50E175BF4b3FfCEf237820eC7848B61",
    "0x3a664915019f0bA72D58F521C4afeA3b7E5c752b",
    "0x2784f568dCa62A6bB594B6cbf94E3Eb7577f5daE",
    "0x2bdE7c5fbA0Fd8221E50dD39e3020805a3fC9e5A",
  ];

  await flush();

  const users = await prisma.user.createMany({
    data: [
      {
        address: addresses[0],
        name: "Exporter IN",
        role: "PARTY",
      },
      {
        address: addresses[1],
        name: "Importer SA",
        role: "PARTY",
      },
      {
        address: addresses[2],
        name: "PORT AUTHORITY IN",
        role: "INTERMEDIARY",
      },
      {
        address: addresses[3],
        name: "PORT AUTHORITY SA",
        role: "INTERMEDIARY",
      },
    ],
  });

  console.log(users);

  const portsInDB = await prisma.port.createMany({
    data: [
      ...Object.keys(ports).map((key) => ({
        code: key,
        name: ports[key].name,
        city: ports[key].city,
        country: ports[key].country,
      })),
    ],
  });

  console.log(portsInDB);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
