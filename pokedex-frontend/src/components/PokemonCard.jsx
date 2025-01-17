import React, { useState } from "react";

const PokemonCard = ({ pokemon, onDelete, onEdit }) => {
    const [modoEdicion, setModoEdicion] = useState(false);
    const [nombre, setNombre] = useState(pokemon.nombre);
    const [tipo, setTipo] = useState(pokemon.tipo);
    const [posicion, setPosicion] = useState(pokemon.posicion);
    const [nuevaImagen, setNuevaImagen] = useState(null);

    //Función para guardar cambios
    const handleGuardar = () => {
        if (posicion < 1) {
            alert("La posición debe ser un número mayor o igual a 1.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("tipo", tipo);
        formData.append("posicion", posicion);

        if (nuevaImagen) {
            formData.append("imagen", nuevaImagen);
        }

        if (typeof onEdit === "function") {
            onEdit(pokemon.id, formData);
            setModoEdicion(false);
        }
    };

    // Validar la posición para que sea mayor a 0
    const handlePosicionChange = (e) => {
        const value = e.target.value;
        if (value === "" || parseInt(value) < 1) {
            setPosicion(1);
        } else {
            setPosicion(parseInt(value));
        }
    };

    return (
        <div className={`pokemon-card ${modoEdicion ? "edit-mode" : ""}`}>
            {modoEdicion ? (
                <>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="edit-input"
                        placeholder="Nombre del Pokémon"
                    />
                    <input
                        type="text"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="edit-input"
                        placeholder="Tipo"
                    />
                    <input
                        type="number"
                        value={posicion}
                        onChange={handlePosicionChange}
                        min="1"
                        className="edit-input"
                        placeholder="Posición"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNuevaImagen(e.target.files[0])}
                        className="edit-file"
                    />
                    <div className="button-group">
                        <button onClick={handleGuardar} className="btn save-btn">Guardar</button>
                        <button onClick={() => setModoEdicion(false)} className="btn cancel-btn">Cancelar</button>
                    </div>
                </>
            ) : (
                <>
                    <h3>{pokemon.nombre}</h3>

                    {pokemon.imagen && (
                        <img
                            src={`${import.meta.env.VITE_API_URL}${pokemon.imagen}`}  
                            alt={pokemon.nombre}
                            className="pokemon-image"
                        />
                    )}

                    <p><strong>Tipo:</strong> {pokemon.tipo}</p>
                    <p><strong>Posición:</strong> {pokemon.posicion}</p>

                    <div className="button-group">
                        <button onClick={() => setModoEdicion(true)} className="btn edit-btn">Editar</button>
                        <button onClick={() => onDelete(pokemon.id)} className="btn delete-btn">Eliminar</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PokemonCard;












