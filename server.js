import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Obtén la ruta al directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir los archivos estáticos de .output/public
app.use(express.static(path.join(__dirname, '.output/public')));

// Redirigir todas las demás rutas a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.output/public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
