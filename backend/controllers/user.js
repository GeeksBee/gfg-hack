const express = require('express');
const { auth } = require('../middlewares/authMiddleware');
const { createIncident } = require('../services/incidentService');
const {
  applyToShift,
  acceptOfferedShift,
  getOfferedShifts,
  getCurrentShifts,
  getAllMyUserShifts,
  getUserShiftById,
  filterAvailableShifts,
  getRecentUserShifts,
  getCurrentUserShift,
  startUserShift,
  endUserShift,
  declineOfferedShift,
  getUpcomingUserShift,
  checkDistanceBeforeStarting,
} = require('../services/userShiftService');
const {
  getUserShiftLogs,
  createNewLog,
  getAllUserLogs,
} = require('../services/logService');
const {
  getUser,
  updateUser,
  getDetailedUserById,
} = require('../services/userService');
const { createTimesheet, getStatistics } = require('../services/misc');
const {
  getLicenses,
  createLicense,
  updateLicense,
} = require('../services/licenseService');
const {
  getBankDetail,
  createBankDetail,
  updateBankDetail,
} = require('../services/bankDetailService');
const MapsService = require('../services/mapsService');

const router = express.Router();

// Middlewares
router.use(auth);

router.get('/me', async (req, res) => {
  try {
    const user = await getDetailedUserById(req.user.id);
    console.log(Date.now());
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/me/new', async (req, res) => {
  try {
    return res.send(req.user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/shift/:id/apply', async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.user;
  try {
    id = parseInt(id);
    userId = parseInt(userId);

    return res.send(await applyToShift(id, userId));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id/accept', async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.user;
  try {
    id = parseInt(id);
    userId = parseInt(userId);

    return res.send(await acceptOfferedShift(id, userId));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/shift/:id/decline', async (req, res) => {
  let { id } = req.params;
  let { id: userId } = req.user;
  try {
    id = parseInt(id);
    userId = parseInt(userId);

    return res.send(await declineOfferedShift(id, userId));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id } = req.user;
    const updatedUser = await updateUser(id, req.body);
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/shift/available', async (req, res) => {
  try {
    let filters = req.body;
    if (!filters) {
      filters = {};
    }
    // shiftTimePreference is 'day', 'night', or 'both'
    const { from, to, shiftTimePreference, location, radius } = filters;
    console.log(filters);
    const { id: userId } = req.user;
    const shifts = await filterAvailableShifts(userId, filters);
    return res.send(shifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/shift/offered', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const shifts = await getOfferedShifts(userId);
    return res.send(shifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/shift/current', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const shifts = await getCurrentShifts(userId);
    return res.send(shifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// UserShift

router.get('/userShift/', async (req, res) => {
  try {
    return res.send(await getAllMyUserShifts(req.user.id));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/userShift/recent', async (req, res) => {
  try {
    const userShifts = await getRecentUserShifts(req.user.id);
    return res.send(userShifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/userShift/upcoming', async (req, res) => {
  try {
    const userShifts = await getUpcomingUserShift(req.user.id);
    return res.send(userShifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/userShift/current', async (req, res) => {
  try {
    const userShifts = await getCurrentUserShift(req.user.id);
    return res.send(userShifts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get('/userShift/:id', async (req, res) => {
  try {
    return res.send(
      await getUserShiftById(parseInt(req.params.id), req.user.id)
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post('/userShift/:id/verifydistance', async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    const { lat, long: lng } = req.body;
    const bool = await checkDistanceBeforeStarting(id, req.user.id, {
      lat,
      lng,
    });
    return res.json(bool);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/userShift/:id/start', async (req, res) => {
  try {
    // Set start time
    // Mark late if started late
    // Make active true
    let { id } = req.params;
    console.log('reached here');
    id = parseInt(id);
    const startedShift = await startUserShift(id, req.user.id);
    return res.send(startedShift);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.put('/userShift/:id/end', async (req, res) => {
  try {
    // Set end time
    // Make active false
    let { id } = req.params;
    id = parseInt(id);
    const endedShift = await endUserShift(id, req.user.id);
    // TODO--Rahul
    // Transfer Funds
    return res.send(endedShift);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// Logs
router.get('/log', async (req, res) => {
  try {
    let { id } = req.params;
    const logs = await getAllUserLogs(id);
    return res.send(logs);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

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

router.post('/log/userShift/:id', async (req, res) => {
  let { id } = req.params;
  const data = req.body;
  const { id: userId } = req.user;
  try {
    id = parseInt(id);

    return res.json(await createNewLog(id, userId, data));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// Incidents

router.post('/incident', async (req, res) => {
  try {
    console.log(req.body);
    let incident = req.body;
    incident.timeOfIncident = new Date(incident.timeOfIncident);
    incident.dateOfBirth = new Date(incident.dateOfBirth);

    return res.send(await createIncident({ ...incident }));
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

// Timesheet Page for Mobile App
router.post('/timesheet', async (req, res) => {
  try {
    let { timestamp } = req.body;
    timestamp = parseInt(timestamp);
    const timesheet = await createTimesheet(req.user.id, timestamp);
    return res.send(timesheet);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

// Licenses
router.get('/licenses', async (req, res) => {
  try {
    const licenses = await getLicenses(req.user.id);
    return res.send(licenses);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.put('/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newLicense = await updateLicense(req.user.id, id, req.body);
    return res.send(newLicense);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.post('/licenses', async (req, res) => {
  try {
    const newLicense = await createLicense(req.user.id, req.body);
    return res.send(newLicense);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

// Statistics
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await getStatistics(req.user.id);
    return res.send(statistics);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

// Bank Details
router.get('/bankDetail', async (req, res) => {
  try {
    const bankDetails = await getBankDetail(req.user.id);
    return res.json(bankDetails);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.post('/bankDetail', async (req, res) => {
  try {
    const bankDetails = await createBankDetail(req.user.id, req.body);
    return res.json(bankDetails);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.put('/bankDetail', async (req, res) => {
  try {
    const bankDetails = await updateBankDetail(req.user.id, req.body);
    return res.json(bankDetails);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.get('/geocode/:lat/:lng', async (req, res) => {
  try {
    const mapsService = new MapsService();
    const result = await mapsService.getAddressFromGeocode(
      req.params.lat,
      req.params.lng
    );
    return res.json(result);
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.get('/geocode/:lat/:lng/save', async (req, res) => {
  try {
    const mapsService = new MapsService();
    const result = await mapsService.getAddressFromGeocode(
      req.params.lat,
      req.params.lng
    );
    console.log(result);
    if (result) {
      const updatedUser = await updateUser(req.user.id, { address: result });
      return res.json(updatedUser);
    }
    return null;
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.get('/geocode-state/:lat/:lng/save', async (req, res) => {
  try {
    const mapsService = new MapsService();
    const result = await mapsService.findStateFromGeocode(
      req.params.lat,
      req.params.lng
    );
    if (result && !req.user.code) {
      const updatedUser = await updateUser(req.user.id, {
        code: result + req.user.licenceNumber,
      });
      return res.json(updatedUser);
    }
    return null;
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  try {
    id = parseInt(id);
    console.log({ id });
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const user = await getUser(id);
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
