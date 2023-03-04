"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  correoEmpresa: String,
  password: String,
  rol: String,
  Empresa: [{
    Trabajadores: String,
    BienesMateriales: Number,
    heramientas: String
  }]
});

module.exports = mongoose.model("users", UserSchema);