const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
exports.nuevoUsuario = async(req, res) => {

    //msg error express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //verificar si ya esta registrado
    const {email, password} = req.body;
    let usuarioCreado = await Usuario.findOne({email});

    if(usuarioCreado) {
        return res.status(400).json({msg: 'El usuario ya esta registrado'})
    }


    //Crear nuevo usuario
    const usuario = new Usuario(req.body);

    //Password Hash
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        res.json({msg: 'Usuario creado Correctamente'})    
    } catch (error) {
       console.log(error) 
    }
}