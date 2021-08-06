const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const {check} = require('express-validator');

router.post('/',
[
    check('nombre','El Nombre es Obligatorio').not().isEmpty(),
    check('email','Agrega un email valido').isEmail(),
    check('password','El password debe ser de al menos 6 caracteres').isLength({min:6}),
],
    usuariosController.nuevoUsuario
)


module.exports = router;