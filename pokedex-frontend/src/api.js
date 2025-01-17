
const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los Pokémon
export const obtenerPokemons = async () => {
    try {
        const response = await fetch(`${API_URL}/pokemon`);
        
        // 🔍 Verificar qué responde el backend
        const text = await response.text();
        console.log("Respuesta del backend:", text);

        if (!response.ok) {
            throw new Error("Error al obtener los Pokémon");
        }

        const data = JSON.parse(text); 
        return data;
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
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

export const editarPokemon = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/pokemon/actualizar/${id}`, {
            method: "PUT",
            body: formData,  // Enviar FormData correctamente
        });

        if (!response.ok) {
            throw new Error("Error al editar el Pokémon");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al editar el Pokémon:", error);
    }
};

