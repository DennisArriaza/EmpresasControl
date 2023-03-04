"use strict";

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/create-jwt");

const EmpresaApp = async (req, res) => {
  try {
    let user = new User();
    user.username = "Empresario";
    user.password = "123";
    user.CorreoEmpresa = "empresa@gmail.com";
    user.rol = "EMPRESA";
    const userEncontrado = await User.findOne({ empresa: user.empresa });
    if (userEncontrado) return console.log("La empresa esta en funcion");
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    user = await user.save();
    if (!user) return console.log("La empresa dejo la funcion");
    return console.log("La empresa esta en funcion");
  } catch (err) {
    throw new Error(err);
  }
};

const CreateUser = async (req, res) => {
  const { CorreoEmpresa, password } = req.body;
  try {
    let user = await User.findOne({ CorreoEmpresa: CorreoEmpresa });
    if (user) {
      return res.status(400).send({
        message: "La empresa ya existe en este registro",
        ok: false,
        user: user,
      });
    }
    user = new User(req.body);

    const saltos = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, saltos);

    user = await user.save();

    const token = await generateJWT(user.id, user.empresa, user.CorreoEmpresa);
    res.status(200).send({
      message: `Empresa ${user.empresa} creado correctamente`,
      user,
      token: token,
    });
  } catch (err) {
    throw new Error(err);
  }
  //} else {
  /*return res.status(500).send({
      message: "Esta empresa no tiene los permisos necesarios",
    });*/
  //}
};

const ReadUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      res.status(404).send({ message: "Su empresa no esta disponible" });
    } else {
      res.status(200).json({ "Su empresa ya esta disponible": users });
    }
  } catch (err) {
    throw new Error(err);
  }
};

const UpdateUser = async (req, res) => {
  if (req.user.rol === "EMPRESA") {
    try {
      const idEmpresa = req.params.idEmpresa;
      const userEdit = { ...req.body };
      userEdit.password = userEdit.password
        ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
        : userEdit.password;
      const userComplete = await User.findByIdAndUpdate(id, userEdit, {
        new: true,
      });
      if (userComplete) {
        const token = await generateJWT(
          userComplete.idEmpresa,
          userComplete.Empresa,
          userComplete.CorreoEmpresa
        );
        return res.status(200).send({
          message: "Empresa agregada correctamente",
          userComplete,
          token,
        });
      } else {
        res.status(404).send({
          message:
            "Esta empresa no esta registrada en la base de datos",
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  } else {
    return res.status(200).send({
      message: "Esta empresa no tiene los permisos necesarios",
    });
  }
};

const DeleteUser = async (req, res) => {
  if (req.user.rol === "EMPRESA") {
    try {
      const id = req.params.idEmpresa;
      const userDelete = await User.findByIdAndDelete(id);
      return res
        .status(200)
        .send({ message: "Empresa eliminada correctamente", userDelete });
    } catch (err) {
      throw new Error(err);
    }
  } else {
    return res
      .status(500)
      .send({ message: "Esta empresa no tiene permisos" });
  }
};

const LoginUser = async (req, res) => {
  const { CorreoEmpresa, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ ok: false, message: "Empresa no existente" });
    }
    const validPassword = bcrypt.compareSync(
      password,
      user.password 
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ ok: false, message: "La empresa ingreso el password correctamente" });
    }

    const token = await generateJWT(user.id, user.Empresa, user.CorreoEmpresa);
    res.json({
      ok: true,
      uid: user.idEmpresa,
      name: user.empresa,
      CorreoEmpresa: user.CorreoEmpresa,
      token,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const AgregarEmpresa = async (req, res) => {
  try {
    const idEmpresa = req.params.idEmpresa;
    const { Empresa, Trabajadores, BienesMateriales, Herramientas, Muebles, Maquinarias} = req.body;

    const userEmpresa = await User.findByIdAndUpdate(
      idEmpresa,
      {
        $push: {
          Empresa: {
            Empresa: empresa,
            Trabajadores: trabajadores,
            BienesMateriales: bienesMateriales,
            Herramientas: herramientas,
            Muebles: muebles,
            Maquinarias: maquinarias,
          },
        },
      },
      { new: true }
    );
    if (!userEmpresa) {
      return res.status(404).send({ msg: "Empresa no encontrada en la lista" });
    }

    return res.status(200).send({ userEmpresa });
  } catch (err) {
    throw new Error(err);
  }
};

const EliminarEmpresa = async (req, res) => {
  const id = req.params.idEmpresa;
  const { idEmpresa } = req.body;
  try {
    const deleteEmpresa = await User.updateOne(
      { id },
      {
        $pull: { empresa: { _id: idEmpresa } },
      },
      { new: true, multi: false }
    );

    if (!deleteEmpresa) {
      return res.status(404).send({ msg: "La empresa no esta en la lista" });
    }

    return res.status(200).send({ deleteEmpresa });
  } catch (err) {
    throw new Error(err);
  }
};

const EditarEmpresa = async (req, res) => {
  const id = req.params.idEmpresa;
  const { idEmpresa, Trabajadores, BienesMateriales, Herramientas, Muebles, Maquinarias } = req.body;
  try {
    const updateEmpresa = await User.updateOne(
      { _id: id, "Empresa._id": idEmpresa },
      {
        $set: {
          "empresa.$.Trabajadores": trabajadores,
          "empresa.$.BienesMateriales": bienesMateriales,
          "empresa.$.Herramientas": herramientas,
          "empresa.$.Muebles": muebles,
          "empresa.$.Maquinarias": maquinarias,
        },
      },
      { new: true }
    );

    if (!updateEmpresa) {
      return res.status(404).send({ msg: "Esta empresa no existe en la lista" });
    }

    return res
      .status(200)
      .send({ updateEmpresa, msg: "Empresa agregada en lista correctamente" });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  EmpresaApp,
  CreateUser,
  ReadUsers,
  UpdateUser,
  DeleteUser,
  LoginUser,
  AgregarEmpresa,
  EliminarEmpresa,
  EditarEmpresa,
};