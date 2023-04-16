const { PrismaClient } = require('@prisma/client');
const { user: User } = new PrismaClient();

const getUser = async (id) => {
  return await User.findUnique({
    where: {
      id,
    },
  });
};

const updateUser = async (id, data) => {
  if (data.height) {
    data.height = parseInt(data.height);
  }

  return await User.update({
    where: {
      id,
    },
    data,
  });
};

const getDetailedUserById = async (id) => {
  console.log(id);
  return User.findUnique({
    where: {
      id,
    },
    include: {
      appliedJobs: true,
      currentJobs: true,
      rejectedJobs: true,
      completedJobs: true,
      offeredJobs: true,
      userShifts: true,
      bankDetails: true,
    },
  });
};

const searchUserByString = async (searchString) => {
  return User.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchString,
          },
        },
        {
          email: {
            contains: searchString,
          },
        },
      ],
    },
  });
};

module.exports = {
  getDetailedUserById,
  updateUser,
  getUser,
  searchUserByString,
};
