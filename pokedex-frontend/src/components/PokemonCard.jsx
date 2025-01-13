// src/components/PokemonCard.js

import React from "react";

const PokemonCard = ({ pokemon, onDelete }) => {
    return (
        <div className="pokemon-card">
            <h3>{pokemon.nombre}</h3>
            <p>Tipo: {pokemon.tipo}</p>
            <button onClick={() => onDelete(pokemon.id)}>Eliminar</button>
        </div>
    );
};

export default PokemonCard;
