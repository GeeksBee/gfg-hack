const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const router = express.Router();
const ports = require("./data/ports");
const { getPortById, getPorts } = require("../services/portService");
// router.use(auth);

router.get("/", async (req, res) => {
    return res.send(await getPorts());
});

router.get("/:id", async (req, res) => {
    return res.send(await getPortById(req.params.id));
});

module.exports = router;
