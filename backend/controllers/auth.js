const express = require("express");
// const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");

const { login, register } = require("../services/authService");
const prisma = require("../utils/prisma");

// const { user } = new PrismaClient();
const router = express.Router();

const catchErrors = () => {};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message, err });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await register(email, password, username);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.get("/me", async (req, res) => {
  const { user } = req;
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
