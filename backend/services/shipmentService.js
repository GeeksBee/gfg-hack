const { PrismaClient } = require('@prisma/client');
const { shipment: Shipment } = new PrismaClient();
const { createHmac } = require('crypto');

const createShipment = async (shipment) => {
  const result = await Shipment.create({
    data: {
      ...shipment,
      ports: [
        {
          location: shipment.origin,
        },
      ],
    },
  });
  console.log(result);
  const hash = createHmac('sha256', 'secret')
    .update(JSON.stringify(result))
    .digest('hex');
  return {
    ...result,
    hash,
    ports: [
      {
        location: shipment.origin,
      },
    ],
  };
};

const getShipments = async () => {
  const result = await Shipment.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  return result;
};

const getShipmentById = async (id) => {
  const result = await Shipment.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return result;
};

const cancelShipment = async (id) => {
  console.log(id);
  const result = await Shipment.update({
    where: {
      id,
    },
    data: {
      status: 'cancelled',
      isCancelled: true,
      cancellationReason: '',
    },
  });
  return result;
};

// receive shipment
const receiveShipment = (id) => {
  return Shipment.update({
    where: {
      id,
    },
    data: {
      status: 'received',
    },
  });
};

const addresses = [
  '0x81ca3152ba96f6df21c5c58e1120a0fe1074bb32',
  '0xca3b46a64b10690c6803ce99591ce74f11935a92',
  '0xe40c56ddfaff79c4434f69cea32c29410a47c7a8',
  '0xc6ab9330f402f027c68e95f75f5119092feb243f',
  '0x20da51a6174a9952fb8a6e9955ffdfa1ecfa7eeb',
  '0x7cf5b4384a530d8d17ac21dd0465897af2ce56c8',
  '0x7e0b9493051671d337492feecb59d73ee2487f6a',
  '0x727b82fc92c2362843a8ea3d75a07b925a413a25',
  '0x30d038789a57708c3d8f16331f8dc5f1db1549d6',
  '0x4d6b2138d65e6108c3ab80bee5951ca9961c2a8e',
];

const verifyHash = async (walletAddress, id, nftHash) => {
  if (addresses.indexOf(walletAddress) == -1) {
    new Error('user not authorized');
  }

  const result = await getShipmentById(id);
  const hash = createHmac('sha256', 'secret').update(result).digest('hex');

  if (hash != nftHash) {
    new Error('hash doesnt match');
  }

  return result;
};

const getPendingShipments = async (code) => {
  console.log(code);

  let shipments = await Shipment.findMany();
  shipments = shipments.filter(
    (i) =>
      i.ports[i.ports.length - 1]?.location == code &&
      !i.ports[i.ports.length - 1]?.clockIn &&
      i.status !== 'completed' &&
      !i.isCancelled
  );
  return shipments;
};

const getRecievedShipments = async (code) => {
  let shipments = await Shipment.findMany();
  shipments = shipments.filter(
    (i) =>
      i.ports[i.ports.length - 1]?.location == code &&
      i.ports[i.ports.length - 1]?.clockIn &&
      !i.ports[i.ports.length - 1]?.clockOut &&
      i.status !== 'cancelled'
  );
  return shipments;
};

const getCompletedShipments = async (code) => {
  console.log(code);
  let shipments = await Shipment.findMany();

  shipments = shipments.filter((i) => {
    for (let y = 0; y < i.ports.length; y++) {
      let x = i.ports[y];
      if (x.location == code) {
        console.log('RAHUL', x, i.status);
      }
      if (
        (x.location == code && x.clockOut) ||
        (x.location == code &&
          (i.status == 'completed' || i.status == 'cancelled'))
      ) {
        return true;
      }
    }
  });
  console.log(shipments);
  return shipments;
};

const approveShipment = async (id) => {
  let shipment = await Shipment.findUnique({
    where: {
      id,
    },
  });
  shipment.ports[shipment.ports.length - 1].clockIn = Date.now();

  const result = await Shipment.update({
    where: {
      id,
    },
    data: {
      ports: shipment.ports,
    },
  });
  return result;
};

const shipToNext = async (id, nextPort) => {
  const shipment = await Shipment.findUnique({
    where: {
      id,
    },
  });
  shipment.ports[shipment.ports.length - 1].clockOut = Date.now();
  shipment.ports.push({
    location: nextPort,
  });
  const result = await Shipment.update({
    where: {
      id,
    },
    data: {
      ports: shipment.ports,
    },
  });
  return result;
};

const completeShipment = async (id) => {
  const shipment = await Shipment.findUnique({
    where: {
      id,
    },
  });
  shipment.ports[shipment.ports.length - 1].clockIn = Date.now();
  const result = await Shipment.update({
    where: {
      id,
    },
    data: {
      ports: shipment.ports,
      status: 'completed',
    },
  });
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  cancelShipment,
  receiveShipment,
  verifyHash,
  getPendingShipments,
  getRecievedShipments,
  getCompletedShipments,
  approveShipment,
  shipToNext,
  completeShipment,
};
