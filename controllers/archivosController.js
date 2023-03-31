const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');




exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits: {fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            },
            
        }),
    }

    const upload = multer(configuracionMulter).single('archivo');
    upload(req, res, async (error) => {
        console.log(req.file)

        if(!error) {
            res.json({archivo: req.file.filename})
        } else {
            console.log(error)
            return next()
        }
    })
}

exports.eliminarArchivo = async (req, res) => {
    console.log(req.archivo)

    try {
       fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`) 

    } catch (error) {
        console.log(error)
    }
}

//download
exports.descargar = async (req, res, next) => {
    
    //Obtener enlaces
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo})



    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga)

//Elimnar el archivo y de la BD
    //descargaas igual a 1 borrar el archivo

    const {descargas, nombre} = enlace

    if(descargas === 1) {
        console.log('solo 1')

        //eliminar archivo y de la base de datos
        req.archivo = nombre;

        await Enlaces.findOneAndRemove(enlace.id)

        next()

    } else {
        enlace.descargas--;
        await enlace.save();
    }      
}