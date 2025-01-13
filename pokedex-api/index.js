import dotenv from "dotenv";
dotenv.config(); //carga las variables de entorno desde el archivo .env
//-------------
import express from "express";
import cors from "cors";
import { leerPokemon,crearPokemon,borrarPokemon,editarPokemon } from "./db.js";

const servidor = express();

// Para permitir solicitudes desde distintos dominios
servidor.use(cors()); 

// Analiza el cuerpo de las solicitudes como JSON
servidor.use(express.json()); 

//Ruta para leer los Pokémon de la base de datos
servidor.get("/pokemon", async (peticion,respuesta) => {
    try{
        let pokemons = await leerPokemon();

        respuesta.json(pokemons);

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "Error en el servidor al obtener los Pokémon" });

    }
});

// Ruta para crear nuevos Pokémon
servidor.post("/pokemon", async (peticion,respuesta,siguiente) => {
    let { nombre, tipo, posicion } = peticion.body; // Extraer nombre, tipo y posición del cuerpo de la solicitud

    if(!nombre || !tipo || typeof posicion === "undefined") { // Si falta alguno de los campos obligatorios, pasa al siguiente middleware
        return siguiente(true); 
    }

    try {
        let id = await crearPokemon({ nombre, tipo, posicion }); // Crear el Pokémon en la base de datos

        respuesta.json({ id });

    }catch(error) {
        respuesta.status(500).json({ error : "Error en el servidor al crear el Pokémon" });
    }
});

//Ruta para eliminar pokémon de la base de datos
servidor.delete("/pokemon/borrar/:id([0-9a-f]{24})", async (peticion, respuesta) => {
    try {
        let { id } = peticion.params;  // Extraer el ID de los parámetros de la solicitud

        let cantidad = await borrarPokemon(id);  // Llamar a la función para borrar el Pokémon

        respuesta.json({ resultado: cantidad ? "ok" : "ko" });  // Responder con un mensaje de éxito o error

    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor al eliminar el Pokémon" });
    }
});

//Ruta para editar los Pokémon que ya se encuentran en la base de datos.

servidor.put("/pokemon/actualizar/:id([0-9a-f]{24})", async (peticion, respuesta, siguiente) => {
    let { id } = peticion.params;  // Extraer el ID del Pokémon a actualizar desde los parámetros
    let { nombre, tipo } = peticion.body;  // Extraer los datos de nombre y tipo del cuerpo de la solicitud

    if (!nombre && !tipo) {
        return siguiente(true);  // Si no se proporciona ningún dato para actualizar, pasa al siguiente middleware
    }

    try {
        let cantidad = await editarPokemon(id, { nombre, tipo });  // Actualizar el Pokémon en la base de datos
        respuesta.json({ resultado: cantidad ? "ok" : "ko" });  // Responder con un mensaje de éxito o error
    } catch (error) {
        respuesta.status(500).json({ error: "Error en el servidor al editar el Pokémon" });
    }
});

// Middleware para manejar errores
servidor.use((error, peticion, respuesta, siguiente) => {
    respuesta.status(400).json({ error: "Error en la solicitud" });
});

// Middleware para manejar recursos no encontrados
servidor.use((peticion, respuesta) => {
    respuesta.status(404).json({ error: "Recurso no encontrado" });
});

// Iniciar el servidor en el puerto definido en las variables de entorno
servidor.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`);
});