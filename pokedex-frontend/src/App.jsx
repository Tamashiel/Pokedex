import { useState } from "react";
import CreatePokemonForm from "./components/CreatePokemonForm";

const App = () => {
  const [pokemons, setPokemons] = useState([]);

  const handlePokemonCreated = (newPokemon) => {
    setPokemons([...pokemons, newPokemon]);
  };

  return (
    <div>
      <h1>Mi Pokédex</h1>
      <CreatePokemonForm onPokemonCreated={handlePokemonCreated} />
      <div>
        {pokemons.map((pokemon) => (
          <div key={pokemon.id}>
            <h3>{pokemon.nombre}</h3>
            <p>Tipo: {pokemon.tipo}</p>
            <p>Posición: {pokemon.posicion}</p>
            {pokemon.imagen && <img src={pokemon.imagen} alt={pokemon.nombre} style={{ maxWidth: "200px" }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;



