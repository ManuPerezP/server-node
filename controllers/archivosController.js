const bcrypt = require('bcrypt');
const Enlaces = require("../models/Enlace");
const { validationResult } = require('express-validator');
const fs = require('fs'); //file system, libreria de archivos
//subida de archivos

const multer = require('multer');
const shortid = require('shortid');
//const upload = multer({dest:'./uploads/'});


exports.subirArchivo = async (req, res)=>{

    const configuracionMulter = {
        limits : {fileSize: req.usuario ? 1024*1024*10 : 1000000 },
        storage: fileStorage = multer.diskStorage({
            destination : (req, file, callback)=>{
                callback(null,__dirname+'/../uploads')
            },
            filename: (req, file, callback)=>{
                const extension = file.originalname.substr(file.originalname.lastIndexOf('.'),file.originalname.length);

                callback(null,`${shortid.generate()}${extension}`);
            }/*, //ejemplo filtro de extension de archivos
            fileFilter: (req, file, callback)=>{
                if(file.mimetype === 'application/pdf'){
                    return callback(null, true);
                }
            }*/
        })
    };
    
    const upload = multer(configuracionMulter).single('archivo');


   upload(req, res, async (error)=>{
        console.log(req.file);

        if(!error){
            res.json({archivo: req.file.filename});
        }else{
            console.log(error);
            return next();
        }
   })
}

exports.eliminarArchivo = async (req, res)=>{
    console.log('desde eliminar archivo');

    try{
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`)
    }catch(error){
        console.log(error);
    }
}
/*
exports.descargar = async(req, res)=>{
    const archivo = __dirname +"/../uploads/"+req.params.archivo;
    res.download(archivo);
}*/

exports.descargar = async (req, res, next) => {
    const { archivo } = req.params;
  
    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDescarga = `${__dirname}/../uploads/${archivo}`;
  
    res.download(archivoDescarga); //esto hace la magia de la descarga por mí
  
    const { descargas, nombre } = enlace;
    //Si las descargas son iguales a 1 - borrar la entrada y borrar el archivo
    if (descargas === 1) {
      console.log("Si solo 1");
  
      //Eliminar el archivo
      req.archivo = nombre;
  
      //eliminar entrada desde bd
      await Enlaces.findOneAndRemove(enlace.id);
      next();
    } else {
      // si alas descargas son > a 1 - restar 1
      enlace.descargas--;
      await enlace.save();
    }
  };