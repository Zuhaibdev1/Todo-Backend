const express = require("express")
const router = express.Router()
const ProductSchema = require("../Models/ProductSchema")


// Route NO 1 TO POST PRODUCTS IN DATABASE
router.post("/product", async (req, res) => {
  try {
    console.log(req.body)
    const { name, price, description, image } = req.body;
    const product = await ProductSchema.create({ name, price, description, image })
    res.status(200).json({ data: product, message: "Product Upload SuccessFully" })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
});


// Route NO 2 TO GET PRODUCTS FROM DATABASE
router.get("/product", async (req, res) => {
  try {
    const product = await ProductSchema.find(req)
    if (!product) { return res.status(404).send("Product Not Found") }
    res.status(200).json(product)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// Route NO 3 TO GET PRODUCTS FROM DATABASE BY ITS ID
router.get("/product/:id", async (req, res) => {
  try {
    let Product = await ProductSchema.findById(req.params.id)
    if (!Product) { return res.status(404).send("Product Not Found On This Id") }

    res.status(200).send(Product)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// Route NO 4 TO UPDATE PRODUCTS IN DATABASE BY ITS ID
router.patch("/product/:id", async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    await ProductSchema.findByIdAndUpdate({ _id: req.params.id }, { name, price, description, image })
    const ProductUpdate = await ProductSchema.findById(req.params.id)
    if (!ProductUpdate) { return res.status(404).send(" Please Enter a Valid Id ") }
    res.status(200).json({ Success: "Product has been Updated" })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})


// Route NO 4 TO DELETE PRODUCTS IN DATABASE BY ITS ID
router.delete("/product/:id", async (req, res) => {
  try {
    let product = await ProductSchema.findById(req.params.id)
    if (!product) { return res.status(404).send("No Product Found") }
    await ProductSchema.findByIdAndRemove(req.params.id)
    res.json({ Success: "Product has been deleted" })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Occured")
  }
})
module.exports = router