// Contains routes for both UserShift Model as well as User's Shifts
const { PrismaClient } = require('@prisma/client');
const MapsService = require('../services/mapsService');

const {
  shift: Shift,
  userShift: UserShift,
  user: User,
  conversation: Conversation,
  company: Company,
} = new PrismaClient();
const moment = require('moment');

const createNewUserShift = async (shiftId, userId) => {
  const userShift = await UserShift.create({
    data: {
      shiftId,
      userId,
    },
  });
  return userShift;
};

const getAllMyUserShifts = async (userId) => {
  const userShifts = await UserShift.findMany({
    where: {
      userId,
    },
    include: {
      shift: true,
    },
    orderBy: {
      shift: {
        startTime: 'desc',
      },
    },
  });
  return userShifts;
};

const getCurrentShifts = async (userId) => {
  const shifts = await User.findFirst({
    where: {
      id: userId,
    },
    include: {
      currentJobs: {
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const returnData = shifts.currentJobs;
  const shiftIds = returnData.map((x) => x.id);
  const userShifts = await UserShift.findMany({
    where: {
      userId: userId,
      shiftId: {
        in: shiftIds,
      },
    },
  });
  returnData.forEach((shift, i) => {
    if (userShifts.find((x) => x.shiftId === shift.id)) {
      returnData[i].userShift = userShifts.find((x) => x.shiftId === shift.id);
    }
  });
  return returnData.filter(
    (x) => new Date(x.startTime).getTime() - Date.now() > -24 * 60 * 60 * 1000
  );
};

const getUserShiftById = async (userShiftId, userId) => {
  const userShift = await UserShift.findUnique({
    where: {
      id: userShiftId,
    },
    include: {
      shift: true,
    },
  });
  if (!userShift) {
    throw new Error('UserShift not found');
  }
  if (userShift.userId !== userId) {
    throw new Error('UserShift not found');
  }
  return userShift;
};

// SHIFTS
// ## The shift is accepted automatically by the company
const applyToShift = async (shiftId, userId) => {
  let shift = await Shift.findUnique({
    where: {
      id: shiftId,
    },
    include: {
      appliedUsers: true,
      currentUsers: true,
      rejectedUsers: true,
      completedUsers: true,
    },
  });

  const user = await User.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user.isActive) throw new Error('Your Account is not approved yet.');
  if (!shift) {
    throw new Error('Shift not found');
  }
  if (shift.currentUsers.map((x) => x.id).includes(userId)) {
    throw new Error('User already accepted');
  }
  if (shift.appliedUsers.map((x) => x.id).includes(userId)) {
    throw new Error('User already applied');
  }
  if (shift.rejectedUsers.map((x) => x.id).includes(userId)) {
    throw new Error('User already rejected');
  }
  if (shift.completedUsers.map((x) => x.id).includes(userId)) {
    throw new Error('User already completed');
  }

  shift = await Shift.update({
    where: {
      id: shiftId,
    },
    data: {
      currentUsers: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      currentUsers: true,
    },
  });

  const userShift = await createNewUserShift(shiftId, userId);
  return shift;
};

const acceptOfferedShift = async (id, userId) => {
  const check = await Shift.findUnique({
    where: {
      id,
    },
    include: {
      offeredUsers: true,
    },
  });
  if (!check.offeredUsers.map((x) => x.id).includes(userId))
    throw new Error('User not offered');
  const shift = await Shift.update({
    where: {
      id,
    },
    data: {
      offeredUsers: {
        disconnect: {
          id: userId,
        },
      },
      currentUsers: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      offeredUsers: true,
      appliedUsers: true,
      currentUsers: true,
      completedUsers: true,
    },
  });
  const userShift = await createNewUserShift(id, userId);
  return { shift, userShift };
};

const declineOfferedShift = async (id, userId) => {
  const check = await Shift.findUnique({
    where: {
      id,
    },
    include: {
      offeredUsers: true,
    },
  });
  if (!check.offeredUsers.map((x) => x.id).includes(userId))
    throw new Error('User not offered');
  const shift = await Shift.update({
    where: {
      id,
    },
    data: {
      offeredUsers: {
        disconnect: {
          id: userId,
        },
      },
      rejectedUsers: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      offeredUsers: true,
      appliedUsers: true,
      currentUsers: true,
      completedUsers: true,
      rejectedUsers: true,
    },
  });
  return { shift };
};

const checkDistanceBeforeStarting = async (
  userShiftId,
  userId,
  { lat, lng }
) => {
  console.log('Verifying distance', userShiftId, userId, lat, lng);
  console.log('\x1b[0m', 'Verifying distance');
  if (!lat || !lng) {
    throw new Error('Invalid location');
  }
  const userShift = await UserShift.findFirst({
    where: { id: userShiftId },
    include: { shift: true },
  });

  if (!userShift) {
    throw new Error('UserShift not found');
  }

  if (userShift.userId !== userId) {
    throw new Error('UserShift not found');
  }

  if (!userShift.shift.lat || !userShift.shift.lng) {
    throw new Error('Shift location Latitute OR Longitute not set');
  }

  if (userShift.shift.lat === 0 && userShift.shift.lng === 0) {
    throw new Error('Shift location Latitute OR Longitute not set');
  }
  const latLng1 = {
    lat: () => userShift.shift.lat,
    lng: () => userShift.shift.lng,
  };
  const latLng2 = {
    lat: () => lat,
    lng: () => lng,
  };

  const Maps = new MapsService();
  console.log('latLng1', latLng1.lat(), latLng1.lng());
  console.log('latLng2', latLng2.lat(), latLng2.lng());

  const distance = Maps.calculateDistance(latLng1, latLng2);

  console.log('Distance', distance);
  if (distance > 400) {
    return false;
  }

  return 'proceed';
};

const startUserShift = async (userShiftId, userId) => {
  const userShift = await UserShift.findUnique({
    where: {
      id: userShiftId,
    },
    include: {
      shift: true,
    },
  });
  if (!userShift) {
    throw new Error('UserShift not found');
  }
  if (userShift.userId !== userId) {
    throw new Error('UserShift not found');
  }
  if (userShift.active) {
    throw new Error('UserShift already active');
  }
  if (userShift.shift.startTime - new Date() >= 15 * 60 * 1000) {
    throw new Error('Shift has not started yet');
  }

  let isLate = false;
  // 5 minutes late
  if (
    Date.now() - new Date(userShift.shift.startTime).getTime() >=
    5 * 60 * 1000
  ) {
    isLate = true;
  }

  /* 

  #########################################
  
  // If shift is started after or before 4 hours, throw error
  if (
    Math.abs(Date().now - new Date(userShift.shift.startTime).getTime()) >=
    4 * 60 * 60 * 1000
    )
    throw new Error(
      'Shift cannot be started after or before 4 hours of start time'
      );
      
  */

  const updatedUserShift = await UserShift.update({
    where: {
      id: userShiftId,
    },
    data: {
      active: true,
      actualStartTime: new Date(),
      isLate,
    },
    include: {
      shift: true,
    },
  });

  return updatedUserShift;
};

const endUserShift = async (userShiftId, userId) => {
  const userShift = await UserShift.findFirstOrThrow({
    where: {
      id: userShiftId,
      active: true,
    },
    include: {
      shift: true,
    },
  });

  if (userShift.userId !== userId) {
    throw new Error('UserShift not found');
  }
  if (!userShift.active) {
    throw new Error('UserShift not active');
  }

  // if (userShift.shift.endTime > new Date()) {
  //   throw new Error('Shift has not ended yet');
  // }

  const actualStartTime =
    new Date(userShift.actualStartTime).getTime() -
      new Date(userShift.shift.startTime).getTime() >
      0 || new Date(userShift.shift.startTime).getTime() > Date.now()
      ? userShift.actualStartTime
      : userShift.shift.startTime;
  const actualEndTime =
    new Date(userShift.shift.endTime).getTime() - Date.now() < 15 * 60 * 1000
      ? userShift.shift.endTime
      : new Date();

  const updatedUserShift = await UserShift.update({
    where: {
      id: userShiftId,
    },
    data: {
      actualStartTime,
      active: false,
      actualEndTime,
      completed: true,
    },
    include: {
      shift: true,
    },
  });

  const earnings =
    (Math.abs(actualEndTime - actualStartTime) * userShift.shift.hourlyRate) /
    3600000;
  const updateUser = await User.update({
    where: {
      id: userId,
    },
    data: {
      currentJobs: {
        disconnect: {
          id: userShift.shift.id,
        },
      },
      completedJobs: {
        connect: {
          id: userShift.shift.id,
        },
      },
      totalEarnings: {
        increment: earnings,
      },
      totalHours: {
        increment: Math.abs(actualEndTime - actualStartTime) / (1000 * 60 * 60),
      },
    },
  });

  const updateCompany = await Company.update({
    where: {
      id: userShift.shift.companyId,
    },
    data: {
      totalPayments: {
        increment: earnings,
      },
      totalHours: {
        increment: Math.abs(actualEndTime - actualStartTime) / (1000 * 60 * 60),
      },
    },
  });

  return updatedUserShift;
};

const filterAvailableShifts = async (userId, filters) => {
  // TODO--Rahul Implement filters
  const { from, to, lat, lng, radius, shiftTimePreference } = filters;
  let shifts = await Shift.findMany({
    where: {
      startTime: {
        gte: new Date(from),
        lte: new Date(new Date(from).getTime() + 24 * 60 * 60 * 1000),
      },
      offeredUsers: {
        none: {
          id: userId,
        },
      },
      appliedUsers: {
        none: {
          id: userId,
        },
      },
      currentUsers: {
        none: {
          id: userId,
        },
      },
      rejectedUsers: {
        none: {
          id: userId,
        },
      },
      completedUsers: {
        none: {
          id: userId,
        },
      },
    },
  });

  console.log('Found Available Shift Count', shifts.length);

  if (shiftTimePreference == 'day') {
    shifts = shifts.filter((shift) => {
      return shift.startTime.getHours() >= 6 && shift.endTime.getHours() <= 18;
    });
  } else if (shiftTimePreference == 'night') {
    shifts = shifts.filter((shift) => {
      return (
        (shift.startTime.getHours() >= 18 || shift.startTime.getHours() < 6) &&
        (shift.endTime.getHours() >= 18 || shift.endTime.getHours() <= 6)
      );
    });
  }

  if (lat && radius) {
    const mapsService = new MapsService();
    shifts = shifts.filter((shift) => {
      return (
        mapsService.calculateDistance(
          {
            lat: () => lat,
            lng: () => lng,
          },
          {
            lat: () => shift.lat,
            lng: () => shift.lng,
          }
        ) <= radius
      );
    });
  }

  const userShifts = await UserShift.findMany({
    where: {
      userId,
      shift: {
        startTime: {
          gte: new Date(new Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    },
    include: {
      shift: true,
    },
  });

  if (userShifts.length > 0) {
    shifts = shifts.filter((shift) => {
      for (let i = 0; i < userShifts.length; i++) {
        if (
          shift.startTime.getTime() > userShifts[i].shift.startTime.getTime() &&
          shift.startTime.getTime() < userShifts[i].shift.endTime.getTime()
        ) {
          return false;
        }
      }
      return true;
    });
  }

  return shifts;
};

const getOfferedShifts = async (userId) => {
  console.log(userId);
  const shifts = await Shift.findMany({
    where: {
      offeredUsers: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      offeredUsers: true,
    },
  });
  return shifts;
};

const getRecentUserShifts = async (userId) => {
  const userShifts = await UserShift.findMany({
    where: {
      userId,
      shift: {
        startTime: {
          lte: new Date(),
        },
      },
    },
    include: {
      shift: true,
    },
    orderBy: {
      shift: {
        startTime: 'desc',
      },
    },
    take: 5,
  });
  return userShifts;
};

const getUpcomingUserShift = async (userId) => {
  const userShift = await UserShift.findFirst({
    where: {
      userId,
      shift: {
        startTime: {
          gte: new Date(Date.now() - 30 * 60 * 1000),
        },
      },
      completed: false,
      active: false,
    },
    include: {
      shift: true,
    },
    orderBy: {
      shift: {
        startTime: 'desc',
      },
    },
  });
  return userShift;
};

const getCurrentUserShift = async (userId) => {
  const userShift = await UserShift.findFirst({
    where: {
      userId,
      active: true,
    },
    include: {
      shift: true,
    },
  });
  return userShift;
};

const getNextUserShiftIfAny = async (userId) => {
  const userShiftCurrent = await UserShift.findFirst({
    where: {
      userId,
      shift: {
        endTime: {
          gte: moment().subtract(2, 'hours').toDate(),
          lte: moment().add(2, 'hours').toDate(),
        },
      },
    },
    include: {
      shift: true,
    },
  });
  console.log('next current', userShiftCurrent);
  if (!userShiftCurrent) return null;

  const userShiftNext = await UserShift.findFirst({
    where: {
      shift: {
        startTime: {
          gte: moment().subtract(1, 'hours').toDate(),
          lte: moment().add(3, 'hours').toDate(),
        },
        companyId: userShiftCurrent.shift.companyId,
        locationId: userShiftCurrent.shift.locationId,
      },
      userId: {
        not: userId,
      },
    },
    include: {
      shift: true,
    },
  });
  console.log('next', userShiftNext);
  if (
    !userShiftNext ||
    userShiftNext.id == userShiftCurrent.id ||
    userShiftNext.userId == userShiftCurrent.userId
  )
    return null;

  return userShiftNext;
};

const getPrevUserShiftIfAny = async (userId) => {
  const userShiftCurrent = await UserShift.findFirst({
    where: {
      userId,
      shift: {
        startTime: {
          gte: moment().subtract(2, 'hours').toDate(),
          lte: moment().add(2, 'hours').toDate(),
        },
      },
    },
    include: {
      shift: true,
      user: true,
    },
  });

  if (!userShiftCurrent) return null;

  const userShiftNext = await UserShift.findFirst({
    where: {
      shift: {
        endTime: {
          gte: moment().subtract(2, 'hours').toDate(),
          lte: moment().add(2, 'hours').toDate(),
        },
        companyId: userShiftCurrent.shift.companyId,
      },
      userId: {
        not: userId,
      },
    },
    include: {
      shift: true,
      user: true,
    },
  });
  if (
    !userShiftNext ||
    userShiftNext.id == userShiftCurrent.id ||
    userShiftNext.user.id == userShiftCurrent.user.id
  )
    return null;

  return userShiftNext;
};

module.exports = {
  applyToShift,
  acceptOfferedShift,
  declineOfferedShift,
  startUserShift,
  getCurrentShifts,
  endUserShift,
  createNewUserShift,
  getAllMyUserShifts,
  checkDistanceBeforeStarting,
  getUserShiftById,
  filterAvailableShifts,
  getOfferedShifts,
  getRecentUserShifts,
  getCurrentUserShift,
  getUpcomingUserShift,
  getNextUserShiftIfAny,
  getPrevUserShiftIfAny,
};
