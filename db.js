require("dotenv").config();
const mongoose = require("mongoose");
const connection = mongoose.connect(process.env.url || 'mongodb://localhost:27017');
module.exports = { connection };