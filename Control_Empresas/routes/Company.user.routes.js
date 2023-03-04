"use strict";

const { Router } = require("express");
const {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  loginUser,
  AgregarEmpresa,
  EliminarEmpresa,
  EditarEmpresa,
} = require("../controllers/user.controller");
const { check } = require("express-validator");
const { validateParams } = require("../middlewares/validate-params");
const { validateJWT } = require("../middlewares/validate-jwt");

const api = Router();

api.post(
  "/create-user",
  [
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 digitos").isLength({
      min: 6,
    }),
    check("CorreoEmpresa", "El Email es obligatorio").not().isEmpty(),
    validateParams,
  ],
  createUser
);
api.get("/read-users", readUsers);
api.put(
  "/update-user/:id",

  [
    validateJWT,
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 digitos").isLength({
      min: 6,
    }),
    check("CorreoEmpresa", "El CorreoEmpresa es obligatorio").not().isEmpty(),
    validateParams,
  ],
  updateUser
);
api.delete("/delete-user/:id", validateJWT, deleteUser);
api.post("/login", loginUser);

api.put("/empresa/:id", AgregarEmpresa);
api.delete("/empresa-delete/:id", EliminarEmpresa);
api.put("/editar-empresa/:id", EditarEmpresa);
module.exports = api;