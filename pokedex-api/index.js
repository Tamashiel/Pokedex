import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import { leerPokemon, crearPokemon, borrarPokemon, editarPokemon } from "./db.js";

const servidor = express();

// 🌐 Permitir solicitudes desde distintos dominios
servidor.use(cors());
servidor.use(express.json());

// 📂 Servir archivos estáticos (para acceder a las imágenes desde el navegador)
servidor.use("/uploads", express.static("public/uploads"));

// 📸 Configurar Multer para manejar imágenes
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, nombreUnico + path.extname(file.originalname));
    }
});

// ✅ Validar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

// ✅ Configuración única de Multer
const upload = multer({ storage: almacenamiento, fileFilter });

// 📥 Ruta para crear Pokémon con imagen
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
        console.error("❌ Error al crear el Pokémon:", error);
        res.status(500).json({ error: "Error en el servidor al crear el Pokémon." });
    }
});

// ✏️ Ruta para actualizar Pokémon (incluye actualización de imagen)
servidor.put("/pokemon/actualizar/:id([0-9a-f]{24})", upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, posicion } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Solo actualizar campos que fueron proporcionados
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
        console.error("❌ Error al actualizar el Pokémon:", error);
        res.status(500).json({ error: "Error al actualizar el Pokémon" });
    }
});

// 📖 Ruta para leer los Pokémon
servidor.get("/pokemon", async (req, res) => {
    try {
        const pokemons = await leerPokemon();
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al obtener los Pokémon" });
    }
});

// ❌ Ruta para eliminar Pokémon
servidor.delete("/pokemon/borrar/:id([0-9a-f]{24})", async (req, res) => {
    try {
        const { id } = req.params;
        const cantidad = await borrarPokemon(id);
        res.json({ resultado: cantidad ? "ok" : "ko" });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al eliminar el Pokémon" });
    }
});

// ⚠️ Middleware para manejar errores
servidor.use((error, req, res, next) => {
    console.error("❌ Error:", error.message);
    res.status(400).json({ error: error.message });
});

// ⚠️ Middleware para manejar recursos no encontrados
servidor.use((req, res) => {
    res.status(404).json({ error: "Recurso no encontrado" });
});

// 🚀 Iniciar el servidor
servidor.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`);
});


