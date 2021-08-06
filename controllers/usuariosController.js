const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async (req, res)=>{
    
//MOstrar mensajes de error de express validator
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //verificar si ya fue registrado
    const {email} = req.body;

    let usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({msg: 'El usuario ya esta registrado'});
    }

    //crear unn nuevo usuario
    usuario =  new Usuario(req.body);
    //hash password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password,salt);

    try{
        await usuario.save();
        res.json({msg:'usuario creado correctamente'});
    }catch(error){
        console.log(error);
    }

}