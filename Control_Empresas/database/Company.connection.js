"use strict";
require("dotenv").config();
var database = process.env.DATABASE;
var mongoose = require("mongoose");
mongoose.set("strictQuery", true);

var connection = async () => {
  try {
    await mongoose.connect(database);
    console.log("Se conecto a la base de datos de la empresa");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  connection,
};
