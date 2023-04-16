const express = require('express');
// const jwt = require('jsonwebtoken');
const {
  login,
  register,
  updateCompany,
} = require('../services/companyAuthService');
const { companyAuth } = require('../middlewares/authMiddleware');
const ShiftService = require('../services/companyShiftService');
const {
  getIncidents,
  getIncidentById,
  updateIncident,
} = require('../services/incidentService');
const {
  getUserShiftLogs,
  getAllCompanyLogs,
} = require('../services/logService');
const {
  getLateUserShiftsOfCompany,
  getScheduledUserShifts,
  deleteUserShift,
} = require('../services/companyUserShiftService');
const { getCompanyTimesheet } = require('../services/misc');
const { searchUserByString } = require('../services/userService');
const {
  getCompanyLocations,
  createNewLocation,
  updateLocation,
  deleteLocation,
} = require('../services/locationService');
const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////////
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
  const { email, password, name } = req.body;
  try {
    const result = await register(email, password, name);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.use(companyAuth);

router.get('/me', async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router.put('/', async (req, res) => {
  const { id } = req.user;
  try {
    const result = await updateCompany(id, req.body);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////

router.get('/shift/allData', async (req, res) => {
  try {
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.getAllShiftsWithAllData());
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/shift/unsorted', async (req, res) => {
  try {
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.getUnsortedShifts());
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/shift/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.getShiftById(id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/shift', async (req, res) => {
  const { id } = req.params;
  try {
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.getShifts(id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.post('/shift', async (req, res) => {
  const { data, userId } = req.body;
  // console.log(data);
  try {
    const shiftService = new ShiftService(req.user);
    const newShift = await shiftService.createShift(data);
    if (userId) {
      await shiftService.offerShiftToUser(newShift.id, userId);
    }
    return res.send(newShift);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id', async (req, res) => {
  try {
    const { data, userId } = req.body;
    const shiftService = new ShiftService(req.user);
    const updatedShift = await shiftService.updateShift(req.params.id, data);
    return res.send(updatedShift);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/shift/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.deleteShift(id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id/accept/:userId', async (req, res) => {
  let { id, userId } = req.params;

  try {
    id = parseInt(id);
    userId = parseInt(userId);
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.acceptUserShiftApplication(id, userId));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id/offer/:userId', async (req, res) => {
  let { id, userId } = req.params;

  try {
    id = parseInt(id);
    userId = parseInt(userId);
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.offerShiftToUser(id, userId));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id/reject/:userId', async (req, res) => {
  let { id, userId } = req.params;

  try {
    id = parseInt(id);
    userId = parseInt(userId);
    const shiftService = new ShiftService(req.user);
    return res.send(await shiftService.rejectUserShiftApplication(id, userId));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/search/users/:searchString', async (req, res) => {
  const { searchString } = req.params;
  try {
    res.send(await searchUserByString(searchString));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// Usershifts

router.get('/usershift/late', async (req, res) => {
  try {
    return res.send(await getLateUserShiftsOfCompany(req.user.id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/usershift/scheduled', async (req, res) => {
  try {
    return res.send(await getScheduledUserShifts(req.user.id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/usershift/:id', async (req, res) => {
  try {
    return res.send(await deleteUserShift(req.params.id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
// INCIDENTS

router.post('/incident', async (req, res) => {
  try {
    return res.send(await getIncidents(req.user.id, req.body));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/incident/:id', async (req, res) => {
  try {
    return res.send(await getIncidentById(req.params.id));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/incident/:id', async (req, res) => {
  try {
    return res.send(await updateIncident(req.params.id, req.body));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// LOGS
router.get('/log/userShift/:id', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    return res.send(await getUserShiftLogs(id));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/log', async (req, res) => {
  try {
    return res.send(await getAllCompanyLogs(req.user.id));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

//Timesheet

router.post('/timesheet', async (req, res) => {
  try {
    return res.send(await getCompanyTimesheet(req.user.id, req.body));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// Locations

router.get('/location', async (req, res) => {
  try {
    return res.send(await getCompanyLocations(req.user.id));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/location', async (req, res) => {
  try {
    return res.send(await createNewLocation(req.user.id, req.body));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/location/:id', async (req, res) => {
  try {
    return res.send(
      await updateLocation(req.user.id, parseInt(req.params.id), req.body)
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.delete('/location/:id', async (req, res) => {
  try {
    return res.send(await deleteLocation(req.user.id, parseInt(req.params.id)));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
