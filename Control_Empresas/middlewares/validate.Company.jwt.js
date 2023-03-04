const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token"); 

  
  if (!token) {
    return res.status(401).send({
      message: "No hay token en la peticion de la empresa",
    });
  }

  try {
    
    const payload = jwt.decode(token, process.env.SECRET_KEY);
    
    const userEncontrado = await User.findById(payload.uId);
    console.log(userEmpresaEncontrado);

    
    if (payload.exp <= moment().unix()) {
      return res.status(500).send({ message: "el token ha expirado" });
    }
    
    if (!userEmpresaEncontrado) {
      return res.status(401).send({
        message: "Token no valido - user no existe en DB fisicamente",
      });
    }
    
    req.user = userEmpresaEncontrado;

    
    next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { validateJWT };