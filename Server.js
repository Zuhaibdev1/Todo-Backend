const express = require('express')
require("./DataBase/DB")

const ProductRoute = require("./Router/Products")
const UserRoute = require("./Router/Users")
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
// Product Routes
app.use("/", ProductRoute)
// Product Routes
// User Routes
app.use("/user", UserRoute)
// User Routes



// SERVER Routes
app.get('/', (_req, res) => {
  res.send("Server Running")
})

// SERVER Listen + Mongoose Connect
const PORT = 5000
app.listen(PORT, () => {
  console.log("Server Running On Port:", PORT)
})
