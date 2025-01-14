import React, { useEffect, useState } from "react";
import { obtenerPokemons, borrarPokemon, editarPokemon } from "../api";
import PokemonCard from "./PokemonCard";

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const data = await obtenerPokemons();
                setPokemons(data);
            } catch (error) {
                console.error("Error al obtener los Pokémon:", error);
            }
        };

        fetchPokemons();
    }, []);

    // ✅ Eliminar Pokémon
    const handleDelete = async (id) => {
        try {
            await borrarPokemon(id);
            setPokemons(pokemons.filter((pokemon) => pokemon.id !== id));
        } catch (error) {
            console.error("Error al eliminar el Pokémon:", error);
        }
    };

    // ✅ Editar Pokémon incluyendo la imagen
    const handleEdit = async (id, formData) => {
        try {
            await editarPokemon(id, formData);  // Enviamos FormData directamente
            const updatedPokemons = await obtenerPokemons();  // Recargamos la lista
            setPokemons(updatedPokemons);
        } catch (error) {
            console.error("Error al editar el Pokémon:", error);
        }
    };


    return (
        <div>
            <h2>Lista de Pokémon</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {pokemons.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onDelete={handleDelete}
                        onEdit={handleEdit}  
                    />
                ))}
            </div>
        </div>
    );
};

export default PokemonList;










