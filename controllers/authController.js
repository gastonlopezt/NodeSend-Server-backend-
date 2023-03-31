const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: 'variables.env'})

exports.autenticarUsuario = async (req, res, next) => {
    //revisar errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //Buscar el user pra ver si esta registrado

    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});
    //console.log(usuario);

    if(!usuario) {
        res.status(401).json({msg: 'El usuario no Existe'})
        return next();
    }

    //Verificar password y autenticar
    if(bcrypt.compareSync(password, usuario.password)) {
        //JSON WEB TOKEN 
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
        }, process.env.SECRETA, {
            expiresIn: '1000h'
        });
        res.json({token})
    } else {
        res.status(401).json({msg: 'Password incorrecto'})
    }
}

exports.usuarioAutenticado= (req, res, next) => {

    res.json({usuario: req.usuario})
}