const express = require("express")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const token_sec = ("mynameiszuha@b")
const router = express.Router()
const UserSchema = require("../Models/UserSchema")


// ROUTE NO 1 TO CREATE A USER IN DATABASE
router.post("/createuser", [
  body('email', 'Enter a valid email').isEmail(),
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    let user = await UserSchema.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: "Sorry A User With This Already Email Exist" })
    }
    const salt = await bcrypt.genSalt(10)
    const sec = await bcrypt.hash(req.body.password, salt)
    user = await UserSchema.create({
      name: req.body.name,
      email: req.body.email,
      password: sec
    })
    const data = {
      user: { id: user.id }
    }
    const authtoken = jwt.sign(data, token_sec)
    console.log(authtoken)
    res.json({ authtoken: authtoken })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// ROUTE NO 2 TO GET A USER FROM DATABASE
router.get("/", async (_req, res) => {
  try {
    const user = await UserSchema.find()
    res.status(200).send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// ROUTE NO 3 TO LOGIN A USER FROM DATABASE
router.post("/login", [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be black').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email, password } = req.body;
  try {
    let user = await UserSchema.findOne({ email })
    if (!user) { return res.status(400).json({ error: "Please try to Login Correctly" }) }
    const passwordcompare = await bcrypt.compare(password, user.password)
    if (!passwordcompare) {
      return res.status(400).json({ error: "Please try to Login Correctly" })
    }
    const data = {
      user: { id: user.id }
    }
    const authtoken = jwt.sign(data, token_sec)
    res.json({ authtoken: authtoken })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// ROUTE NO 4 TO GET A USER FROM DATABASE BY ID
router.post("/", fetchuser, async (req, res) => {
  try {
    userId = req.user.id
    const user = await UserSchema.findById(userId).select("-password")
    console.log(user)
    res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// ROUTE NO 5 TO UPDATE A USER INFORMATION FROM DATABASE BY ID
router.patch("/:id", [
  body('email', 'Enter a valid email').isEmail(),
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    let user = await UserSchema.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: "Sorry A User With This Already Email Exist" })
    }
    if (!user) {
      const salt = await bcrypt.genSalt(10)
      const sec = await bcrypt.hash(req.body.password, salt)
      user = await UserSchema.findByIdAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        email: req.body.email,
        password: sec
      })
      const UserUpdate = UserSchema.findById(req.params.id)
      if (!UserUpdate) { return res.status(404).send(" Please Enter a Valid Id ") }
      res.status(200).json({ Success: "User has been Updated" })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// ROUTE NO 6 TO DELETE A USER FROM DATABASE BY ID
router.delete("/createuser/:id", async (req, res) => {
  await UserSchema.findByIdAndRemove(req.params.id)
  res.json({
    message: "Deleted"
  })
})
module.exports = router;