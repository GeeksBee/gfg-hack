const { PrismaClient } = require('@prisma/client');
const { user: User, bankDetails: BankDetails } = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (email, password) => {
  const user = await User.findFirstOrThrow({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '365d',
  });
  return { user, token };
};

const register = async (email, password, username) => {
  const user = await User.findFirst({ where: { email } });
  if (user) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    data: {
      email,
      password: hashedPassword,
      name: username,
    },
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '365y',
  });

  const bankDetails = await BankDetails.create({
    data: {
      accountNumber: '',
      accountName: '',
      bsbNumber: '',
      bankName: '',
      taxFileNumber: '',
      superannuationFundName: '',
      superannuationFundNumber: '',
      user: {
        connect: { id: newUser.id },
      },
    },
  });

  await User.update({
    where: {
      id: newUser.id,
    },
    data: {
      bankDetailsId: bankDetails.id,
    },
  });

  return { user: newUser, token };
};

module.exports = {
  login,
  register,
};
