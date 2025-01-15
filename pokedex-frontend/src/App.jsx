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
                <header className="header">
                    <h1 className="main-title">Mi Pokédex</h1>
                </header>

                <section className="form-section">
                    {/*Pasamos la función correctamente */}
                    <CreatePokemonForm onPokemonCreated={handlePokemonCreated} />
                </section>

                <section className="list-section">
                    {/*Pasamos el valor al listado */}
                    <PokemonList actualizar={actualizar} />
                </section>
            </div>
        </div>
    );
};

export default App;










