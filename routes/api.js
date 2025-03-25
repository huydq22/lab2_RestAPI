const express = require("express")
const router = express.Router()
const Distributor = require("../models/distributors")
const Fruit = require("../models/fruits")

// ===== DISTRIBUTOR ROUTES =====

// Add a new distributor
router.post("/distributors", async (req, res) => {
  try {
    const { name, address, phone } = req.body

    // Create new distributor
    const distributor = new Distributor({
      name,
      address,
      phone,
    })

    // Save to database
    await distributor.save()

    res.status(201).json({
      success: true,
      message: "Distributor added successfully",
      data: distributor,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// ===== FRUIT ROUTES =====

// Add a new fruit
router.post("/fruits", async (req, res) => {
  try {
    const { name, quantity, price, status, image, description, id_distributor } = req.body

    // Check if distributor exists
    const distributor = await Distributor.findById(id_distributor)
    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      })
    }

    // Create new fruit
    const fruit = new Fruit({
      name,
      quantity,
      price,
      status,
      image,
      description,
      id_distributor,
    })

    // Save to database
    await fruit.save()

    res.status(201).json({
      success: true,
      message: "Fruit added successfully",
      data: fruit,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Get all fruits
router.get("/fruits", async (req, res) => {
  try {
    const fruits = await Fruit.find().populate("id_distributor", "name address")

    res.status(200).json({
      success: true,
      count: fruits.length,
      data: fruits,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Get fruit by ID
router.get("/fruits/:id", async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id).populate("id_distributor", "name address")

    if (!fruit) {
      return res.status(404).json({
        success: false,
        message: "Fruit not found",
      })
    }

    res.status(200).json({
      success: true,
      data: fruit,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Get fruits by price range and sort by quantity
router.get("/fruits/filter/price", async (req, res) => {
  try {
    const { min_price, max_price } = req.query

    if (!min_price || !max_price) {
      return res.status(400).json({
        success: false,
        message: "Please provide min_price and max_price",
      })
    }

    const fruits = await Fruit.find({
      price: { $gte: min_price, $lte: max_price },
    })
      .select("name quantity price id_distributor")
      .sort({ quantity: -1 })
      .populate("id_distributor", "name")

    res.status(200).json({
      success: true,
      count: fruits.length,
      data: fruits,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Get fruits starting with A or X
router.get("/fruits/filter/name", async (req, res) => {
  try {
    const fruits = await Fruit.find({
      $or: [{ name: { $regex: "^A", $options: "i" } }, { name: { $regex: "^X", $options: "i" } }],
    })
      .select("name quantity price id_distributor")
      .populate("id_distributor", "name")

    res.status(200).json({
      success: true,
      count: fruits.length,
      data: fruits,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// Update fruit by ID
router.put("/fruits/:id", async (req, res) => {
  try {
    const { name, quantity, price, status, image, description, id_distributor } = req.body

    // Check if fruit exists
    let fruit = await Fruit.findById(req.params.id)
    if (!fruit) {
      return res.status(404).json({
        success: false,
        message: "Fruit not found",
      })
    }

    // Check if distributor exists if id_distributor is provided
    if (id_distributor) {
      const distributor = await Distributor.findById(id_distributor)
      if (!distributor) {
        return res.status(404).json({
          success: false,
          message: "Distributor not found",
        })
      }
    }

    // Update fruit
    fruit = await Fruit.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity,
        price,
        status,
        image,
        description,
        id_distributor,
      },
      { new: true, runValidators: true },
    )

    res.status(200).json({
      success: true,
      message: "Fruit updated successfully",
      data: fruit,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router

