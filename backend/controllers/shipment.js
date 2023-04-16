const express = require('express');
const { auth } = require('../middlewares/authMiddleware');
const router = express.Router();

const {
  createShipment,
  getShipmentById,
  getShipments,
  cancelShipment,
  receiveShipment,
  shipToNext,
  verifyHash,
  getPendingShipments,
  getRecievedShipments,
  getCompletedShipments,
  approveShipment,
} = require('../services/shipmentService');
// router.use(auth);

router.post('/', async (req, res) => {
  const result = await createShipment(req.body);
  return res.status(201).send(result);
});

router.get('/', async (req, res) => {
  return res.send(await getShipments());
});

router.get('/:id', async (req, res) => {
  return res.send(await getShipmentById(req.params.id));
});

router.get('/pending/:code', async (req, res) => {
  return res.send(await getPendingShipments(req.params.code));
});

router.get('/recieved/:code', async (req, res) => {
  return res.send(await getRecievedShipments(req.params.code));
});

router.get('/completed/:code', async (req, res) => {
  return res.send(await getCompletedShipments(req.params.code));
});

router.put('/cancel/:id', async (req, res) => {
  try {
    return res.send(await cancelShipment(parseInt(req.params.id)));
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post('/receiveShipment/:id', async (req, res) => {
  return res.send(await receiveShipment(parseInt(req.params.id)));
});

router.post('/approve/:id', async (req, res) => {
  console.log(req.params.id);
  return res.send(await approveShipment(parseInt(req.params.id)));
});

router.post('/shipToNext/:id', async (req, res) => {
  return res.send(await shipToNext(req.params.id, req.body.nextInspector));
});

router.post('/verifyHash', async (req, res) => {
  return res.send(
    await verifyHash(req.body.walletAddress, req.body.id, req.body.nftHash)
  );
});

module.exports = router;
