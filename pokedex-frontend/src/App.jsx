import { useState } from "react";
import CreatePokemonForm from "./components/CreatePokemonForm";
import PokemonList from "./components/PokemonList";

const App = () => {
    const [actualizar, setActualizar] = useState(false);

    //Alternar el estado para forzar actualización
    const handlePokemonCreated = () => {
        setActualizar((prev) => !prev);  // Cambia el valor para activar useEffect
    };

    return (
        <div className="background-container">
            <div className="content-container">
            <img src="/public/logo.png" alt="logo" className="logo" />
                <CreatePokemonForm onPokemonCreated={handlePokemonCreated} />
                <PokemonList actualizar={actualizar} />
            </div>
        </div>
    );
};

export default App;





