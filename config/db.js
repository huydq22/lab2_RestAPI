const mongoose = require("mongoose")

const mongoURI =
  "mongodb://huyhaha1509:huyhaha1509@cluster0-shard-00-00.dpzt3.mongodb.net:27017,cluster0-shard-00-01.dpzt3.mongodb.net:27017,cluster0-shard-00-02.dpzt3.mongodb.net:27017/?replicaSet=atlas-vvyb4r-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB

