import { useState, useRef } from "react";

const CreatePokemonForm = ({ onPokemonCreated }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [posicion, setPosicion] = useState(1);
    const [imagen, setImagen] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (posicion < 1) {
            alert("La posición debe ser un número mayor o igual a 1.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("tipo", tipo);
        formData.append("posicion", parseInt(posicion));
        formData.append("imagen", imagen);

        try {
            const response = await fetch("http://localhost:4000/pokemon", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                if (typeof onPokemonCreated === "function") {
                    onPokemonCreated();
                }

                setNombre("");
                setTipo("");
                setPosicion(1);
                setImagen(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                alert("Error al crear el Pokémon");
            }
        } catch (error) {
            console.error("Error al crear el Pokémon:", error);
        }
    };

    const handlePosicionChange = (e) => {
        const value = e.target.value;
        if (value === "" || parseInt(value) < 1) {
            setPosicion(1);
        } else {
            setPosicion(parseInt(value));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pokemon-form">
            <h2>Agregar un Pokémon</h2>
            <div className="form-group">
                <label>Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Tipo</label>
                <input
                    type="text"
                    placeholder="Tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Posición</label>
                <input
                    type="number"
                    placeholder="Posición"
                    value={posicion}
                    onChange={handlePosicionChange}
                    min="1"
                    step="1"
                    required
                />
            </div>

            <div className="form-group">
                <label>Imagen</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    ref={fileInputRef}
                    required
                />
            </div>

            <button type="submit" className="btn-submit">Agregar Pokémon</button>
        </form>
    );
};

export default CreatePokemonForm;



