const mongoose = require("mongoose");

//  User Schema 

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  sessionid: {
    type: String
  },
  orderid: {
    type: String
  },
  customerid: {
    type: String
  },
  paymentstatus: {
    type: Boolean,
    default: false
  },
  failurereason: {
    type: String
  },
  created_at: { type: Date, default: Date.now },
  price: Number
});


//  UserModel 

const UserModel = mongoose.model("users", userSchema);

module.exports = {
  UserModel,
};