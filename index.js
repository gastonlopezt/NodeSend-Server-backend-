const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors')


//crear servidor
const app = express();

conectarDB()

console.log('comenzando')

//Cors habilitation
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors))

//Puerto
const port = process.env.PORT || 4000;

app.use(express.json());


//Habilitar carpeta publica
app.use(express.static('uploads'))


//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

//Arrancar la app
app.listen(port, '0.0.0.0',() => {
    console.log('el servidor esta funcionando');
})