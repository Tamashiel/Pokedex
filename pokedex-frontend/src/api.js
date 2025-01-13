// src/api.js

const API_URL = "http://localhost:4000"; // Asegúrate de que el puerto sea correcto

// Obtener todos los Pokémon
export const obtenerPokemons = async () => {
    try {
        const response = await fetch(`${API_URL}/pokemon`);
    
        if (!response.ok) {
            throw new Error("Error al obtener los Pokémon");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los Pokémon", error);
        throw error;
    }
};

// Crear un nuevo Pokémon
export const crearPokemon = async (pokemon) => {
    try {
        const response = await fetch(`${API_URL}/pokemon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pokemon),
        });

        if (!response.ok) {
            throw new Error("Error al crear el Pokémon");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al crear el Pokémon", error);
        throw error;
    }
};

// Borrar un Pokémon
export const borrarPokemon = async (id) => {
    try {
        const response = await fetch(`${API_URL}/pokemon/borrar/${id}`, {
        method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Error al borrar el Pokémon");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al borrar el Pokémon", error);
        throw error;
    }
};
