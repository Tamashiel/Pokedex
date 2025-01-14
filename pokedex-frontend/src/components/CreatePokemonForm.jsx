import { useState } from "react";

const CreatePokemonForm = ({ onPokemonCreated }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [posicion, setPosicion] = useState("");
    const [imagen, setImagen] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                // ✅ Llama a la función para actualizar la lista
                if (typeof onPokemonCreated === "function") {
                    onPokemonCreated();
                }

                // Limpiar el formulario
                setNombre("");
                setTipo("");
                setPosicion("");
                setImagen(null);
            } else {
                alert("Error al crear el Pokémon");
            }
        } catch (error) {
            console.error("Error al crear el Pokémon:", error);
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
                    onChange={(e) => setPosicion(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Imagen</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                    required
                />
            </div>

            <button type="submit" className="btn-submit">Agregar Pokémon</button>
        </form>
    );
};

export default CreatePokemonForm;













