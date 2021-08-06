const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema =  Schema({

    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,  //primary key
        lowercase:true
    },
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Usuarios', UsuariosSchema);
