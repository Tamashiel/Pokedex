import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ObjectId } from "mongodb";

function conectar(){
    return MongoClient.connect(process.env.MONGO_URL)
}
export function leerPokemon(){
    return new Promise (async (ok, ko) => {
        let conexion = null;

        try{

            conexion = await conectar(); //coloco la conexion dentro del try para que salte el catch si la promesa se rechazase
            let coleccion = conexion.db("pokedex").collection("pokemons")
            
            let pokemons = await coleccion.find({}).toArray(); 

            pokemons = pokemons.map(({_id,nombre,tipo, posicion, imagen}) => ({
                id: _id,
                nombre,
                tipo,
                posicion,
                imagen
            }));

            ok(pokemons);

        }catch(error){

            ko({ error: "Error al leer la base de datos" })

        }finally{
            if(conexion){ //Verifico que la conexion no sea nula.
                conexion.close();
            }
            
        }
    });
}

export function crearPokemon(pokemon) {
    return new Promise(async (resolve, reject) => {
        let conexion = null;

        try {
            conexion = await conectar();
            let coleccion = conexion.db("pokedex").collection("pokemons");

            let { nombre, tipo, posicion, imagen } = pokemon;

            // Validación
            imagen = imagen && imagen.trim() !== "" ? imagen : null;

            let { insertedId } = await coleccion.insertOne({ nombre, tipo, posicion, imagen });

            console.log("✅ Pokémon creado con ID:", insertedId);
            resolve(insertedId);

        } catch (error) {
            console.error("❌ Error al crear el Pokémon:", error);
            reject({ error: "Error al crear el Pokémon" });

        } finally {
            if (conexion) {
                conexion.close();
            }
        }
    });
}




export function borrarPokemon(id) {
    return new Promise(async (ok, ko) => {
        let conexion = null;

        try {
            conexion = await conectar();
            let coleccion = conexion.db("pokedex").collection("pokemons");

            let { deletedCount } = await coleccion.deleteOne({ _id: new ObjectId(id) });

            if (deletedCount === 1) {
                ok({ mensaje: "Pokémon eliminado correctamente" });
            } else {
                ok({ mensaje: "No se encontró el Pokémon para eliminar" });
            }
        } catch (error) {
            console.error("Error detallado:", error); // Captura el error aquí
            ko({ error: "Error en la base de datos al eliminar el Pokémon" });
        } finally {
            if(conexion){ //Verifico que la conexion no sea nula.
                conexion.close();
            }
        }
    });
}


export function editarPokemon(id, nuevosDatos) {
    return new Promise(async (ok, ko) => {
        let conexion = null;

        try {
            conexion = await conectar();

            let coleccion = conexion.db("pokedex").collection("pokemons"); // Base y colección correcta

            let { modifiedCount } = await coleccion.updateOne(
                { _id: new ObjectId(id) }, // Conversión de ID
                { $set: nuevosDatos } // Actualizamos los campos con nuevosDatos
            );

            if (modifiedCount === 1) {
                ok({ mensaje: "Pokémon actualizado correctamente" });
            } else {
                ok({ mensaje: "No se encontró el Pokémon para actualizar" });
            }
        } catch (error) {
            ko({ error: "Error en la base de datos al editar el Pokémon" });
        } finally {
            if(conexion){ //Verifico que la conexion no sea nula.
                conexion.close();
            }
        }
    });
}
