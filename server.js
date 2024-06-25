/** Creamos un servidor que responda las consultas del TP
 * Vamos a usar el enrutador, creando su estructura, los archivos .js y .json correspondientes
 * npm init -y, configuramos el script correspondiente con --watch o nodemon
 * npm install express --save
 * Luego de establecer las bases del servidor, codificamos
 * 1- el server
 * 2- el router
 */

// Importamos los modulos, instanciamos y declaramos el puerto por el cual llegaran las peticiones de usuario
const express = require("express");
const app = express();
const PORT = 3000;

// Call a nuestro modulo
const movieRouter = require("./routes/movieRouter");

// Usamos express.json, middleware que nos permitira convertir el body de una request en un objeto JS accesible a traves de req.body()
app.use(express.json());

// Definimos un prefijo principal de ruta
app.use("/movies", movieRouter);

// Iniciamos el servidor con el puerto declarado anteriormente
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})