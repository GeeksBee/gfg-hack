const express = require('express');
const { PrismaClient } = require('@prisma/client');

const {
  user: User,
  company: Company,
  shift: Shift,
  userShift: UserShift,
  admin: Admin,
} = new PrismaClient();

const { login, register } = require('../services/adminAuth');

const {
  findGuardDocuments,
  findSecurityGuards,
  approveGuardDocument,
} = require('../services/adminGuardService');

const {
  findCompanies,
  findCompanyById,
} = require('../services/adminCompanyService');
const { createTimesheet, getCompanyTimesheet } = require('../services/misc');
const {
  createAdminTimesheetPage,
  deApprovePaymentUserShift,
  approvePaymentUserShift,
} = require('../services/adminMisc');
const { adminAuth } = require('../middlewares/authMiddleware');
const { updateUser } = require('../services/userService');

const router = express.Router();

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message, err });
  }
});

router.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await register(email, password);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.use(adminAuth);

router.get('/profile', async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router.put('/profile', async (req, res) => {
  const { id } = req.user;

  const data = req.body;
  console.log(data);
  try {
    const admin = await Admin.update({
      where: { id },
      data,
    });
    return res.send(admin);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// ADMIN - GUARD
router.get('/security-guard', async (req, res) => {
  try {
    const result = await findSecurityGuards(req.query);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/security-guard/:id', async (req, res) => {
  try {
    return res.send(
      await User.findFirst({
        where: {
          id: parseInt(req.params.id),
        },
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/security-guard/:id', async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const updatedUser = await updateUser(id, req.body);
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/security-guard/:id/timesheet', async (req, res) => {
  let { id } = req.params;
  const { timestamp } = req.body;
  try {
    id = parseInt(id);
    const result = await createTimesheet(id, timestamp);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/documents/approve/:id', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await approveGuardDocument(id);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/documents/guard/:id', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await findGuardDocuments(id);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// ADMIN - Company
router.get('/company', async (req, res) => {
  try {
    const result = await findCompanies(req.query);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/company/:id', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await findCompanyById(id);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/company/:id/timesheet', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await getCompanyTimesheet(id, req.body);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/page/timesheet', async (req, res) => {
  try {
    const { timestamp } = req.body;
    const result = await createAdminTimesheetPage(timestamp);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/usershifts', async (req, res) => {
  try {
    let { timestamp } = req.body;
    console.log(timestamp);
    timestamp = parseInt(timestamp);
    if (!timestamp) {
      console.log('timestamp is not valid', { timestamp });
      return res.status(400).json({ message: 'Invalid timestamp' });
    }

    const result = await UserShift.findMany({
      where: {
        shift: {
          startTime: {
            gte: new Date(timestamp),
            lte: new Date(timestamp + 7 * 24 * 3600 * 1000),
          },
        },
        OR: [
          {
            completed: true,
          },
          {
            active: true,
          },
        ],
      },
      include: {
        user: true,
        shift: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        shift: {
          startTime: 'desc',
        },
      },
    });
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/usershifts/:id/approve', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await approvePaymentUserShift(id);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/usershifts/:id/deapprove', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    const result = await deApprovePaymentUserShift(id);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// VERY SUPER ROUTES for Testing Puropses
router.get('/super/user', async (req, res) => {
  const result = await User.findMany();
  return res.send(result);
});

router.get('/super/company', async (req, res) => {
  const result = await Company.findMany();
  return res.send(result);
});

router.get('/super/shift', async (req, res) => {
  const result = await Shift.findMany();
  return res.send(result);
});

router.get('/super/user-shift', async (req, res) => {
  const result = await UserShift.findMany();
  return res.send(result);
});

module.exports = router;
