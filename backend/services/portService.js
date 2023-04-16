const { PrismaClient } = require("@prisma/client");
const { port: Port } = new PrismaClient();

const getPorts = (skip = 0, limit = 10) => {
    return Port.findMany();
};

const getPortById = (id) => {
    return Port.findUnique(id);
};

module.exports = {
    getPorts,
    getPortById,
};
