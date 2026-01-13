// Importo Express, que sirve para crear el servidor y las rutas HTTP
const express = require("express");

// Importo CORS para permitir que el frontend pueda comunicarse con este backend
const cors = require("cors");

// Importo Pool desde pg, que sirve para manejar conexiones a PostgreSQL
const { Pool } = require("pg");

// Creo la aplicación de Express
const app = express();

// Habilito CORS para aceptar peticiones desde otros dominios (ej: frontend)
app.use(cors());

// Permito que Express pueda leer JSON en el body de las peticiones (POST, PUT)
app.use(express.json());

// Creo la conexión a la base de datos PostgreSQL
const pool = new Pool({
  host: "db",           // Nombre del servicio de la base de datos (en Docker)
  user: "postgres",     // Usuario de PostgreSQL
  password: "postgres", // Contraseña de PostgreSQL
  database: "tienda",   // Nombre de la base de datos
  port: 5432,           // Puerto por defecto de PostgreSQL
});

// Creo la tabla y datos de prueba si no existen
pool.query(`
  -- Creo la tabla products si todavía no existe
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, -- ID autoincrementable
    name TEXT,             -- Nombre del producto
    price NUMERIC          -- Precio del producto
  );

  -- Inserto productos de prueba si no existen conflictos
  INSERT INTO products (name, price)
  VALUES ('Laptop', 800), ('Mouse', 20)
  ON CONFLICT DO NOTHING;
`);

// Ruta GET para obtener todos los productos
app.get("/products", async (req, res) => {
  // Consulto todos los productos de la base de datos
  const result = await pool.query("SELECT * FROM products");

  // Devuelvo los productos en formato JSON
  res.json(result.rows);
});

// Ruta POST para crear un nuevo producto
app.post("/products", async (req, res) => {
  // Extraigo name y price del body enviado por el frontend
  const { name, price } = req.body;

  // Inserto el nuevo producto en la base de datos
  await pool.query(
    "INSERT INTO products (name, price) VALUES ($1, $2)",
    [name, price] // Evita inyección SQL
  );

  // Respondo con un mensaje de confirmación
  res.json({ message: "Producto creado" });
});

// Inicio el servidor en el puerto 3001
app.listen(3001, () => {
  console.log("Backend en puerto 3001");
});
