const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
require("dotenv").config({ path: "variables.env" });

exports.autenticarUsuario = async (req, res, next) => {
  //Revisar si hay errores

  //Buscar el usuario para ver si esta registrado

  const errores = validationResult(req);

  if(!errores.isEmpty()){
      return res.status(400).json({errores: errores.array()});
  }

  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(401).json({ msg: "El Usuario no Existe" });
    return next();
  }

  //Verificar el password y autenticar el usuario
  if (!bcrypt.compareSync(password, usuario.password)) {
    res.status(401).json({ msg: "Credenciales incorrectas" });
    return next();
  }

  //crear token jwt
  const token = jwt.sign(
    {
      id: usuario._id,
      nombre: usuario.nombre
    },
    process.env.SECRETA,
    { expiresIn: "8h" }
  );

    res.json({token});
};

exports.usuarioAutenticado = async (req, res, next) => {
 /* const authHeader = req.get('Authorization');

  if(authHeader){
    const token = authHeader.split(' ')[1];

    //comprobar el jwt
    const usuario = jwt.verify(token, process.env.SECRETA);

    res.json(usuario);

  }else{
      console.log('JWT no valido');
  }

  return next();*/

  res.json({ usuario : req.usuario});

};
