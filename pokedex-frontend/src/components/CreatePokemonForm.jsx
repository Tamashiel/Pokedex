import { useState } from "react";

const CreatePokemonForm = ({ onPokemonCreated }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [posicion, setPosicion] = useState("");
    const [imagen, setImagen] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/pokemon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipo, posicion: Number(posicion), imagen }),
            });

        if (response.ok) {
            const newPokemon = await response.json();
            onPokemonCreated(newPokemon);
            setNombre("");
            setTipo("");
            setPosicion("");
            setImagen(""); //Limpiar el campo de la imagen.
        } else {
            alert("Error al crear el Pokémon");
        }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectarse al servidor");
        }
    };

return (
    <form onSubmit={handleSubmit}>
        <h2>Agregar un Pokémon</h2>
        <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
        />
        </div>
        <div>
            <label htmlFor="tipo">Tipo:</label>
            <input
                id="tipo"
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
        />
        </div>
        <div>
            <label htmlFor="posicion">Posición:</label>
            <input
            id="posicion"
            type="number"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            required
        />
        </div>
        <div>
            <label htmlFor="imagen">URL de la imagen:</label>
            <input
                id="imagen"
                type="text"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://example.con/example.jpg"
            />
        </div>
        <button type="submit">Agregar Pokémon</button>
    </form>
    );
};

export default CreatePokemonForm;
