const express = require("express")
const bodyParser = require("body-parser")
const connectDB = require("./config/db")
const apiRoutes = require('./routes/api');
// Initialize express app
const app = express()

// Connect to database
connectDB()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use("/api", require("./routes/api"))

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Fruit Management API")
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})