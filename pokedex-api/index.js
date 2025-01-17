import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { leerPokemon, crearPokemon, borrarPokemon, editarPokemon, obtenerPokemonPorId } from "./db.js";

//Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const servidor = express();

servidor.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

servidor.use(express.json());

servidor.use("/uploads", express.static("public/uploads"));

//Asegura la existencia de la carpeta Uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📂 Carpeta 'uploads' creada.");
}

const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, nombreUnico + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const upload = multer({ storage: almacenamiento, fileFilter });

servidor.post("/pokemon", upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, tipo, posicion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        if (!nombre || !tipo || !posicion) {
            return res.status(400).json({ error: "Faltan datos obligatorios." });
        }

        const id = await crearPokemon({ nombre, tipo, posicion, imagen });
        res.status(201).json({ id });

    } catch (error) {
        console.error("Error al crear el Pokémon:", error);
        res.status(500).json({ error: "Error en el servidor al crear el Pokémon." });
    }
});

servidor.put("/pokemon/actualizar/:id([0-9a-f]{24})", upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, posicion } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevosDatos = {
        ...(nombre && { nombre }),
        ...(tipo && { tipo }),
        ...(posicion && { posicion }),
        ...(imagen && { imagen }),
    };

    try {
        const resultado = await editarPokemon(id, nuevosDatos);
        res.json({ resultado: resultado ? "ok" : "ko" });
    } catch (error) {
        console.error("Error al actualizar el Pokémon:", error);
        res.status(500).json({ error: "Error al actualizar el Pokémon" });
    }
});

servidor.get("/pokemon", async (req, res) => {
    try {
        const pokemons = await leerPokemon();
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al obtener los Pokémon" });
    }
});

servidor.delete("/pokemon/borrar/:id([0-9a-f]{24})", async (req, res) => {
    try {
        const { id } = req.params;
        const pokemon = await obtenerPokemonPorId(id);

        if (!pokemon) {
            return res.status(404).json({ error: "Pokémon no encontrado" });
        }

        if (pokemon.imagen) {
            const imagePath = path.join(__dirname, 'public', 'uploads', path.basename(pokemon.imagen));


            if (fs.existsSync(imagePath)) {
                await fs.promises.unlink(imagePath);
                console.log(`🗑️ Imagen eliminada correctamente: ${imagePath}`);
            } else {
                console.warn(`⚠️ La imagen no existe: ${imagePath}`);
            }
            
        }

        const cantidad = await borrarPokemon(id);
        res.json({ resultado: cantidad ? "ok" : "ko" });

    } catch (error) {
        console.error("Error al eliminar el Pokémon:", error);
        res.status(500).json({ error: "Error en el servidor al eliminar el Pokémon" });
    }
});

servidor.get("/", (req, res) => {
    res.send("🚀 ¡La API de Pokédex está funcionando!");
});

servidor.use((error, req, res, next) => {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
});

servidor.use((req, res) => {
    res.status(404).json({ error: "Recurso no encontrado" });
});

servidor.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`);
});





