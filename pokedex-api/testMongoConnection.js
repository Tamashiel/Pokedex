import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

(async () => {
    try {
        // Intentar conectar a la base de datos usando la URL de conexión
        const client = await MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true });
        console.log("Conexión exitosa a MongoDB");

        // Opcional: Verificar las bases de datos disponibles
        const databases = await client.db().admin().listDatabases();
        console.log("Bases de datos disponibles:", databases.databases);

        // Cerrar la conexión
        client.close();
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
    }
})();
