const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { user: User, company: Company, admin: Admin } = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.id) {
      console.log({ decoded });
      throw new Error();
    }
    const user = await User.findFirst({ where: { id: decoded.id } });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    console.log('User Middleware: ', user.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Please authenticate user.' });
  }
};

const companyAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Company.findFirst({ where: { id: decoded.id } });
    console.log(user);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    console.log('Company Middleware: ', user.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Please authenticate company.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Admin.findFirst({ where: { id: decoded.id } });
    console.log(user);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    console.log('ADMIN Middleware: ', user.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Please authenticate admin.' });
  }
};

module.exports = {
  auth,
  companyAuth,
  adminAuth,
};
