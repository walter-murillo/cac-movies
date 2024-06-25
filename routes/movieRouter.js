/**
 * Aca vamos a establecer el router y como va a responder a las request de los usuarios
 * 
 */

// Empezamos importando los modulos que necesitamos. En este caso, son los modulos express, fs y path, y de express vamos a necesitar Router, un submodulo
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Usamos path.join para unir la ruta actual con la ruta que contiene los archivos JSON.
// la variable "__dirname" es una variable global de node. Hace referencia a la ruta actual
const moviePath = path.join(__dirname, "../public/movies.json");

// Leemos y formateamos el archivo JSON, y luego lo convertimos a un array legible por JS
const archivoJSON = fs.readFileSync(moviePath, "utf-8");
const movies = JSON.parse(archivoJSON); // JSON.parse convierte un string JSON en un objeto JS

// DEFINICION DE SOLICITUDES <-----------*----------->

// Prueba de saludo con GET
router.get("/saludo", (req,res) => {
    res.json({ mensaje: "Hola desde el servidor" })
});

// Test de listado completo
router.get("/list", (req, res) => {
    res.json(movies);
});

// Rutas paramétricas con id
// GET - Request de lista de Películas
router.get("/:id", (req, res) => {

    const movie = movies.find(m => m.id === parseInt(req.params.id))

    if (!movie) {
        const estado404 = res.status(404);
        return estado404.send("Película no encontrada");
    }

    // Enviamos la pelicula encontrada
    res.json(movie);
});

// POST - Ingreso de datos al Server / DB
router.post("/", (req, res) => {
    // Creamos un objeto con los datos que vienen en el cuerpo de la solicitud
    const nuevaPeli = {
        id: movies.length + 1,
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        image: req.body.image
    }
    
    // Agregamos la nueva pelicula al array movies, y luego convertimos el array en un string JSON
    movies.push(nuevaPeli);
    const moviesActualizado = JSON.stringify(movies, null, 2); // stringify convierte un objeto o valor de JavaScript en una cadena de texto JSON

    // Guardamos el string JSON en movies.json. Cargamos por parametros el directorio, el archivo actualizado y el formato de codificacion de escritura
    fs.writeFileSync(moviePath, moviesActualizado, "utf-8");

    res.status(201).json({
        mensaje: "Pelicula agregada con éxito!!",
        pelicula: nuevaPeli
    })
    
})

// PUT - Actualizamos recursos en el Server / DB
router.put("/:id", (req, res) => {
    const peliculaActualizada = movies.find(m => m.id === parseInt(req.params.id));
    if(!peliculaActualizada){
        // Si no hay datos en la constante peliculaActualizada, mandar mensaje 404 y pelicula no encontrada
        const estado404 = res.status(404);
        return estado404.send("Pelicula no encontrada");
    }
    // Si no hay errores al momento de la validacion de request, actualizamos los datos de la pelicula
    // Actualizamos los valores del objeto peliculaActualizada con los datos en el body de la req. (req.body)
    // Al encontrar un valor null o en blanco, mantiene los valores actuales
    peliculaActualizada.title = req.body.title || peliculaActualizada.title;
    peliculaActualizada.director = req.body.director || peliculaActualizada.director;
    peliculaActualizada.year = req.body.year || peliculaActualizada.year;
    peliculaActualizada.image = req.body.image || peliculaActualizada.image;

    // Convertimos el array a un string JSON y actualizamos el archivo JSON con el mismo string
    const moviesActualizado = JSON.stringify(movies, null, 2);

    // Guardamos el archivo actualizado y enviamos la respuesta al cliente
    fs.writeFileSync(moviePath, moviesActualizado, "utf-8");
    res.json({
        mensaje: "Pelicula actualizada con éxito!!",
        pelicula: peliculaActualizada
    })

})

// DELETE - Elimina recursos en el Server
// Para usar esta req, necesitamos 2 parametros: un ID o URL para localizar el recurso a eliminar, y un callback
router.delete("/:id", (req, res) => {
    // En este caso, usamos un ID para localizar el recurso a borrar dentro del array movies. La pelicula será almacenada en la variable movie, para luego eliminarla usando DELETE
    const peliculaEliminada = movies.find(m => m.id === parseInt(req.params.id));
    if(!peliculaEliminada){
        // Si no se pudo encontrar una pelicula con el ID deseado, se envia status 404 con un mensaje de error
        const status404 = res.status(404);
        return status404.send("Película no se encuentra en nuestra Base de Datos")
    }

    // Eliminamos la pelicula del array
    const peliculaIndex = movies.indexOf(peliculaEliminada);
    movies.splice(peliculaIndex, 1);
    // Actualizamos el archivo JSON, convertimos el array a un string JSON y guardamos el archivo actualizado
    const moviesActualizado = JSON.stringify(movies, null, 2);
    fs.writeFileSync(moviePath, moviesActualizado, "utf-8");

    //Enviamos la respuesta al cliente
    res.json({
        mensaje: "Pelicula borrada con éxito!!",
        pelicula: peliculaEliminada
    })

})

// Exportamos el modulo. Esto va al final del codigo
module.exports = router;