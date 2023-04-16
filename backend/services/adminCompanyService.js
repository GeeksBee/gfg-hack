const { PrismaClient } = require('@prisma/client');

const {
  shift: Shift,
  userShift: UserShift,
  user: User,
  conversation: Conversation,
  company: Company,
} = new PrismaClient();

const findCompanies = async (query) => {
  const { search } = query;
  let companies = [];
  if (search) {
    companies = await Company.findMany({
      where: {
        OR: [{ name: { contains: search, mode: 'insensitive' } }],
      },
      include: {
        _count: {
          select: {
            shifts: true,
          },
        },
      },
    });
    return companies;
  }
  companies = await Company.findMany({
    include: {
      _count: {
        select: {
          shifts: true,
        },
      },
    },
  });
  return companies;
};

const findCompanyById = async (id) => {
  id = parseInt(id);
  const company = await Company.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          shifts: true,
        },
      },
    },
  });
  return company;
};

module.exports = {
  findCompanies,
  findCompanyById,
};
