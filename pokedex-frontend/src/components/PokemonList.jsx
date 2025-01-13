// src/components/PokemonList.js

import React, { useEffect, useState } from "react";
import { obtenerPokemons, borrarPokemon } from "../api";
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

    const handleDelete = async (id) => {
        try {
            const result = await borrarPokemon(id);
            alert(result.mensaje); // Mostrar mensaje de éxito
            setPokemons(pokemons.filter((pokemon) => pokemon.id !== id)); // Actualizar lista
        } catch (error) {
            alert("Error al eliminar el Pokémon.");
        }
    };

    return (
    <div>
            <h2>Lista de Pokémon</h2>
        <div>
        {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} onDelete={handleDelete} />
        ))}
        </div>
    </div>
    );
};

export default PokemonList;
