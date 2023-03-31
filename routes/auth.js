const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const {check} = require('express-validator')
const auth = require('../Middleware/auth');


router.post('/',
    [
        check('email', 'Agrega un email válido'),
        check('password', 'El password no puede ir vacío').not().isEmpty(),
    ],
    authController.autenticarUsuario
)

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;