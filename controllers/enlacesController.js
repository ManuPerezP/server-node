const Enlaces = require("../models/Enlace");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const shortId = require("shortid");

exports.nuevoEnlace = async (req, res, next) => {
  //revisar errores
  //MOstrar mensajes de error de express validator
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //almacenar en bd el enlace
  const { nombre_original, nombre } = req.body;

  const enlace = new Enlaces();

  enlace.url = shortId.generate();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  //enlace.descargas = 1;
  //enlace.password = password;

  //si el usuario esta autenticado:
  if (req.usuario) {
    const { password, descargas } = req.body;

    //asignar a enlace numero de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }

    //asignar password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }

    //Asignar el autor
    enlace.autor = req.usuario.id;
  }

  //Almacenar en la bd
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
    //     next();
  } catch (error) {
    console.log(error);
  }
};

exports.obtenerEnlace = async (req, res, next) => {
  console.log(req.params.url);

  const { url } = req.params;
  //Verificar si existe el enlace
  const enlace = await Enlaces.findOne({ url });

  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    next();
  }
  console.log(enlace);
  //si el enlace existe
  res.json({ archivo: enlace.nombre, password: false });

  next();
};
//retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
  const { url } = req.params;
  //Verificar si existe el enlace
  const enlace = await Enlaces.findOne({ url });

  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }

  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url });
  }

  next();
};

exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  const enlace = Enlaces.findOne({ url });

  if (bcrypt.compareSync(password, enlace.password)) {
    next()
  } else {
    return res.status(401).json({ msg: "Password incorrecto" });
  }
};

exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select("url"); //url -_id  ...solo retorna el url
    res.json(enlaces);
  } catch (error) {
    console.log(error);
  }
};
